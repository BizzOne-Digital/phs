"use client";

import { usePathname } from "next/navigation";
import { AdminProviders } from "@/components/admin/AdminProviders";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith("/admin/login");

  return (
    <AdminProviders>
      {isLogin ? children : <AdminShell>{children}</AdminShell>}
    </AdminProviders>
  );
}
