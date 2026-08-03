#!/usr/bin/env node
// Verifies every text token against the worst-case surface of its theme.
// Reads src/styles/tokens.css so the check can never drift from the tokens.
import { readFileSync } from 'node:fs';
import { MISSIONS } from '../src/lib/plate.mjs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function tokensFor(theme) {
  const block = css.match(new RegExp(`\\[data-theme="${theme}"\\]\\s*{([^}]*)}`, 's'));
  if (!block) throw new Error(`No token block for theme "${theme}"`);
  const out = {};
  for (const [, k, v] of block[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) out[k] = v;
  return out;
}

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = (h) => {
  const [r, g, b] = rgb(h).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

// Every pair that renders text. `on` lists candidate surfaces; the worst wins.
const PAIRS = [
  { fg: 'tx', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'tx2', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'or-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'tl-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'yw-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'lv-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'bg', on: ['or-t'], need: 4.5 }, // primary button label on its fill
  { fg: 'inv-tx', on: ['inv-bg'], need: 4.5 },
  { fg: 'inv-tx2', on: ['inv-bg'], need: 4.5 },
  { fg: 'or-inv', on: ['inv-bg'], need: 4.5 },
  { fg: 'tl-inv', on: ['inv-bg'], need: 4.5 },
];

let failed = 0;
for (const theme of ['light', 'dark']) {
  const t = tokensFor(theme);
  for (const { fg, on, need } of PAIRS) {
    if (!t[fg]) {
      console.error(`FAIL ${theme}: missing token --${fg}`);
      failed++;
      continue;
    }
    for (const bgName of on) {
      if (!t[bgName]) {
        console.error(`FAIL ${theme}: missing token --${bgName}`);
        failed++;
        continue;
      }
      const r = ratio(t[fg], t[bgName]);
      const ok = r >= need;
      if (!ok) failed++;
      console.log(
        `${ok ? 'ok  ' : 'FAIL'} ${theme.padEnd(5)} --${fg} on --${bgName}: ${r.toFixed(2)} (need ${need})`,
      );
    }
  }
}
// La planche cadastrale pose son texte sur l'aplat de chaque parcelle, pas sur
// --bg : la couleur du rôle composée à son opacité. Sans ce bloc, un aplat plus
// dense ou une nouvelle mission peut faire tomber le libellé sous 4,5:1 sans
// que rien ne le signale, et c'est exactement ce qui était arrivé.
const compose = (bg, fg, a) =>
  '#' +
  rgb(bg)
    .map((v, i) => Math.round(v * (1 - a) + rgb(fg)[i] * a))
    .map((v) => v.toString(16).padStart(2, '0'))
    .join('');

for (const theme of ['light', 'dark']) {
  const t = tokensFor(theme);
  for (const m of MISSIONS) {
    if (!t[m.role]) {
      console.error(`FAIL ${theme}: missing token --${m.role} (parcelle ${m.id})`);
      failed++;
      continue;
    }
    const wash = compose(t.bg, t[m.role], Number(m.op));
    const r = ratio(t.tx, wash);
    const ok = r >= 4.5;
    if (!ok) failed++;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${theme.padEnd(5)} --tx on aplat ${m.id} (--${m.role} @ ${m.op}): ${r.toFixed(2)} (need 4.5)`,
    );
  }
}

console.log(failed ? `\n${failed} contrast failure(s)` : '\nAll contrast pairs pass WCAG AA');
process.exit(failed ? 1 : 0);
