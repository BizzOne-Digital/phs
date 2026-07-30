"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { createSlug } from "@/lib/utils";
import {
  PageHeader,
  AdminCard,
  FieldLabel,
  TextInput,
  TextTextarea,
  TextSelect,
} from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export interface BlogFormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: { url: string; alt: string; publicId?: string };
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  status: "draft" | "published" | "scheduled";
  publishedAt?: string;
}

const defaultForm: BlogFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "VNEC Team",
  category: "Tips",
  tags: [],
  status: "draft",
};

export function BlogEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<BlogFormState>(defaultForm);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    adminFetch<{ post: BlogFormState & { _id: string; publishedAt?: string } }>(`/api/blogs/${id}`)
      .then((d) => {
        setForm({
          title: d.post.title,
          slug: d.post.slug,
          excerpt: d.post.excerpt,
          content: d.post.content,
          author: d.post.author || "VNEC Team",
          category: d.post.category,
          tags: d.post.tags || [],
          featuredImage: d.post.featuredImage,
          metaTitle: d.post.metaTitle,
          metaDescription: d.post.metaDescription,
          ogImage: d.post.ogImage,
          status: d.post.status,
          publishedAt: d.post.publishedAt
            ? new Date(d.post.publishedAt).toISOString().slice(0, 16)
            : undefined,
        });
      })
      .catch((e) => toast.error(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function save(nextStatus?: BlogFormState["status"]) {
    if (form.title.length < 3 || form.excerpt.length < 10 || form.content.length < 20) {
      toast.error("Title, excerpt, and content are required");
      return;
    }
    setSaving(true);
    const status = nextStatus || form.status;
    const payload = {
      ...form,
      slug: createSlug(form.slug || form.title),
      status,
      publishedAt: form.publishedAt || undefined,
      tags: form.tags,
    };
    try {
      if (id) {
        await adminFetch(`/api/blogs/${id}`, { method: "PUT", body: JSON.stringify(payload) });
        toast.success(status === "published" ? "Published" : "Saved");
        setForm((f) => ({ ...f, status, slug: payload.slug }));
      } else {
        const data = await adminFetch<{ post: { _id: string } }>("/api/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Post created");
        router.replace(`/admin/blogs/${data.post._id}`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!id) return;
    try {
      await adminFetch(`/api/blogs/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      router.push("/admin/blogs");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={id ? "Edit post" : "New post"}
        description="HTML content supported in the body"
        actions={
          <>
            {id ? (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300"
              >
                Delete
              </button>
            ) : null}
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="btn-secondary !px-4 !py-2 text-sm"
            >
              Save draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="btn-primary !px-4 !py-2 text-sm"
            >
              Publish
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <AdminCard title="Content">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({
                    ...f,
                    title,
                    slug: f.slug && id ? f.slug : createSlug(title),
                  }));
                }}
              />
            </div>
            <div>
              <FieldLabel>Slug</FieldLabel>
              <TextInput
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <TextInput
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Excerpt</FieldLabel>
              <TextTextarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Content (HTML)</FieldLabel>
              <TextTextarea
                className="min-h-[280px] font-mono text-xs"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="<p>Write your article…</p>"
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Meta">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>Author</FieldLabel>
              <TextInput
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Status</FieldLabel>
              <TextSelect
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value as BlogFormState["status"],
                  })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </TextSelect>
            </div>
            <div>
              <FieldLabel>Publish date</FieldLabel>
              <TextInput
                type="datetime-local"
                value={form.publishedAt || ""}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Tags (comma separated)</FieldLabel>
              <TextInput
                value={form.tags.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="Featured image"
                folder="misc"
                value={form.featuredImage?.url || ""}
                onChange={(url) =>
                  setForm({
                    ...form,
                    featuredImage: url
                      ? {
                          url,
                          alt: form.featuredImage?.alt || form.title,
                          publicId: form.featuredImage?.publicId,
                        }
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>Featured image alt</FieldLabel>
              <TextInput
                value={form.featuredImage?.alt || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    featuredImage: {
                      url: form.featuredImage?.url || "",
                      alt: e.target.value,
                      publicId: form.featuredImage?.publicId,
                    },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>Meta title</FieldLabel>
              <TextInput
                value={form.metaTitle || ""}
                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="OG image"
                folder="misc"
                value={form.ogImage || ""}
                onChange={(url) => setForm({ ...form, ogImage: url || undefined })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Meta description</FieldLabel>
              <TextTextarea
                value={form.metaDescription || ""}
                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete this post?"
        description="This cannot be undone."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={remove}
      />
    </div>
  );
}
