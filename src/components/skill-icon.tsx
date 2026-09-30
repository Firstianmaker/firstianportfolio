import Image from "next/image";
import { skillIcons } from "@/data/technical-stack";

export function SkillIcon({ name }: { name: string }) {
  const icon = skillIcons[name];
  if (icon) return <Image src={`/images/skills/${icon}.svg`} width={40} height={40} alt="" className="skill-icon" />;
  return <span className="skill-symbol" aria-hidden="true">{name === "SQL" ? <svg viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></svg> : name === "Transfer Learning" ? <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="7" height="10" rx="2" /><rect x="15" y="7" width="7" height="10" rx="2" /><path d="M9 12h6m-3-3 3 3-3 3" /></svg> : name.slice(0, 2)}</span>;
}
