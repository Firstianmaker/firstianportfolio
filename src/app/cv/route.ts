import { getSanityClient } from '@/sanity/client';
import { cvDownloadUrl } from '@/content/utils';

export const dynamic = 'force-dynamic';

// Read the latest published file on each click, even when a page is still cached.
export async function GET(request: Request) {
  const language = new URL(request.url).searchParams.get('lang') ?? 'en';
  if (!['en', 'id'].includes(language)) return new Response('Unknown CV language.', { status: 400 });
  const field = language === 'id' ? 'cvIndonesian' : 'cv';
  const headers = { 'Cache-Control': 'no-store' };
  const client = getSanityClient();
  if (!client) return new Response('A CV is not available yet.', { status: 404, headers });
  try {
    const file = await client.fetch<{ url?: string; filename?: string } | null>(
      `*[_type == "profile" && _id == "profile"][0].${field}.asset->{url, "filename": originalFilename}`,
      {}, { cache: 'no-store' },
    );
    const url = cvDownloadUrl(file);
    return url
      ? new Response(null, { status: 307, headers: { ...headers, Location: url } })
      : new Response('A CV is not available yet.', { status: 404, headers });
  } catch {
    return new Response('The CV is temporarily unavailable. Please try again shortly.', { status: 503, headers });
  }
}
