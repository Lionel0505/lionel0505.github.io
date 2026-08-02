import { expect, type Page, test } from '@playwright/test';

// Un seul ratio couvre les deux chemins : natif (scaleX sur une barre à
// 100 %) comme repli (width en %). getBoundingClientRect intègre la
// transformation, donc la largeur rendue est la même mesure dans les deux.
const ratio = (page: Page) =>
  page.locator('#chain i').evaluate((el) => {
    const p = el.parentElement as HTMLElement;
    return el.getBoundingClientRect().width / p.getBoundingClientRect().width;
  });

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
  const rv = page.locator('.rv');
  // Sans ça la boucle passerait à vide le jour où .rv disparaît du balisage.
  expect(await rv.count()).toBeGreaterThan(5);
  for (const el of await rv.all()) await expect(el).toBeVisible();
  await ctx.close();
});

test('sans JavaScript : tout le contenu reste visible', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  const rv = page.locator('.rv');
  expect(await rv.count()).toBeGreaterThan(5);
  for (const el of await rv.all()) await expect(el).toBeVisible();
  await expect(page.locator('#heroB > *').first()).toBeVisible();
  await ctx.close();
});
