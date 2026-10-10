"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { isMongoUploadUrl, MongoUploadImage } from "@/components/ui/MongoUploadImage";
import { Upload, Trash2, Search, Copy } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { deferEffect } from "@/lib/defer-effect";
import { compressImageForUpload } from "@/lib/upload/compress";
import { resolveCmsImage } from "@/lib/upload/resolve";
import {
  PageHeader,
  AdminCard,
  TextInput,
} from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface MediaAsset {
  _id: string;
  url: string;
  alt: string;
  filename?: string;
  format?: string;
  bytes?: number;
  folder?: string;
  createdAt?: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteUrl, setDeleteUrl] = useState<string | null>(null);

  const load = useCallback(async (query = q) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "60" });
      if (query.trim()) params.set("q", query.trim());
      const data = await adminFetch<{ assets: MediaAsset[] }>(`/api/media?${params}`);
      setAssets(data.assets);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    deferEffect(() => {
      void load("");
    });
  }, [load]);

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const prepared = await compressImageForUpload(file);
        const form = new FormData();
        form.append("file", prepared);
        form.append("folder", "gallery");
        form.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));

        const res = await fetch("/api/upload", { method: "POST", body: form });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Upload failed");
      }
      toast.success("Upload complete");
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId && !deleteUrl) return;
    try {
      const params = new URLSearchParams();
      if (deleteUrl) params.set("url", deleteUrl);
      else if (deleteId) params.set("id", deleteId);
      await adminFetch(`/api/media?${params}`, { method: "DELETE" });
      toast.success("Media deleted");
      setDeleteId(null);
      setDeleteUrl(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Unable to copy");
    }
  }

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Images are stored in MongoDB and served from /api/uploads — works on Vercel without Cloudinary."
        actions={
          <label className="btn-primary cursor-pointer !px-4 !py-2 text-sm">
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                onUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        }
      />

      <AdminCard className="mb-6">
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            load(q);
          }}
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <TextInput
              className="pl-9"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by filename..."
            />
          </div>
          <button type="submit" className="btn-secondary !px-4 !py-2 text-sm">
            Search
          </button>
        </form>
      </AdminCard>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          title="No media yet"
          description="Upload images to use in services, blogs, and pages."
          icon={<Upload className="h-6 w-6" />}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => {
            const src = resolveCmsImage(asset.url, "");
            return (
              <AdminCard key={asset._id} className="!p-3">
                <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl bg-slate-900">
                  {src ? (
                    isMongoUploadUrl(src) ? (
                      <MongoUploadImage
                        src={src}
                        alt={asset.alt || "Media"}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    ) : (
                      <Image
                        src={src}
                        alt={asset.alt || "Media"}
                        fill
                        className="object-cover"
                        sizes="33vw"
                      />
                    )
                  ) : null}
                </div>
                <p className="truncate text-xs text-slate-500">{asset.filename || asset._id}</p>
                <p className="mt-1 truncate font-mono text-[10px] text-slate-600">{asset.url}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset.url)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-cyan-400/40"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteId(asset._id);
                      setDeleteUrl(asset.url);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId || !!deleteUrl}
        title="Delete this media asset?"
        description="This removes the image from MongoDB. Pages still referencing the URL will need a replacement image."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => {
          setDeleteId(null);
          setDeleteUrl(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
