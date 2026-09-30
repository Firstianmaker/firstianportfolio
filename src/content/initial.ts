import initial from './initial-content.json';
import { profileDefaults } from './profile-defaults';
import type { Portfolio } from '../types/portfolio';

// Preserved original content, used only before a Sanity project is configured.
// Once configured, even empty CMS lists are authoritative; deleted items never reappear.
export const initialPortfolio: Portfolio = {
  ...initial,
  profile: { ...initial.profile, ...profileDefaults },
  projects: initial.projects.map((p, index) => ({
    ...p, coverImage: p.media[0], gallery: p.media.slice(1),
    content: [], sections: [], featured: p.featured ?? false,
    displayOrder: index, featuredOrder: index, showOnHomepage: true,
    galleryDescription: 'Screenshots and supporting visuals from this project.',
  })),
  experiences: [{ _id: 'experience-gfk', ...initial.experience, gallery: [] }],
  educations: [{ _id: 'education-upnvj', ...initial.education }],
  publications: [{ _id: 'publication-jiko', ...initial.publication }],
  skills: initial.skills.map((x, i) => ({ _id: `skill-${i}`, ...x })),
  community: initial.community.map((x, i) => ({ _id: `activity-${i}`, ...x, slug: `activity-${i}`, description: '', content: [], organization: '', location: '', gallery: [], metrics: [], highlights: [], displayOrder: i })),
  certifications: initial.certifications.map((x, i) => ({ _id: `certification-${i}`, ...x })),
};
