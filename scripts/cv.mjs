// Rend le CV : pnpm cv [variante]
// - CV ATS → public/cv/CV_<Nom>.pdf (préfixe CV_ : la version ATS) ;
// - chaque variante design → cv/build/<Nom>_CV-<variante>.pdf (gitignoré, pour choisir) ;
// - avec [variante] : cette variante est aussi publiée en public/cv/<Nom>_CV.pdf
//   (suffixe _CV : la version design).
// Contenu : cv/content.mjs. Forme : cv/templates.mjs (un export par gabarit).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import c from '../cv/content.mjs';
import * as templates from '../cv/templates.mjs';

const pick = process.argv[2];
if (pick && !(pick in templates)) throw new Error(`variante inconnue : ${pick}`);
const build = 'cv/build';
fs.mkdirSync(build, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch());
const page = await browser.newPage();
for (const [name, render] of Object.entries(templates)) {
  const html = path.join(build, `${name}.html`);
  fs.writeFileSync(html, render(c));
  await page.goto(pathToFileURL(path.resolve(html)).href);
  await page.evaluate(() => document.fonts.ready);
  const out =
    name === 'ats' ? `public/cv/CV_${c.file}.pdf` : path.join(build, `${c.file}_CV-${name}.pdf`);
  await page.pdf({
    path: out,
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
    outline: true,
  });
  if (name === pick && name !== 'ats') fs.copyFileSync(out, `public/cv/${c.file}_CV.pdf`);
  console.log(out);
}
await browser.close();
