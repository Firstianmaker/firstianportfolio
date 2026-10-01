"use client";

import { useEffect, useRef } from "react";

export function WalkingCat() {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => { for (const entry of entries) entry.target.classList.toggle("cat-active", entry.isIntersecting); });
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={track} className="cat-track" aria-hidden="true"><div className="cat-walker"><svg viewBox="0 0 48 32" className="pixel-cat" shapeRendering="crispEdges"><g fill="#aebdce"><path className="cat-tail" d="M12 17H6V9H3v11h9z" /><path d="M12 15h19v11H12zM29 8h14v15H29zM29 4h4v8h-4zM39 4h4v8h-4z" /><path className="cat-leg-a" d="M13 24h4v6h-4zM30 23h4v7h-4z" /><path className="cat-leg-b" d="M21 24h4v6h-4zM37 22h4v8h-4z" /></g><path fill="#d6e0ea" d="M32 17h11v6H32zM17 17h9v5h-9z" /><path fill="#efacba" d="M30 6h2v4h-2zM40 6h2v4h-2zM41 18h3v2h-3z" /><path fill="#172534" d="M38 12h2v3h-2z" /><path fill="#00c8d9" d="M29 22h13v2H29z" /></svg></div><span className="cat-ground" /></div>;
}
