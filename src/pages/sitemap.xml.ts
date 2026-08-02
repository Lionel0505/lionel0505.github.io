import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Le plan du site se dérive de la collection, comme les pages elles-mêmes :
// une route ajoutée apparaît des deux côtés ou d'aucun. @astrojs/sitemap a
// été mesuré le 02/08/2026 et n'expose que six des huit pages, les trois
// cas anglais lui échappant parce qu'ils naissent d'une réécriture de route
// dynamique. Une dépendance qui ment sur trois pages sur huit coûte plus
// que ces quinze lignes.
export const GET: APIRoute = async ({ site }) => {
  /* ====== */
  // `site` est typé optionnel (URL | undefined). `astro check` ne s'en
  // plaint pas ici (le second paramètre de URL() accepte `undefined`), donc
  // pas de `!` à justifier ; mais un `site` manquant produirait sinon un
  // "Invalid URL" du constructeur, opaque. Message explicite à la place,
  // comme [slug].astro pour une traduction manquante.
  if (!site) throw new Error('astro.config.mjs ne déclare pas `site`');
  const slugs = (await getCollection('cases', (e) => e.id.startsWith('fr/'))).map((e) =>
    e.id.replace(/^fr\//, ''),
  );
  const paths = ['/', ...slugs.map((s) => `/cas/${s}/`)];
  const all = [...paths, ...paths.map((p) => `/en${p}`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map((p) => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
