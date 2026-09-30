import Image from 'next/image';
import type { ProjectMedia } from '@/types/portfolio';

export function PortfolioPhoto({ media, priority = false, className = '' }: { media?: ProjectMedia; priority?: boolean; className?: string }) {
  if (!media) return null;
  return <figure className={className}>
    <Image src={media.src} alt={media.alt} width={media.width} height={media.height}
      priority={priority} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 90vw"
      placeholder={media.blurDataURL ? 'blur' : 'empty'} blurDataURL={media.blurDataURL}
      className="h-auto w-full rounded-lg border border-line object-cover" />
    {media.caption && <figcaption className="media-caption">{media.caption}</figcaption>}
  </figure>;
}
