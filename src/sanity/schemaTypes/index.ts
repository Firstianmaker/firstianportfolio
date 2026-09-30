import { defineArrayMember, defineField, defineType } from 'sanity';
import { caseStudySection, displayOrder, externalUrl, galleryField, imageField, translationsField, metric, orderedDocument, portfolioImage, requiredString, richContent, strings, text } from './fields';
import { profile } from './profile';
import { project } from './project';

const experience = defineType({
  name: 'experience', title: 'Experience', type: 'document', ...orderedDocument,
  fields: [requiredString('company', 'Company'), requiredString('role', 'Role'), requiredString('period', 'Period'), strings('bullets', 'Contributions'), strings('stack', 'Technologies'), imageField('image', 'Company / work image'), galleryField, translationsField([['role', 'Role', 'string']]), displayOrder],
  preview: { select: { title: 'role', subtitle: 'company' } },
});
const education = defineType({
  name: 'education', title: 'Education', type: 'document', ...orderedDocument,
  fields: [requiredString('school', 'Institution'), requiredString('degree', 'Degree'), requiredString('period', 'Period'), defineField({ name: 'gpa', title: 'GPA', type: 'string' }), strings('coursework', 'Relevant coursework'), externalUrl('pddiktiUrl', 'PDDIKTI student URL'), translationsField([['degree', 'Degree', 'string']]), displayOrder],
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
  name: 'activity', title: 'Activity', type: 'document', ...orderedDocument,
  fields: [
    requiredString('title', 'Title'),
    defineField({ name: 'slug', title: 'URL slug', type: 'slug', options: { source: 'title', maxLength: 96 }, description: 'Generate for /activities/your-slug. Existing activities keep working with their document ID until a slug is published.', validation: (rule) => rule.required().custom((value) => !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) ? true : 'Use lowercase letters, numbers, and single hyphens only.') }),
    requiredString('role', 'Role'), requiredString('period', 'Displayed period'),
    defineField({ name: 'date', title: 'Exact date (optional)', type: 'date' }),
    defineField({ name: 'organization', title: 'Organization', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    text('summary', 'Short description'), text('description', 'Detailed introduction'),
    defineField({ name: 'content', title: 'Activity story', type: 'richContent', description: 'Describe the event, your contribution, and what you learned.' }),
    imageField('coverImage', 'Cover image'), galleryField,
    strings('highlights', 'Highlights / contributions'),
    defineField({ name: 'metrics', title: 'Metrics (optional)', type: 'array', of: [defineArrayMember({ type: 'metric' })] }),
    externalUrl('externalUrl', 'Event / organization link'), displayOrder,
    translationsField([['title', 'Title', 'string'], ['role', 'Role', 'string'], ['summary', 'Short description', 'text'], ['description', 'Detailed introduction', 'text'], ['content', 'Activity story', 'richContent']]),
  ],
  preview: { select: { title: 'title', subtitle: 'role', media: 'coverImage' } },
});
const skillGroup = defineType({
  name: 'skillGroup', title: 'Skill group', type: 'document', ...orderedDocument,
  fields: [requiredString('title', 'Group title'), text('description', 'Short description'), imageField('image', 'Tech stack image'), strings('items', 'Skills'), displayOrder],
});

export const schemaTypes = [profile, project, experience, education, publication, certification, activity, skillGroup, metric, portfolioImage, caseStudySection, richContent];
