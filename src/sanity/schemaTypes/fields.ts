import { defineArrayMember, defineField, defineType } from 'sanity';

export const displayOrder = defineField({
  name: 'displayOrder', title: 'Display order', type: 'number', initialValue: 100,
  description: 'Lower numbers appear first. Ties are resolved consistently.',
  validation: (rule) => rule.integer().min(0),
});
export const strings = (name: string, title: string) => defineField({
  name, title, type: 'array', of: [defineArrayMember({ type: 'string' })],
  validation: (rule) => rule.unique(),
});
export const requiredString = (name: string, title: string) => defineField({
  name, title, type: 'string', validation: (rule) => rule.required(),
});
export const text = (name: string, title: string) => defineField({ name, title, type: 'text', rows: 4 });
export const externalUrl = (name: string, title: string) => defineField({
  name, title, type: 'url',
  description: 'Optional. Leave blank to hide this link on the portfolio.',
  validation: (rule) => rule.uri({ scheme: ['https', 'http'] }),
});
export const imageField = (name: string, title: string) => defineField({ name, title, type: 'portfolioImage' });
export const galleryField = defineField({ name: 'gallery', title: 'Image gallery', type: 'array', of: [defineArrayMember({ type: 'portfolioImage' })], options: { layout: 'grid' } });

// Additive field-level localization: never change the type of an existing field.
// Optional overrides are staged here; the public site remains English for now.
export const translationsField = (fields: [string, string, 'string' | 'text' | 'richContent'][]) => defineField({
  name: 'translations', title: 'Translations (optional preparation)', type: 'object',
  options: { collapsible: true, collapsed: true },
  description: 'Prepared for a future EN / ID switcher. The website currently uses the original English fields. Leave these empty unless preparing translations; do not copy images, dates, links, or files.',
  fields: fields.map(([name, title, type]) => defineField({
    name, title, type: 'object', fields: [
      defineField({ name: 'en', title: 'English override (optional)', type }),
      defineField({ name: 'id', title: 'Indonesian', type }),
    ],
  })),
});

export const orderedDocument = {
  orderings: [{ title: 'Display order', name: 'displayOrder', by: [{ field: 'displayOrder', direction: 'asc' as const }] }],
};

export const metric = defineType({
  name: 'metric', title: 'Metric', type: 'object',
  fields: [requiredString('value', 'Value'), requiredString('label', 'Label')],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

export const portfolioImage = defineType({
  name: 'portfolioImage', title: 'Image', type: 'image',
  options: { hotspot: true, accept: 'image/png,image/jpeg,image/webp,image/avif,image/gif' },
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', description: 'Describe the image for visitors using screen readers.', validation: (rule) => rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
  validation: (rule) => rule.custom((value) => value && !value.asset ? 'Upload or select an image, or remove this empty image entry.' : true),
  preview: { select: { title: 'alt', subtitle: 'caption', media: 'asset' } },
});

export const caseStudySection = defineType({
  name: 'caseStudySection', title: 'Case-study section', type: 'object',
  fields: [requiredString('title', 'Heading'), text('body', 'Content')],
});

export const richContent = defineType({
  name: 'richContent', title: 'Rich text', type: 'array',
  of: [defineArrayMember({
    type: 'block',
    styles: [{ title: 'Normal', value: 'normal' }, { title: 'Heading', value: 'h2' }, { title: 'Subheading', value: 'h3' }],
    marks: {
      decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }],
      annotations: [defineArrayMember({ name: 'link', type: 'object', title: 'Link', fields: [externalUrl('href', 'URL')] })],
    },
  })],
});
