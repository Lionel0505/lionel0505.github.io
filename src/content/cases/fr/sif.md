---
order: 1
role: or
client: "Ministère de l'Urbanisme · Côte d'Ivoire"
period: "2024 →"
stack: ["Java", "PostgreSQL", "Drools", "ExtJS"]
title: "Migrer un cadastre national sans arrêter le service"
teaser: "Le SGFH devait devenir le SIF. Neuf schémas PostgreSQL, un portail public qui ne fait que lire, et les bases d'autres services de l'État qu'il faut à la fois consulter et alimenter. La mise en production de novembre 2024 était le vrai défi du projet."
sourceRefs: ["A1", "A2", "A3", "A4", "A6", "F1", "F2", "F3", "F4"]
---

## L'enjeu
Le Système de Gestion du Foncier et de l'Habitat devait devenir le Système
d'Information Foncier, avec de nombreuses améliorations fonctionnelles, pour le
Ministère de l'Urbanisme, du Logement et du Cadre de Vie de Côte d'Ivoire.

## La contrainte
Neuf schémas PostgreSQL. Le principal, innola, compte 150 tables ; le schéma
public, 59. Le SIF lit et écrit dans les bases d'autres services de l'État, et
chaque action CRUD passe par des contraintes métier validées via Drools.

Le portail SIGFU est une application distincte, en Angular et NestJS, avec sa
propre base. Il ne touche jamais celle du SIF : il tire ce dont il a besoin par
les API du SIF, en lecture seule.

## Ce que j'ai fait
Conçu et développé les interfaces des applications métier des gestionnaires
fonciers, et celles du portail web ouvert au grand public, utilisé par plus de
cent usagers.

Porté en atelier les attentes du client auprès de l'équipe technique, au sein
d'une équipe de neuf développeurs et trois testeurs.

Assuré l'estimation des tâches et le suivi du calendrier de livraison, en appui
au chef d'équipe sur la charge et les ressources.

## Ce qui a tenu
La mise en production de novembre 2024. C'était le défi du projet, et il est
réussi.
