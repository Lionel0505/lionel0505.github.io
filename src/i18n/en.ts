import type fr from './fr';

// `fr`'s `as const` gives its tuples and literals precise types (useful
// elsewhere, e.g. plate.keys role slugs); typed directly against `typeof fr`
// that would force `en` to hold the exact same French strings. Widen every
// leaf back to `string` so TypeScript checks shape only, not content.
type Widen<T> = T extends readonly (infer U)[]
  ? Widen<U>[]
  : T extends object
    ? { [K in keyof T]: Widen<T[K]> }
    : string;

const en: Widen<typeof fr> = {
  nav: { who: 'Who I am', offer: 'What I offer', cases: 'Work', contact: 'Contact' },
  skip: 'Skip to content',
  themeLabel: 'Theme',
  langSwitch: 'French version',
  status: 'Open to opportunities',
  hero: {
    title: 'I turn complex business needs into systems that',
    titleAccent: 'hold',
    lead: 'Backend & Data Engineer, Technical Project Lead. Close to five years in total: a national land information system, two international data accounts, web production.',
    places: ['Antananarivo', 'Abidjan', 'Mauritius'],
    ctaCv: 'Download CV',
    ctaContact: 'Get in touch',
  },
  plate: {
    alt: "Parcel plan of the career. Each parcel's area is proportional to time spent: the SIF and SIGFU portal in Côte d'Ivoire, the GSK and Cartier data accounts, Mercedes-Benz web production, BICI legacy work, and one free parcel of twelve months open to the next project.",
    sheet: 'SHEET 01 · CAREER',
    scale: 'AREA ∝ DURATION · SURVEYED 2021–2026',
    total: '58 MONTHS WORKED · 12 FREE',
    hint: '→ Your project',
    keys: [
      ['or', 'Current mission'],
      ['tl', 'Data'],
      ['yw', 'Web production'],
      ['lv', 'Legacy systems'],
    ],
    keyFree: 'Free · 12 months',
    parcels: {
      bici: { nom: 'BICI', sub: '2021 · 2 months' },
      merc: { nom: 'Mercedes-Benz', sub: '2021–2022 · 9 months' },
      cart: { nom: 'Cartier', sub: '2022–2023 · 6 months' },
      gsk: { nom: 'GSK', sub: '2023–2024 · 10 months' },
      sif: { nom: 'SIF · SIGFU', sub: "Côte d'Ivoire · 2024 →" },
      free: { nom: 'Free parcel', sub: 'Alone · or three with NEXTRI' },
    },
  },
  who: { heading: 'Who I am' },
  offer: { heading: 'What I offer', proof: 'In the field' },
  authority: { label: 'Systems and accounts I have worked on' },
  cartouche: {
    label: 'Title block · career',
    place: 'Antananarivo · Madagascar',
    since: 'Working since',
    missions: 'Missions',
    field: 'Field',
    education: 'Education',
    languages: 'Languages',
    availability: 'Availability',
  },
  cases: {
    heading: 'What I have delivered',
    read: 'Read the case study',
    readShort: 'Read',
    back: 'Back to the work',
    client: 'Client',
    period: 'Period',
    stack: 'Stack',
  },
  thread: { kicker: 'A thread through all three', heading: 'Taking over what exists' },
  contact: {
    heading: 'How to reach me',
    hiring: { kicker: 'Hiring', title: 'A role to fill?' },
    project: { kicker: 'Consulting', title: 'A project to deliver?' },
  },
  phone: { reveal: 'Show the number' },
  notFound: {
    title: 'Page not found',
    lead: 'This page does not exist.',
    home: 'Back to home',
  },
};
export default en;
