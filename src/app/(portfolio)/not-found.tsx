import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="grid min-h-[70vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl">Page not found.</h1>
        <p className="mt-4 muted">The page you’re looking for does not exist.</p>
        <Link href="/" className="button button-primary mt-8">Back home</Link>
      </div>
    </Container>
  );
}
