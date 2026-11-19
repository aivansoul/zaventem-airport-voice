# Brussels Airport Voice | prototype Banana Navy

Prototype indépendant d’un voicebot d’accueil trilingue pour les voyageurs de Brussels Airport (BRU). Il combine une landing page de démonstration et une configuration ElevenLabs reproductible. Ce dépôt n’est pas un service officiel de Brussels Airport et ne doit pas être présenté comme tel.

## Ce que contient la couche voicebot

- `agent/system-prompt.md` : mission, langage oral, limites live, urgence, confidentialité et résistance aux injections.
- `agent/first-messages.json` : accueil court et messages localisés FR/NL/EN.
- `config/voice-design.json` : intention vocale 42–55 ans, candidats et critères d’audition.
- `config/elevenlabs-agent.json` : IDs, voix, modèle, confidentialité et chemins contrôlés.
- `knowledge/base-connaissances.md` : base passagers originale et sourcée.
- `scripts/create-elevenlabs-agent.mjs` : création protégée, dry-run par défaut.
- `scripts/sync-elevenlabs-agent.mjs` : sauvegarde `0600`, mise à jour puis relecture.
- `scripts/verify-elevenlabs-agent.mjs` : comparaison distante en lecture seule.
- `scripts/benchmark-live-audio.mjs` : benchmark PCM réel, ASR et latence officielle par langue.
- `tests/` : garde-fous du prompt, du payload et des confirmations CLI.

## Préparation locale

Prérequis : Node.js 22.13 ou plus récent.

```bash
npm install
npm test
npm run agent:create
```

La dernière commande est un dry-run local. Elle ne lit ni ne modifie ElevenLabs et n’exige aucune clé.

## Création distante | commande explicite

La création effectue, dans cet ordre : validation du payload local contrôlé, création du document texte, création de l’agent, `GET` de contrôle, puis enregistrement local des deux IDs.

```bash
ELEVENLABS_API_KEY='…' npm run agent:create -- --apply --confirm-create=ZAVENTEM
```

Ne placez jamais la clé dans un fichier suivi par Git. Le script ne l’affiche pas. S’il existe déjà des IDs distants dans la configuration, la création est bloquée pour éviter un doublon.

## Synchronisation distante

Dry-run local :

```bash
npm run agent:sync
```

Écriture distante explicite :

```bash
ELEVENLABS_API_KEY='…' npm run agent:sync -- --apply --confirm-sync=ZAVENTEM
```

Avant la première écriture, le script relit l’agent et la KB et crée une sauvegarde dans `remote-validation/elevenlabs-backups/`, chemin exclu de Git. Le dossier reçoit les droits `0700` et chaque sauvegarde les droits `0600`. Ensuite il met à jour la KB, met à jour l’agent, relit les deux et compare prompt, contenu, langues, voix, outils et réglages.

## Vérification distante en lecture seule

```bash
ELEVENLABS_API_KEY='…' npm run agent:verify
```

Cette commande ne fait que deux `GET`. Elle échoue au moindre écart sur le prompt, le contenu de la KB, l’identifiant du document, les langues, les voix, le modèle ou les outils actifs.

Les IDs peuvent être remplacés temporairement sans modifier le fichier :

```bash
ELEVENLABS_API_KEY='…' \
ELEVENLABS_AGENT_ID='agent_…' \
ELEVENLABS_KNOWLEDGE_DOCUMENT_ID='…' \
npm run agent:verify
```

## Garanties du payload

- Le payload envoie `tool_ids: []` et n’envoie jamais `tools` en parallèle.
- Les seuls outils système actifs sont `language_detection` et `end_call`.
- Les voix sont distinctes en FR, NL et EN.
- Le moteur conversationnel est `eleven_realtime_v1_mini` et le modèle vocal est `eleven_v4_turbo`, avec stabilité `0.45`, similarité `0.75`, vitesse `1.00` et style `0`.
- Le parcours vocal du site utilise WebRTC.
- Les informations opérationnelles live ne proviennent jamais de la KB mise en cache.
- L’agent ne peut pas être déclaré prêt sur un simple succès de synchronisation : il faut encore valider le transcript et écouter l’audio réel.

## Validation avant présentation

1. `npm test`.
2. `npm run agent:verify` après toute synchronisation.
3. `npm run agent:benchmark-audio -- --language=fr`, puis `nl` et `en`, avec la clé chargée hors du dépôt.
4. Audition selon `docs/voice-audition.md`.
5. Appels réels FR, NL et EN couvrant bascule de langue, question live, urgence, objet perdu et fin d’appel.
6. Inspection du transcript distant et écoute de l’audio de chaque scénario.

Une validation de configuration prouve uniquement que le serveur contient le payload attendu. Elle ne prouve ni la qualité de la voix, ni le comportement réel du modèle en conversation.

Le parcours automatisé de référence du 19 novembre 2026 est documenté dans
[`docs/live-validation-2026-11-19.md`](docs/live-validation-2026-11-19.md).
