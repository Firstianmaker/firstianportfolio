'use client';

import dynamic from 'next/dynamic';
import config from '../../sanity.config';

// Load Studio only on /studio. Its styles never enter the portfolio root layout.
const NextStudio = dynamic(() => import('next-sanity/studio').then((module) => module.NextStudio), { ssr: false });

export function Studio() {
  return <NextStudio config={config} />;
}
