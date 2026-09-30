import type { Project } from '../types/portfolio';

export function safeExternalUrl(value?: string | null): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) ? url.href : undefined;
  } catch { return undefined; }
}

export function homepageProjects(projects: Project[]) {
  return projects.filter((project) => project.showOnHomepage).sort((a, b) =>
    Number(b.featured) - Number(a.featured) ||
    (a.featured && b.featured ? a.featuredOrder - b.featuredOrder : 0) ||
    a.displayOrder - b.displayOrder || a.title.localeCompare(b.title),
  );
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function whatsappUrl(number?: string | null, message?: string | null) {
  if (!number || !/^[+\d\s().-]+$/.test(number)) return undefined;
  let digits = number.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith('8')) digits = `62${digits}`;
  if (!/^[1-9]\d{7,14}$/.test(digits)) return undefined;
  const url = new URL(`https://wa.me/${digits}`);
  if (message?.trim()) url.searchParams.set('text', message.trim());
  return url.href;
}
export function cvDownloadUrl(file?: { url?: string; filename?: string } | null) {
  const safeUrl = safeExternalUrl(file?.url);
  if (!safeUrl) return undefined;
  const url = new URL(safeUrl);
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || !url.pathname.startsWith('/files/')) return undefined;
  url.searchParams.set('dl', file?.filename || 'CV.pdf');
  return url.href;
}
export function skillCards(skills: { _id: string; title: string; items: string[] }[], softSkills: string[]) {
  if (skills.some((group) => group.title.trim().toLowerCase() === 'soft skills') || !softSkills.length) return skills;
  return [...skills, { _id: 'profile-soft-skills', title: 'Soft Skills', items: softSkills }];
}
