import type { Metadata } from "next";
import Link from "next/link";
import { LandingMotion } from "@/components/landing-motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VoicebotTrigger } from "@/components/voicebot-modal";

export const metadata: Metadata = {
  title: "Sources",
  description: "Sources officielles et règles de fraîcheur du prototype d’accueil vocal pour Brussels Airport.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/sources/` }
    : undefined,
};

const sourceGroups = [
  {
    title: "Préparer le voyage",
    description: "Enregistrement, arrivée à l’aéroport, sûreté, contrôle frontalier et préparation générale.",
    links: [
      ["Préparer son voyage", "https://www.brusselsairport.be/en/passenger/travel-planner/prepare-your-travel"],
      ["Enregistrement", "https://www.brusselsairport.be/en/passenger/travel-planner/check-in"],
      ["Contrôle de sûreté", "https://www.brusselsairport.be/en/passenger/travel-planner/security-screening/"],
      ["Contrôle frontalier", "https://www.brusselsairport.be/en/passenger/travel-planner/border-control"],
    ],
  },
  {
    title: "Accès & mobilité",
    description: "Train, bus, voiture et autres options pour rejoindre ou quitter le terminal.",
    links: [
      ["Venir à Brussels Airport", "https://www.brusselsairport.be/en/passenger/mobility/how-to-get-to-brussels-airport"],
      ["Accès en bus", "https://www.brusselsairport.be/en/passenger/mobility/bus/"],
    ],
  },
  {
    title: "Dans l’aéroport",
    description: "Assistance, services, salons et informations pratiques dans le terminal.",
    links: [
      ["Assistance", "https://www.brusselsairport.be/en/passenger/at-the-airport/assistance/"],
      ["Services", "https://www.brusselsairport.be/en/passenger/at-the-airport/services"],
      ["Salons", "https://www.brusselsairport.be/en/passenger/at-the-airport/services/lounges/brussels-airport-lounges/"],
      ["Wi-Fi", "https://www.brusselsairport.be/en/passenger/at-the-airport/services/free-wifi/"],
    ],
  },
  {
    title: "Bagages & objets perdus",
    description: "Bagages de soute, objets retrouvés et orientation vers le bon interlocuteur.",
    links: [
      ["Bagages de soute", "https://www.brusselsairport.be/en/passenger/travel-planner/luggage/hold-luggage/"],
      ["Objets perdus", "https://www.brusselsairport.be/en/passenger/contact/lost-found/faq"],
      ["Casiers", "https://www.brusselsairport.be/en/passenger/at-the-airport/services/lockers"],
    ],
  },
];

export default function SourcesPage() {
  return (
    <>
      <LandingMotion />
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader active="sources" />
      <main id="contenu">
        <section className="subhero sources-subhero section-pad">
          <div className="shell subhero-grid">
            <div>
              <h1>Une source n’est utile<br /><em>que si elle reste lisible.</em></h1>
              <p>Le prototype s’appuie sur des synthèses originales de pages publiques identifiées. Il ne reproduit pas le site et ne remplace jamais l’information opérationnelle officielle.</p>
            </div>
            <div className="source-key">
              <p><i className="key-stable" /><span><b>Relativement stable</b><small>Revue périodique et lien conservé</small></span></p>
              <p><i className="key-changing" /><span><b>Susceptible de changer</b><small>Vérification au moment du voyage</small></span></p>
              <p><i className="key-live" /><span><b>Opérationnel</b><small>Canal officiel ou système autorisé requis</small></span></p>
            </div>
          </div>
        </section>

        <section className="source-method section-pad">
          <div className="shell method-grid">
            <div><h2>Résumé, traçabilité, date.</h2><p>Chaque réponse de fond doit pouvoir revenir à une page source et à une date de contrôle. Les formulations sont réécrites pour la voix, sans copier des pages entières.</p></div>
            <ol>
              <li><span>1</span><div><b>Identifier</b><p>Retenir la page officielle qui porte réellement l’information.</p></div></li>
              <li><span>2</span><div><b>Qualifier</b><p>Classer le contenu comme stable, évolutif ou opérationnel.</p></div></li>
              <li><span>3</span><div><b>Synthétiser</b><p>Écrire une réponse originale, courte et adaptée à l’oral.</p></div></li>
              <li><span>4</span><div><b>Recontrôler</b><p>Réviser la source avant toute mise en production et après un changement signalé.</p></div></li>
            </ol>
          </div>
        </section>

        <section className="source-library section-pad">
          <div className="shell">
            <div className="section-heading split-heading"><div><h2>Pages publiques identifiées.</h2></div><p>Les liens ci-dessous servent de provenance au prototype. Ils peuvent évoluer et doivent être revérifiés avant une utilisation publique ou opérationnelle.</p></div>
            <div className="source-groups">
              {sourceGroups.map((group, index) => (
                <article key={group.title} data-bento>
                  <span className="source-index">0{index + 1}</span>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                  <ul>{group.links.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a></li>)}</ul>
                </article>
              ))}
            </div>
            <p className="source-disclaimer">Liens consultés pour la conception du prototype. Brussels Airport Company reste propriétaire de ses contenus et de ses signes distinctifs. Banana Navy n’en revendique aucun droit.</p>
          </div>
        </section>

        <section className="volatile-section section-pad">
          <div className="shell volatile-grid">
            <div><h2>Les données du moment restent des données du moment.</h2></div>
            <div className="volatile-list">
              <span>Statut, retard ou annulation d’un vol</span><span>Porte, comptoir ou tapis</span><span>Temps d’attente</span><span>Prix et disponibilité du parking</span><span>Horaires et travaux de transport</span><span>Ouverture d’un commerce ou service</span>
            </div>
            <p className="volatile-note">Dans cette démonstration, le voicebot doit orienter vers le site, l’application, les écrans, la compagnie ou le personnel compétent. Aucune connexion en temps réel n’est revendiquée.</p>
          </div>
        </section>

        <section className="page-cta"><div className="shell"><div><h2>La bonne information, au bon niveau de certitude.</h2></div><div><VoicebotTrigger className="button button-white">Tester la conversation</VoicebotTrigger><Link className="text-link light-link" href="/architecture">Voir l’architecture <span>→</span></Link></div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
