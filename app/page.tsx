"use client";

import { useEffect, useState } from "react";
import { IconSprite } from "@/components/icon-sprite";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader, type SiteLanguage } from "@/components/site-header";
import { VoicebotTrigger } from "@/components/voicebot-modal";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const brandAsset = (name: string) => `${basePath}/brand/${name}`;
const publicAsset = (name: string) => `${basePath}/assets/${name}`;

const needVisuals = [
  { icon: { col: 1, row: 2 }, size: "bento-wide bento-red" },
  { icon: { col: 5, row: 3 }, size: "bento-tall" },
  { icon: { col: 2, row: 4 }, size: "bento-dark" },
  { icon: { col: 6, row: 3 }, size: "" },
  { icon: { col: 5, row: 5 }, size: "bento-wide" },
  { icon: { col: 3, row: 5 }, size: "bento-soft" },
] as const;

const demoQualityIcons = [
  { col: 2, row: 1 },
  { col: 1, row: 5 },
  { col: 5, row: 1 },
  { col: 3, row: 1 },
] as const;

const copy = {
  en: {
    skip: "Skip to content",
    nav: { presentation: "Presentation", architecture: "Architecture", bananaNavy: "Banana Navy", navigation: "Main navigation", home: "Zaventem Voice, home", openMenu: "Open menu", closeMenu: "Close menu", language: "Page language" },
    hero: {
      title: ["Your airport", "A voice to guide", "your journey"],
      subtitle: "Ask about your flight, baggage or airport services. Simply speak. We’ll help you find your way.",
      test: "Try the voicebot",
      how: "Discover how it works",
      greeting: "Hello, welkom, bonjour.",
      ready: "Ready when you are",
      deviceNote: "Uses your microphone and speakers",
      greetingAria: "The voicebot welcomes you in English, Dutch and French",
      featuresAria: "Key features",
      features: [
        ["Three languages", "English · Nederlands · Français"],
        ["Clear answers", "Useful information for your journey"],
        ["Here to listen", "Ask naturally, at your own pace"],
      ],
    },
    questions: {
      heading: ["THE QUESTIONS", "THAT MATTER"],
      intro: "The voicebot covers the recurring moments of a journey while clearly separating stable guidance from information that can change by the minute.",
      needs: [
        ["Flights and wayfinding", "Find out where to check a departure, arrival, check-in desk or gate, without presenting time-sensitive information as certain.", "Official channels remain the source of truth at that moment", "Airplane"],
        ["Baggage", "Prepare cabin and checked baggage, clarify rules on liquids and batteries, and find the right help for delayed, damaged or lost baggage.", "Before, during and after the flight", "Baggage"],
        ["Getting to the airport", "Compare train, bus, taxi, car, drop-off and pick-up options based on what the traveller actually needs.", "One answer, the right starting point", "Map and location"],
        ["Departure and checks", "Explain check-in, security and border control, and make clear when the airline is the authoritative source.", "Clear and careful guidance", "Security shield"],
        ["Passenger assistance", "Guide passengers with reduced mobility, families and travellers who need human assistance at the airport.", "Accessible by design", "Reduced mobility assistance"],
        ["Services and wayfinding", "Find the right service, space or contact person without overwhelming someone with an endless list.", "Short, practical and actionable", "Information and wayfinding"],
      ],
    },
    demo: {
      heading: ["ASK A REAL", "QUESTION"],
      lead: "Ask how to reach the airport by train, where to report lost baggage or how to prepare your liquids. Speak naturally in English, Dutch or French.",
      test: "Try the voicebot",
      limit: "Independent prototype · no real-time operational data",
      assistant: "VOICE ASSISTANT",
      example: "Example conversation",
      question: "Can I pack my power bank in my suitcase?",
      answer: "Keep it with you in your cabin baggage, not in checked baggage. Your airline may also set capacity limits.",
      input: "Type or speak…",
      inputAria: "Open the voicebot and ask a question",
      qualitiesAria: "Voice qualities",
      qualities: [
        ["Controlled warmth", "A smile you can hear, never theatrical."],
        ["Natural pace", "Purposeful pauses, without a robotic cadence."],
        ["Measured energy", "Present and alert, without sounding sporty or promotional."],
        ["Answers with room to breathe", "One idea at a time, followed by one simple question."],
      ],
    },
    control: {
      heading: ["FIVE LAYERS,", "ONE CONTROL MODEL"],
      intro: [
        "Every system is tailored to the company’s processes, tools and risk level. Scope, guardrails, performance targets and support are defined before deployment, then documented, tested and monitored.",
        "Security, human oversight and operational resilience are built in from the outset, with controls aligned with applicable GDPR, AI Act and DORA requirements.",
      ],
      visual: ["VOICEBOT", "CONTROLLED ARCHITECTURE"],
      test: "Try the voicebot",
      layers: [
        ["Voice layer", "Natural conversations by phone, in the browser or at a kiosk. The voice layer supports low latency, interruptions and language changes within the same conversation."],
        ["Orchestrator", "The primary agent maintains context, identifies intent and passes the full context to the right destination. Defined workflows keep every answer within scope."],
        ["Specialist agents", "Dedicated agents handle routing, appointment booking or a specific business process. They rely on verified sources and results from approved tools."],
        ["Tools and guardrails", "AI checks, approved tools and deterministic rules outside the model govern answers and actions. Uncertain information triggers clarification or escalation."],
        ["Human oversight", "The team can take over with full context. Monitoring, continuous evaluation and validation of sensitive actions keep the system under control over time."],
      ],
    },
    strike: {
      lead: "Banana Navy’s Voice Bot project was selected for Belgian Defence’s STRIKE IT 2026 programme and is supported by the Cyber Defence Factory / Cyber Command. It is progressing from prototype to operational capability.",
      body: "The STRIKE IT framework is described as designed, hosted and operated in the European Union to support European requirements for data residency and governance.",
      guard: "Context note: this selection and support apply only to Banana Navy’s Voice Bot project. They are separate from this independent Brussels Airport concept and do not imply any affiliation with or endorsement by the airport.",
      card: "BANANA NAVY PROJECT ONLY",
      aria: "STRIKE IT programme context for the Banana Navy project",
    },
    final: {
      heading: ["ONE QUESTION", "ONE VOICE", "THE RIGHT DIRECTION"],
      text: "A conversation is still the best test. Ask a simple question, listen to the answer, then challenge the prototype.",
      button: "Talk to the prototype",
    },
  },
  nl: {
    skip: "Ga naar de inhoud",
    nav: { presentation: "Presentatie", architecture: "Architectuur", bananaNavy: "Banana Navy", navigation: "Hoofdnavigatie", home: "Zaventem Voice, startpagina", openMenu: "Menu openen", closeMenu: "Menu sluiten", language: "Taal van de pagina" },
    hero: {
      title: ["Uw luchthaven", "Een stem als gids", "op uw reis"],
      subtitle: "Vraag naar uw vlucht, bagage of de diensten op de luchthaven. Spreek gewoon. Wij helpen u de juiste weg te vinden.",
      test: "Probeer de voicebot",
      how: "Ontdek hoe het werkt",
      greeting: "Welkom, bonjour, hello.",
      ready: "Klaar wanneer u dat bent",
      deviceNote: "Gebruikt uw microfoon en luidsprekers",
      greetingAria: "De voicebot verwelkomt u in het Nederlands, Frans en Engels",
      featuresAria: "Belangrijkste kenmerken",
      features: [
        ["Drie talen", "Nederlands · Français · English"],
        ["Duidelijke antwoorden", "Nuttige informatie voor uw reis"],
        ["We luisteren naar u", "Vraag natuurlijk, op uw eigen tempo"],
      ],
    },
    questions: {
      heading: ["DE VRAGEN DIE", "ERTOE DOEN"],
      intro: "De voicebot helpt bij de terugkerende momenten van een reis en maakt duidelijk onderscheid tussen vaste richtlijnen en informatie die van minuut tot minuut kan veranderen.",
      needs: [
        ["Vluchten en wegwijs op de luchthaven", "Ontdek waar u een vertrek, aankomst, incheckbalie of gate controleert, zonder tijdsgevoelige informatie als zekerheid voor te stellen.", "De officiële kanalen blijven op dat moment de referentie", "Vliegtuig"],
        ["Bagage", "Bereid handbagage en ruimbagage voor, verduidelijk de regels voor vloeistoffen en batterijen en vind de juiste hulp bij vertraagde, beschadigde of verloren bagage.", "Voor, tijdens en na de vlucht", "Bagage"],
        ["Naar de luchthaven", "Vergelijk trein, bus, taxi, auto, afzetzone en ophaalzone op basis van wat de reiziger echt nodig heeft.", "Eén antwoord, het juiste vertrekpunt", "Kaart en locatie"],
        ["Vertrek en controles", "Leg het inchecken, de veiligheidscontrole en de grenscontrole uit en geef aan wanneer de informatie van de luchtvaartmaatschappij doorslaggevend is.", "Duidelijke en voorzichtige richtlijnen", "Veiligheidsschild"],
        ["Reizigersassistentie", "Begeleid personen met beperkte mobiliteit, gezinnen en reizigers die ter plaatse menselijke hulp nodig hebben.", "Toegankelijk van bij het ontwerp", "Assistentie voor beperkte mobiliteit"],
        ["Diensten en wegwijs", "Vind de juiste dienst, ruimte of contactpersoon zonder iemand te overspoelen met een eindeloze lijst.", "Kort, concreet en bruikbaar", "Informatie en wegwijs"],
      ],
    },
    demo: {
      heading: ["STEL EEN ECHTE", "VRAAG"],
      lead: "Vraag hoe u met de trein naar de luchthaven reist, waar u verloren bagage meldt of hoe u vloeistoffen voorbereidt. Spreek natuurlijk in het Nederlands, Frans of Engels.",
      test: "Probeer de voicebot",
      limit: "Onafhankelijk prototype · geen operationele gegevens in realtime",
      assistant: "SPRAAKASSISTENT",
      example: "Voorbeeldgesprek",
      question: "Kan ik mijn powerbank meenemen in mijn koffer?",
      answer: "Houd die bij u in uw handbagage, niet in de ruimbagage. Uw luchtvaartmaatschappij kan ook capaciteitslimieten opleggen.",
      input: "Typ of spreek…",
      inputAria: "Open de voicebot en stel een vraag",
      qualitiesAria: "Stemkwaliteiten",
      qualities: [
        ["Beheerste warmte", "Een hoorbare glimlach, nooit gespeeld."],
        ["Natuurlijk ritme", "Nuttige stiltes, zonder robotachtig tempo."],
        ["Gedoseerde energie", "Aanwezig en alert, zonder sportieve of reclameachtige toon."],
        ["Antwoorden met ademruimte", "Eén idee tegelijk, gevolgd door een eenvoudige vraag."],
      ],
    },
    control: {
      heading: ["VIJF LAGEN,", "ÉÉN CONTROLEMODEL"],
      intro: [
        "Elk systeem wordt afgestemd op de processen, tools en het risiconiveau van de onderneming. De scope, guardrails, prestatiedoelstellingen en ondersteuning worden vóór de ingebruikname vastgelegd en vervolgens gedocumenteerd, getest en opgevolgd.",
        "Beveiliging, menselijk toezicht en operationele veerkracht zijn van bij het ontwerp ingebouwd, met controles die zijn afgestemd op de toepasselijke vereisten van de GDPR, de AI Act en DORA.",
      ],
      visual: ["VOICEBOT", "ARCHITECTUUR ONDER CONTROLE"],
      test: "Probeer de voicebot",
      layers: [
        ["Spraaklaag", "Natuurlijke gesprekken via telefoon, browser of kiosk. De spraaklaag zorgt voor lage latentie en kan omgaan met onderbrekingen en taalwissels binnen hetzelfde gesprek."],
        ["Orchestrator", "De hoofdagent bewaakt de rode draad, herkent de intentie en geeft de volledige context door aan de juiste schakel. Vooraf bepaalde workflows houden elk antwoord binnen de afgesproken scope."],
        ["Gespecialiseerde agents", "Agents voor specifieke taken verzorgen routing, afspraken of een welbepaald bedrijfsproces. Ze gebruiken geverifieerde bronnen en resultaten van toegestane tools."],
        ["Tools en guardrails", "AI-controles, goedgekeurde tools en deterministische regels buiten het model begrenzen antwoorden en acties. Onzekere informatie leidt tot een verduidelijkende vraag of escalatie."],
        ["Menselijk toezicht", "Het team kan met alle context overnemen. Monitoring, continue evaluatie en validatie van gevoelige acties houden het systeem ook op lange termijn onder controle."],
      ],
    },
    strike: {
      lead: "Het Voice Bot-project van Banana Navy werd geselecteerd voor het STRIKE IT 2026-programma van Belgian Defence en krijgt steun van de Cyber Defence Factory / Cyber Command. Het evolueert van prototype naar operationele capaciteit.",
      body: "Het STRIKE IT-kader wordt omschreven als ontworpen, gehost en beheerd in de Europese Unie om de Europese vereisten voor gegevensresidentie en gegevensgovernance te ondersteunen.",
      guard: "Contextnota: deze selectie en ondersteuning gelden uitsluitend voor het Voice Bot-project van Banana Navy. Ze staan los van dit onafhankelijke concept voor Brussels Airport en vormen geen band met of goedkeuring door de luchthaven.",
      card: "UITSLUITEND EEN BANANA NAVY-PROJECT",
      aria: "Context van het STRIKE IT-programma voor het Banana Navy-project",
    },
    final: {
      heading: ["ÉÉN VRAAG", "ÉÉN STEM", "DE JUISTE RICHTING"],
      text: "Een gesprek blijft de beste test. Stel een eenvoudige vraag, beluister het antwoord en daag het prototype daarna uit.",
      button: "Praat met het prototype",
    },
  },
  fr: {
    skip: "Aller au contenu",
    nav: { presentation: "Présentation", architecture: "Architecture", bananaNavy: "Banana Navy", navigation: "Navigation principale", home: "Zaventem Voice, accueil", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu", language: "Langue de la page" },
    hero: {
      title: ["Votre aéroport", "Une voix qui guide", "votre voyage"],
      subtitle: "Demandez des informations sur votre vol, vos bagages ou les services de l’aéroport. Parlez simplement. Nous vous aidons à trouver votre chemin.",
      test: "Tester le voicebot",
      how: "Découvrir comment ça marche",
      greeting: "Bonjour, welkom, hello.",
      ready: "Prêt quand vous l’êtes",
      deviceNote: "Utilise votre microphone et vos haut-parleurs",
      greetingAria: "Le voicebot accueille en français, néerlandais et anglais",
      featuresAria: "Caractéristiques principales",
      features: [
        ["Trois langues", "Français · Nederlands · English"],
        ["Des réponses claires", "Des informations utiles à votre voyage"],
        ["À votre écoute", "Parlez naturellement, à votre rythme"],
      ],
    },
    questions: {
      heading: ["LES QUESTIONS", "QUI COMPTENT"],
      intro: "Le voicebot couvre les moments récurrents du voyage tout en séparant clairement une règle durable d’une information qui peut changer à la minute.",
      needs: [
        ["Vols et parcours", "Comprendre où vérifier un départ, une arrivée, un comptoir ou une porte, sans présenter une donnée périssable comme une certitude.", "Le canal officiel reste la référence du moment", "Avion"],
        ["Bagages", "Préparer cabine et soute, clarifier liquides et batteries, puis orienter un bagage retardé, endommagé ou perdu.", "Avant, pendant et après le vol", "Bagage"],
        ["Accès à l’aéroport", "Comparer train, bus, taxi, voiture, dépose-minute et prise en charge selon le besoin réel du voyageur.", "Une réponse, le bon point de départ", "Plan et localisation"],
        ["Départ et contrôles", "Expliquer l’enregistrement, la sûreté et le contrôle frontalier, puis rappeler quand la compagnie aérienne fait foi.", "Des consignes cadrées et prudentes", "Bouclier de sûreté"],
        ["Assistance voyageurs", "Guider les personnes à mobilité réduite, les familles et les voyageurs qui ont besoin d’un accueil humain sur place.", "Accessible par conception", "Assistance aux personnes à mobilité réduite"],
        ["Services et orientation", "Retrouver un service, un espace ou le bon interlocuteur sans noyer la personne dans une liste interminable.", "Court, concret, actionnable", "Information et orientation"],
      ],
    },
    demo: {
      heading: ["POSEZ UNE", "VRAIE QUESTION"],
      lead: "Demandez comment venir en train, où signaler un bagage perdu ou comment préparer les liquides. Parlez naturellement, en français, néerlandais ou anglais.",
      test: "Tester le voicebot",
      limit: "Prototype indépendant · aucune donnée opérationnelle en temps réel",
      assistant: "ACCUEIL VOCAL",
      example: "Conversation exemple",
      question: "Je peux prendre ma batterie externe dans ma valise ?",
      answer: "Gardez-la avec vous en cabine, pas en soute. Votre compagnie peut aussi fixer des limites de capacité.",
      input: "Écrivez ou parlez…",
      inputAria: "Ouvrir le voicebot et poser une question",
      qualitiesAria: "Qualités de la voix",
      qualities: [
        ["Chaleur maîtrisée", "Un sourire perceptible, jamais théâtral."],
        ["Rythme naturel", "Des silences utiles, sans cadence robotique."],
        ["Énergie contenue", "Présente et alerte, sans ton sportif ou publicitaire."],
        ["Réponses respirables", "Une idée à la fois, puis une question simple."],
      ],
    },
    control: {
      heading: ["CINQ COUCHES,", "UN SEUL MODÈLE", "DE CONTRÔLE"],
      intro: [
        "Chaque système est adapté aux processus, aux outils et au niveau de risque de l’entreprise. Le périmètre, les garde-fous, les objectifs de performance et le support sont définis avant le déploiement, puis documentés, testés et surveillés.",
        "La sécurité, la supervision humaine et la résilience opérationnelle sont intégrées dès la conception, avec des contrôles adaptés aux exigences applicables du RGPD, de l’AI Act et de DORA.",
      ],
      visual: ["VOICEBOT", "ARCHITECTURE SOUS CONTRÔLE"],
      test: "Tester le voicebot",
      layers: [
        ["Couche vocale", "Des conversations naturelles au téléphone, dans le navigateur ou sur une borne. La couche vocale gère la faible latence, les interruptions et le changement de langue au cours d’un même échange."],
        ["Orchestrateur", "L’agent principal garde le fil, identifie l’intention et transmet le contexte au bon relais. Des workflows définis maintiennent chaque réponse dans son périmètre."],
        ["Agents spécialisés", "Des agents dédiés prennent en charge le routage, la prise de rendez-vous ou un processus métier précis. Ils utilisent des sources vérifiées et les résultats des outils autorisés."],
        ["Outils et garde-fous", "Les contrôles IA, les outils approuvés et les règles déterministes hors modèle encadrent les réponses et les actions. Une information incertaine déclenche une clarification ou une escalade."],
        ["Contrôle humain", "L’équipe peut reprendre la main avec tout le contexte. Le monitoring, l’évaluation continue et la validation des actions sensibles gardent le système sous contrôle dans la durée."],
      ],
    },
    strike: {
      lead: "Le projet Voice Bot de Banana Navy a été sélectionné dans le cadre du programme Belgian Defence STRIKE IT 2026 et bénéficie du soutien de la Cyber Defence Factory / Cyber Command. Il progresse du prototype vers une capacité opérationnelle.",
      body: "Le cadre STRIKE IT est décrit comme conçu, hébergé et opéré dans l’Union européenne afin de soutenir les exigences européennes de résidence et de gouvernance des données.",
      guard: "Garde-fou de contexte : cette sélection et ces soutiens concernent uniquement le projet Voice Bot de Banana Navy. Ils sont distincts de ce concept indépendant pour Brussels Airport et ne constituent ni affiliation, ni approbation de l’aéroport.",
      card: "PROJET BANANA NAVY UNIQUEMENT",
      aria: "Contexte du programme STRIKE IT pour le projet Banana Navy",
    },
    final: {
      heading: ["UNE QUESTION", "UNE VOIX", "LA BONNE DIRECTION"],
      text: "Le meilleur test reste une conversation. Posez une question simple, écoutez la réponse, puis challengez le prototype.",
      button: "Parler au prototype",
    },
  },
} as const;

export default function HomePage() {
  const [language, setLanguage] = useState<SiteLanguage>("en");
  const content = copy[language];

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("zaventem-page-language");
    if (savedLanguage === "en" || savedLanguage === "nl" || savedLanguage === "fr") setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (nextLanguage: SiteLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("zaventem-page-language", nextLanguage);
  };

  return (
    <>
      <LandingMotion />
      <a className="skip-link" href="#contenu">{content.skip}</a>
      <SiteHeader active="home" language={language} onLanguageChange={changeLanguage} homeLabels={content.nav} />

      <main id="contenu">
        <div className="hero-stage">
          <section className="hero-full" aria-labelledby="hero-title">
            <div className="hero-photo" aria-hidden="true"><img src={publicAsset("airplane-wing-river.webp")} alt="" /></div>
            <div className="hero-shade" aria-hidden="true" />

            <div className="hero-content">
              <div className="hero-main-grid">
                <div className="hero-copy">
                  <span className="hero-brandline">ZAVENTEM VOICE</span>
                  <h1 id="hero-title">
                    {content.hero.title.map((line) => <span className="hero-line" key={line}><span>{line}</span></span>)}
                  </h1>
                  <p>{content.hero.subtitle}</p>
                  <a className="hero-how-link" href="#usages">{content.hero.how}<span aria-hidden="true">↓</span></a>
                </div>

                <aside className="hero-voice-panel" aria-label={content.hero.greetingAria}>
                  <p className="hero-panel-status"><i aria-hidden="true" />{content.hero.ready}</p>
                  <span className="hero-panel-orb" aria-hidden="true"><i /></span>
                  <h2 className="hero-panel-greeting">{content.hero.greeting}</h2>
                  <span className="hero-panel-wave" aria-hidden="true">
                    {[14, 27, 19, 37, 48, 58, 45, 26, 37, 17, 29, 14].map((height, index) => <i style={{ height }} key={`${height}-${index}`} />)}
                  </span>
                  <VoicebotTrigger className="button button-primary hero-panel-button" initialLanguage={language}>
                    <IconSprite col={1} row={1} label="" className="hero-button-icon" />
                    {content.hero.test}
                  </VoicebotTrigger>
                  <small>{content.hero.deviceNote}</small>
                </aside>
              </div>

              <div className="hero-meta" aria-label={content.hero.featuresAria}>
                {content.hero.features.map(([title, text], index) => {
                  const icons = [{ col: 8, row: 1 }, { col: 5, row: 6 }, { col: 2, row: 1 }];
                  return <article key={title}><IconSprite {...icons[index]} label="" className="hero-feature-icon" /><div><strong>{title}</strong><span>{text}</span></div></article>;
                })}
              </div>
            </div>
          </section>
        </div>

        <section className="section-pad usages-section" id="usages">
          <div className="shell">
            <div className="section-head reveal">
              <h2 data-scroll-title>{content.questions.heading[0]}<br />{content.questions.heading[1]}</h2>
              <p>{content.questions.intro}</p>
            </div>
            <div className="usage-bento">
              {content.questions.needs.map(([title, text, note, iconLabel], index) => (
                <article data-bento className={`usage-card reveal ${needVisuals[index].size}`} key={title}>
                  <span className="bento-glow" aria-hidden="true" />
                  <div className="usage-card-top" data-bento-layer>
                    <IconSprite {...needVisuals[index].icon} label={iconLabel} />
                  </div>
                  <div className="usage-copy"><h3>{title}</h3><p>{text}</p><small>{note}</small></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad demo-section" id="demo">
          <div className="demo-background" aria-hidden="true"><img src={publicAsset("airport-terminal-blue-gray.webp")} alt="" loading="lazy" decoding="async" /></div>
          <span className="demo-shade" aria-hidden="true" />
          <div className="shell demo-inner">
            <div className="demo-layout">
              <div className="demo-copy reveal">
                <h2 className="demo-title">{content.demo.heading[0]}<br />{content.demo.heading[1]}</h2>
                <p className="demo-lead">{content.demo.lead}</p>
                <VoicebotTrigger className="button button-primary demo-cta" initialLanguage={language}>
                  <IconSprite col={1} row={1} label="" className="demo-cta-icon" />{content.demo.test}
                </VoicebotTrigger>
                <p className="demo-limit">{content.demo.limit}</p>
              </div>
              <div className="demo-conversation reveal">
                <div className="demo-conversation-head">
                  <div className="demo-agent"><span className="demo-agent-orb" aria-hidden="true"><i /></span><span><small>{content.demo.assistant}</small><strong>{content.demo.example}</strong></span></div>
                  <b>{language.toUpperCase()}</b>
                </div>
                <p className="demo-question">{content.demo.question}</p>
                <p className="demo-answer">{content.demo.answer}</p>
                <VoicebotTrigger className="demo-input-trigger" initialLanguage={language} aria-label={content.demo.inputAria}>
                  <span>{content.demo.input}</span><span className="demo-input-mic" aria-hidden="true"><IconSprite col={1} row={1} label="" className="demo-input-icon" /></span>
                </VoicebotTrigger>
              </div>
            </div>
            <div className="demo-quality-grid reveal" aria-label={content.demo.qualitiesAria}>
              {content.demo.qualities.map(([title, text], index) => (
                <article key={title}><IconSprite {...demoQualityIcons[index]} label={title} className="demo-quality-icon" /><div><h3>{title}</h3><p>{text}</p><i aria-hidden="true" /></div></article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad control-section" id="controle">
          <div className="shell">
            <div className="section-head control-heading reveal">
              <h2 data-scroll-title>{content.control.heading.map((line) => <span className="title-line" key={line}>{line}</span>)}</h2>
              <div>{content.control.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <div className="control-grid">
              <div className="control-visual reveal">
                <span className="control-orb" aria-hidden="true"><i /><i /><i /><i /><i /></span>
                <strong>{content.control.visual[0]}</strong>
                <small>{content.control.visual[1]}</small>
                <VoicebotTrigger className="button button-primary control-visual-cta" initialLanguage={language}>
                  <IconSprite col={1} row={1} label="" className="control-cta-icon" />
                  {content.control.test}
                </VoicebotTrigger>
              </div>
              <div className="control-layers">
                {content.control.layers.map(([title, text], index) => (
                  <article data-bento className="control-layer reveal" key={title}><span className="bento-glow" aria-hidden="true" /><span className="control-layer-number">0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad strike-section" id="strike-it">
          <div className="shell">
            <div className="strike-grid">
              <div className="strike-copy reveal">
                <h2 data-scroll-title>STRIKE IT<br />2026</h2>
                <p className="strike-lead">{content.strike.lead}</p>
                <p>{content.strike.body}</p>
                <p className="strike-guard">{content.strike.guard}</p>
              </div>
              <div data-bento className="strike-partners reveal" role="group" aria-label={content.strike.aria}>
                <span className="bento-glow" aria-hidden="true" />
                <p>{content.strike.card}</p>
                <div className="strike-logo-grid" data-bento-layer>
                  <img src={brandAsset("badge-defence.png")} alt="Belgian Defence" width="220" height="142" loading="lazy" />
                  <img src={brandAsset("badge-crest-royal.png")} alt="Belgian institutional crest" width="112" height="200" loading="lazy" />
                  <img src={brandAsset("badge-strike-it.png")} alt="STRIKE IT" width="823" height="531" loading="lazy" />
                  <img src={brandAsset("badge-cyberforce.png")} alt="Cyber Force" width="157" height="200" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="shell final-cta-inner">
            <div className="final-cta-content reveal">
              <h2>{content.final.heading[0]}<br />{content.final.heading[1]}<br /><span>{content.final.heading[2]}</span></h2>
              <div><p>{content.final.text}</p><VoicebotTrigger className="button button-white" initialLanguage={language}>{content.final.button}</VoicebotTrigger></div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter language={language} />
    </>
  );
}
