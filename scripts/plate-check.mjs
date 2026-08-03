import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HEX, MISSIONS, buildPlate, polyArea } from '../src/lib/plate.mjs';

const total = MISSIONS.reduce((n, m) => n + m.mois, 0);
const hex = polyArea(HEX);
let covered = 0;

for (const parcel of buildPlate()) {
  const m = MISSIONS.find((x) => x.id === parcel.id);
  const got = polyArea(parcel.poly) / hex;
  const want = m.mois / total;
  assert.ok(
    Math.abs(got - want) < 0.005,
    `${parcel.id} occupe ${(got * 100).toFixed(2)} % de la planche, attendu ${(want * 100).toFixed(2)} %`,
  );
  covered += got;
}

assert.ok(
  Math.abs(covered - 1) < 0.005,
  `les parcelles couvrent ${(covered * 100).toFixed(2)} % de la planche, attendu 100 %`,
);

console.log(`planche : ${MISSIONS.length} parcelles, aires conformes aux durées`);

/* ============================================================
   LA LÉGENDE SUIT LA DONNÉE
   plate.mjs promet qu'« corriger une date suffit à redessiner le plan ». Le
   plan, oui ; pas la légende, qui était écrite à la main dans les deux
   langues. Allonger une mission d'un mois faisait grandir la parcelle,
   laissait les assertions d'aire ci-dessus au vert, et rendait la légende
   fausse sans que rien ne bronche.
   Les chaînes sont relues dans les sources plutôt qu'importées : ce fichier
   est du Node simple et les dictionnaires sont en TypeScript. C'est la même
   méthode que scripts/contrast.mjs, qui relit tokens.css.
   ============================================================ */
const lire = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const extraire = (texte, motif, quoi) => {
  const m = texte.match(motif);
  assert.ok(m, `introuvable dans les sources : ${quoi} (${motif})`);
  return m[1];
};
// Les entiers d'une chaîne de légende, dans l'ordre où elle les écrit.
const nombres = (s) => [...s.matchAll(/\d+/g)].map((m) => Number(m[0]));

// La parcelle libre est de la capacité disponible, pas du temps travaillé :
// elle est comptée à part partout, y compris dans le total de la légende.
const LIBRE = 'free';
const travailles = MISSIONS.filter((m) => m.id !== LIBRE).reduce((n, m) => n + m.mois, 0);
const libres = MISSIONS.find((m) => m.id === LIBRE).mois;
const nbMissions = MISSIONS.filter((m) => m.id !== LIBRE).length;

const dicos = [
  ['fr', lire('../src/i18n/fr.ts')],
  ['en', lire('../src/i18n/en.ts')],
];

for (const [langue, source] of dicos) {
  // « 58 MOIS TRAVAILLÉS · 12 LIBRES » et son jumeau anglais.
  const total = extraire(source, /total:\s*'([^']*)'/, `plate.total (${langue})`);
  const [moisLus, libresLus] = nombres(total);
  assert.equal(
    moisLus,
    travailles,
    `${langue} : la légende annonce ${moisLus} mois travaillés, MISSIONS en donne ${travailles} (« ${total} »)`,
  );
  assert.equal(
    libresLus,
    libres,
    `${langue} : la légende annonce ${libresLus} mois libres, MISSIONS en donne ${libres} (« ${total} »)`,
  );

  // « AIRE ∝ DURÉE · LEVÉ 2021–2026 » et son jumeau anglais. MISSIONS ne
  // porte pas de dates, mais elle porte la durée : un levé ne peut pas couvrir
  // moins d'années entières que le travail qu'il montre. 58 mois font 4,84
  // années, donc 5 années révolues, et 2026 moins 2021 en fait 5. Passer la
  // barre des 60 mois travaillés rend donc la borne haute fausse.
  const scale = extraire(source, /scale:\s*'([^']*)'/, `plate.scale (${langue})`);
  const [debut, fin] = nombres(scale);
  assert.equal(
    fin - debut,
    Math.ceil(travailles / 12),
    `${langue} : le levé couvre ${fin - debut} années (${debut} à ${fin}), or ${travailles} mois travaillés en demandent ${Math.ceil(travailles / 12)} (« ${scale} »)`,
  );
}

// Le « 5 » du cartouche : les missions réelles, la parcelle libre exclue.
const cartouche = lire('../src/components/Cartouche.astro');
const vu = Number(extraire(cartouche, /cartouche\.missions,\s*v:\s*'(\d+)'/, 'Cartouche.missions'));
assert.equal(
  vu,
  nbMissions,
  `le cartouche annonce ${vu} missions, MISSIONS en donne ${nbMissions} (parcelle libre exclue)`,
);

console.log(
  `légende : ${travailles} mois travaillés, ${libres} libres, ${nbMissions} missions, conformes dans les deux langues et au cartouche`,
);
