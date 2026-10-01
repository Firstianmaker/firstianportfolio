"use client";

import { useRef, useState } from "react";

export function MusicButton({ src }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function toggle() {
    if (!src) { setMessage((value) => value ? "" : "No music yet. Stay tuned!"); return; }
    if (!audio.current) return;
    setMessage("");
    if (!audio.current.paused) { audio.current.pause(); return; }
    setPending(true);
    try { await audio.current.play(); }
    catch { setMessage("Music couldn't play. Please try again."); }
    finally { setPending(false); }
  }
  return <div className="navbar-music" onKeyDown={(event) => { if (event.key === "Escape") setMessage(""); }}>
    {src && <audio ref={audio} src={src} preload="none" loop onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setMessage("Music couldn't load. Please try again."); }} />}
    <button type="button" className="music-button" onClick={toggle} disabled={pending} aria-pressed={playing} aria-label={playing ? "Pause music" : "Play music"} title={playing ? "Pause music" : "Play music"}>
      {playing ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg> :
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18V5l11-2v13M9 9l11-2" /><ellipse cx="6" cy="18" rx="3" ry="3" /><ellipse cx="17" cy="16" rx="3" ry="3" /></svg>
      }
    </button>
    {message && <div className="music-bubble">
      <p role="status">{message}</p>
      <button type="button" onClick={() => setMessage("")} aria-label="Close music message">×</button>
    </div>}
  </div>;
}
