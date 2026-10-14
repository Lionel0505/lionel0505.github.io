import { expect, type Page, test } from '@playwright/test';

// Un seul ratio couvre les deux chemins : natif (scaleX sur une barre à
// 100 %) comme repli (transform lui aussi, depuis la correction du filet de
// layout). getBoundingClientRect intègre la transformation, donc la largeur
// rendue est la même mesure dans les deux.
const ratio = (page: Page) =>
  page.locator('#chain i').evaluate((el) => {
    const p = el.parentElement as HTMLElement;
    return el.getBoundingClientRect().width / p.getBoundingClientRect().width;
  });

// toBeVisible() de Playwright ne regarde ni l'opacité ni la transformation :
// un bloc à opacity:0 le satisfait. Or c'est exactement l'état que cette
// tâche rend impossible, donc la mesure porte sur l'opacité calculée.
const minOpacity = (page: Page) =>
  page
    .locator('.rv')
    .evaluateAll((els) => Math.min(...els.map((el) => Number(getComputedStyle(el).opacity))));

// Le héros est mesuré à part : #heroA et #heroB portent `.stagger`, pas `.rv`,
// donc minOpacity ci-dessus ne les a jamais vus. Or `.stagger > *` est caché
// par motion.css et n'est révélé que par playHero() dans motion.ts, sans
// chemin natif ni IntersectionObserver de secours. La seule assertion qui
// existait sur le héros était un toBeVisible(), qui ne regarde pas l'opacité.
const minStaggerOpacity = (page: Page) =>
  page
    .locator('.stagger > *')
    .evaluateAll((els) => Math.min(...els.map((el) => Number(getComputedStyle(el).opacity))));

// Par paliers, et non d'un saut : un IntersectionObserver ne rapporte que ce
// qui coupe le viewport à la frame suivante, donc un saut de 0 à 100 %
// sauterait les blocs traversés au passage. La timeline native, elle, n'a
// besoin d'aucun de ces paliers pour se tenir à jour ; on les garde quand
// même ici pour que le même parcours vaille dans les deux moteurs.
const scrollThrough = async (page: Page) => {
  for (let i = 0; i <= 10; i++) {
    await page.evaluate((p) => {
      const h = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, h * p);
    }, i / 10);
    await page.waitForTimeout(180);
  }
};

// La version animée suppose un GPU : sans lui (CI, Firefox headless), Base.astro
// pose data-motion="lite". Les tests du mouvement forcent le verdict mémorisé (motion-probe.ts).
const animated = (page: import('@playwright/test').Page) =>
  page.addInitScript(() => localStorage.setItem('weak', '0'));

test('la chaîne suit la position de défilement', async ({ page }) => {
  await animated(page);
  await page.goto('/');
  await page.waitForTimeout(3500);
  const at = async (pct: number) => {
    await page.evaluate((p) => {
      const h = document.documentElement.scrollHeight - innerHeight;
      scrollTo(0, h * p);
    }, pct);
    await page.waitForTimeout(300);
    return ratio(page);
  };
  expect(await at(0)).toBeLessThan(0.05);
  expect(await at(0.5)).toBeGreaterThan(0.4);
  expect(await at(1)).toBeGreaterThan(0.95);
});

test('mouvement réduit : tout le contenu reste visible', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  expect(await page.locator('.rv').count()).toBeGreaterThan(5);
  expect(await minOpacity(page)).toBeGreaterThan(0.99);
  await ctx.close();
});

test('sans JavaScript : tout le contenu reste visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('#heroB > *').first()).toBeVisible();
  const rv = page.locator('.rv');
  expect(await rv.count()).toBeGreaterThan(5);
  // Sans JavaScript, .js-motion ne se pose jamais (elle vient du script
  // bloquant) : rien ne dépend d'un script ici. Mais dans un moteur qui gère
  // animation-timeline (Chrome/Edge), la révélation en bas de page reste
  // gouvernée par la timeline CSS native, qui n'a besoin d'aucun JavaScript
  // pour s'appliquer mais a bel et bien besoin d'un défilement réel pour
  // atteindre son opacité finale : vérifié en isolation avant d'écrire ce
  // test, `getComputedStyle` y montre `animationName: rise` et `opacity: 0`
  // sur les blocs sous la ligne de flottaison, page chargée, className vide
  // sur <html> (aucun script n'a tourné). Ce test défile donc la page avant
  // de mesurer, exactement le geste d'un vrai visiteur sans JavaScript.
  await scrollThrough(page);
  expect(await minOpacity(page)).toBeGreaterThan(0.99);
  await ctx.close();
});

test('avec JavaScript : toute la page finit révélée', async ({ page }) => {
  await page.goto('/');
  // On attend que motion.ts ait tourné, et non une durée. `playHero()` est sa
  // première instruction et pose `.in` sur #heroB : sa présence est donc la
  // preuve que le module s'est exécuté, IntersectionObserver compris.
  //
  // L'attente fixe de 1200 ms qui tenait cette place était un pari, et il se
  // perdait sous charge parallèle : le module s'exécutait après le parcours
  // de défilement, l'observateur s'enregistrait alors sur des blocs déjà
  // dépassés, qui ne réintersectent plus jamais, et le test rougissait avec
  // une opacité de 0 exactement, jamais une valeur intermédiaire. Relevé en
  // firefox, une fois sur une suite complète, et irreproductible en
  // isolation : six parcours identiques hors charge n'ont laissé aucun bloc
  // sous 0,99.
  await page.locator('#heroB.in').waitFor();
  await scrollThrough(page);
  await page.waitForTimeout(1200);
  expect(await page.locator('.rv').count()).toBeGreaterThan(5);
  expect(await minOpacity(page)).toBeGreaterThan(0.99);
  expect(await page.locator('.stagger > *').count()).toBeGreaterThan(3);
  expect(await minStaggerOpacity(page)).toBeGreaterThan(0.99);
});

test('appareil sans GPU : version statique, tout le contenu visible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('weak', '1'));
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'lite');
  expect(await minOpacity(page)).toBeGreaterThan(0.99);
});

test("à l'impression : tout le contenu reste visible", async ({ page }) => {
  await page.goto('/');
  // Le papier ne défile pas : sans le repli de motion.css, `both` retient
  // chaque bloc sur son image de départ et la page sort blanche. Les quatre
  // tests ci-dessus mesurent tous sous media screen et laissaient passer ça.
  await page.emulateMedia({ media: 'print' });
  expect(await page.locator('.rv').count()).toBeGreaterThan(5);
  expect(await minOpacity(page)).toBeGreaterThan(0.99);
});

test('wheel scrolling is damped, not instant', async ({ page }) => {
  await animated(page);
  await page.goto('/');
  await page.waitForTimeout(3500);
  await page.evaluate(() => {
    (window as any).__s = [];
    const f = () => {
      (window as any).__s.push(Math.round(scrollY));
      if ((window as any).__s.length < 70) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1200);
  const frames: number[] = await page.evaluate(() => (window as any).__s);
  // Le seuil sépare deux régimes, il ne mesure pas une cadence. Relevé le
  // 02/08/2026 : natif 2 positions distinctes, amorti 30 à 40 dans chromium,
  // 17 à 20 dans un firefox sans tête que quatre workers se disputent. À 20,
  // le test virait au rouge sur cette seule contention ; à 8 il garde un
  // facteur 4 au-dessus du natif et un facteur 2 sous le pire amorti observé.
  expect(new Set(frames).size).toBeGreaterThan(8);
});
