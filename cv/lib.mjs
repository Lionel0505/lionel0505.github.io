// Socle commun aux gabarits : échappement, polices du portfolio, rythme vertical.
// Rythme repris de loom (src/pdf/rythme.mjs) : cinq niveaux de blanc, aucune autre
// longueur verticale dans un gabarit.
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Contacts cliquables : un recruteur ne recopie pas une adresse. */
export const mail = (v) => `<a href="mailto:${esc(v)}">${esc(v)}</a>`;
// Le numéro reste du texte : un lien tel: écrit l'adresse en clair dans le PDF, et
// scripts/content-check.mjs refuse tout numéro en clair dans un fichier servi.
export const tel = (v) => esc(v);
export const web = (v) => (/\s/.test(v) ? esc(v) : `<a href="https://${esc(v)}">${esc(v)}</a>`);

export const fonts = `
@font-face { font-family: "Archivo"; src: url("../../public/fonts/Archivo.woff2") format("woff2"); font-weight: 100 900; font-stretch: 62% 125%; }
@font-face { font-family: "Bricolage Grotesque"; src: url("../../public/fonts/Bricolage.woff2") format("woff2"); font-weight: 200 800; font-stretch: 75% 100%; }
@font-face { font-family: "JetBrains Mono"; src: url("../../public/fonts/JetBrainsMono.woff2") format("woff2"); font-weight: 100 800; }
`;

export const base = `
${fonts}
:root { --S: 4pt; --I: 8pt; --E: 12pt; --N: 20pt; --X: 32pt; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-kerning: normal; text-rendering: geometricPrecision; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
.keep, li, dl > div, .kv { break-inside: avoid; }
/* Marges de page portées par un conteneur répété à chaque page : avec @page { margin: 0 },
   le fond de html couvre toute la feuille, marges comprises. */
.sheet { box-decoration-break: clone; -webkit-box-decoration-break: clone; }
h3, .org, .ctx, .period { break-after: avoid; }
h1, h2, h3, h4 { break-after: avoid; font-weight: inherit; }
`;

export const doc = (title, css, body) =>
  `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title><style>${base}${css}</style></head><body><div class="sheet">${body}</div></body></html>`;
