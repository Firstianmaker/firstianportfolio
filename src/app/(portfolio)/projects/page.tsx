import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { ProjectBrowser } from "@/components/project-browser";
import { getPortfolio } from "@/content/portfolio";

export const metadata: Metadata = { title: "All Projects", alternates: { canonical: "/projects" } };
export const revalidate = 60;

export default async function ProjectsPage() {
  const { projects } = await getPortfolio();
  return <section className="section"><Container><Link href="/#projects" className="text-link">← Back to home</Link><div className="section-topline all-projects-heading"><h1 className="direct-heading">All Projects</h1></div><ProjectBrowser projects={projects} /></Container></section>;
}
