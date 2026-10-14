// Gabarits du CV. Un export = un document rendu par scripts/cv.mjs.
// `ats` est la version pour les formulaires : une colonne, vrais titres, aucun
// tableau, aucun espacement de lettres (l'extraction lisait « P R O F I L »).
// Les autres sont les variantes design, à l'identité du portfolio (tokens.css).
import { doc, esc, mail, tel, web } from './lib.mjs';

const K = {
  bg: '#f4eee0',
  bg2: '#ede4cc',
  bg3: '#e6dbc0',
  tx: '#1c2318',
  tx2: '#685f52',
  bd: '#cfc5a8',
  or: '#c84e0a',
  orT: '#a64108',
  tl: '#1a9e93',
  yw: '#d4a800',
  lv: '#7b6ec8',
  inv: '#1c2318',
  invTx: '#f4eee0',
  invTx2: '#9e9880',
  invBd: '#3a4736',
  orInv: '#e8621a',
};
// Une couleur par nature de mission, comme la légende de la planche du portfolio :
// en cours, données, production web, reprise d'existant.
const ROLE = [K.or, K.tl, K.yw, K.lv];

const bullet = ([lead, text]) =>
  lead ? `<strong>${esc(lead)} :</strong> ${esc(text)}` : esc(text);
const contacts = (c) => [
  esc(c.city),
  ...c.phones.map(tel),
  mail(c.email),
  web(c.linkedin),
  web(c.site),
];

/* ───────────────────────────── ATS ───────────────────────────── */
export function ats(c) {
  const css = `
  @page { size: A4; margin: 13mm 16mm 12mm; }
  body { font: 400 9pt/1.38 "Archivo", sans-serif; color: ${K.tx}; background: #fff; }
  h1 { font: 800 21pt/1 "Bricolage Grotesque", sans-serif; }
  .title { font-weight: 600; font-size: 10.5pt; margin-top: var(--I); }
  .contact { margin-top: var(--S); color: ${K.tx2}; }
  .contact a { color: ${K.tx}; }
  h2 { font: 700 10pt/1.1 "Archivo", sans-serif; margin: var(--E) 0 var(--I); padding-bottom: var(--S);
       border-bottom: 0.6pt solid ${K.bd}; position: relative; }
  h2::after { content: ""; position: absolute; left: 0; bottom: -0.8pt; width: 22pt; height: 1.6pt; background: ${K.or}; }
  h3 { font-weight: 700; font-size: 9.6pt; margin-top: var(--I); }
  .meta { color: ${K.tx2}; }
  p + p { margin-top: var(--S); }
  li { padding-left: 10pt; position: relative; margin-top: 2pt; }
  li::before { content: "•"; position: absolute; left: 0; color: ${K.or}; }
  `;
  const body = `
  <header>
    <h1>${esc(c.last)} ${esc(c.first)}</h1>
    <p class="title">${esc(c.title)}</p>
    <p class="contact">${contacts(c).slice(0, 4).join(' · ')}</p>
    <p class="contact">${[web(c.linkedin), web(c.site), esc(c.mobility)].join(' · ')}</p>
  </header>
  <h2>PROFIL</h2>${c.profile.map((p) => `<p>${esc(p)}</p>`).join('')}
  <h2>${esc(c.highlightsTitle.toUpperCase())}</h2><ul>${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
  <h2>${esc(c.techTitle.toUpperCase())}</h2>${c.tech.map(([k, v]) => `<p><strong>${esc(k)} :</strong> ${esc(v)}</p>`).join('')}
  <h2>${esc(c.softTitle.toUpperCase())}</h2><ul>${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  <h2>EXPÉRIENCE PROFESSIONNELLE</h2>
  ${c.jobs
    .map(
      (
        j,
      ) => `<div class="job"><h3>${esc(j.title)}</h3><p class="meta">${esc(j.org)} · ${esc(j.period)}</p>
      ${j.context ? `<p>${esc(j.context)}</p>` : ''}<ul>${j.bullets.map((b) => `<li>${bullet(b)}</li>`).join('')}</ul></div>`,
    )
    .join('')}
  <h2>FORMATION</h2>
  ${c.education
    .map(
      (e) =>
        `<div class="job"><h3>${esc(e.title)}</h3><p class="meta">${esc(e.org)} · ${esc(e.period)}</p><ul><li>${esc(e.note)}</li></ul></div>`,
    )
    .join('')}
  <h2>LANGUES</h2><p>${c.languages.map(([l, n]) => `<strong>${esc(l)} :</strong> ${esc(n)}`).join(' · ')}</p>
  `;
  return doc(`CV ${c.short}`, css, body);
}

/* ─────────────────── Variante retenue · PLANCHE (2026-10-14) ───────────────────
   La page est une planche de géomètre : papier millimétré, cadre, cartouche
   d'identité, une couleur de parcelle par mission. Deux colonnes. */
export function planche(c) {
  const css = `
  @page { size: A4; margin: 0; }
  html { background: ${K.bg}; }
  .sheet { padding: 15mm 14mm 13mm; }
  body { font: 400 8.6pt/1.45 "Archivo", sans-serif; color: ${K.tx}; }
  .paper { position: fixed; inset: 0; z-index: -1;
    background-image: linear-gradient(${K.bg3} 0.35pt, transparent 0.35pt), linear-gradient(90deg, ${K.bg3} 0.35pt, transparent 0.35pt);
    background-size: 5mm 5mm; background-position: 2mm 2mm; }
  .paper::after { content: ""; position: absolute; inset: 7mm; border: 0.8pt solid ${K.tx}; }
  .mono { font-family: "JetBrains Mono", monospace; font-size: 6.4pt; text-transform: uppercase; letter-spacing: .08em; color: ${K.tx2}; }
  header { display: grid; grid-template-columns: 1fr 70mm; gap: 8mm; align-items: end; }
  h1 { font: 800 36pt/.92 "Bricolage Grotesque", sans-serif; letter-spacing: -.02em; }
  h1 i { font-style: normal; color: ${K.or}; }
  h1 small { display: block; font: 400 13pt/1.1 "Bricolage Grotesque", sans-serif; letter-spacing: 0; color: ${K.tx2}; margin-top: var(--I); }
  .title { margin-top: var(--E); color: ${K.orT}; font-size: 6.8pt; }
  .cart { border: 1pt solid ${K.tx}; display: grid; grid-template-columns: 1fr 1fr; background: ${K.bg}; }
  .cart > div { padding: 5pt 6pt; border-top: 0.6pt solid ${K.tx}; }
  .cart > div:nth-child(odd) { border-right: 0.6pt solid ${K.tx}; }
  .cart > .head { grid-column: 1 / -1; border-top: 0; border-right: 0 !important; background: ${K.tx}; color: ${K.bg}; display: flex; justify-content: space-between; }
  .cart > .head .mono { color: ${K.bg}; }
  .cart .wide { grid-column: 1 / -1; border-right: 0 !important; }
  .cart b { display: block; font-weight: 500; font-size: 7.8pt; margin-top: 2pt; word-break: break-word; }
  .figs { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: var(--N); border: 1pt solid ${K.tx}; background: ${K.bg}; }
  .figs > div { padding: 7pt 8pt; border-left: 0.6pt solid ${K.tx}; }
  .figs > div:first-child { border-left: 0; }
  .figs b { display: block; font: 800 20pt/1 "Bricolage Grotesque", sans-serif; color: ${K.or}; margin-bottom: var(--S); }
  .cols { display: grid; grid-template-columns: 1fr 60mm; gap: 8mm; margin-top: var(--N); }
  h2 { font: 700 12.5pt/1 "Bricolage Grotesque", sans-serif; display: flex; gap: 6pt; align-items: baseline;
       border-bottom: 0.8pt solid ${K.tx}; padding-bottom: var(--S); margin: var(--N) 0 var(--E); }
  h2:first-child { margin-top: 0; }
  h2 .mono { color: ${K.or}; font-size: 6.6pt; }
  .prose p + p { margin-top: var(--I); }
  .job { position: relative; padding-left: 11pt; margin-top: var(--N); }
  .job:first-of-type { margin-top: 0; }
  .job::before { content: ""; position: absolute; left: 0; top: 1pt; bottom: 0; width: 3.5pt; background: var(--c); opacity: .85; }
  .job h3 { font: 700 10.6pt/1.15 "Bricolage Grotesque", sans-serif; }
  .job .org { color: ${K.tx2}; margin-top: 2pt; }
  .job .ctx { margin-top: var(--S); font-style: italic; color: ${K.tx2}; }
  .job li, .side li { margin-top: var(--S); padding-left: 9pt; position: relative; }
  .job li::before { content: ""; position: absolute; left: 0; top: 3.2pt; width: 4pt; height: 4pt; background: var(--c); }
  .side dt { margin-top: var(--E); }
  .side dt:first-child { margin-top: 0; }
  .side dd { margin-top: 2pt; }
  .side li::before { content: "+"; position: absolute; left: 0; color: ${K.or}; font-weight: 700; }
  .edu { margin-top: var(--E); break-inside: avoid; }
  .edu b { display: block; font: 700 9pt/1.2 "Bricolage Grotesque", sans-serif; }
  `;
  const body = `<div class="paper"></div>
  <header>
    <div>
      <h1>${esc(c.last)}<i>.</i><small>${esc(c.first)}</small></h1>
      <p class="mono title">${esc(c.title)}</p>
    </div>
    <div class="cart">
      <div class="head"><span class="mono">Cartouche · identité</span><span class="mono">Pl. 01</span></div>
      <div><span class="mono">Lieu</span><b>${esc(c.city)}</b></div>
      <div><span class="mono">Téléphones</span><b>${c.phones.map(tel).join('<br>')}</b></div>
      <div class="wide"><span class="mono">Courriel</span><b>${mail(c.email)}</b></div>
      <div class="wide"><span class="mono">LinkedIn · Portfolio</span><b>${web(c.linkedin)}<br>${web(c.site)}</b></div>
      <div class="wide"><span class="mono">Mobilité</span><b>${esc(c.mobility)}</b></div>
    </div>
  </header>
  <div class="figs">${c.figures.map(([v, l]) => `<div><b>${esc(v)}</b><span class="mono">${esc(l)}</span></div>`).join('')}</div>
  <div class="cols">
    <main>
      <h2><span class="mono">01</span>Profil</h2>
      <div class="prose">${c.profile.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <h2><span class="mono">02</span>Expérience</h2>
      ${c.jobs
        .map(
          (j, i) => `<div class="job" style="--c:${ROLE[i]}">
        <p class="mono">${esc(j.period)}</p><h3>${esc(j.title)}</h3><p class="org">${esc(j.org)}</p>
        ${j.context ? `<p class="ctx">${esc(j.context)}</p>` : ''}
        <ul>${j.bullets.map((b) => `<li>${bullet(b)}</li>`).join('')}</ul></div>`,
        )
        .join('')}
    </main>
    <aside class="side">
      <h2><span class="mono">03</span>${esc(c.highlightsTitle)}</h2>
      <ul>${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
      <h2><span class="mono">04</span>Technique</h2>
      <dl>${c.tech.map(([k, v]) => `<dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
      <h2><span class="mono">05</span>Fonctionnel</h2>
      <ul>${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h2><span class="mono">06</span>Formation</h2>
      ${c.education.map((e) => `<div class="edu"><span class="mono">${esc(e.period)}</span><b>${esc(e.title)}</b><p>${esc(e.org)}</p><p class="ctx">${esc(e.note)}</p></div>`).join('')}
      <h2><span class="mono">07</span>Langues</h2>
      <dl>${c.languages.map(([l, n]) => `<dt class="mono">${esc(l)}</dt><dd>${esc(n)}</dd>`).join('')}</dl>
    </aside>
  </div>`;
  return doc(`${c.short} · CV`, css, body);
}
