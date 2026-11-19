# Base de connaissances passagers — Brussels Airport (BRU)

Version vérifiée le **2026-11-19** (fuseau `Europe/Brussels`). Cette base est un résumé original de sources publiques officielles. Elle est conçue pour un voicebot de démonstration trilingue et ne constitue ni un canal officiel de Brussels Airport, ni un avis juridique, médical ou d’immigration.

Registre détaillé des sources : [sources-officielles.md](../docs/sources-officielles.md).

## 1. Convention de fraîcheur

- `[stable]` : fait structurel ; revalidation tous les 30 jours au minimum.
- `[semi_dynamic]` : règle, horaire, prix, service ou localisation susceptible de changer ; revalidation au moins tous les 7 jours et avant une démonstration client.
- `[live]` : information opérationnelle ; aucune réponse ne doit venir d’un document mis en cache. Interroger une source live, sinon expliquer honnêtement la limite.

La date de vérification n’est jamais une garantie de disponibilité future.

## 2. Règles de réponse du voicebot

1. Détecter la langue de l’appelant et répondre en français, néerlandais ou anglais. Si elle est ambiguë : « Français, Nederlands or English? »
2. Donner d’abord une réponse naturelle de **une à trois phrases**. Ajouter les détails seulement si l’appelant les demande.
3. Ne poser qu’une question utile à la fois. Pour un vol : demander le numéro de vol, la date et s’il s’agit d’un départ ou d’une arrivée.
4. Ne jamais inventer une porte, un comptoir, un tapis, une heure, un tarif, un délai ou une disponibilité.
5. Si une donnée live est disponible, annoncer son horodatage : « À 14 h 20, le statut indiqué est… Vérifiez aussi les écrans et votre compagnie. »
6. Sans accès live : « Je n’ai pas le statut en direct dans cet appel. Je peux vous indiquer où le vérifier immédiatement. » Puis orienter vers le tableau officiel, l’app Brussels Airport, BRUce ou la compagnie.
7. Pour une réservation, un billet, un remboursement, une modification, une franchise bagage ou une compensation, orienter vers la compagnie ou l’agence : Brussels Airport ne peut pas modifier le dossier.
8. Ne pas collecter de numéro de passeport, carte d’identité, carte bancaire, mot de passe, code de réservation complet ou donnée médicale détaillée. Si un numéro de vol suffit, ne rien demander de plus.
9. En cas de conflit entre cette base, les écrans sur place et une instruction d’un agent, l’instruction opérationnelle la plus récente prévaut.

## 3. Escalade immédiate et sécurité

### Urgence médicale

- Statut : `[stable]` pour le routage ; disponibilité à confirmer sur place.
- Intentions — FR : `malaise`, `blessé`, `médecin`, `urgence médicale` | NL : `onwel`, `gewond`, `dokter`, `medische nood` | EN : `medical emergency`, `injured`, `doctor`, `unwell`.
- Réponse courte : « Si la personne est à l’aéroport, appelez immédiatement le **02 753 63 63**, indiquez l’endroit exact et son état, restez auprès d’elle et ne raccrochez pas en premier. Le centre médical est au niveau 0, vers la gare des bus. »
- Danger vital ou impossibilité de joindre l’équipe locale : appeler le **112**.
- Source : `[S40]`.

### Police, menace ou bagage abandonné

- Statut : `[stable]`.
- Intentions — FR : `police`, `menace`, `bagage abandonné`, `objet suspect` | NL : `politie`, `dreiging`, `onbeheerde bagage`, `verdacht voorwerp` | EN : `police`, `threat`, `unattended bag`, `suspicious item`.
- Réponse courte : « Ne touchez pas l’objet et éloignez-vous calmement. Prévenez immédiatement un agent ou la police de l’aéroport au **+32 2 709 66 66** ; en danger immédiat, appelez le 112. »
- Sources : `[S40]`, `[S45]`.

### Enfant ou personne vulnérable perdue

- Statut : `[stable]`.
- Réponse courte : « Restez dans un endroit visible et contactez tout de suite l’Airport Crew, le desk d’information ou la police. Ne diffusez pas publiquement de données personnelles détaillées. »
- Sources : `[S39]`, `[S40]`.

## 4. Identité, langues et périmètre

- `[stable]` Brussels Airport est l’aéroport principal de Bruxelles ; code IATA : **BRU**. Ne pas le confondre avec Brussels South Charleroi Airport.
- `[stable]` Adresse GPS courante : **Leopoldlaan, 1930 Zaventem**. Suivre les panneaux « Zaventem – Brussels Airport » depuis le Ring.
- `[stable]` Les canaux passagers publics et BRUce prennent en charge le français, le néerlandais et l’anglais.
- Intentions — FR : `Zaventem`, `Brussels Airport`, `BRU`, `langue` | NL : `luchthaven Zaventem`, `taal` | EN : `Brussels Airport`, `language`.
- Réponse courte : préciser BRU et proposer immédiatement la langue de l’appelant.
- Sources : `[S01]`, `[S02]`, `[S20]`, `[S44]`.

## 5. Vols, portes, comptoirs et tapis

- Statut : `[live]`.
- Intentions — FR : `statut du vol`, `départ`, `arrivée`, `retard`, `porte`, `comptoir`, `tapis` | NL : `vluchtstatus`, `vertrek`, `aankomst`, `vertraging`, `gate`, `incheckbalie`, `bagageband` | EN : `flight status`, `departure`, `arrival`, `delay`, `gate`, `check-in desk`, `carousel`.
- Faits canoniques : horaires, estimations, portes, comptoirs, tapis et statuts peuvent changer jusqu’au dernier moment. L’app et BRUce proposent des mises à jour de vol ; les écrans et la compagnie restent prioritaires.
- Réponse courte avec outil live : donner un seul statut horodaté, puis demander si l’appelant souhaite la porte ou l’heure prévue.
- Réponse courte sans outil : signaler l’absence de live et orienter vers les tableaux officiels, l’app ou la compagnie.
- Ne jamais lire une ancienne page indexée avec un paramètre `selected-flight-id` comme un statut actuel.
- Sources : `[S03]`, `[S04]`, `[S05]`, `[S06]`, `[S47]`.

## 6. Retard, annulation, vol manqué et droits

- Statut : `[live]` pour l’événement ; `[semi_dynamic]` pour les règles générales.
- Intentions — FR : `vol annulé`, `vol retardé`, `correspondance manquée`, `remboursement`, `compensation` | NL : `vlucht geannuleerd`, `vertraagd`, `aansluiting gemist`, `terugbetaling`, `compensatie` | EN : `cancelled flight`, `delayed`, `missed connection`, `refund`, `compensation`.
- Fait canonique : la compagnie est le point de contact pour rebooking, remboursement, repas, hôtel, vouchers et compensation. L’aéroport informe et oriente, mais ne modifie pas le billet.
- Conseil : conserver carte d’embarquement et justificatifs. Pour les droits éventuels, renvoyer vers la compagnie et les règles européennes applicables sans promettre une indemnité.
- Si une correspondance sur réservation unique est manquée, contacter la compagnie ; avec des billets séparés, le passager assume généralement sa nouvelle organisation.
- Sources : `[S35]`, `[S36]`, `[S16]`, `[S37]`.

## 7. Heure d’arrivée et check-in

- Statut : `[semi_dynamic]`, avec recommandation personnalisée `[live]`.
- Intentions — FR : `quand arriver`, `combien de temps avant`, `enregistrement`, `check-in` | NL : `wanneer aankomen`, `hoe lang op voorhand`, `inchecken` | EN : `when should I arrive`, `how early`, `check in`.
- Fait canonique : le site donne une recommandation générale de deux heures, tandis que certaines pages distinguent deux heures pour l’Europe et trois heures pour l’intercontinental. La réponse sûre est d’utiliser le Time Advisor et de suivre la compagnie.
- Check-in possible en ligne, à une borne compatible ou au comptoir de la compagnie. Avec seulement un bagage cabine et une carte d’embarquement valide, le passager peut généralement aller vers le contrôle de sécurité.
- Le comptoir reste nécessaire pour déposer un bagage en soute, recevoir une carte d’embarquement, résoudre un échec de check-in, signaler un besoin particulier ou déposer certains bagages spéciaux.
- Réponse courte : « Prévoyez au minimum la recommandation de votre compagnie. Pour une estimation adaptée à votre vol, utilisez le Time Advisor et ajoutez du temps en cas de travaux ou de forte affluence. »
- Sources : `[S07]`, `[S08]`, `[S20]`.

## 8. Self Bag Drop et bagages enregistrés

- Statut : `[semi_dynamic]`.
- Intentions — FR : `déposer ma valise`, `self bag drop`, `étiquette bagage` | NL : `bagage afgeven`, `self bag drop`, `bagagelabel` | EN : `bag drop`, `self bag drop`, `bag tag`.
- Fait canonique : le Self Bag Drop n’est disponible que pour certaines compagnies et nécessite un check-in préalable. Le parcours consiste à obtenir l’étiquette, la fixer, scanner le document demandé, poser la valise sur le tapis et garder le reçu.
- Les écrans indiquent le comptoir ou la zone du vol. Ne jamais annoncer une rangée depuis la KB.
- Sources : `[S08]`, `[S09]`.

## 9. Contrôle de sécurité et liquides

- Statut : `[semi_dynamic]`.
- Intentions — FR : `liquide`, `sécurité`, `scanner`, `ordinateur`, `chaussures`, `objet interdit` | NL : `vloeistof`, `veiligheidscontrole`, `scanner`, `laptop`, `schoenen`, `verboden voorwerp` | EN : `liquids`, `security screening`, `scanner`, `laptop`, `shoes`, `prohibited item`.
- Faits canoniques : contenants liquides de maximum **100 ml**, réunis dans un sac transparent refermable d’un litre ; exceptions possibles pour médicaments, alimentation spéciale et nourriture pour bébé. Les achats liquides après contrôle doivent rester scellés avec preuve d’achat lorsque requis.
- Au contrôle : carte d’embarquement prête, poches vidées, appareils électroniques sortis du sac selon les instructions, manteau retiré ; suivre toujours l’agent pour les chaussures et contrôles supplémentaires.
- Armes et répliques, objets tranchants et objets contondants ne vont pas en cabine. La liste n’est pas exhaustive.
- Pour prothèse, stomie, pacemaker ou blessure : prévenir l’agent avant le contrôle afin d’organiser une méthode adaptée.
- Réponse courte : répondre sur l’objet demandé, puis ajouter « La décision finale appartient au contrôle et à votre compagnie. »
- Sources : `[S10]`, `[S11]`, `[S12]`, `[S26]`.

## 10. Batteries, médicaments et bagage cabine

- Statut : `[semi_dynamic]`.
- Intentions — FR : `power bank`, `batterie lithium`, `cigarette électronique`, `médicament`, `taille cabine` | NL : `powerbank`, `lithiumbatterij`, `e-sigaret`, `medicatie`, `handbagage afmetingen` | EN : `power bank`, `lithium battery`, `vape`, `medication`, `cabin bag size`.
- Faits canoniques : power banks et cigarettes électroniques restent en cabine. Les appareils à batterie sont de préférence transportés en cabine ; les conditions détaillées dépendent de la compagnie et du type de batterie.
- Médicaments et besoins diététiques peuvent bénéficier d’exceptions ; prévoir une preuve ou attestation lorsque nécessaire.
- Dimensions, poids et nombre de bagages cabine relèvent de la compagnie. Les dimensions indicatives du site ne sont pas une autorisation.
- Sources : `[S11]`, `[S13]`, `[S17]`.

## 11. Bagage en soute, spécial et hors format

- Statut : `[semi_dynamic]`.
- Intentions — FR : `bagage en soute`, `vélo`, `ski`, `golf`, `instrument`, `bagage hors format`, `emballer valise` | NL : `ruimbagage`, `fiets`, `ski`, `golftas`, `muziekinstrument`, `speciale bagage` | EN : `hold luggage`, `bike`, `skis`, `golf bag`, `musical instrument`, `oversized baggage`.
- Faits canoniques : franchises, dimensions, prix et acceptation relèvent de la compagnie. Chaque pièce ne peut pas dépasser la limite opérationnelle indiquée par la compagnie ; l’ancien FAQ de l’aéroport mentionne 32 kg maximum par pièce, à confirmer avec le transporteur.
- Les liquides de plus de 100 ml, objets tranchants ou contondants et certains équipements vont en soute, sous réserve des interdictions.
- Explosifs, substances inflammables, toxiques, infectieuses, radioactives ou corrosives sont interdits. Les armes exigent autorisations et procédures strictes.
- Retirer anciennes étiquettes, sangles et cordons. Seul l’emballage certifié est accepté ; un emballage non autorisé peut être refusé.
- Sources : `[S13]`, `[S17]`, `[S45]`.

## 12. Animaux et chiens d’assistance

- Statut : `[semi_dynamic]`.
- Intentions — FR : `animal`, `chien`, `chat`, `animal en cabine`, `chien d’assistance` | NL : `huisdier`, `hond`, `kat`, `assistentiehond` | EN : `pet`, `dog`, `cat`, `cabin pet`, `assistance dog`.
- Fait canonique : l’acceptation, le transporteur, les documents et le tarif dépendent de la compagnie et de la destination. Les grands animaux voyagent généralement en soute dans une caisse approuvée ; le dépôt spécial est situé au fond du hall des départs entre les rangées 2 et 3.
- Les chiens d’assistance sont bienvenus dans l’aéroport ; prévenir la compagnie à l’avance.
- Dans les zones publiques, les animaux autorisés doivent respecter le règlement, notamment caisse adaptée ou laisse courte selon le cas.
- Sources : `[S11]`, `[S26]`, `[S45]`.

## 13. Documents, visa, grossesse et médicaments réglementés

- Statut : `[semi_dynamic]`, à confirmer auprès d’une autorité officielle.
- Intentions — FR : `passeport`, `carte d’identité`, `visa`, `ETA`, `eTA`, `vaccin`, `enceinte` | NL : `paspoort`, `identiteitskaart`, `visum`, `vaccinatie`, `zwanger` | EN : `passport`, `ID card`, `visa`, `ETA`, `vaccination`, `pregnant`.
- Fait canonique : les documents requis dépendent de la nationalité, de la destination, du transit et de la durée. Vérifier les autorités du pays et la compagnie ; le voicebot ne confirme jamais l’admissibilité personnelle.
- Chaque enfant ou bébé doit disposer de son propre document valide. Certains médicaments exigent une attestation en anglais ou en français.
- À partir d’environ 28 semaines de grossesse, une compagnie peut demander un certificat ; à partir de 36 semaines, de nombreuses compagnies refusent le transport. Vérifier le transporteur.
- Les autorisations électroniques pour le Royaume-Uni, le Canada ou les États-Unis évoluent : ne jamais répondre depuis une valeur mise en cache.
- Sources : `[S14]`, `[S15]`.

## 14. Schengen, contrôle frontière et EES

- Statut : `[semi_dynamic]`, avec exigences personnelles à vérifier en direct.
- Intentions — FR : `Schengen`, `contrôle passeport`, `e-gate`, `EES`, `empreintes` | NL : `Schengen`, `paspoortcontrole`, `e-gate`, `EES`, `vingerafdrukken` | EN : `Schengen`, `passport control`, `e-gate`, `EES`, `fingerprints`.
- Faits canoniques : trajet intra-Schengen sans contrôle frontière systématique ; entrée depuis ou départ vers un pays non-Schengen avec contrôle frontière. Les e-gates acceptent notamment les passeports biométriques UE et l’eID belge, à partir de 12 ans, sous réserve des conditions en vigueur.
- L’EES concerne généralement les ressortissants non UE effectuant un court séjour lors du franchissement d’une frontière extérieure Schengen ; des exemptions existent. L’enregistrement peut inclure passeport, photo faciale, empreintes et informations de voyage.
- La page EES officielle contient des formulations contradictoires sur la disponibilité des bornes. Ne jamais promettre une borne ou un délai ; suivre la signalétique et la police aux frontières.
- Sources : `[S15]`, `[S16]`.

## 15. Correspondances et arrivée

- Statut : `[semi_dynamic]` pour le parcours ; `[live]` pour porte, délai et tapis.
- Intentions — FR : `correspondance`, `transit`, `récupérer bagage`, `arrivée` | NL : `overstap`, `transit`, `bagage ophalen`, `aankomst` | EN : `connection`, `transfer`, `collect baggage`, `arrival`.
- Faits canoniques : sur une réservation unique, le bagage est généralement transféré ; avec des billets séparés, il faut souvent le récupérer et le réenregistrer. Toujours confirmer avec la compagnie.
- Intra-Schengen : généralement pas de contrôle supplémentaire. Non-Schengen vers Schengen : sécurité et frontière. Schengen vers non-Schengen : frontière. Non-Schengen vers non-Schengen : sécurité possible ; suivre les panneaux.
- À l’arrivée, suivre « Baggage Hall », passer la frontière si nécessaire, puis vérifier le tapis sur les écrans ou dans l’app.
- Sources : `[S18]`, `[S19]`, `[S28]`.

## 16. Train

- Statut : `[semi_dynamic]` pour la localisation ; `[live]` pour horaire, voie, tarif et perturbation.
- Intentions — FR : `train`, `gare`, `Bruxelles-Central`, `supplément Diabolo` | NL : `trein`, `station`, `Brussel-Centraal`, `luchthaventoeslag` | EN : `train`, `railway station`, `Brussels Central`, `airport supplement`.
- Faits canoniques : la gare Brussels Airport-Zaventem se trouve au niveau -1 sous les halls ; accès par ascenseur ou escalator. Scanner le QR du billet ou la carte MOBIB aux portiques.
- Des trains directs relient notamment Bruxelles-Nord, Central et Midi. Le site mentionne environ six trains directs par heure vers Bruxelles et un supplément aéroport généralement inclus dans le billet ; fréquence et montant sont à vérifier auprès de SNCB/NMBS.
- Il n’y a pas de métro direct vers l’aéroport.
- Source : `[S20]`.

## 17. Bus, navettes, taxi, location, vélo et moto

- Statut : `[semi_dynamic]` pour les emplacements ; `[live]` pour horaires et prix.
- Intentions — FR : `bus`, `ligne 12`, `De Lijn`, `FlixBus`, `taxi`, `navette hôtel`, `location voiture`, `vélo`, `moto` | NL : `bus`, `lijn 12`, `taxi`, `hotelshuttle`, `huurwagen`, `fiets`, `motor` | EN : `bus`, `line 12`, `taxi`, `hotel shuttle`, `car rental`, `bike`, `motorcycle`.
- La gare des bus est au niveau 0, près du hall des arrivées. La ligne STIB/MIVB 12 dessert le quartier européen ; De Lijn dessert les communes voisines. Les lignes, quais et horaires doivent être vérifiés en direct.
- Les navettes d’hôtel utilisent généralement le quai E. Les autocars interurbains et opérateurs peuvent changer.
- Les taxis officiels attendent devant les arrivées et portent une plaque avec « T » et un logo bleu-jaune. Réservation possible mais non obligatoire pour la file officielle.
- Les comptoirs de location se trouvent près du hall des arrivées ; suivre la signalétique actuelle.
- Stationnement vélo gratuit ou sécurisé disponible selon l’offre ; parking moto P15 indiqué comme gratuit, à revalider.
- Sources : `[S21]`, `[S22]`, `[S23]`, `[S24]`.

## 18. Parking, Drop-off et Pick-up

- Statut : `[semi_dynamic]` pour les règles et emplacements ; `[live]` pour prix, disponibilité et réservation.
- Intentions — FR : `parking`, `déposer quelqu’un`, `venir chercher`, `voiture électrique`, `adresse GPS` | NL : `parking`, `iemand afzetten`, `iemand ophalen`, `elektrische auto`, `gps-adres` | EN : `parking`, `drop off`, `pick up`, `EV charging`, `GPS address`.
- P1, P2 et P3 sont proches du terminal ; des parkings discount avec navette, premium, sécurisés et recharge électrique existent selon disponibilité.
- La Drop-off zone permet actuellement un arrêt gratuit de 10 minutes, une fois par heure, sans réservation. Le conducteur reste avec le véhicule ; ce n’est ni un parking ni une zone de valet.
- Pour accompagner quelqu’un dans le hall, utiliser un parking. Pour reprendre un passager, la page actuelle met P2 Economy en avant ; P1/P2/P3 restent des options proches. Vérifier l’arrivée du vol avant de partir.
- Ne jamais annoncer un prix ou « complet/libre » sans source live. Une réservation peut rester valable même si un panneau affiche complet ; suivre les instructions de réservation et du personnel.
- Sources : `[S25]`, `[S26]`, `[S27]`, `[S28]`.

## 19. Orientation, zones de portes et cartes

- Statut : `[semi_dynamic]`.
- Intentions — FR : `plan`, `où se trouve`, `porte A`, `porte B`, `porte T`, `hall des départs` | NL : `plattegrond`, `waar is`, `gate A`, `vertrekhal` | EN : `map`, `where is`, `Gate A`, `departures hall`.
- Faits canoniques : zone A pour les vols Schengen ; zones B et T pour le non-Schengen. Dire « zones de portes A, B et T », pas « deux portes ».
- La gare est au niveau -1 ; la gare des bus et le centre médical sont au niveau 0. Les halls départs et arrivées sont au-dessus selon la signalétique.
- Pour une localisation précise, proposer la carte officielle et demander si la personne se trouve avant ou après sécurité.
- Sources : `[S29]`, `[S30]`, `[S31]`, `[S32]`.

## 20. Assistance PRM et handicap invisible

- Statut : `[semi_dynamic]`.
- Intentions — FR : `assistance`, `fauteuil roulant`, `mobilité réduite`, `handicap invisible`, `tournesol`, `pacemaker` | NL : `assistentie`, `rolstoel`, `beperkte mobiliteit`, `verborgen handicap`, `zonnebloem` | EN : `assistance`, `wheelchair`, `reduced mobility`, `hidden disability`, `sunflower`, `pacemaker`.
- Demander l’assistance à la compagnie ou à l’agence au moins 48 heures avant le départ. Le service PRM standard est gratuit.
- Après le check-in, se présenter au Special Assistance Welcome Desk derrière la rangée 2, actuellement ouvert de 4 h à 22 h, au moins 90 minutes avant le départ. Des points d’appel existent au P2 niveau 2, à la Drop-off, au quai C des bus et à la gare.
- Des fauteuils peuvent être empruntés au desk. Les équipements de mobilité endommagés doivent être signalés à la compagnie dans le hall bagages.
- Le cordon Sunflower est disponible gratuitement au desk d’information ou au desk d’assistance ; il signale un besoin de patience mais ne donne pas un accès prioritaire automatique.
- Pour pacemaker, prothèse ou implant, prévenir le contrôle avant le passage.
- Source : `[S33]`.

## 21. Familles et mineurs non accompagnés

- Statut : `[semi_dynamic]`.
- Intentions — FR : `bébé`, `poussette`, `changer bébé`, `espace enfants`, `mineur seul` | NL : `baby`, `kinderwagen`, `baby verschonen`, `speelzone`, `alleenreizende minderjarige` | EN : `baby`, `stroller`, `baby changing`, `kids play area`, `unaccompanied minor`.
- Espaces Kids Play & Care après sécurité aux zones A et B ; tables à langer aussi dans la plupart des toilettes. Des équipements pour chauffer la nourriture bébé sont disponibles dans certains espaces/restaurants.
- Nourriture bébé autorisée en cabine avec contrôle possible. Le traitement de la poussette dépend de la compagnie ; attendre les instructions au pont d’embarquement à l’arrivée.
- Le service mineur non accompagné est fourni et facturé par la compagnie, doit être réservé à l’avance et n’est pas proposé par toutes les compagnies. Le parent ne peut pas accompagner l’enfant jusqu’à la porte ; le personnel de la compagnie prend le relais.
- Sources : `[S34]`, `[S35]`.

## 22. Lost & Found, bagage manquant ou endommagé

- Statut : `[semi_dynamic]`.
- Intentions — FR : `objet perdu`, `valise absente`, `bagage endommagé`, `mauvaise valise`, `objet dans l’avion` | NL : `verloren voorwerp`, `bagage ontbreekt`, `beschadigde bagage`, `verkeerde koffer`, `iets in vliegtuig` | EN : `lost item`, `missing bag`, `damaged luggage`, `wrong suitcase`, `left on plane`.
- Objet perdu dans le terminal ou autour : formulaire Lost & Found de Brussels Airport.
- Objet laissé dans l’avion, bagage absent ou endommagé : compagnie et handler. Avant de quitter le hall bagages, aller au desk du handler près des tapis 7 et 8.
- Mauvaise valise : retourner immédiatement au handler. Pour récupérer un bagage dans la zone sécurisée, suivre les documents demandés par le handler ; après 14 heures, une référence de déclaration peut être requise.
- Un dossier Lost & Found de l’aéroport reçoit normalement des mises à jour après 7 et 14 jours et se clôt après 30 jours si l’objet n’est pas trouvé ; revalider ce calendrier.
- Sources : `[S37]`, `[S38]`.

## 23. Information humaine et contact

- Statut : `[semi_dynamic]`.
- Intentions — FR : `parler à quelqu’un`, `information`, `contact`, `réclamation` | NL : `iemand spreken`, `informatie`, `contact`, `klacht` | EN : `speak to someone`, `information desk`, `contact`, `complaint`.
- Desk d’information passagers actuel : hall des départs, face à la rangée de check-in 3, de 6 h à 21 h. Une ancienne page kiosk mentionne la rangée 5 ; ne pas l’utiliser.
- Airport Crew présente 24/7 dans le terminal, reconnaissable aux T-shirts verts « May I help you? ».
- Customer Care : **+32 2 620 91 40** ou formulaire officiel. La ligne ne remplace ni la compagnie ni les urgences.
- Sources : `[S39]`, `[S41]`.

## 24. Services pratiques

- Statut : `[semi_dynamic]`, horaires et disponibilité `[live]`.
- Intentions — FR : `wifi`, `casier`, `chariot`, `ATM`, `change`, `TVA`, `recharge téléphone`, `poste`, `photo` | NL : `wifi`, `bagagekluis`, `bagagekar`, `geldautomaat`, `wisselkantoor`, `btw`, `telefoon opladen` | EN : `wifi`, `locker`, `trolley`, `ATM`, `currency exchange`, `VAT refund`, `phone charging`.
- Wi-Fi gratuit dans le terminal ; sélectionner le réseau de l’aéroport et accepter les conditions. Les lounges peuvent avoir un réseau distinct.
- Casiers à bagages accessibles 24/7 selon la page actuelle, notamment niveau 0 hors terminal et à la gare des bus ; tailles, prix et capacité sont à vérifier en direct.
- L’offre inclut chariots, emballage certifié, distributeurs, change, remboursement TVA, powerbanks, courrier, cabines photo, salles de réunion et hôtel selon zone et horaires.
- Réponse courte : donner d’abord la localisation générale, puis vérifier l’horaire ou la disponibilité demandée.
- Sources : `[S42]`, `[S43]`, `[S44]`.

## 25. Confort, restauration et commerces

- Statut : `[live]` pour enseigne, ouverture et offre ; `[semi_dynamic]` pour la catégorie de service.
- Intentions — FR : `restaurant`, `boutique`, `pharmacie`, `lounge`, `Fast Lane`, `douche`, `prière`, `fumer`, `eau`, `hôtel` | NL : `restaurant`, `winkel`, `apotheek`, `lounge`, `Fast Lane`, `douche`, `gebedsruimte`, `roken`, `water`, `hotel` | EN : `restaurant`, `shop`, `pharmacy`, `lounge`, `Fast Lane`, `shower`, `prayer room`, `smoking`, `water`, `hotel`.
- Restaurants et commerces varient selon la zone avant/après sécurité et selon A/B/T. Demander la zone du passager avant de proposer une enseigne.
- Lounges Brussels Airport : Diamond Lounge près de A42 et The View entre B04 et B05 selon la page actuelle. Horaires, accès et prix doivent être vérifiés ; les douches sont proposées à The View aux voyageurs éligibles.
- Fast Lane requiert une carte d’embarquement valide et un pass ou droit d’accès. Ce n’est pas un droit PRM ; l’assistance utilise son propre parcours.
- Espaces de prière après sécurité aux zones A et B, actuellement annoncés 24/7. Espaces fumeurs uniquement dans les zones désignées ; interdiction ailleurs, y compris pour l’e-cigarette.
- Eau potable gratuite après sécurité à certains points ; pharmacie dans le hall des départs avec horaires variables.
- Sources : `[S43]`, `[S46]`, `[S48]`, `[S49]`, `[S50]`, `[S51]`, `[S52]`.

## 26. Compagnies, destinations et réservation

- Statut : `[live]` pour liste et desserte ; `[stable]` pour la règle de responsabilité.
- Intentions — FR : `compagnie`, `destination directe`, `réserver`, `billet`, `bagage autorisé` | NL : `luchtvaartmaatschappij`, `rechtstreekse bestemming`, `boeken`, `ticket`, `bagagetoelage` | EN : `airline`, `direct destination`, `book`, `ticket`, `baggage allowance`.
- Le répertoire officiel liste compagnies et handlers, mais sa composition évolue. Une destination affichée n’implique pas une desserte quotidienne ou annuelle.
- Billet, tarif, siège, check-in, franchise, modification et remboursement sont gérés par la compagnie ou l’agence.
- Sources : `[S53]`, `[S54]`.

## 27. Règlement de l’aéroport

- Statut : `[semi_dynamic]`.
- Intentions — FR : `peut-on dormir`, `fumer`, `filmer`, `trottinette`, `alcool`, `règlement` | NL : `slapen`, `roken`, `filmen`, `step`, `alcohol`, `huisregels` | EN : `sleep`, `smoke`, `film`, `scooter`, `alcohol`, `house rules`.
- Garder les bagages sous surveillance et ne pas bloquer les voies ou sorties.
- Tabac et vape interdits hors espaces désignés. Les engins tels que vélos, trottinettes et skateboards ne sont pas autorisés à l’intérieur, hors aides de mobilité.
- Photos personnelles permises sauf interdiction signalée ; prise de vues professionnelle soumise à autorisation écrite.
- L’aéroport ne peut pas servir de lieu de résidence ou de couchage récurrent ; l’accès peut être limité pour raisons opérationnelles.
- Source : `[S45]`.

## 28. Comportement en cas de donnée absente

- Ne pas combler un vide par une estimation.
- Proposer le prochain canal pertinent : compagnie, handler, agent sur place, app, BRUce, SNCB/NMBS, STIB/MIVB, De Lijn, autorité gouvernementale ou urgence.
- Si deux sources officielles se contredisent, signaler brièvement l’incertitude et utiliser la source passagers la plus récente ou une vérification live.
- Ne pas réciter une longue URL à l’oral. Nommer le service et proposer d’envoyer le lien uniquement si le canal le permet.

## 29. Limites de collecte et de réutilisation

- Les endpoints `robots.txt` et `sitemap.xml` ont renvoyé un blocage Akamai 403 lors de la vérification du 2026-11-19. Cela ne prouve ni une autorisation ni une interdiction de crawl.
- Les conditions officielles réservent les textes, images, données, noms et logos. Cette base paraphrase des faits et conserve les liens ; elle ne doit pas recevoir de copies longues, d’images ou de logos sans autorisation.
- Le portail développeur officiel est restreint. Ne pas contourner ses contrôles ni utiliser une API privée découverte dans le frontend.
- Avant un lancement public, obtenir l’autorisation de Brussels Airport pour l’usage de marque, la réutilisation de contenu et l’accès aux données live.
- Sources : `[S44]`, `[S55]`, `[S56]`.
