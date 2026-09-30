import { createImageUrlBuilder } from '@sanity/image-url';
import type { ProjectMedia } from '../types/portfolio';

export type SanityImage = {
  _type: string;
  asset?: { _type: 'reference'; _ref: string };
  alt?: string;
  caption?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; width: number; height: number };
  metadata?: { dimensions?: { width: number; height: number }; lqip?: string };
};

export function toProjectMedia(image: SanityImage | null | undefined, config: { projectId: string; dataset: string }): ProjectMedia | undefined {
  if (!image?.asset?._ref) return undefined;
  const dimensions = image.metadata?.dimensions;
  const match = image.asset._ref.match(/^image-[a-zA-Z0-9]+-(\d+)x(\d+)-[a-z0-9]+$/);
  if (!dimensions && !match) return undefined;
  const originalWidth = dimensions?.width ?? Number(match![1]);
  const originalHeight = dimensions?.height ?? Number(match![2]);
  const crop = image.crop;
  const croppedWidth = Math.max(1, originalWidth * (1 - (crop?.left ?? 0) - (crop?.right ?? 0)));
  const croppedHeight = Math.max(1, originalHeight * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0)));
  const width = Math.max(1, Math.round(Math.min(croppedWidth, 1920)));
  const height = Math.max(1, Math.round(width * croppedHeight / croppedWidth));
  const src = createImageUrlBuilder(config).image(image).width(width).height(height).fit('crop').auto('format').url();
  return { src, width, height, alt: image.alt ?? '', caption: image.caption ?? '', blurDataURL: image.metadata?.lqip };
}
