# Portfolio Lionel Ratovo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual static portfolio site for Lionel Ratovo that argues one thesis — he translates complex business needs into systems that hold in production — using a cadastral-plan visual system in place of the screenshots his confidential work forbids.

**Architecture:** Astro 7 static site, zero UI framework, zero runtime dependencies. Content lives in Zod-typed collections (one Markdown file per case per language) so a missing field breaks the build rather than the live page. French is the default locale with no prefix; English lives under `/en/` and falls back to French when absent, so the site ships in French alone. Three motion layers — an entry animation, CSS scroll-driven timelines, and a hand-rolled damped scroll — each independently disabled by `prefers-reduced-motion`.

**Tech Stack:** Astro 7 · Tailwind 4 (via `@tailwindcss/vite`) · TypeScript (strict) · Biome · Playwright · GitHub Actions → GitHub Pages

**Spec:** `docs/superpowers/specs/2026-07-31-portfolio-lionel-ratovo-design.md`
**Visual reference:** `docs/superpowers/reference/preview.html` (**v4, validated 2026-08-01 by Lionel** — the source of truth for tokens, plate geometry, diagrams, and motion values)
**Fact sources:** `.unwanted/sources/`. Two tiers: the master CVs of 21/07/2026, and
`RETOURS-LIONEL-2026-08-01.md` (markers `[F1]`–`[F12]`) **which overrides them** wherever they
disagree. Where the master is silent, ask — do not infer. Four claims in the v3 mock-up came from
inference, not sources, and all four were wrong.

---

## Global Constraints

Every task's requirements implicitly include this section.

**Content rules — these override any aesthetic consideration:**
1. No number that could not be defended in a technical interview. Delete rather than estimate.
2. No screenshots of SIF, SIGFU, GSK, Cartier, or Mercedes-Benz work.
3. No fictional projects, no invented repos, **no social links whatsoever** — Lionel has neither GitHub nor LinkedIn, by choice.
4. Nothing implying NEXTRI has delivered client projects. It has delivered none.
5. No vanity counters ("+120 projects", "98% satisfaction").
6. Every displayed fact traces to a source file via a non-empty `sourceRefs` array.
7. **The SIF database is PostgreSQL, never Oracle** `[F1]`. The SIF interface is ExtJS; Angular belongs to the SIGFU portal, which is a separate application with its own PostgreSQL `[F2]`.
8. **Mercedes-Benz is webmastering, not data** `[F6]`. Two data brands (GSK, Cartier), one web brand.
9. **Parcel areas are proportional to time spent** `[F10]`. The plate is computed, never hand-drawn.

**Copy rules:**
- Site copy contains **no em dashes** (`—`) and no `--`. Use commas, colons, semicolons, periods, or parentheses.
- French copy uses `·` as a separator, never `—`.

**Technical constraints:**
- **Astro 7.** Not 5. Two API changes bind every content task: collections use `loader: glob(...)` (there is no `type: 'content'`), the config file is `src/content.config.ts` (not `src/content/config.ts`), and rendering is `await render(entry)` imported from `astro:content` (not `entry.render()`).
- **Tailwind 4 via `@tailwindcss/vite`.** `@astrojs/tailwind` is the v3 integration and cannot install Tailwind 4.
- Astro 7 compiles templates with the Rust compiler, which rejects unclosed tags. Malformed markup is a build error, not a warning.
- **pnpm, not npm.** The lockfile is `pnpm-lock.yaml`; `package-lock.json` must never reappear. pnpm 11 no longer reads the `pnpm` field in `package.json`: dependency settings live in `pnpm-workspace.yaml`. pnpm blocks dependency install scripts by default and **exits 1** when it blocks one, so any package needing a build script must be listed under `allowBuilds` there or CI fails at install.
- **Zero runtime dependencies.** No Lenis, no GSAP, no animation library, no UI framework.
- **Zero external CDN requests.** Fonts are self-hosted. No Google Fonts in production.
- **Zero trackers, zero analytics.**
- Total JavaScript shipped: **< 6 KB compressed.**
- No animation of layout properties. Only `transform`, `opacity`, `clip-path`, `stroke-dashoffset`, `box-shadow`.
- All easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce, no elastic.
- Every colour that renders as text must pass WCAG AA (4.5:1 normal, 3:1 large) against the **worst-case surface of its theme**, verified by `scripts/contrast.mjs`.

**Token values are fixed.** Copy verbatim from the spec §1.5. Do not re-derive by eye.

**Page order is fixed** `[F9]`: hero → 01 Qui je suis → 02 Ce que j'offre → autorité → 03 Ce que j'ai accompli → 04 Comment me contacter.

---

## File Structure

| File | Responsibility |
|---|---|
| `astro.config.mjs` | Site/base URL, i18n routing, integrations |
| `pnpm-workspace.yaml` | pnpm settings. `allowBuilds` lives here, not in `package.json`. |
| `scripts/contrast.mjs` | WCAG AA verification of every token pair. Runs in CI. |
| `src/lib/plate.mjs` | Parcel geometry: durations in, polygons out. Runs at build time only. |
| `scripts/plate-check.mjs` | Asserts each parcel's area matches its duration. Runs in CI. |
| `src/styles/tokens.css` | The two theme blocks. Single source of colour truth. |
| `src/styles/base.css` | Reset, typography scale, layout primitives |
| `src/styles/motion.css` | Scroll-driven timelines, gated by support + reduced-motion |
| `src/scripts/theme.ts` | Three-state theme cycle, localStorage, OS sync |
| `src/scripts/motion.ts` | Fallback reveals for browsers without `animation-timeline` |
| `src/scripts/smooth-scroll.ts` | Damped wheel scrolling, pointer-fine only |
| `src/components/Plate.astro` | The cadastral parcel plan. Geometry + labels + annotations. |
| `src/components/Hero.astro` | Thesis, CTAs, and either the plate or a portrait |
| `src/components/Cartouche.astro` | The six traced facts, in title-block form |
| `src/components/AuthorityBand.astro` | Real client names, large |
| `src/components/Offer.astro` | The four services, each proved by a different mission |
| `src/components/Thread.astro` | The cross-case « reprendre l'existant » block |
| `src/components/CaseCard.astro` | The major case card. Minor cards are inline in `index.astro`. |
| `src/components/CaseDiagram.astro` | Per-case SVG schematic, dispatched by id |
| `src/components/Timeline.astro` | Career frieze |
| `src/components/ContactFork.astro` | The two doors, on the inverted surface |
| `src/components/ThemeToggle.astro` · `LangSwitch.astro` | Header controls |
| `src/layouts/Base.astro` · `Case.astro` | Page shells |
| `src/content.config.ts` | Zod schemas and the glob loader. `sourceRefs` enforcement lives here. |
| `src/i18n/{fr,en}.ts` · `utils.ts` | UI dictionary and locale helpers |
| `tests/*.spec.ts` | Four Playwright scenarios |

**Testing philosophy for this project.** There is no business logic to unit-test; a content site's unit tests would be theatre. The real verification harness is three-fold, and every task below ends in at least one of them:
- `node scripts/contrast.mjs` — accessibility, mechanically checkable
- `pnpm exec playwright test` — the four flows that break silently
- `pnpm run build && pnpm exec astro check` — type and schema integrity

No unit tests, no link checker, no Lighthouse in CI. Each was weighed and cut: see Tasks 10, 14 and 15 for the reasoning.

---

## Task 1: Project scaffold and quality gate

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `biome.json`, `.gitignore`, `src/pages/index.astro`

**Interfaces:**
- Produces: `pnpm run build` (static output to `dist/`), `pnpm run check`, `pnpm run lint`

- [ ] **Step 1: Initialise the repository**

```bash
cd E:/Dev/lionel-ratovo-portfolio
git init
pnpm create astro@latest . --template minimal --typescript strict --no-install --no-git --skip-houston
pnpm add astro@^7
pnpm add -D tailwindcss@^4 @tailwindcss/vite @biomejs/biome @playwright/test @astrojs/check typescript
```

Then pin the package manager so CI and every future contributor resolve the same tree:

```bash
pnpm config set --location project package-manager pnpm@11.5.2
```

or add `"packageManager": "pnpm@11.5.2"` to `package.json` by hand.

- [ ] **Step 2: Write `.gitignore`**

```gitignore
node_modules/
dist/
.astro/
.unwanted/
test-results/
playwright-report/
.env
```

`.unwanted/` is ignored: it holds working sources and the validation mock-up, not deliverables.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lionelratovo.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
    fallback: { en: 'fr' },
  },
  vite: { plugins: [tailwindcss()] },
});
```

`fallback: { en: 'fr' }` with `fallbackType: 'rewrite'` is what lets English arrive later without 404s: a missing English page serves the French one at the English URL, rather than redirecting away from it.

Tailwind 4 needs no `tailwind.config.js` and no `content` array. If one exists, delete it.

- [ ] **Step 4: Write `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.5.6/schema.json",
  "files": {
    "includes": [
      "**",
      "!dist",
      "!node_modules",
      "!.astro",
      "!.superpowers",
      "!docs",
      "!.unwanted",
      "!pnpm-lock.yaml"
    ]
  },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "javascript": { "formatter": { "quoteStyle": "single" } },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "assist": { "actions": { "source": { "organizeImports": "off" } } }
}
```

**Include everything, then subtract.** Listing `src`, `scripts` and `tests` by name looks tighter but fails the moment one of those directories does not exist yet, and it silently stops linting any directory added later. The exclusions are named individually so that `.unwanted/` and `.superpowers/` can never be walked: the first holds the master CVs of three real people, and this repository is going public.

- [ ] **Step 5: Add scripts to `package.json`**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "check": "astro check",
    "lint": "biome check .",
    "format": "biome check --write .",
    "test": "playwright test",
    "verify": "pnpm run lint && pnpm run check && pnpm run build"
  },
  "packageManager": "pnpm@11.5.2"
}
```

`contrast` is deliberately absent here: `scripts/contrast.mjs` does not exist until Task 2. **Task 2 adds `"contrast": "node scripts/contrast.mjs"` and extends `verify` to `... && pnpm run contrast`.** A `verify` that calls a missing file is a gate that is red from birth, which trains everyone to ignore it.

- [ ] **Step 5b: Write `pnpm-workspace.yaml`**

```yaml
allowBuilds:
  esbuild: true
```

pnpm blocks dependency install scripts by default and exits 1 when it blocks one, which would fail CI at the install step. esbuild links its platform binary in a `postinstall`, and Vite needs it to build. Nothing else in the tree requires one: do not add entries speculatively. If a later dependency needs one, pnpm will name it in the error.

- [ ] **Step 6: Verify the gate runs**

Run: `pnpm run build && pnpm exec astro check`
Expected: build succeeds, `astro check` reports `0 errors`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro 7 + Tailwind 4 + Biome + Playwright"
```

---

## Task 2: Colour tokens, with the contrast checker written first

This is the one place where a real failing-test cycle applies: the checker is written before the tokens, run to see it fail, then the tokens make it pass.

**Files:**
- Create: `scripts/contrast.mjs`, `src/styles/tokens.css`

**Interfaces:**
- Produces: `node scripts/contrast.mjs` exits `0` on success, `1` with a per-token report on failure. Consumed by CI in Task 23.

- [ ] **Step 1: Write the failing test — `scripts/contrast.mjs`**

```js
#!/usr/bin/env node
// Verifies every text token against the worst-case surface of its theme.
// Reads src/styles/tokens.css so the check can never drift from the tokens.
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function tokensFor(theme) {
  const block = css.match(new RegExp(`\\[data-theme="${theme}"\\]\\s*{([^}]*)}`, 's'));
  if (!block) throw new Error(`No token block for theme "${theme}"`);
  const out = {};
  for (const [, k, v] of block[1].matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/g)) out[k] = v;
  return out;
}

const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const lum = h => { const [r, g, b] = rgb(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// Every pair that renders text. `on` lists candidate surfaces; the worst wins.
const PAIRS = [
  { fg: 'tx',  on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'tx2', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'or-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'tl-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'yw-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'lv-t', on: ['bg', 'bg2', 'bg3'], need: 4.5 },
  { fg: 'bg',  on: ['or-t'], need: 4.5 },          // primary button label on its fill
  { fg: 'inv-tx',  on: ['inv-bg'], need: 4.5 },
  { fg: 'inv-tx2', on: ['inv-bg'], need: 4.5 },
  { fg: 'or-inv',  on: ['inv-bg'], need: 4.5 },
  { fg: 'tl-inv',  on: ['inv-bg'], need: 4.5 },
];

let failed = 0;
for (const theme of ['light', 'dark']) {
  const t = tokensFor(theme);
  for (const { fg, on, need } of PAIRS) {
    if (!t[fg]) { console.error(`FAIL ${theme}: missing token --${fg}`); failed++; continue; }
    for (const bgName of on) {
      if (!t[bgName]) { console.error(`FAIL ${theme}: missing token --${bgName}`); failed++; continue; }
      const r = ratio(t[fg], t[bgName]);
      const ok = r >= need;
      if (!ok) failed++;
      console.log(`${ok ? 'ok  ' : 'FAIL'} ${theme.padEnd(5)} --${fg} on --${bgName}: ${r.toFixed(2)} (need ${need})`);
    }
  }
}
console.log(failed ? `\n${failed} contrast failure(s)` : '\nAll contrast pairs pass WCAG AA');
process.exit(failed ? 1 : 0);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/contrast.mjs`
Expected: FAIL — `Error: ENOENT ... src/styles/tokens.css`. The tokens do not exist yet.

- [ ] **Step 3: Write `src/styles/tokens.css`**

Values are copied verbatim from spec §1.5. They were computed against the worst-case surface, not chosen by eye. Do not adjust them.

```css
:root {
  --ff:  "Archivo", system-ui, sans-serif;
  --ffd: "Bricolage Grotesque", "Archivo", sans-serif;
  --ffm: "JetBrains Mono", ui-monospace, monospace;

  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --gut: clamp(1.15rem, 4vw, 3.5rem);
  --max: 1240px;
}

/* Two accent sets per theme:
   --or   graphic colour (fills, strokes, washes). NEXTRI identity, untouched.
   --or-t text colour, darkened until it clears 4.5:1 on the worst surface. */
[data-theme="light"] {
  --bg:#F4EEE0; --bg2:#EDE4CC; --bg3:#E6DBC0;
  --tx:#1C2318; --tx2:#685f52; --tx3:#b0a898;
  --bd:#CFC5A8; --bd2:#b8ae90;
  --sh:rgba(28,35,24,.10);
  --or:#C84E0A;   --tl:#1A9E93;   --yw:#D4A800;   --lv:#7B6EC8;
  --or-t:#a64108; --tl-t:#116a62; --yw-t:#775e00; --lv-t:#61579e;
  --or-inv:#E8621A; --tl-inv:#2BBFB3;
  --mb:rgba(244,238,224,.90);
  --inv-bg:#1C2318; --inv-tx:#F4EEE0; --inv-tx2:#9E9880; --inv-bd:#3A4736;
  --grain:.05; --grain-mode:multiply;
}

[data-theme="dark"] {
  --bg:#1C2318; --bg2:#252E21; --bg3:#181e14;
  --tx:#F4EEE0; --tx2:#9E9880; --tx3:#96918a;
  --bd:#3A4736; --bd2:#4d5f49;
  --sh:rgba(0,0,0,.5);
  --or:#E8621A;   --tl:#2BBFB3;   --yw:#F5C842;   --lv:#9B8FD9;
  --or-t:#ea6e2b; --tl-t:#2BBFB3; --yw-t:#F5C842; --lv-t:#9B8FD9;
  --or-inv:#a64108; --tl-inv:#126d65;
  --mb:rgba(20,27,17,.90);
  --inv-bg:#F4EEE0; --inv-tx:#1C2318; --inv-tx2:#685f52; --inv-bd:#CFC5A8;
  --grain:.055; --grain-mode:overlay;
}
```

**`--tx3` is for hairlines and decorative strokes only. It is never a text colour.** That is why it is absent from `PAIRS`.

- [ ] **Step 4: Run the checker to verify it passes**

Run: `node scripts/contrast.mjs`
Expected: every line begins `ok`, final line `All contrast pairs pass WCAG AA`, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add scripts/contrast.mjs src/styles/tokens.css
git commit -m "feat: colour tokens with mechanical WCAG AA verification"
```

---

## Task 3: Self-hosted fonts and base styles

**Files:**
- Create: `public/fonts/*.woff2`, `src/styles/base.css`

**Interfaces:**
- Produces: `.wrap`, `.mono`, `.lead`, `h1`–`h3` scale, `.btn`/`.btn-1`/`.btn-2`, `.sr-only`, `:focus-visible` ring, `#grain`, `.grid-bg`

- [ ] **Step 1: Download the fonts, weight axis only**

Google already serves subset `woff2` files. Take the **`latin`** block from its CSS. No subsetting tool, no build step, and **no `text=` parameter**.

```bash
mkdir -p public/fonts
curl -s -H "User-Agent: Mozilla/5.0 Chrome/120" \
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400..600&family=Bricolage+Grotesque:wght@700..800&family=JetBrains+Mono:wght@500..700&display=swap" \
  | grep -oE "https://fonts.gstatic.com/[^)]+\.woff2" | sort -u
# Save as Archivo.woff2, Bricolage.woff2, JetBrainsMono.woff2 in public/fonts/
```

**Request the `wght` axis only.** The mock-up uses `font-stretch` nowhere and `opsz` nowhere: those axes were dead weight, left over from an earlier design where Archivo set the headings. Each axis dropped removes 20 to 40 KB, and fonts are the single biggest item in the 220 KB page budget.

**Take the standard `latin` subset, not `latin-ext` and not a custom one.** Google's `latin` range is `U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD`. It covers every French diacritic, `œ` at U+0153, and the punctuation this design leans on: `&` `@` `·` `–` `’` `«»` `…` `€`.

A subset cut to the day's copy via the CSS2 `text=` parameter is smaller and **wrong**: it ties the font files to a snapshot of the text, so the next case study silently reintroduces fallback glyphs. That is exactly what happened on the first attempt at this task, and `&`, `@`, `·` and `–` all went missing from a page whose entire visual argument is typographic.

`→` (U+2192) and `∝` (U+221D) fall outside the range and render in the system font. Accepted, and documented so nobody rediscovers it as a bug.

- [ ] **Step 2: Write the `@font-face` block and base styles in `src/styles/base.css`**

```css
/* Weight axis only. Nothing in the design uses wdth or opsz. */
@font-face {
  font-family: "Archivo"; src: url("/fonts/Archivo.woff2") format("woff2-variations");
  font-weight: 400 600; font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F, U+2000-206F, U+20AC;
}
@font-face {
  font-family: "Bricolage Grotesque"; src: url("/fonts/Bricolage.woff2") format("woff2-variations");
  font-weight: 700 800; font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F, U+2000-206F, U+20AC;
}
@font-face {
  font-family: "JetBrains Mono"; src: url("/fonts/JetBrainsMono.woff2") format("woff2-variations");
  font-weight: 500 700; font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F, U+2000-206F;
}

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0; background: var(--bg); color: var(--tx);
  font-family: var(--ff); font-size: clamp(.96rem, .93rem + .17vw, 1.045rem);
  line-height: 1.6; font-synthesis-weight: none; -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background .45s var(--ease), color .45s var(--ease);
}

/* Suppresses the cross-fade smear during a theme switch. */
.no-tr, .no-tr *, .no-tr *::before, .no-tr *::after {
  transition: none !important; animation-duration: .001ms !important;
}

h1, h2, h3 { margin: 0; font-family: var(--ffd); font-weight: 700; letter-spacing: -.028em; line-height: 1.03; }
h1 { font-size: clamp(2.1rem, 1.15rem + 3.5vw, 3.85rem); line-height: 1; letter-spacing: -.038em; font-weight: 760; text-wrap: balance; }
h2 { font-size: clamp(1.6rem, 1.05rem + 1.9vw, 2.6rem); }
h3 { font-size: clamp(1.08rem, .98rem + .48vw, 1.32rem); letter-spacing: -.022em; }
p  { margin: 0; max-width: 64ch; }

.lead { font-size: clamp(1rem, .95rem + .42vw, 1.2rem); color: var(--tx2); line-height: 1.52; max-width: 48ch; }
.mono { font-family: var(--ffm); font-size: .66rem; font-weight: 500; letter-spacing: .09em; text-transform: uppercase; color: var(--tx2); }
a { color: var(--or-t); text-decoration: none; }
.wrap { max-width: var(--max); margin-inline: auto; padding-inline: var(--gut); }

.btn {
  font: inherit; font-size: .895rem; font-weight: 560; display: inline-flex; align-items: center; gap: .55rem;
  padding: .75rem 1.3rem; border-radius: 3px; border: 1px solid transparent; cursor: pointer;
  min-height: 44px;
  transition: background .24s var(--ease), border-color .24s var(--ease), transform .24s var(--ease), box-shadow .24s var(--ease);
}
.btn-1 { background: var(--or-t); color: var(--bg); }
.btn-1:hover { transform: translateY(-2px); box-shadow: 0 8px 20px color-mix(in oklab, var(--or) 34%, transparent); }
.btn-2 { background: transparent; color: var(--tx); border-color: var(--bd2); }
.btn-2:hover { border-color: var(--tx); background: color-mix(in oklab, var(--tx) 5%, transparent); transform: translateY(-2px); }
.btn:active { transform: translateY(0); box-shadow: none; }

:focus-visible { outline: 2px solid var(--or-t); outline-offset: 3px; border-radius: 2px; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap;
}
.skip { position: absolute; left: -9999px; z-index: 100; }
.skip:focus { left: var(--gut); top: .5rem; padding: .6rem 1rem; background: var(--bg); border: 1px solid var(--tx); border-radius: 3px; }

#grain {
  position: fixed; inset: 0; pointer-events: none; z-index: 9996;
  mix-blend-mode: var(--grain-mode); opacity: var(--grain);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23g)'/%3E%3C/svg%3E");
  background-size: 240px 240px;
}
.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; color: var(--tx); opacity: .045;
  background:
    repeating-linear-gradient(to right, currentColor 0 1px, transparent 1px 36px),
    repeating-linear-gradient(to bottom, currentColor 0 1px, transparent 1px 36px);
  mask-image: radial-gradient(ellipse 130% 70% at 62% 6%, #000 22%, transparent 72%);
}
```

- [ ] **Step 3: Preload the LCP font in `Base.astro`**

The `h1` is the largest contentful paint and it is set in Bricolage. Preload that one, and only that one.

```html
<link rel="preload" href="/fonts/Bricolage.woff2" as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 4: Verify fonts load and no network request leaves the origin**

Run: `pnpm run dev`, open `http://localhost:4321`, DevTools → Network, filter `Font`.
Expected: three `woff2` requests, all from `localhost`. **Zero requests to `fonts.googleapis.com` or `fonts.gstatic.com`.** If any appear, a `<link>` survived from the mock-up; remove it.

Then check the weight:

```bash
du -ch public/fonts/*.woff2 | tail -1
```
Expected: **under 110 KB total** (measured: 105 KiB). Above that, an unwanted axis slipped back in.

- [ ] **Step 5: Commit**

```bash
git add public/fonts src/styles/base.css
git commit -m "feat: self-hosted variable fonts and base type scale"
```

---

## Task 4: Theme system

Reimplements NEXTRI's `next-themes` contract without React: same `data-theme` attribute, same `theme` localStorage key.

**Files:**
- Create: `src/scripts/theme.ts`, `src/components/ThemeToggle.astro`, `src/layouts/Base.astro`, `tests/theme.spec.ts`, `playwright.config.ts`

**Interfaces:**
- Produces: `<html data-theme="light|dark" data-theme-pref="system|light|dark">`; `Base.astro` accepts `{ title, description, lang, path }`

- [ ] **Step 1: Write the failing test — `tests/theme.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('theme', () => {
  test('follows the OS on first visit and stores nothing', async ({ browser }) => {
    for (const scheme of ['light', 'dark'] as const) {
      const ctx = await browser.newContext({ colorScheme: scheme });
      const page = await ctx.newPage();
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      await expect(page.locator('html')).toHaveAttribute('data-theme-pref', 'system');
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
      await ctx.close();
    }
  });

  test('cycles system -> light -> dark -> system', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'light');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'dark');
    await page.click('#theme-toggle');
    await expect(html).toHaveAttribute('data-theme-pref', 'system');
    expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  });

  test('persists an explicit choice across reload', async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    await page.click('#theme-toggle');   // light
    await page.click('#theme-toggle');   // dark
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await ctx.close();
  });
});
```

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321', trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: { command: 'pnpm run dev', url: 'http://localhost:4321', reuseExistingServer: true },
});
```

- [ ] **Step 3: Run to verify it fails**

Run: `pnpm exec playwright test tests/theme.spec.ts --project=chromium`
Expected: FAIL — no `#theme-toggle`, no `data-theme` attribute.

- [ ] **Step 4: Write `src/scripts/theme.ts`**

```ts
const KEY = 'theme';
const root = document.documentElement;
const mq = matchMedia('(prefers-color-scheme: dark)');
const sys = (): 'light' | 'dark' => (mq.matches ? 'dark' : 'light');

export type Pref = 'system' | 'light' | 'dark';
const NEXT: Record<Pref, Pref> = { system: 'light', light: 'dark', dark: 'system' };

function apply(pref: Pref) {
  root.classList.add('no-tr');
  root.dataset.theme = pref === 'system' ? sys() : pref;
  root.dataset.themePref = pref;
  try {
    if (pref === 'system') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {}
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('no-tr')));
  label();
}

function label() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const pref = (root.dataset.themePref ?? 'system') as Pref;
  btn.textContent = pref === 'light' ? '☀' : pref === 'dark' ? '☾' : '⌁';
  btn.setAttribute('aria-label', btn.dataset.labelPrefix + ' ' + pref);
}

document.getElementById('theme-toggle')
  ?.addEventListener('click', () => apply(NEXT[(root.dataset.themePref ?? 'system') as Pref]));

mq.addEventListener('change', () => {
  if ((root.dataset.themePref ?? 'system') === 'system') apply('system');
});

label();
```

- [ ] **Step 5: Write `src/components/ThemeToggle.astro`**

```astro
---
const { labelPrefix } = Astro.props as { labelPrefix: string };
---
<button id="theme-toggle" class="chip" type="button" data-label-prefix={labelPrefix} aria-label={labelPrefix}>⌁</button>

<style>
  .chip {
    font-family: var(--ffm); font-size: .72rem; letter-spacing: .08em;
    border: 1px solid var(--bd); border-radius: 2px; background: transparent;
    color: var(--tx2); cursor: pointer;
    min-width: 44px; min-height: 44px; display: inline-grid; place-items: center;
    transition: border-color .25s var(--ease), color .25s var(--ease);
  }
  .chip:hover { border-color: var(--tx); color: var(--tx); }
</style>
```

- [ ] **Step 6: Write `src/layouts/Base.astro` with the blocking theme script**

```astro
---
import '../styles/tokens.css';
import '../styles/base.css';
const { title, description, lang = 'fr' } = Astro.props;
---
<!doctype html>
<!-- data-theme is hardcoded: without JS the site is light, and the token block
     is never duplicated into a prefers-color-scheme copy that can drift. -->
<html lang={lang} data-theme="light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <!-- Blocking: sets the theme before first paint, so there is no flash. -->
  <script is:inline>
    (function () {
      var stored = null;
      try { stored = localStorage.getItem('theme'); } catch (e) {}
      var sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var d = document.documentElement;
      d.dataset.theme = (stored === 'light' || stored === 'dark') ? stored : sys;
      d.dataset.themePref = stored || 'system';
    })();
  </script>
</head>
<body>
  <a class="skip" href="#main">{lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
  <div class="grid-bg"></div>
  <div id="grain"></div>
  <slot />
  <script>import '../scripts/theme.ts';</script>
</body>
</html>
```

- [ ] **Step 7: Install the test browsers**

```bash
pnpm exec playwright install chromium firefox
```

**There is deliberately no `prefers-color-scheme` fallback block.** Copying the dark tokens into a media query duplicates every value, and a duplicated token drifts the first time someone edits one of the two copies. `data-theme="light"` in the markup means a visitor without JavaScript gets the light theme, which passes AA in full. That costs OS-dark to a fraction of a percent of visitors and removes fifteen lines that can silently disagree with themselves.

- [ ] **Step 8: Run to verify it passes**

Run: `pnpm exec playwright test tests/theme.spec.ts`
Expected: 3 passed in chromium, 3 passed in firefox.

- [ ] **Step 9: Commit**

```bash
git add src/scripts/theme.ts src/components/ThemeToggle.astro src/layouts/Base.astro tests playwright.config.ts
git commit -m "feat: three-state theme system matching NEXTRI's next-themes contract"
```

---

## Task 5: Page shell — header, footer, phone reveal

**Files:**
- Create: `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/i18n/fr.ts`, `src/i18n/en.ts`, `src/i18n/utils.ts`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `Base.astro` from Task 4
- Produces: `t(lang)` returning the UI dictionary; `getLang(url)` returning `'fr' | 'en'`

- [ ] **Step 1: Write `src/i18n/fr.ts`**

```ts
export default {
  nav: { who: 'Qui je suis', offer: "Ce que j'offre", cases: 'Réalisations', contact: 'Contact' },
  skip: 'Aller au contenu',
  themeLabel: 'Thème',
  status: 'Ouvert aux opportunités',
  hero: {
    title: 'Je traduis des besoins métier complexes en systèmes qui',
    titleAccent: 'tiennent',
    // « au total » est load-bearing : sans lui, la phrase se lit comme cinq ans
    // sur le seul SIF, ce que Lionel a relevé [F8].
    lead: "Backend & Data Engineer, Technical Project Lead. Près de cinq ans au total : un système d'information foncier national, deux comptes data internationaux, de la production web.",
    places: ['Antananarivo', 'Abidjan', 'Maurice'],
    ctaCv: 'Télécharger le CV',
    ctaContact: 'Me contacter',
  },
  // La planche : géométrie dans plate.mjs, mots ici. Les deux ne se mélangent pas.
  plate: {
    alt: "Plan parcellaire du parcours. L'aire de chaque parcelle est proportionnelle au temps passé : le SIF et le portail SIGFU en Côte d'Ivoire, les comptes data GSK et Cartier, la production web Mercedes-Benz, la reprise d'existant BICI, et une parcelle libre de douze mois ouverte au prochain projet.",
    sheet: 'PLANCHE 01 · PARCOURS',
    scale: 'AIRE ∝ DURÉE · LEVÉ 2021–2026',
    total: '58 MOIS TRAVAILLÉS · 12 LIBRES',
    hint: '→ Votre projet',
    keys: [['or', 'Mission en cours'], ['tl', 'Données'], ['yw', 'Production web'], ['lv', "Reprise d'existant"]],
    keyFree: 'Libre · 12 mois',
    parcels: {
      bici: { nom: 'BICI',            sub: '2021 · 2 mois' },
      merc: { nom: 'Mercedes-Benz',   sub: '2021–2022 · 9 mois' },
      cart: { nom: 'Cartier',         sub: '2022–2023 · 6 mois' },
      gsk:  { nom: 'GSK',             sub: '2023–2024 · 10 mois' },
      sif:  { nom: 'SIF · SIGFU',     sub: "Côte d'Ivoire · 2024 →" },
      free: { nom: 'Parcelle libre',  sub: 'Seul · ou à trois avec NEXTRI' },
    },
  },
  who: { heading: 'Qui je suis' },
  offer: { heading: "Ce que j'offre", proof: 'Sur le terrain' },
  authority: { label: "Systèmes et comptes sur lesquels j'ai travaillé" },
  cartouche: {
    label: 'Cartouche · parcours', place: 'Antananarivo · Madagascar',
    since: 'En activité depuis', missions: 'Missions', field: 'Terrain',
    education: 'Formation', languages: 'Langues', availability: 'Disponibilité',
  },
  cases: { heading: "Ce que j'ai accompli", read: "Lire l'étude de cas", readShort: 'Lire' },
  thread: { kicker: 'Un fil qui traverse les trois', heading: "Reprendre l'existant" },
  contact: {
    heading: 'Comment me contacter',
    hiring: { kicker: 'Recrutement', title: 'Un poste à pourvoir ?' },
    project: { kicker: 'Prestation', title: 'Un projet à livrer ?' },
  },
  phone: { reveal: 'Afficher le numéro' },
} as const;
```

- [ ] **Step 2: Write `src/i18n/en.ts`**

Same shape, English strings. TypeScript enforces the shape:

```ts
import type fr from './fr';

// `fr` porte `as const`, donc `typeof fr` impose des types litteraux : ecrit
// tel quel, `const en: typeof fr` exige que chaque chaine anglaise soit
// EXACTEMENT la chaine francaise, et `astro check` sort 49 erreurs. On elargit
// chaque feuille a `string` pour ne verifier que la forme, pas le contenu.
type Widen<T> = T extends readonly (infer U)[]
  ? Widen<U>[]
  : T extends object
    ? { [K in keyof T]: Widen<T[K]> }
    : string;

const en: Widen<typeof fr> = {
  nav: { who: 'Who I am', offer: 'What I offer', cases: 'Work', contact: 'Contact' },
  skip: 'Skip to content',
  themeLabel: 'Theme',
  status: 'Open to opportunities',
  hero: {
    title: 'I turn complex business needs into systems that',
    titleAccent: 'hold',
    lead: 'Backend & Data Engineer, Technical Project Lead. Close to five years in total: a national land information system, two international data accounts, web production.',
    places: ['Antananarivo', 'Abidjan', 'Mauritius'],
    ctaCv: 'Download CV', ctaContact: 'Get in touch',
  },
  plate: {
    alt: 'Parcel plan of the career. Each parcel\'s area is proportional to time spent: the SIF and SIGFU portal in Côte d\'Ivoire, the GSK and Cartier data accounts, Mercedes-Benz web production, BICI legacy work, and one free parcel of twelve months open to the next project.',
    sheet: 'SHEET 01 · CAREER',
    scale: 'AREA ∝ DURATION · SURVEYED 2021–2026',
    total: '58 MONTHS WORKED · 12 FREE',
    hint: '→ Your project',
    keys: [['or', 'Current mission'], ['tl', 'Data'], ['yw', 'Web production'], ['lv', 'Legacy systems']],
    keyFree: 'Free · 12 months',
    parcels: {
      bici: { nom: 'BICI',            sub: '2021 · 2 months' },
      merc: { nom: 'Mercedes-Benz',   sub: '2021–2022 · 9 months' },
      cart: { nom: 'Cartier',         sub: '2022–2023 · 6 months' },
      gsk:  { nom: 'GSK',             sub: '2023–2024 · 10 months' },
      sif:  { nom: 'SIF · SIGFU',     sub: "Côte d'Ivoire · 2024 →" },
      free: { nom: 'Free parcel',     sub: 'Alone · or three with NEXTRI' },
    },
  },
  who: { heading: 'Who I am' },
  offer: { heading: 'What I offer', proof: 'In the field' },
  authority: { label: 'Systems and accounts I have worked on' },
  cartouche: {
    label: 'Title block · career', place: 'Antananarivo · Madagascar',
    since: 'Working since', missions: 'Missions', field: 'Field',
    education: 'Education', languages: 'Languages', availability: 'Availability',
  },
  cases: { heading: 'What I have delivered', read: 'Read the case study', readShort: 'Read' },
  thread: { kicker: 'A thread through all three', heading: 'Taking over what exists' },
  contact: {
    heading: 'How to reach me',
    hiring: { kicker: 'Hiring', title: 'A role to fill?' },
    project: { kicker: 'Consulting', title: 'A project to deliver?' },
  },
  phone: { reveal: 'Show the number' },
};
export default en;
```

- [ ] **Step 3: Write `src/i18n/utils.ts`**

```ts
import fr from './fr';
import en from './en';

export type Lang = 'fr' | 'en';
const DICT = { fr, en } as const;

export const t = (lang: Lang) => DICT[lang];
export const getLang = (url: URL): Lang => (url.pathname.startsWith('/en/') ? 'en' : 'fr');
/** Same page in the other language. Case slugs are identical in both locales,
    so there is no translation map, and therefore none that can go stale. */
export const altPath = (path: string): string =>
  path.startsWith('/en') ? path.replace(/^\/en/, '') || '/' : `/en${path}`;
```

- [ ] **Step 4: Write the phone reveal inline in `SiteFooter.astro`**

Ten lines with exactly one consumer do not need their own module. The number never appears in the served HTML.

**Do not ship the number as digit fragments.** An array like
`['261', '34', '21', '137', '98']` lands in the HTML and is found by anything
that strips non-digits before matching, which is exactly what harvesters do.
It is the appearance of the protection without the protection. Encode it, and
say plainly in a comment that this is obfuscation and not secrecy: whoever
reads the source finds it in ten seconds, and that is fine. What matters is
that no reconstructable digit run ships in an indexed page.

```astro
<script>
  const btn = document.getElementById('phone-reveal');
  btn?.addEventListener(
    'click',
    () => {
      // Obfuscation contre les moissonneurs, pas un secret.
      const tel = atob('KzI2MSAzNCAyMSAxMzcgOTg=');   // "+261 XX XX XXX XX"
      const a = document.createElement('a');
      a.href = `tel:${tel.replace(/\s/g, '')}`;
      a.rel = 'nofollow';
      a.textContent = `(${tel.slice(0, 4)})${tel.slice(4)}`;
      a.className = 'mono phone-live';
      btn.replaceWith(a);
    },
    { once: true },
  );
</script>
```

Verify with a **normalising** scan, not a shape-matching one: strip every
non-digit from each file in `dist/`, then search; repeat stripping
non-alphanumerics. A grep for the formatted number proves nothing about the
forms you did not anticipate.

- [ ] **Step 5: Write `SiteHeader.astro` and `SiteFooter.astro`**

```astro
---
import ThemeToggle from './ThemeToggle.astro';
import LangSwitch from './LangSwitch.astro';
import { t, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const s = t(lang);
const base = lang === 'fr' ? '' : '/en';
---
<header>
  <div class="hdr">
    <a class="sig" href={`${base}/`}>Ratovo <i>S. M.</i> Lionel</a>
    <nav aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
      <a href={`${base}/#qui`}>{s.nav.who}</a>
      <a href={`${base}/#offre`}>{s.nav.offer}</a>
      <a href={`${base}/#cas`}>{s.nav.cases}</a>
      <a href={`${base}/#contact`}>{s.nav.contact}</a>
      <LangSwitch lang={lang} />
      <ThemeToggle labelPrefix={s.themeLabel} />
    </nav>
  </div>
</header>

<style>
  header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid var(--bd);
           background: var(--mb); backdrop-filter: blur(8px) saturate(1.2); }
  .hdr { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
         min-height: 58px; max-width: var(--max); margin-inline: auto; padding-inline: var(--gut); }
  .sig { font-family: var(--ffm); font-size: .7rem; letter-spacing: .1em; text-transform: uppercase;
         font-weight: 700; color: var(--tx); }
  .sig i { font-style: normal; color: var(--tx2); font-weight: 400; }
  nav { display: flex; gap: clamp(.8rem, 2vw, 1.8rem); align-items: center; }
  nav a { color: var(--tx2); font-size: .845rem; font-weight: 500; position: relative; padding-block: 3px; }
  nav a::after { content: ""; position: absolute; inset: auto 0 0 0; height: 1.5px; background: var(--or);
                 transform: scaleX(0); transform-origin: right; transition: transform .4s var(--ease); }
  nav a:hover { color: var(--tx); }
  nav a:hover::after { transform: scaleX(1); transform-origin: left; }
  /* Sous 800 px on ne garde qu'un lien : Contact. Le defilement fait la
     navigation sur une page unique de quatre sections, donc masquer les
     ancres ne coute presque rien. Sauf pour une : joindre Lionel est tout
     le chemin de conversion, et le faire defiler quatre sections pour la
     trouver est le seul endroit ou le masquage fait mal. Sur une page
     d'etude de cas, la signature ramene deja a l'accueil.
     Un menu hamburger pour trois ancres serait plus de machinerie que le
     probleme n'en merite ; une barre a defilement horizontal cache les
     liens derriere un geste que personne ne decouvre. */
  @media (max-width: 800px) {
    nav a:not(.sig):not([href$="#contact"]) { display: none; }
  }
</style>
```

`SiteFooter.astro` renders the legal link and:

```astro
<button id="phone-reveal" class="mono reveal" type="button">{s.phone.reveal}</button>
```

- [ ] **Step 6: Verify the phone is absent from the built HTML**

Run:
```bash
pnpm run build
grep -rc "XX XX XXX" dist/ || echo "0 occurrences — correct"
```
Expected: `0 occurrences — correct`. **If the number appears in `dist/`, the obfuscation has failed and must be fixed before proceeding.**

- [ ] **Step 7: Commit**

```bash
git add src/components src/i18n
git commit -m "feat: page shell, i18n dictionary, phone reveal on click"
```

---

## Task 6: The cadastral plate

The signature object. **Areas are proportional to time spent** (Global Constraint 9), so the
geometry is computed, not drawn. It runs in Astro frontmatter, at build time: the browser receives
static SVG and not one byte of geometry code.

The reference implementation, already validated with Lionel, is in
`docs/superpowers/reference/preview.html`. Port it; do not reinvent it.

**Files:**
- Create: `src/lib/plate.mjs`, `scripts/plate-check.mjs`, `src/components/Plate.astro`
- Modify: `package.json`

**Interfaces:**
- Consumes: `t(lang)` (Task 5)
- Produces: `HEX`, `MISSIONS`, `polyArea(P)`, `buildPlate()` from `src/lib/plate.mjs`;
  `<Plate lang={Lang} />` rendering `svg[role="img"]` with `.parcel[data-op]`, `#lines path`,
  `[data-lbl]`, `#ticks`, `#annos`, `.plate-key`.
  `buildPlate()` returns `[{ id, role, op, poly, cx, cy, fs, ss, tight }]`, `poly` being an array
  of `[x, y]` pairs.

**Why `.mjs` and not `.ts`:** the check script imports this module directly with plain `node`.
Keeping it JavaScript avoids a loader, a build step, and a Node version floor, and `astro check`
still infers everything from the literals.

- [ ] **Step 1: Write the failing check**

`scripts/plate-check.mjs`. This is the one automated test in the project and it earns its place:
a wrong bisection produces a plate that looks entirely plausible and lies about the career.

```js
import assert from 'node:assert/strict';
import { HEX, MISSIONS, buildPlate, polyArea } from '../src/lib/plate.mjs';

const total = MISSIONS.reduce((n, m) => n + m.mois, 0);
const hex = polyArea(HEX);
let covered = 0;

for (const parcel of buildPlate()) {
  const m = MISSIONS.find(x => x.id === parcel.id);
  const got = polyArea(parcel.poly) / hex;
  const want = m.mois / total;
  assert.ok(
    Math.abs(got - want) < 0.005,
    `${parcel.id} occupe ${(got * 100).toFixed(2)} % de la planche, attendu ${(want * 100).toFixed(2)} %`,
  );
  covered += got;
}

assert.ok(Math.abs(covered - 1) < 0.005,
  `les parcelles couvrent ${(covered * 100).toFixed(2)} % de la planche, attendu 100 %`);

console.log(`planche : ${MISSIONS.length} parcelles, aires conformes aux durées`);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node scripts/plate-check.mjs`
Expected: FAIL with `Cannot find module '../src/lib/plate.mjs'`.

- [ ] **Step 3: Write `src/lib/plate.mjs`**

```js
// Géométrie de la planche cadastrale.
// Le contour est fixe, les divisions sont calculées : l'aire de chaque parcelle
// vaut sa durée en mois. La parcelle du SIF grossit donc d'elle-même tant que la
// mission dure, et corriger une date suffit à redessiner le plan.
// Exécuté au build uniquement — la page ne reçoit que du SVG.

export const HEX = [[60, 34], [541, 62], [572, 296], [498, 470], [118, 492], [28, 258]];

// `mois` : durées pleines, source RETOURS-LIONEL-2026-08-01.md.
// `op`   : Cartier et GSK partagent le rôle « données » et sont mitoyennes ;
//          deux densités d'aplat les séparent, comme sur un vrai plan.
export const MISSIONS = [
  { id: 'bici', mois: 2,  role: 'lv', op: '.30' },
  { id: 'merc', mois: 9,  role: 'yw', op: '.32' },
  { id: 'cart', mois: 6,  role: 'tl', op: '.20' },
  { id: 'gsk',  mois: 10, role: 'tl', op: '.34' },
  { id: 'sif',  mois: 31, role: 'or', op: '.32' },
  { id: 'free', mois: 12, role: 'tx', op: '.045' },
];

export function polyArea(P) {
  let a = 0;
  for (let i = 0, n = P.length; i < n; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return Math.abs(a) / 2;
}

// Sutherland–Hodgman : ne garde que le demi-plan nx*x + ny*y <= d
function clipHalf(P, nx, ny, d) {
  const out = [], n = P.length;
  for (let i = 0; i < n; i++) {
    const A = P[i], B = P[(i + 1) % n];
    const da = nx * A[0] + ny * A[1] - d, db = nx * B[0] + ny * B[1] - d;
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
  let lo = -4000, hi = 4000;
  for (let i = 0; i < 64; i++) {
    const m = (lo + hi) / 2;
    if (polyArea(clipHalf(P, nx, ny, m)) < target) lo = m; else hi = m;
  }
  const d = (lo + hi) / 2;
  return [clipHalf(P, nx, ny, d), clipHalf(P, -nx, -ny, -d)];
}

function centroid(P) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0, n = P.length; i < n; i++) {
    const [x1, y1] = P[i], [x2, y2] = P[(i + 1) % n], f = x1 * y2 - x2 * y1;
    a += f; cx += (x1 + x2) * f; cy += (y1 + y2) * f;
  }
  a /= 2;
  return [cx / (6 * a), cy / (6 * a)];
}

// Longueur de la corde du polygone en v : `along` vaut 0 pour une corde
// verticale (hauteur disponible), 1 pour une corde horizontale (largeur).
function extent(P, v, along) {
  const a = along, b = 1 - along;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0, n = P.length; i < n; i++) {
    const A = P[i], B = P[(i + 1) % n];
    if ((A[a] <= v && B[a] >= v) || (B[a] <= v && A[a] >= v)) {
      const t = A[a] === B[a] ? 0 : (v - A[a]) / (B[a] - A[a]);
      const c = A[b] + t * (B[b] - A[b]);
      lo = Math.min(lo, c); hi = Math.max(hi, c);
    }
  }
  return hi > lo ? hi - lo : 0;
}

// Le libellé s'ajuste à sa parcelle, mesuré au centre de gravité et non sur la
// boîte englobante : sur une parcelle en biais la boîte promet une hauteur que
// le polygone n'a pas, et le sous-titre passe par-dessus le trait de division.
const CW = 0.62;   // largeur d'un caractère, en fraction du corps
export function fitLabel(P, cx, cy, nom, sub) {
  const bw = extent(P, cy, 1) * 0.88;
  const bh = extent(P, cx, 0);
  const size = t => bw / (t.length * CW);
  const fs = Math.max(6.4, Math.min(11.5, size(nom)));
  const ss = Math.max(5.2, Math.min(fs * 0.79, size(sub)));
  return { fs, ss, tight: bh < fs * 3.6 };   // trop plat pour deux lignes
}

export function buildPlate() {
  const w = id => MISSIONS.find(m => m.id === id).mois;

  // Deux colonnes. À gauche les quatre missions courtes, empilées dans l'ordre
  // chronologique ; à droite le SIF puis la parcelle libre. Les normales sont
  // franchement inclinées et toutes différentes : sans ça on obtient un
  // treemap, pas un plan cadastral.
  const colL = w('bici') + w('merc') + w('cart') + w('gsk');
  const colR = w('sif') + w('free');

  const [L, R] = splitPoly(HEX, 1, 0.11, colL / (colL + colR));
  const [bici, r1] = splitPoly(L, 0.13, 1, w('bici') / colL);
  const [merc, r2] = splitPoly(r1, -0.10, 1, w('merc') / (colL - w('bici')));
  const [cart, gsk] = splitPoly(r2, 0.07, 1, w('cart') / (w('cart') + w('gsk')));
  const [sif, free] = splitPoly(R, -0.12, 1, w('sif') / colR);

  const shapes = { bici, merc, cart, gsk, sif, free };
  return MISSIONS.map(m => {
    const poly = shapes[m.id];
    const [cx, cy] = centroid(poly);
    return { ...m, poly, cx, cy };
  });
}
```

- [ ] **Step 4: Run the check to verify it passes**

Run: `node scripts/plate-check.mjs`
Expected: `planche : 6 parcelles, aires conformes aux durées`

Then wire it into the gate — `package.json`:

```json
"plate": "node scripts/plate-check.mjs",
"verify": "pnpm run lint && pnpm run check && pnpm run build && pnpm run contrast && pnpm run plate"
```

- [ ] **Step 5: Write `src/components/Plate.astro`**

Labels live in `i18n/`, never in `plate.mjs`: the plate is bilingual, the geometry is not.

```astro
---
import { buildPlate, HEX } from '../lib/plate.mjs';
import { fitLabel } from '../lib/plate.mjs';
import { t, type Lang } from '../i18n/utils';
const { lang } = Astro.props as { lang: Lang };
const s = t(lang);
const pts = P => P.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
const parcels = buildPlate().map(p => {
  const l = s.plate.parcels[p.id];
  return { ...p, ...l, ...fitLabel(p.poly, p.cx, p.cy, l.nom, l.sub) };
});
---
<div class="plate">
  <svg viewBox="-16 -18 632 556" role="img" aria-label={s.plate.alt}>
    <g class="tick" id="ticks" opacity="0">
      <path d="M-10 8 L-10 -10 L8 -10"/><path d="M592 -10 L610 -10 L610 8"/>
      <path d="M610 512 L610 530 L592 530"/><path d="M8 530 L-10 530 L-10 512"/>
    </g>
    <g id="washes">
      {parcels.map(p => (
        <g class="pgroup" id={p.id === 'free' ? 'free' : undefined}>
          <polygon class="parcel" points={pts(p.poly)} fill={`var(--${p.role})`} data-op={p.op} />
          {p.id === 'free' && <polygon class="free-ring" points={pts(p.poly)} />}
          <g class={p.id === 'free' ? 'free-main' : undefined}>
            <text class="plbl" x={p.cx} y={p.tight ? p.cy + p.fs * 0.34 : p.cy - p.fs * 0.32}
                  text-anchor="middle" style={`font-size:${p.fs.toFixed(1)}px`} data-lbl>{p.nom}</text>
            {!p.tight && (
              <text class="plbl sub" x={p.cx} y={p.cy + p.fs * 0.32 + p.ss + 2}
                    text-anchor="middle" style={`font-size:${p.ss.toFixed(1)}px`} data-lbl>{p.sub}</text>
            )}
          </g>
          {p.id === 'free' && (
            <text class="plbl free-hint" x={p.cx} y={p.cy + 3} text-anchor="middle"
                  fill="var(--or-t)" style={`font-size:${p.fs.toFixed(1)}px`}>{s.plate.hint}</text>
          )}
        </g>
      ))}
    </g>
    <g id="lines">
      {/* Le contour de chaque parcelle fait le trait de division. Les arêtes
          partagées sont tracées deux fois : sans conséquence visuelle, et ça
          évite de tenir un graphe d'adjacence pour rien. */}
      {parcels.map(p => <path class="line div" d={`M${pts(p.poly).replaceAll(' ', ' L')} Z`} />)}
      <path class="line outer" d={`M${pts(HEX).replaceAll(' ', ' L')} Z`} />
      <path class="line outer" stroke="var(--or)"
            d={`M${pts(parcels.find(p => p.id === 'sif').poly).replaceAll(' ', ' L')} Z`} />
    </g>
    <g id="annos" opacity="0">
      <path class="tick" d="M34,518 v-26 l-6 9 m6-9 l6 9"/>
      <text class="anno" x="46" y="515">N</text>
      <text class="anno" x="82" y="515">{s.plate.scale}</text>
      <text class="anno" x="366" y="515">{s.plate.total}</text>
      <text class="anno" x="452" y="-4">{s.plate.sheet}</text>
    </g>
  </svg>
  <ul class="plate-key">
    {s.plate.keys.map(([k, v]) => <li><i style={`background:var(--${k})`}></i>{v}</li>)}
    <li><i class="free-key"></i>{s.plate.keyFree}</li>
  </ul>
</div>
```

Scoped styles copy `.parcel`, `.pgroup:hover`, `.line`, `.plbl`, `.anno`, `.tick`, `.free-ring`,
`.free-key`, `.plate-key` verbatim from `docs/superpowers/reference/preview.html`.

- [ ] **Step 6: Resolve risk #1 — the plate is unreadable at 390 px**

**Mandatory in this task, not deferred.** Add to the scoped styles:

```css
@media (max-width: 767px) {
  .plate { margin-inline: calc(var(--gut) * -1); }   /* full-bleed */
  .plbl.sub { display: none; }                        /* dates removed, names kept */
  .plbl { font-size: 15px !important; }               /* écrase le corps calculé */
  .anno, #ticks { display: none; }                    /* sheet marks are noise here */
}
```

The `!important` is load-bearing: the fitted size is an inline style, and only `!important` beats it.

- [ ] **Step 7: Verify at three widths**

Run: `pnpm run dev`, then in DevTools check 390 px, 768 px, 1440 px.
Expected at 390 px: the plate spans the full viewport width; the six parcel names are readable;
no date labels; no north arrow; **no horizontal page scroll**.

- [ ] **Step 8: Commit**

```bash
git add src/lib/plate.mjs scripts/plate-check.mjs src/components/Plate.astro package.json
git commit -m "feat: cadastral plate with areas computed from mission durations"
```

---

## Task 7: Hero, authority band, cartouche

**Files:**
- Create: `src/components/Hero.astro`, `src/components/AuthorityBand.astro`, `src/components/Cartouche.astro`

**Interfaces:**
- Consumes: `Plate.astro` (Task 6), `t(lang)` (Task 5)
- Produces: `<Hero lang portrait?={ImageMetadata} />` — when `portrait` is absent the plate occupies the right column; when present the portrait takes that column and the plate moves full-width below the hero.

- [ ] **Step 1: Write `Hero.astro` with the two-faced layout**

```astro
---
import { Image } from 'astro:assets';
import Plate from './Plate.astro';
import { t, type Lang } from '../i18n/utils';
const { lang, portrait } = Astro.props as { lang: Lang; portrait?: ImageMetadata };
const s = t(lang);
---
<div class="hero wrap">
  <div class="hero-grid">
    <div>
      <div class="stagger" id="heroA">
        <p class="status"><span class="dot"></span>{s.status}</p>
      </div>
      <div class="stagger" id="heroB">
        <h1>{s.hero.title} <em>{s.hero.titleAccent}</em>.</h1>
        <p class="lead">{s.hero.lead}</p>
        <p class="meta">{s.hero.places.map(p => <span>{p}</span>)}</p>
        <div class="cta">
          <a class="btn btn-1" href="/cv/CV_Lionel_Ratovo.pdf" download>{s.hero.ctaCv}</a>
          <a class="btn btn-2" href="#contact">{s.hero.ctaContact}</a>
        </div>
      </div>
    </div>
    {portrait
      ? <Image src={portrait} alt={`Lionel Ratovo`} widths={[420, 840]} sizes="(max-width: 960px) 90vw, 40vw" loading="eager" />
      : <Plate lang={lang} />}
  </div>
  {portrait && <div class="plate-below"><Plate lang={lang} /></div>}
</div>
```

- [ ] **Step 2: Write `AuthorityBand.astro`**

Four real names. **BICI is deliberately excluded**: a two-month mission does not carry authority, and a weak fifth name dilutes the four strong ones.

The band no longer sits under the hero. It opens movement 03 (Task 8), immediately before the case studies, where the names introduce the work rather than interrupting the identity.

```astro
---
const { lang } = Astro.props;
const fr = lang === 'fr';
const items = [
  { kicker: fr ? "Côte d'Ivoire" : "Côte d'Ivoire", name: fr ? "Ministère de l'Urbanisme" : 'Ministry of Urban Planning' },
  { kicker: fr ? 'Compte data' : 'Data account', name: 'GlaxoSmithKline' },
  { kicker: fr ? 'Compte data' : 'Data account', name: 'Cartier' },
  { kicker: fr ? 'Production web' : 'Web production', name: 'Mercedes-Benz' },
];
---
```

- [ ] **Step 3: Write `Cartouche.astro`**

Six cells, **all of career-wide scope**. This is the fix for Lionel's second remark `[F8]`: the v3
cartouche mixed three scopes in one row, and « 9 schémas » with no context means nothing. The SIF
numbers move into the SIF case study (Task 9), where they have one.

| Cell | Value | `sourceRef` |
|---|---|---|
| En activité depuis | 2021 | EXPÉRIENCE |
| Missions | 5 | EXPÉRIENCE |
| Terrain | Côte d'Ivoire · Maurice · Madagascar | EXPÉRIENCE |
| Formation | Master MIAGE · MBDS | D1 |
| Langues | Malagasy · Français · Anglais | D3 |
| Disponibilité | Ouvert aux opportunités | décision |

The first two carry `--or-t` in Bricolage Grotesque 760 — they anchor the perception of scale
before any scrutiny.

**« 2021 », not « 5 ans ».** November 2021 to August 2026 is four years and nine months; a start
date never drifts and never overstates.

- [ ] **Step 4: Verify no forbidden pattern crept in**

Run:
```bash
pnpm run build
grep -rnE "linkedin|github\.com/[Ll]ionel|satisfaction|projets réalisés" dist/ || echo "clean"
```
Expected: `clean`. Global constraint 3 forbids social links; constraint 5 forbids vanity counters.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/AuthorityBand.astro src/components/Cartouche.astro
git commit -m "feat: hero with optional portrait, authority band, cartouche"
```

---

## Task 8: Offer, thread, timeline, contact fork, and the assembled French home page

**Files:**
- Create: `src/components/Offer.astro`, `src/components/Thread.astro`, `src/components/Timeline.astro`, `src/components/ContactFork.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: every component from Tasks 6–7
- Produces: a complete French home page at `/`

- [ ] **Step 1: Write `Offer.astro`** — four services in a two-column grid, each carrying
`--role` (text colour) and `--fill` (bar colour), with a 44 px rule that draws in on scroll.

This replaces the three « cadrer · construire · livrer » panels. Lionel's objection `[F5]` was that
all three described the SIF, so the page argued one mission and called it a method.

**The binding rule: each service is proved by a different mission.** It is mechanical, not
editorial — it is what keeps the page from sliding back into a monologue.

| # | Service | Rôle | Preuve « sur le terrain » |
|---|---|---|---|
| 01 | API et backend métier | `or` | SIF · chaque écriture passe par un moteur de règles Drools avant d'atteindre la base |
| 02 | Modélisation et optimisation SQL | `tl` | GSK · transformation et analyse des données marketing du groupe, requêtes optimisées dont les résultats portent sur des milliers de lignes |
| 03 | Reprise de l'existant | `lv` | Cartier · flux Salesforce repris tels quels. BICI · quatre applications sous framework interne |
| 04 | Conduite technique | `yw` | Mercedes-Benz · coordination interne de l'équipe de Madagascar, sur une production répartie entre deux pays |

Body copy verbatim from `docs/superpowers/reference/preview.html`. **Check every string for em
dashes before committing.**

- [ ] **Step 1b: Write `Thread.astro`** — the bordered block that closes movement 03.

« Reprendre l'existant » is not a fourth case study: BICI is two months and would not carry one.
It is what runs through all three, which is the honest and stronger claim.

| Chip | Rôle | Texte |
|---|---|---|
| SGFH → SIF | `or` | migrer une application foncière en service, sans l'arrêter |
| Cartier | `tl` | reprendre des flux Salesforce en place, sans les refaire |
| BICI | `lv` | quatre applications sous framework interne, sans documentation |

- [ ] **Step 2: Write `Timeline.astro`** — four entries, facts from `CV_Lionel_Ratovo_MASTER.md`:

| Role | Employer | Place | Dates |
|---|---|---|---|
| Développeur & Appui technique | Consultant IGN FI | Abidjan, Côte d'Ivoire | Janvier 2024 – Présent |
| Data Engineer, puis Webmaster | Consultant RAPP IO Mauritius | Madagascar & Maurice | Décembre 2021 – Janvier 2024 |
| Développeur applicatif | Consultant BICI | Antananarivo | Novembre 2021 – Décembre 2021 |
| Master MIAGE MBDS · Licence informatique | Université Côte d'Azur & IT University | Antananarivo | 2022–2023 · 2019–2021 |

- [ ] **Step 3: Write `ContactFork.astro`** on the inverted surface, two doors with `--role` set to `--or-inv` and `--tl-inv`.

The project door reads: *"Je peux venir seul. Et si le chantier dépasse une personne, nous sommes trois : NEXTRI, collectif d'ingénieurs à Antananarivo."* — capacity, never references. Global constraint 4.

- [ ] **Step 4: Assemble `src/pages/index.astro`**

Order, fixed by Global Constraints `[F9]`:

```
Hero (planche incluse)
01  Qui je suis      → paragraphes + Cartouche + lien NEXTRI
02  Ce que j'offre   → Offer
    AuthorityBand    → pleine largeur, ouvre le mouvement suivant
03  Ce que j'ai accompli → cas (placeholder ici, remplis en tâche 10) + Thread + Timeline
04  Comment me contacter → ContactFork
```

The NEXTRI bridge appears **twice**, and that is deliberate `[F12]`: once in movement 01 as part of
who he is, once in movement 04 as the door. Lionel asked for it higher; a single mention at the
bottom was the whole problem.

- [ ] **Step 5: Verify the build and the whole gate**

Run: `pnpm run verify`
Expected: lint clean, `astro check` 0 errors, build succeeds, contrast passes.

- [ ] **Step 6: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "feat: approach, timeline, contact fork, French home page assembled"
```

---

## Task 9: Content collections with enforced traceability

**Files:**
- Create: `src/content.config.ts`, `src/content/cases/fr/{sif,data,web}.md`

**Interfaces:**
- Produces: `getCollection('cases')` returning entries typed by the schema below. Consumed by Task 10.

- [ ] **Step 1: Write the failing test — a case file missing `sourceRefs`**

Create `src/content/cases/fr/sif.md` with frontmatter deliberately lacking `sourceRefs`, then write `src/content.config.ts`.

**The file path matters.** Astro 7 loads `src/content.config.ts`; the old `src/content/config.ts` is ignored silently, which looks exactly like a schema that is not being enforced.

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  // Content Layer API. There is no `type: 'content'` in Astro 7.
  // base is the cases directory, so an entry's id is "fr/sif" or "en/sif".
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  // Only fields that cannot be derived from somewhere else.
  //   lang    -> the fr/ or en/ directory already encodes it
  //   weight  -> order === 1 is the major case
  //   diagram -> dispatched on the slug
  // Every one of those was a second source of truth waiting to disagree.
  schema: z.object({
    order: z.number().int().positive(),
    role: z.enum(['or', 'tl', 'yw', 'lv']),
    client: z.string().min(1),
    period: z.string().min(1),
    stack: z.array(z.string()).min(1),
    title: z.string().min(1).max(80),
    teaser: z.string().min(1).max(280),
    // Content rule 6, made mechanical: no case ships without declaring its sources.
    sourceRefs: z.array(z.string().regex(/^[A-E]\d$|^[A-ZÉ]+$/)).min(1),
  }),
});

export const collections = { cases };
```

- [ ] **Step 2: Run to verify the build fails**

Run: `pnpm run build`
Expected: FAIL with `cases → fr/sif: sourceRefs: Required`. **This failure is the feature.** A case cannot ship without declaring where its facts come from.

- [ ] **Step 3: Write the three French case files**

`sif.md`:

```markdown
---
order: 1
role: or
client: "Ministère de l'Urbanisme · Côte d'Ivoire"
period: "2024 →"
stack: ["Java", "PostgreSQL", "Drools", "ExtJS"]
title: "Migrer un cadastre national sans arrêter le service"
teaser: "Le SGFH devait devenir le SIF. Neuf schémas PostgreSQL, un portail public qui ne fait que lire, et les bases d'autres services de l'État qu'il faut à la fois consulter et alimenter. La mise en production de novembre 2024 était le vrai défi du projet."
sourceRefs: ["A1", "A2", "A3", "A4", "A6", "F1", "F2", "F3", "F4"]
---

## L'enjeu
Le Système de Gestion du Foncier et de l'Habitat devait devenir le Système
d'Information Foncier, avec de nombreuses améliorations fonctionnelles, pour le
Ministère de l'Urbanisme, du Logement et du Cadre de Vie de Côte d'Ivoire.

## La contrainte
Neuf schémas PostgreSQL. Le principal, innola, compte 150 tables ; le schéma
public, 59. Le SIF lit et écrit dans les bases d'autres services de l'État, et
chaque action CRUD passe par des contraintes métier validées via Drools.

Le portail SIGFU est une application distincte, en Angular et NestJS, avec sa
propre base. Il ne touche jamais celle du SIF : il tire ce dont il a besoin par
les API du SIF, en lecture seule.

## Ce que j'ai fait
Conçu et développé les interfaces des applications métier des gestionnaires
fonciers, et celles du portail web ouvert au grand public, utilisé par plus de
cent usagers.

Porté en atelier les attentes du client auprès de l'équipe technique, au sein
d'une équipe de neuf développeurs et trois testeurs.

Assuré l'estimation des tâches et le suivi du calendrier de livraison, en appui
au chef d'équipe sur la charge et les ressources.

## Ce qui a tenu
La mise en production de novembre 2024. C'était le défi du projet, et il est
réussi.
```

`data.md` — `order: 2`, `role: tl`, `sourceRefs: ["B1","B3","F5","F6"]`,
`client: "RAPP IO · GSK · Cartier"`, `period: "2022 · 2024"`,
`stack: ["SQL", "Salesforce"]`.

**Title: « Deux comptes data, des flux qu'on ne peut pas casser »** — two, not three. The v3
mock-up said three; Mercedes-Benz is webmastering and owns case 3 `[F6]`. This correction is
mandatory and CI guards it (Step 5).

`web.md` — `order: 3`, `role: yw`, `sourceRefs: ["B2","F6","F7"]`,
`client: "RAPP IO · Mercedes-Benz"`, `period: "2021 · 2022"`, `stack: ["AEM"]`.

**Title: « Publier du web à l'échelle d'un constructeur »**. Production and publication of web
content under AEM, plus internal coordination of the Madagascar team with a colleague, on a
production split between Mauritius and Madagascar.

**Do not write that he did web production in Mauritius** `[F7]`. He did not, in development terms.
The v3 mock-up attributed that work to BICI, which was wrong twice over: wrong mission, wrong
nature of work.

BICI gets no case file. Two months does not carry a case study, and « reprendre l'existant » is
better served as the cross-case thread built in Task 8.

- [ ] **Step 4: Run to verify the build passes**

Run: `pnpm run build && pnpm exec astro check`
Expected: build succeeds, 0 errors.

- [ ] **Step 5: Guard against the wrong count regressing**

Run:
```bash
grep -rniE "trois marques|three brands|oracle" src/content/ && echo "REGRESSION" || echo "clean"
```
Expected: `clean`. Two data brands, not three; PostgreSQL, not Oracle.

- [ ] **Step 6: Commit**

```bash
git add src/content
git commit -m "feat: case collections with mandatory sourceRefs, three French cases"
```

---

## Task 10: Case pages and diagrams

**Files:**
- Create: `src/layouts/Case.astro`, `src/pages/cas/[slug].astro`, `src/components/CaseDiagram.astro`, `src/components/CaseCard.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `getCollection('cases')` (Task 9)
- Produces: `/cas/sif/`, `/cas/data/`, `/cas/web/`

- [ ] **Step 1: Write `src/pages/cas/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import Case from '../../layouts/Case.astro';

export async function getStaticPaths() {
  const all = await getCollection('cases', e => e.id.startsWith('fr/'));
  // entry.id is already extension-free and URL-friendly: "fr/sif" -> "sif"
  return all.map(entry => ({ params: { slug: entry.id.replace(/^fr\//, '') }, props: { entry } }));
}
const { entry } = Astro.props;
const { Content } = await render(entry);   // not entry.render(), removed in Astro 6
---
<Case lang="fr" entry={entry}><Content /></Case>
```

- [ ] **Step 2: Write `CaseDiagram.astro`** — dispatch on the case slug, one SVG per case. No frontmatter field is needed: three cases, three slugs, three diagrams.

The `sif` diagram is copied verbatim from `docs/superpowers/reference/preview.html`, where it was
redrawn from Lionel's own hand-drawn schema `[F2]`, `[F3]`, `[F4]`. It has three parts, and the
relationships between them are the point:

```
PORTAIL SIGFU (public)              SIF
  Angular                             ExtJS
    ↓                                   ↓
  NestJS  ←── lecture seule ────      API Java ⇄ Drools (métier)
    ⇅         via les API SIF             ⇅
  PostgreSQL (propre)                 PostgreSQL · 9 schémas
                                          ⇅  lecture ET écriture
                                    BDD autres services de l'État
```

**Do not draw the portal as a client of the SIF backend.** It is a separate application with its
own database, and it reads the SIF through its API, read-only. The link to other State services
runs **both ways**. The v3 diagram got both wrong.

**Critical:** accent colours must use `style="stroke:var(--or)"`, not `stroke="var(--or)"`. A
presentation attribute loses to the `.dg-node` class rule, which is exactly the bug found in the
mock-up on 31/07/2026.

- [ ] **Step 3: Write `CaseCard.astro`** for the major case only, and inline the two minor cards directly in `index.astro`. The minor card is six lines of markup with one consumer; a variant prop and a branch cost more than the duplication saves. Sort by `order`; `order === 1` is the major one.

- [ ] **Step 4: Verify all three pages render**

Run: `pnpm run build && ls dist/cas/*/index.html`
Expected: three files listed. Astro fails the build on a bad `getStaticPaths`, so a separate link checker earns nothing on ten hand-written, dictionary-driven links.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Case.astro src/pages/cas src/components/CaseDiagram.astro src/components/CaseCard.astro src/pages/index.astro
git commit -m "feat: case study pages with per-case SVG diagrams"
```

---

## Task 11: Motion layer

**Files:**
- Create: `src/styles/motion.css`, `src/scripts/motion.ts`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Produces: scroll-driven animation for `.rv`, `#chain i`, `.plate svg`, `.sec-head h2`, `.auth-list > span`, `.cell`, `.of::before`, `.th-items > span`, `.dg-l`, `.door::before`, `header`

- [ ] **Step 1: Write `motion.css`**

Copy the entire `@media (prefers-reduced-motion:no-preference) { @supports (animation-timeline: view()) { … } }` block verbatim from `docs/superpowers/reference/preview.html`. The animation ranges were tuned against real scroll measurements; do not adjust them.

**Do not copy the `@media (prefers-reduced-motion: reduce)` reset block.** It already lives in `src/styles/base.css`, next to the transitions it governs. Task 3's review caught that the split had left it ownerless: the mock-up carried it in one stylesheet, and neither this task nor Task 3 had claimed it. Duplicating it here would give two copies to keep in step.

- [ ] **Step 2: Write `motion.ts` — fallback only**

```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const native = CSS.supports('animation-timeline: view()') && !reduce;

if (!native) {
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  for (const el of document.querySelectorAll('.rv')) io.observe(el);

  const chain = document.querySelector<HTMLElement>('#chain i');
  if (chain) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - innerHeight;
        chain.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
        ticking = false;
      });
    }, { passive: true });
  }
}
```

- [ ] **Step 3: Add the plate entry animation**

Copy `drawPlate()` and `playHero()` verbatim from `docs/superpowers/reference/preview.html`. Timings: line draw 700–1000 ms with 95 ms stagger; parcels 600 ms with 110 ms stagger.

**Do not port `splitHeading()`.** The mock-up split the `h1` into eleven word spans to stagger them, which is twenty-five lines of DOM surgery for half a second of effect. The `h1` is already inside `#heroB`, which carries `.stagger`, so it fades and rises as a block for free. The plate drawing itself is the entry moment; the heading does not need to compete with it.

- [ ] **Step 4: Verify the animations are genuinely scroll-linked**

Write `tests/motion.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('chain progress tracks scroll position continuously', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3500);
  const at = async (pct: number) => {
    await page.evaluate(p => { const h = document.documentElement.scrollHeight - innerHeight; scrollTo(0, h * p); }, pct);
    await page.waitForTimeout(300);
    const tr = await page.locator('#chain i').evaluate(el => getComputedStyle(el).transform);
    const m = tr.match(/matrix\(([-\d.]+)/);
    return m ? Number(m[1]) : Number(getComputedStyle_width_fallback());
  };
  expect(await at(0)).toBeLessThan(0.05);
  expect(await at(0.5)).toBeGreaterThan(0.4);
  expect(await at(1)).toBeGreaterThan(0.95);
});

test('reduced motion leaves all content visible', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  for (const el of await page.locator('.rv').all()) await expect(el).toBeVisible();
  await ctx.close();
});
```

Run: `pnpm exec playwright test tests/motion.spec.ts`
Expected: both pass in chromium **and** firefox. Firefox exercises the `IntersectionObserver` fallback; if `.rv` elements are invisible there, the fallback is broken.

- [ ] **Step 5: Commit**

```bash
git add src/styles/motion.css src/scripts/motion.ts src/layouts/Base.astro tests/motion.spec.ts
git commit -m "feat: scroll-driven motion with IntersectionObserver fallback"
```

---

## Task 12: Damped scrolling

**Files:**
- Create: `src/scripts/smooth-scroll.ts`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- Produces: `Smooth.to(y: number): void`, used by anchor links

- [ ] **Step 1: Write `smooth-scroll.ts`**

```ts
const EASE = 0.085, THRESHOLD = 0.35;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;
const active = fine && !reduce;

let target = 0, current = 0, running = false, driving = false;
const max = () => document.documentElement.scrollHeight - innerHeight;
const clamp = (v: number) => Math.max(0, Math.min(max(), v));

function loop() {
  const diff = target - current;
  if (Math.abs(diff) < THRESHOLD) { current = target; running = false; }
  else { current += diff * EASE; }
  driving = true; scrollTo(0, current); driving = false;
  if (running) requestAnimationFrame(loop);
}
function start() { if (!running) { running = true; requestAnimationFrame(loop); } }

export function to(y: number) {
  if (!active) { scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); return; }
  target = clamp(y); start();
}

if (active) {
  target = current = scrollY;
  document.documentElement.style.scrollBehavior = 'auto';
  addEventListener('wheel', e => {
    if (e.ctrlKey) return;                       // pinch zoom must stay native
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1;
    target = clamp(target + e.deltaY * unit);
    start();
  }, { passive: false });
  // Resync when the user scrolls by other means: scrollbar drag, keyboard, find-in-page.
  addEventListener('scroll', () => { if (!driving && !running) target = current = scrollY; }, { passive: true });
  addEventListener('resize', () => { target = clamp(target); }, { passive: true });
}

for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')) {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href')!);
    if (!el) return;
    e.preventDefault();
    to(el.getBoundingClientRect().top + scrollY - 70);
  });
}
```

`scroll-behavior: auto` is set deliberately: with `smooth` active, the per-frame `scrollTo` would fight the browser's own interpolation.

- [ ] **Step 2: Verify the damping produces gradual motion**

Add to `tests/motion.spec.ts`:

```ts
test('wheel scrolling is damped, not instant', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(3500);
  await page.evaluate(() => { (window as any).__s = []; const f = () => { (window as any).__s.push(Math.round(scrollY)); if ((window as any).__s.length < 70) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1200);
  const frames: number[] = await page.evaluate(() => (window as any).__s);
  expect(new Set(frames).size).toBeGreaterThan(20);   // native scrolling yields 2
});
```

Run: `pnpm exec playwright test tests/motion.spec.ts --project=chromium`
Expected: PASS, with well over 20 distinct frames. The measurement on 31/07/2026 gave **59** damped versus **2** native.

- [ ] **Step 3: Commit**

```bash
git add src/scripts/smooth-scroll.ts src/layouts/Base.astro tests/motion.spec.ts
git commit -m "feat: dependency-free damped scrolling, pointer-fine only"
```

---

## Task 13: English locale

**Files:**
- Create: `src/pages/en/index.astro`, `src/pages/en/cas/[slug].astro`, `src/content/cases/en/*.md`, `src/components/LangSwitch.astro`, `tests/i18n.spec.ts`

- [ ] **Step 1: Write the failing test — `tests/i18n.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test('language switch lands on the equivalent page, never home', async ({ page }) => {
  await page.goto('/cas/data/');
  await page.click('#lang-switch');
  await expect(page).toHaveURL(/\/en\/cas\/data\/$/);
  await page.click('#lang-switch');
  await expect(page).toHaveURL(/\/cas\/data\/$/);
});

test('every page declares reciprocal hreflang', async ({ page }) => {
  for (const path of ['/', '/en/', '/cas/sif/', '/en/cas/sif/']) {
    await page.goto(path);
    await expect(page.locator('link[hreflang="fr"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="en"]')).toHaveCount(1);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveCount(1);
  }
});

// Slugs are identical in both locales: /cas/sif/ and /en/cas/sif/.
// Translating them would buy nothing on a five-page site and would need a
// lookup table that can fall out of sync with the filenames.
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm exec playwright test tests/i18n.spec.ts --project=chromium`
Expected: FAIL — no `#lang-switch`, no `hreflang`.

- [ ] **Step 3: Write `LangSwitch.astro`** using `altPath()` from Task 5, and emit `hreflang` links in `Base.astro`, with `x-default` pointing to the French URL.

- [ ] **Step 4: Write `src/pages/en/*` and translate the three cases.**

- [ ] **Step 5: Run to verify it passes**

Run: `pnpm exec playwright test tests/i18n.spec.ts`
Expected: 2 passed on both browsers.

- [ ] **Step 6: Commit**

```bash
git add src/pages/en src/content/cases/en src/components/LangSwitch.astro tests/i18n.spec.ts
git commit -m "feat: English locale with reciprocal hreflang and equivalent-page switching"
```

---

## Task 14: SEO metadata, sitemap, 404

**Files:**
- Create: `src/pages/404.astro`
- Modify: `src/layouts/Base.astro`, `astro.config.mjs`

**Cut from this task, deliberately:**
- **The legal notice.** A French `mentions légales` obliges publishers established in France. The publisher is established in Madagascar and the site is hosted on GitHub Pages, sets no cookie and runs no tracker. Two pages, two translations and a footer link for an obligation that does not apply.
- **The print stylesheet.** The one thing a visitor would want on paper is the CV, and the hero has a button that downloads it as a PDF. Add a print sheet the day someone reports printing the page.

- [ ] **Step 1: Add `@astrojs/sitemap`**

```bash
pnpm exec astro add sitemap --yes
```

- [ ] **Step 2: Add JSON-LD to `Base.astro`**

**No `sameAs` property.** Global constraint 3: Lionel has no social profiles, and inventing one would be a fabricated fact.

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sarobidy Marie Lionel Ratovo',
  jobTitle: 'Technical Project Lead · Backend & Data Engineer',
  email: 'mailto:lionelratovo@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Antananarivo', addressCountry: 'MG' },
  knowsLanguage: ['mg', 'fr', 'en'],
  alumniOf: { '@type': 'CollegeOrUniversity', name: "Université Côte d'Azur" },
})} />
```

- [ ] **Step 3: Write `404.astro`**

GitHub Pages serves `404.html` for any unmatched path. Title, one line, and a link home in French.

- [ ] **Step 4: Verify**

Run: `pnpm run build && ls dist/sitemap-index.xml dist/404.html`
Expected: both files listed.

- [ ] **Step 5: Commit**

```bash
git add src/pages astro.config.mjs
git commit -m "feat: SEO metadata, sitemap, 404 page"
```

---

## Task 15: CI, deployment, and the final gate

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `tests/flows.spec.ts`

- [ ] **Step 1: Write `tests/flows.spec.ts` — the remaining critical flow**

```ts
import { test, expect } from '@playwright/test';

test('CV downloads and the phone reveals on click', async ({ page }) => {
  await page.goto('/');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click('text=Télécharger le CV')]);
  expect(dl.suggestedFilename()).toMatch(/\.pdf$/);

  await expect(page.locator('.phone-live')).toHaveCount(0);
  await page.click('#phone-reveal');
  await expect(page.locator('.phone-live')).toHaveAttribute('href', /^tel:\+261/);
});
```

- [ ] **Step 1b: Write `scripts/js-budget.mjs`**

The obvious guard, `find dist -name '*.js' | gzip | wc -c`, is **green by
construction and therefore worse than no guard at all**: Astro inlines a script
this small straight into the HTML, so `find` matches nothing and the check
reports zero bytes forever. Measured on the real build, the shipped JavaScript
is 1350 bytes gzipped, all of it inline.

```js
import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET = 6144;
// Inline scripts count. They are the only ones this site ships today, and a
// guard that misses them is a guard that can never fail.
const INLINE = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;

let total = 0;
for (const f of globSync('dist/**/*.html')) {
  for (const [, body] of readFileSync(f, 'utf8').matchAll(INLINE)) {
    total += gzipSync(body).length;
  }
}
for (const f of globSync('dist/**/*.js')) total += gzipSync(readFileSync(f)).length;

console.log(`JavaScript livre : ${total} octets gzip (budget ${BUDGET})`);
assert.ok(total < BUDGET, `budget JavaScript depasse : ${total} > ${BUDGET}`);
```

Wire it into `package.json`:

```json
"budget": "node scripts/js-budget.mjs",
"verify": "pnpm run lint && pnpm run check && pnpm run build && pnpm run contrast && pnpm run plate && pnpm run budget"
```

Prove it can fail before trusting it: drop `BUDGET` to 100, confirm it exits
non-zero and prints the real figure, then restore it.

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

```yaml
name: ci
on: [push, pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run check
      - run: pnpm run build
      - run: pnpm run contrast
      - run: pnpm exec playwright install --with-deps chromium firefox
      - run: pnpm test
      - name: No social links, no vanity metrics, no bare phone
        run: |
          ! grep -rqiE "linkedin\.com|github\.com/[Ll]ionel|XX XX XXX" dist/
      - run: pnpm run budget
```

The two shell steps are the content and performance constraints enforced by CI rather than by discipline. They cost a second and catch the two regressions that would otherwise ship silently.

**No Lighthouse CI.** It is the heaviest step in the pipeline, and on a ten-page static site with no runtime JavaScript the score barely moves between commits. The budgets in the spec remain the target; check them with one manual Lighthouse run before going live, and again whenever the fonts or the plate change.

**No `linkinator`.** A dependency to check ten links that are all generated from a typed dictionary, on a build that already fails when `getStaticPaths` is wrong.

- [ ] **Step 3: Write `.github/workflows/deploy.yml`** — build then `actions/deploy-pages@v4` on `main`.

- [ ] **Step 4: Run the full gate locally**

Run: `pnpm run verify && pnpm test`
Expected: everything green.

Then one manual Lighthouse pass on the built site, against the spec budgets (≥ 95 on all four axes, LCP < 1.5 s, CLS < 0.02):

```bash
pnpm dlx serve dist -l 4322 &
pnpm dlx lighthouse http://localhost:4322 --preset=desktop --view
```

- [ ] **Step 5: Commit and push**

```bash
git add .github tests/flows.spec.ts
git commit -m "ci: verification gate and GitHub Pages deployment"
git push -u origin main
```

---

## Self-Review

**1. Spec coverage.** Every spec section maps to a task: §1.5 → T2 · §1.6 → T3 · §1.7 → T11, T12 · §1.8 → T4 · §1.9 → T3, T4, T11 · §2.1 → T8, T10, T13, T14 · §2.3 → T6, T7, T8 · §2.4/2.5 → T9, T10 · §2.6 → T4 (no-JS), T6 (mobile), T11 (reduced motion, Firefox), T13 (EN fallback), T14 (404) · §3.3 → T9 · §3.4 → T5, T13 · §3.7 → T15 · §3.8 → T5, T14 · §3.9/3.10 → T15. Risk #1 is resolved inside T6 rather than deferred.

**2. Placeholder scan.** No TBD, no "handle edge cases", no "similar to Task N". Two components (`AuthorityBand`, `Approach`) are specified by their data tables and copy rather than by full markup, because their markup is mechanical given the data — the values themselves are all present.

**3. Type consistency.** `Lang`, `t()`, `getLang()` and the one-argument `altPath()` are defined in T5 and used identically in T6, T7, T13. `Smooth.to()` is exported in T12 and used only there. Collection field names in T9 match their consumption in T10. `sourceRefs` is spelled identically in the spec, the schema, and the case files.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-31-portfolio-lionel-ratovo.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints
