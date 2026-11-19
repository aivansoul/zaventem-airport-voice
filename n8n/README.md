# Maintenance n8n — registre Zaventem

Ce dossier contient un modèle **inactif** de contrôle de fraîcheur. Il ne publie
jamais automatiquement un changement dans ElevenLabs : une modification de
source crée une revue humaine.

## Pourquoi il reste inactif

Les conditions du site Brussels Airport demandent une autorisation avant de
reproduire ou diffuser ses contenus, et les endpoints `robots.txt` / sitemap ont
répondu `403` depuis l'environnement de collecte. Le workflow ne doit donc être
activé qu'après validation contractuelle du mode de consultation.

## Pré-requis n8n

1. Importer `zaventem-source-freshness.template.json`.
2. Créer un credential PostgreSQL nommé `Supabase Zaventem Registry`, connecté
   au projet `voicebots-commun` avec un rôle serveur dédié. Ne jamais utiliser
   une clé `service_role` dans la landing page.
3. Définir `ZAVENTEM_REFRESH_AUTHORIZED=true` uniquement après autorisation.
4. Tester avec le déclencheur manuel et une seule source.
5. Vérifier les lignes `needs_review` avant de synchroniser la KB ElevenLabs.

Le workflow enregistre seulement URL, statut HTTP, horodatage, empreinte et
résumé de revue. Il ne stocke pas le HTML ou les images du site.

## Séquence cible

`Manual Trigger → Safety gate → ouvrir un run → lire les sources dues → vérifier
une URL → enregistrer l'observation → demander une revue humaine`

Le scheduling reste volontairement hors du modèle : il sera ajouté après le
premier run manuel validé.
