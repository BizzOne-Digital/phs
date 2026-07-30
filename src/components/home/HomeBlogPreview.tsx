import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import type { BlogPost } from "@/types";
import { resolveCmsImage } from "@/lib/upload/resolve";

export function HomeBlogPreview({ posts }: { posts: BlogPost[] }) {
  const list = (posts || []).slice(0, 3);

  return (
    <Section>
      <Container className="px-4">
        <Reveal>
          <SectionHeading
            eyebrow="From the blog"
            title="Practical guidance for GTA property owners"
            description="Safety-focused tips—never unsafe DIY repair instructions."
            align="center"
          />
        </Reveal>

        {list.length > 0 ? (
          <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
            {list.map((post, i) => {
              const src = resolveCmsImage(post.featuredImage?.url, PLACEHOLDER_IMAGES.tools);
              return (
              <Reveal key={post._id || post.slug || i} delay={i * 0.08} className="h-full">
                <article className="glass electric-border flex h-full flex-col overflow-hidden rounded-2xl">
                  <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                    <div className="relative aspect-[16/10] shrink-0 bg-navy/80">
                      <Image
                        src={src}
                        alt={post.featuredImage?.alt || post.title || IMAGE_ALTS.tools}
                        fill
                        unoptimized={src.startsWith("/api/uploads/")}
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs uppercase tracking-wider text-cyan">
                        {post.category}
                      </p>
                      <h3 className="font-display mt-2 text-lg font-bold text-white">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 line-clamp-3 text-sm text-muted">
                        {post.excerpt}
                      </p>
                      {post.publishedAt ? (
                        <p className="mt-4 text-xs text-muted">
                          {formatDate(post.publishedAt)}
                        </p>
                      ) : null}
                    </div>
                  </Link>
                </article>
              </Reveal>
            );
            })}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-muted">
            Blog articles will appear here once published in the admin portal.
          </p>
        )}

        <div className="mt-10 text-center">
          <Button href="/blog" variant="secondary">
            View all articles
          </Button>
        </div>
      </Container>
    </Section>
  );
}
