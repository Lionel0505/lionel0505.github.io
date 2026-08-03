import { expect, test } from '@playwright/test';

// Le fichier pointé n'existe pas encore : c'est une question ouverte posée
// à Lionel, pas un oubli. Le test mesure donc ce qui est vrai aujourd'hui,
// à savoir que le bouton porte l'attribut `download` et vise le bon
// chemin. Le jour où le PDF arrive, remplace ce corps par un
// `waitForEvent('download')` et une vérification de l'extension : la
// panne, si le fichier reste absent, sera alors franche.
test('le bouton du CV vise le bon fichier et demande un téléchargement', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('a[download]');
  await expect(cta).toHaveAttribute('href', '/cv/CV_Lionel_Ratovo.pdf');
});

test('le numéro de téléphone se révèle au clic, et jamais avant', async ({ page }) => {
  await page.goto('/');
  // Le numéro ne doit être nulle part dans le document avant le clic :
  // c'est la protection que SiteFooter met en place, et la mesurer sur la
  // seule absence de `.phone-live` la sous-estimerait.
  expect(await page.content()).not.toMatch(/\+?261[\s\d]*34/);
  await expect(page.locator('.phone-live')).toHaveCount(0);
  await page.click('#phone-reveal');
  await expect(page.locator('.phone-live')).toHaveAttribute('href', /^tel:\+261/);
});
