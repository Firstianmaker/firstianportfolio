import { Container } from "@/components/container";

export default function Loading() {
  return <Container className="section min-h-[60vh]"><div role="status" aria-live="polite"><p className="eyebrow">Portfolio</p><h2 className="mt-5 text-3xl">Loading the work…</h2><p className="muted mt-4">Fetching the latest portfolio content.</p></div></Container>;
}
