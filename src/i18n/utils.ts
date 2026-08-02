import en from './en';
import fr from './fr';

export type Lang = 'fr' | 'en';
const DICT = { fr, en } as const;

export const t = (lang: Lang) => DICT[lang];
// getLang et altPath ont disparu à la tâche 13 : le premier lisait la locale
// dans url.pathname, qui sert toujours le chemin FRANÇAIS sur une route
// réécrite (relevé du 02/08/2026, correction A), donc il rendait "fr" sur
// les pages anglaises. Le second attendait le chemin courant, alors que le
// seul chemin disponible est toujours le français. La locale vient
// désormais uniquement de Astro.currentLocale (Base.astro, LangSwitch.astro).
