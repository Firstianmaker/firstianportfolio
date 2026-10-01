"use client";

import { useEffect, useRef, useState } from "react";

const label = "Developer portfolio";
const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#<>";

export function HeroLabel() {
  const [text, setText] = useState(label);
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => () => clearInterval(timer.current), []);

  function replay() {
    clearInterval(timer.current);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    setActive(true);
    setText(label);
    timer.current = setInterval(() => {
      frame += 1;
      if (frame >= label.length || preference.matches) {
        clearInterval(timer.current);
        setText(label);
        setActive(false);
        return;
      }
      setText(Array.from(label, (letter, index) => letter === " " || index < frame ? letter : glyphs[Math.floor(Math.random() * glyphs.length)]).join(""));
    }, preference.matches ? 500 : 35);
  }

  return <button type="button" className="eyebrow hero-label" data-active={active} onClick={replay} aria-label="Developer portfolio — play text effect">
    <span className="hero-label-size" aria-hidden="true">{label}</span>
    <span className="hero-label-text" aria-hidden="true">{text}</span>
  </button>;
}
