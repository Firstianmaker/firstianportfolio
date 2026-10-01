import { CvDialog } from "@/components/cv-dialog";
import type { Profile } from "@/types/portfolio";
import { whatsappUrl } from "@/content/utils";
import { cvHref } from "@/content/presentation";

export function WhatsAppIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5"><path d="M20.5 3.5A11.9 11.9 0 0 0 1.8 17.8L.2 23.7l6-1.6A11.9 11.9 0 0 0 24 11.9c0-3.2-1.2-6.2-3.5-8.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.6 1 1-3.5-.3-.4A9.9 9.9 0 1 1 12 21.8Zm5.4-7.4c-.3-.2-1.8-.9-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.6-3.8-3.3-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.6l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.2.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.8.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.3-.6-.4Z" /></svg>;
}

export function WhatsAppLink({ profile, className = "" }: { profile: Profile; className?: string }) {
  const href = whatsappUrl(profile.whatsappNumber, profile.whatsappMessage);
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className={`platform-button whatsapp-button ${className}`}><WhatsAppIcon /><span>WhatsApp</span><span className="platform-arrow" aria-hidden="true">↗</span></a> : null;
}

export function CvLink({ profile, showUnavailable = false }: { profile: Profile; showUnavailable?: boolean }) {
  const href = cvHref(profile);
  const content = <><span className="cv-document" aria-hidden="true"><svg viewBox="0 0 24 28" fill="none"><path d="M5 1h9l5 5v20H5zM14 1v6h5M8 12h8M8 16h6" stroke="currentColor" strokeWidth="1.5" /></svg></span><span><strong>Download CV</strong></span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="cv-download"><path d="M10 2v10m-4-4 4 4 4-4M3 14v3h14v-3" stroke="currentColor" strokeWidth="1.5" /></svg></>;
  const indonesianHref = cvHref(profile, "id");
  return href || indonesianHref || showUnavailable ? <CvDialog englishHref={href} indonesianHref={indonesianHref} className="cv-button">{content}</CvDialog> : null;
}

export function ProfileActions({ profile }: { profile: Profile }) {
  return <><CvLink profile={profile} /><WhatsAppLink profile={profile} /></>;
}
