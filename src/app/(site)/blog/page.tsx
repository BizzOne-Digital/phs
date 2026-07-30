import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getPublishedBlogs } from "@/lib/data";
import { FALLBACK_BLOGS, withFallback } from "@/lib/constants";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { formatDate } from "@/lib/utils";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { SITE_IMAGES } from "@/lib/site-images";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical electrical, HVAC, and plumbing guidance for Greater Toronto Area homeowners and property managers from Premier Home Services.",
};

const CATEGORIES = ["All", "Electrical", "HVAC", "Plumbing", "Maintenance"];
const PAGE_SIZE = 9;

type Props = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function BlogListingPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() || "";
  const category = sp.category && sp.category !== "All" ? sp.category : "";
  const page = Math.max(1, Number(sp.page || 1) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  let posts: BlogPost[] = [];
  let total = 0;

  try {
    const data = await getPublishedBlogs(PAGE_SIZE, skip, { q, category });
    posts = data.posts as BlogPost[];
    total = data.total;
  } catch {
    const filtered = FALLBACK_BLOGS.filter((post) => {
      const matchCat = !category || post.category.toLowerCase() === category.toLowerCase();
      const hay = `${post.title} ${post.excerpt} ${(post.tags || []).join(" ")}`.toLowerCase();
      const matchQ = !q || hay.includes(q.toLowerCase());
      return matchCat && matchQ;
    });
    total = filtered.length;
    posts = filtered.slice(skip, skip + PAGE_SIZE);
  }

  if (!posts.length && !q && !category) {
    const fallback = await withFallback(async () => ({ posts: [], total: 0 }), {
      posts: FALLBACK_BLOGS,
      total: FALLBACK_BLOGS.length,
    });
    posts = fallback.posts as BlogPost[];
    total = fallback.total;
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function hrefFor(overrides: { q?: string; category?: string; page?: number }) {
    const params = new URLSearchParams();
    const nextQ = overrides.q ?? q;
    const nextCat = overrides.category ?? category;
    const nextPage = overrides.page ?? page;
    if (nextQ) params.set("q", nextQ);
    if (nextCat) params.set("category", nextCat);
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <div>
      <section className="section-pad pb-10 pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Insights"
              title="Practical tips for GTA properties"
              description="Safety guidance, maintenance ideas, and when to call for professional electrical, HVAC, or plumbing help."
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.blog.hero[0]} alt={IMAGE_ALTS.lighting} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.blog.hero[1]} alt={IMAGE_ALTS.furnace} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.blog.hero[2]} alt={IMAGE_ALTS.pipes} fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <form className="mb-6 flex flex-col gap-3 sm:flex-row" action="/blog" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-electric/25 bg-deep/60 px-4 py-3 text-sm text-foreground outline-none focus:border-cyan/60"
            />
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <button type="submit" className="btn-primary shrink-0 !px-6">
              Search
            </button>
          </form>

          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = (!category && cat === "All") || category === cat;
              return (
                <Link
                  key={cat}
                  href={hrefFor({ category: cat === "All" ? "" : cat, page: 1 })}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    active
                      ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                      : "border-white/10 text-slate-400 hover:border-white/20"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {posts.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-slate-400">
              No articles match your filters.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article key={post._id || post.slug} className="glass electric-border flex h-full flex-col overflow-hidden rounded-3xl">
                  <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] block">
                    <Image
                      src={resolveCmsImage(
                        SITE_IMAGES.blog.featured[post.slug] || post.featuredImage?.url,
                        SITE_IMAGES.home.aboutTools
                      )}
                      alt={post.featuredImage?.alt || post.title}
                      fill
                      unoptimized={Boolean(post.featuredImage?.url?.startsWith("/api/uploads/"))}
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge variant="cyan">{post.category}</Badge>
                      {post.publishedAt ? (
                        <span className="text-xs text-slate-500">{formatDate(post.publishedAt)}</span>
                      ) : null}
                    </div>
                    <h2 className="font-display text-xl text-white">
                      <Link href={`/blog/${post.slug}`} className="hover:text-cyan">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="mt-4 text-sm font-semibold text-cyan">
                      Read article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <Link
                    key={n}
                    href={hrefFor({ page: n })}
                    className={`rounded-full px-4 py-2 text-sm ${
                      n === page
                        ? "bg-cyan-400/20 text-cyan-200"
                        : "border border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {n}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </Container>
      </section>

      <section className="section-pad">
        <Container className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image src={SITE_IMAGES.blog.footer[0]} alt={IMAGE_ALTS.torontoSkyline} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
            <Image src={SITE_IMAGES.blog.footer[1]} alt={IMAGE_ALTS.emergencyResponse} fill className="object-cover" sizes="50vw" />
          </div>
        </Container>
      </section>
    </div>
  );
}
