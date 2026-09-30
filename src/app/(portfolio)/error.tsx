"use client";

import { Container } from "@/components/container";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <Container className="section min-h-[60vh]"><p className="eyebrow">Content unavailable</p><h2 className="mt-5 text-3xl">The portfolio couldn’t load.</h2><p className="muted mt-4">Please try again to reload the latest content.</p><button className="button button-primary mt-8" onClick={reset}>Try again</button></Container>;
}
