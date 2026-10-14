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
  // La portée est `main` et non le document : l'en-tête ramène déjà vers
  // « / » par son logo sur toutes les pages, et compter à l'échelle du
  // document ferait passer ce lien-là pour la sortie de secours française.
  // C'est dans le corps de la page d'erreur que les deux doivent être.
  await expect(page.locator('main a[href="/"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/en/"]')).toHaveCount(1);
});

test('le JSON-LD est valide et ne declare que le profil LinkedIn', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const profile = JSON.parse(raw ?? '');
  // L'accueil est un ProfilePage dont l'entité principale est la personne.
  expect(profile['@type']).toBe('ProfilePage');
  const data = profile.mainEntity;
  expect(data['@type']).toBe('Person');
  // L'assertion etait `sameAs` absent, du temps ou Lionel n'avait aucun profil.
  // Elle est devenue une liste fermee plutot qu'une absence : ce qui compte
  // n'a pas change, c'est qu'on ne declare aucun profil qui n'existe pas.
  expect(data.sameAs).toEqual(['https://www.linkedin.com/in/lionel-ratovo-98a79525a']);
  // Le numero n'est jamais en clair dans le HTML : SiteFooter le decode au
  // clic, et le JSON-LD ne doit pas defaire cette protection.
  expect(JSON.stringify(profile)).not.toMatch(/\+?261/);
});
