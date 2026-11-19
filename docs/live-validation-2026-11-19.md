# Validation live du voicebot, 19 novembre 2026

## Verdict

La version `agtvrsn_7501m7st51yhfmzs0j84ccshm64m` satisfait le seuil de 850 ms sur six tours audio réels du parcours public à langue présélectionnée.

- Métrique officielle : `convai_ttf_audio_since_silence`
- Échantillon : 6 tours, 2 en français, 2 en néerlandais, 2 en anglais
- Minimum : 536 ms
- P50 : 592 ms
- P95 : 724 ms
- Maximum : 725 ms
- Dépassements : 0
- Transcriptions incomplètes : 0

Cette métrique ElevenLabs mesure le délai entre la fin de parole détectée et le premier audio de l’agent. Le seuil est donc de 0,85 seconde, soit 850 ms.

## Configuration distante vérifiée

- Agent : `agent_4601m7scsffqexhv6g064mbgvtjj`
- Modèle conversationnel : `eleven_realtime_v1_mini`
- Modèle vocal : `eleven_v4_turbo`
- Détection de tour : `turn_v3`, `eager`, tour spéculatif activé
- Transport du site public : WebRTC

Voix réellement utilisées et facturées par ElevenLabs :

| Langue | Voix | ID | Métadonnées ElevenLabs |
| --- | --- | --- | --- |
| Français | Léo | `AfbuxQ9DVtS4azaxN1W7` | homme, âge moyen |
| Néerlandais | Jeroen Vlaams | `Yv0oyZ3obP9foTH7emqG` | homme, âge moyen, accent flamand |
| Anglais | Mark | `jgzHfSd2o0L7p0de3yr0` | homme, âge moyen, accent britannique |

## Conversations de preuve

| Langue | Conversation ElevenLabs | Tours mesurés | Valeurs officielles | Maximum |
| --- | --- | ---: | --- | ---: |
| FR | `conv_6501m7stfjytezta9d52rectc12a` | 2 | 584 ms, 599 ms | 599 ms |
| NL | `conv_0701m7st5dm1frgb4de3wepttnh9` | 2 | 725 ms, 550 ms | 725 ms |
| EN | `conv_9601m7stdx5yfwnr7z40qy720ejp` | 2 | 721 ms, 536 ms | 721 ms |

Les trois sessions ont `source_medium: audio`. La facturation distante confirme 154 appels ASR et 25,928 secondes d’audio utilisateur. Elle confirme aussi Realtime Mini, Eleven v4 Turbo et l’ID de voix propre à chaque langue.

## Diagnostic de transport

Le banc de test WebSocket a aussi enregistré un indicateur client approximatif, du dernier chunk vocal envoyé au premier paquet audio reçu : P50 774 ms, maximum 919 ms. Cet indicateur n’est pas le début de lecture au haut-parleur et ne sert pas au verdict officiel. La landing page utilise désormais WebRTC, recommandé par ElevenLabs pour les conversations vocales et plus adapté à une faible latence.

## Portée et limite

Le verdict couvre le parcours public normal où la langue est choisie dans la modal avant de démarrer. Il ne constitue pas une garantie absolue pour chaque réseau, appareil ou cadence de parole. Un changement de langue au milieu d’une phrase ajoute un appel d’outil et doit rester suivi séparément.

La métadonnée homme d’âge moyen, la cohérence des réponses et la production audio réelle sont vérifiées. Le jugement final sur la chaleur, l’énergie contenue et le naturel de la prosodie reste une audition humaine, idéalement avec une personne néerlandophone belge pour la voix flamande.

Références :

- https://elevenlabs.io/docs/eleven-api/concepts/latency-methodology
- https://elevenlabs.io/docs/eleven-agents/libraries/react
