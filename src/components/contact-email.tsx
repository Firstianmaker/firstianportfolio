"use client";

import { useState } from "react";

export function ContactEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(email); setStatus("Email copied"); }
    catch { setStatus("Could not copy. Use the email link to get in touch."); }
  }
  return <div className="email-actions"><a href={`mailto:${email}`} className="email-link"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg><span>{email}</span><span aria-hidden="true">↗</span></a><button onClick={copy} className="copy-email" aria-label="Copy email address"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V3H3v13h5" /></svg></button><span className="email-status" role="status">{status}</span></div>;
}
