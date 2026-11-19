"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { VoicebotTrigger } from "@/components/voicebot-modal";

export type SiteLanguage = "en" | "nl" | "fr";

type SiteHeaderProps = {
  active?: "home" | "banana-navy";
  language?: SiteLanguage;
  onLanguageChange?: (language: SiteLanguage) => void;
  homeLabels?: {
    presentation: string;
    bananaNavy: string;
    navigation: string;
    home: string;
    openMenu: string;
    closeMenu: string;
    language: string;
  };
};

export function SiteHeader({ active, language = "fr", onLanguageChange, homeLabels }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`site-header ${active === "home" ? "site-header-home" : ""}`.trim()}>
      <div className="shell header-inner">
        <Link className="site-wordmark" href="/" aria-label={homeLabels?.home ?? "Zaventem Voice, accueil"}>
          <span className="wordmark-signal" aria-hidden="true"><i /><i /><i /></span>
          <span><b>Zaventem Voice</b><small>BY BANANA NAVY</small></span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={open ? (homeLabels?.closeMenu ?? "Fermer le menu") : (homeLabels?.openMenu ?? "Ouvrir le menu")}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav id="site-navigation" className={open ? "is-open" : ""} aria-label={homeLabels?.navigation ?? "Navigation principale"}>
          {active === "home" ? (
            <>
              <Link className="active" href="/#usages" onClick={() => setOpen(false)}>{homeLabels?.presentation ?? "Présentation"}</Link>
              <Link href="/banana-navy" onClick={() => setOpen(false)}>{homeLabels?.bananaNavy ?? "Banana Navy"}</Link>
              <div className="site-language-switch" role="group" aria-label={homeLabels?.language ?? "Langue de la page"}>
                {(["en", "nl", "fr"] as SiteLanguage[]).map((locale) => (
                  <button
                    type="button"
                    aria-pressed={language === locale}
                    onClick={() => onLanguageChange?.(locale)}
                    key={locale}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setOpen(false)}>Concept</Link>
              <Link href="/#usages" onClick={() => setOpen(false)}>Usages</Link>
              <Link className={active === "banana-navy" ? "active" : ""} href="/banana-navy" onClick={() => setOpen(false)}>Banana Navy</Link>
              <Link href="/#strike-it" onClick={() => setOpen(false)}>STRIKE IT</Link>
              <VoicebotTrigger className="nav-cta" onClick={() => setOpen(false)}>DÉMO LIVE <span>↗</span></VoicebotTrigger>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
