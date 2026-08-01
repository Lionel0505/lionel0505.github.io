import en from './en';
import fr from './fr';

export type Lang = 'fr' | 'en';
const DICT = { fr, en } as const;

export const t = (lang: Lang) => DICT[lang];
export const getLang = (url: URL): Lang => (url.pathname.startsWith('/en/') ? 'en' : 'fr');
/** Same page in the other language. Case slugs are identical in both locales,
    so there is no translation map, and therefore none that can go stale. */
export const altPath = (path: string): string =>
  path.startsWith('/en') ? path.replace(/^\/en/, '') || '/' : `/en${path}`;
