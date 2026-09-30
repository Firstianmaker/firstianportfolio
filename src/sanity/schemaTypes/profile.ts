import { defineArrayMember, defineField, defineType } from 'sanity';
import { externalUrl, imageField, requiredString, strings, text, translationsField } from './fields';
import { technicalGroups } from '../../data/technical-stack';
import { profileDefaults } from '../../content/profile-defaults';

export const profile = defineType({
  name: 'profile', title: 'Profile & About', type: 'document',
  fields: [
    requiredString('name', 'Name'), requiredString('role', 'Role'),
    requiredString('initials', 'Monogram initials'), requiredString('location', 'Location'),
    defineField({ name: 'email', title: 'Email', type: 'string', validation: (rule) => rule.required().email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Legacy hero headline', type: 'string', hidden: true }),
    defineField({ name: 'heroEyebrow', title: 'Legacy homepage eyebrow', type: 'string', hidden: true }),
    strings('roles', 'Animated career roles'),
    defineField({ name: 'technicalGroups', title: 'Technical skills (GitHub README)', type: 'array', initialValue: technicalGroups.map((group, index) => ({ ...group, _key: `group-${index}` })), of: [defineArrayMember({ type: 'object', name: 'technicalGroup', fields: [requiredString('title', 'Group name'), strings('items', 'Skills')], preview: { select: { title: 'title' } } })], description: 'Homepage skill groups. When unset, the supplied GitHub README is used. Each skill has its own icon.' }),
    { ...text('aboutShort', 'Short About description'), rows: 3, description: 'One or two sentences shown on the homepage.' },
    defineField({ name: 'birthPlace', title: 'Place of birth', type: 'string' }),
    defineField({ name: 'birthDate', title: 'Date of birth', type: 'date', description: 'Age is calculated from this date. This information will be public.' }),
    defineField({ name: 'heightCm', title: 'Height (cm)', type: 'number', validation: (rule) => rule.positive().max(300) }),
    defineField({ name: 'itExperienceStartDate', title: 'IT experience start date', type: 'date', description: 'Set your actual starting date; years of experience are calculated from it.' }),
    { ...text('intro', 'Introduction'), validation: (rule) => rule.required() },
    { ...text('about', 'About'), validation: (rule) => rule.required() },
    text('aboutTagline', 'About tagline'), text('experienceIntro', 'Experience section introduction'),
    defineField({ name: 'heroMetrics', title: 'Profile metrics', type: 'array', of: [defineArrayMember({ type: 'metric' })], description: 'These are editorial values; update the project count when adding projects if desired.' }),
    imageField('heroPhoto', 'Hero personal photo'),
    imageField('aboutPhoto', 'About personal photo'),
    defineField({ name: 'cv', title: 'CV file', type: 'file', options: { accept: '.pdf,.doc,.docx' }, description: 'Upload a CV and publish. Replace this file to update every Download CV button.', validation: (rule) => rule.custom((value) => value && !value.asset ? 'Upload a file or remove the empty entry.' : true) }),
    { ...externalUrl('cvUrl', 'External CV link'), description: 'Optional alternative to the uploaded CV. This link takes precedence when filled.' },
    defineField({ name: 'whatsappNumber', title: 'WhatsApp number', type: 'string', initialValue: profileDefaults.whatsappNumber, description: 'Accepts 0897…, 62897… or +62897…. Indonesia is used for a local number.' }),
    defineField({ name: 'whatsappMessage', title: 'WhatsApp default message', type: 'text', rows: 2, initialValue: profileDefaults.whatsappMessage }),
    externalUrl('linkedinUrl', 'LinkedIn URL'), externalUrl('githubUrl', 'GitHub URL'), externalUrl('instagramUrl', 'Instagram URL'),
    defineField({ name: 'volunteerImages', title: 'Volunteer showcase (3 images)', type: 'array', of: [defineArrayMember({ type: 'portfolioImage' })], options: { layout: 'grid' }, validation: (rule) => rule.max(3), description: 'Choose three community photographs in their display order.' }),
    { ...externalUrl('pddiktiUrl', 'Default PDDIKTI student URL'), initialValue: profileDefaults.pddiktiUrl, description: 'Used for the original UPNVJ entry; other education entries can use their own URL.' },
    { ...strings('softSkills', 'Legacy soft skills'), hidden: true },
    translationsField([['role', 'Professional title', 'string'], ['heroHeadline', 'Supporting headline', 'text'], ['intro', 'Introduction', 'text'], ['about', 'About', 'text'], ['aboutTagline', 'About tagline', 'text'], ['experienceIntro', 'Experience introduction', 'text']]),
    defineField({ name: 'languages', title: 'Languages', type: 'array', of: [defineArrayMember({ name: 'language', type: 'object', fields: [requiredString('name', 'Language'), requiredString('level', 'Proficiency / score')] })] }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});
