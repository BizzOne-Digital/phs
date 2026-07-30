import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/data";
import { FALLBACK_BLOGS, withFallback } from "@/lib/constants";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { sanitizeHtml } from "@/lib/sanitize";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { SITE_IMAGES } from "@/lib/site-images";
import type { BlogPost } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let post: BlogPost | null = null;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    post = FALLBACK_BLOGS.find((b) => b.slug === slug) || null;
  }
  if (!post) post = FALLBACK_BLOGS.find((b) => b.slug === slug) || null;
  if (!post) return { title: "Article" };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: post.featuredImage?.url || post.ogImage ? [post.featuredImage?.url || post.ogImage!] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post =
    (await withFallback(() => getBlogBySlug(slug), null as BlogPost | null)) ||
    FALLBACK_BLOGS.find((b) => b.slug === slug) ||
    null;

  if (!post) notFound();

  const relatedData = await withFallback(
    () => getPublishedBlogs(6, 0, { category: post.category }),
    { posts: FALLBACK_BLOGS, total: FALLBACK_BLOGS.length }
  );
  const related = (relatedData.posts as BlogPost[])
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const html = sanitizeHtml(post.content || "");
  const url = absoluteUrl(`/blog/${post.slug}`);
  const featuredUrl =
    SITE_IMAGES.blog.featured[post.slug] ||
    resolveCmsImage(post.featuredImage?.url, SITE_IMAGES.home.aboutTools);
  const inline = SITE_IMAGES.blog.inline[post.slug] || [];
  const gallery = [
    { url: featuredUrl, alt: post.featuredImage?.alt || post.title },
    ...inline.map((src, i) => ({ url: src, alt: `${post.title} image ${i + 1}` })),
    ...(post.inlineImages || []).map((img: { url?: string; alt?: string }, i: number) => ({
      url: resolveCmsImage(img.url),
      alt: img.alt || `${post.title} ${i + 1}`,
    })),
    { url: PLACEHOLDER_IMAGES.tools, alt: IMAGE_ALTS.tools },
    { url: PLACEHOLDER_IMAGES.torontoSkyline, alt: IMAGE_ALTS.torontoSkyline },
    { url: PLACEHOLDER_IMAGES.safetyGear, alt: IMAGE_ALTS.safetyGear },
  ].filter(Boolean) as { url: string; alt: string }[];

  // Dedupe by url while keeping order
  const seen = new Set<string>();
  const uniqueGallery = gallery.filter((g) => {
    if (!g.url || seen.has(g.url)) return false;
    seen.add(g.url);
    return true;
  });

  return (
    <div>
      <article>
        <section className="section-pad pb-8 pt-10">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
            <div className="mx-auto mt-8 max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Badge variant="cyan">{post.category}</Badge>
                {post.publishedAt ? (
                  <span className="text-sm text-slate-500">{formatDate(post.publishedAt)}</span>
                ) : null}
                {post.readingTimeMinutes ? (
                  <span className="text-sm text-slate-500">{post.readingTimeMinutes} min read</span>
                ) : null}
              </div>
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-white sm:text-4xl md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-slate-300">{post.excerpt}</p>
              <p className="mt-3 text-sm text-slate-500">By {post.author || "VNEC Team"}</p>
            </div>
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <div className="relative mx-auto aspect-[21/9] max-w-5xl overflow-hidden rounded-3xl">
              <Image
                src={featuredUrl}
                alt={post.featuredImage?.alt || post.title}
                fill
                priority
                unoptimized={featuredUrl.startsWith("/api/uploads/")}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </Container>
        </section>

        <section className="section-pad pt-0">
          <Container>
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_280px]">
              <div
                className="prose prose-invert max-w-none prose-headings:font-display prose-a:text-cyan prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <aside className="space-y-6">
                <div className="glass sticky top-28 rounded-2xl p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Share</p>
                  <BlogShareButtons title={post.title} url={url} />
                </div>
                <div className="grid gap-3">
                  {uniqueGallery.slice(1, 4).map((img, i) => (
                    <div key={`${img.url}-${i}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="280px" />
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </article>

      {related.length > 0 ? (
        <section className="section-pad">
          <Container>
            <SectionHeading eyebrow="Related" title="More articles" className="mb-8" />
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="glass electric-border overflow-hidden rounded-2xl transition hover:border-cyan/40"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={resolveCmsImage(r.featuredImage?.url, PLACEHOLDER_IMAGES.tools)}
                      alt={r.featuredImage?.alt || r.title}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wide text-cyan">{r.category}</p>
                    <h3 className="mt-2 font-display text-lg text-white">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section-pad pt-0">
        <Container>
          <div className="relative overflow-hidden rounded-3xl">
            <Image src={SITE_IMAGES.blog.detailCta} alt={IMAGE_ALTS.nightCity} fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-[#050a14]/80" />
            <div className="relative px-8 py-14 text-center">
              <h2 className="font-display text-3xl text-white">Need help with a real issue?</h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-300">
                Request service from licensed VNEC technicians across the Greater Toronto Area.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/request-service" className="btn-primary">Request Service</Link>
                <Link href="/contact" className="btn-secondary">Contact Us</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
