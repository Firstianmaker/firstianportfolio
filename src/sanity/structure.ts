import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) => S.list().title('Portfolio content').items([
  S.listItem().title('Profile & About').id('profile').child(S.document().schemaType('profile').documentId('profile')),
  S.divider(),
  S.documentTypeListItem('project').title('Projects'),
  S.documentTypeListItem('experience').title('Work Experience'),
  S.documentTypeListItem('education').title('Education · About'),
  S.documentTypeListItem('publication').title('Publications · About'),
  S.documentTypeListItem('activity').title('Volunteer'),
]);
