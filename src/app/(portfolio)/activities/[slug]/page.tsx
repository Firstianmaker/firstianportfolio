import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@/components/icons";
import { ProjectContent } from "@/components/project-content";
import { ProjectVisual } from "@/components/project-visual";
import { ImageGallery } from "@/components/image-gallery";
import { SectionHeading } from "@/components/section-heading";
import { getActivity, getPortfolio } from "@/content/portfolio";

type ActivityPageProps = { params: Promise<{ slug: string }> };
export const revalidate = 60;
export const dynamicParams = true;
export function generateStaticParams() { return []; }

export async function generateMetadata({ params }: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [activity, { profile }] = await Promise.all([getActivity(slug), getPortfolio()]);
  if (!activity) return {};
  return {
    title: activity.title, description: activity.summary,
    alternates: { canonical: `/activities/${encodeURIComponent(activity.slug)}` },
    openGraph: {
      title: `${activity.title} — ${profile.name}`, description: activity.summary,
      images: activity.coverImage ? [{ url: activity.coverImage.src, width: activity.coverImage.width, height: activity.coverImage.height, alt: activity.coverImage.alt }] : [],
    },
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = await getActivity(slug);
  if (!activity) notFound();
  const date = activity.date ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${activity.date}T00:00:00Z`)) : "";
  return <article>
    <section className="detail-hero"><Container>
      <Link href="/#activities" className="text-link"><ArrowLeftIcon className="size-4" />All activities</Link>
      <div className="detail-heading"><div className="lg:col-span-2"><p className="eyebrow">Community & leadership</p><h1>{activity.title}</h1>{activity.summary && <p className="section-description">{activity.summary}</p>}</div></div>
      <dl className="detail-metrics">{[["My role", activity.role], ["Period", activity.period], ["Date", date], ["Organization", activity.organization], ["Location", activity.location]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{label === "Date" ? <time dateTime={activity.date}>{value}</time> : value}</dd></div>)}</dl>
    </Container></section>
    {activity.coverImage && <Container className="pt-10 sm:pt-12"><ProjectVisual media={activity.coverImage} priority /></Container>}
    {(activity.description || activity.content.length > 0 || activity.externalUrl || activity.highlights.length > 0 || activity.metrics.length > 0) && <section className="section"><Container className="detail-layout">
      <aside>{activity.metrics.length > 0 && <><p className="eyebrow">At a glance</p><dl className="detail-metrics">{activity.metrics.map((metric, index) => <div key={index}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl></>}{activity.externalUrl && <a href={activity.externalUrl} target="_blank" rel="noopener noreferrer" className="text-link mt-6">Visit related website<ArrowUpRightIcon className="size-4" /></a>}</aside>
      <div>{(activity.description || activity.content.length > 0) && <h2 className="text-3xl mb-6">The experience</h2>}{activity.description && <p className="reading-copy">{activity.description}</p>}<ProjectContent value={activity.content} />{activity.highlights.length > 0 && <div className="mt-10"><h2 className="text-2xl mb-6">Contributions & highlights</h2><ul className="contribution-list">{activity.highlights.map((highlight, index) => <li key={index}>{highlight}</li>)}</ul></div>}</div>
    </Container></section>}
    {activity.gallery.length > 0 && <section className="section"><Container><SectionHeading eyebrow="Activity gallery" title="Photos" /><ImageGallery images={activity.gallery} title={activity.title + " gallery"} className="project-image-gallery mt-10" /></Container></section>}
    <Container className="py-12"><Link href="/#activities" className="button button-secondary"><ArrowLeftIcon className="size-4" />Back to activities</Link></Container>
  </article>;
}
