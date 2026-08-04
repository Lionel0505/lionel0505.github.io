/**
 * Rend le jeu d'icônes du site.
 *
 *   pnpm run icons
 *
 * Le dessin : une tuile papier pleine, un « L » encre en Bricolage ExtraBold,
 * un filet orange en pied, le même filet que la barre de progression #chain
 * en haut des pages. Trois raisons de ce parti plutôt qu'un monogramme « LR » :
 * deux lettres dans 16 px deviennent une tache ; une tuile sombre se fond dans
 * un onglet sombre alors qu'un favicon ne peut pas s'inverser selon le thème ;
 * et le fond papier détache la marque aussi bien sur onglet clair que sombre.
 *
 * Il n'y a pas de master SVG. Une `@font-face` déclarée dans le document hôte
 * ne traverse pas un SVG chargé en `data:` URI : le « L » y retomberait sur
 * une police de substitution, ce qui s'est vu au premier essai. La tuile est
 * donc dessinée en HTML/CSS, où Bricolage est réellement appliqué, et
 * Chromium rasterise. Pas de dépendance de rendu d'image ajoutée au projet :
 * Playwright est déjà là pour les tests.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');

const PAPER = '#f4eee0';
const INK = '#1c2318';
const OR = '#c84e0a';

/**
 * `lettre` : hauteur du « L » en fraction du côté. `filet` : hauteur du filet.
 *
 * Pas d'icône 192, 512 ni maskable : ce site n'a pas de manifeste, donc rien
 * ne les référencerait. Le jour où il en gagne un, les rajouter ici ; la
 * maskable devra rétrécir sa lettre aux 80 % centraux (zone sûre d'Android)
 * tout en gardant la tuile à fond perdu.
 */
const TARGETS = [
  { file: 'favicon-16.png', size: 16, lettre: 0.72, filet: 0.16 },
  { file: 'favicon-32.png', size: 32, lettre: 0.72, filet: 0.16 },
  { file: 'favicon-48.png', size: 48, lettre: 0.72, filet: 0.16 },
  // iOS arrondit les coins : la lettre s'écarte un peu plus des bords.
  { file: 'apple-touch-icon.png', size: 180, lettre: 0.62, filet: 0.14 },
];

/** Le .ico embarque trois PNG : licite depuis Vista, lu par tous les navigateurs. */
const ICO_SIZES = [16, 32, 48];

function page(font, { size, lettre, filet }) {
  return `<!doctype html><meta charset="utf-8"><style>
    @font-face{font-family:Bricolage;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:100 900}
    html,body{margin:0;padding:0;width:${size}px;height:${size}px}
    .tuile{position:relative;width:${size}px;height:${size}px;background:${PAPER};overflow:hidden}
    .l{position:absolute;inset:0;display:grid;place-items:center;
       /* Remontée optique : le filet pèse en bas, la lettre doit s'en écarter. */
       padding-bottom:${(filet * 1.6 * 100).toFixed(2)}%;
       font-family:Bricolage;font-weight:800;font-size:${(lettre * size).toFixed(2)}px;
       line-height:1;color:${INK}}
    .filet{position:absolute;left:0;right:0;bottom:0;height:${(filet * 100).toFixed(2)}%;background:${OR}}
  </style><div class="tuile"><div class="l">L</div><div class="filet"></div></div>`;
}

function ico(entries) {
  const head = Buffer.alloc(6);
  head.writeUInt16LE(1, 2); // type : icône
  head.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 vaut 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt16LE(1, 4); // plans
    e.writeUInt16LE(32, 6); // bits par pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    dir.push(e);
    offset += png.length;
  }
  return Buffer.concat([head, ...dir, ...entries.map((e) => e.png)]);
}

const font = (await readFile(join(PUBLIC, 'fonts', 'Bricolage.woff2'))).toString('base64');
const browser = await chromium.launch();
const rendered = new Map();

for (const target of TARGETS) {
  const p = await browser.newPage({
    viewport: { width: target.size, height: target.size },
    deviceScaleFactor: 1,
  });
  await p.setContent(page(font, target));
  await p.evaluate(() => document.fonts.ready);
  const png = await p.screenshot();
  await p.close();
  await writeFile(join(PUBLIC, target.file), png);
  rendered.set(target.size, png);
  console.log(`ok   ${target.file.padEnd(24)} ${String(target.size).padStart(3)}px`);
}

await writeFile(
  join(PUBLIC, 'favicon.ico'),
  ico(ICO_SIZES.map((size) => ({ size, png: rendered.get(size) }))),
);
console.log(`ok   ${'favicon.ico'.padEnd(24)} ${ICO_SIZES.join(' + ')}px`);

await browser.close();
