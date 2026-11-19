import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VoicebotTrigger } from "@/components/voicebot-modal";

export const metadata: Metadata = {
  title: "Confidentialité",
  description: "Informations de confidentialité relatives à la démonstration vocale Banana Navy.",
  alternates: process.env.NEXT_PUBLIC_SITE_URL
    ? { canonical: `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}/confidentialite/` }
    : undefined,
};

export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <div className="prototype-ribbon"><div className="shell"><span>Concept indépendant par Banana Navy</span><span aria-hidden="true">•</span><span>Prototype non officiel</span></div></div>
      <SiteHeader />
      <main id="contenu" className="legal-main">
        <section className="legal-hero"><div className="shell"><h1>Confidentialité</h1><p>Des règles simples pour tester la voix sans partager plus que nécessaire.</p></div></section>
        <section className="legal-content"><div className="shell legal-grid">
          <aside><p>Dernière mise à jour</p><b>19 novembre 2026</b><a href="#microphone">Microphone</a><a href="#donnees">Données</a><a href="#conservation">Conservation</a><a href="#droits">Vos choix</a></aside>
          <article>
            <div className="legal-notice"><b>À retenir</b><p>Ce site présente un prototype indépendant. Ne donnez ni numéro de réservation, ni document d’identité, ni information médicale, financière ou confidentielle pendant l’essai.</p></div>
            <h2 id="microphone">1. Accès au microphone</h2>
            <p>La démonstration demande votre accord avant de lancer une conversation. Votre navigateur affiche également sa propre demande d’autorisation. Vous pouvez refuser, couper le micro ou terminer l’échange à tout moment.</p>
            <h2 id="donnees">2. Données traitées pendant un essai</h2>
            <p>Pour produire et contrôler une réponse vocale, le service conversationnel peut traiter votre audio, sa transcription, les réponses générées et des informations techniques élémentaires liées à la session. N’utilisez la démonstration qu’avec des questions générales.</p>
            <h2 id="conservation">3. Enregistrement et conservation</h2>
            <p>Pour cette démonstration, l’enregistrement vocal est activé et la durée de rétention de la conversation est configurée à 30 jours. La transcription et les données personnelles détectées sont marquées pour suppression par la configuration. L’audio n’est pas supprimé immédiatement à la fin de l’appel.</p>
            <p>Ces paramètres concernent le prototype Banana Navy. Ils ne décrivent pas un service aéroportuaire déployé et pourront être modifiés avant une éventuelle mise en production.</p>
            <h2 id="droits">4. Vos choix</h2>
            <p>Vous pouvez ne pas démarrer la conversation, retirer l’autorisation du microphone dans votre navigateur ou interrompre la session. Pour une demande d’accès ou de suppression liée à ce prototype, contactez Banana Navy à <a href="mailto:marc@banana-navy.com">marc@banana-navy.com</a>.</p>
            <h2>5. Services tiers</h2>
            <p>Le moteur vocal repose sur ElevenLabs. Son utilisation est soumise aux paramètres techniques activés pour l’agent de démonstration et aux politiques du fournisseur. Aucun système opérationnel de Brussels Airport n’est présenté comme connecté à ce prototype.</p>
            <div className="legal-back"><VoicebotTrigger className="button button-primary">Retour à la démonstration</VoicebotTrigger><Link className="text-link" href="/mentions-legales">Mentions légales <span>→</span></Link></div>
          </article>
        </div></section>
      </main>
      <SiteFooter />
    </>
  );
}
