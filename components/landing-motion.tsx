"use client";

import { useEffect } from "react";

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

export function LandingMotion() {
  useEffect(() => {
    const controller = new AbortController();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const titleNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-title]"));
    const fillNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-fill-row]"));
    const bentoNodes = Array.from(document.querySelectorAll<HTMLElement>("[data-bento]"));
    const revealTargets = new Map<Element, HTMLElement[]>();

    let revealObserver: IntersectionObserver | undefined;
    let frame = 0;

    if (reduceMotion.matches) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            (revealTargets.get(entry.target) ?? [entry.target as HTMLElement]).forEach((node) => {
              node.classList.add("is-visible");
            });
            revealObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.14 },
      );
      revealNodes.forEach((node) => {
        const target = node.classList.contains("banana-rise-line") && node.parentElement
          ? node.parentElement
          : node;
        const nodes = revealTargets.get(target) ?? [];
        nodes.push(node);
        revealTargets.set(target, nodes);
        revealObserver?.observe(target);
      });
    }

    const updateTitles = () => {
      frame = 0;
      const viewport = window.innerHeight;
      titleNodes.forEach((node) => {
        const bounds = node.classList.contains("banana-rise-line") && node.parentElement
          ? node.parentElement.getBoundingClientRect()
          : node.getBoundingClientRect();
        const progress = node.dataset.scrollTitle === "hero"
          ? clamp(0.12 + window.scrollY / (viewport * 0.72))
          : clamp((viewport * 0.88 - bounds.top) / (viewport * 0.58 + bounds.height));
        node.style.setProperty("--title-fill", `${(progress * 100).toFixed(2)}%`);
      });
      fillNodes.forEach((node) => {
        const bounds = node.getBoundingClientRect();
        const progress = reduceMotion.matches
          ? Number(bounds.top < viewport)
          : clamp((viewport * 0.9 - bounds.top) / (viewport * 0.62));
        node.style.setProperty("--scroll-fill", progress.toFixed(3));
      });
    };

    const requestTitleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateTitles);
    };

    updateTitles();
    window.addEventListener("scroll", requestTitleUpdate, {
      passive: true,
      signal: controller.signal,
    });
    window.addEventListener("resize", requestTitleUpdate, {
      passive: true,
      signal: controller.signal,
    });

    if (!reduceMotion.matches && finePointer.matches) {
      bentoNodes.forEach((node) => {
        const reset = () => {
          node.classList.remove("is-pointed");
          node.style.setProperty("--bento-rx", "0deg");
          node.style.setProperty("--bento-ry", "0deg");
          node.style.setProperty("--bento-x", "50%");
          node.style.setProperty("--bento-y", "50%");
          node.style.setProperty("--layer-x", "0px");
          node.style.setProperty("--layer-y", "0px");
        };

        const move = (event: PointerEvent) => {
          const bounds = node.getBoundingClientRect();
          const x = clamp((event.clientX - bounds.left) / bounds.width);
          const y = clamp((event.clientY - bounds.top) / bounds.height);
          node.classList.add("is-pointed");
          node.style.setProperty("--bento-rx", `${(0.5 - y) * 7}deg`);
          node.style.setProperty("--bento-ry", `${(x - 0.5) * 7}deg`);
          node.style.setProperty("--bento-x", `${x * 100}%`);
          node.style.setProperty("--bento-y", `${y * 100}%`);
          node.style.setProperty("--layer-x", `${(x - 0.5) * 12}px`);
          node.style.setProperty("--layer-y", `${(y - 0.5) * 12}px`);
        };

        const out = (event: PointerEvent) => {
          const nextTarget = event.relatedTarget;
          if (nextTarget instanceof Node && node.contains(nextTarget)) return;
          reset();
        };

        node.addEventListener("pointermove", move, { signal: controller.signal });
        node.addEventListener("pointerleave", reset, { signal: controller.signal });
        node.addEventListener("pointerout", out, { signal: controller.signal });
      });
    }

    return () => {
      controller.abort();
      revealObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
