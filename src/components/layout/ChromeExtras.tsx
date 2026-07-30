"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { phoneHref } from "@/lib/utils";
import { CinematicIntro } from "@/components/animations/CinematicIntro";

export function EmergencyFab({ phone }: { phone: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={phoneHref(phone)}
      className="fixed bottom-6 right-6 z-[65] flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-5 text-sm font-bold text-white shadow-[0_0_30px_rgba(220,38,38,0.45)] transition hover:scale-105 md:bottom-8 md:right-8"
      aria-label={`Call emergency line ${phone}`}
    >
      <Phone className="h-4 w-4" />
      <span className="hidden sm:inline">24/7 Emergency</span>
    </a>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin") || !show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 left-6 z-[65] rounded-full border border-cyan-400/30 bg-[#0a1222]/90 px-3 py-2 text-xs uppercase tracking-wider text-cyan-200 backdrop-blur md:bottom-8"
    >
      Top
    </button>
  );
}

export function IntroGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <CinematicIntro />;
}
