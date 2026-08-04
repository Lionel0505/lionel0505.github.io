import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Le compte GitHub est `Lionel0505` et le dépôt porte le même nom que le
  // domaine, `lionel0505.github.io` : c'est un site d'utilisateur, servi à la
  // racine, donc `base` reste « / » et aucun chemin absolu du dépôt n'a
  // besoin d'être préfixé. Le jour où ce dépôt serait renommé autrement,
  // GitHub le servirait sous /<nom-du-depot>/ et il faudrait alors reprendre
  // les chemins absolus des polices, du CV, de la 404, du préfixe /en et du
  // plan du site, en plus de `base` ici.
  //
  // Tout ce qui est absolu dans le site rendu passe par cette valeur : le
  // lien canonique et les trois hreflang (Base.astro), et chaque <loc> du
  // plan du site (sitemap.xml.ts). Il n'y a pas d'autre endroit à changer.
  site: 'https://lionel0505.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
    fallback: { en: 'fr' },
  },
  // GitHub Pages ne sait pas émettre d'en-tête HTTP : la seule politique de
  // sécurité que ce site peut poser est celle qu'Astro écrit dans un
  // `<meta http-equiv="content-security-policy">` de chaque page. Les
  // directives qui n'existent qu'en en-tête — `frame-ancestors`,
  // `X-Frame-Options`, `X-Content-Type-Options`, `Permissions-Policy` — sont
  // hors de portée tant que l'hébergeur ne change pas, et securityheaders.com
  // ne lira jamais ce meta. Ce qui suit protège le navigateur, pas la note.
  //
  // Astro calcule lui-même le hachage de chaque script en ligne (le poseur de
  // thème de Base.astro, le JSON-LD, le décodage du numéro dans
  // SiteFooter.astro) et l'ajoute à `script-src`. Il n'y a donc aucun hachage
  // à tenir à jour à la main ici : modifier un de ces scripts suffit, la
  // construction suivante recalcule.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        // Rien à injecter dans <base>, rien à poster nulle part : le site est
        // statique et le seul formulaire est un mailto.
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        // Aucune iframe sur le site, d'aucune origine.
        "frame-src 'none'",
        // `data:` porte le grain et la trame de fond, encodés en SVG dans le CSS.
        "img-src 'self' data:",
        // Les trois familles sont servies depuis /fonts : aucune origine tierce.
        "font-src 'self'",
        "connect-src 'self'",
        "manifest-src 'self'",
      ],
      styleDirective: {
        resources: [
          // Un attribut `style="…"` ne peut pas être autorisé par hachage, et
          // « 'unsafe-inline' est ignoré dès qu'un hachage est présent dans la
          // liste » : mis dans `style-src` à côté des hachages qu'Astro y
          // ajoute pour ses propres blocs <style>, il ne servirait à rien et
          // Chrome bloquerait les couleurs d'accent des diagrammes de cas
          // (CaseDiagram.astro en porte une vingtaine). `kind: 'attribute'`
          // l'isole dans `style-src-attr`, où il est seul et donc appliqué ;
          // les <style> et <link> restent jugés par `style-src` et ses
          // hachages. Vérifié dans un navigateur, pas déduit de la spec.
          { resource: "'unsafe-inline'", kind: 'attribute' },
          // Les feuilles construites par Astro sont servies depuis le site.
          "'self'",
        ],
      },
    },
  },
  vite: { plugins: [tailwindcss()] },
});
