import { Tag } from "lucide-react";
import type { SiteSettingsData } from "@/types/site";
import { cn } from "@/lib/utils";

export interface AnnouncementBarProps {
  settings: Pick<SiteSettingsData, "specialOfferText" | "specialOfferActive">;
  className?: string;
}

export function AnnouncementBar({ settings, className }: AnnouncementBarProps) {
  if (!settings.specialOfferActive || !settings.specialOfferText) return null;

  return (
    <div
      className={cn(
        "relative z-[40] border-b border-amber/25 bg-gradient-to-r from-amber/15 via-electric/10 to-cyan/15",
        className
      )}
    >
      <div className="container-site flex items-center justify-center gap-2 px-3 py-2 text-center text-[11px] font-medium leading-snug text-foreground sm:px-4 sm:py-2.5 sm:text-xs md:text-sm">
        <Tag className="hidden h-4 w-4 shrink-0 text-amber sm:block" aria-hidden />
        <p className="max-w-[40rem] break-words">{settings.specialOfferText}</p>
      </div>
    </div>
  );
}

export default AnnouncementBar;
