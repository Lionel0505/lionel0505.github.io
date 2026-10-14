import { expect, test } from '@playwright/test';

// Le PDF est arrivé (03/08/2026), donc ce test ne se contente plus de lire
// l'attribut : il clique, attend l'événement de téléchargement et vérifie
// que le fichier reçu est un vrai PDF. Un attribut juste qui pointe vers un
// 404 passait l'ancienne version sans un mot ; celle-ci tombe franchement.
test('le bouton du CV télécharge bien un PDF', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('a[download]');
  await expect(cta).toHaveAttribute('href', '/cv/Lionel_Ratovo_CV.pdf');

  const [dl] = await Promise.all([page.waitForEvent('download'), cta.click()]);
  expect(dl.suggestedFilename()).toMatch(/\.pdf$/i);

  // Le contenu est relu par le client HTTP de Playwright plutôt que sur le
  // disque : lire le fichier téléchargé demanderait `node:fs`, donc
  // `@types/node`, donc une dépendance de plus pour une assertion.
  //
  // On vérifie les cinq premiers octets, et non la seule extension : c'est
  // ce qui distingue un vrai PDF d'une page d'erreur servie sous ce nom. Un
  // attribut `href` juste qui pointe vers un 404 passait l'ancienne version
  // de ce test sans un mot.
  const res = await page.request.get('/cv/Lionel_Ratovo_CV.pdf');
  expect(res.status()).toBe(200);
  expect((await res.text()).slice(0, 5)).toBe('%PDF-');
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

// Le bouton quitte le document au clic. Sans transfert explicite, le focus
// retombe sur <body> : un visiteur au clavier qui tabule jusqu'à « Afficher le
// numéro » et appuie sur Entrée voit sa tabulation suivante repartir du haut de
// la page, et le lien qu'il vient de demander n'est ni atteint ni annoncé.
// Sans ce test, le défaut revient à la première réécriture du composant.
test('la révélation du numéro pose le focus sur le lien créé', async ({ page }) => {
  await page.goto('/');
  await page.click('#phone-reveal');
  const actif = await page.evaluate(() => ({
    balise: document.activeElement?.tagName,
    classes: document.activeElement?.className,
  }));
  expect(actif.balise).toBe('A');
  expect(actif.classes).toContain('phone-live');
});
