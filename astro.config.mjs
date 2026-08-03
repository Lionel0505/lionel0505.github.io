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
  vite: { plugins: [tailwindcss()] },
});
