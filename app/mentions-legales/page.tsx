import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions relatives au prototype indépendant Zaventem Voice par Banana Navy.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/mentions-legales/` }
    : undefined,
};

export default function LegalPage() {
  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader />
      <main id="contenu" className="legal-main">
        <section className="legal-hero"><div className="shell"><h1>Mentions légales</h1><p>Nature, auteur et limites de cette démonstration.</p></div></section>
        <section className="legal-content"><div className="shell legal-grid">
          <aside><p>Dernière mise à jour</p><b>19 novembre 2026</b><a href="#editeur">Éditeur</a><a href="#independance">Indépendance</a><a href="#contenus">Contenus</a><a href="#responsabilite">Responsabilité</a></aside>
          <article>
            <div className="legal-notice"><b>Prototype indépendant</b><p>Ce site n’est pas un site officiel de Brussels Airport, n’est pas exploité par Brussels Airport Company et ne prouve aucun partenariat avec celle-ci.</p></div>
            <h2 id="editeur">1. Éditeur du prototype</h2>
            <p>Le concept, l’interface et la démonstration sont présentés par Banana Navy, Engineering &amp; AI. Contact&nbsp;: Marc-Antoine Cajot, <a href="mailto:marc@banana-navy.com">marc@banana-navy.com</a>, <a href="tel:+32495277044">+32 495 27 70 44</a>. Adresse&nbsp;: Rue Antoine de Saint-Exupéry 2, 6041 Charleroi, Belgique.</p>
            <h2 id="independance">2. Absence d’affiliation</h2>
            <p>«&nbsp;Brussels Airport&nbsp;», les noms associés, les marques, les logos et les contenus du site de l’aéroport appartiennent à leurs titulaires respectifs. Leur mention sert uniquement à décrire le contexte du prototype. Aucun logo officiel n’est utilisé comme identité de ce site.</p>
            <h2 id="contenus">3. Sources et visuels</h2>
            <p>Les informations voyageurs sont des synthèses originales de pages publiques officielles, conservées dans la base documentaire du prototype avec leur provenance et leur date de vérification. Le visuel d’aile d’avion et l’iconographie ont été fournis pour cette présentation. Les droits restent à leurs titulaires. Toute réutilisation commerciale distincte de cette présentation doit respecter les autorisations applicables.</p>
            <h2 id="responsabilite">4. Limites de responsabilité</h2>
            <p>Cette démonstration ne doit pas être utilisée pour prendre une décision opérationnelle, médicale, de sûreté ou de voyage. Pour un vol, un horaire, une porte, un comptoir, un tapis, une urgence ou une règle récente, consultez les canaux officiels et les professionnels compétents.</p>
            <h2>5. Disponibilité</h2>
            <p>Le site et la conversation peuvent être modifiés, suspendus ou indisponibles. La présence d’un bouton de test ne constitue pas une promesse de service permanent.</p>
            <div className="legal-back"><Link className="button button-primary" href="/">Retour à l’accueil</Link><Link className="text-link" href="/confidentialite">Confidentialité</Link></div>
          </article>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
