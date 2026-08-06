// Géométrie de la planche cadastrale.
// Le contour est fixe, les divisions sont calculées : l'aire de chaque parcelle
// vaut sa durée en mois. La parcelle du SIF grossit donc d'elle-même tant que la
// mission dure, et corriger une date suffit à redessiner le plan.
// Exécuté au build uniquement : la page ne reçoit que du SVG.

export const HEX = [
  [60, 34],
  [541, 62],
  [572, 296],
  [498, 470],
  [118, 492],
  [28, 258],
];

// `mois` : durées pleines, dates données par Lionel le 06/08/2026. Elles priment
//          sur .unwanted/parcours.md et .unwanted/new-cv-content.md, qui
//          divergeaient de deux mois sur Cartier et GSK.
// `op`   : Cartier et GSK partagent le rôle « données » et sont mitoyennes ;
//          deux densités d'aplat les séparent, comme sur un vrai plan.
//
// Intervalles semi-ouverts [début, fin) : deux missions qui se suivent partagent
// un mois de bascule, et le compter des deux côtés gonflait le total d'autant.
// Juillet 2021 → août 2026 fait 62 mois, et c'est ce que la somme donne.
//   bici  [07/2021, 12/2021)   stage, puis Phô Resto & 3 applications métier
//   merc  [12/2021, 09/2022)   Mercedes-Benz
//   cart  [09/2022, 03/2023)   Cartier
//   gsk   [03/2023, 01/2024)   GSK
//   sif   [01/2024, 09/2026)   SIF & portail SIGFU
export const MISSIONS = [
  { id: 'bici', mois: 5, role: 'lv', op: '.30' },
  { id: 'merc', mois: 9, role: 'yw', op: '.32' },
  { id: 'cart', mois: 6, role: 'tl', op: '.20' },
  { id: 'gsk', mois: 10, role: 'tl', op: '.34' },
  { id: 'sif', mois: 32, role: 'or', op: '.32' },
  { id: 'free', mois: 12, role: 'tx', op: '.045' },
];

export function polyArea(P) {
  let a = 0;
  for (let i = 0, n = P.length; i < n; i++) {
    const [x1, y1] = P[i],
      [x2, y2] = P[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

// Sutherland–Hodgman : ne garde que le demi-plan nx*x + ny*y <= d
function clipHalf(P, nx, ny, d) {
  const out = [],
    n = P.length;
  for (let i = 0; i < n; i++) {
    const A = P[i],
      B = P[(i + 1) % n];
    const da = nx * A[0] + ny * A[1] - d,
      db = nx * B[0] + ny * B[1] - d;
    if (da <= 0) out.push(A);
    if ((da < 0 && db > 0) || (da > 0 && db < 0)) {
      const t = da / (da - db);
      out.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]);
    }
  }
  return out;
}

// Coupe P en deux, la première part valant `frac` de l'aire. Dichotomie sur la
// position de la droite : c'est ce qui rend la répartition exacte au lieu
// d'approchée à l'œil.
function splitPoly(P, nx, ny, frac) {
  const target = polyArea(P) * frac;
  let lo = -4000,
    hi = 4000;
  for (let i = 0; i < 64; i++) {
    const m = (lo + hi) / 2;
    if (polyArea(clipHalf(P, nx, ny, m)) < target) lo = m;
    else hi = m;
  }
  const d = (lo + hi) / 2;
  return [clipHalf(P, nx, ny, d), clipHalf(P, -nx, -ny, -d)];
}

function centroid(P) {
  let a = 0,
    cx = 0,
    cy = 0;
  for (let i = 0, n = P.length; i < n; i++) {
    const [x1, y1] = P[i],
      [x2, y2] = P[(i + 1) % n],
      f = x1 * y2 - x2 * y1;
    a += f;
    cx += (x1 + x2) * f;
    cy += (y1 + y2) * f;
  }
  a /= 2;
  return [cx / (6 * a), cy / (6 * a)];
}

// Longueur de la corde du polygone en v : `along` vaut 0 pour une corde
// verticale (hauteur disponible), 1 pour une corde horizontale (largeur).
function extent(P, v, along) {
  const a = along,
    b = 1 - along;
  let lo = Infinity,
    hi = -Infinity;
  for (let i = 0, n = P.length; i < n; i++) {
    const A = P[i],
      B = P[(i + 1) % n];
    if ((A[a] <= v && B[a] >= v) || (B[a] <= v && A[a] >= v)) {
      const t = A[a] === B[a] ? 0 : (v - A[a]) / (B[a] - A[a]);
      const c = A[b] + t * (B[b] - A[b]);
      lo = Math.min(lo, c);
      hi = Math.max(hi, c);
    }
  }
  return hi > lo ? hi - lo : 0;
}

// Le libellé s'ajuste à sa parcelle, mesuré au centre de gravité et non sur la
// boîte englobante : sur une parcelle en biais la boîte promet une hauteur que
// le polygone n'a pas, et le sous-titre passe par-dessus le trait de division.
const CW = 0.62; // largeur d'un caractère, en fraction du corps
export function fitLabel(P, cx, cy, nom, sub) {
  const bw = extent(P, cy, 1) * 0.88;
  const bh = extent(P, cx, 0);
  const size = (t) => bw / (t.length * CW);
  // Le plancher à 6,4 px prime sur la largeur : sous ce corps le libellé n'est
  // plus lisible, alors on préfère déborder un peu que rendre illisible. Aucune
  // parcelle actuelle n'y touche : toutes butent sur le plafond.
  const fs = Math.max(6.4, Math.min(11.5, size(nom)));
  const ss = Math.max(5.2, Math.min(fs * 0.79, size(sub)));
  return { fs, ss, tight: bh < fs * 3.6 }; // trop plat pour deux lignes
}

export function buildPlate() {
  const w = (id) => MISSIONS.find((m) => m.id === id).mois;

  // Deux colonnes. À gauche les quatre missions courtes, empilées dans l'ordre
  // chronologique ; à droite le SIF puis la parcelle libre. Les normales sont
  // franchement inclinées et toutes différentes : sans ça on obtient un
  // treemap, pas un plan cadastral.
  const colL = w('bici') + w('merc') + w('cart') + w('gsk');
  const colR = w('sif') + w('free');

  const [L, R] = splitPoly(HEX, 1, 0.11, colL / (colL + colR));
  const [bici, r1] = splitPoly(L, 0.13, 1, w('bici') / colL);
  const [merc, r2] = splitPoly(r1, -0.1, 1, w('merc') / (colL - w('bici')));
  const [cart, gsk] = splitPoly(r2, 0.07, 1, w('cart') / (w('cart') + w('gsk')));
  const [sif, free] = splitPoly(R, -0.12, 1, w('sif') / colR);

  const shapes = { bici, merc, cart, gsk, sif, free };
  return MISSIONS.map((m) => {
    const poly = shapes[m.id];
    const [cx, cy] = centroid(poly);
    return { ...m, poly, cx, cy };
  });
}
