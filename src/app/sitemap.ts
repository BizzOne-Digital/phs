import type { MetadataRoute } from "next";
import { getServices, getPublishedBlogs } from "@/lib/data";
import { FALLBACK_SERVICES, FALLBACK_BLOGS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/pricing",
    "/blog",
    "/contact",
    "/request-service",
    "/privacy-policy",
    "/terms-and-conditions",
  ];

  let services = FALLBACK_SERVICES;
  let blogs = FALLBACK_BLOGS;

  try {
    const dbServices = await getServices();
    if (dbServices?.length) services = dbServices;
  } catch {
    /* use fallback */
  }

  try {
    const data = await getPublishedBlogs(100, 0);
    if (data.posts?.length) blogs = data.posts;
  } catch {
    /* use fallback */
  }

  const now = new Date();

  return [
    ...staticRoutes.map((path) => ({
      url: absoluteUrl(path || "/"),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...services.map((s: { slug: string }) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogs.map((b: { slug: string; updatedAt?: string | Date }) => ({
      url: absoluteUrl(`/blog/${b.slug}`),
      lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
