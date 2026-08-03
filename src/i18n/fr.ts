export default {
  nav: { who: 'Qui je suis', offer: "Ce que j'offre", cases: 'Réalisations', contact: 'Contact' },
  skip: 'Aller au contenu',
  themeLabel: 'Thème',
  // Les trois états du sélecteur, annoncés à la suite de `themeLabel` :
  // « Thème système », « Thème clair », « Thème sombre ». Sans eux, theme.ts
  // concaténait la valeur brute de `data-theme-pref` et un lecteur d'écran
  // français annonçait « Thème system ». Le contenu visible du bouton étant
  // un glyphe, ce nom est le seul retour d'état qu'il donne.
  themeStates: { system: 'système', light: 'clair', dark: 'sombre' },
  langSwitch: 'Version anglaise',
  status: 'Ouvert aux opportunités',
  hero: {
    title: 'Je traduis des besoins métier complexes en systèmes qui',
    titleAccent: 'tiennent',
    // « au total » est load-bearing : sans lui, la phrase se lit comme cinq ans
    // sur le seul SIF, ce que Lionel a relevé [F8].
    lead: "Backend & Data Engineer, Technical Project Lead. Près de cinq ans au total : un système d'information foncier national, deux comptes data internationaux, de la production web.",
    places: ['Antananarivo', 'Abidjan', 'Maurice'],
    ctaCv: 'Télécharger le CV',
    ctaContact: 'Me contacter',
  },
  // La planche : géométrie dans plate.mjs, mots ici. Les deux ne se mélangent pas.
  plate: {
    alt: "Plan parcellaire du parcours. L'aire de chaque parcelle est proportionnelle au temps passé : le SIF et le portail SIGFU en Côte d'Ivoire, les comptes data GSK et Cartier, la production web Mercedes-Benz, la reprise d'existant BICI, et une parcelle libre de douze mois ouverte au prochain projet.",
    sheet: 'PLANCHE 01 · PARCOURS',
    scale: 'AIRE ∝ DURÉE · LEVÉ 2021–2026',
    total: '58 MOIS TRAVAILLÉS · 12 LIBRES',
    hint: '→ Votre projet',
    keys: [
      ['or', 'Mission en cours'],
      ['tl', 'Données'],
      ['yw', 'Production web'],
      ['lv', "Reprise d'existant"],
    ],
    keyFree: 'Libre · 12 mois',
    parcels: {
      bici: { nom: 'BICI', sub: '2021 · 2 mois' },
      merc: { nom: 'Mercedes-Benz', sub: '2021–2022 · 9 mois' },
      cart: { nom: 'Cartier', sub: '2022–2023 · 6 mois' },
      gsk: { nom: 'GSK', sub: '2023–2024 · 10 mois' },
      sif: { nom: 'SIF · SIGFU', sub: "Côte d'Ivoire · 2024 →" },
      free: { nom: 'Parcelle libre', sub: 'Seul · ou à trois avec NEXTRI' },
    },
  },
  who: { heading: 'Qui je suis' },
  offer: { heading: "Ce que j'offre", proof: 'Sur le terrain' },
  authority: { label: "Systèmes et comptes sur lesquels j'ai travaillé" },
  cartouche: {
    label: 'Cartouche · parcours',
    place: 'Antananarivo · Madagascar',
    since: 'En activité depuis',
    missions: 'Missions',
    field: 'Terrain',
    education: 'Formation',
    languages: 'Langues',
    availability: 'Disponibilité',
  },
  cases: {
    heading: "Ce que j'ai accompli",
    read: "Lire l'étude de cas",
    readShort: 'Lire',
    back: 'Retour aux réalisations',
    client: 'Client',
    period: 'Période',
    stack: 'Stack',
  },
  thread: { kicker: 'Un fil qui traverse les trois', heading: "Reprendre l'existant" },
  contact: {
    heading: 'Comment me contacter',
    hiring: { kicker: 'Recrutement', title: 'Un poste à pourvoir ?' },
    project: { kicker: 'Prestation', title: 'Un projet à livrer ?' },
  },
  phone: { reveal: 'Afficher le numéro' },
  // Servie par GitHub Pages pour tout chemin inconnu, y compris sous /en/ :
  // relevé du 02/08/2026 (correction B). Un seul fichier, donc une seule
  // page qui porte les deux langues plutôt qu'une traduction par locale.
  notFound: {
    title: 'Page introuvable',
    lead: "Cette page n'existe pas.",
    home: "Retour à l'accueil",
  },
} as const;
