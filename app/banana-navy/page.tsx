import type { Metadata } from "next";
import Link from "next/link";
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

const controlPoints = [
  ["Connaissance", "Sources approuvées, structurées et datées"],
  ["Garde-fous", "Règles déterministes en dehors du modèle"],
  ["Actions", "Permissions minimales, contrôlées et traçables"],
  ["Relais", "Passage à l’humain avec tout le contexte"],
];

const deliveryProcess = [
  ["01", "Cadrage", "Rôle de l’agent, workflows, risques, langues, intégrations et critères de réussite sont définis avec les équipes métier."],
  ["02", "Prototype", "Les parcours sont testés dans des conversations réalistes, avec silences, interruptions, ambiguïtés et demandes hors périmètre."],
  ["03", "Mise en service", "Les systèmes, permissions, garde-fous, chemins d’escalade, monitoring et support sont validés avant le lancement."],
  ["04", "Évolution", "Les performances observées servent à améliorer les connaissances et les workflows de façon documentée et mesurable."],
];

const demandingSectors = [
  "Défense et gestion de crise",
  "Services publics",
  "Santé",
  "Banque, finance et assurance",
  "Énergie et infrastructures critiques",
  "Transport et logistique",
];

export default function BananaNavyPage() {
  return (
    <>
      <LandingMotion />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader active="banana-navy" />

      <main id="contenu" className="banana-page">
        <section className="banana-hero">
          <div className="banana-hero-visual" aria-hidden="true"><i /><i /><i /></div>
          <div className="shell banana-hero-inner">
            <p className="banana-hero-intro reveal">Studio belge d’ingénierie et d’IA pour les communications qui ne peuvent pas être approximatives.</p>
            <h1 className="reveal">DES VOICEBOTS<br /><span>QUI RESTENT FIABLES</span></h1>
            <div className="banana-hero-bottom reveal">
              <p>Nous construisons des agents vocaux et des systèmes multi-agents, du premier cadrage à la production, au monitoring et à l’amélioration continue.</p>
              <div className="banana-hero-actions">
                <a className="button banana-button-light" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Découvrir Banana Navy <span aria-hidden="true">↗</span></a>
                <a className="banana-inline-link" href="tel:+32495277044">Parler à Marc <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </section>

        <section className="banana-voice-rules section-pad">
          <div className="shell banana-voice-rules-grid">
            <h2 className="reveal">VOTRE VOIX<br /><span>VOS RÈGLES</span></h2>
            <div className="banana-voice-rules-copy reveal">
              <p>Nous concevons des agents vocaux qui décrochent, comprennent l’appelant et agissent, ainsi que les systèmes multi-agents qui, en coulisses, recherchent, vérifient et orientent. Le dernier mot revient toujours à un humain.</p>
              <p>Chaque bot que nous livrons est cadré, encadré et observable. Lignes de sécurité publique, hôpitaux, banques, défense : des environnements où une hallucination n’est pas une option.</p>
            </div>
          </div>
          <div className="shell banana-voice-rules-visual reveal" role="img" aria-label="Composition abstraite dans les tons cuivre, orange et rose">
            <span>VOICE AGENTS</span>
            <span>HUMAN CONTROL</span>
          </div>
        </section>

        <section className="banana-services section-pad">
          <div className="shell">
            <div className="banana-section-head reveal">
              <h2>DES SERVICES<br /><span>DE BOUT EN BOUT</span></h2>
              <p>Nous transformons des besoins métier complexes en systèmes d’IA fiables. Le conseil, le produit, les intégrations et le contrôle opérationnel avancent dans une même architecture.</p>
            </div>
            <div className="banana-services-grid">
              <div className="banana-services-visual reveal" role="img" aria-label="Visuel abstrait Banana Navy dans les tons orange et cuivre"><i /><i /></div>
              <div className="banana-service-list">
                {services.map((service) => (
                  <article className="banana-service-row reveal" key={service.title}>
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
          <div className="shell banana-controls-grid">
            <div className="banana-controls-copy reveal">
              <h2>FIABLE<br /><span>PAR CONCEPTION</span></h2>
              <p>Une belle voix ne suffit pas. La fiabilité vient d’une architecture où les connaissances, les permissions, les règles et la reprise humaine sont conçues comme un seul système.</p>
              <a className="banana-inline-link banana-inline-link-dark" href="https://banana-navy.ai/fr/voice-agents/" target="_blank" rel="noreferrer">Voir notre approche des agents vocaux <span aria-hidden="true">↗</span></a>
            </div>
            <div className="banana-control-list reveal">
              {controlPoints.map(([label, value]) => (
                <div key={label}><strong>{label}</strong><span>{value}</span><i aria-hidden="true">↗</i></div>
              ))}
            </div>
          </div>
        </section>

        <section className="banana-critical section-pad">
          <div className="shell banana-critical-grid">
            <div className="banana-critical-copy reveal">
              <h2>QUAND CHAQUE<br /><span>MOT COMPTE</span></h2>
              <p>Nous concevons pour des environnements sensibles et exigeants. Le système doit rester utile sous pression, fonctionner dans plusieurs langues et rendre ses limites visibles à l’opérateur comme à l’appelant.</p>
            </div>
            <div className="banana-sector-list reveal">
              {demandingSectors.map((sector, index) => (
                <div key={sector}><span>{String(index + 1).padStart(2, "0")}</span><strong>{sector}</strong></div>
              ))}
            </div>
          </div>
        </section>

        <section className="banana-process section-pad">
          <div className="shell">
            <div className="banana-section-head reveal">
              <h2>CONÇU POUR LE BUSINESS<br /><span>PRÊT POUR LE TERRAIN</span></h2>
              <p>Banana Navy accompagne le cycle complet. L’expérience vocale, l’architecture, la sécurité, les intégrations et l’amélioration continue avancent ensemble.</p>
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

        <section className="banana-proof section-pad">
          <div className="shell banana-proof-grid">
            <div className="reveal">
              <h2>UNE ÉQUIPE<br /><span>QUI CONSTRUIT</span></h2>
              <p>Ingénierie IA, développement logiciel, design conversationnel et intégration système sont réunis dans une même équipe. Cette continuité évite qu’une promesse commerciale se perde entre un prototype et la réalité opérationnelle.</p>
            </div>
            <div className="banana-proof-evidence reveal">
              <strong>STRIKE IT 2026</strong>
              <p>Le projet Voice Bot de Banana Navy a été sélectionné dans le programme Belgian Defence STRIKE IT 2026. Il illustre notre travail sur une communication de crise robuste et résiliente, distincte de ce concept Zaventem.</p>
              <Link href="/#strike-it">Voir le contexte du projet <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="banana-page-cta">
          <div className="shell">
            <h2 className="reveal">PARLONS-EN</h2>
            <div className="banana-page-cta-copy reveal">
              <p>Votre communication mérite mieux qu’une réponse plausible.</p>
              <div className="banana-page-cta-actions">
                <a className="button banana-button-dark" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Visiter banana-navy.ai <span aria-hidden="true">↗</span></a>
                <a className="banana-inline-link banana-inline-link-dark" href="tel:+32495277044">Let&apos;s Talk · +32 495 27 70 44</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
