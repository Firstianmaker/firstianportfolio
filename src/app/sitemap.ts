import type { MetadataRoute } from "next";
import { getPortfolio } from "@/content/portfolio";
import { siteUrl } from "@/data/site";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects, community } = await getPortfolio();
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...community.map((activity) => ({
      url: `${siteUrl}/activities/${encodeURIComponent(activity.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: project.featured ? 0.9 : 0.8,
    })),
  ];
}
