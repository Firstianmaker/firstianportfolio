import 'server-only';
import { createClient } from '@sanity/client';
import { apiVersion, assertSanityEnvironment, dataset, isSanityConfigured, projectId } from './env';

export function getSanityClient() {
  assertSanityEnvironment();
  if (!isSanityConfigured) return null;
  return createClient({
    projectId, dataset, apiVersion,
    perspective: 'published',
    useCdn: false,
    // Optional viewer token for a private dataset. Never exposed to Studio/browser.
    token: process.env.SANITY_API_READ_TOKEN,
  });
}
