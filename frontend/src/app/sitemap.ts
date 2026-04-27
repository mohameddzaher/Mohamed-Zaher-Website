import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { VENTURES, PROJECTS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();
  const locales = ["", "ar/"] as const;
  const pages = ["", "about", "ventures", "projects", "experience", "insights", "contact"];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    entries.push({
      url: `${base}/${page}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${base}/${page}`,
          ar: `${base}/ar/${page}`,
        },
      },
    });
  }

  for (const v of VENTURES) {
    entries.push({
      url: `${base}/ventures/${v.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const p of PROJECTS) {
    entries.push({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Silence unused-locales var
  void locales;

  return entries;
}
