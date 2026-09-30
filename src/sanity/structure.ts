import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) => S.list().title('Portfolio content').items([
  S.listItem().title('Profile & About').id('profile').child(S.document().schemaType('profile').documentId('profile')),
  S.divider(),
  ...S.documentTypeListItems().filter((item) => item.getId() !== 'profile'),
]);
