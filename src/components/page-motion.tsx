"use client";

import { useEffect } from "react";

export function PageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (!preference.matches) {
          const animation = entry.target.animate([{ opacity: .4, transform: "translateY(18px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 500, easing: "ease-out" });
          animations.add(animation);
          animation.onfinish = () => animations.delete(animation);
        }
        observer.unobserve(entry.target);
      }
    }, { threshold: .1 });
    document.querySelectorAll(".section-topline, .project-tile, .skill-group, .work-experience-card").forEach((element) => observer.observe(element));
    const stopMotion = () => { if (preference.matches) animations.forEach((animation) => animation.cancel()); };
    preference.addEventListener("change", stopMotion);
    const cards = document.querySelectorAll<HTMLElement>(".project-tile, .skill-group");
    const spotlight = (event: PointerEvent) => {
      if (preference.matches || event.pointerType !== "mouse") return;
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
    };
    cards.forEach((card) => card.addEventListener("pointermove", spotlight));
    return () => { observer.disconnect(); cards.forEach((card) => card.removeEventListener("pointermove", spotlight)); animations.forEach((animation) => animation.cancel()); preference.removeEventListener("change", stopMotion); };
  }, []);
  return <div className="reading-progress" aria-hidden="true" />;
}
