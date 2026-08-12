"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminFetch } from "@/lib/admin-client";
import { formatDate } from "@/lib/utils";
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

interface Lead {
  _id: string;
  referenceNumber: string;
  name: string;
  email: string;
  phone: string;
  customerType?: string;
  propertyType?: string;
  serviceCategory: string;
  specificService?: string;
  isEmergency: boolean;
  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
  source?: string;
  status: string;
  internalNotes?: string;
  createdAt: string;
}

const STATUSES = [
  "new",
  "contacted",
  "appointment_scheduled",
  "in_progress",
  "completed",
  "closed",
  "spam",
];

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes] = useState("");
  const [leadStatus, setLeadStatus] = useState("new");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (category) params.set("category", category);
      params.set("limit", "100");
      const data = await adminFetch<{ leads: Lead[]; total: number }>(
        `/api/leads?${params.toString()}`
      );
      setLeads(data.leads);
      setTotal(data.total);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [q, status, category]);

  useEffect(() => {
    const t = setTimeout(() => {
      void load();
    }, 250);
    return () => clearTimeout(t);
  }, [load]);

  const sorted = useMemo(() => {
    const copy = [...leads];
    copy.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return copy;
  }, [leads, sort]);

  function openLead(lead: Lead) {
    setSelected(lead);
    setNotes(lead.internalNotes || "");
    setLeadStatus(lead.status);
  }

  async function saveLead() {
    if (!selected) return;
    setSaving(true);
    try {
      const data = await adminFetch<{ lead: Lead }>(`/api/leads/${selected._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: leadStatus, internalNotes: notes }),
      });
      setSelected(data.lead);
      setLeads((prev) => prev.map((l) => (l._id === data.lead._id ? data.lead : l)));
      toast.success("Lead updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function exportCsv() {
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (category) params.set("category", category);
      const res = await fetch(`/api/leads/export?${params.toString()}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `phs-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await adminFetch(`/api/leads/${deleteId}`, { method: "DELETE" });
      toast.success("Lead deleted");
      if (selected?._id === deleteId) setSelected(null);
      setDeleteId(null);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${total} inquiries`}
        actions={
          <button type="button" onClick={exportCsv} className="btn-secondary !px-4 !py-2 text-sm">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <AdminCard className="mb-6">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <TextInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, reference…"
              className="pl-10"
            />
          </div>
          <TextSelect value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </TextSelect>
          <TextSelect value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            <option value="electrical">Electrical</option>
            <option value="hvac">HVAC</option>
            <option value="plumbing">Plumbing</option>
            <option value="general">General</option>
          </TextSelect>
        </div>
        <div className="mt-3">
          <TextSelect
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="!w-auto min-w-[160px]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </TextSelect>
        </div>
      </AdminCard>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState title="No leads found" description="Try adjusting filters or wait for new inquiries." />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-white/5">
            {sorted.map((lead) => (
              <li key={lead._id}>
                <button
                  type="button"
                  onClick={() => openLead(lead)}
                  className="flex w-full flex-col gap-2 py-4 text-left transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {lead.name}
                      {lead.isEmergency ? (
                        <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
                          Emergency
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lead.referenceNumber} · {lead.serviceCategory} · {lead.email}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] capitalize text-slate-300">
                      {lead.status.replaceAll("_", " ")}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500">{formatDate(lead.createdAt)}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      {selected ? (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-label="Close drawer"
          />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-[#0b1220] shadow-2xl">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {selected.referenceNumber}
              </p>
              <h3 className="font-display text-xl font-semibold text-white">{selected.name}</h3>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 text-sm">
              <div className="grid grid-cols-2 gap-3 text-slate-300">
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-cyan-300">
                    {selected.email}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Phone</p>
                  <a href={`tel:${selected.phone}`} className="text-cyan-300">
                    {selected.phone}
                  </a>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Category</p>
                  <p className="capitalize">{selected.serviceCategory}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Source</p>
                  <p>{selected.source}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Property</p>
                  <p className="capitalize">{selected.propertyType}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase text-slate-500">Location</p>
                  <p>{selected.location || "—"}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase text-slate-500">Message</p>
                <p className="mt-1 whitespace-pre-wrap text-slate-300">{selected.message || "—"}</p>
              </div>
              <div>
                <FieldLabel>Status</FieldLabel>
                <TextSelect value={leadStatus} onChange={(e) => setLeadStatus(e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replaceAll("_", " ")}
                    </option>
                  ))}
                </TextSelect>
              </div>
              <div>
                <FieldLabel>Internal notes</FieldLabel>
                <TextTextarea value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => setDeleteId(selected._id)}
                className="rounded-full border border-red-500/30 px-4 py-2 text-sm text-red-300"
              >
                <Trash2 className="mr-1 inline h-4 w-4" /> Delete
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-secondary ml-auto !px-4 !py-2 text-sm"
              >
                Close
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={saveLead}
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
        title="Delete this lead?"
        description="This permanently removes the inquiry and cannot be undone."
        confirmLabel="Delete"
        variant="emergency"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
