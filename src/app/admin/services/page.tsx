"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Wrench } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { deferEffect } from "@/lib/defer-effect";
import { createSlug } from "@/lib/utils";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

interface ServiceItem {
  _id: string;
  name: string;
  slug: string;
  category: string;
  isEmergency: boolean;
  active: boolean;
  displayOrder: number;
  shortDescription: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<{ services: ServiceItem[] }>("/api/services");
      setServices(data.services);
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

  async function createService() {
    setCreating(true);
    try {
      const name = "New Service";
      const data = await adminFetch<{ service: ServiceItem }>("/api/services", {
        method: "POST",
        body: JSON.stringify({
          name,
          slug: createSlug(`${name}-${Date.now()}`),
          category: "electrical",
          isEmergency: false,
          shortDescription: "Describe this service in a short summary for cards and listings.",
          fullDescription:
            "Provide a full description of this service including what customers can expect from Premier Home Services technicians.",
          active: false,
        }),
      });
      toast.success("Service created");
      window.location.href = `/admin/services/${data.service._id}`;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Create failed");
      setCreating(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/services/${deleteId}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Manage service detail pages and listings"
        actions={
          <button
            type="button"
            onClick={createService}
            disabled={creating}
            className="btn-primary !px-4 !py-2 text-sm"
          >
            <Plus className="h-4 w-4" /> New service
          </button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="No services"
          description="Create your first electrical, HVAC, or plumbing service."
          icon={<Wrench className="h-6 w-6" />}
          action={
            <button type="button" onClick={createService} className="btn-primary text-sm">
              Create service
            </button>
          }
        />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-white/5">
            {services.map((s) => (
              <li
                key={s._id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <Link
                    href={`/admin/services/${s._id}`}
                    className="font-medium text-slate-100 hover:text-cyan-300"
                  >
                    {s.name}
                  </Link>
                  <p className="mt-0.5 text-xs capitalize text-slate-500">
                    {s.category}
                    {s.isEmergency ? " · emergency" : ""} · /{s.slug}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      s.active
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-slate-500/20 text-slate-400"
                    }`}
                  >
                    {s.active ? "Active" : "Inactive"}
                  </span>
                  <Link href={`/admin/services/${s._id}`} className="btn-secondary !px-3 !py-1.5 text-xs">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteId(s._id)}
                    className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10"
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
        title="Delete this service?"
        description="This permanently removes the service page. This cannot be undone."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
