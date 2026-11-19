# Validation conversationnelle du 19 novembre 2026

Statut : **PASS end-to-end**

Agent testé : `agent_4601m7scsffqexhv6g064mbgvtjj`

Conversation de référence : `conv_7901m7sjgffaf308krdprzxdc9h1`

## Parcours validé

- accueil en français ;
- réponse sur les liquides ;
- refus d'inventer une porte ou un retard en temps réel ;
- bascule en néerlandais avec la voix néerlandaise configurée ;
- bascule en anglais avec la voix anglaise configurée ;
- urgence médicale avec le `02 753 63 63` et le repli vers le `112` ;
- au revoir et fermeture par l'outil `end_call`.

Le test a conservé un flux audio continu pendant 114,38 secondes. Le serveur a
terminé la conversation avec le statut `done`, sans avertissement et sans tour
interrompu.

## Contrôles restant humains

- confirmer le naturel vocal final par une écoute métier ;
- faire relire la prononciation néerlandaise par une personne belge
  néerlandophone avant une présentation officielle ;
- revalider les sources semi-dynamiques avant chaque démonstration client.

Les fichiers audio et le transcript complet sont conservés uniquement dans le
dossier local exclu de Git `remote-validation/live/`.
