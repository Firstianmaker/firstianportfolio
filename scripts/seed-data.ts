import initial from '../src/content/initial-content.json';
import { profileDefaults } from '../src/content/profile-defaults';
import type { SanityImage } from '../src/sanity/image';

export type SeedDocument = Record<string, unknown> & { _id: string; _type: string };
export type InitialMedia = typeof initial.projects[number]['media'][number];
export const originalContent = initial;
export const seedIds = [
  'profile', ...initial.projects.map((p) => `project-${p.slug}`),
  'experience-gfk', 'education-upnvj', 'publication-jiko',
  ...initial.skills.map((_, i) => `skill-${i}`),
  ...initial.community.map((_, i) => `activity-${i}`),
  ...initial.certifications.map((_, i) => `certification-${i}`),
];

function keyed(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item, index) => {
    const transformed = keyed(item);
    return transformed && typeof transformed === 'object' && !Array.isArray(transformed)
      ? { ...transformed, _key: `item-${index}` } : transformed;
  });
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, keyed(item)]));
  return value;
}

// Shared by the real importer and offline migration tests; UI never imports this.
export async function createInitialDocuments(
  upload: (media: InitialMedia) => Promise<SanityImage>,
  skip = new Set<string>(),
): Promise<SeedDocument[]> {
  const documents: SeedDocument[] = [];
  const add = (_id: string, _type: string, value: Record<string, unknown>) => {
    if (!skip.has(_id)) documents.push({ ...keyed(value) as Record<string, unknown>, _id, _type });
  };
  add('profile', 'profile', { ...initial.profile, ...profileDefaults, heroMetrics: initial.heroMetrics, softSkills: initial.softSkills, languages: initial.languages });
  for (const [index, project] of initial.projects.entries()) {
    if (skip.has(`project-${project.slug}`)) continue;
    const { media, slug, ...fields } = project;
    const images: SanityImage[] = [];
    for (const image of media) images.push(await upload(image));
    add(`project-${slug}`, 'project', {
      ...fields, slug: { _type: 'slug', current: slug },
      coverImage: images[0], gallery: images.slice(1),
      content: [], sections: [], featured: project.featured ?? false,
      displayOrder: index, featuredOrder: index, showOnHomepage: true,
      galleryDescription: 'Screenshots and supporting visuals from this project.',
    });
  }
  add('experience-gfk', 'experience', { ...initial.experience, displayOrder: 0 });
  add('education-upnvj', 'education', { ...initial.education, displayOrder: 0 });
  add('publication-jiko', 'publication', { ...initial.publication, displayOrder: 0 });
  initial.skills.forEach((x, i) => add(`skill-${i}`, 'skillGroup', { ...x, displayOrder: i }));
  initial.community.forEach((x, i) => add(`activity-${i}`, 'activity', { ...x, displayOrder: i }));
  initial.certifications.forEach((x, i) => add(`certification-${i}`, 'certification', { ...x, displayOrder: i }));
  return documents;
}
