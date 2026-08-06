"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Inbox,
  AlertTriangle,
  CalendarCheck,
  Users,
  Newspaper,
  Wrench,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { adminFetch } from "@/lib/admin-client";
import { formatDate } from "@/lib/utils";
import { PageHeader, AdminCard } from "@/components/admin/AdminForm";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

interface DashboardData {
  stats: {
    totalLeads: number;
    newLeads: number;
    emergencyLeads: number;
    scheduledLeads: number;
    blogPublished: number;
    blogDrafts: number;
    activeServices: number;
  };
  byCategory: { category: string; count: number }[];
  recentLeads: Array<{
    _id: string;
    referenceNumber: string;
    name: string;
    serviceCategory: string;
    isEmergency: boolean;
    status: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    _id: string;
    summary: string;
    action: string;
    createdAt: string;
  }>;
  leadTrend: { date: string; count: number; emergency: number }[];
}

const shortcuts = [
  { href: "/admin/leads", label: "Review leads" },
  { href: "/admin/pages", label: "Edit pages" },
  { href: "/admin/blogs/new", label: "Write blog" },
  { href: "/admin/media", label: "Upload media" },
  { href: "/admin/settings", label: "Site settings" },
];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<DashboardData>("/api/admin/dashboard")
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="Dashboard unavailable" description={error || "No data"} />;
  }

  const cards = [
    { label: "Total leads", value: data.stats.totalLeads, icon: Users, color: "text-cyan-300" },
    { label: "New leads", value: data.stats.newLeads, icon: Inbox, color: "text-blue-300" },
    {
      label: "Emergency",
      value: data.stats.emergencyLeads,
      icon: AlertTriangle,
      color: "text-amber-300",
    },
    {
      label: "Scheduled",
      value: data.stats.scheduledLeads,
      icon: CalendarCheck,
      color: "text-emerald-300",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Live overview of inquiries, content, and activity"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`rounded-xl bg-white/5 p-2.5 ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <AdminCard title="Lead trend (14 days)" className="xl:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.leadTrend}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickFormatter={(v) => String(v).slice(5)}
                />
                <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(59,130,246,0.3)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22d3ee"
                  strokeWidth={2.5}
                  dot={false}
                  name="Leads"
                />
                <Line
                  type="monotone"
                  dataKey="emergency"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Emergency"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard title="By category">
          <div className="h-64">
            {data.byCategory.length === 0 ? (
              <EmptyState title="No leads yet" className="border-0 bg-transparent py-8" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byCategory}>
                  <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(59,130,246,0.3)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Newspaper className="h-4 w-4" /> Blogs
          </div>
          <p className="mt-2 text-sm text-slate-300">
            <span className="text-xl font-semibold text-white">{data.stats.blogPublished}</span>{" "}
            published · {data.stats.blogDrafts} drafts
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Wrench className="h-4 w-4" /> Services
          </div>
          <p className="mt-2 text-sm text-slate-300">
            <span className="text-xl font-semibold text-white">{data.stats.activeServices}</span>{" "}
            active
          </p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Shortcuts</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {shortcuts.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-cyan-300 transition hover:border-cyan-400/40"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard
          title="Recent inquiries"
          action={
            <Link href="/admin/leads" className="text-xs font-medium text-cyan-300 hover:underline">
              View all
            </Link>
          }
        >
          {data.recentLeads.length === 0 ? (
            <EmptyState title="No inquiries yet" className="border-0 bg-transparent py-8" />
          ) : (
            <ul className="divide-y divide-white/5">
              {data.recentLeads.map((lead) => (
                <li key={lead._id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-100">{lead.name}</p>
                    <p className="text-xs text-slate-500">
                      {lead.referenceNumber} · {lead.serviceCategory}
                      {lead.isEmergency ? " · emergency" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] capitalize text-slate-300">
                      {lead.status.replaceAll("_", " ")}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-500">{formatDate(lead.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Recent activity">
          {data.recentActivity.length === 0 ? (
            <EmptyState title="No activity yet" className="border-0 bg-transparent py-8" />
          ) : (
            <ul className="space-y-3">
              {data.recentActivity.map((item) => (
                <li key={item._id} className="flex items-start gap-3">
                  <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="text-sm text-slate-200">{item.summary}</p>
                    <p className="text-[11px] text-slate-500">
                      {item.action} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
