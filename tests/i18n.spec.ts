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

// Correction G du coordinateur : les deux tests ci-dessus ne mesurent que
// l'URL et les hreflang, jamais la langue réelle du contenu. Une page
// anglaise qui affiche l'entrée de collection française les passerait quand
// même. Celui-ci mesure la prose elle-même, pas son enveloppe.
test('les pages anglaises servent du contenu anglais', async ({ page }) => {
  await page.goto('/en/cas/sif/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  // La prose vient de la collection, pas du dictionnaire : c'est elle qui
  // révélerait une entrée française rendue sous une locale anglaise.
  await expect(page.locator('.prose')).not.toContainText(/\b(?:le|la|les|des|une)\b/i);
});
