"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { VoicebotTrigger } from "@/components/voicebot-modal";

type SiteHeaderProps = { active?: "home" | "architecture" | "sources" };

export function SiteHeader({ active }: SiteHeaderProps) {
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
        <Link className="site-wordmark" href="/" aria-label="Zaventem Voice, accueil">
          <span className="wordmark-signal" aria-hidden="true"><i /><i /><i /></span>
          <span><b>Zaventem Voice</b><small>BY BANANA NAVY</small></span>
        </Link>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav id="site-navigation" className={open ? "is-open" : ""} aria-label="Navigation principale">
          {active === "home" ? (
            <>
              <Link className="active" href="/#usages" onClick={() => setOpen(false)}>Présentation</Link>
              <Link href="/architecture" onClick={() => setOpen(false)}>Architecture</Link>
              <Link href="/sources" onClick={() => setOpen(false)}>Sources</Link>
              <VoicebotTrigger onClick={() => setOpen(false)}>FR · NL · EN</VoicebotTrigger>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setOpen(false)}>Concept</Link>
              <Link href="/#usages" onClick={() => setOpen(false)}>Usages</Link>
              <Link className={active === "architecture" ? "active" : ""} href="/architecture" onClick={() => setOpen(false)}>Architecture</Link>
              <Link className={active === "sources" ? "active" : ""} href="/sources" onClick={() => setOpen(false)}>Sources</Link>
              <Link href="/#strike-it" onClick={() => setOpen(false)}>STRIKE IT</Link>
              <VoicebotTrigger className="nav-cta" onClick={() => setOpen(false)}>DÉMO LIVE <span>↗</span></VoicebotTrigger>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
