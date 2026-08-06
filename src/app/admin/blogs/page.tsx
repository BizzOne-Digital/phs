"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { formatDate } from "@/lib/utils";
import { PageHeader, AdminCard, TextSelect } from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  status: string;
  category: string;
  updatedAt: string;
  publishedAt?: string;
}

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const qs = status ? `?status=${status}` : "";
      const data = await adminFetch<{ posts: BlogPost[] }>(`/api/blogs${qs}`);
      setPosts(data.posts);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      toast.success("Post deleted");
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="Create and publish articles"
        actions={
          <>
            <TextSelect
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="!w-auto min-w-[140px]"
            >
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </TextSelect>
            <Link href="/admin/blogs/new" className="btn-primary !px-4 !py-2 text-sm">
              <Plus className="h-4 w-4" /> New post
            </Link>
          </>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No blog posts"
          description="Write your first article for homeowners and property managers."
          icon={<Newspaper className="h-6 w-6" />}
          action={
            <Link href="/admin/blogs/new" className="btn-primary text-sm">
              Create post
            </Link>
          }
        />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-white/5">
            {posts.map((post) => (
              <li
                key={post._id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/admin/blogs/${post._id}`}
                    className="font-medium text-slate-100 hover:text-cyan-300"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {post.category} · /{post.slug} · updated {formatDate(post.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${
                      post.status === "published"
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {post.status}
                  </span>
                  <Link
                    href={`/admin/blogs/${post._id}`}
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteId(post._id)}
                    className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete blog post?"
        description="This permanently removes the article."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
