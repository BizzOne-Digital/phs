"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { deferEffect } from "@/lib/defer-effect";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

interface ServiceDoc {
  _id: string;
  name: string;
  slug: string;
  category: "electrical" | "hvac" | "plumbing";
  isEmergency: boolean;
  shortDescription: string;
  fullDescription: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: { url: string; alt: string; publicId?: string };
  gallery?: { url: string; alt: string; publicId?: string }[];
  commonProblems?: string[];
  inclusions?: string[];
  residentialApps?: string[];
  commercialApps?: string[];
  whyProfessional?: string;
  safetyStatement?: string;
  processSteps?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  relatedServiceSlugs?: string[];
  startingPriceLabel?: string;
  ctaLabel?: string;
  seoTitle?: string;
  seoDescription?: string;
  displayOrder?: number;
  active?: boolean;
}

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminServiceEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<{ service: ServiceDoc }>(`/api/services/${id}`);
      setService(data.service);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    deferEffect(() => {
      void load();
    });
  }, [load]);

  async function save() {
    if (!service) return;
    setSaving(true);
    try {
      const data = await adminFetch<{ service: ServiceDoc }>(`/api/services/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...service,
          slug: createSlug(service.slug || service.name),
        }),
      });
      setService(data.service);
      toast.success("Service saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    try {
      await adminFetch(`/api/services/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      router.push("/admin/services");
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

  if (!service) return <EmptyState title="Service not found" />;

  return (
    <div>
      <PageHeader
        title={service.name}
        description="Full service page editor"
        actions={
          <>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300"
            >
              Delete
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={save}
              className="btn-primary !px-4 !py-2 text-sm"
            >
              Save
            </button>
          </>
        }
      />

      <div className="space-y-6">
        <AdminCard title="Basics">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>Name</FieldLabel>
              <TextInput
                value={service.name}
                onChange={(e) => setService({ ...service, name: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Slug</FieldLabel>
              <TextInput
                value={service.slug}
                onChange={(e) => setService({ ...service, slug: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Category</FieldLabel>
              <TextSelect
                value={service.category}
                onChange={(e) =>
                  setService({
                    ...service,
                    category: e.target.value as ServiceDoc["category"],
                  })
                }
              >
                <option value="electrical">Electrical</option>
                <option value="hvac">HVAC</option>
                <option value="plumbing">Plumbing</option>
              </TextSelect>
            </div>
            <div>
              <FieldLabel>Display order</FieldLabel>
              <TextInput
                type="number"
                value={service.displayOrder ?? 0}
                onChange={(e) =>
                  setService({ ...service, displayOrder: Number(e.target.value) })
                }
              />
            </div>
            <div className="flex items-center gap-6 md:col-span-2">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={!!service.isEmergency}
                  onChange={(e) => setService({ ...service, isEmergency: e.target.checked })}
                />
                Emergency service
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={service.active !== false}
                  onChange={(e) => setService({ ...service, active: e.target.checked })}
                />
                Active
              </label>
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Short description</FieldLabel>
              <TextTextarea
                value={service.shortDescription}
                onChange={(e) => setService({ ...service, shortDescription: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>Full description</FieldLabel>
              <TextTextarea
                className="min-h-[140px]"
                value={service.fullDescription}
                onChange={(e) => setService({ ...service, fullDescription: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Hero & CTA">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>Hero heading</FieldLabel>
              <TextInput
                value={service.heroHeading || ""}
                onChange={(e) => setService({ ...service, heroHeading: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Hero subheading</FieldLabel>
              <TextInput
                value={service.heroSubheading || ""}
                onChange={(e) => setService({ ...service, heroSubheading: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <ImageUploadField
                label="Hero image"
                folder="products"
                value={service.heroImage?.url || ""}
                onChange={(url) =>
                  setService({
                    ...service,
                    heroImage: url
                      ? {
                          url,
                          alt: service.heroImage?.alt || service.name,
                          publicId: service.heroImage?.publicId,
                        }
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>Hero image alt</FieldLabel>
              <TextInput
                value={service.heroImage?.alt || ""}
                onChange={(e) =>
                  setService({
                    ...service,
                    heroImage: {
                      url: service.heroImage?.url || "",
                      alt: e.target.value,
                      publicId: service.heroImage?.publicId,
                    },
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>Starting price label</FieldLabel>
              <TextInput
                value={service.startingPriceLabel || ""}
                onChange={(e) => setService({ ...service, startingPriceLabel: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>CTA label</FieldLabel>
              <TextInput
                value={service.ctaLabel || ""}
                onChange={(e) => setService({ ...service, ctaLabel: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Gallery images">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((slot) => {
              const images = service.gallery || [];
              const current = images[slot]?.url || "";
              return (
                <ImageUploadField
                  key={slot}
                  label={`Gallery ${slot + 1}`}
                  folder="gallery"
                  value={current}
                  onChange={(url) => {
                    const next = [...(service.gallery || [])];
                    while (next.length <= slot) {
                      next.push({ url: "", alt: service.name });
                    }
                    if (!url) {
                      next.splice(slot, 1);
                    } else {
                      next[slot] = {
                        url,
                        alt: next[slot]?.alt || service.name,
                      };
                    }
                    setService({
                      ...service,
                      gallery: next.filter((img) => img.url),
                    });
                  }}
                />
              );
            })}
          </div>
        </AdminCard>

        <AdminCard title="Lists (one per line)">
          <div className="grid gap-3 md:grid-cols-2">
            {(
              [
                ["commonProblems", "Common problems"],
                ["inclusions", "Inclusions"],
                ["residentialApps", "Residential applications"],
                ["commercialApps", "Commercial applications"],
                ["relatedServiceSlugs", "Related service slugs"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <TextTextarea
                  value={(service[key] || []).join("\n")}
                  onChange={(e) =>
                    setService({ ...service, [key]: linesToArray(e.target.value) })
                  }
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Copy blocks">
          <div className="grid gap-3">
            <div>
              <FieldLabel>Why professional</FieldLabel>
              <TextTextarea
                value={service.whyProfessional || ""}
                onChange={(e) => setService({ ...service, whyProfessional: e.target.value })}
              />
            </div>
            <div>
              <FieldLabel>Safety statement</FieldLabel>
              <TextTextarea
                value={service.safetyStatement || ""}
                onChange={(e) => setService({ ...service, safetyStatement: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Process steps (title | description per line)">
          <TextTextarea
            className="min-h-[120px]"
            value={(service.processSteps || [])
              .map((s) => `${s.title} | ${s.description}`)
              .join("\n")}
            onChange={(e) =>
              setService({
                ...service,
                processSteps: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [title, ...rest] = line.split("|");
                    return {
                      title: (title || "").trim(),
                      description: rest.join("|").trim() || "Step detail",
                    };
                  }),
              })
            }
          />
        </AdminCard>

        <AdminCard title="FAQs (question | answer per line)">
          <TextTextarea
            className="min-h-[120px]"
            value={(service.faqs || [])
              .map((f) => `${f.question} | ${f.answer}`)
              .join("\n")}
            onChange={(e) =>
              setService({
                ...service,
                faqs: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [question, ...rest] = line.split("|");
                    return {
                      question: (question || "").trim(),
                      answer: rest.join("|").trim() || "Answer",
                    };
                  }),
              })
            }
          />
        </AdminCard>

        <AdminCard title="SEO">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <FieldLabel>SEO title</FieldLabel>
              <TextInput
                value={service.seoTitle || ""}
                onChange={(e) => setService({ ...service, seoTitle: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <FieldLabel>SEO description</FieldLabel>
              <TextTextarea
                value={service.seoDescription || ""}
                onChange={(e) => setService({ ...service, seoDescription: e.target.value })}
              />
            </div>
          </div>
        </AdminCard>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete service?"
        description="This permanently removes the service."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteOpen(false)}
        onConfirm={remove}
      />
    </div>
  );
}
