"use client";

import { useEffect, useRef } from "react";

export function WelcomeIntro() {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (sessionStorage.getItem("portfolio-intro-v3-seen")) return; } catch { /* Storage can be unavailable in private browsing. */ }
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restore = () => { document.body.style.overflow = previous; };
    const finish = () => { restore(); try { sessionStorage.setItem("portfolio-intro-v3-seen", "1"); } catch { /* The intro still closes when storage is unavailable. */ } };
    element.addEventListener("close", finish);
    const timer = setTimeout(() => element.close(), 4000);
    return () => { clearTimeout(timer); element.removeEventListener("close", finish); restore(); };
  }, []);
  return <dialog ref={dialog} className="welcome-intro loading-intro" aria-label="Opening portfolio"><div className="loading-intro-content"><blockquote><p>“AI is here to be tamed, not feared.”</p><footer>— Faiz</footer></blockquote><span className="intro-spinner" aria-hidden="true" /></div></dialog>;
}
