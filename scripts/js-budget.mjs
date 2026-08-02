// Mesure du budget JavaScript. Tout le JS du site est inséré dans le HTML
// par Astro : `dist/` ne contient aucun fichier .js, donc un budget mesuré
// sur des fichiers serait vert par construction et ne mesurerait rien.
// On extrait donc le corps de chaque <script> de chaque page, on le
// concatène, et on gzippe le résultat. Le budget se juge par page, puisque
// c'est ce qu'un visiteur télécharge en une visite.
import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BUDGET = 6 * 1024;

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

// Les scripts sans corps (import externe, JSON-LD, type autre que module ou
// vide) ne comptent pas : le premier n'existe pas ici, les autres ne sont
// pas du JavaScript exécuté.
const bodies = (html) =>
  [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => !/type=["'](?!module|text\/javascript)/.test(attrs))
    .map(([, , body]) => body);

let worst = 0;
let fail = false;
for (const page of walk('dist')) {
  const js = bodies(readFileSync(page, 'utf8')).join('\n');
  const size = js ? gzipSync(js, { level: 9 }).length : 0;
  worst = Math.max(worst, size);
  const over = size > BUDGET;
  fail ||= over;
  console.log(
    `${over ? 'DEPASSE' : 'ok     '} ${String(size).padStart(5)} o gzip  ${page.replace(/\\/g, '/')}`,
  );
}
console.log(`\npire page : ${worst} o gzip sur un budget de ${BUDGET} o`);
process.exit(fail ? 1 : 0);
