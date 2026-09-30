import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluate, parse } from 'groq-js';
import { createInitialDocuments, originalContent, seedIds } from '../scripts/seed-data';
import { initialPortfolio } from '../src/content/initial';
import { normalizePortfolio, type RawPortfolio } from '../src/content/normalize';
import { homepageProjects, safeExternalUrl, serializeJsonLd } from '../src/content/utils';
import { toProjectMedia } from '../src/sanity/image';
import { portfolioQuery } from '../src/sanity/queries';

const config = { projectId: 'test1234', dataset: 'production' };
async function seed() {
  let index = 0;
  return createInitialDocuments(async (media) => ({
    _type: 'portfolioImage',
    asset: { _type: 'reference', _ref: `image-test${index++}-${media.width}x${media.height}-png` },
    alt: media.alt, caption: media.caption,
  }));
}
async function query(documents: unknown[]) {
  return await (await evaluate(parse(portfolioQuery), { dataset: documents })).get() as RawPortfolio;
}
function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([key, item]) => key !== '_key' && item !== undefined).map(([key, item]) => [key, clean(item)]));
  return value;
}

test('migration preserves every original content field through the actual GROQ projection', async () => {
  const documents = await seed();
  assert.equal(documents.length, 20);
  assert.equal(new Set(documents.map((d) => d._id)).size, seedIds.length);
  const result = normalizePortfolio(await query(documents), config);
  for (const key of ['profile', 'heroMetrics', 'experiences', 'educations', 'publications', 'skills', 'softSkills', 'community', 'certifications', 'languages'] as const) {
    assert.deepEqual(clean(result[key]), clean(initialPortfolio[key]), key);
  }
  result.projects.forEach((project, index) => {
    const old = originalContent.projects[index];
    for (const [key, value] of Object.entries(old)) {
      if (key !== 'media') assert.deepEqual(clean(project[key as keyof typeof project]), value, `${old.slug}.${key}`);
    }
    assert.equal(project.gallery.length, old.media.length - 1);
    [project.coverImage!, ...project.gallery].forEach((media, i) => {
      const { alt, caption, width, height } = old.media[i];
      const original = { alt, caption, width, height };
      assert.deepEqual({ alt: media.alt, caption: media.caption, width: media.width, height: media.height }, original);
      assert.match(media.src, /^https:\/\/cdn\.sanity\.io\/images\/test1234\/production\//);
    });
  });
});

test('rerunning the importer skips existing documents and their image uploads', async () => {
  const documents = await createInitialDocuments(async () => { throw new Error('Should not upload again'); }, new Set(seedIds));
  assert.deepEqual(documents, []);
});

test('new published project with only required fields resolves from CMS data without code registration', async () => {
  const documents = await seed();
  documents.push({ _id: 'project-test-new', _type: 'project', title: 'CMS test project', slug: { current: 'cms-test-project' }, category: 'Test', period: '2026', summary: 'Test summary', description: 'Test description' });
  const result = normalizePortfolio(await query(documents), config);
  const project = result.projects.find((item) => item.slug === 'cms-test-project');
  assert.ok(project);
  assert.equal(project.shortTitle, 'CMS test project');
  assert.equal(project.coverImage, undefined);
  assert.deepEqual(project.gallery, []);
  assert.equal(project.githubUrl, undefined);
  assert.equal(project.demoUrl, undefined);
  assert.ok(homepageProjects(result.projects).includes(project));
});

test('featured order, ordinary display order, and homepage visibility are independent', () => {
  const [a, b, c, d] = initialPortfolio.projects;
  const result = homepageProjects([
    { ...a, featuredOrder: 9 }, { ...b, featuredOrder: 1 },
    { ...c, displayOrder: 9 }, { ...d, displayOrder: 0 },
  ]);
  assert.deepEqual(result.map((p) => p.slug), [b.slug, a.slug, d.slug, c.slug]);
  assert.equal(homepageProjects([{ ...a, showOnHomepage: false }]).length, 0);
});

test('CMS deletions and empty lists never resurrect snapshot content', async () => {
  const profile = (await seed()).filter((doc) => doc._type === 'profile');
  const result = normalizePortfolio(await query(profile), config);
  assert.deepEqual(result.projects, []);
  assert.deepEqual(result.experiences, []);
  assert.deepEqual(result.educations, []);
  assert.deepEqual(result.certifications, []);
  assert.throws(() => normalizePortfolio({}, config), /published Profile document is missing/);
});

test('gallery keeps editorial ordering, skips empty assets, and honors crop dimensions', async () => {
  const raw = await query(await seed());
  const project = raw.projects![0];
  project.gallery!.reverse();
  const expected = project.gallery![0].alt;
  project.gallery!.push({ _type: 'portfolioImage' });
  const result = normalizePortfolio(raw, config);
  assert.equal(result.projects[0].gallery.length, 2);
  assert.equal(result.projects[0].gallery[0].alt, expected);
  const media = toProjectMedia({ _type: 'portfolioImage', asset: { _type: 'reference', _ref: 'image-test-1000x800-png' }, crop: { left: .1, right: .1, top: 0, bottom: 0 }, alt: 'Cropped image' }, config)!;
  assert.equal(media.width, 800);
  assert.equal(media.height, 800);
  assert.match(media.src, /rect=/);
});

test('empty and unsafe links never become buttons; JSON-LD cannot close its script', () => {
  for (const value of ['', '#', 'javascript:alert(1)', 'data:text/html,test', 'not a url']) assert.equal(safeExternalUrl(value), undefined);
  assert.equal(safeExternalUrl(' https://example.com/demo '), 'https://example.com/demo');
  assert.ok(!serializeJsonLd({ name: '</script><script>alert(1)</script>' }).includes('<'));
});
