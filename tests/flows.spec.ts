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
  //
  // La mesure porte sur les chiffres seuls, séparateurs retirés, et non sur
  // un motif à trous : une fuite s'écrirait aussi bien « +261 34 21 137 98 »
  // que « +261-34-21-137-98 » ou « 034 21 137 98 », et un motif calé sur une
  // seule de ces formes laisserait passer les deux autres. La suite de neuf
  // chiffres retenue est commune au format international et au format local.
  // Aucun risque de faux positif : neuf chiffres dans cet ordre précis
  // n'apparaissent pas par accident dans une page qui n'affiche que des
  // dates et des comptes à deux ou trois chiffres.
  expect((await page.content()).replace(/\D/g, '')).not.toContain('342113798');
  await expect(page.locator('.phone-live')).toHaveCount(0);
  await page.click('#phone-reveal');
  await expect(page.locator('.phone-live')).toHaveAttribute('href', /^tel:\+261/);
});
