import Link from "next/link";
import type { SiteLanguage } from "@/components/site-header";

const footerCopy = {
  en: {
    brand: "We design secure voice agents and reliable agentic systems, integrated into operations and maintained over time.",
    commitments: "COMMITMENTS",
    points: ["English · Nederlands · Français", "Structured and dated sources", "Live data kept explicitly separate", "Human handoff built in by design"],
    explore: "EXPLORE",
    privacy: "Privacy",
    legal: "Legal notice",
    strike: "BANANA NAVY VOICE BOT PROJECT",
    strikeNote: "Selection for Belgian Defence’s STRIKE IT 2026 programme and support from the Cyber Defence Factory / Cyber Command apply only to the Banana Navy project. This context is separate from the Brussels Airport concept presented here.",
  },
  nl: {
    brand: "We ontwerpen veilige voice agents en betrouwbare agentic systems, geïntegreerd in de bedrijfsvoering en duurzaam onderhouden.",
    commitments: "WAARBORGEN",
    points: ["Nederlands · Français · English", "Gestructureerde bronnen met duidelijke datum", "Live data expliciet gescheiden", "Menselijke overname standaard voorzien"],
    explore: "VERKENNEN",
    privacy: "Privacy",
    legal: "Juridische informatie",
    strike: "BANANA NAVY VOICE BOT-PROJECT",
    strikeNote: "De selectie voor het STRIKE IT 2026-programma van Belgian Defence en de steun van de Cyber Defence Factory / Cyber Command gelden uitsluitend voor het Banana Navy-project. Deze context staat los van het Brussels Airport-concept dat hier wordt voorgesteld.",
  },
  fr: {
    brand: "Nous concevons des agents vocaux sécurisés et des systèmes agentiques fiables, intégrés aux opérations et maintenus dans le temps.",
    commitments: "ENGAGEMENTS",
    points: ["Français · Nederlands · English", "Sources structurées et datées", "Données live explicitement séparées", "Relais humain prévu par conception"],
    explore: "EXPLORER",
    privacy: "Confidentialité",
    legal: "Mentions légales",
    strike: "PROJET VOICE BOT BANANA NAVY",
    strikeNote: "La sélection au programme Belgian Defence STRIKE IT 2026 et le soutien de la Cyber Defence Factory / Cyber Command concernent uniquement le projet Banana Navy. Ce contexte est distinct du concept Brussels Airport présenté ici.",
  },
} as const;

export function SiteFooter({ language = "fr" }: { language?: SiteLanguage }) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const copy = footerCopy[language];

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand-block">
          <img src={`${basePath}/brand/banana-navy-logo.png`} alt="Banana Navy" width="400" height="238" loading="lazy" />
          <div>
            <h2>VOICE AGENTS<br />&amp; AGENTIC SYSTEMS</h2>
            <p>{copy.brand}</p>
          </div>
        </div>
        <div className="footer-commitments">
          <p className="footer-label">{copy.commitments}</p>
          <ul className="footer-points">
            {copy.points.map((point, index) => <li key={point}><span>0{index + 1}</span>{point}</li>)}
          </ul>
        </div>
        <div className="footer-links">
          <p className="footer-label">{copy.explore}</p>
          <Link href="/banana-navy">Banana Navy</Link>
          <Link href="/confidentialite">{copy.privacy}</Link>
          <Link href="/mentions-legales">{copy.legal}</Link>
          <a href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">banana-navy.ai ↗</a>
        </div>
        <div className="footer-contact">
          <p className="footer-label">LET&apos;S TALK</p>
          <strong>Marc-Antoine</strong>
          <a href="tel:+32495277044">+32 495 27 70 44</a>
          <a href="mailto:marc@banana-navy.com">marc@banana-navy.com</a>
        </div>
      </div>
      <div className="shell footer-strike">
        <div className="footer-strike-title"><span>STRIKE IT 2026 · BELGIAN DEFENCE</span><strong>{copy.strike}</strong></div>
        <div className="footer-strike-logos" role="group" aria-label="STRIKE IT 2026, Belgian Defence, RHID and Belgian Cyber Force">
          <span><img src={`${basePath}/brand/badge-defence.png`} alt="Belgian Defence" width="220" height="142" loading="lazy" /></span>
          <span><img src={`${basePath}/brand/badge-crest-royal.png`} alt="RHID" width="112" height="200" loading="lazy" /></span>
          <span><img src={`${basePath}/brand/badge-strike-it.png`} alt="STRIKE IT" width="823" height="531" loading="lazy" /></span>
          <span><img src={`${basePath}/brand/badge-cyberforce.png`} alt="Belgian Cyber Force" width="157" height="200" loading="lazy" /></span>
        </div>
        <p>{copy.strikeNote}</p>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Banana Navy</span>
      </div>
    </footer>
  );
}
