import Link from "next/link";
import { IconSprite } from "@/components/icon-sprite";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VoicebotTrigger } from "@/components/voicebot-modal";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const brandAsset = (name: string) => `${basePath}/brand/${name}`;
const publicAsset = (name: string) => `${basePath}/assets/${name}`;

const travellerNeeds = [
  {
    number: "01",
    title: "Vols et parcours",
    text: "Comprendre où vérifier un départ, une arrivée, un comptoir ou une porte, sans présenter une donnée périssable comme une certitude.",
    note: "Le canal officiel reste la référence du moment",
    icon: { col: 1, row: 2, label: "Avion" },
    size: "bento-wide bento-red",
  },
  {
    number: "02",
    title: "Bagages",
    text: "Préparer cabine et soute, clarifier liquides et batteries, puis orienter un bagage retardé, endommagé ou perdu.",
    note: "Avant, pendant et après le vol",
    icon: { col: 5, row: 3, label: "Bagage perdu" },
    size: "bento-tall",
  },
  {
    number: "03",
    title: "Accès à l’aéroport",
    text: "Comparer train, bus, taxi, voiture, dépose-minute et prise en charge selon le besoin réel du voyageur.",
    note: "Une réponse, le bon point de départ",
    icon: { col: 2, row: 4, label: "Plan et localisation" },
    size: "bento-dark",
  },
  {
    number: "04",
    title: "Départ et contrôles",
    text: "Expliquer l’enregistrement, la sûreté et le contrôle frontalier, puis rappeler quand la compagnie aérienne fait foi.",
    note: "Des consignes cadrées et prudentes",
    icon: { col: 6, row: 3, label: "Bouclier de sûreté" },
    size: "",
  },
  {
    number: "05",
    title: "Assistance voyageurs",
    text: "Guider les personnes à mobilité réduite, les familles et les voyageurs qui ont besoin d’un accueil humain sur place.",
    note: "Accessible par conception",
    icon: { col: 5, row: 5, label: "Assistance aux personnes à mobilité réduite" },
    size: "bento-wide",
  },
  {
    number: "06",
    title: "Services et orientation",
    text: "Retrouver un service, un espace ou le bon interlocuteur sans noyer la personne dans une liste interminable.",
    note: "Court, concret, actionnable",
    icon: { col: 3, row: 5, label: "Information et orientation" },
    size: "bento-soft",
  },
];

const voiceQualities = [
  ["01", "Chaleur maîtrisée", "Un sourire perceptible, jamais théâtral."],
  ["02", "Rythme naturel", "Des silences utiles, sans cadence robotique."],
  ["03", "Énergie contenue", "Présente et alerte, sans ton sportif ou publicitaire."],
  ["04", "Réponses respirables", "Une idée à la fois, puis une question simple."],
];

const demoQualityIcons = [
  { col: 2, row: 1, label: "Écoute chaleureuse" },
  { col: 1, row: 5, label: "Rythme naturel" },
  { col: 5, row: 1, label: "Énergie contenue" },
  { col: 3, row: 1, label: "Réponse claire" },
];

const journey = [
  ["01", "Écouter", "Le voyageur parle librement. Le bot reconnaît la langue et l’intention sans imposer un menu vocal."],
  ["02", "Vérifier", "La réponse est ancrée dans une base structurée issue des pages officielles identifiées."],
  ["03", "Orienter", "Si la donnée bouge ou exige une décision humaine, le bot le dit et indique le canal compétent."],
];

const faqs = [
  {
    question: "Est-ce un service officiel de Brussels Airport ?",
    answer:
      "Non. Il s’agit d’un prototype indépendant conçu par Banana Navy pour illustrer une expérience d’accueil vocal possible. Il n’existe à ce stade ni affiliation, ni partenariat, ni validation par Brussels Airport Company.",
  },
  {
    question: "Le voicebot connaît-il les vols en temps réel ?",
    answer:
      "Non. Cette démonstration ne revendique aucune connexion aux systèmes opérationnels de l’aéroport. Pour un statut, une porte, un comptoir ou un tapis, elle renvoie vers les écrans, le site officiel ou la compagnie aérienne.",
  },
  {
    question: "Quelles langues sont prévues ?",
    answer:
      "Le parcours est conçu pour le français, le néerlandais et l’anglais. Le voicebot adapte la langue de la conversation et conserve des réponses brèves dans chacune d’elles.",
  },
  {
    question: "Pourquoi une voix adulte ?",
    answer:
      "À l’aéroport, la clarté et la confiance priment. La direction vocale vise une présence adulte, chaleureuse et éveillée, avec une énergie contenue, jamais une voix de spot radio.",
  },
  {
    question: "Que se passe-t-il si une information change ?",
    answer:
      "Les informations stables et les données volatiles sont séparées. Si une réponse dépend de l’heure, d’un vol, d’un tarif ou d’une consigne récente, le bot le dit et indique la source officielle à consulter.",
  },
  {
    question: "Puis-je partager des données personnelles pendant l’essai ?",
    answer:
      "Mieux vaut ne partager aucune donnée sensible. Une question générique sur les liquides, le train, l’assistance ou un bagage égaré suffit pour tester la démonstration.",
  },
];

function SectionRail({ current }: { current: string }) {
  return (
    <div className="section-rail" aria-hidden="true">
      <span>{current} / 09</span>
      <i />
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <LandingMotion />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <SiteHeader active="home" />

      <main id="contenu">
        <div className="hero-stage">
          <span className="hero-ornament hero-ornament-bottom" aria-hidden="true" />
          <span className="hero-stage-dots" aria-hidden="true" />

          <section className="hero-full" aria-labelledby="hero-title">
            <div className="hero-photo" aria-hidden="true">
              <img src={publicAsset("airplane-wing-river.webp")} alt="" />
            </div>
            <div className="hero-shade" aria-hidden="true" />
            <div className="hero-grid-lines" aria-hidden="true" />

            <div className="hero-content">
              <div className="hero-copy">
                <h1 id="hero-title">
                  <span className="hero-line"><span>L’aéroport vous répond.</span></span>
                  <span className="hero-line"><span>À voix haute.</span></span>
                </h1>
                <p>Un accueil vocal trilingue pour vous guider, simplement.</p>
                <div className="hero-actions">
                  <VoicebotTrigger className="button button-primary" initialLanguage="fr">
                    <IconSprite col={1} row={1} label="Microphone" className="hero-button-icon" />
                    Tester le voicebot
                  </VoicebotTrigger>
                  <a className="button button-glass" href="#fonctionnement">Comment ça marche</a>
                </div>
              </div>

              <div className="hero-greeting" aria-label="Le voicebot accueille en français, néerlandais et anglais">
                <IconSprite col={1} row={1} label="Microphone" className="hero-greeting-icon" />
                <span className="hero-greeting-wave" aria-hidden="true">
                  {[12, 23, 17, 30, 38, 25, 17, 27, 14].map((height, index) => (
                    <i style={{ height }} key={`${height}-${index}`} />
                  ))}
                </span>
                <strong>Bonjour, welkom, hello.</strong>
              </div>

              <div className="hero-meta" aria-label="Caractéristiques principales">
                <article>
                  <IconSprite col={8} row={1} label="Globe" className="hero-feature-icon" />
                  <div><strong>Trois langues</strong><span>Français · Nederlands · English</span><i /></div>
                </article>
                <article>
                  <IconSprite col={5} row={6} label="Informations structurées" className="hero-feature-icon" />
                  <div><strong>Des réponses claires</strong><span>Des informations utiles à votre voyage</span><i /></div>
                </article>
                <article>
                  <IconSprite col={2} row={1} label="Casque d’écoute" className="hero-feature-icon" />
                  <div><strong>À votre écoute</strong><span>Posez simplement votre question</span><i /></div>
                </article>
              </div>
            </div>
          </section>
        </div>

        <section className="section-pad usages-section" id="usages">
          <div className="shell">
            <SectionRail current="02" />
            <div className="section-head reveal">
              <h2 data-scroll-title>LES QUESTIONS<br />QUI COMPTENT.</h2>
              <p>Le voicebot couvre les moments récurrents du voyage tout en séparant clairement une règle durable d’une information qui peut changer à la minute.</p>
            </div>
            <div className="usage-bento">
              {travellerNeeds.map((need) => (
                <article data-bento className={`usage-card reveal ${need.size}`} key={need.number}>
                  <span className="bento-glow" aria-hidden="true" />
                  <div className="usage-card-top" data-bento-layer>
                    <IconSprite {...need.icon} />
                    <span>{need.number}</span>
                  </div>
                  <div className="usage-copy">
                    <h3>{need.title}</h3>
                    <p>{need.text}</p>
                    <small>{need.note}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad demo-section" id="demo">
          <div className="demo-background" aria-hidden="true">
            <img src={publicAsset("airport-terminal-blue-gray.webp")} alt="" loading="lazy" decoding="async" />
          </div>
          <span className="demo-shade" aria-hidden="true" />

          <div className="shell demo-inner">
            <SectionRail current="03" />

            <div className="demo-layout">
              <div className="demo-copy reveal">
                <h2 className="demo-title">POSEZ UNE<br />VRAIE QUESTION.</h2>
                <p className="demo-lead">Demandez comment venir en train, où signaler un bagage perdu ou comment préparer les liquides. Parlez naturellement, en français, néerlandais ou anglais.</p>
                <VoicebotTrigger className="button button-primary demo-cta" initialLanguage="fr">
                  <IconSprite col={1} row={1} label="Microphone" className="demo-cta-icon" />
                  Tester le voicebot
                </VoicebotTrigger>
                <p className="demo-limit">Prototype indépendant · aucune donnée opérationnelle en temps réel</p>
              </div>

              <div className="demo-conversation reveal">
                <div className="demo-conversation-head">
                  <div className="demo-agent">
                    <span className="demo-agent-orb" aria-hidden="true"><i /></span>
                    <span><small>ACCUEIL VOCAL</small><strong>Conversation exemple</strong></span>
                  </div>
                  <b>FR</b>
                </div>
                <p className="demo-question">Je peux prendre ma batterie externe dans ma valise&nbsp;?</p>
                <p className="demo-answer">Gardez-la avec vous en cabine, pas en soute. Votre compagnie peut aussi fixer des limites de capacité.</p>
                <VoicebotTrigger className="demo-input-trigger" initialLanguage="fr" aria-label="Ouvrir le voicebot et poser une question">
                  <span>Écrivez ou parlez…</span>
                  <span className="demo-input-mic" aria-hidden="true">
                    <IconSprite col={1} row={1} label="" className="demo-input-icon" />
                  </span>
                </VoicebotTrigger>
              </div>
            </div>

            <div className="demo-quality-grid reveal" aria-label="Qualités de la voix">
              {voiceQualities.map(([number, title, text], index) => (
                <article key={number}>
                  <IconSprite {...demoQualityIcons[index]} className="demo-quality-icon" />
                  <div><h3>{title}</h3><p>{text}</p><i aria-hidden="true" /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad voice-section">
          <div className="shell">
            <SectionRail current="04" />
            <div className="section-head section-head-light reveal">
              <h2 data-scroll-title>HUMAIN DANS<br />LA VOIX.</h2>
              <p>La personnalité vocale a été pensée comme celle d’un agent d’accueil expérimenté : une voix masculine de 42 à 55 ans, bienveillante et énergique, vive sans être pressée, jamais sportive, publicitaire ou théâtrale.</p>
            </div>
            <div className="voice-layout">
              <div className="voice-qualities">
                {voiceQualities.map(([number, title, text]) => (
                  <article data-bento className="quality-card reveal" key={number}>
                    <span className="bento-glow" aria-hidden="true" />
                    <span>{number}</span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
              <div data-bento className="conversation-card reveal">
                <span className="bento-glow" aria-hidden="true" />
                <div className="conversation-head"><span><i /> Conversation exemple</span><b>FR</b></div>
                <div className="speech speech-user"><small>VOYAGEUSE</small><p>Je peux prendre ma batterie externe dans ma valise ?</p></div>
                <div className="speech speech-agent">
                  <small>ACCUEIL VOCAL</small>
                  <p>Gardez-la avec vous en cabine, pas en soute. Votre compagnie peut aussi fixer des limites de capacité. Vous voulez que je vous indique où vérifier ?</p>
                  <div className="mini-wave" aria-hidden="true">{[12, 22, 16, 31, 25, 39, 18, 28, 14, 24, 11].map((height, index) => <i style={{ height }} key={`${height}-${index}`} />)}</div>
                </div>
                <p className="conversation-note">Exemple illustratif. La formulation peut varier selon la conversation.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad journey-section" id="fonctionnement">
          <div className="shell">
            <SectionRail current="05" />
            <div className="section-head reveal">
              <h2 data-scroll-title>ÉCOUTER.<br />VÉRIFIER. ORIENTER.</h2>
              <p>La technologie reste en arrière-plan. La personne entend une réponse claire et sait quoi faire ensuite.</p>
            </div>
            <div className="journey-grid">
              {journey.map(([number, title, text]) => (
                <article data-bento className="journey-card reveal" key={number}>
                  <span className="bento-glow" aria-hidden="true" />
                  <span className="journey-number">{number}</span>
                  <div className="journey-signal" data-bento-layer><i /><i /><i /><i /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
            <div className="architecture-strip reveal">
              <div><span>VOIX</span><b>ElevenLabs</b></div><i>→</i>
              <div><span>ORCHESTRATION</span><b>Règles et outils</b></div><i>→</i>
              <div><span>CONNAISSANCE</span><b>Sources structurées</b></div><i>→</i>
              <div><span>RELAIS</span><b>Canal officiel ou humain</b></div>
            </div>
          </div>
        </section>

        <section className="section-pad trust-section">
          <div className="shell">
            <SectionRail current="06" />
            <div className="section-head section-head-light reveal">
              <h2 data-scroll-title>UNE BONNE RÉPONSE<br />CONNAÎT SA LIMITE.</h2>
              <p>Le prototype ne confond pas une connaissance vérifiée avec une donnée opérationnelle. Cette séparation réduit les réponses périmées et les certitudes inventées.</p>
            </div>
            <div className="trust-bento">
              <article data-bento className="trust-card reveal">
                <span className="bento-glow" aria-hidden="true" />
                <span className="trust-status trust-status-stable">STRUCTURÉ</span>
                <h3>Informations relativement stables</h3>
                <p>Préparation, bagages, accessibilité, mobilité, services et orientation générale, avec date de vérification et lien source.</p>
              </article>
              <article data-bento className="trust-card reveal">
                <span className="bento-glow" aria-hidden="true" />
                <span className="trust-status trust-status-live">À VÉRIFIER</span>
                <h3>Informations opérationnelles</h3>
                <p>Vol, porte, comptoir, tapis, horaires, disponibilités et tarifs restent rattachés aux canaux officiels ou aux systèmes autorisés.</p>
              </article>
              <article data-bento className="trust-card trust-card-red reveal">
                <span className="bento-glow" aria-hidden="true" />
                <span className="trust-mark">!</span>
                <h3>Le voicebot ne devine pas.</h3>
                <p>Il signale l’incertitude, demande juste assez de contexte et passe la main lorsqu’une réponse vocale ne suffit pas.</p>
              </article>
            </div>
            <div className="trust-link-row reveal">
              <Link href="/sources">Explorer les sources et leur statut <span>↗</span></Link>
              <Link href="/architecture">Voir l’architecture <span>↗</span></Link>
            </div>
          </div>
        </section>

        <section className="section-pad faq-section" id="faq">
          <div className="shell">
            <SectionRail current="07" />
            <div className="faq-layout">
              <div className="faq-intro reveal">
                <h2 data-scroll-title>CLAIR DÈS<br />LE DÉPART.</h2>
                <p>Une démonstration claire vaut mieux qu’une promesse floue. Voici les limites posées dès le départ.</p>
              </div>
              <div className="faq-list reveal">
                {faqs.map((faq, index) => (
                  <details key={faq.question} open={index === 0}>
                    <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<i aria-hidden="true" /></summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad strike-section" id="strike-it">
          <div className="shell">
            <SectionRail current="08" />
            <div className="strike-grid">
              <div className="strike-copy reveal">
                <h2 data-scroll-title>STRIKE IT<br />2026.</h2>
                <p className="strike-lead">Le projet Voice Bot de Banana Navy a été sélectionné dans le cadre du programme Belgian Defence STRIKE IT 2026 et bénéficie du soutien de la Cyber Defence Factory / Cyber Command. Il progresse du prototype vers une capacité opérationnelle.</p>
                <p>Le cadre STRIKE IT est décrit comme conçu, hébergé et opéré dans l’Union européenne afin de soutenir les exigences européennes de résidence et de gouvernance des données.</p>
                <p className="strike-guard">Garde-fou de contexte: cette sélection et ces soutiens concernent uniquement le projet Voice Bot de Banana Navy. Ils sont distincts de ce concept indépendant pour Brussels Airport et ne constituent ni affiliation, ni approbation de l’aéroport.</p>
              </div>
              <div data-bento className="strike-partners reveal" role="group" aria-label="Contexte du programme STRIKE IT pour le projet Banana Navy">
                <span className="bento-glow" aria-hidden="true" />
                <p>PROJET BANANA NAVY UNIQUEMENT</p>
                <div className="strike-logo-grid" data-bento-layer>
                  <img src={brandAsset("badge-defence.png")} alt="Belgian Defence" width="220" height="142" loading="lazy" />
                  <img src={brandAsset("badge-crest-royal.png")} alt="Écusson institutionnel royal" width="112" height="200" loading="lazy" />
                  <img src={brandAsset("badge-strike-it.png")} alt="STRIKE IT" width="823" height="531" loading="lazy" />
                  <img src={brandAsset("badge-cyberforce.png")} alt="Cyber Force" width="157" height="200" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="shell final-cta-inner">
            <SectionRail current="09" />
            <div className="final-cta-content reveal">
              <h2>UNE QUESTION.<br />UNE VOIX.<br /><span>LA BONNE DIRECTION.</span></h2>
              <div>
                <p>Le meilleur test reste une conversation. Posez une question simple, écoutez la réponse, puis challengez le prototype.</p>
                <VoicebotTrigger className="button button-white" initialLanguage="fr">Parler au prototype</VoicebotTrigger>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
