import { loadEnvConfig } from '@next/env';
import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInitialDocuments, seedIds } from './seed-data';

async function main() {
  loadEnvConfig(process.cwd());
  const dryRun = process.argv.includes('--dry-run');
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!dryRun && (!projectId || !dataset || !token)) {
    throw new Error('Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_WRITE_TOKEN in .env.local. Use --dry-run to validate the migration offline.');
  }
  const client = !dryRun ? createClient({ projectId, dataset, token, apiVersion: '2026-09-01', useCdn: false, perspective: 'raw' }) : null;
  const existing = client ? await client.fetch<{ _id: string }[]>('*[_id in $ids || _id in $draftIds]{_id}', { ids: seedIds, draftIds: seedIds.map((id) => `drafts.${id}`) }) : [];
  // Do not overwrite either published content or work-in-progress drafts on reruns.
  const skip = new Set(existing.map((doc) => doc._id.replace(/^drafts\./, '')));
  if (client) {
    const collisions = await client.fetch<{ _id: string }[]>(
      '*[_type == "project" && slug.current in $slugs && !(_id in $ids) && !(_id in $draftIds)]{_id}',
      { slugs: seedIds.filter((id) => id.startsWith('project-')).map((id) => id.slice(8)), ids: seedIds, draftIds: seedIds.map((id) => `drafts.${id}`) },
    );
    if (collisions.length) throw new Error('An existing project uses an original portfolio slug with a different document ID. Resolve the duplicate slug before importing; no documents were changed.');
  }
  let imageCount = 0;
  const documents = await createInitialDocuments(async (media) => {
    const local = path.join(process.cwd(), 'public', media.src.replace(/^\//, ''));
    const bytes = await readFile(local);
    if (!bytes.length) throw new Error(`Empty image: ${media.src}`);
    imageCount++;
    const digest = createHash('sha1').update(bytes).digest('hex');
    const asset = client ? await client.assets.upload('image', bytes, {
      filename: path.basename(media.src), contentType: 'image/png',
    }) : { _id: `image-${digest}-${media.width}x${media.height}-png` };
    return { _type: 'portfolioImage', asset: { _type: 'reference', _ref: asset._id }, alt: media.alt, caption: media.caption };
  }, skip);
  if (client && documents.length) {
    let transaction = client.transaction();
    for (const doc of documents) transaction = transaction.createIfNotExists(doc);
    await transaction.commit();
    const imported = await client.fetch<{ _id: string }[]>('*[_id in $ids]{_id}', { ids: documents.map((doc) => doc._id) });
    if (imported.length !== documents.length) throw new Error('Import verification failed: one or more documents are missing. Rerun the idempotent import.');
  }
  console.log(`${dryRun ? 'Dry run passed' : 'Import verified'}: ${documents.length} documents, ${imageCount} images, ${skip.size} existing documents preserved.`);
  console.log(dryRun ? 'No remote data was changed.' : 'Open /studio to edit and publish content. Existing imported images are the original placeholders; replace them in Studio when ready.');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Content import failed.');
  process.exitCode = 1;
});
