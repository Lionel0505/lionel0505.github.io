// Contenu du CV, repris mot pour mot du CV précédent (public/cv/CV_Lionel_Ratovo.pdf
// avant la refonte du 2026-10-14). Les gabarits (templates.mjs) ne font que la forme.
export default {
  file: 'Lionel_Ratovo',
  last: 'RATOVO',
  first: 'Sarobidy Marie Lionel',
  short: 'Lionel Ratovo',
  title: 'Développeur full-stack Java · Consultant technico-fonctionnel',
  city: 'Antananarivo, Madagascar',
  phones: ['(+261) 34 21 137 98'],
  email: 'lionelratovo@gmail.com',
  linkedin: 'linkedin.com/in/lionel-ratovo-98a79525a',
  site: 'lionel0505.github.io',
  mobility: 'Remote ou sur site, mobilité internationale',
  profile: [
    "Développeur full-stack Java, cinq ans d'expérience en ESN et en conseil. Depuis janvier 2024, je travaille sur le système d'information foncier national de la Côte d'Ivoire (SIF / SIGFU) pour IGN FI : implémentation, mise en production en novembre 2024, puis maintenance dont j'assure aujourd'hui la charge.",
    "Profil à double entrée, technique et fonctionnelle. J'anime les ateliers avec les utilisateurs métier et je restitue leurs besoins à l'équipe de développement, en parallèle du développement backend (Spring Boot, Drools, Camunda) et frontend (Angular, Ext JS).",
  ],
  highlightsTitle: 'En bref',
  highlights: [
    "Deux ans et demi sur le SI foncier national ivoirien, de l'implémentation à la maintenance en production",
    'Périmètre applicatif adossé à une base PostgreSQL de 9 schémas et plus de 150 tables',
    'Quatre applications métier reprises sur un framework interne non documenté, sans phase de passation',
    "Contexte international : ministère ivoirien, comptes Mercedes-Benz, Cartier et GSK, missions en Côte d'Ivoire, à Maurice et à Madagascar",
  ],
  // Chiffres pour les variantes design : tous tirés des puces ci-dessus.
  figures: [
    ['2,5 ans', 'sur le SI foncier ivoirien'],
    ['9', 'schémas PostgreSQL'],
    ['150+', 'tables'],
    ['4', 'applications reprises'],
  ],
  techTitle: 'Compétences techniques',
  tech: [
    ['Backend', 'Java, Spring Boot, Java EE (JSP), NestJS / Node.js, API REST'],
    ['Règles métier, workflows', 'Drools, Camunda (BPMN)'],
    ['Frontend', 'Angular, Ext JS, JavaScript, HTML, CSS'],
    [
      'Bases de données',
      "PostgreSQL, Oracle Database. Modélisation, requêtes d'extraction, de segmentation et d'audit",
    ],
    ['Sécurité, serveurs', 'Keycloak, WildFly, déploiement applicatif sur serveur distant'],
    ['Outils', 'Git, Jira, revue de pull requests'],
    [
      'Data et marketing',
      'Salesforce Marketing Cloud (Automation Studio), Adobe Experience Manager, Hive',
    ],
  ],
  softTitle: 'Compétences fonctionnelles et transverses',
  soft: [
    "Animation d'ateliers avec les utilisateurs métier, recueil et formalisation des besoins",
    "Découpage, rédaction et suivi des tâches, répartition au sein d'une équipe technique",
    'Encadrement technique, formation de développeurs repreneurs, revue de code',
    "Reprise d'applications existantes non documentées et maintenance évolutive",
    'Support et formation des utilisateurs finaux',
  ],
  jobs: [
    {
      title: 'Consultant développeur full-stack Java',
      period: "Janvier 2024 - Aujourd'hui",
      org: "IGN FI · Projet SIGFU, Ministère de l'Urbanisme, du Logement et du Cadre de Vie, Côte d'Ivoire",
      context:
        "Système d'information foncier national (SIF) et son portail public, pour le compte du ministère. Mise en production en novembre 2024, application en maintenance depuis novembre 2025.",
      bullets: [
        [
          'Backend SIF',
          'implémentation des fonctionnalités métier en Java Spring Boot, modélisation et implémentation des règles métier sous Drools, workflows applicatifs sous Camunda',
        ],
        [
          'Frontend SIF',
          'développement des interfaces des applications métier sous Ext JS, sur base PostgreSQL',
        ],
        [
          'Portail public',
          'développement des fonctionnalités de bout en bout, backend NestJS, frontend Angular, authentification Keycloak, et déploiement des nouvelles versions',
        ],
        [
          'Fonctionnel',
          "animation des ateliers avec les représentants métier du ministère, recueil des retours utilisateurs et traduction en spécifications pour l'équipe technique",
        ],
        [
          'Coordination',
          "appui au chef d'équipe sur l'énumération, la répartition et le suivi des tâches via Jira, encadrement des développeurs sur l'implémentation de certaines fonctionnalités",
        ],
        [
          'Exploitation et transfert',
          'déploiement des versions du SIF sur serveur distant, extractions SQL pour les audits, formation et revue de pull requests des développeurs repreneurs',
        ],
      ],
    },
    {
      title: 'Consultant Data et CRM marketing',
      period: 'Octobre 2022 - Janvier 2024',
      org: 'BICI Madagascar · Mise à disposition auprès de RAPP IO · Comptes Cartier puis GSK',
      context:
        "Intitulé de mission : Data Engineer. Cartier d'octobre 2022 à mars 2023, GSK d'avril 2023 à janvier 2024. Trois mois sur site à Maurice, puis télétravail depuis Madagascar.",
      bullets: [
        [
          '',
          'Segmentation des bases clients par requêtes SQL, en support des campagnes marketing internationales',
        ],
        [
          '',
          'Ciblage et automatisation des campagnes sous Salesforce Marketing Cloud (Automation Studio)',
        ],
        [
          '',
          "Reprise en l'état des traitements de préparation de campagnes existants sur le compte Cartier",
        ],
        ['', 'Formation des consultants entrants lors du transfert du périmètre GSK'],
      ],
    },
    {
      title: 'Webmaster, compte Mercedes-Benz',
      period: 'Décembre 2021 - Septembre 2022',
      org: 'BICI Madagascar · Mise à disposition auprès de RAPP IO',
      context: '',
      bullets: [
        ['', 'Mise à jour des contenus du site sous Adobe Experience Manager'],
        ['', 'Mise à jour du référencement naturel (SEO) selon les campagnes marketing définies'],
        [
          '',
          "Coordination d'une équipe de 8 personnes à Madagascar pour le contrôle qualité des livrables",
        ],
        [
          '',
          'Support technique dans un dispositif de production réparti entre Maurice et Madagascar',
        ],
      ],
    },
    {
      title: 'Développeur Java et assistant chef de projet',
      period: 'Juillet 2021 - Novembre 2021',
      org: 'BICI Madagascar · Applications métier Phô Resto, Fonds Routiers, Team Task, SPAT Capitainerie',
      context:
        "Mission débutée en stage de fin d'études, poursuivie en poste. Java EE (JSP), Oracle Database, PostgreSQL, WildFly, JavaScript.",
      bullets: [
        [
          '',
          'Prise en main de 4 applications métier bâties sur un framework interne non documenté',
        ],
        [
          '',
          "Développement de nouvelles fonctionnalités, correction d'anomalies, optimisation des requêtes SQL et du code source",
        ],
        [
          '',
          "Recueil des besoins et des spécifications, rédaction des tâches et suivi de l'avancement",
        ],
        ['', 'Mise en production des nouvelles versions et support technique aux utilisateurs'],
      ],
    },
  ],
  education: [
    {
      title:
        'Master II MIAGE, parcours MBDS (Mobiquité, Base de Données et intégration de Systèmes)',
      period: '2022 - 2023',
      org: "Université Côte d'Azur et IT University, Antananarivo",
      note: "Projet de fin d'études : fine-tuning d'un modèle OpenAI pour un module de télémédecine",
    },
    {
      title: 'Licence en informatique, option Web et Design',
      period: '2019 - 2021',
      org: 'IT University, Antananarivo',
      note: 'Formation par projets, orientée algorithmique et logique métier : C, C#, WinDev, Ruby, Node.js, Angular',
    },
  ],
  languages: [
    ['Malagasy', 'langue maternelle'],
    ['Français', 'C2, langue de travail depuis 2021'],
    ['Anglais', 'B2, lu et écrit en contexte technique'],
  ],
};
