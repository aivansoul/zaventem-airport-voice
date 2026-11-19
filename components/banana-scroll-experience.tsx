"use client";

import { useEffect } from "react";

export function BananaScrollExperience() {
  useEffect(() => {
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-banana-scroll]"));
    const desktop = window.matchMedia("(min-width: 821px)");
    let frame = 0;

    const update = () => {
      frame = 0;

      groups.forEach((group) => {
        const rows = Array.from(group.querySelectorAll<HTMLElement>("[data-banana-scroll-row]"));
        const visuals = Array.from(group.querySelectorAll<HTMLElement>("[data-banana-scroll-visual]"));

        if (!desktop.matches || rows.length === 0) {
          group.style.removeProperty("--banana-scroll-drift");
          return;
        }

        const trigger = window.innerHeight * 0.55;
        let activeIndex = 0;

        rows.forEach((row, index) => {
          if (row.getBoundingClientRect().top <= trigger) activeIndex = index;
        });

        rows.forEach((row, index) => row.classList.toggle("is-active", index === activeIndex));
        visuals.forEach((visual, index) => visual.classList.toggle("is-active", index === activeIndex));

        const bounds = group.getBoundingClientRect();
        const distance = bounds.height + window.innerHeight;
        const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / distance));
        group.style.setProperty("--banana-scroll-drift", `${(progress - 0.5) * 24}px`);
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktop.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktop.removeEventListener("change", requestUpdate);
    };
  }, []);

  return null;
}
