"use client";

import { useEffect, useState } from "react";

export function RoleRotator({ roles }: { roles: string[] }) {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!roles.length) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    let index = 0;
    let count = 0;
    let deleting = false;
    const type = () => {
      if (preference.matches) return;
      const role = roles[index];
      count += deleting ? -1 : 1;
      setText(role.slice(0, count));
      let delay = deleting ? 35 : 75;
      if (count === role.length) { deleting = true; delay = 1800; }
      else if (count === 0) { deleting = false; index = (index + 1) % roles.length; delay = 300; }
      timer = setTimeout(type, delay);
    };
    const sync = () => { clearTimeout(timer); if (!preference.matches) timer = setTimeout(type, 150); };
    sync();
    preference.addEventListener("change", sync);
    return () => { clearTimeout(timer); preference.removeEventListener("change", sync); };
  }, [roles]);
  if (!roles.length) return null;
  return <div className="role-rotator">
    <span className="sr-only">{roles.join(", ")}</span>
    <div className="role-window" aria-hidden="true"><span className="typed-role">{text}<span className="typing-caret" /></span><span className="static-role">{roles[0]}</span></div>
  </div>;
}
