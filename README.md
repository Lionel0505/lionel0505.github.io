# Portfolio · Lionel Ratovo

Site statique, bilingue français / anglais, publié sur GitHub Pages à l'adresse
<https://lionel0505.github.io>.

Direction artistique : **la planche cadastrale**. Le vocabulaire visuel est
dérivé du terrain réel de Lionel (un système d'information foncier national,
pour le bras international de l'IGN) et non d'un registre générique de
développeur : papier millimétré, cartouche, repères de planche, schémas au
trait.

## Démarrer

```sh
pnpm install
pnpm dev            # http://localhost:4321
```

## Les commandes qui comptent

| Commande | Ce qu'elle fait |
|---|---|
| `pnpm verify` | La porte complète, la même qu'en intégration continue |
| `pnpm contrast` | Contraste AA de chaque jeton de texte, sur les deux thèmes |
| `pnpm plate` | Cohérence de la planche : aires ∝ durées, légende conforme au cartouche |
| `pnpm budget` | JavaScript expédié par page, gzippé, budget 6 Kio |
| `pnpm content` | Fuites dans `dist/` et fautes typographiques |
| `pnpm test` | Playwright, Chromium et Firefox |
| `pnpm icons` | Régénère les favicons |

`pnpm verify` enchaîne `lint → check → build → contrast → plate → budget →
content`. Elle tourne aussi dans le workflow de déploiement, pas seulement dans
celui d'intégration : les deux partent en parallèle sur un push vers `main`, et
sans elle un site ratant une porte serait publié pendant que l'autre workflow
rougit.

## Arborescence

```
/                    /en/                 accueil
/cas/sif/            /en/cas/sif/         migrer un cadastre national sans arrêter le service
/cas/data/           /en/cas/data/        deux comptes data, des flux qu'on ne peut pas casser
/cas/web/            /en/cas/web/         publier du web à l'échelle d'un constructeur
/404/                                     servie par GitHub Pages
```

**Huit pages indexables**, plus la 404 dans chaque langue : dix fichiers HTML
construits, et huit entrées au plan du site, ce que `seo.spec.ts` vérifie.

**Les slugs sont identiques dans les deux langues.** Les traduire n'apporterait
rien en référencement sur un site de cette taille, et imposerait une table de
correspondance qui finirait par diverger des noms de fichiers.

## Ce qui est particulier ici

**La planche du parcours est calculée, pas dessinée.** `src/lib/plate.mjs` porte
les durées ; **l'aire de chaque parcelle vaut son nombre de mois**. Le polygone
extérieur est découpé par dichotomie sur la position de chaque droite, jusqu'à
ce que l'aire découpée atteigne la durée visée. Deux conséquences qui valent le
code : la parcelle du SIF grossit d'elle-même tant que la mission dure, et
corriger une date suffit à redessiner la planche. Les normales des droites sont
inclinées et toutes différentes, sinon on obtient un treemap, pas un plan
cadastral.

`pnpm plate` vérifie les six parcelles et la conformité de la légende au
cartouche, dans les deux langues.

**Le budget JavaScript est tenu par mesure, pas par intention.**
`scripts/js-budget.mjs` extrait le corps de chaque `<script>` de chaque page et
le gzippe. Tout le JS du site étant inséré dans le HTML, un budget mesuré sur
des fichiers `.js` serait vert par construction et ne mesurerait rien. Mesuré :
**2,1 Kio** sur un budget de 6 Kio, pour le thème, la couche de mouvement, le
défilement amorti et le décodage du numéro.

**Aucune dépendance d'exécution.** Ni Lenis, ni GSAP, ni bibliothèque
d'animation. Le défilement amorti est une implémentation maison d'une
quarantaine de lignes, souris uniquement, coupée par `prefers-reduced-motion`.

**Les polices sont auto-hébergées, sous-ensemble `latin` seul**, un fichier et
un axe par famille : Bricolage Grotesque, Archivo, JetBrains Mono. Mesuré :
**105 Kio**. Demander un axe `wdth` ou `opsz` coûterait 20 à 40 Kio par axe pour
rien. Aucun appel à Google Fonts en production.

**Le contraste est une porte, pas une intention.** Chaque accent est dédoublé :
`--or` pour le graphique, `--or-t` pour le texte, assombri jusqu'à franchir
4,5:1 sur la pire surface du thème. Les valeurs `-t` sont mesurées par
`scripts/contrast.mjs`, pas choisies à l'œil. Le script mesure aussi le texte
posé sur l'aplat de chaque parcelle, à son opacité de rendu.

**Le numéro de téléphone n'est jamais dans le HTML servi.** Il est encodé et
reconstruit au clic. `pnpm content` cherche ses formes en clair, séparateurs
retirés, dans tout `dist/`.

## Contenu

Chaque fait affiché trace vers `CV_Lionel_Ratovo_MASTER.md` et vers les retours
du 01/08/2026. Les règles du CV maître s'appliquent au site sans exception :

1. Aucun chiffre indéfendable en entretien technique : la latence « ~2 s » du
   SIF a été retirée du CV pour cette raison, elle ne revient pas ici.
2. Aucune capture d'écran du SIF, du SIGFU, ni des comptes GSK, Cartier ou
   Mercedes-Benz : ce sont des systèmes d'État et des comptes clients
   d'agence. **Les schémas SVG au trait les remplacent au lieu de laisser un
   trou.**
3. Aucun projet fictif, aucune démo simulée, **aucun lien social** : Lionel n'a
   ni GitHub ni LinkedIn, c'est un choix assumé et le site ne le contredit pas.
4. Aucun compteur de vanité.
5. Rien qui laisse entendre que NEXTRI a livré des projets clients. Le renvoi
   vers le collectif parle de capacité, jamais de références.

`sourceRefs` est **obligatoire et non vide** dans le schéma Zod des études de
cas : on ne peut pas publier un cas sans déclarer d'où viennent ses faits. Un
champ manquant casse la construction, pas la page en production.

Les sources vivent dans `.unwanted/`, **jamais versionné** : elles portent les
CV maîtres de trois personnes, avec numéros et adresses. Le dépôt est public.

## Traduire

La copie d'interface est dans `src/i18n/fr.ts` et `en.ts` ; les études de cas
sont des collections Astro typées, dans `src/content/cases/{fr,en}/`.

Le repli sur le français est automatique pour toute page anglaise absente
(`fallbackType: 'rewrite'`). Conséquence de conception, et elle est voulue :
**le site est livrable en français seul, et l'anglais s'ajoute page par page.**
La traduction ne bloque jamais la mise en ligne.

## Tests

Cinq fichiers, Chromium et Firefox. Firefox n'est pas là pour la forme : c'est
le seul des deux sans `animation-timeline`, donc le seul qui exerce réellement
le repli par `IntersectionObserver`.

| Fichier | Ce qu'il couvre |
|---|---|
| `flows.spec.ts` | Le CV télécharge bien un PDF · le numéro ne se révèle qu'au clic · le focus suit le lien créé |
| `i18n.spec.ts` | Bascule vers la page équivalente, jamais l'accueil · hreflang réciproques · les pages `/en/` servent réellement de l'anglais |
| `theme.spec.ts` | Suit l'OS à la première visite **sans rien stocker** · cycle système → clair → sombre · persistance au rechargement |
| `motion.spec.ts` | La chaîne suit le défilement · mouvement réduit, sans JS et avec JS : le contenu reste visible dans les trois cas · le défilement est bien amorti |
| `seo.spec.ts` | Le plan du site liste les huit pages indexables et rien de plus · le JSON-LD est valide et ne déclare aucun profil social |

**Pas de tests unitaires.** Il n'y a pas de logique à tester sur un site de
contenu, hors la géométrie de la planche, et celle-là a sa propre porte.

## Déploiement

Push sur `main` → `deploy.yml` → GitHub Pages, source **GitHub Actions**.
`astro.config.mjs` garde `site` et `base` en un seul endroit : un passage vers
un domaine propre ne demande aucune reprise de code.

**Lighthouse ne tourne pas en intégration continue.** C'est l'étape la plus
lourde du pipeline, et sur un site statique de dix pages sans JavaScript
d'exécution le score ne bouge quasiment pas d'un commit à l'autre. Les budgets
restent la cible ; une passe manuelle avant mise en ligne, et à chaque
changement de polices ou de planche.

## Documents

- `docs/superpowers/specs/2026-07-31-portfolio-lionel-ratovo-design.md` :
  le
  super-PRD : thèse, audiences, direction artistique, jetons, jalons,
  traçabilité de chaque fait affiché.
- `docs/superpowers/plans/2026-07-31-portfolio-lionel-ratovo.md` :
  le plan
  d'implémentation.
