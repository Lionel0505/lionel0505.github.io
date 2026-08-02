import { expect, test } from '@playwright/test';

test('le plan du site liste les huit pages, et rien de plus', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((u) => new URL(u).pathname).sort();
  expect(paths).toEqual([
    '/',
    '/cas/data/',
    '/cas/sif/',
    '/cas/web/',
    '/en/',
    '/en/cas/data/',
    '/en/cas/sif/',
    '/en/cas/web/',
  ]);
});

test("la page d'erreur ne se présente pas comme un contenu indexable", async ({ page }) => {
  await page.goto('/404.html');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('link[rel="alternate"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  // Un seul fichier est servi pour toute URL inconnue, et il est rendu en
  // français : il doit donc porter les deux langues et les deux accueils.
  await expect(page.locator('a[href="/"]')).toHaveCount(1);
  await expect(page.locator('a[href="/en/"]')).toHaveCount(1);
});

test('le JSON-LD est valide et ne declare aucun profil social', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? '');
  expect(data['@type']).toBe('Person');
  expect(data.sameAs).toBeUndefined();
  // Le numero n'est jamais en clair dans le HTML : SiteFooter le decode au
  // clic, et le JSON-LD ne doit pas defaire cette protection.
  expect(JSON.stringify(data)).not.toMatch(/\+?261/);
});
