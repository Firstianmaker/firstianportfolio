import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluate, parse } from 'groq-js';
import { createInitialDocuments } from '../scripts/seed-data';
import { initialPortfolio } from '../src/content/initial';
import { normalizePortfolio, type RawPortfolio } from '../src/content/normalize';
import { cvDownloadUrl, skillCards, whatsappUrl } from '../src/content/utils';
import { localizedValue } from '../src/content/localization';
import { portfolioQuery } from '../src/sanity/queries';
const config = { projectId: 'test1234', dataset: 'production' };
const image = (alt: string) => ({ _type: 'portfolioImage', asset: { _type: 'reference' as const, _ref: 'image-test-600x400-png' }, alt });

test('legacy and newly published activities retain content and ordered optional galleries', async () => {
  const docs = await createInitialDocuments(async (media) => image(media.alt));
  docs.push({ _id: 'new-event', _type: 'activity', title: 'Test event', slug: { current: 'new-event' }, role: 'Instructor', period: '2026', summary: 'Short summary', description: 'Full description', organization: 'Test organization', location: 'Test venue', date: '2026-09-16', coverImage: image('Cover'), gallery: [image('Second'), { _type: 'portfolioImage' }, image('First')], metrics: [{ value: '35', label: 'Participants' }], highlights: ['Teaching'], externalUrl: 'https://example.com/event', displayOrder: 0 });
  const result = normalizePortfolio(await (await evaluate(parse(portfolioQuery), { dataset: docs })).get() as RawPortfolio, config);
  const legacy = result.community.find((x) => x._id === 'activity-0')!;
  assert.equal(legacy.slug, 'activity-0');
  assert.equal(legacy.summary, initialPortfolio.community[0].summary);
  assert.deepEqual(legacy.gallery, []);
  const activity = result.community.find((x) => x.slug === 'new-event')!;
  assert.equal(activity.description, 'Full description');
  assert.equal(activity.date, '2026-09-16');
  assert.equal(activity.organization, 'Test organization');
  assert.deepEqual(activity.gallery.map((x) => x.alt), ['Second', 'First']);
  assert.equal(activity.externalUrl, 'https://example.com/event');
});

test('new profile files and media fields survive actual GROQ projections', async () => {
  const docs = await createInitialDocuments(async (media) => image(media.alt));
  Object.assign(docs.find((d) => d._id === 'profile')!, { heroPhoto: image('Hero'), aboutPhoto: image('About'), cv: { asset: { _ref: 'file-cv' } }, githubUrl: 'https://github.com/example', linkedinUrl: 'javascript:alert(1)' });
  Object.assign(docs.find((d) => d._type === 'experience')!, { image: image('Work'), gallery: [image('Team'), { _type: 'portfolioImage' }] });
  Object.assign(docs.find((d) => d._type === 'certification')!, { image: image('Certificate'), verificationUrl: 'https://example.com/verify' });
  docs.push({ _id: 'file-cv', _type: 'sanity.fileAsset', url: 'https://cdn.sanity.io/files/test1234/production/current.pdf', originalFilename: 'Faiz CV.pdf' });
  const result = normalizePortfolio(await (await evaluate(parse(portfolioQuery), { dataset: docs })).get() as RawPortfolio, config);
  assert.ok(result.profile.heroPhoto?.src);
  assert.ok(result.profile.aboutPhoto?.src);
  assert.equal(result.profile.cv?.filename, 'Faiz CV.pdf');
  assert.equal(result.profile.linkedinUrl, undefined);
  assert.equal(result.experiences[0].gallery.length, 1);
  assert.ok(result.experiences[0].image?.src);
  assert.ok(result.certifications[0].image?.src);
  assert.equal(result.certifications[0].verificationUrl, 'https://example.com/verify');
});

test('WhatsApp normalization and CV replacement produce correct safe URLs', () => {
  for (const number of ['08979359266', '+62 897-9359-266', '628979359266', '8979359266', '00628979359266']) {
    const url = new URL(whatsappUrl(number, 'Hello & welcome')!);
    assert.equal(url.pathname, '/628979359266');
    assert.equal(url.searchParams.get('text'), 'Hello & welcome');
  }
  for (const value of ['', '123', 'not a number', 'javascript:123456789']) assert.equal(whatsappUrl(value), undefined);
  assert.equal(cvDownloadUrl(null), undefined);
  assert.equal(cvDownloadUrl({ url: 'https://example.com/fake.pdf' }), undefined);
  const first = cvDownloadUrl({ url: 'https://cdn.sanity.io/files/test1234/production/old.pdf', filename: 'CV.pdf' })!;
  const next = cvDownloadUrl({ url: 'https://cdn.sanity.io/files/test1234/production/new.pdf', filename: 'CV 2026.pdf' })!;
  assert.notEqual(first, next);
  assert.equal(new URL(next).searchParams.get('dl'), 'CV 2026.pdf');
});

test('six skills cards and localization fallback preserve original English', () => {
  const cards = skillCards(initialPortfolio.skills, initialPortfolio.softSkills);
  assert.equal(cards.length, 6);
  assert.equal(cards[5].title, 'Soft Skills');
  assert.deepEqual(cards[5].items, initialPortfolio.softSkills);
  assert.equal(skillCards(cards, initialPortfolio.softSkills).length, 6);
  assert.equal(localizedValue('Original', { id: 'Terjemahan' }, 'id'), 'Terjemahan');
  assert.equal(localizedValue('Original', { en: 'English', id: ' ' }, 'id'), 'English');
  assert.equal(localizedValue('Original', undefined, 'id'), 'Original');
  assert.deepEqual(localizedValue(['Original block'], { id: [] }, 'id'), ['Original block']);
});
