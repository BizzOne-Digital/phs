"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Wrench,
  Tags,
  Newspaper,
  Inbox,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/pricing", label: "Pricing", icon: Tags },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-[#080e1a]/90 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.35)]">
          <Zap className="h-5 w-5 text-slate-950" />
        </div>
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-white">PHS Admin</p>
          <p className="text-[11px] text-slate-500">Control Center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-electric/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5", active ? "text-cyan-300" : "text-slate-500")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell relative flex min-h-screen bg-[#0b1220]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {Sidebar}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-2xl">{Sidebar}</div>
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-screen min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#0b1220]/85 px-4 py-3 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PHS Portal</p>
          </div>
          <Link
            href="/"
            target="_blank"
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            View site
          </Link>
        </header>
        <main className="relative flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      <Toaster theme="dark" position="top-right" richColors closeButton />
    </div>
  );
}

export default AdminShell;
