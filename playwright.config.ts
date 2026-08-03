import { defineConfig, devices } from '@playwright/test';

// L'adresse est écrite en clair, et jamais `localhost`. Sur Windows,
// `localhost` résout `::1` avant `127.0.0.1`, et `astro preview` n'écoute
// que sur une seule des deux familles : sans `--host`, il ne prend que
// `::1`, et `http://127.0.0.1:4321/` est refusé net. Firefox arbitre entre
// les deux familles à chaque connexion et tombait donc par intermittence
// du mauvais côté, avec un NS_ERROR_CONNECTION_REFUSED sur `page.goto`.
// Relevé le 02/08/2026 : sans `--host`, l'écoute est sur `::1` seul ;
// avec `--host 127.0.0.1`, sur `127.0.0.1` seul. Nommer l'adresse des deux
// côtés supprime l'arbitrage, donc la panne.
const HOST = '127.0.0.1';
const PORT = 4321;
const ORIGIN = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  // Une seule reprise, et pour une panne nommée : firefox sans tête échoue
  // par intermittence dans `browserContext.close`, sur
  // « can't access property "_maybeDontRestoreTabs" ». C'est le magasin de
  // session de firefox qui se démonte mal, après que le corps du test a
  // rendu son verdict, et rien dans ce dépôt ne peut l'influencer.
  // @playwright/test est déjà à sa dernière version (1.62.1 le 02/08/2026),
  // donc il n'y a pas de correctif à installer. Retirer firefox coûterait
  // plus : c'est le seul moteur ici sans `animation-timeline`, donc le seul
  // qui exerce le repli par IntersectionObserver. Une reprise ne masque pas
  // de défaut du site, qui échouerait aussi à la seconde tentative, et le
  // rapport marque « flaky » ce qui a dû être repris.
  retries: 1,
  use: { baseURL: ORIGIN, trace: 'on-first-retry' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    // La suite mesure ce qui est réellement expédié : le JavaScript est
    // inséré dans le HTML à la construction, et c'est ce HTML-là que les
    // tests lisent. Elle porte donc sur `dist/`, jamais sur `astro dev`.
    command: `pnpm run build && pnpm exec astro preview --host ${HOST} --port ${PORT}`,
    url: `${ORIGIN}/`,
    // Réutiliser sans condition ne coûte rien en intégration continue, où
    // rien ne préexiste : la sonde ne trouve pas de serveur et la commande
    // ci-dessus tourne, construction comprise. En local, cela évite de
    // reconstruire à chaque passage.
    reuseExistingServer: true,
    // La construction précède le démarrage : le délai couvre les deux.
    timeout: 180_000,
  },
});
