"use client";

import { useEffect } from "react";

export function BananaScrollExperience() {
  useEffect(() => {
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-banana-scroll]")).map((root) => ({
      kind: root.dataset.bananaScroll,
      rows: Array.from(root.querySelectorAll<HTMLElement>("[data-banana-scroll-row]")),
      visuals: Array.from(root.querySelectorAll<HTMLElement>("[data-banana-scroll-visual]")),
    }));
    const desktop = window.matchMedia("(min-width: 821px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const update = () => {
      frame = 0;

      groups.forEach(({ kind, rows, visuals }) => {
        if (rows.length === 0) return;

        if (!desktop.matches) {
          rows.forEach((row) => row.classList.remove("is-active"));
          visuals.forEach((visual, index) => visual.classList.toggle("is-active", index === 0));

          if (kind === "services" || kind === "layers") {
            const start = window.innerHeight * 0.88;
            const end = window.innerHeight * 0.28;

            rows.forEach((row) => {
              const top = row.getBoundingClientRect().top;
              const progress = reducedMotion.matches
                ? Number(top < window.innerHeight * 0.55)
                : clamp((start - top) / (start - end));
              row.style.setProperty("--banana-fill", progress.toFixed(3));
            });
          }

          return;
        }

        rows.forEach((row) => row.style.removeProperty("--banana-fill"));

        const trigger = window.innerHeight * 0.55;
        let activeIndex = 0;

        rows.forEach((row, index) => {
          if (row.getBoundingClientRect().top < trigger) activeIndex = index;
        });

        const lastRow = rows.at(-1);
        if (lastRow && lastRow.getBoundingClientRect().bottom < window.innerHeight * 0.9) {
          activeIndex = rows.length - 1;
        }

        rows.forEach((row, index) => row.classList.toggle("is-active", index === activeIndex));
        visuals.forEach((visual, index) => visual.classList.toggle("is-active", index === activeIndex));
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    desktop.addEventListener("change", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      desktop.removeEventListener("change", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
    };
  }, []);

  return null;
}
