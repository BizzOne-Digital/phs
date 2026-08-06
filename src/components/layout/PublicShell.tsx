import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { EmergencyFab } from "./EmergencyFab";
import { RequestServiceFab } from "./RequestServiceFab";
import { BackToTop } from "./BackToTop";
import { CookieNotice } from "./CookieNotice";
import { CinematicIntro } from "@/components/animations/CinematicIntro";
import type { ServiceNavItem, SiteSettingsData } from "@/types/site";

export interface PublicShellProps {
  settings: SiteSettingsData;
  services: ServiceNavItem[];
  children: React.ReactNode;
  showIntro?: boolean;
}

export function PublicShell({
  settings,
  services,
  children,
  showIntro = true,
}: PublicShellProps) {
  const emergencyPhone = settings.emergencyPhone || settings.phone;

  return (
    <>
      {showIntro ? <CinematicIntro /> : null}
      <div className="relative flex min-h-screen flex-col overflow-x-clip bg-energy">
        <div className="sticky top-0 z-50 w-full">
          <AnnouncementBar settings={settings} />
          <Header settings={settings} services={services} />
        </div>
        <main className="relative w-full min-w-0 flex-1 overflow-x-clip">{children}</main>
        <Footer settings={settings} services={services} />
        <RequestServiceFab />
        <EmergencyFab phone={emergencyPhone} />
        <BackToTop />
        <CookieNotice analyticsId={settings.analyticsId} />
      </div>
    </>
  );
}

export default PublicShell;
