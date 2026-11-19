import type { Metadata } from "next";
import Link from "next/link";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Banana Navy",
  description:
    "Banana Navy conçoit des voicebots fiables, sécurisés et intégrés pour les entreprises dont la communication ne peut pas être approximative.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/banana-navy/` }
    : undefined,
};

const capabilities = [
  {
    number: "01",
    title: "Une ingénierie de bout en bout",
    text: "Nous concevons toute la chaîne, de la téléphonie à l’action métier, avec la transcription, la connaissance, les permissions, les règles et la traçabilité.",
  },
  {
    number: "02",
    title: "Des réponses fondées",
    text: "Le voicebot répond à partir de connaissances approuvées et de résultats d’outils. Il distingue ce qu’il sait de ce qui doit être vérifié.",
  },
  {
    number: "03",
    title: "Des limites explicites",
    text: "Périmètre, garde-fous, permissions et transfert humain sont définis avant la mise en service. Une incertitude déclenche une clarification ou une escalade.",
  },
  {
    number: "04",
    title: "Une qualité observable",
    text: "Nous testons de vraies conversations, les interruptions, les cas limites et les pannes. La latence, les erreurs et les transferts restent mesurables.",
  },
];

const controlPoints = [
  ["CONNAISSANCE", "Sources approuvées et datées"],
  ["GARDE-FOUS", "Règles déterministes hors modèle"],
  ["ACTIONS", "Permissions minimales et contrôlées"],
  ["RELAIS", "Passage à l’humain avec le contexte"],
];

const deliveryProcess = [
  ["01", "Cadrer", "Objectifs, risques, parcours d’appel et critères de succès sont définis avec les équipes métier."],
  ["02", "Prototyper", "Les scénarios sont joués avec des conversations réalistes, y compris les silences, interruptions et demandes hors périmètre."],
  ["03", "Déployer", "Le voicebot est relié aux bons outils, avec les permissions, l’observabilité et le mode de reprise nécessaires."],
  ["04", "Faire évoluer", "Les conversations autorisées alimentent une amélioration continue, documentée et mesurée dans le temps."],
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
        <section className="banana-hero section-pad">
          <div className="shell banana-hero-grid">
            <div className="banana-hero-copy reveal">
              <img
                className="banana-page-logo"
                src={`${basePath}/brand/banana-navy-logo.png`}
                alt="Banana Navy"
                width="400"
                height="238"
              />
              <h1>DES VOICEBOTS<br /><span>QUI RESTENT FIABLES.</span></h1>
              <p>Banana Navy est un studio belge d’ingénierie et d’IA. Nous construisons des agents vocaux et des systèmes multi-agents pour les entreprises dont chaque réponse doit être claire, exacte et actionnable.</p>
              <div className="banana-hero-actions">
                <a className="button button-primary" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Découvrir Banana Navy <span aria-hidden="true">↗</span></a>
                <a className="button button-secondary" href="tel:+32495277044">Parler à Marc</a>
              </div>
              <p className="banana-location">ENGINEERING &amp; AI · CHARLEROI, BELGIQUE</p>
            </div>

            <article data-bento className="banana-control-card reveal">
              <span className="bento-glow" aria-hidden="true" />
              <div className="banana-control-head" data-bento-layer>
                <span className="banana-control-orb" aria-hidden="true"><i /></span>
                <h2>Votre voix.<br />Vos règles.</h2>
              </div>
              <div className="banana-control-list">
                {controlPoints.map(([label, value]) => (
                  <div key={label}><small>{label}</small><strong>{value}</strong><span aria-hidden="true">✓</span></div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="banana-capabilities section-pad">
          <div className="shell">
            <div className="section-heading split-heading reveal">
              <div><h2>PLUS QU’UNE VOIX.</h2></div>
              <p>Un voicebot fiable n’est pas un simple prompt avec une belle voix. C’est un système complet, relié aux bons outils, encadré par des règles métier et conçu pour savoir quand passer la main.</p>
            </div>
            <div className="banana-capability-grid">
              {capabilities.map((capability) => (
                <article data-bento className="banana-capability-card reveal" key={capability.number}>
                  <span className="bento-glow" aria-hidden="true" />
                  <span>{capability.number}</span>
                  <h3>{capability.title}</h3>
                  <p>{capability.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="banana-critical section-pad">
          <div className="shell banana-critical-grid">
            <div className="banana-critical-copy reveal">
              <h2>QUAND CHAQUE<br />MOT COMPTE.</h2>
              <p>Nous concevons pour les environnements sensibles et exigeants. Le système doit rester utile sous pression, fonctionner en plusieurs langues et rendre ses limites visibles à l’opérateur comme à l’appelant.</p>
              <a className="text-link light-link" href="https://banana-navy.ai/fr/voice-agents/" target="_blank" rel="noreferrer">Voir notre approche des agents vocaux <span>↗</span></a>
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
            <div className="section-heading split-heading reveal">
              <div><h2>DU PREMIER APPEL<br />À LA PRODUCTION.</h2></div>
              <p>Banana Navy accompagne le cycle complet. L’expérience vocale, l’architecture, la sécurité, les intégrations et l’amélioration continue avancent ensemble.</p>
            </div>
            <div className="banana-process-grid">
              {deliveryProcess.map(([number, title, text]) => (
                <article data-bento className="banana-process-card reveal" key={number}>
                  <span className="bento-glow" aria-hidden="true" />
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
              <h2>UNE ÉQUIPE<br />QUI CONSTRUIT.</h2>
              <p>Ingénierie IA, développement logiciel, design conversationnel et intégration système sont réunis dans la même équipe. Cette continuité évite qu’une promesse commerciale se perde entre un prototype et la réalité opérationnelle.</p>
            </div>
            <article data-bento className="banana-proof-card reveal">
              <span className="bento-glow" aria-hidden="true" />
              <strong>STRIKE IT 2026</strong>
              <p>Le projet Voice Bot de Banana Navy a été sélectionné dans le programme Belgian Defence STRIKE IT 2026. Il illustre notre travail sur une communication de crise robuste et résiliente, distincte de ce concept Zaventem.</p>
              <Link href="/#strike-it">Voir le contexte du projet <span>→</span></Link>
            </article>
          </div>
        </section>

        <section className="page-cta banana-page-cta">
          <div className="shell">
            <div><h2>Votre communication mérite mieux qu’une réponse plausible.</h2></div>
            <div className="banana-page-cta-actions">
              <a className="button button-white" href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">Visiter banana-navy.ai <span aria-hidden="true">↗</span></a>
              <a className="text-link light-link" href="tel:+32495277044">Let&apos;s Talk · +32 495 27 70 44</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
