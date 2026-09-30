import 'server-only';
import { cache } from 'react';
import { getSanityClient } from '../sanity/client';
import { dataset, projectId } from '../sanity/env';
import { portfolioQuery } from '../sanity/queries';
import { normalizePortfolio, type RawPortfolio } from './normalize';
import { initialPortfolio } from './initial';

// React cache deduplicates metadata/layout/page reads within one server render.
// Published content revalidates every 60 seconds without a new deployment.
export const getPortfolio = cache(async () => {
  const client = getSanityClient();
  if (!client) return initialPortfolio;
  const content = await client.fetch<RawPortfolio>(portfolioQuery, {}, {
    next: { revalidate: 60, tags: ['portfolio'] },
  });
  return normalizePortfolio(content, { projectId, dataset });
});

export const getActivity = cache(async (slug: string) => {
  const { community } = await getPortfolio();
  return community.find((activity) => activity.slug === slug || activity._id === slug);
});

export const getProject = cache(async (slug: string) => {
  const { projects } = await getPortfolio();
  return projects.find((project) => project.slug === slug);
});
