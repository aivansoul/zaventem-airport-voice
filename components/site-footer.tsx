import Link from "next/link";

export function SiteFooter() {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand-block">
          <img src={`${basePath}/brand/banana-navy-logo.png`} alt="Banana Navy" width="400" height="238" loading="lazy" />
          <div>
            <h2>VOICE AGENTS<br />&amp; AGENTIC SYSTEMS</h2>
            <p>Nous concevons des agents vocaux sécurisés et des systèmes agentiques fiables, intégrés aux opérations et maintenus dans le temps.</p>
          </div>
        </div>
        <div className="footer-commitments">
          <p className="footer-label">ENGAGEMENTS</p>
          <ul className="footer-points">
            <li><span>01</span> Français · Nederlands · English</li>
            <li><span>02</span> Sources structurées et datées</li>
            <li><span>03</span> Données live explicitement séparées</li>
            <li><span>04</span> Relais humain prévu par conception</li>
          </ul>
        </div>
        <div className="footer-links">
          <p className="footer-label">EXPLORER</p>
          <Link href="/architecture">Architecture</Link>
          <Link href="/sources">Sources</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
          <a href="https://banana-navy.ai/fr/" target="_blank" rel="noreferrer">banana-navy.ai ↗</a>
        </div>
      </div>
      <div className="shell footer-strike">
        <div><span>STRIKE IT 2026</span><strong>PROJET VOICE BOT BANANA NAVY</strong></div>
        <p>La sélection au programme Belgian Defence STRIKE IT 2026 et le soutien de la Cyber Defence Factory / Cyber Command concernent uniquement le projet Banana Navy. Ce contexte est distinct du concept Brussels Airport présenté ici.</p>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Banana Navy</span>
        <span>Concept indépendant · Non affilié à Brussels Airport Company</span>
      </div>
    </footer>
  );
}
