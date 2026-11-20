import type { Metadata } from "next";
import { BananaScrollExperience } from "@/components/banana-scroll-experience";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Banana Navy",
  description:
    "Banana Navy conçoit des voicebots fiables, sécurisés et intégrés pour les entreprises dont la communication ne peut pas être approximative.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/banana-navy/` }
    : undefined,
};

const services = [
  {
    number: "01 / 04",
    title: "Stratégie & conseil IA",
    meta: "Audit · Feuille de route · Cadrage",
    text: "Nous identifions où les agents vocaux et l’IA créent une vraie valeur, où ils ne devraient pas intervenir et quels garde-fous doivent être posés avant de construire.",
  },
  {
    number: "02 / 04",
    title: "Développement produit",
    meta: "Web · App · API",
    text: "Du prototype à la production, nous développons les interfaces, les API et les services qui relient l’agent à la téléphonie et aux outils de l’entreprise.",
  },
  {
    number: "03 / 04",
    title: "Automatisation",
    meta: "Agents · Workflows · Intégrations",
    text: "Nous connectons CRM, agendas, ticketing et processus documentaires pour automatiser les tâches répétitives tout en conservant une validation humaine aux étapes sensibles.",
  },
  {
    number: "04 / 04",
    title: "Systèmes multi-agents",
    meta: "Orchestration · Agents spécialisés · Supervision humaine",
    text: "Un orchestrateur, des agents spécialisés et des règles déterministes travaillent ensemble pour que chaque réponse soit fondée, chaque action vérifiée et chaque limite visible.",
  },
];

const controlLayers = [
  {
    number: "01 / 05",
    title: "Couche vocale",
    text: "Des conversations naturelles au téléphone, dans le navigateur ou sur une borne. La couche vocale gère la faible latence, les interruptions et les changements de langue au cours d’un même échange.",
  },
  {
    number: "02 / 05",
    title: "Orchestrateur",
    text: "L’agent principal garde le fil, identifie l’intention et transmet le contexte au bon relais. Des workflows définis maintiennent chaque réponse dans son périmètre.",
  },
  {
    number: "03 / 05",
    title: "Agents spécialisés",
    text: "Des agents dédiés prennent en charge le routage, la prise de rendez-vous ou un processus métier précis à partir de sources vérifiées et d’outils autorisés.",
  },
  {
    number: "04 / 05",
    title: "Outils et garde-fous",
    text: "Les contrôles IA, les outils approuvés et les règles déterministes hors modèle encadrent les réponses et les actions. Une information incertaine déclenche une clarification ou une escalade.",
  },
  {
    number: "05 / 05",
    title: "Contrôle humain",
    text: "L’équipe peut reprendre la main avec tout le contexte. Le monitoring, l’évaluation continue et la validation des actions sensibles gardent le système sous contrôle dans la durée.",
  },
];

const deliveryProcess = [
  ["01", "Cadrage", "Rôle de l’agent, workflows, risques, langues, intégrations et critères de réussite sont définis avec les équipes métier."],
  ["02", "Prototype", "Les parcours sont testés dans des conversations réalistes, avec silences, interruptions, ambiguïtés et demandes hors périmètre."],
  ["03", "Mise en service", "Les systèmes, permissions, garde-fous, chemins d’escalade, monitoring et support sont validés avant le lancement."],
  ["04", "Évolution", "Les performances observées servent à améliorer les connaissances et les workflows de façon documentée et mesurable."],
];

export default function BananaNavyPage() {
  return (
    <>
      <LandingMotion />
      <BananaScrollExperience />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader active="banana-navy" />

      <main id="contenu" className="banana-page">
        <section className="banana-hero section-pad">
          <div className="shell banana-hero-grid">
            <h1><span className="banana-title-line"><span className="banana-title-line-inner banana-hero-title-fill banana-rise-line reveal">DES VOICEBOTS</span></span><span className="banana-title-line"><span className="banana-title-line-inner banana-hero-title-fill banana-title-accent banana-rise-line reveal">QUI RESTENT FIABLES</span></span></h1>
            <div className="banana-hero-side reveal">
              <p>Studio belge d’ingénierie et d’IA, nous construisons des agents vocaux et des systèmes multi-agents, du premier cadrage à la production, au monitoring et à l’amélioration continue.</p>
              <div className="banana-hero-actions">
                <a className="button banana-button-light" href="tel:+32495277044" aria-label="Contacter Marc-Antoine au +32 495 27 70 44">Contact</a>
                <a className="banana-inline-link" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Découvrir Banana Navy <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </section>

        <section className="banana-voice-rules section-pad">
          <div className="shell banana-voice-rules-grid">
            <h2><span className="banana-title-line"><span className="banana-title-line-inner banana-rise-line reveal" data-scroll-title>VOTRE VOIX</span></span><span className="banana-title-line"><span className="banana-title-line-inner banana-title-accent banana-rise-line reveal" data-scroll-title>VOS RÈGLES</span></span></h2>
            <div className="banana-voice-rules-copy reveal">
              <p>Nous concevons des agents vocaux qui décrochent, comprennent l’appelant et agissent, ainsi que les systèmes multi-agents qui, en coulisses, recherchent, vérifient et orientent. Le dernier mot revient toujours à un humain.</p>
              <p>Chaque bot que nous livrons est cadré, encadré et observable. Lignes de sécurité publique, hôpitaux, banques, défense : des environnements où une hallucination n’est pas une option.</p>
            </div>
          </div>
        </section>

        <section className="banana-services section-pad">
          <div className="shell">
            <div className="banana-section-head">
              <h2><span className="banana-title-line"><span className="banana-title-line-inner banana-rise-line reveal" data-scroll-title>DES SERVICES</span></span><span className="banana-title-line"><span className="banana-title-line-inner banana-title-accent banana-rise-line reveal" data-scroll-title>DE BOUT EN BOUT</span></span></h2>
              <p className="reveal">Nous transformons des besoins métier complexes en systèmes d’IA fiables. Le conseil, le produit, les intégrations et le contrôle opérationnel avancent dans une même architecture.</p>
            </div>
            <div className="banana-services-grid" data-banana-scroll="services">
              <div className="banana-services-visual reveal" aria-hidden="true">
                {services.map((service, index) => (
                  <div className={`banana-scroll-visual banana-scroll-visual-${index + 1} ${index === 0 ? "is-active" : ""}`} data-banana-scroll-visual key={service.title}><i /><i /></div>
                ))}
              </div>
              <div className="banana-service-list">
                {services.map((service) => (
                  <article className="banana-service-row reveal" data-banana-scroll-row key={service.title}>
                    <div className="banana-service-meta"><span>{service.number}</span><span>{service.meta}</span></div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="banana-controls section-pad">
          <div className="shell">
            <div className="banana-section-head">
              <h2><span className="banana-title-line"><span className="banana-title-line-inner banana-rise-line reveal" data-scroll-title>CINQ COUCHES</span></span><span className="banana-title-line"><span className="banana-title-line-inner banana-title-accent banana-rise-line reveal" data-scroll-title>UN SEUL MODÈLE DE CONTRÔLE</span></span></h2>
              <div className="banana-controls-intro reveal">
                <p>Une belle voix ne suffit pas. La fiabilité vient d’une architecture où les connaissances, les permissions, les règles et la reprise humaine sont conçues comme un seul système.</p>
                <p>Chaque couche est documentée, testée et surveillée afin que le système reste utile, observable et sous contrôle dans le temps.</p>
              </div>
            </div>
            <div className="banana-controls-grid" data-banana-scroll="layers">
              <div className="banana-control-visual reveal" aria-hidden="true">
                {controlLayers.map((layer, index) => (
                  <div className={`banana-scroll-visual banana-control-visual-${index + 1} ${index === 0 ? "is-active" : ""}`} data-banana-scroll-visual key={layer.title}><i /><i /></div>
                ))}
              </div>
              <div className="banana-control-list">
                {controlLayers.map((layer) => (
                  <article className="banana-control-row reveal" data-banana-scroll-row key={layer.title}>
                    <span>{layer.number}</span>
                    <h3>{layer.title}</h3>
                    <p>{layer.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="banana-process section-pad">
          <div className="shell">
            <div className="banana-section-head">
              <h2><span className="banana-title-line"><span className="banana-title-line-inner banana-rise-line reveal" data-scroll-title>CONÇU POUR LE BUSINESS</span></span><span className="banana-title-line"><span className="banana-title-line-inner banana-title-accent banana-rise-line reveal" data-scroll-title>PRÊT POUR LE TERRAIN</span></span></h2>
              <p className="reveal">Banana Navy accompagne le cycle complet. L’expérience vocale, l’architecture, la sécurité, les intégrations et l’amélioration continue avancent ensemble.</p>
            </div>
            <div className="banana-process-grid">
              {deliveryProcess.map(([number, title, text]) => (
                <article className="banana-process-step reveal" key={number}>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="banana-page-cta">
          <div className="shell">
            <h2><span className="banana-title-line"><span className="banana-title-line-inner banana-rise-line reveal" data-scroll-title>PARLONS-EN</span></span></h2>
            <div className="banana-page-cta-copy reveal">
              <p>Votre communication mérite mieux qu’une réponse plausible.</p>
              <div className="banana-page-cta-actions">
                <a className="button banana-button-dark" href="tel:+32495277044" aria-label="Appeler Marc-Antoine au +32 495 27 70 44">+32 495 27 70 44</a>
                <a className="banana-inline-link banana-inline-link-dark" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Visiter banana-navy.ai <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
