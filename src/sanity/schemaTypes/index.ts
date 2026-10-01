import { defineArrayMember, defineField, defineType } from 'sanity';
import { caseStudySection, displayOrder, externalUrl, galleryField, imageField, translationsField, metric, orderedDocument, portfolioImage, requiredString, richContent, strings, text } from './fields';
import { profile } from './profile';
import { project } from './project';

const experience = defineType({
  name: 'experience', title: 'Work Experience', type: 'document', ...orderedDocument,
  fields: [requiredString('company', 'Company'), requiredString('role', 'Role'), requiredString('period', 'Period'), strings('bullets', 'Responsibilities / job description'), strings('stack', 'Technologies'), { ...imageField('image', 'First work photo'), description: 'First photo in the three-image strip.' }, { ...galleryField, title: 'Additional work photos', description: 'The first three unique photos (including First work photo) appear on the card. Extra photos remain available in the image viewer.' }, translationsField([['role', 'Role', 'string']]), displayOrder],
  preview: { select: { title: 'role', subtitle: 'company' } },
});
const education = defineType({
  name: 'education', title: 'Education', type: 'document', ...orderedDocument,
  fields: [requiredString('school', 'Institution'), requiredString('degree', 'Degree'), defineField({ name: 'period', title: 'Legacy period', type: 'string', hidden: true }), defineField({ name: 'gpa', title: 'GPA', type: 'string' }), { ...strings('coursework', 'Legacy coursework'), hidden: true }, externalUrl('pddiktiUrl', 'PDDIKTI student URL'), translationsField([['degree', 'Degree', 'string']]), { ...displayOrder, description: 'Only the first education entry appears in About. Give the displayed degree the lowest order.' }],
  preview: { select: { title: 'degree', subtitle: 'school' } },
});
const publication = defineType({
  name: 'publication', title: 'Publication', type: 'document', ...orderedDocument,
  fields: [requiredString('title', 'Title'), requiredString('journal', 'Journal'), defineField({ name: 'issue', title: 'Issue', type: 'string' }), requiredString('date', 'Publication date'), defineField({ name: 'doi', title: 'DOI', type: 'string', description: 'Identifier only, for example 10.26798/jiko.v10i2.2686. Leave blank if unavailable.', validation: (rule) => rule.regex(/^10\.\d{4,9}\/\S+$/, { name: 'DOI' }) }), displayOrder],
});
const certification = defineType({
  name: 'certification', title: 'Certification', type: 'document', ...orderedDocument,
  fields: [requiredString('title', 'Title'), requiredString('issuer', 'Issuer'), requiredString('date', 'Date'), imageField('image', 'Certificate image'), externalUrl('verificationUrl', 'Verification URL'), translationsField([['title', 'Title', 'string']]), displayOrder],
});
const activity = defineType({
  name: 'activity', title: 'Volunteer', type: 'document', ...orderedDocument,
  groups: [{ name: 'overview', title: 'Overview', default: true }, { name: 'story', title: 'Detail page' }, { name: 'media', title: 'Cover & documentation' }],
  fields: [
    requiredString('title', 'Title'),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title', maxLength: 96 }, description: 'Generate for /activities/your-slug. Existing activities keep working with their document ID until a slug is published.', validation: (rule) => rule.required().custom((value) => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) ? true : 'Use lowercase letters, numbers, and single hyphens only.') }),
    requiredString('role', 'Role'), requiredString('period', 'Displayed period'),
    defineField({ name: 'date', title: 'Exact date (optional)', type: 'date' }),
    defineField({ name: 'organization', title: 'Organization', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    text('summary', 'Short description'), text('description', 'Detailed introduction'),
    defineField({ name: 'content', title: 'Activity story', type: 'richContent', description: 'Describe the event, your contribution, and what you learned.' }),
    imageField('coverImage', 'Cover image'), defineField({ ...galleryField, title: 'Documentation photos', description: 'The first four photos appear in Documentation. Drag to reorder.', validation: (rule) => rule.max(4).warning('Only the first four photos appear on the website.') }),
    strings('highlights', 'Highlights / contributions'),
    defineField({ name: 'metrics', title: 'Metrics (optional)', type: 'array', of: [defineArrayMember({ type: 'metric' })] }),
    externalUrl('externalUrl', 'Event / organization link'), displayOrder,
    translationsField([['title', 'Title', 'string'], ['role', 'Role', 'string'], ['summary', 'Short description', 'text'], ['description', 'Detailed introduction', 'text'], ['content', 'Activity story', 'richContent']]),
  ].map((field) => ({ ...field, group: ['coverImage', 'gallery'].includes(field.name) ? 'media' : ['description', 'content', 'highlights', 'metrics', 'externalUrl', 'translations'].includes(field.name) ? 'story' : 'overview' })),
  preview: { select: { title: 'title', subtitle: 'role', media: 'coverImage' } },
});
const skillGroup = defineType({
  name: 'skillGroup', title: 'Skill group', type: 'document', ...orderedDocument,
  fields: [requiredString('title', 'Group title'), text('description', 'Short description'), imageField('image', 'Tech stack image'), strings('items', 'Skills'), displayOrder],
});

export const schemaTypes = [profile, project, experience, education, publication, certification, activity, skillGroup, metric, portfolioImage, caseStudySection, richContent];
