import Image from "next/image";
import type { ProjectMedia } from "@/types/portfolio";

export function ProjectVisual({ media, priority = false, className = "" }: { media: ProjectMedia; priority?: boolean; className?: string }) {
  return (
    <figure className={className}>
      <div className="media-frame">
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          placeholder={media.blurDataURL ? "blur" : "empty"}
          blurDataURL={media.blurDataURL}
          sizes="(min-width: 1280px) 1200px, (min-width: 768px) 90vw, 100vw"
          className="h-auto w-full object-cover"
        />
      </div>
      {media.caption && <figcaption className="media-caption">{media.caption}</figcaption>}
    </figure>
  );
}
