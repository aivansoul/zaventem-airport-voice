# Audition vocale — Brussels Airport Voice

## But

Valider des voix masculines réellement humaines avant de déclarer l’agent prêt : homme de 42 à 55 ans, bienveillant, chaleureux et énergique sans tonalité sportive, publicitaire ou théâtrale. Les métadonnées ElevenLabs ne suffisent pas ; la décision finale se prend sur de l’audio généré puis sur une conversation réelle.

## Candidats retenus

| Langue | Voix | Voice ID | Pourquoi elle entre en audition |
|---|---|---|---|
| Français | Léo — French Pro Voice Artist | `AfbuxQ9DVtS4azaxN1W7` | Homme d’âge moyen, timbre léger, chaleureux et engageant. |
| Néerlandais | Jeroen Vlaams | `Yv0oyZ3obP9foTH7emqG` | Homme d’âge moyen, flamand belge natif, chaleureux, clair et rassurant. |
| Anglais | Mark — Expressive General British English | `jgzHfSd2o0L7p0de3yr0` | Homme d’âge moyen, chaleureux, amical et expressif sans voix d’annonce. |

Mode de production : `eleven_realtime_v1_mini`. La configuration Custom de repli utilise `eleven_v4_turbo`, stabilité `0.45`, similarité `0.75` et style `0`. Le contrôle de vitesse n’est pas appliqué par Eleven v4 Turbo. L’énergie doit venir du rythme, du choix des mots et de la voix, pas d’une pose publicitaire.

SLA de réactivité : `convai_ttf_audio_since_silence` inférieur ou égal à `850 ms` pour chaque tour parlé après la fin de parole de l’utilisateur. La mesure doit provenir des métriques de la conversation live, pas d’un chronomètre autour d’une requête texte.

## Textes d’audition

### FR

> Bonjour, welkom, hello — bienvenue à Brussels Airport. Comment puis-je vous aider ? Votre porte peut changer jusqu’au dernier moment ; vérifiez les écrans de l’aéroport et l’application avant de vous déplacer.

### NL

> Welkom op Brussels Airport. Waarmee kan ik u helpen? Uw gate kan tot het laatste moment wijzigen; controleer daarom de schermen en de luchthavenapp.

### EN

> Welcome to Brussels Airport. How can I help you? Your gate can change until the last moment, so please check the airport screens and app before moving on.

Faire aussi lire, dans chaque langue, une consigne courte avec un numéro de téléphone et une réponse d’incertitude live. Cela révèle les accélérations, les chiffres avalés et les intonations artificielles qu’un simple accueil ne montre pas.

## Protocole d’acceptation

1. Générer au moins deux prises par langue avec les réglages exacts de production.
2. Écouter au casque et sur haut-parleur de téléphone, sans regarder le nom de la voix.
3. Noter de 1 à 5 : humanité, âge perçu, chaleur, énergie maîtrisée, diction, pauses, absence de mélodie répétitive.
4. Rejeter toute prise avec voix de coach, publicité, sourire forcé, montée systématique en fin de phrase, tags prononcés ou cadence robotique.
5. Tester ensuite une vraie conversation : accueil, interruption, question live sans outil, bascule de langue, urgence, puis fin d’appel.
6. Inspecter le transcript et écouter l’audio distant. Un test synthétique vert ne suffit pas.

## Grille de décision

| Critère | FR | NL | EN | Seuil |
|---|---:|---:|---:|---:|
| Homme, âge perçu 42–55 |  |  |  | 4/5 |
| Humanité / spontanéité |  |  |  | 4/5 |
| Chaleur sans surjeu |  |  |  | 4/5 |
| Énergie contenue |  |  |  | 4/5 |
| Diction des noms et chiffres |  |  |  | 4/5 |
| Absence de prosodie robotique |  |  |  | 5/5 |

Un candidat est accepté seulement si tous les seuils sont atteints et si aucun défaut bloquant n’apparaît dans l’appel réel. Documenter la date, le modèle, les réglages, l’identifiant de conversation et le verdict ; ne conserver aucune clé API dans ce document.

## Scénarios audio minimaux

- « Mon vol SN 2607 est-il à l’heure et quelle est la porte ? » — doit refuser d’inventer le live.
- « Nederlands » puis une question bagage — bascule silencieuse avant tout texte néerlandais.
- « I left my bag on the plane » — distingue objet à bord et objet perdu dans le terminal.
- « Une personne s’est effondrée près des arrivées » — réponse immédiate, calme et intelligible.
- « Merci, au revoir » — un seul au revoir via `end_call`.

Le rendu néerlandais mérite une écoute par un locuteur belge avant publication : le candidat est néerlandais standard et son adéquation locale doit être validée, pas supposée.
