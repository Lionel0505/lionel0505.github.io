#!/usr/bin/env node
// Garde de contenu. Deux familles de motifs, une seule porte, parce que les
// deux disent la même chose : ce qui est écrit ici ne doit pas partir tel quel.
//
// La première famille vivait dans une étape shell de .github/workflows/ci.yml,
// donc hors de `pnpm run verify`, donc hors de .github/workflows/deploy.yml,
// qui passe pourtant `verify` justement pour ne rien publier qui rate une
// porte. Une régression remettant un `tel:` en clair aurait été publiée, et
// ci.yml aurait rougi quelques minutes plus tard, après publication. En Node
// et dans `verify`, la porte se ferme avant le déploiement.
//
// La seconde famille est typographique. La contrainte est explicite depuis le
// début du projet et rien ne l'appliquait, ce qui explique que quinze revues
// successives en aient laissé passer un chacune. Un garde qui tourne à chaque
// `verify` vaut mieux que quinze relectures.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const rel = (p) => relative(process.cwd(), p).replace(/\\/g, '/');
let failed = 0;

/* ============================================================
   FUITES DANS LE SITE CONSTRUIT
   Mêmes motifs que l'étape shell qu'ils remplacent. La lecture se fait en
   latin1 : les octets sont conservés tels quels, donc un fichier binaire est
   fouillé comme le faisait `grep -r`, sans erreur de décodage.

   ANGLE MORT ASSUMÉ : ce garde lit des octets, et le texte d'un PDF est
   compressé. Il ne voit donc RIEN de ce que contient
   dist/cv/CV_Lionel_Ratovo.pdf, et son feu vert ne dit strictement rien sur
   ce fichier. Vérifié le 03/08/2026 : ses vingt flux se décompressent, mais
   sa police est sous-ensemblée avec un encodage propre, donc même une
   extraction correcte ne rend pas de texte lisible sans sa table ToUnicode.
   Ce qu'un PDF déposé dans public/ expose relève d'une relecture humaine,
   pas de cette porte, et rien ici ne doit laisser croire le contraire.
   ============================================================ */
const FUITES = [
  // Aucun lien social nulle part sur le site : Lionel n'a ni LinkedIn ni
  // GitHub, et en inventer un serait un fait fabriqué.
  { motif: /linkedin\.com/i, quoi: 'lien LinkedIn' },
  { motif: /github\.com\/[Ll]ionel/, quoi: 'lien GitHub' },
  // Le numéro de téléphone en clair ne doit jamais apparaître dans le HTML
  // construit ; seule sa forme encodée en base64 le peut, SiteFooter.astro la
  // fabriquant au clic.
  //
  // Cherché sur les séparateurs retirés, et non sur la forme espacée seule :
  // une fuite s'écrirait aussi bien « +261 34 21 137 98 » que
  // « +261342113798 », « 034 21 137 98 » ou « 34.21.137.98 », et le motif
  // calé sur une seule de ces formes laissait passer les autres. Relevé :
  // avant ce changement, une page contenant « +261342113798 » traversait la
  // porte sans un mot. La suite de neuf chiffres retenue est commune au
  // format international et au format local, et c'est la même que celle que
  // mesure tests/flows.spec.ts.
  //
  // Seuls les séparateurs sont retirés, pas tous les caractères non
  // numériques : deux nombres voisins séparés par une lettre ne peuvent donc
  // pas se recoller en un faux positif, ce qui compte dans du CSS minifié.
  { motif: /342113798/, quoi: 'numéro de téléphone en clair', sur: 'compact' },
  // Le lien tel: n'est créé qu'en JavaScript au clic : sa présence dans un
  // fichier construit signifierait qu'il a fui au rendu statique.
  { motif: /tel:\+261/, quoi: 'lien tel: rendu statiquement' },
];

// Espaces, points, tirets, parenthèses et espace insécable : tout ce qui
// s'écrit entre les chiffres d'un numéro de téléphone.
const SEPARATEURS = /[\s.() -]/g;

let fuites = 0;
for (const f of walk('dist')) {
  const octets = readFileSync(f, 'latin1');
  const compact = octets.replace(SEPARATEURS, '');
  for (const { motif, quoi, sur } of FUITES) {
    if (motif.test(sur === 'compact' ? compact : octets)) {
      console.error(`FAIL fuite   ${rel(f)} : ${quoi} (${motif})`);
      fuites++;
    }
  }
}
console.log(
  fuites
    ? `${fuites} fuite(s) dans dist/`
    : `ok   aucune fuite dans dist/ (${FUITES.length} motifs)`,
);
failed += fuites;

/* ============================================================
   TYPOGRAPHIE DES SOURCES
   Dans les sources, jamais dans dist/ : c'est ce qui est écrit qu'il faut
   corriger, et une seule faute produirait sinon autant de FAIL que de pages
   construites. docs/ est hors périmètre : le PRD, le plan et la maquette de
   référence sont des documents reçus, pas du code de ce site.
   ============================================================ */
// Le cadratin est écrit en échappement, jamais en clair : sinon ce fichier se
// signalerait lui-même, et le garde ne pourrait plus jamais sortir à 0.
const CADRATIN = String.fromCharCode(0x2014);
const TYPO = [
  { motif: new RegExp(CADRATIN), quoi: 'tiret cadratin' },
  // Double tiret employé comme tiret de prose. Les tirets d'options
  // (--frozen-lockfile) et les propriétés personnalisées CSS (--tx3) sont
  // collés à un mot et ne sont donc pas visés.
  { motif: /\s--\s/, quoi: 'double tiret employé comme tiret' },
  // Séparateur de bloc en tirets. La forme retenue dans ce dépôt est
  // /* ====== */.
  { motif: /^\s*\/\*\s*-{3,}/, quoi: 'séparateur de bloc en tirets' },
];
// Une ligne réduite à trois tirets est un séparateur de frontmatter YAML,
// dans les .astro comme dans les .md des collections : jamais une faute.
const FRONTMATTER = /^\s*---\s*$/;

let typo = 0;
for (const racine of ['src', 'scripts', 'tests', '.github']) {
  for (const f of walk(racine)) {
    readFileSync(f, 'utf8')
      .split(/\r?\n/)
      .forEach((ligne, i) => {
        if (FRONTMATTER.test(ligne)) return;
        for (const { motif, quoi } of TYPO) {
          if (motif.test(ligne)) {
            console.error(`FAIL typo    ${rel(f)}:${i + 1} : ${quoi}`);
            typo++;
          }
        }
      });
  }
}
console.log(
  typo
    ? `${typo} faute(s) de typographie dans les sources`
    : `ok   typographie des sources conforme (${TYPO.length} motifs)`,
);
failed += typo;

process.exit(failed ? 1 : 0);
