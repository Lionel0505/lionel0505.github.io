---
order: 1
role: or
client: "Ministère de l'Urbanisme · Côte d'Ivoire"
period: "2024 →"
stack: ["Java Spring Boot", "Camunda", "Drools", "PostgreSQL", "ExtJS"]
title: "Migrating a national land registry without stopping the service"
teaser: "The SGFH had to become the SIF. Nine PostgreSQL schemas, a public portal that only reads, and other government services' databases that had to be both consulted and fed. The November 2024 go-live was the real challenge of the project."
sourceRefs: ["A1", "A2", "A3", "A4", "A6", "F1", "F2", "F3", "F4"]
---

## The stakes
The Système de Gestion du Foncier et de l'Habitat had to become the Système
d'Information Foncier, with numerous functional improvements, for the
Ministère de l'Urbanisme, du Logement et du Cadre de Vie of Côte d'Ivoire.

## The constraint
Nine PostgreSQL schemas. The main one, innola, holds 150 tables; the public
schema, 59. The SIF reads and writes to other government services' databases,
and every CRUD action passes through business rules validated via Drools.

Land-registry procedures are not code: they are multi-step processes, with
actors and states, orchestrated in Camunda. A rule that changes is remodelled,
not recompiled.

The SIGFU portal is a separate application, in Angular and NestJS, with its
own database. It never touches the SIF's database: it pulls what it needs
through the SIF's APIs, read-only.

## What I did
Designed and developed the interfaces for land managers' business
applications, and those of the web portal open to the general public, used by
more than a hundred users.

Implemented the business features in Java Spring Boot, modelled the rules in
Drools and the application workflows in Camunda.

Carried the client's expectations to the technical team in workshops, within
a team of nine developers and three testers.

Handled task estimation and delivery schedule tracking, in support of the
team lead on workload and resources.

## What held
The November 2024 go-live. That was the challenge of the project, and it
succeeded.

The application has been in maintenance since November 2025, and I am the one
in charge of it. A year in service, then maintenance handed to the person who
built it: the normal sequel to a system that holds.
