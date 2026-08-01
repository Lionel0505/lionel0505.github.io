# Portfolio Lionel Ratovo — super-PRD

**Date** : 31 juillet 2026 · **révisé le 1er août 2026** après retours de Lionel
**Statut** : conception validée, prêt pour le plan d'implémentation
**Maquette de référence** : `docs/superpowers/reference/preview.html` (v4, validée le 01/08/2026)
**Sources factuelles** : `.unwanted/sources/`. Deux niveaux : les CV maîtres du 21/07/2026, et
`RETOURS-LIONEL-2026-08-01.md` (repères `[F1]`–`[F12]`) **qui les emporte** partout où il les
contredit. Là où le master est muet, on demande : on n'y comble pas les silences par déduction.

---

## 0. Décisions arrêtées

| Sujet | Décision |
|---|---|
| Audiences | Recruteurs CDI/remote international · clients freelance · porte d'entrée NEXTRI · carte de visite |
| Angle du récit | **Le pont métier ↔ technique** |
| Plan de lecture | Quatre mouvements voulus par Lionel `[F9]` : qui je suis · ce que j'offre · ce que j'ai accompli · comment me contacter |
| Planche | Aires **proportionnelles au temps passé** `[F10]`, calculées au build, pas dessinées |
| Réalisations | 3 études de cas rédigées, sans capture d'écran : **SIF · data (GSK + Cartier) · webmastering (Mercedes-Benz)** |
| Langues | Bilingue FR / EN, FR par défaut |
| Stack | Astro 7 + Tailwind 4, statique |
| Structure | Accueil + une page par étude de cas |
| Statut affiché | « Ouvert aux opportunités », sans date |
| Contact | Email en clair · CV PDF · téléphone révélé au clic · lien NEXTRI |
| Photo | Le hero fonctionne avec et sans portrait |
| Déploiement | GitHub Pages, PDF déposé dans `/public` |
| Thème | Contrat `next-themes` de NEXTRI, réimplémenté en statique, défaut « système » |
| Correctif contraste NEXTRI | **Hors périmètre**, voir annexe B |

---

# PARTIE I — DESIGN BRIEF

## 1.1 La thèse

Le site défend une phrase, et une seule :

> **Je traduis des besoins métier complexes en systèmes qui tiennent en production.**

Elle vient de Lionel lui-même, via la note `[E2]` de son CV maître : *« plus à l'aise dans la compréhension métier et des contraintes techniques qu'elle implique que dans la technique pure »*. Tout contenu qui ne sert pas cette thèse sort du site.

**Pourquoi cet angle plutôt qu'un autre.** Un backend de plus, il y en a des milliers. Quelqu'un qui tient l'atelier client *et* les 150 tables, beaucoup moins. L'angle sert les quatre audiences d'un coup : le recruteur y lit de la séniorité, le client un interlocuteur, NEXTRI son porte-parole. Et surtout il est **défendable en entretien**, ce que l'angle « ingénieur des systèmes critiques » n'aurait pas été : promettre un architecte système et livrer un lead applicatif est un écart qui se paie.

**Le risque, et sa neutralisation.** Un recruteur purement technique peut lire « il code moins ». Chaque affirmation métier est donc ancrée dans un fait technique nommé : Drools, 9 schémas PostgreSQL, APJ, AEM, Salesforce.

## 1.2 Audiences

| Audience | Ce qu'elle cherche | Ce que le site lui donne |
|---|---|---|
| Recruteur technique | Preuve de portée, séniorité, chronologie sans trou | Planche du parcours, cartouche, frise, CV PDF |
| Client freelance | Un interlocuteur capable de cadrer, pas juste de coder | Section Approche, études de cas, porte « projet » |
| Contact NEXTRI | Un collectif crédible derrière l'individu | Porte « projet » → renvoi explicite |
| Visiteur de passage | Une impression en 40 secondes | Hero, bandeau d'autorité, cartouche |

**La bifurcation se joue en deux endroits seulement**, jamais ailleurs :
1. **En hero**, deux boutons : `Télécharger le CV` (recruteur) · `Me contacter` (client).
2. **En fin de parcours**, deux portes : *« Un poste à pourvoir ? »* · *« Un projet à livrer ? »*.

Une seule page de fond, deux sorties. Personne ne lit un contenu qui ne lui est pas destiné.

## 1.3 Règles de contenu — non négociables

Reprises des CV maîtres et étendues au site. Elles priment sur toute considération esthétique.

1. **Aucun chiffre indéfendable en entretien technique.** La latence « ~2 s » du SIF a été retirée du CV pour cette raison ; elle ne revient pas sur le site. Supprimer plutôt qu'estimer.
2. **Aucune capture d'écran** du SIF, du SIGFU, ni des comptes GSK, Cartier ou Mercedes-Benz. Systèmes d'État et comptes clients d'agence.
3. **Aucun projet fictif**, aucune démo simulée, aucun dépôt inventé. Lionel n'a ni GitHub ni LinkedIn : c'est un choix assumé, le site ne le contredit pas et n'affiche aucun lien social.
4. **Rien qui laisse entendre que NEXTRI a livré des projets clients.** Aucun projet livré à ce jour ; `nx3-SaaS` n'est ni déployé, ni multi-tenant, ni doté d'utilisateurs. Le renvoi vers NEXTRI parle de capacité, jamais de références.
5. **Aucun compteur de vanité.** Pas de « +120 projets », pas de « 98 % de satisfaction ». Ces chiffres n'existent pas ; les inventer ruinerait la crédibilité de tout le reste.
6. **Chaque fait affiché trace vers `CV_Lionel_Ratovo_MASTER.md`.** Voir annexe A.

## 1.4 Direction artistique

### Le problème à résoudre

Un portfolio de développeur **sans une seule capture d'écran**. Le vide visuel est le vrai risque du projet : un site de contenu où la typographie porte seule tout le poids visuel est un échec, pas de la retenue.

### La réponse : la planche cadastrale

Le système graphique est dérivé du domaine réel de Lionel, pas de son métier générique. Il travaille sur un **système d'information foncier national**, pour un employeur qui est le bras international de l'**IGN**. Le vocabulaire visuel du cadastre lui appartient légitimement, et personne d'autre dans son secteur ne peut le porter.

Ce que ça donne concrètement :

- **Fond de papier millimétré**, trame double (36 px fine, masquée en dégradé radial).
- **Grain** en superposition, repris de NEXTRI. C'est lui qui fait basculer le fond du « beige » au « vrai plan ».
- **Cartouche** : le bloc-titre d'une planche technique, qui remplace la rangée de compteurs.
- **Repères de planche** : coins d'épreuve, flèche de nord, échelle graduée, mention `ÉCH. 1:5000 · LEVÉ 2021–2026`.
- **Schémas SVG au trait** dessinés à la main pour chaque étude de cas. Abstraits donc publiables, techniques donc crédibles, cohérents donc identitaires. **Ils remplacent les captures interdites au lieu de laisser un trou.**

### La pièce maîtresse : le parcours comme plan parcellaire

Le hero n'affiche pas une photo mais **la carrière de Lionel dessinée en plan cadastral**. Une parcelle par mission, coloriée selon la nature du travail, exactement comme une planche cadastrale est coloriée par usage du sol.

**L'aire de chaque parcelle vaut sa durée** `[F10]`. Ce n'est pas une métaphore décorative : c'est la seule façon de dessiner un parcours sans le maquiller.

| Parcelle | Mission | Mois | Rôle de couleur |
|---|---|---:|---|
| SIF · SIGFU | Côte d'Ivoire, 01/2024 → | 31 | Mission en cours |
| GSK | 03/2023 → 01/2024 | 10 | Données |
| Mercedes-Benz | 12/2021 → 09/2022 | 9 | Production web |
| Cartier | 09/2022 → 03/2023 | 6 | Données |
| BICI | 11/2021 → 12/2021 | 2 | Reprise d'existant |
| **Parcelle libre** | les douze prochains mois | 12 | Cerclée en tireté |

Cartier et GSK partagent le rôle « données » et se touchent : deux densités d'aplat les séparent (0,20 et 0,34), comme deux parcelles du même classement sur un vrai plan.

**Le contour est fixe, les divisions sont calculées.** Le polygone extérieur est découpé par dichotomie sur la position de chaque droite, jusqu'à ce que l'aire découpée vaille la durée visée. Deux conséquences qui valent le code : la parcelle du SIF grossit d'elle-même tant que la mission dure, et corriger une date suffit à redessiner la planche. Les normales des droites sont inclinées et toutes différentes, sinon on obtient un treemap et non un plan cadastral.

La parcelle libre est un **hameçon d'inachèvement** : un manque ouvert retient l'attention plus qu'un argumentaire. Elle est cotée à la même échelle que le travail réel, douze mois, et elle porte la passerelle NEXTRI `[F11]`, `[F12]` : « Seul · ou à trois avec NEXTRI ». Au survol, « → Votre projet ».

### Leviers d'attention

Appliqués honnêtement : aucun ne demande de mentir, tous s'appuient sur des faits vérifiables.

| Levier | Application |
|---|---|
| **Transfert d'autorité** | Bandeau typographique avec les vrais noms : Ministère de l'Urbanisme, GlaxoSmithKline, Cartier, Mercedes-Benz. L'actif le plus fort de la page. |
| **Effet Von Restorff** | La planche : un objet unique, donc mémorisé. |
| **La couleur porte du sens** | Quatre rôles nommés, pas de la décoration. |
| **Effet Zeigarnik** | La parcelle libre, qui porte aussi la passerelle NEXTRI. |
| **Preuve croisée** | Chaque ligne de l'offre est prouvée par une mission **différente**. Règle mécanique, pas éditoriale : c'est elle qui empêche la page de redevenir un monologue sur le SIF. |
| **Règle pic-fin** | Un pic (le plan qui se colorie) et une fin forte (contact inversé sur fond encre). |
| **Ancrage** | Les chiffres défendables arrivent tôt et gros dans le cartouche. |
| **Concrétude** | La spécificité crédibilise mieux que le superlatif. C'est déjà la doctrine des CV maîtres. |
| **Gradient d'objectif** | Chaîne d'arpenteur en haut de page. |

### Ce qu'on s'interdit

- La rangée « gros chiffre + petit label » (cliché SaaS).
- Les grilles de cartes identiques : les études de cas ont des poids délibérément dissemblables.
- Le texte en dégradé, le glassmorphisme décoratif, les bordures latérales colorées.
- Les tirets cadratins dans la copie du site.
- Les petites étiquettes capitales traquées répétées au-dessus de chaque titre de section.

## 1.5 Couleur

Jetons **hérités de NEXTRI**, avec leurs noms, pour que le portfolio de Lionel et le site du collectif partagent un vocabulaire. La « porte d'entrée vers NEXTRI » devient ainsi une réalité visuelle, pas seulement un lien.

**Stratégie : palette complète.** Quatre accents, chacun porteur d'un rôle.

| Rôle | Jeton | Signification |
|---|---|---|
| Orange | `--or` | Mission en cours, action, CTA |
| Teal | `--tl` | Données, comptes internationaux |
| Or | `--yw` | Production web, livraison |
| Lavande | `--lv` | Reprise d'existant, formation |

### Le dédoublement graphique / texte

**Constat mesuré : la palette NEXTRI ne franchit pas le seuil AA sur du petit texte.** En thème clair, `--tx3` donne 2,04:1 là où il en faut 4,5 ; `--or` en texte donne 3,49:1. Ce n'est pas un défaut de la palette, qui est bonne, mais de son usage sur du texte.

Chaque accent est donc dédoublé :

- `--or` — couleur **graphique** : aplats, traits, lavis. Identité NEXTRI intacte.
- `--or-t` — couleur **texte**, assombrie jusqu'au franchissement du seuil.

Les valeurs `-t` sont **calculées contre le fond le plus défavorable de chaque thème** (`--bg`, `--bg2` et `--bg3`), pas choisies à l'œil.

**Thème clair**

```
--bg:#F4EEE0  --bg2:#EDE4CC  --bg3:#E6DBC0
--tx:#1C2318  --tx2:#685f52  --tx3:#b0a898   (tx3 : filets uniquement, jamais du texte)
--bd:#CFC5A8  --bd2:#b8ae90
--or:#C84E0A    --tl:#1A9E93    --yw:#D4A800    --lv:#7B6EC8
--or-t:#a64108  --tl-t:#116a62  --yw-t:#775e00  --lv-t:#61579e
--or-inv:#E8621A  --tl-inv:#2BBFB3            (accents posés sur la surface inversée)
--inv-bg:#1C2318  --inv-tx:#F4EEE0  --inv-tx2:#9E9880  --inv-bd:#3A4736
```

**Thème sombre**

```
--bg:#1C2318  --bg2:#252E21  --bg3:#181e14
--tx:#F4EEE0  --tx2:#9E9880  --tx3:#96918a
--bd:#3A4736  --bd2:#4d5f49
--or:#E8621A    --tl:#2BBFB3    --yw:#F5C842    --lv:#9B8FD9
--or-t:#ea6e2b  --tl-t:#2BBFB3  --yw-t:#F5C842  --lv-t:#9B8FD9
--or-inv:#a64108  --tl-inv:#126d65
--inv-bg:#F4EEE0  --inv-tx:#1C2318  --inv-tx2:#685f52  --inv-bd:#CFC5A8
```

**Le bouton principal** utilise `--or-t` en fond avec `--bg` en texte : 4,5:1 exactement. `--or` en fond n'aurait donné que 3,99:1.

**Règle permanente** : tout ajout de couleur passe par le script de vérification (`scripts/contrast.mjs`, jalon ①) avant d'entrer dans les jetons.

## 1.6 Typographie

Trois familles, chacune avec un rôle distinct. Le pont métier ↔ technique rendu typographique : **le discours en grotesque, la preuve en monospace.**

| Rôle | Famille | Justification |
|---|---|---|
| Titres | **Bricolage Grotesque** (variable, axe `wght` seul) | Partagée avec NEXTRI. Personnalité réelle, optical sizing, ne ressemble à aucune police SaaS standard. |
| Corps | **Archivo** (variable, axe `wght` seul) | Grotesque de labeur, poids 400 à 600. |
| Faits tracés | **JetBrains Mono** | Partagée avec NEXTRI. Couche d'annotation d'un dessin technique. Lionel étant réellement technique, ce n'est pas du costume. |

**DM Sans, utilisée par NEXTRI pour le corps, est écartée** : c'est un défaut d'entraînement qui crée de la monoculture. Archivo la remplace. Bricolage Grotesque et JetBrains Mono sont conservées, donc la parenté visuelle avec le collectif tient.

**Échelle** : `clamp()` fluide, rapport ≥ 1,25 entre les paliers.
- `h1` : `clamp(2.1rem, 1.15rem + 3.5vw, 3.85rem)`, poids 760, interligne 1.0, approche −0.038em
- `h2` : `clamp(1.6rem, 1.05rem + 1.9vw, 2.6rem)`
- `h3` : `clamp(1.08rem, .98rem + .48vw, 1.32rem)`
- corps : `clamp(.96rem, .93rem + .17vw, 1.045rem)`, interligne 1.6
- mono : `.66rem`, approche `.09em`, capitales

**Longueur de ligne** plafonnée : 64 caractères pour le corps, 48 pour l'accroche.

**Un seul axe par police.** `font-stretch` et `opsz` ne sont utilisés nulle part : demander `wdth` ou `opsz` chargerait de 20 à 40 Ko par axe pour rien. Les polices étant le premier poste du budget de page, c'est le gain de performance le plus important du projet.

**Chargement** : polices auto-hébergées en `woff2` (fichiers déjà sous-ensemblés servis par Google), sous-ensemble latin + latin-ext (le français a besoin de `œ`, `à`, `ç`, `é`, `è`, `ê`, `î`, `ô`, `û`), `font-display: swap`, et **préchargement de Bricolage seul** puisque le `h1` porte le LCP.

**Budget : moins de 90 Ko pour les trois familles.** Au-delà, un axe non désiré ou la plage Unicode complète est revenu.

**Aucun appel à Google Fonts en production** : c'est une fuite d'adresses IP vers un tiers et un coût de connexion. La maquette y fait appel ; le site non.

## 1.7 Mouvement

**Principe** : `ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) partout, aucun rebond, aucun élastique. Rien n'anime de propriété de mise en page.

### Trois couches

**① À l'entrée (une fois, au chargement)**
- La planche se trace : contour, divisions, puis coloriage parcelle par parcelle, puis étiquettes, puis repères. **C'est le pic** de la page.
- Durée totale ≈ 2,5 s.

**② Lié au défilement (timelines CSS natives)**

Pas de déclenchement par seuil : les éléments **progressent avec le défilement** et reculent si l'on remonte.

| Élément | Animation | Plage |
|---|---|---|
| Chaîne d'arpenteur | `scaleX` 0 → 1 | `scroll(root block)` |
| Planche | translation −26 → +26 px, rotation −0,7° → +0,5° | `cover 0% → 100%` |
| Titres de section | essuyage `clip-path` | `entry 10% → cover 38%` |
| Noms de clients | montée décalée, plage propre à chacun | `entry 0–12% → cover 40–58%` |
| Cellules du cartouche | cascade | `entry 6–26% → cover 26–46%` |
| Filets des volets | `scaleX` 0 → 1 | `entry 20% → cover 60%` |
| Liaisons du schéma | `stroke-dashoffset` 120 → 0 | `entry 15% → cover 55%` |
| Filets des portes | `scaleX` 0 → 1 | `entry 25% → cover 65%` |
| En-tête | ombre portée | `scroll 0 → 160px` |
| Schéma du cas | collant pendant la lecture du texte | `position: sticky` |

**③ Défilement amorti**

Le glissement inertiel, mesuré sur un cran de molette de 900 px :

| | Images distinctes | Trajectoire |
|---|---|---|
| Natif | **2** | `0 → 900` |
| Amorti | **59** | `0 → 77 → 323 → 495 → 616 → 701 → 761 → 802 → 832 → 852 → 866 → 876 → 883 → 897` |

Implémentation maison, ~40 lignes, **sans dépendance** (pas de Lenis) : coefficient d'amortissement 0,085, seuil d'arrêt 0,35 px. Le lissage **conserve la position de scroll réelle du document**, donc les timelines CSS de la couche ② continuent de fonctionner (vérifié : chaîne à 0,88 en plein amortissement).

**Trois garde-fous, parce que détourner le scroll est un choix qui se paie :**
1. **Souris uniquement** (`pointer: fine`). Le tactile a déjà son inertie native ; la détourner dégrade systématiquement.
2. **`prefers-reduced-motion` coupe tout.** L'amortissement est précisément ce qui provoque le mal des transports chez les personnes sensibles.
3. **Aucune dépendance runtime.**

### Replis

`animation-timeline` n'est pas encore géré par Firefox ni Safari. Détection par `CSS.supports('animation-timeline: view()')` :
- **Supporté** → le CSS pilote tout, aucun écouteur de défilement.
- **Non supporté** → `IntersectionObserver` pour les révélations, `requestAnimationFrame` pour la chaîne.

Le repli n'est pas une dégradation visible : le site reste complet, seule la continuité du mouvement est perdue.

## 1.8 Thème

Contrat repris de NEXTRI (`next-themes` : `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`), réimplémenté en vanilla puisque le site est statique.

- Attribut `data-theme` sur `<html>`, clé `localStorage` nommée `theme` — **identiques à NEXTRI**.
- Trois états cycliques : **système → clair → sombre → système**. Sur « système », la clé est effacée et l'OS reprend la main en direct.
- **Script bloquant dans le `<head>`**, avant toute feuille de style : le thème est posé avant le premier rendu, donc aucun flash.
- Classe `.no-tr` posée pendant deux images à la bascule, pour supprimer le fondu croisé disgracieux.

**Le défaut est « système », pas « clair ».** La scène de référence reste un recruteur en open-space éclairé, mais laisser l'OS trancher est plus respectueux que forcer.

## 1.9 Accessibilité

| Exigence | Niveau visé |
|---|---|
| Contraste texte | **AA sur les deux thèmes, zéro échec** (vérifié par script) |
| Navigation clavier | Tout parcours faisable, `:focus-visible` visible partout |
| Mouvement | `prefers-reduced-motion` neutralise entrée, scroll-timelines et amortissement |
| Sémantique | `header`/`main`/`section`/`article`/`footer`, un seul `h1` par page |
| SVG | `role="img"` + `aria-label` décrivant le contenu, pas la forme |
| Lien d'évitement | « Aller au contenu » en premier élément focusable |
| Cible tactile | 44 × 44 px minimum |

---

# PARTIE II — APPFLOW

## 2.1 Arborescence

```
/                                    /en/
├─ Hero .................... thèse · double CTA · planche (portrait optionnel)
├─ Bandeau d'autorité ...... les vrais noms, en grand
├─ Cartouche ............... 6 faits tracés
├─ Approche ................ cadrer / construire / livrer
├─ Études de cas ........... 1 majeure + 2 compactes
├─ Parcours ................ frise IGN FI → RAPP IO → BICI → formation
└─ Contact ................. les deux portes (surface inversée)

/cas/sif/                            /en/cas/sif/
/cas/data/                           /en/cas/data/
/cas/web/                            /en/cas/web/
/404                                 (servi par GitHub Pages)
```

**Les slugs sont identiques dans les deux langues.** Les traduire n'apporterait rien en référencement sur un site de cinq pages, et imposerait une table de correspondance qui finirait par diverger des noms de fichiers.

**Pas de page de mentions légales.** L'obligation française vise les éditeurs établis en France ; l'éditeur est à Madagascar, le site est hébergé sur GitHub Pages, ne pose aucun cookie et n'embarque aucun traceur. À ajouter le jour où le site passe sous un domaine français.

## 2.2 Parcours par audience

| Audience | Chemin attendu | Sortie |
|---|---|---|
| Recruteur | Hero → cartouche → cas SIF → parcours → CV | `Télécharger le CV`, puis email |
| Client freelance | Hero → approche → cas → contact | Porte « projet » |
| Contact NEXTRI | Hero → contact | Lien externe NEXTRI |
| Passage | Hero → bandeau → cartouche | Aucune, impression seule |

## 2.3 Anatomie de l'accueil

**Hero.** Pastille de statut (« Ouvert aux opportunités », point pulsant), `h1` portant la thèse avec « tiennent » en accent, accroche, trois lieux en mono, deux boutons. À droite, la planche parcellaire et sa légende de quatre rôles.

*Le hero à deux visages* : le composant accepte un portrait optionnel. Sans photo, la colonne droite reçoit la planche ; avec photo, la planche descend en pleine largeur sous le hero et le portrait prend sa place. **Aucune refonte le jour où la photo arrive.**

### 01 · Qui je suis

**Deux paragraphes**, pas une biographie : ce sur quoi il travaille, puis ce qu'il vend vraiment (« ma force n'est pas la technique pure ») `[E2]`. La passerelle NEXTRI est ici, dès le premier mouvement `[F12]`, et non plus seulement en pied de page.

**Cartouche.** Bloc-titre bordé de 1,5 px. **Portée unique : tout ce qu'il contient vaut pour la carrière entière.** C'était le défaut relevé par Lionel `[F8]` — l'ancien cartouche mêlait trois portées, et « 9 schémas » sans contexte ne veut rien dire. Les chiffres du SIF descendent dans son étude de cas.

| Cellule | Valeur | Source |
|---|---|---|
| En activité depuis | **2021** | Expériences |
| Missions | **5** | Expériences |
| Terrain | Côte d'Ivoire · Maurice · Madagascar | Expériences |
| Formation | Master MIAGE · MBDS | `[D1]` |
| Langues | Malagasy · Français · Anglais | `[D3]` |
| Disponibilité | Ouvert aux opportunités | Décision |

« 2021 » et non « 5 ans » : novembre 2021 → août 2026 fait 4 ans et 9 mois, et une date de départ ne dérive jamais.

### 02 · Ce que j'offre

Quatre prestations sur deux colonnes, chacune dans sa couleur de rôle, filet de 44 px en tête. Sous chaque prestation, un bloc **« sur le terrain »** : la preuve, tirée d'une mission différente à chaque fois.

| Prestation | Preuve | Rôle |
|---|---|---|
| API et backend métier | SIF · règles Drools avant écriture | `--or` |
| Modélisation et optimisation SQL | GSK · données marketing, milliers de lignes | `--tl` |
| Reprise de l'existant | Cartier · flux Salesforce · BICI · quatre apps APJ | `--lv` |
| Conduite technique | Mercedes-Benz · coordination de l'équipe de Madagascar | `--yw` |

Remplace les trois volets « cadrer · construire · livrer », dont Lionel notait qu'ils décrivaient tous le SIF `[F5]`.

### 03 · Ce que j'ai accompli

**Bandeau d'autorité**, pleine largeur, en ouverture du mouvement. Sur `--bg2`, bordé haut et bas. Quatre noms en Bricolage Grotesque, surmontés chacun d'une étiquette mono de contexte. Opacité 0,62 au repos, 1 et `--or-t` au survol.

**Études de cas.** Une majeure en deux colonnes avec son schéma collant, deux compactes côte à côte séparées par un filet. Poids délibérément dissemblables. Les chiffres du SIF vivent dans la majeure, en rangée de faits.

**Le fil.** Un bloc bordé referme le mouvement : « reprendre l'existant » n'est pas un quatrième cas, c'est ce qui traverse les trois — SGFH → SIF, les flux Salesforce de Cartier, les quatre applications non documentées de BICI.

**Parcours.** Frise verticale, un poste par entrée : intitulé, employeur, lieu, dates, puces sourcées. Formation et langues en fin.

### 04 · Comment me contacter

Surface inversée (`--inv-bg`). Deux portes bordées, chacune avec son filet de rôle qui pousse au défilement.

## 2.4 Anatomie d'une étude de cas

Gabarit unique pour les trois :

1. **En-tête factuel** en mono : client · rôle · période · stack
2. **L'enjeu** — le problème métier, en langue de décideur
3. **La contrainte** — ce qui rendait la chose difficile techniquement
4. **Ce que j'ai fait** — 3 à 5 blocs, verbe d'action + fait tracé
5. **Ce qui a tenu** — le résultat, factuel, sans chiffre inventé
6. **Schéma SVG** au trait, dessiné pour ce cas
7. **Navigation** : cas suivant + rappel de contact

## 2.5 Contenu des trois études de cas

### Cas 1 — SIF · SIGFU (majeur)

- **Client** : Ministère de l'Urbanisme, du Logement et du Cadre de Vie, Côte d'Ivoire, via IGN FI
- **Période** : janvier 2024 → présent · **Équipe** : 9 développeurs, 3 testeurs
- **Stack** : Java · PostgreSQL · Drools · ExtJS `[F1]`, `[F2]`
- **Titre** : « Migrer un cadastre national sans arrêter le service »
- **Enjeu** : le SGFH devait devenir le SIF, avec de nombreuses améliorations fonctionnelles
- **Contrainte** : 9 schémas **PostgreSQL** `[F1]`, dont `innola` à 150 tables et `public` à 59 ; **lecture et écriture** dans les bases d'autres services de l'État `[F4]` ; chaque action CRUD passe par des règles métier validées via Drools
- **Fait** : conception et développement des interfaces métier des gestionnaires fonciers et du portail public ouvert à plus de 100 usagers ; portage des attentes du client en atelier ; estimation des tâches et suivi du calendrier en appui au chef d'équipe
- **Ce qui a tenu** : mise en production réussie en novembre 2024, qui était le défi du projet
- **Schéma** `[F2]`, `[F3]`, `[F4]` — redessiné d'après le croquis de Lionel. Le portail est une **application distincte**, pas un client du même backend :

```
PORTAIL SIGFU (public)              SIF
  Angular                             ExtJS
    ↓                                   ↓
  NestJS  ←── lecture seule ────      API Java ⇄ Drools (métier)
    ⇅         via les API SIF             ⇅
  PostgreSQL (propre)                 PostgreSQL · 9 schémas
                                          ⇅  lecture ET écriture
                                    BDD autres services de l'État
```

### Cas 2 — Comptes data internationaux

- **Client** : RAPP IO Mauritius · **Période** : 2022 → 2024 · **Stack** : SQL · Salesforce
- **Titre** : « Deux comptes data, des flux qu'on ne peut pas casser »
- **GlaxoSmithKline** (mars 2023 – janvier 2024) : transformation et analyse des données marketing du groupe, optimisation de requêtes SQL dont les résultats portaient sur des milliers de lignes
- **Cartier** (septembre 2022 – mars 2023) : reprise et maintien des traitements de préparation des données marketing des campagnes analytiques, dans les flux Salesforce existants

Deux marques, pas trois `[F6]`. Mercedes-Benz relève du cas 3 : c'est du webmastering, pas de la data.

### Cas 3 — Webmastering et coordination

- **Client** : Mercedes-Benz via RAPP IO Mauritius · **Période** : décembre 2021 → septembre 2022 · **Stack** : AEM
- **Titre** : « Publier du web à l'échelle d'un constructeur »
- **Fait** `[B2]`, `[F6]` : production et publication de contenus web sous AEM ; coordination interne, avec un collègue, de l'équipe de Madagascar, la production étant répartie entre Maurice et Madagascar (4 équipes de 9 à 12 personnes, 3 à Maurice et 1 à Madagascar)
- **Attention** : aucune production web **au sens du développement** à Maurice `[F7]`. La maquette v3 attribuait par erreur cette production à BICI ; c'est faux sur les deux plans.

### La reprise d'existant n'est pas un cas, c'est un fil

BICI ne tient pas une étude de cas : deux mois. Mais « reprendre l'existant » est l'une des trois compétences que Lionel revendique, et elle est vraie des **trois** missions. Elle devient donc un bloc transversal en clôture du mouvement 03, pas une quatrième page :

- **SGFH → SIF** : migrer une application foncière en service, sans l'arrêter `[A1]`
- **Cartier** : reprendre des flux Salesforce en place, sans les refaire `[B1]`
- **BICI** : quatre applications sous APJ, framework interne JEE, sans documentation `[C1]`

## 2.6 États et cas limites

| Cas | Comportement |
|---|---|
| Page EN absente | Repli automatique sur le FR, aucune 404 |
| Photo absente | Planche en colonne droite, mise en page inchangée |
| JavaScript désactivé | Contenu intégralement lisible ; pas d'amortissement, pas de bascule, **thème clair** (`data-theme` est écrit en dur dans le markup) |
| `prefers-reduced-motion` | Aucune animation, aucun amortissement, contenu immédiatement visible |
| Firefox / Safari | Révélations par `IntersectionObserver`, chaîne par `rAF` |
| 404 | Page dédiée, renvoi vers l'accueil dans la langue détectée |

---

# PARTIE III — ENGINEERING PLAN

## 3.1 Stack

| Couche | Choix | Raison |
|---|---|---|
| Framework | **Astro 7** | Site de contenu : zéro JS envoyé par défaut, collections typées natives, i18n natif |
| Styles | **Tailwind 4** | Jetons CSS en `@theme`, cohérent avec NEXTRI |
| Langage | **TypeScript strict** | |
| Framework UI | **aucun** | Rien sur cette page ne justifie React |
| Dépendances runtime | **zéro** | Ni Lenis, ni GSAP, ni bibliothèque d'animation |
| Traceurs | **zéro** | |
| CDN externes | **zéro** | Polices auto-hébergées |

## 3.2 Structure du dépôt

```
src/
├── content.config.ts             # collections Zod (Astro 7 : à la racine de src/)
├── content/
│   └── cases/ fr/{sif,data,web}.md
│               en/{sif,data,web}.md   ← mêmes slugs
├── components/
│   ├── Hero.astro                # portrait optionnel
│   ├── Plate.astro               # la planche parcellaire
│   ├── Cartouche.astro
│   ├── AuthorityBand.astro
│   ├── Offer.astro               # 02 · les quatre prestations
│   ├── Thread.astro              # le fil « reprendre l'existant »
│   ├── CaseCard.astro            # cas majeur ; les mineurs sont inline
│   ├── CaseDiagram.astro         # schéma par cas
│   ├── Timeline.astro
│   ├── ContactFork.astro
│   ├── ThemeToggle.astro
│   └── LangSwitch.astro
├── layouts/ Base.astro · Case.astro
├── pages/
│   ├── index.astro · 404.astro
│   ├── cas/[slug].astro
│   └── en/… (miroir)
├── i18n/ fr.ts · en.ts · utils.ts
├── lib/ plate.mjs                  # découpe proportionnelle de la planche
├── scripts/ theme.ts · motion.ts · smooth-scroll.ts
└── styles/ tokens.css · base.css · motion.css
public/
├── cv/CV_Lionel_Ratovo.pdf
└── fonts/*.woff2
scripts/contrast.mjs               # vérification AA, exécutée en CI
```

## 3.3 Modèle de contenu

Collections Astro typées par Zod. **Un champ manquant casse le build, pas la page en production.**

```ts
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    order: z.number(),
    role: z.enum(['or', 'tl', 'yw', 'lv']),      // couleur de rôle
    client: z.string(),
    period: z.string(),
    stack: z.array(z.string()).min(1),
    title: z.string().max(80),
    teaser: z.string().max(280),
    sourceRefs: z.array(z.string()).min(1),       // ex. ['A1','A2'] — traçabilité obligatoire
  }),
});
```

`sourceRefs` est **obligatoire et non vide**. C'est la règle de contenu n°6 rendue mécanique : on ne peut pas publier une étude de cas sans déclarer d'où viennent ses faits.

**Les parcelles ne sont pas dans cette collection.** Elles ont besoin d'une durée, pas d'un corps de texte, et deux d'entre elles (BICI, la parcelle libre) n'ont pas de page. Une constante typée dans `src/lib/plate.mjs` suffit :

```ts
export const MISSIONS = [
  { id:'bici', mois:2,  role:'lv', op:.30 },
  { id:'merc', mois:9,  role:'yw', op:.32 },
  { id:'cart', mois:6,  role:'tl', op:.20 },
  { id:'gsk',  mois:10, role:'tl', op:.34 },
  { id:'sif',  mois:31, role:'or', op:.32 },
  { id:'free', mois:12, role:'tx', op:.045 },
] as const;
```

`op` sépare Cartier de GSK, qui partagent le rôle « données » et sont mitoyennes. Les libellés vivent dans `i18n/`, pas ici : la planche est bilingue.

## 3.4 Internationalisation

- Routage natif Astro : FR sans préfixe (défaut), EN sous `/en/`.
- Dictionnaire d'interface en TypeScript, clés typées.
- **Repli automatique sur le FR** pour toute page EN absente.

**Conséquence de conception, importante** : *l'anglais peut arriver après le français sans rien casser.* Le site est livrable en FR seul, et l'EN s'ajoute page par page. La traduction ne bloque jamais la mise en ligne.

- `hreflang` réciproque sur chaque paire, `x-default` → FR.
- Le sélecteur de langue mène à la page équivalente, jamais à l'accueil.

## 3.5 Thème — implémentation

1. **Script bloquant** en tête de `<head>` : lit `localStorage.theme`, sinon `matchMedia('(prefers-color-scheme: dark)')`, pose `data-theme` et `data-theme-pref`.
2. Module `theme.ts` : cycle des trois états, écriture ou effacement de la clé, classe `.no-tr` sur deux images, écoute de `change` sur la media query tant que la préférence est « système ».
3. Sans JavaScript : `data-theme="light"` étant écrit en dur dans le markup, le site s'affiche en clair, qui passe l'AA intégralement. **On ne duplique pas les jetons sombres dans un `@media (prefers-color-scheme: dark)`** : une valeur recopiée diverge dès la première modification de l'une des deux copies. Le coût est le thème sombre pour une fraction de pour cent de visiteurs, le gain est quinze lignes qui ne peuvent plus se contredire.

## 3.6 Mouvement — implémentation

- `motion.css` : tout le bloc `@media (prefers-reduced-motion: no-preference) { @supports (animation-timeline: view()) { … } }`.
- `motion.ts` : détection, et **uniquement en repli**, `IntersectionObserver` + `rAF`.
- `smooth-scroll.ts` : module autonome, coupé si `pointer: coarse` ou `prefers-reduced-motion`.
- Aucune animation de propriété de mise en page. `transform` et `opacity` seulement, plus `clip-path` et `stroke-dashoffset`.

## 3.7 Performance

| Budget | Cible |
|---|---|
| JavaScript total | **< 6 Ko** compressé |
| LCP | < 1,5 s en 4G simulée |
| CLS | < 0,02 |
| Poids de la page d'accueil | < 220 Ko, polices comprises |
| Lighthouse | ≥ 95 sur les quatre axes |

Moyens : polices en `woff2` sous-ensemblées avec préchargement du seul poids critique et `font-display: swap` ; images via `astro:assets` en AVIF/WebP avec dimensions explicites ; SVG inlinés, jamais chargés en requête séparée ; grain en `data:` URI.

## 3.8 SEO et données personnelles

- Balises meta par page, OpenGraph avec image générée par langue.
- JSON-LD `Person` : nom, intitulé, lieu, `knowsLanguage`, `alumniOf`. **Sans `sameAs`** — Lionel n'a ni LinkedIn ni GitHub, et la règle n°3 s'applique.
- `sitemap.xml`, `robots.txt`.
- **Email** : obfusqué, reconstruit en JavaScript.
- **Téléphone** : jamais présent dans le HTML servi. Reconstruit en JavaScript au clic, puis exposé en `tel:`. Un numéro en clair sur une page indexée finit dans les bases de démarchage ; un visiteur humain l'obtient en un clic. *Décision validée le 31/07/2026.*
- Pas de formulaire : aucun service tiers, aucun compte à gérer, aucune donnée transitant par un intermédiaire.

## 3.9 Qualité et tests

| Contrôle | Outil | Seuil |
|---|---|---|
| Lint et format | Biome | zéro erreur |
| Types | `astro check` | zéro erreur |
| **Contraste AA** | `scripts/contrast.mjs` | **zéro échec, les deux thèmes** |
| Parcours critiques | Playwright | 4 scénarios |
| Budget JavaScript | `find` + `gzip` en CI | < 6 Ko |
| Performance | **Lighthouse, passe manuelle** | ≥ 95 |

**Quatre scénarios Playwright**, ceux qui cassent silencieusement :
1. Navigation et ancres, sur les deux langues
2. Bascule de langue → page équivalente, jamais l'accueil
3. Cycle de thème sur trois états, persistance après rechargement, suivi de l'OS
4. Téléchargement du CV et révélation du téléphone

**Pas de tests unitaires.** Il n'y a pas de logique à tester sur un site de contenu ; en écrire serait du théâtre. Le contrôle utile est visuel, d'accessibilité et de parcours.

Le script de contraste est **repris de la campagne de vérification du 31/07/2026** et devient un contrôle permanent, exécuté en CI.

## 3.10 CI/CD

GitHub Actions, deux workflows :

- **`ci.yml`** sur chaque poussée : `biome` → `astro check` → `build` → `contrast` → `playwright` → deux `grep` de garde (aucun lien social, aucun numéro en clair) → budget JavaScript.

**Lighthouse ne tourne pas en CI.** C'est l'étape la plus lourde du pipeline, et sur un site statique de dix pages sans JavaScript d'exécution le score ne bouge quasiment pas d'un commit à l'autre. Les budgets restent la cible : une passe manuelle avant mise en ligne, et à chaque changement de polices ou de planche.
- **`deploy.yml`** sur `main` : build puis publication GitHub Pages.

`astro.config.mjs` garde `site` et `base` configurables, pour qu'un passage vers un domaine propre ne demande aucune reprise de code.

## 3.11 Jalons

| # | Contenu | Fin de jalon quand |
|---|---|---|
| ① | Socle : Astro, Tailwind, jetons, polices auto-hébergées, thème, `scripts/contrast.mjs` | Le thème cycle sur trois états, persiste, suit l'OS ; contraste à zéro échec |
| ② | Composants et accueil FR complet, sans mouvement | L'accueil rend correctement à 390 / 768 / 1440 px |
| ③ | Collections, 3 études de cas FR, schémas SVG | Les 3 pages rendent, `sourceRefs` renseigné partout |
| ④ | Couche de mouvement : entrée, timelines, amortissement, replis | Vérifié sur Chrome **et** Firefox |
| ⑤ | Traduction EN, `hreflang`, sélecteur de langue | Bascule vers page équivalente sur les 5 pages |
| ⑥ | SEO, sitemap, 404, CI/CD, mise en ligne | Lighthouse ≥ 95 en passe manuelle, site en ligne |

Les jalons ① à ④ produisent un site **livrable en français**. L'anglais est un ajout, pas un prérequis.

---

## 4. Risques et points ouverts

| # | Risque | Traitement |
|---|---|---|
| 1 | **La planche est illisible à 390 px** *(constaté sur la maquette, non résolu)* | Sous 768 px, la planche passe pleine largeur dans son propre bloc sous le hero, avec les étiquettes de dates masquées et les noms seuls conservés. **À traiter au jalon ②, pas plus tard.** |
| 2 | Le coût réel du projet est la rédaction, pas le code | 3 cas × 2 langues ≈ 6 textes longs. Le repli FR permet de livrer sans attendre l'EN. |
| 3 | Les schémas SVG sont le poste graphique le plus lourd | Un gabarit commun, un seul jeu de primitives (nœud, liaison, étiquette). Jalon ③. |
| 4 | Firefox et Safari sans `animation-timeline` | Repli déjà spécifié et vérifiable au jalon ④. |
| 5 | L'amortissement du scroll est un choix clivant | Trois garde-fous. Si Lionel ne l'aime pas, une constante à `false` le retire sans autre effet. |
| 6 | La photo peut ne jamais arriver | Le hero fonctionne sans. Aucune décision n'en dépend. |
| 7 | « Ouvert aux opportunités » périme | Une seule chaîne, dans le dictionnaire i18n. Un changement, deux lignes. |
| 8 | Adresse email exposée | Obfuscation. Accepté : un email joignable est le but du site. |

**Points à confirmer avec Lionel avant le jalon ③**, aucun bloquant :
1. Portrait professionnel : oui ou non, et quand.
2. Le CV PDF déposé dans `/public` est-il bien la sortie à jour du `pdf-pipeline` ?
3. Formulation exacte de la promesse « réponse sous 24 heures » de la porte recrutement : est-elle tenable ?

---

## Annexe A — Traçabilité

Chaque fait affiché renvoie à `CV_Lionel_Ratovo_MASTER.md`, à ses réponses de questionnaire, ou à `RETOURS-LIONEL-2026-08-01.md` pour les repères `[F*]`.

| Affiché | Source |
|---|---|
| Technical Project Lead · Backend & Data Engineer | frontmatter |
| En activité depuis 2021 | Expériences |
| Migration SGFH → SIF, MEP novembre 2024 | `[A1]`, `[A6]` |
| 9 schémas **PostgreSQL**, `innola` 150 tables, `public` 59 | `[A2]`, `[F1]` |
| Portail SIGFU distinct, lecture seule via API | `[F2]`, `[F3]` |
| Lecture et écriture vers les autres services de l'État | `[F4]` |
| Mercedes-Benz = webmastering, pas data | `[F6]` |
| Aires des parcelles ∝ durées | `[F10]` |
| Drools sur chaque action CRUD | `[A2]` |
| Portail public, plus de 100 usagers | EXPÉRIENCE |
| Équipe de 9 développeurs et 3 testeurs | `[A3]`, `[B4]` |
| Atelier client, estimation, suivi de calendrier | `[A4]` |
| GSK, milliers de lignes | `[B3]` |
| Cartier, flux Salesforce existants | `[B1]` |
| Mercedes-Benz, AEM, coordination Madagascar | `[B2]` |
| BICI, quatre applications sous APJ | `[C1]` |
| Master MIAGE MBDS, Université Côte d'Azur | `[D1]` |
| Licence informatique, option Web et Design | `[D2]` |
| Anglais professionnel, écrit et oral technique | `[D3]` |

**Faits volontairement absents** : la latence « ~2 s » du SIF (`[A2]`, non mesurée, indéfendable en entretien) ; tout niveau d'anglais chiffré (`[D4]`) ; toute référence client de NEXTRI (aucune n'existe).

**Faits retirés le 01/08/2026 parce qu'ils étaient inventés**, non parce qu'ils étaient sensibles : « Oracle » comme moteur du SIF (le master ne nomme aucun moteur, la valeur a été déduite de la liste de compétences) ; Angular dans la stack du SIF ; la production web attribuée à BICI ; le portail branché sur le même backend que les applications métier. Les quatre venaient de la rédaction, pas des sources.

**Trois vérifications en attente de Lionel** : le trou d'août 2025 à avril 2026 mentionné dans `sources/README.md` sans nom de porteur (s'il est de lui, la parcelle du SIF perd 8 mois) ; sa présence physique à Maurice ; la tenue de la promesse « réponse sous 24 heures ».

## Annexe B — Hors périmètre

**Correctif de contraste du site NEXTRI** (`E:\Dev\nextri_portfolio`). La campagne du 31/07/2026 a établi que la palette du collectif ne franchit pas le seuil AA sur du petit texte : `--tx3` à 2,04:1 en thème clair, `--or` en texte à 3,49:1. Le dédoublement graphique / texte décrit en §1.5 s'y applique tel quel, avec les mêmes valeurs calculées.

Traité dans une passe dédiée, sur l'autre dépôt. Mêler les deux alourdirait ce plan sans bénéfice.
