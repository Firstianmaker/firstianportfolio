import Link from "next/link";
import { Container } from "@/components/container";
import type { Profile } from "@/types/portfolio";

export function Footer({ profile }: { profile: Profile }) {
  return <footer className="site-footer"><Container><p>© {new Date().getFullYear()} {profile.name}</p><span className="eyebrow">{profile.role}</span><Link href="/#main-content" className="text-link">Back to top <span aria-hidden="true">↑</span></Link></Container></footer>;
}
