import type { Profile } from "@/types/portfolio";
import { safeExternalUrl } from "@/content/utils";

export function SocialIcon({ platform }: { platform: "GitHub" | "LinkedIn" | "Instagram" | "Email" | "Letterboxd" }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
    {platform === "GitHub" && <path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-2.7c3.3-.4 6.7-1.6 6.7-7.3A5.7 5.7 0 0 0 19 4a5.2 5.2 0 0 0-.1-4S17.6-.4 15 1.5a14 14 0 0 0-6 0C6.4-.4 5.1 0 5.1 0A5.2 5.2 0 0 0 5 4a5.7 5.7 0 0 0-1.7 4c0 5.7 3.4 6.9 6.7 7.3A3.5 3.5 0 0 0 9 18v4" transform="translate(1 2) scale(.9)" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />}
    {platform === "LinkedIn" && <><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.6" /><path d="M8 10v7m4 0v-7m0 3a3 3 0 0 1 6 0v4" stroke="currentColor" strokeWidth="1.6" /><circle cx="8" cy="7" r="1" fill="currentColor" /></>}
    {platform === "Email" && <><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="m3 6 9 7 9-7" stroke="currentColor" strokeWidth="1.6" /></>}
    {platform === "Letterboxd" && <><circle cx="5" cy="12" r="4.5" fill="#ff8000" /><circle cx="12" cy="12" r="4.5" fill="#00e054" /><circle cx="19" cy="12" r="4.5" fill="#40bcf4" /></>}
    {platform === "Instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>}
  </svg>;
}

export function SocialLinks({ profile, hero = false }: { profile: Profile; hero?: boolean }) {
  const socials: ["GitHub" | "LinkedIn" | "Instagram" | "Email" | "Letterboxd", string | undefined][] = [["GitHub", profile.githubUrl], ["LinkedIn", profile.linkedinUrl], ...(hero ? [["Email", profile.email] as ["Email", string]] : [["Instagram", profile.instagramUrl] as ["Instagram", string | undefined], ["Letterboxd", profile.letterboxdUrl] as ["Letterboxd", string | undefined]])];
  return <div className="social-links" aria-label="Social profiles">{socials.map(([platform, value]) => {
    const url = platform === "Email" ? `mailto:${value}` : safeExternalUrl(value);
    const className = `platform-button platform-${platform.toLowerCase()}`;
    return url ? <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className={className} aria-label={platform}><SocialIcon platform={platform} /><span>{platform}</span><span className="platform-arrow" aria-hidden="true">↗</span></a>
      : <span key={platform} className={`${className} is-unconfigured`} aria-disabled="true" aria-label={platform + ", link not added yet"}><SocialIcon platform={platform} /><span>{platform}<small>Not linked yet</small></span></span>;
  })}</div>;
}
