"use client";

import { useId, useRef, type ReactNode } from "react";
import { CvRobot } from "@/components/cv-robot";

export function CvDialog({ englishHref, indonesianHref, className, children }: { englishHref?: string; indonesianHref?: string; className: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  return <>
    <button type="button" className={className} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>{children}</button>
    <dialog ref={dialog} className="cv-dialog" aria-labelledby={heading} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="cv-dialog-content">
        <CvRobot />
        <div className="cv-dialog-heading"><h2 id={heading}>Choose your CV language</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Close CV options" autoFocus>×</button></div>
        <p>Select a version to download.</p>
        <div className="cv-language-options">{[{ label: "English CV", tag: "EN", href: englishHref }, { label: "CV Bahasa Indonesia", tag: "ID", href: indonesianHref }].map(({ label, tag, href }) => {
          const content = <><span className="cv-language-tag">{tag}</span><span>{label}{!href && <small>Not available yet</small>}</span><span aria-hidden="true">↓</span></>;
          return href ? <a key={tag} href={href} onClick={() => dialog.current?.close()}>{content}</a> : <div key={tag} className="cv-language-unavailable" aria-disabled="true">{content}</div>;
        })}</div>
      </div>
    </dialog>
  </>;
}
