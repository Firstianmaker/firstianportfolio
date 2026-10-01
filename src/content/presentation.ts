import type { Profile, ProjectMedia } from "../types/portfolio";
import { presentation } from "../data/presentation";
import { safeExternalUrl } from "./utils";

export function displayProfile(profile: Profile): Profile {
  const merged = Object.fromEntries(Object.entries(profile).filter(([, value]) => value !== undefined && value !== null));
  const result = { ...presentation, ...merged } as Profile;
  return {
    ...result,
    roles: result.roles?.filter((role) => role.trim()) ?? presentation.roles,
    githubUrl: safeExternalUrl(result.githubUrl),
    linkedinUrl: safeExternalUrl(result.linkedinUrl),
    instagramUrl: safeExternalUrl(result.instagramUrl),
    cvUrl: safeExternalUrl(result.cvUrl),
  };
}

export function wholeYearsSince(value?: string, now = new Date()): number | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const date = new Date(value + "T00:00:00Z");
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || date > now) return undefined;
  const anniversaryPassed = now.getUTCMonth() > date.getUTCMonth() ||
    (now.getUTCMonth() === date.getUTCMonth() && now.getUTCDate() >= date.getUTCDate());
  return now.getUTCFullYear() - date.getUTCFullYear() - (anniversaryPassed ? 0 : 1);
}

export function formatBirthDate(value?: string): string | undefined {
  if (wholeYearsSince(value) === undefined) return undefined;
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z"));
}

export function cvHref(profile: Profile, language: "en" | "id" = "en"): string | undefined {
  if (language === "id") return profile.cvIndonesian ? "/cv?lang=id" : undefined;
  return safeExternalUrl(profile.cvUrl) || (profile.cv ? "/cv" : undefined);
}

export function uniqueImages(images: (ProjectMedia | undefined)[]): ProjectMedia[] {
  const seen = new Set<string>();
  return images.filter((image): image is ProjectMedia => {
    if (!image || seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}
