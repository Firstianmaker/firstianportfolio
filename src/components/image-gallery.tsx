"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { ProjectMedia } from "@/types/portfolio";

export function ImageGallery({ images, title, previewCount, className = "" }: { images: ProjectMedia[]; title: string; previewCount?: number; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const labelId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const active = selected !== null ? images[selected] : undefined;
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  if (!images.length) return null;
  const changeImage = (direction: number) => {
    setSelected((current) => ((current ?? 0) + direction + images.length) % images.length);
    setZoom(1);
    stage.current?.scrollTo({ top: 0, left: 0 });
  };
  const close = () => { dialog.current?.close(); setSelected(null); setZoom(1); };
  return <>
    <div className={`image-gallery ${className}`}>{images.slice(0, previewCount ?? images.length).map((media, index) => <figure key={media.src}>
      <button className="gallery-trigger" aria-label={`Open image: ${media.alt}`} onClick={() => { setSelected(index); setZoom(1); dialog.current?.showModal(); }}>
        <Image src={media.src} alt={media.alt} width={media.width} height={media.height} sizes="(min-width: 1024px) 600px, (min-width: 640px) 45vw, 90vw" placeholder={media.blurDataURL ? "blur" : "empty"} blurDataURL={media.blurDataURL} />
        <span className="image-zoom-label">View image <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden="true"><path d="M7 3H3v4m10-4h4v4M3 13v4h4m10-4v4h-4" stroke="currentColor" strokeWidth="1.5" /></svg></span>
      </button>{media.caption && <figcaption className="media-caption">{media.caption}</figcaption>}
    </figure>)}</div>
    <dialog ref={dialog} className="lightbox" aria-labelledby={labelId} onCancel={close} onClose={() => { setSelected(null); setZoom(1); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} onKeyDown={(event) => {
      if (event.target === stage.current || images.length < 2) return;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); changeImage(event.key === "ArrowRight" ? 1 : -1); }
    }}>
      <div className="lightbox-panel"><div className="lightbox-header"><h2 id={labelId}>{title}</h2><button onClick={close} className="lightbox-control" aria-label="Close image viewer" autoFocus>Close ×</button></div>
        <div className="lightbox-toolbar"><div className="zoom-controls"><button className="lightbox-control" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - .5))} aria-label="Zoom out">−</button><output aria-live="polite">{Math.round(zoom * 100)}%</output><button className="lightbox-control" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + .5))} aria-label="Zoom in">+</button><button className="lightbox-control" onClick={() => { setZoom(1); stage.current?.scrollTo({ top: 0, left: 0 }); }}>Reset</button></div>{images.length > 1 && <div className="gallery-controls"><button className="lightbox-control" onClick={() => changeImage(-1)} aria-label="Previous image">←</button><span aria-live="polite">{(selected ?? 0) + 1} / {images.length}</span><button className="lightbox-control" onClick={() => changeImage(1)} aria-label="Next image">→</button></div>}</div>
        <div ref={stage} className="lightbox-stage" tabIndex={0} role="region" aria-label="Image viewport. When zoomed, scroll to pan the image."><div className="lightbox-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>{active && <Image key={active.src} src={active.src} alt={active.alt} width={active.width} height={active.height} sizes="100vw" className="lightbox-image" />}</div></div>
        <p className="lightbox-caption">{active?.caption || active?.alt}</p>
      </div>
    </dialog>
  </>;
}
