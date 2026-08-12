"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import { adminFetch } from "@/lib/admin-client";
import { formatDate } from "@/lib/utils";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface PageItem {
  _id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  sections?: unknown[];
}

export default function AdminPagesListPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ pages: PageItem[] }>("/api/pages")
      .then((d) => setPages(d.pages ?? []))
      .catch((e) => {
        console.error("Failed to load pages:", e);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title="Pages"
        description="Edit section content, SEO, and publish status for public pages"
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <EmptyState
          title="No pages yet"
          description="Seed the database to create home, about, and other CMS pages."
          icon={<FileText className="h-6 w-6" />}
        />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-white/5">
            {pages.map((page) => (
              <li
                key={page._id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="font-medium text-slate-100 hover:text-cyan-300"
                  >
                    {page.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    /{page.slug === "home" ? "" : page.slug} · {page.sections?.length ?? 0} sections ·
                    updated {formatDate(page.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${
                      page.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {page.status}
                  </span>
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                  >
                    Edit
                  </Link>
                  <a
                    href={page.slug === "home" ? "/" : `/${page.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 p-2 text-slate-400 hover:text-cyan-300"
                    aria-label="View page"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  );
}
