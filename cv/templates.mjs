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
  .job { break-inside: avoid; }
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

/* ─────────────────── Variante 1 · PLANCHE ───────────────────
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

/* ─────────────────── Variante 2 · NUIT ───────────────────
   Éditorial sombre, une seule colonne de lecture et une marge de dates.
   Le contraste de la section contact du portfolio, étendu à toute la page. */
export function nuit(c) {
  const [first] = c.short.split(' ');
  const css = `
  @page { size: A4; margin: 0; }
  html { background: ${K.inv}; }
  .sheet { padding: 13mm 15mm 11mm; }
  body { font: 400 8.2pt/1.42 "Archivo", sans-serif; color: ${K.invTx}; }
  .mono { font-family: "JetBrains Mono", monospace; font-size: 6.6pt; text-transform: uppercase; letter-spacing: .1em; color: ${K.invTx2}; }
  .kicker { color: ${K.orInv}; }
  h1 { font: 800 42pt/.86 "Bricolage Grotesque", sans-serif; letter-spacing: -.035em; margin-top: var(--E); }
  h1 i { font-style: normal; color: ${K.orInv}; }
  .legal { margin-top: var(--E); }
  .lead { font-size: 10pt; line-height: 1.42; margin-top: var(--N); max-width: 150mm; }
  .lead2 { color: ${K.invTx2}; font-size: 9.4pt; margin-top: var(--I); max-width: 150mm; }
  .contact { display: flex; flex-wrap: wrap; gap: 4pt 14pt; margin-top: var(--N); padding-top: var(--I); border-top: 0.6pt solid ${K.invBd}; }
  .contact a, .contact span { color: ${K.invTx}; }
  .figs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10pt; margin-top: var(--N); }
  .figs b { display: block; font: 800 24pt/1 "Bricolage Grotesque", sans-serif; color: ${K.orInv}; letter-spacing: -.02em; margin-bottom: var(--S); }
  .figs span { color: ${K.invTx2}; font-size: 8pt; }
  .row { display: grid; grid-template-columns: 27mm 1fr; gap: 0 7mm; }
  h2 { margin-top: var(--E); padding-top: var(--I); border-top: 0.6pt solid ${K.invBd}; }
  h2 .mono { color: ${K.orInv}; }
  .job { margin-top: var(--E); }
  .job h3 { font: 700 11.5pt/1.15 "Bricolage Grotesque", sans-serif; }
  .job .org, .job .ctx { color: ${K.invTx2}; margin-top: var(--S); }
  li { margin-top: 2pt; padding-left: 11pt; position: relative; }
  li::before { content: "—"; position: absolute; left: 0; color: ${K.orInv}; }
  strong { font-weight: 600; color: #fff; }
  .kv { margin-top: var(--I); }
  .kv dt { color: ${K.invTx2}; }
  .two { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0 6mm; }
  .cols2 { column-count: 2; column-gap: 6mm; }
  .cols2 li:first-child { margin-top: 0; }
  .edu { margin-top: var(--E); break-inside: avoid; }
  .edu b { display: block; font: 700 9.6pt/1.25 "Bricolage Grotesque", sans-serif; }
  .edu p { color: ${K.invTx2}; }
  `;
  const sec = (label, inner) =>
    `<section><h2 class="mono"><span class="mono">${esc(label)}</span></h2><div class="row">${inner}</div></section>`;
  const body = `
  <p class="mono kicker">${esc(c.title)}</p>
  <h1>${esc(first)}<br>${esc(c.last.charAt(0) + c.last.slice(1).toLowerCase())}<i>.</i></h1>
  <p class="mono legal">${esc(c.last)} ${esc(c.first)}</p>
  <p class="lead">${esc(c.profile[0])}</p>
  <p class="lead2">${esc(c.profile[1])}</p>
  <div class="contact mono">${[...contacts(c), esc(c.mobility)].map((x) => `<span>${x}</span>`).join('')}</div>
  <div class="figs">${c.figures.map(([v, l]) => `<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join('')}</div>
  ${sec(
    'Expérience',
    c.jobs
      .map(
        (j) => `<p class="mono job">${esc(j.period).replace(' - ', '<br>→ ')}</p>
      <div class="job"><h3>${esc(j.title)}</h3><p class="org">${esc(j.org)}</p>${j.context ? `<p class="ctx">${esc(j.context)}</p>` : ''}
      <ul>${j.bullets.map((b) => `<li>${bullet(b)}</li>`).join('')}</ul></div>`,
      )
      .join(''),
  )}
  ${sec(
    'Compétences',
    `<p class="mono job">Technique</p><dl class="job two">${c.tech.map(([k, v]) => `<div class="kv"><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
    <p class="mono job">Fonctionnel</p><ul class="job cols2">${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`,
  )}
  ${sec('En bref', `<span></span><ul class="job cols2">${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`)}
  ${sec(
    'Formation · Langues',
    `<span></span><div class="job two">${c.education.map((e) => `<div class="edu"><span class="mono">${esc(e.period)}</span><b>${esc(e.title)}</b><p>${esc(e.org)}</p><p>${esc(e.note)}</p></div>`).join('')}
    <dl class="edu">${c.languages.map(([l, n]) => `<div class="kv"><dt class="mono">${esc(l)}</dt><dd>${esc(n)}</dd></div>`).join('')}</dl></div>`,
  )}`;
  return doc(`${c.short} · CV`, css, body);
}

/* ─────────────────── Variante 3 · DOSSIER ───────────────────
   Une couverture : le parcours dessiné en planche cadastrale (une parcelle par
   mission, surface à la durée), le nom et les chiffres. Puis le détail en
   deux colonnes de journal. */
export function dossier(c) {
  // Parcelles : polygones dessinés à la main, surfaces proches des durées.
  const parcels = [
    {
      pts: '20,20 250,34 236,262 14,250',
      c: K.or,
      l: ['SIF · SIGFU', "Côte d'Ivoire", '2024 → aujourd’hui'],
    },
    {
      pts: '250,34 386,44 380,190 242,178',
      c: K.tl,
      l: ['Cartier · GSK', 'Données', '2022 – 2024'],
    },
    {
      pts: '242,178 380,190 376,300 236,262',
      c: K.yw,
      l: ['Mercedes-Benz', 'Production web', '2021 – 2022'],
    },
    {
      pts: '14,250 236,262 230,352 10,340',
      c: K.lv,
      l: ['Phô Resto · SPAT', 'Reprise d’existant', '2021'],
    },
    {
      pts: '236,262 376,300 372,440 230,430',
      c: K.bd,
      l: ['Master MBDS', 'Formation', '2022 – 2023'],
    },
    {
      pts: '10,340 230,352 230,430 372,440 368,500 8,490',
      c: 'none',
      l: ['Parcelle libre', 'Votre projet', ''],
    },
  ];
  const centroid = (pts) => {
    const p = pts.split(' ').map((s) => s.split(',').map(Number));
    return [p.reduce((a, [x]) => a + x, 0) / p.length, p.reduce((a, [, y]) => a + y, 0) / p.length];
  };
  const svg = `<svg viewBox="0 0 396 510" class="plate" aria-hidden="true">
    ${parcels
      .map((p) => {
        const [x, y] = centroid(p.pts);
        return `<polygon points="${p.pts}" fill="${p.c}" fill-opacity="${p.c === 'none' ? 0 : 0.32}" stroke="${K.tx}" stroke-width="${p.c === 'none' ? 0.8 : 1.2}" ${p.c === 'none' ? 'stroke-dasharray="4 3"' : ''}/>
        <text x="${x}" y="${y - 6}" class="pl">${esc(p.l[0])}</text><text x="${x}" y="${y + 6}" class="ps">${esc(p.l[1])}</text><text x="${x}" y="${y + 16}" class="ps">${esc(p.l[2])}</text>`;
      })
      .join('')}
    <polygon points="20,20 386,44 368,500 8,490" fill="none" stroke="${K.tx}" stroke-width="2"/>
  </svg>`;
  const css = `
  @page { size: A4; margin: 0; }
  html { background: ${K.bg}; }
  .sheet { padding: 14mm 15mm 12mm; }
  body { font: 400 8.4pt/1.45 "Archivo", sans-serif; color: ${K.tx}; }
  .mono { font-family: "JetBrains Mono", monospace; font-size: 6.4pt; text-transform: uppercase; letter-spacing: .08em; color: ${K.tx2}; }
  .cover { height: 270mm; display: grid; grid-template-columns: 88mm 1fr; gap: 10mm; break-after: page; }
  .left { background: ${K.bg2}; margin: -14mm 0 -12mm -15mm; padding: 14mm 8mm 12mm 15mm; display: flex; flex-direction: column; }
  .plate { width: 100%; margin: var(--E) 0 var(--I); }
  .brief { margin-top: var(--N); font-size: 8.2pt; }
  .plate .pl { font: 700 10px "Bricolage Grotesque", sans-serif; text-anchor: middle; fill: ${K.tx}; }
  .plate .ps { font: 400 7px "JetBrains Mono", monospace; text-anchor: middle; fill: ${K.tx2}; text-transform: uppercase; letter-spacing: .06em; }
  .right { display: flex; flex-direction: column; padding-top: 4mm; }
  h1 { font: 800 44pt/.9 "Bricolage Grotesque", sans-serif; letter-spacing: -.03em; margin-top: var(--E); }
  h1 i { font-style: normal; color: ${K.or}; }
  .first { font: 400 14pt/1.2 "Bricolage Grotesque", sans-serif; color: ${K.tx2}; margin-top: var(--I); }
  .title { font: 600 10.5pt/1.35 "Archivo", sans-serif; margin-top: var(--N); padding-left: 9pt; border-left: 3pt solid ${K.or}; }
  .profile p { margin-top: var(--E); font-size: 9.2pt; line-height: 1.5; }
  .figs { display: grid; grid-template-columns: 1fr 1fr; gap: var(--E); margin-top: var(--X); }
  .figs > div { border-top: 1pt solid ${K.tx}; padding-top: var(--I); }
  .figs b { display: block; font: 800 28pt/1 "Bricolage Grotesque", sans-serif; color: ${K.or}; margin-bottom: var(--S); }
  .contact { display: grid; gap: 2pt; font-size: 7.8pt; }
  .flow { column-count: 2; column-gap: 9mm; column-rule: 0.6pt solid ${K.bd}; }
  h2 { font: 800 15pt/1 "Bricolage Grotesque", sans-serif; column-span: all; margin: var(--N) 0 var(--E); display: flex; gap: 8pt; align-items: center; }
  h2:first-child { margin-top: 0; }
  h2::after { content: ""; flex: 1; height: 1pt; background: ${K.tx}; }
  .job { margin-bottom: var(--N); }
  .job .tag { display: inline-block; width: 18pt; height: 5pt; background: var(--c); margin-bottom: var(--I); }
  .job h3 { font: 700 10.8pt/1.2 "Bricolage Grotesque", sans-serif; }
  .job .org { color: ${K.tx2}; margin-top: var(--S); }
  .job .ctx { margin-top: var(--S); font-style: italic; }
  li { margin-top: var(--S); padding-left: 9pt; position: relative; }
  li::before { content: "■"; position: absolute; left: 0; top: .5pt; font-size: 5pt; color: var(--c, ${K.or}); }
  .kv { break-inside: avoid; margin-bottom: var(--E); }
  .kv dd { margin-top: 2pt; }
  `;
  const body = `
  <div class="cover">
    <div class="left">
      <div class="contact">${[...contacts(c), esc(c.mobility)].map((x) => `<span>${x}</span>`).join('')}</div>
      <p class="mono" style="margin-top:var(--N)">Planche 01 · Parcours</p>
      ${svg}
      <p class="mono">Une parcelle par mission · surface à la durée</p>
      <div class="brief"><p class="mono">${esc(c.highlightsTitle)}</p><ul>${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>
    </div>
    <div class="right">
      <p class="mono">Curriculum vitæ</p>
      <h1>${esc(c.last)}<i>.</i></h1>
      <p class="first">${esc(c.first)}</p>
      <p class="title">${esc(c.title)}</p>
      <div class="profile">${c.profile.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="figs">${c.figures.map(([v, l]) => `<div><b>${esc(v)}</b><span class="mono">${esc(l)}</span></div>`).join('')}</div>
    </div>
  </div>
  <div class="flow">
    <h2>Expérience</h2>
    ${c.jobs
      .map(
        (
          j,
          i,
        ) => `<div class="job" style="--c:${ROLE[i]}"><span class="tag"></span><p class="mono">${esc(j.period)}</p><h3>${esc(j.title)}</h3><p class="org">${esc(j.org)}</p>
      ${j.context ? `<p class="ctx">${esc(j.context)}</p>` : ''}<ul>${j.bullets.map((b) => `<li>${bullet(b)}</li>`).join('')}</ul></div>`,
      )
      .join('')}
    <h2>Compétences</h2>
    ${c.tech.map(([k, v]) => `<dl class="kv"><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></dl>`).join('')}
    <div class="kv"><p class="mono">${esc(c.softTitle)}</p><ul>${c.soft.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <h2>Formation · Langues</h2>
    ${c.education.map((e) => `<div class="kv"><p class="mono">${esc(e.period)}</p><h3 style="font:700 10pt/1.2 'Bricolage Grotesque'">${esc(e.title)}</h3><p>${esc(e.org)}</p><p style="font-style:italic">${esc(e.note)}</p></div>`).join('')}
    ${c.languages.map(([l, n]) => `<dl class="kv"><dt class="mono">${esc(l)}</dt><dd>${esc(n)}</dd></dl>`).join('')}
  </div>`;
  return doc(`${c.short} · CV`, css, body);
}
