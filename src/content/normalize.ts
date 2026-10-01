import type { Activity, Certification, Experience, Portfolio, Profile, Project, SkillGroup } from '../types/portfolio';
import { toProjectMedia, type SanityImage } from '../sanity/image';
import { cvDownloadUrl, safeExternalUrl } from './utils';
import { profileDefaults } from './profile-defaults';

export type RawProject = Partial<Omit<Project, 'coverImage' | 'gallery'>> & {
  coverImage?: SanityImage | null;
  gallery?: SanityImage[] | null;
};
type RawMedia<T> = Partial<Omit<T, 'coverImage' | 'image' | 'gallery'>> & {
  coverImage?: SanityImage | null; image?: SanityImage | null; gallery?: SanityImage[] | null;
};
export type RawPortfolio = Partial<Omit<Portfolio, 'profile' | 'projects' | 'community' | 'experiences' | 'certifications' | 'skills'>> & {
  profile?: (Omit<Profile, 'heroPhoto' | 'aboutPhoto' | 'volunteerImages'> & Partial<Pick<Portfolio, 'heroMetrics' | 'softSkills' | 'languages'>> & { heroPhoto?: SanityImage | null; aboutPhoto?: SanityImage | null; volunteerImages?: SanityImage[] | null }) | null;
  skills?: (Omit<SkillGroup, 'image'> & { image?: SanityImage | null })[] | null;
  projects?: RawProject[] | null;
  community?: RawMedia<Activity>[] | null;
  experiences?: (Omit<Experience, 'image' | 'gallery'> & RawMedia<Experience>)[] | null;
  certifications?: (Omit<Certification, 'image'> & RawMedia<Certification>)[] | null;
};

type ImageConfig = { projectId: string; dataset: string };
function gallery(images: SanityImage[] | null | undefined, config: ImageConfig) {
  return (images ?? []).flatMap((image) => { const media = toProjectMedia(image, config); return media ? [media] : []; });
}

export function normalizeActivity(raw: RawMedia<Activity>, config: ImageConfig): Activity {
  return {
    _id: raw._id ?? '', title: raw.title ?? '', slug: raw.slug || raw._id || '',
    role: raw.role ?? '', period: raw.period ?? '', date: raw.date || undefined,
    summary: raw.summary ?? '', description: raw.description ?? '', content: raw.content ?? [],
    organization: raw.organization ?? '', location: raw.location ?? '',
    coverImage: toProjectMedia(raw.coverImage, config), gallery: gallery(raw.gallery, config),
    highlights: raw.highlights ?? [], metrics: raw.metrics ?? [],
    externalUrl: safeExternalUrl(raw.externalUrl), displayOrder: raw.displayOrder ?? 100,
  };
}

export function normalizeProject(raw: RawProject, config: { projectId: string; dataset: string }): Project {
  return {
    slug: raw.slug ?? '', title: raw.title ?? '', shortTitle: raw.shortTitle || raw.title || '',
    period: raw.period ?? '', projectDate: raw.projectDate, category: raw.category ?? '',
    summary: raw.summary ?? '', description: raw.description ?? '', content: raw.content ?? [],
    stack: raw.stack ?? [], metrics: raw.metrics ?? [], highlights: raw.highlights ?? [],
    challenge: raw.challenge ?? '', approach: raw.approach ?? '', outcome: raw.outcome ?? '',
    sections: raw.sections ?? [],
    coverImage: toProjectMedia(raw.coverImage, config),
    gallery: (raw.gallery ?? []).flatMap((image) => {
      const media = toProjectMedia(image, config);
      return media ? [media] : [];
    }),
    galleryDescription: raw.galleryDescription ?? '',
    featured: raw.featured ?? false, displayOrder: raw.displayOrder ?? 100,
    featuredOrder: raw.featuredOrder ?? 100, showOnHomepage: raw.showOnHomepage ?? true,
    githubUrl: safeExternalUrl(raw.githubUrl), demoUrl: safeExternalUrl(raw.demoUrl),
  };
}

export function normalizePortfolio(raw: RawPortfolio, config: { projectId: string; dataset: string }): Portfolio {
  if (!raw.profile) throw new Error('Sanity is connected, but the published Profile document is missing. Run npm run sanity:seed or publish Profile & About in /studio.');
  const { heroMetrics = [], softSkills = [], languages = [], ...profile } = raw.profile;
  return {
    profile: {
      ...profile,
      heroPhoto: toProjectMedia(profile.heroPhoto, config), aboutPhoto: toProjectMedia(profile.aboutPhoto, config),
      whatsappNumber: profile.whatsappNumber ?? profileDefaults.whatsappNumber,
      whatsappMessage: profile.whatsappMessage ?? profileDefaults.whatsappMessage,
      pddiktiUrl: safeExternalUrl(profile.pddiktiUrl ?? profileDefaults.pddiktiUrl),
      linkedinUrl: safeExternalUrl(profile.linkedinUrl), githubUrl: safeExternalUrl(profile.githubUrl),
      letterboxdUrl: safeExternalUrl(profile.letterboxdUrl), instagramUrl: safeExternalUrl(profile.instagramUrl), cvUrl: safeExternalUrl(profile.cvUrl),
      musicUrl: safeExternalUrl(profile.musicUrl),
      technicalGroups: profile.technicalGroups?.map((group) => ({ title: group.title ?? '', items: group.items ?? [] })),
      roles: profile.roles ?? undefined, aboutShort: profile.aboutShort ?? undefined,
      birthPlace: profile.birthPlace ?? undefined, birthDate: profile.birthDate ?? undefined,
      heightCm: profile.heightCm ?? undefined, itExperienceStartDate: profile.itExperienceStartDate ?? undefined,
      volunteerImages: profile.volunteerImages ? gallery(profile.volunteerImages, config) : undefined,
      cv: cvDownloadUrl(profile.cv) ? profile.cv : undefined,
    }, heroMetrics: heroMetrics ?? [], softSkills: softSkills ?? [], languages: languages ?? [],
    projects: (raw.projects ?? []).filter((p) => p.slug && p.title).map((p) => normalizeProject(p, config)),
    experiences: (raw.experiences ?? []).map((x) => ({ ...x, bullets: x.bullets ?? [], stack: x.stack ?? [], image: toProjectMedia(x.image, config), gallery: gallery(x.gallery, config) })),
    educations: (raw.educations ?? []).map((x) => ({ ...x, coursework: x.coursework ?? [], pddiktiUrl: safeExternalUrl(x.pddiktiUrl) })),
    publications: raw.publications ?? [],
    skills: (raw.skills ?? []).map((x) => ({ ...x, items: x.items ?? [], description: x.description ?? undefined, image: toProjectMedia(x.image, config) })),
    community: (raw.community ?? []).filter((x) => x._id && x.title).map((x) => normalizeActivity(x, config)),
    certifications: (raw.certifications ?? []).map((x) => ({ ...x, image: toProjectMedia(x.image, config), verificationUrl: safeExternalUrl(x.verificationUrl) })),
  };
}
