import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/models/SiteSettings";
import { Service } from "@/models/Service";
import { PricingItem } from "@/models/PricingItem";
import { BlogPost } from "@/models/BlogPost";
import { Testimonial } from "@/models/Testimonial";
import { Page } from "@/models/Page";
import { unstable_cache } from "next/cache";

const isDev = process.env.NODE_ENV === "development";

/** In development, skip Data Cache so admin edits appear immediately. */
function cachedQuery<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  opts: { tags: string[]; revalidate: number }
): Promise<T> {
  if (isDev) return fn();
  return unstable_cache(fn, keyParts, opts)();
}

export async function getSettings() {
  return cachedQuery(
    async () => {
      await connectDB();
      let settings = await SiteSettings.findOne({ singletonKey: "site" }).lean();
      if (!settings) {
        settings = (await SiteSettings.create({})).toObject();
      }
      return JSON.parse(JSON.stringify(settings));
    },
    ["settings"],
    { tags: ["settings"], revalidate: 30 }
  );
}

export async function getPageBySlug(slug: string) {
  return cachedQuery(
    async () => {
      await connectDB();
      const page = await Page.findOne({ slug, status: "published" }).lean();
      return page ? JSON.parse(JSON.stringify(page)) : null;
    },
    [`page-${slug}`],
    { tags: ["pages", `page:${slug}`], revalidate: 30 }
  );
}

export async function getServices(opts?: { activeOnly?: boolean }) {
  return cachedQuery(
    async () => {
      await connectDB();
      const filter = opts?.activeOnly === false ? {} : { active: true };
      const services = await Service.find(filter).sort({ displayOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(services));
    },
    ["services-list", String(opts?.activeOnly)],
    { tags: ["services"], revalidate: 30 }
  );
}

export async function getServiceBySlug(slug: string) {
  return cachedQuery(
    async () => {
      await connectDB();
      const service = await Service.findOne({ slug, active: true }).lean();
      return service ? JSON.parse(JSON.stringify(service)) : null;
    },
    [`service-${slug}`],
    { tags: ["services", `service:${slug}`], revalidate: 30 }
  );
}

export async function getPricingItems() {
  return cachedQuery(
    async () => {
      await connectDB();
      const items = await PricingItem.find({ active: true }).sort({ displayOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(items));
    },
    ["pricing-list"],
    { tags: ["pricing"], revalidate: 30 }
  );
}

export async function getPublishedBlogs(
  limit = 12,
  skip = 0,
  opts?: { q?: string; category?: string }
) {
  const q = opts?.q?.trim() || "";
  const category = opts?.category?.trim() || "";
  return cachedQuery(
    async () => {
      await connectDB();
      const filter: Record<string, unknown> = {
        status: "published",
        $or: [{ publishedAt: { $lte: new Date() } }, { publishedAt: null }],
      };
      if (category) filter.category = new RegExp(`^${category}$`, "i");
      if (q) {
        filter.$and = [
          {
            $or: [
              { title: new RegExp(q, "i") },
              { excerpt: new RegExp(q, "i") },
              { tags: new RegExp(q, "i") },
            ],
          },
        ];
      }
      const [posts, total] = await Promise.all([
        BlogPost.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(limit).lean(),
        BlogPost.countDocuments(filter),
      ]);
      return { posts: JSON.parse(JSON.stringify(posts)), total };
    },
    [`blogs-${limit}-${skip}-${q}-${category}`],
    { tags: ["blogs"], revalidate: 30 }
  );
}

export async function getBlogBySlug(slug: string) {
  return cachedQuery(
    async () => {
      await connectDB();
      const post = await BlogPost.findOne({
        slug,
        status: "published",
      }).lean();
      return post ? JSON.parse(JSON.stringify(post)) : null;
    },
    [`blog-${slug}`],
    { tags: ["blogs", `blog:${slug}`], revalidate: 30 }
  );
}

export async function getTestimonials() {
  return cachedQuery(
    async () => {
      await connectDB();
      const items = await Testimonial.find({ active: true }).sort({ displayOrder: 1 }).lean();
      return JSON.parse(JSON.stringify(items));
    },
    ["testimonials"],
    { tags: ["testimonials"], revalidate: 30 }
  );
}
