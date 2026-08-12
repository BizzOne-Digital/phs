"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Eye, EyeOff, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { deferEffect } from "@/lib/defer-effect";
import { PageHeader, AdminCard, FieldLabel, TextInput, TextTextarea, TextSelect } from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SectionImagesEditor } from "@/components/admin/SectionImagesEditor";

interface Section {
  _id?: string;
  key: string;
  type: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryCtaLabel?: string;
  secondaryCtaUrl?: string;
  background?: string;
  layoutVariant?: string;
  visible: boolean;
  order: number;
  images?: { url: string; alt?: string; publicId?: string }[];
}

interface PageDoc {
  _id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections: Section[];
}

function SortableSection({
  section,
  index,
  expanded,
  onToggleExpand,
  onChange,
  onToggleVisible,
}: {
  section: Section;
  index: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onChange: (patch: Partial<Section>) => void;
  onToggleVisible: () => void;
}) {
  const id = section._id || section.key || String(index);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-2xl border border-white/10 bg-slate-950/40"
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-3 py-3">
        <button
          type="button"
          className="cursor-grab rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-200 active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-100">
            {section.heading || section.key}
          </p>
          <p className="text-[11px] text-slate-500">
            {section.type} · order {index + 1}
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleVisible}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-cyan-300"
          aria-label={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={onToggleExpand}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded ? (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          <div>
            <FieldLabel>Eyebrow</FieldLabel>
            <TextInput
              value={section.eyebrow || ""}
              onChange={(e) => onChange({ eyebrow: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Heading</FieldLabel>
            <TextInput
              value={section.heading || ""}
              onChange={(e) => onChange({ heading: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Subheading</FieldLabel>
            <TextInput
              value={section.subheading || ""}
              onChange={(e) => onChange({ subheading: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Body</FieldLabel>
            <TextTextarea
              value={section.body || ""}
              onChange={(e) => onChange({ body: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Bullets (one per line)</FieldLabel>
            <TextTextarea
              value={(section.bullets || []).join("\n")}
              onChange={(e) =>
                onChange({
                  bullets: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
          <div>
            <FieldLabel>CTA label</FieldLabel>
            <TextInput
              value={section.ctaLabel || ""}
              onChange={(e) => onChange({ ctaLabel: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>CTA URL</FieldLabel>
            <TextInput
              value={section.ctaUrl || ""}
              onChange={(e) => onChange({ ctaUrl: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Secondary CTA</FieldLabel>
            <TextInput
              value={section.secondaryCtaLabel || ""}
              onChange={(e) => onChange({ secondaryCtaLabel: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Secondary URL</FieldLabel>
            <TextInput
              value={section.secondaryCtaUrl || ""}
              onChange={(e) => onChange({ secondaryCtaUrl: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Layout variant</FieldLabel>
            <TextInput
              value={section.layoutVariant || ""}
              onChange={(e) => onChange({ layoutVariant: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Background</FieldLabel>
            <TextInput
              value={section.background || ""}
              onChange={(e) => onChange({ background: e.target.value })}
            />
          </div>
          <SectionImagesEditor
            images={section.images}
            folder="pages"
            onChange={(images) => onChange({ images })}
          />
        </div>
      ) : null}
    </div>
  );
}

export default function AdminPageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [page, setPage] = useState<PageDoc | null>(null);
  const [snapshot, setSnapshot] = useState<PageDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [restoreOpen, setRestoreOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ page: PageDoc }>(`/api/pages/${slug}`);
      const sorted = {
        ...data.page,
        sections: [...(data.page.sections || [])].sort((a, b) => a.order - b.order),
      };
      setPage(sorted);
      setSnapshot(JSON.parse(JSON.stringify(sorted)));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load page");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    deferEffect(() => {
      void load();
    });
  }, [load]);

  const dirty = useMemo(() => {
    if (!page || !snapshot) return false;
    return JSON.stringify(page) !== JSON.stringify(snapshot);
  }, [page, snapshot]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const ids = useMemo(
    () => (page?.sections || []).map((s, i) => s._id || s.key || String(i)),
    [page]
  );

  function onDragEnd(event: DragEndEvent) {
    if (!page) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const sections = arrayMove(page.sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      order: i,
    }));
    setPage({ ...page, sections });
  }

  async function save(status?: "draft" | "published") {
    if (!page) return;
    setSaving(true);
    try {
      const payload = {
        title: page.title,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        ogImage: page.ogImage,
        status: status || page.status,
        sections: page.sections.map((s, i) => ({
          ...s,
          order: i,
          images: (s.images || []).filter((img) => img.url?.trim()),
        })),
      };
      const data = await adminFetch<{ page: PageDoc }>(`/api/pages/${slug}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const sorted = {
        ...data.page,
        sections: [...(data.page.sections || [])].sort((a, b) => a.order - b.order),
      };
      setPage(sorted);
      setSnapshot(JSON.parse(JSON.stringify(sorted)));
      toast.success(status === "published" ? "Published" : "Draft saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!page) {
    return <EmptyState title="Page not found" description={`No page with slug “${slug}”`} />;
  }

  return (
    <div>
      <PageHeader
        title={page.title}
        description={`Editing /${slug === "home" ? "" : slug}${dirty ? " · unsaved changes" : ""}`}
        actions={
          <>
            <button
              type="button"
              onClick={() => setRestoreOpen(true)}
              disabled={!dirty}
              className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" /> Restore
            </button>
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

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <AdminCard title="SEO" className="lg:col-span-2">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <FieldLabel>Title</FieldLabel>
              <TextInput
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>SEO title</FieldLabel>
              <TextInput
                value={page.seoTitle || ""}
                onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>OG image</FieldLabel>
              <ImageUploadField
                folder="pages"
                label=""
                value={page.ogImage || ""}
                onChange={(url) => setPage({ ...page, ogImage: url || undefined })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>SEO description</FieldLabel>
              <TextTextarea
                value={page.seoDescription || ""}
                onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>
        <AdminCard title="Status">
          <FieldLabel>Publish status</FieldLabel>
          <TextSelect
            value={page.status}
            onChange={(e) =>
              setPage({ ...page, status: e.target.value as "draft" | "published" })
            }
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </TextSelect>
        </AdminCard>
      </div>

      <AdminCard title="Sections">
        {page.sections.length === 0 ? (
          <EmptyState title="No sections" className="border-0 bg-transparent py-8" />
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={ids} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {page.sections.map((section, index) => {
                  const id = section._id || section.key || String(index);
                  return (
                    <SortableSection
                      key={id}
                      section={section}
                      index={index}
                      expanded={!!expanded[id]}
                      onToggleExpand={() =>
                        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
                      }
                      onToggleVisible={() => {
                        const sections = [...page.sections];
                        sections[index] = {
                          ...sections[index],
                          visible: !sections[index].visible,
                        };
                        setPage({ ...page, sections });
                      }}
                      onChange={(patch) => {
                        const sections = [...page.sections];
                        sections[index] = { ...sections[index], ...patch };
                        setPage({ ...page, sections });
                      }}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </AdminCard>

      <ConfirmDialog
        open={restoreOpen}
        title="Restore unsaved changes?"
        description="This will discard your current edits and restore the last saved version."
        confirmLabel="Restore"
        variant="emergency"
        onCancel={() => setRestoreOpen(false)}
        onConfirm={() => {
          if (snapshot) setPage(JSON.parse(JSON.stringify(snapshot)));
          setRestoreOpen(false);
          toast.message("Restored last saved version");
        }}
      />
    </div>
  );
}
