import Link from 'next/link';
import { isSanityConfigured } from '@/sanity/env';
import { Studio } from '@/sanity/studio';

export const dynamic = 'force-dynamic';

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '80px auto', padding: 24 }}>
        <h1>Connect your Sanity project</h1>
        <p>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local, then restart the development server.</p>
        <p>Follow the one-time setup and content import steps in README.md. Your existing portfolio remains available until Sanity is connected.</p>
        <Link href="/">Back to portfolio</Link>
      </main>
    );
  }
  return <Studio />;
}
