import { defineArrayMember, defineField, defineType } from 'sanity';
import { externalUrl, imageField, requiredString, strings, text, translationsField } from './fields';
import { technicalGroups } from '../../data/technical-stack';
import { profileDefaults } from '../../content/profile-defaults';

const legacyFields = new Set(['initials', 'phone', 'heroHeadline', 'heroEyebrow', 'about', 'aboutTagline', 'experienceIntro', 'heroMetrics', 'softSkills', 'translations']);
const fieldGroups: Record<string, string> = { name: 'hero', role: 'seo', initials: 'hero', location: 'about', email: 'contact', roles: 'hero', technicalGroups: 'skills', aboutShort: 'about', birthPlace: 'about', birthDate: 'about', heightCm: 'about', itExperienceStartDate: 'about', intro: 'seo', heroPhoto: 'about', aboutPhoto: 'about', cv: 'contact', cvIndonesian: 'contact', cvUrl: 'contact', whatsappNumber: 'contact', whatsappMessage: 'contact', linkedinUrl: 'contact', githubUrl: 'contact', instagramUrl: 'contact', letterboxdUrl: 'contact', volunteerImages: 'volunteer', pddiktiUrl: 'about', languages: 'about', backgroundMusic: 'music' };

export const profile = defineType({
  name: 'profile', title: 'Profile & About', type: 'document',
  groups: [{ name: 'hero', title: 'Hero & navbar', default: true }, { name: 'about', title: 'About' }, { name: 'contact', title: 'Contact & CV' }, { name: 'skills', title: 'Tech Stack' }, { name: 'volunteer', title: 'Volunteer photos' }, { name: 'music', title: 'Music' }, { name: 'seo', title: 'Search & sharing' }],
  fields: [
    requiredString('name', 'Name'), { ...requiredString('role', 'Professional title'), description: 'Used in search metadata and as a fallback when the hero role list is empty.' },
    requiredString('initials', 'Monogram initials'), requiredString('location', 'Location'),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Legacy hero headline', type: 'string', hidden: true }),
    defineField({ name: 'heroEyebrow', title: 'Legacy homepage eyebrow', type: 'string', hidden: true }),
    strings('roles', 'Animated career roles'),
    defineField({ name: 'technicalGroups', title: 'Tech Stack groups', type: 'array', initialValue: technicalGroups.map((group, index) => ({ ...group, _key: `group-${index}` })), of: [defineArrayMember({ type: 'object', name: 'technicalGroup', fields: [requiredString('title', 'Group name'), strings('items', 'Skills')], preview: { select: { title: 'title' } } })], description: 'Six cards in a 3-column desktop grid. Add individual skill names (Python, JavaScript, etc.); matching logos are automatic. Leave unset to use the current default groups.' }),
    { ...text('aboutShort', 'About introduction'), rows: 3, description: 'One or two sentences shown on the homepage.' },
    defineField({ name: 'birthPlace', title: 'Place of birth', type: 'string' }),
    defineField({ name: 'birthDate', title: 'Date of birth', type: 'date', description: 'Age is calculated from this date. This information will be public.' }),
    defineField({ name: 'heightCm', title: 'Height (cm)', type: 'number', validation: (rule) => rule.positive().max(300) }),
    defineField({ name: 'itExperienceStartDate', title: 'IT experience start date', type: 'date', description: 'Set your actual starting date; years of experience are calculated from it.' }),
    defineField({ ...text('intro', 'Social sharing description'), validation: (rule) => rule.required() }),
    defineField({ ...text('about', 'About'), validation: (rule) => rule.required() }),
    text('aboutTagline', 'About tagline'), text('experienceIntro', 'Experience section introduction'),
    defineField({ name: 'heroMetrics', title: 'Profile metrics', type: 'array', of: [defineArrayMember({ type: 'metric' })], description: 'These are editorial values; update the project count when adding projects if desired.' }),
    defineField({ name: 'backgroundMusic', title: 'Background music', type: 'file', options: { accept: 'audio/mpeg,audio/mp4,audio/ogg,audio/wav' }, description: 'Upload an MP3, M4A, OGG or WAV and publish. Music loads only when a visitor clicks Play. Leave empty to show the no-music message.' }),
    { ...imageField('heroPhoto', 'Fallback About photo'), description: 'Used only when About photo is empty. The current hero does not display a photo.' },
    imageField('aboutPhoto', 'About personal photo'),
    defineField({ name: 'cv', title: 'English CV file', type: 'file', options: { accept: '.pdf,.doc,.docx' }, description: 'English version in the CV language picker. The existing CV is retained here; check that its language is English.', validation: (rule) => rule.custom((value) => value && !value.asset ? 'Upload a file or remove the empty entry.' : true) }),
    defineField({ name: 'cvIndonesian', title: 'CV Bahasa Indonesia', type: 'file', options: { accept: '.pdf,.doc,.docx' }, description: 'Indonesian version in the CV language picker. Upload and publish.', validation: (rule) => rule.custom((value) => value && !value.asset ? 'Upload a file or remove the empty entry.' : true) }),
    { ...externalUrl('cvUrl', 'External English CV link'), description: 'Optional alternative to the uploaded CV. This link takes precedence when filled.' },
    defineField({ name: 'whatsappNumber', title: 'WhatsApp number', type: 'string', initialValue: profileDefaults.whatsappNumber, description: 'Accepts 0897…, 62897… or +62897…. Indonesia is used for a local number.' }),
    defineField({ name: 'whatsappMessage', title: 'WhatsApp default message', type: 'text', rows: 2, initialValue: profileDefaults.whatsappMessage }),
    externalUrl('linkedinUrl', 'LinkedIn URL'), externalUrl('githubUrl', 'GitHub URL'), externalUrl('instagramUrl', 'Instagram URL'), externalUrl('letterboxdUrl', 'Letterboxd URL'),
    defineField({ name: 'volunteerImages', title: 'Volunteer showcase (3 images)', type: 'array', of: [defineArrayMember({ type: 'portfolioImage' })], options: { layout: 'grid' }, validation: (rule) => rule.max(3), description: 'Choose three community photographs in their display order.' }),
    { ...externalUrl('pddiktiUrl', 'Default PDDIKTI student URL'), initialValue: profileDefaults.pddiktiUrl, description: 'Used for the original UPNVJ entry; other education entries can use their own URL.' },
    { ...strings('softSkills', 'Legacy soft skills'), hidden: true },
    translationsField([['role', 'Professional title', 'string'], ['heroHeadline', 'Supporting headline', 'text'], ['intro', 'Introduction', 'text'], ['about', 'About', 'text'], ['aboutTagline', 'About tagline', 'text'], ['experienceIntro', 'Experience introduction', 'text']]),
    defineField({ name: 'languages', title: 'Languages', type: 'array', of: [defineArrayMember({ name: 'language', type: 'object', fields: [requiredString('name', 'Language'), defineField({ name: 'level', title: 'Legacy proficiency', type: 'string', hidden: true })] })] }),
  ].map((field) => legacyFields.has(field.name) ? { ...field, hidden: true, validation: undefined } : { ...field, group: fieldGroups[field.name] }),
  preview: { select: { title: 'name', subtitle: 'role' } },
});
