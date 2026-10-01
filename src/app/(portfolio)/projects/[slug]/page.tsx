import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { Container } from "@/components/container";
import { ImageGallery } from "@/components/image-gallery";
import { getPortfolio, getProject } from "@/content/portfolio";
import { uniqueImages, isMobileProject } from "@/content/presentation";
import { SocialIcon } from "@/components/social-links";

type ProjectPageProps = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export const dynamicParams = true;

// New slugs render on demand, including projects published after deployment.
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [project, { profile }] = await Promise.all([getProject(slug), getPortfolio()]);
  if (!project) return {};
  return {
    title: project.shortTitle, description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.shortTitle} — ${profile.name}`, description: project.summary,
      images: project.coverImage ? [{ url: project.coverImage.src, width: project.coverImage.width, height: project.coverImage.height, alt: project.coverImage.alt }] : [],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const images = uniqueImages([project.coverImage, ...project.gallery]);

  return <article className="focused-project">
    <section className="detail-hero"><Container>
      <Link href="/#projects" className="text-link"><ArrowLeftIcon className="size-4" />All projects</Link>
      <div className="detail-heading"><div><p className="eyebrow">{project.category}</p><h1>{project.shortTitle}</h1><p className="section-description">{project.description || project.summary}</p></div>
        <div><dl className="detail-metrics"><div><dt>Project period</dt><dd>{project.period}</dd></div></dl><p className="eyebrow mt-7">Tech stack</p><div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="button-row">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="button button-secondary"><SocialIcon platform="GitHub" />GitHub</a>}{project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="button button-secondary">Live demo<ArrowUpRightIcon className="size-4" /></a>}</div>
        </div>
      </div>
    </Container></section>
    {project.highlights.length > 0 && <section className="section project-features"><Container className="feature-layout"><h2 className="direct-heading">Key Features</h2><ul className="contribution-list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></Container></section>}
    <section className="section project-gallery-section"><Container><div className="section-topline"><h2 className="direct-heading">Project Gallery</h2><p className="eyebrow">Select an image to zoom</p></div>{images.length ? <ImageGallery images={images} title={project.shortTitle + " gallery"} className="project-image-gallery" portrait={isMobileProject(project)} /> : <p className="empty-state">Project screenshots have not been added yet.</p>}</Container></section>
    <Container className="pb-12"><Link href="/#projects" className="button button-secondary"><ArrowLeftIcon className="size-4" />Back to projects</Link></Container>
  </article>;
}
