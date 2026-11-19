# Supabase — registre opérationnel Zaventem

Le schéma `zaventem_voicebot` est prévu pour le projet partagé
`voicebots-commun`. Il conserve uniquement la provenance, la fraîcheur et les
observations de maintenance. La base conversationnelle complète reste dans
ElevenLabs.

## Sécurité

- schéma non exposé au navigateur ;
- aucun droit pour `anon` ou `authenticated` ;
- accès serveur `service_role` uniquement ;
- RLS activée comme défense supplémentaire ;
- aucun HTML ou média Brussels Airport stocké ;
- aucune donnée personnelle passager.

## Validation locale

```bash
supabase start
supabase db reset --local
supabase test db
```

La migration est générée avec Supabase CLI et doit être appliquée au projet
cible seulement après revue. Le fichier `n8n/README.md` décrit le contrôle de
fraîcheur volontairement inactif.
