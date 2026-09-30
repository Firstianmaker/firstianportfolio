"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/container";

const nav = [["About", "/#about"], ["Projects", "/#projects"], ["Experience", "/#experience"], ["Volunteer", "/#volunteer"], ["Tech Stack", "/#skills"], ["Contact", "/#contact"]] as const;

export function Header({ name, initials, cvLink }: { name: string; initials: string; cvLink?: string }) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); menuButton.current?.focus(); }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnDesktop);
    return () => { document.removeEventListener("keydown", closeOnEscape); document.removeEventListener("pointerdown", closeOutside); desktop.removeEventListener("change", closeOnDesktop); };
  }, [open]);
  return <header ref={header} className="site-header">
    <Container className="header-inner"><Link href="/" className="brand" aria-label={`${name}, home`} onClick={() => setOpen(false)}><span className="brand-initials">{initials}<span aria-hidden="true">/</span></span><span className="brand-name">{name}</span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{nav.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>
      <div className="header-actions">{cvLink && <a href={cvLink} className="header-cv">Download CV</a>}<button ref={menuButton} className="menu-button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span aria-hidden="true">{open ? "−" : "+"}</span></button></div>
    </Container>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
  </header>;
}
