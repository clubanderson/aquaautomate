import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllPostSlugs } from "@/lib/blog";
import { getAllSpeciesSlugs } from "@/lib/aquarium/species-care";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/collections`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/guides`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/species`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/automation`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/tools/tank-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/tools/build-your-tank`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/live`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  const guidePages: MetadataRoute.Sitemap = getAllGuideSlugs().map((slug) => ({
    url: `${SITE_URL}/guides/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const speciesPages: MetadataRoute.Sitemap = getAllSpeciesSlugs().map((slug) => ({
    url: `${SITE_URL}/species/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...guidePages, ...blogPages, ...speciesPages];
}
