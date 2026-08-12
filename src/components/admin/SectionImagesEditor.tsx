"use client";

import { Plus } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { FieldLabel, TextInput } from "@/components/admin/AdminForm";
import type { UploadFolder } from "@/lib/upload/types";

export type SectionImage = { url: string; alt?: string; publicId?: string };

export function SectionImagesEditor({
  images = [],
  folder = "pages",
  onChange,
  label = "Section images",
}: {
  images?: SectionImage[];
  folder?: UploadFolder;
  onChange: (images: SectionImage[]) => void;
  label?: string;
}) {
  const slots = Math.max(images.length, 1);

  function updateSlot(index: number, patch: Partial<SectionImage>) {
    const next = [...images];
    while (next.length <= index) {
      next.push({ url: "", alt: "" });
    }
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeSlot(index: number) {
    const next = images.filter((_, i) => i !== index);
    onChange(next.length ? next : []);
  }

  return (
    <div className="md:col-span-2">
      <FieldLabel>{label}</FieldLabel>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: slots }).map((_, index) => {
          const current = images[index];
          return (
            <div key={index} className="space-y-2 rounded-2xl border border-white/5 p-3">
              <ImageUploadField
                label={`Image ${index + 1}`}
                folder={folder}
                value={current?.url || ""}
                onChange={(url) => {
                  if (!url) {
                    removeSlot(index);
                    return;
                  }
                  updateSlot(index, {
                    url,
                    alt: current?.alt || `Image ${index + 1}`,
                  });
                }}
              />
              {current?.url ? (
                <div>
                  <FieldLabel>Alt text</FieldLabel>
                  <TextInput
                    value={current.alt || ""}
                    onChange={(e) => updateSlot(index, { alt: e.target.value })}
                    placeholder="Describe this image"
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onChange([...images, { url: "", alt: `Image ${images.length + 1}` }])}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
      >
        <Plus className="h-3.5 w-3.5" />
        Add image slot
      </button>
    </div>
  );
}
