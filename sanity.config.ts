'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'portfolio', title: 'Portfolio Studio', basePath: '/studio',
  projectId, dataset,
  plugins: [structureTool({ structure })],
  schema: { types: schemaTypes, templates: (templates) => templates.filter((template) => !['profile', 'skillGroup', 'certification'].includes(template.schemaType)) },
  document: {
    actions: (actions, context) => context.schemaType === 'profile'
      ? actions.filter(({ action }) => !['delete', 'duplicate', 'unpublish'].includes(action ?? ''))
      : actions,
    newDocumentOptions: (options) => options.filter((option) => !['profile', 'skillGroup', 'certification'].includes(option.templateId)),
  },
});
