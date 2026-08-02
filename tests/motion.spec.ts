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

test('la chaîne suit la position de défilement', async ({ page }) => {
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
  await page.waitForTimeout(1200);
  await scrollThrough(page);
  await page.waitForTimeout(1200);
  expect(await page.locator('.rv').count()).toBeGreaterThan(5);
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
  expect(new Set(frames).size).toBeGreaterThan(20); // native scrolling yields 2
});
