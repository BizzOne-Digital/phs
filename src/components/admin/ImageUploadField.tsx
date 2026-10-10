"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Replace } from "lucide-react";
import { isMongoUploadUrl, MongoUploadImage } from "@/components/ui/MongoUploadImage";
import { toast } from "sonner";
import { compressImageForUpload } from "@/lib/upload/compress";
import type { UploadFolder } from "@/lib/upload/types";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { cn } from "@/lib/utils";

export interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label?: string;
  className?: string;
  /** When replacing/removing, delete previous Mongo upload if it is an /api/uploads URL */
  deletePrevious?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  folder,
  label = "Image",
  className,
  deletePrevious = true,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const preview = value ? resolveCmsImage(value, "") : "";

  async function maybeDeletePrevious(url?: string) {
    if (!deletePrevious || !url?.startsWith("/api/uploads/")) return;
    try {
      await fetch(url, { method: "DELETE", credentials: "include" });
    } catch {
      /* non-fatal */
    }
  }

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const prepared = await compressImageForUpload(file);
      const form = new FormData();
      form.append("file", prepared);
      form.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || `Upload failed (${res.status})`);
      }

      const previous = value;
      onChange(json.url as string);
      if (previous && previous !== json.url) {
        void maybeDeletePrevious(previous);
      }
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remove() {
    const previous = value;
    onChange("");
    await maybeDeletePrevious(previous);
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50">
        <div className="relative aspect-[16/10] bg-slate-900">
          {preview ? (
            isMongoUploadUrl(preview) ? (
              <MongoUploadImage src={preview} alt={label} fill className="object-cover" sizes="400px" />
            ) : (
              <Image src={preview} alt={label} fill className="object-cover" sizes="400px" />
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
              <ImagePlus className="h-8 w-8 opacity-60" />
              <span className="text-xs">No image</span>
            </div>
          )}
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-sm">
              <Loader2 className="h-7 w-7 animate-spin text-cyan-300" />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 p-3">
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            {preview ? <Replace className="h-3.5 w-3.5" /> : <ImagePlus className="h-3.5 w-3.5" />}
            {preview ? "Replace" : "Upload"}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
          {preview ? (
            <button
              type="button"
              disabled={uploading}
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>

      {value ? (
        <p className="truncate font-mono text-[10px] text-slate-500" title={value}>
          {value}
        </p>
      ) : null}
    </div>
  );
}
