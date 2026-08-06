"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatDate, readingTime } from "@/lib/utils";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import type { BlogPost } from "@/types";
import { Button } from "@/components/ui/Button";
import { resolveCmsImage } from "@/lib/upload/resolve";

const PAGE_SIZE = 6;

export function BlogListingClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = category === "all" || p.category === category;
      const qOk =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q));
      return catOk && qOk;
    });
  }, [posts, query, category]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const totalPages = Math.max(1, Math.ceil(rest.length / PAGE_SIZE));
  const pageItems = rest.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles..."
            className="w-full rounded-full border border-electric/25 bg-deep/60 py-3 pl-10 pr-4 text-sm outline-none focus:border-cyan/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize ${
                category === c
                  ? "border-cyan/50 bg-cyan/15 text-cyan"
                  : "border-electric/20 text-silver"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {featured ? (
        <article className="glass electric-border mt-10 overflow-hidden rounded-3xl md:grid md:grid-cols-2">
          <Link href={`/blog/${featured.slug}`} className="relative block aspect-[16/10] md:aspect-auto md:min-h-[320px]">
            <Image
              src={resolveCmsImage(featured.featuredImage?.url, PLACEHOLDER_IMAGES.tools)}
              alt={featured.featuredImage?.alt || IMAGE_ALTS.tools}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </Link>
          <div className="flex flex-col justify-center p-8">
            <p className="text-xs uppercase tracking-wider text-cyan">Featured · {featured.category}</p>
            <h2 className="font-display mt-3 text-3xl font-bold text-white">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p className="mt-4 text-muted">{featured.excerpt}</p>
            <p className="mt-4 text-xs text-muted">
              {featured.publishedAt ? formatDate(featured.publishedAt) : ""} ·{" "}
              {featured.readingTimeMinutes || readingTime(featured.content)} min read
            </p>
            <Button href={`/blog/${featured.slug}`} className="mt-6 w-fit" variant="secondary">
              Read article
            </Button>
          </div>
        </article>
      ) : (
        <p className="mt-12 text-center text-muted">No articles match your filters.</p>
      )}

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pageItems.map((post) => (
          <article key={post._id} className="glass overflow-hidden rounded-2xl">
            <Link href={`/blog/${post.slug}`}>
              <div className="relative aspect-[16/10]">
                <Image
                  src={resolveCmsImage(post.featuredImage?.url, PLACEHOLDER_IMAGES.tools)}
                  alt={post.featuredImage?.alt || IMAGE_ALTS.tools}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wider text-cyan">{post.category}</p>
                <h3 className="font-display mt-2 text-lg font-bold text-white">{post.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted">
                  {post.publishedAt ? formatDate(post.publishedAt) : ""} ·{" "}
                  {post.readingTimeMinutes || readingTime(post.content)} min
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
}
