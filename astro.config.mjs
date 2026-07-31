import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://lionelratovo.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: { prefixDefaultLocale: false, fallbackType: 'rewrite' },
    fallback: { en: 'fr' },
  },
  integrations: [tailwind({ applyBaseStyles: false })],
});
