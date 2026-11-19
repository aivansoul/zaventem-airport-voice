import type { Metadata } from "next";
import Link from "next/link";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VisualPlaceholder } from "@/components/visual-placeholder";
import { VoicebotTrigger } from "@/components/voicebot-modal";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Architecture proposée pour un accueil vocal aéroportuaire trilingue, sourcé et prudent.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/architecture/` }
    : undefined,
};

const layers = [
  {
    number: "01",
    category: "Expérience",
    title: "Une conversation naturelle",
    text: "Le voyageur parle en français, néerlandais ou anglais. L’accueil reste bref, pose une seule question utile à la fois et conserve une prosodie adulte et vivante.",
  },
  {
    number: "02",
    category: "Raisonnement",
    title: "Une réponse ancrée",
    text: "L’agent cherche dans une base de synthèses originales, organisées par sujet, langue, niveau de volatilité, date de contrôle et source officielle.",
  },
  {
    number: "03",
    category: "Garde-fous",
    title: "Une limite explicite",
    text: "Les informations de vol et les autres données mouvantes ne sont jamais inventées. Sans intégration autorisée, la personne est dirigée vers le canal officiel approprié.",
  },
  {
    number: "04",
    category: "Amélioration",
    title: "Une qualité observable",
    text: "Les scénarios de test portent sur le contenu, la langue, la brièveté, le transfert et le rendu audio réel, pas seulement sur un prompt ou une configuration.",
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <LandingMotion />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader active="architecture" />
      <main id="contenu">
        <section className="subhero section-pad">
          <div className="shell subhero-grid">
            <div>
              <h1>Une voix simple.<br /><em>Une discipline solide.</em></h1>
              <p>Le parcours a été conçu pour que la technologie reste invisible, que les sources restent traçables et que les données opérationnelles ne soient jamais simulées.</p>
            </div>
            <VisualPlaceholder className="subhero-visual gradient-mix" label="Schéma visuel à intégrer" />
          </div>
        </section>

        <section className="architecture-flow section-pad">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><h2>Quatre couches,<br />une seule expérience.</h2></div>
              <p>Chaque couche a un rôle limité. Cette séparation permet de faire évoluer la voix, le contenu et les intégrations sans brouiller la responsabilité de chacun.</p>
            </div>
            <div className="architecture-layers">
              {layers.map((layer) => (
                <article key={layer.number} data-bento>
                  <span className="architecture-number">{layer.number}</span>
                  <div><small>{layer.category}</small><h3>{layer.title}</h3><p>{layer.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="system-map section-pad">
          <div className="shell">
            <div className="section-heading centered-heading light-heading">
              <h2>Ce qui est démontré aujourd’hui.</h2>
              <p>Le prototype sépare volontairement la connaissance éditoriale d’une éventuelle couche opérationnelle future.</p>
            </div>
            <div className="system-flow" aria-label="Flux de l’architecture proposée">
              <div className="system-node"><small>Entrée</small><strong>Voix du voyageur</strong><span>FR · NL · EN</span></div>
              <i aria-hidden="true">→</i>
              <div className="system-node primary-node"><small>Agent conversationnel</small><strong>Comprendre &amp; répondre</strong><span>Voix + instructions + garde-fous</span></div>
              <i aria-hidden="true">→</i>
              <div className="system-node"><small>Connaissance</small><strong>Base structurée</strong><span>Sources, dates et niveau de volatilité</span></div>
            </div>
            <div className="future-layer">
              <span>Couche future, non connectée dans cette démonstration</span>
              <div>
                <article><b>Données opérationnelles autorisées</b><p>Vols, portes, comptoirs, tapis ou attente uniquement via une interface et des droits validés.</p></article>
                <article><b>Orchestration &amp; journal d’édition</b><p>Mises à jour contrôlées, validation humaine et traçabilité avant publication.</p></article>
                <article><b>Relais humain</b><p>Transfert vers le bon service lorsque la situation dépasse l’information générale.</p></article>
              </div>
            </div>
          </div>
        </section>

        <section className="principles section-pad">
          <div className="shell principles-grid">
            <div><h2>La confiance n’est pas une option de configuration.</h2></div>
            <div className="principle-list">
              <article><b>01</b><div><h3>Pas de fausse donnée live</h3><p>Une donnée opérationnelle sans accès autorisé reste explicitement hors périmètre.</p></div></article>
              <article><b>02</b><div><h3>Une provenance visible</h3><p>Chaque bloc de connaissance conserve son origine et sa date de vérification.</p></div></article>
              <article><b>03</b><div><h3>Une voix testée comme une voix</h3><p>Les critères portent sur l’audio entendu&nbsp;: rythme, interruptions, nombres, chaleur et absence d’intonation mécanique.</p></div></article>
              <article><b>04</b><div><h3>La confidentialité par défaut</h3><p>Le test déconseille les données sensibles et demande un consentement avant l’accès au microphone.</p></div></article>
            </div>
          </div>
        </section>

        <section className="page-cta"><div className="shell"><div><h2>La technique doit se faire oublier.</h2></div><div><VoicebotTrigger className="button button-white">Tester la conversation</VoicebotTrigger><Link className="text-link light-link" href="/banana-navy">Découvrir Banana Navy <span>→</span></Link></div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
