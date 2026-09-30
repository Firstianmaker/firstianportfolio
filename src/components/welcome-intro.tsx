"use client";

import { useEffect, useRef } from "react";

export function WelcomeIntro() {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try { if (sessionStorage.getItem("portfolio-intro-seen")) return; } catch { /* Storage can be unavailable in private browsing. */ }
    element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const restore = () => { document.body.style.overflow = previous; };
    const finish = () => { restore(); try { sessionStorage.setItem("portfolio-intro-seen", "1"); } catch { /* The intro still closes when storage is unavailable. */ } };
    element.addEventListener("close", finish);
    const timer = setTimeout(() => element.close(), 2200);
    return () => { clearTimeout(timer); element.removeEventListener("close", finish); restore(); };
  }, []);
  return <dialog ref={dialog} className="welcome-intro" aria-labelledby="welcome-title"><div className="intro-grid" aria-hidden="true" /><div className="intro-content"><span className="intro-brackets" aria-hidden="true">&lt; / &gt;</span><p className="eyebrow">A moment before we begin</p><h2 id="welcome-title">Hello<span>.</span><br /><span className="intro-second-line">Take a look around.</span></h2><div className="intro-line" aria-hidden="true" /><button autoFocus onClick={() => dialog.current?.close()}>Enter portfolio <span aria-hidden="true">↗</span></button></div></dialog>;
}
