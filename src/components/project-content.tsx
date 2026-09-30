import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import { safeExternalUrl } from '@/content/utils';

export function ProjectContent({ value }: { value: PortableTextBlock[] }) {
  if (!value.length) return null;
  return <div className="rich-content"><PortableText value={value} components={{
    block: {
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
    },
    marks: { link: ({ children, value }) => {
      const href = safeExternalUrl(value?.href);
      return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{children}</a> : <>{children}</>;
    } },
  }} /></div>;
}
