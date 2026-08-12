"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { deferEffect } from "@/lib/defer-effect";
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

interface PricingItem {
  _id: string;
  serviceName: string;
  category: "electrical" | "hvac" | "plumbing";
  startingPrice: string;
  priceRange?: string;
  description?: string;
  included?: string[];
  excluded?: string[];
  featured?: boolean;
  isEmergency?: boolean;
  displayOrder: number;
  active?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
  linkedServiceSlug?: string;
  disclaimer?: string;
}

const emptyForm: Omit<PricingItem, "_id" | "displayOrder"> = {
  serviceName: "",
  category: "electrical",
  startingPrice: "Contact for starting price",
  priceRange: "",
  description: "",
  included: [],
  excluded: [],
  featured: false,
  isEmergency: false,
  active: true,
  ctaLabel: "Request Service",
  ctaUrl: "/request-service",
  linkedServiceSlug: "",
};

function SortableRow({
  item,
  onEdit,
  onDelete,
}: {
  item: PricingItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item._id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 border-b border-white/5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-0.5 cursor-grab rounded p-1 text-slate-500 hover:bg-white/5"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div>
          <p className="font-medium text-slate-100">{item.serviceName}</p>
          <p className="text-xs capitalize text-slate-500">
            {item.category} · {item.startingPrice}
            {item.featured ? " · featured" : ""}
            {item.isEmergency ? " · emergency" : ""}
          </p>
        </div>
      </div>
      <div className="flex gap-2 pl-8 sm:pl-0">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-cyan-300"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-red-500/30 p-2 text-red-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

export default function AdminPricingPage() {
  const [items, setItems] = useState<PricingItem[]>([]);
  const [disclaimer, setDisclaimer] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<(Partial<PricingItem> & { _id?: string }) | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const ids = useMemo(() => items.map((i) => i._id), [items]);

  async function load() {
    setLoading(true);
    try {
      const [pricing, settings] = await Promise.all([
        adminFetch<{ items: PricingItem[] }>("/api/pricing"),
        adminFetch<{ settings: { pricingDisclaimer?: string } }>("/api/settings"),
      ]);
      setItems(pricing.items.sort((a, b) => a.displayOrder - b.displayOrder));
      setDisclaimer(settings.settings.pricingDisclaimer || "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    deferEffect(() => {
      void load();
    });
  }, []);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = arrayMove(items, oldIndex, newIndex).map((item, i) => ({
      ...item,
      displayOrder: i,
    }));
    setItems(next);
    try {
      await Promise.all(
        next.map((item) =>
          adminFetch(`/api/pricing/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({ displayOrder: item.displayOrder }),
          })
        )
      );
      toast.success("Order updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Reorder failed");
      load();
    }
  }

  async function saveItem() {
    if (!editing?.serviceName) {
      toast.error("Service name required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        serviceName: editing.serviceName,
        category: editing.category || "electrical",
        startingPrice: editing.startingPrice || "Contact for starting price",
        priceRange: editing.priceRange,
        description: editing.description,
        included: editing.included || [],
        excluded: editing.excluded || [],
        featured: !!editing.featured,
        isEmergency: !!editing.isEmergency,
        active: editing.active !== false,
        ctaLabel: editing.ctaLabel,
        ctaUrl: editing.ctaUrl,
        linkedServiceSlug: editing.linkedServiceSlug,
        displayOrder: editing.displayOrder ?? items.length,
      };
      if (editing._id) {
        await adminFetch(`/api/pricing/${editing._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Pricing card updated");
      } else {
        await adminFetch("/api/pricing", { method: "POST", body: JSON.stringify(payload) });
        toast.success("Pricing card created");
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveDisclaimer() {
    try {
      await adminFetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ pricingDisclaimer: disclaimer }),
      });
      toast.success("Disclaimer saved");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/pricing/${deleteId}`, { method: "DELETE" });
      toast.success("Deleted");
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Pricing"
        description="Manage pricing cards and the public disclaimer"
        actions={
          <button
            type="button"
            onClick={() => setEditing({ ...emptyForm })}
            className="btn-primary !px-4 !py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> Add card
          </button>
        }
      />

      {loading ? (
        <Skeleton className="h-64" />
      ) : (
        <div className="space-y-6">
          <AdminCard title="Pricing cards">
            {items.length === 0 ? (
              <EmptyState title="No pricing cards" className="border-0 bg-transparent py-8" />
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                  <ul>
                    {items.map((item) => (
                      <SortableRow
                        key={item._id}
                        item={item}
                        onEdit={() => setEditing(item)}
                        onDelete={() => setDeleteId(item._id)}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            )}
          </AdminCard>

          <AdminCard
            title="Pricing disclaimer"
            action={
              <button type="button" onClick={saveDisclaimer} className="btn-secondary !px-3 !py-1.5 text-xs">
                Save disclaimer
              </button>
            }
          >
            <TextTextarea
              value={disclaimer}
              onChange={(e) => setDisclaimer(e.target.value)}
              className="min-h-[120px]"
            />
          </AdminCard>
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setEditing(null)}
            aria-label="Close"
          />
          <div className="glass-strong relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6">
            <h3 className="font-display text-xl font-semibold text-white">
              {editing._id ? "Edit pricing card" : "New pricing card"}
            </h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <FieldLabel>Service name</FieldLabel>
                <TextInput
                  value={editing.serviceName || ""}
                  onChange={(e) => setEditing({ ...editing, serviceName: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Category</FieldLabel>
                <TextSelect
                  value={editing.category || "electrical"}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      category: e.target.value as PricingItem["category"],
                    })
                  }
                >
                  <option value="electrical">Electrical</option>
                  <option value="hvac">HVAC</option>
                  <option value="plumbing">Plumbing</option>
                </TextSelect>
              </div>
              <div>
                <FieldLabel>Starting price</FieldLabel>
                <TextInput
                  value={editing.startingPrice || ""}
                  onChange={(e) => setEditing({ ...editing, startingPrice: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Price range</FieldLabel>
                <TextInput
                  value={editing.priceRange || ""}
                  onChange={(e) => setEditing({ ...editing, priceRange: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextTextarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Included (one per line)</FieldLabel>
                <TextTextarea
                  value={(editing.included || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      included: e.target.value
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </div>
              <div>
                <FieldLabel>Excluded (one per line)</FieldLabel>
                <TextTextarea
                  value={(editing.excluded || []).join("\n")}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      excluded: e.target.value
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
                  value={editing.ctaLabel || ""}
                  onChange={(e) => setEditing({ ...editing, ctaLabel: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>CTA URL</FieldLabel>
                <TextInput
                  value={editing.ctaUrl || ""}
                  onChange={(e) => setEditing({ ...editing, ctaUrl: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={!!editing.isEmergency}
                    onChange={(e) => setEditing({ ...editing, isEmergency: e.target.checked })}
                  />
                  Emergency
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.active !== false}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary !px-4 !py-2 text-sm">
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveItem}
                className="btn-primary !px-4 !py-2 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete pricing card?"
        description="This removes the card from the public pricing page."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
