import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { SocialIcon } from "@/components/social-links";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { Project } from "@/types/portfolio";
import { isMobileProject, mobileThumbnailImages } from "@/content/presentation";

export function ProjectCard({ project }: { project: Project }) {
  const screenshots = isMobileProject(project) ? mobileThumbnailImages(project) : [];
  return <article className="project-tile">
    <Link href={`/projects/${project.slug}`} className="project-tile-image" aria-label={`View ${project.shortTitle} detail`}>
      {screenshots.length ? <div className="mobile-project-thumbnail">{screenshots.map((media) => <Image key={media.src} src={media.src} alt={media.alt} width={media.width} height={media.height} sizes="(min-width: 640px) 16vw, 30vw" />)}</div> : project.coverImage ? <Image src={project.coverImage.src} alt={project.coverImage.alt} width={project.coverImage.width} height={project.coverImage.height} sizes="(min-width: 640px) 45vw, 90vw" /> : <MediaPlaceholder label={project.shortTitle + " thumbnail"} />}
    </Link>
    <div className="project-tile-copy"><p className="eyebrow">{project.category}</p><h3><Link href={`/projects/${project.slug}`}>{project.shortTitle}</Link></h3><p className="project-short-description">{project.summary}</p><div className="tag-list">{project.stack.slice(0, 6).map((item) => <span key={item}>{item}</span>)}</div>
      <div className="project-tile-actions"><Link href={`/projects/${project.slug}`} className="text-link">View Detail<ArrowUpRightIcon className="size-4" /></Link>{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-github" aria-label={`View ${project.shortTitle} on GitHub`}><SocialIcon platform="GitHub" /><span>GitHub</span></a> : <span className="project-github is-unconfigured" aria-label="GitHub link not added yet"><SocialIcon platform="GitHub" /><span>GitHub<small>Not linked yet</small></span></span>}</div>
    </div>
  </article>;
}
