"use client";

import { usePathname } from "next/navigation";
import { PublicShell } from "@/components/layout/PublicShell";
import type { ServiceNavItem, SiteSettingsData } from "@/types/site";

export function SiteChrome({
  settings,
  services,
  children,
}: {
  settings: SiteSettingsData;
  services: ServiceNavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <PublicShell settings={settings} services={services}>
      {children}
    </PublicShell>
  );
}

export default SiteChrome;
