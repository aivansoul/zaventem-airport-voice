# Sources officielles et gouvernance de la base

Date de collecte et de vérification : **2026-11-19**, fuseau `Europe/Brussels`.

Ce registre accompagne la base [base-connaissances.md](../knowledge/base-connaissances.md). Les descriptions sont des résumés originaux ; aucun long passage du site n’est reproduit.

## 1. Périmètre et méthode

- Domaine principal : `www.brusselsairport.be`, complété uniquement par des sous-domaines officiels explicitement identifiés.
- Périmètre fonctionnel : informations destinées aux passagers, visiteurs et accompagnants.
- Langues observées : français (`fr`), néerlandais (`nl`) et anglais (`en`).
- La recherche interne officielle exposait environ 1 560 résultats, dont environ 254 dans la catégorie Passagers. Les nombres changent avec l’index et ne constituent pas un inventaire contractuel.
- Les pages ont été lues et synthétisées ; les textes, images et mises en page n’ont pas été copiés dans la base.

## 2. Classes de fraîcheur

| Classe | Usage | Politique minimale |
|---|---|---|
| `stable` | Identité, responsabilité ou parcours structurel | Revoir tous les 30 jours |
| `semi_dynamic` | Règle, emplacement, horaire, tarif, service, réglementation | Revoir tous les 7 jours et avant démo |
| `live` | Vol, porte, comptoir, tapis, attente, occupation, ouverture, trafic | Ne jamais servir depuis la KB ; requête live ou redirection |

Les exigences de passeport, visa, santé, sûreté et compagnie restent sensibles même lorsqu’elles semblent stables.

## 3. Registre des sources

Toutes les sources ci-dessous ont été consultées le 2026-11-19. « Date publiée » signifie la date affichée par la page ; lorsqu’elle manque, elle est notée `non indiquée`.

### Accueil, langues et canaux digitaux

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S01 | [Accueil passagers EN](https://www.brusselsairport.be/en/passengers) | Navigation passagers, services et indicateurs dynamiques | `live` | non indiquée |
| S02 | [BRUce et WhatsApp](https://www.brusselsairport.be/en/passenger/contact/ask-bruce/) | Langues FR/NL/EN, disponibilité annoncée 24/7 | `semi_dynamic` | non indiquée |
| S03 | [App Brussels Airport](https://www.brusselsairport.be/en/app) | Suivi vol, parcours, tapis bagage et BRUce | `live` | non indiquée |
| S04 | [Départs](https://www.brusselsairport.be/en/passenger/flights/departing) | Tableau officiel des départs | `live` | non indiquée |
| S05 | [Arrivées](https://www.brusselsairport.be/en/passenger/flights/arriving) | Tableau officiel des arrivées | `live` | non indiquée |
| S06 | [Sélecteur de vol BRUce](https://www.brusselsairport.be/en/passenger/flight-selector) | Notifications et parcours jusqu’à sept jours avant le vol | `live` | non indiquée |

### Préparation, bagages, sûreté et frontières

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S07 | [Préparer son voyage](https://www.brusselsairport.be/en/passenger/travel-planner/prepare-your-travel) | Checklist, check-in et FAQ de préparation | `semi_dynamic` | non indiquée |
| S08 | [Check-in](https://www.brusselsairport.be/en/passenger/travel-planner/check-in) | En ligne, bornes, comptoir, bag drop et heure d’arrivée | `semi_dynamic` | non indiquée |
| S09 | [Self Bag Drop](https://www.brusselsairport.be/en/passenger/travel-planner/luggage/self-bag-drop/) | Processus et compagnies compatibles | `semi_dynamic` | non indiquée |
| S10 | [Contrôle de sécurité](https://www.brusselsairport.be/en/passenger/travel-planner/security-screening/) | Préparation au contrôle, implants et contrôles secondaires | `semi_dynamic` | non indiquée |
| S11 | [Bagage cabine](https://www.brusselsairport.be/en/passenger/travel-planner/luggage/hand-luggage/) | Liquides, batteries, objets interdits, poussettes et animaux | `semi_dynamic` | non indiquée |
| S12 | [Liquides et gels](https://www.brusselsairport.be/en/passenger/travel-planner/liquids-and-gels/) | Règle 100 ml, sac 1 litre et exceptions | `semi_dynamic` | non indiquée |
| S13 | [Bagage en soute](https://www.brusselsairport.be/en/passenger/travel-planner/luggage/hold-luggage/) | Interdictions, batteries, emballage et sécurité | `semi_dynamic` | non indiquée |
| S14 | [Documents de voyage](https://www.brusselsairport.be/en/passenger/travel-planner/documents/) | Passeport, ID, visa, médicaments et grossesse | `semi_dynamic` | non indiquée |
| S15 | [Contrôle frontière](https://www.brusselsairport.be/en/passenger/travel-planner/border-control) | Schengen, e-gates et renvoi EES | `semi_dynamic` | non indiquée |
| S16 | [Entry/Exit System](https://www.brusselsairport.be/en/passenger/travel-planner/border-control/entry-exit-system) | Public concerné, exemptions et biométrie EES | `semi_dynamic` | non indiquée |
| S17 | [FAQ passagers historique](https://www.brusselsairport.be/en/passengers/your-travel-planner/faq) | Bagages, PRM, annulation et Lost & Found ; source secondaire à dédupliquer | `semi_dynamic` | non indiquée |
| S18 | [Correspondances](https://www.brusselsairport.be/en/passenger/travel-planner/connections/) | Contrôles par trajet et transfert des bagages | `semi_dynamic` | non indiquée |
| S19 | [Parcours à l’arrivée](https://www.brusselsairport.be/en/passengers/your-travel-planner/arriving-at-brussels-airport) | Frontière, tapis, sortie et transports | `semi_dynamic` | non indiquée |

### Mobilité et parking

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S20 | [Train](https://www.brusselsairport.be/en/passenger/mobility/public-transport/train) | Gare niveau -1, accès, fréquence indicative et supplément | `live` pour horaires/prix | non indiquée |
| S21 | [Bus](https://www.brusselsairport.be/en/passenger/mobility/bus) | Gare niveau 0, STIB, De Lijn, autocars et navettes | `live` pour horaires/quais | non indiquée |
| S22 | [Taxi](https://www.brusselsairport.be/en/passenger/mobility/airport-transfer/) | Station officielle et identification des taxis | `semi_dynamic` | non indiquée |
| S23 | [Location et autopartage](https://www.brusselsairport.be/en/passenger/mobility/car-rental-and-sharing) | Accès aux loueurs et voitures partagées | `semi_dynamic` | non indiquée |
| S24 | [Vélo et moto](https://www.brusselsairport.be/en/passenger/mobility/bike-motorcycle) | Accès cyclable et parkings | `semi_dynamic` | non indiquée |
| S25 | [Tous les transports](https://www.brusselsairport.be/en/passenger/mobility/how-to-get-to-brussels-airport) | Vue générale et Time Advisor | `live` pour perturbations | non indiquée |
| S26 | [Drop-off](https://www.brusselsairport.be/en/passenger/mobility/drop-off) | Règle des dix minutes, GPS et alternative parking | `semi_dynamic` | non indiquée |
| S27 | [Parking](https://www.brusselsairport.be/en/passenger/mobility/parking/) | Produits, distances, recharge, réservation et tarifs | `live` pour prix/disponibilité | non indiquée |
| S28 | [Pick-up](https://www.brusselsairport.be/en/passenger/mobility/pick-up) | P2, points de rencontre et délai après atterrissage | `semi_dynamic` | non indiquée |

### Cartes, accessibilité et familles

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S29 | [Vue générale des cartes](https://www.brusselsairport.be/en/passengers/at-the-airport/maps/overview) | Départs, commerces, arrivées et bagages | `semi_dynamic` | non indiquée |
| S30 | [Départs et correspondances](https://www.brusselsairport.be/en/passengers/at-the-airport/maps/overview/departure-connections) | Zones A/B/T et plans de transfert | `semi_dynamic` | non indiquée |
| S31 | [Shopping et restauration](https://www.brusselsairport.be/en/passengers/at-the-airport/maps/overview/shopping-dining) | Localisation des enseignes | `live` | non indiquée |
| S32 | [Arrivées et bagages](https://www.brusselsairport.be/en/passengers/at-the-airport/maps/overview/arrival-luggage) | Plan du hall bagages et des arrivées | `semi_dynamic` | non indiquée |
| S33 | [Assistance PRM](https://www.brusselsairport.be/en/passenger/at-the-airport/assistance/) | Demande 48 h, desk, fauteuil, handicap invisible, chien et implants | `semi_dynamic` | non indiquée |
| S34 | [Voyager avec des enfants](https://www.brusselsairport.be/en/passenger/travel-planner/traveling-with-children) | Play & Care, bébé, nourriture et poussettes | `semi_dynamic` | non indiquée |
| S35 | [Mineurs non accompagnés](https://www.brusselsairport.be/en/passenger/travel-planner/traveling-with-children/unaccompanied-minors) | Service géré par les compagnies | `semi_dynamic` | non indiquée |

### Perturbations, objets perdus et aide humaine

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S36 | [Vol retardé](https://www.brusselsairport.be/en/passenger/travel-planner/delay) | Rôle de la compagnie, de l’agence et de l’aéroport | `live` pour le vol | non indiquée |
| S37 | [Vol annulé](https://www.brusselsairport.be/en/passenger/travel-planner/cancellation) | Rebooking, remboursement et droits généraux | `live` pour le vol | non indiquée |
| S38 | [Lost & Found](https://www.brusselsairport.be/en/passenger/contact/lost-found/faq/) | Routage objet, bagage, avion, handler et récupération | `semi_dynamic` | non indiquée |
| S39 | [Desk d’information et Airport Crew](https://www.brusselsairport.be/en/passenger/at-the-airport/services/information-desk/) | Desk face à la rangée 3, horaires et crew 24/7 | `semi_dynamic` | non indiquée |
| S40 | [Urgences](https://www.brusselsairport.be/en/passenger/contact/emergency-services/) | Médical, police et Saniport | `stable` avec vérification régulière | non indiquée |
| S41 | [Contact](https://www.brusselsairport.be/en/passenger/contact) | Customer Care, BRUce, compagnie et formulaires | `semi_dynamic` | non indiquée |

### Services et confort

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S42 | [Wi-Fi gratuit](https://www.brusselsairport.be/en/passenger/at-the-airport/services/free-wifi/) | Couverture et connexion | `semi_dynamic` | non indiquée |
| S43 | [Casiers](https://www.brusselsairport.be/en/passenger/at-the-airport/services/lockers) | Localisations, tailles et tarifs | `live` pour prix/capacité | non indiquée |
| S44 | [Catalogue des services](https://www.brusselsairport.be/en/passenger/at-the-airport/services) | Bagages, argent, confort, connectivité, famille et services pratiques | `semi_dynamic` | non indiquée |
| S45 | [Règlement intérieur](https://www.brusselsairport.be/en/legal/house-rules/) | Sûreté, animaux, tabac, images et bagages | `semi_dynamic` | non indiquée |
| S46 | [Lounges Brussels Airport](https://www.brusselsairport.be/en/passenger/at-the-airport/services/lounges/brussels-airport-lounges/) | Diamond Lounge et The View | `live` pour horaires/prix | non indiquée |
| S47 | [FAQ Fast Lane](https://www.brusselsairport.be/en/passenger/online-shop/products/faq/fastlane) | Validité, accès, horaires et conditions | `semi_dynamic` | non indiquée |
| S48 | [FAQ Lounge Pass](https://www.brusselsairport.be/en/passenger/online-shop/products/faq/lounge) | Validité, enfants, accessibilité et séjour | `semi_dynamic` | non indiquée |
| S49 | [Douches](https://www.brusselsairport.be/en/passenger/at-the-airport/services/showers) | Douches à The View et conditions d’accès | `semi_dynamic` | non indiquée |
| S50 | [Prière et méditation](https://www.brusselsairport.be/en/passenger/at-the-airport/services/praying-and-meditation/) | Espaces après sécurité et contacts | `semi_dynamic` | non indiquée |
| S51 | [Espaces fumeurs](https://www.brusselsairport.be/en/passenger/at-the-airport/services/smoking-areas) | Zones désignées A/B/T | `semi_dynamic` | non indiquée |
| S52 | [Pharmacie](https://www.brusselsairport.be/en/passengers/at-the-airport/shopping/pharmacy) | Localisation et horaires | `live` | non indiquée |
| S53 | [Compagnies et handlers](https://www.brusselsairport.be/en/passenger/contact/airlines-handlers) | Répertoire des transporteurs et prestataires | `live` | non indiquée |
| S54 | [Destinations](https://www.brusselsairport.be/en/passenger/destinations) | Réseau direct et recherche destination | `live` | non indiquée |

### Gouvernance, propriété intellectuelle et données

| ID | Source | Usage | Classe | Date publiée |
|---|---|---|---|---|
| S55 | [Conditions d’utilisation](https://www.brusselsairport.be/en/legal-notices/disclaimer) | Limites des horaires, propriété intellectuelle et responsabilité | `stable` | 2024-10-31 |
| S56 | [Portail développeur](https://developer.brusselsairport.be/) | Accès API officiel restreint ; inscription non disponible lors de la vérification | `semi_dynamic` | non indiquée |

## 4. Données interdites au cache documentaire

Les éléments suivants exigent une source opérationnelle au moment de la demande :

- statut, heure estimée/réelle, porte, comptoir et tapis d’un vol ;
- attente sécurité/frontière et heure d’arrivée personnalisée ;
- occupation, tarif et réservation parking ;
- horaires, voies, quais, grèves et perturbations train/bus ;
- travaux routiers et temps de parcours ;
- ouverture actuelle des enseignes, pharmacies, lounges et services ;
- compagnies, destinations et saisonnalité ;
- prix d’un pass, lounge, casier, parking ou transport ;
- exigences de visa, santé, EES et règles propres à une compagnie.

Sans connecteur live, le bot doit annoncer sa limite puis orienter vers la source correspondante. Il ne doit pas qualifier une donnée de « temps réel » si elle provient d’une page indexée ou d’un cache.

## 5. Ordre d’autorité et escalade

1. Urgence : équipe médicale, police ou 112.
2. Instructions sur place : personnel habilité, écrans et signalétique opérationnelle.
3. Dossier de voyage : compagnie ou agence.
4. Bagage absent/endommagé ou objet à bord : compagnie et handler.
5. Objet perdu dans le terminal : Lost & Found Brussels Airport.
6. Transport : opérateur officiel SNCB/NMBS, STIB/MIVB, De Lijn ou transporteur concerné.
7. Visa, immigration et santé : autorité gouvernementale compétente et compagnie.
8. Information générale : site passagers, app, BRUce, Customer Care et desk.

## 6. Canonicalisation et exclusions techniques

Le site utilise actuellement deux familles de routes :

- accueil : `/{lang}/passengers` ;
- nombreuses pages récentes : `/{lang}/passenger/...` ;
- certaines cartes et anciennes pages restent sous `/{lang}/passengers/...`.

Ne pas remplacer mécaniquement un segment par l’autre. Conserver l’URL finale après redirection et retirer les paramètres suivants avant déduplication :

```text
selected-flight-id
selected-flight-scheduled-time
tab1
lang
pubDate
paramètres de filtre d’interface
```

Exclure par défaut : presse, cargo, B2B, aviation development, airport operations, jobs, voisins/spotters, extranet, formulaires internes et documents professionnels, sauf besoin passager explicite.

## 7. Incohérences connues et décision éditoriale

| Sujet | Conflit constaté | Décision sûre |
|---|---|---|
| Desk d’information | Page passagers : rangée 3 ; ancienne page kiosk : rangée 5 | Utiliser la page passagers, dire « face à la rangée 3 », inviter à suivre la signalétique |
| Heure d’arrivée | Check-in : recommandation générale 2 h ; train : 2 h Europe / 3 h intercontinental | Utiliser Time Advisor et consigne de la compagnie |
| EES | Une section parle de bornes futures ; une autre de 61 bornes | Ne pas promettre de borne ; vérifier live et suivre la police frontière |
| Pick-up | Anciennes pages : P1/P2 ; page actuelle : P2 mis en avant, P1/P2/P3 possibles | Présenter P2 comme option actuelle et vérifier prix/disponibilité |
| Zones de portes | Une page dit « deux gates » mais énumère A, B et T | Dire « zones A, B et T » |
| URLs | Routes `passenger` et `passengers` coexistantes | Résoudre l’URL, dédupliquer, ne pas deviner |

## 8. Limites robots, sitemap et droit d’auteur

- Le 2026-11-19, les requêtes vers `https://www.brusselsairport.be/robots.txt`, `sitemap.xml`, `sitemap_index.xml` et variantes ont renvoyé **HTTP 403** avec une page Akamai « Access Denied » depuis l’environnement de collecte.
- Ce résultat ne permet pas de connaître les directives robots et ne vaut ni permission ni interdiction. Avant tout crawl automatisé étendu, vérifier ces endpoints depuis un accès normal et obtenir la validation juridique ou contractuelle appropriée.
- Les [conditions d’utilisation officielles](https://www.brusselsairport.be/en/legal-notices/disclaimer) indiquent que textes, dessins, photos, images, données, domaines, marques et logos restent protégés et ne peuvent être reproduits ou diffusés sans consentement exprès, sauf exception légale applicable.
- La base doit donc conserver des **faits paraphrasés**, la provenance, la date de vérification et le lien. Ne pas importer de longs passages, images, plans ou logos.
- Une landing page publique ne doit pas laisser croire à un service officiel ni utiliser la marque Brussels Airport sans autorisation.

## 9. Limites d’API et recommandation production

Le [portail développeur Brussels Airport](https://developer.brusselsairport.be/) affichait un accès restreint et l’impossibilité de s’inscrire lors de la vérification. Ne pas contourner cette restriction et ne pas dépendre d’un endpoint privé découvert dans le frontend.

Pour une mise en production :

1. demander un accès partenaire/API à Brussels Airport ;
2. définir les droits de réutilisation des données et de la marque ;
3. journaliser source et horodatage de chaque réponse live ;
4. prévoir une réponse de repli vers l’app, BRUce, les écrans ou la compagnie ;
5. tester chaque scénario critique dans les trois langues.

## 10. Fréquence de maintenance conseillée

- Quotidien ou à chaque appel : vols, perturbations, attentes, parking, transport, commerces.
- Hebdomadaire : tarifs, horaires de service, emplacements, compagnies, destinations, EES, Fast Lane et lounges.
- Mensuel : parcours, cartes, responsabilités, contacts et règles générales.
- Immédiat après incident ou changement réglementaire : sûreté, frontière, santé, urgence et accessibilité.
