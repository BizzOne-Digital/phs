"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Menu,
  Phone,
  PhoneCall,
  X,
  Zap,
  Wind,
  Droplets,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { MagneticButton } from "@/components/animations/MagneticButton";
import { Button } from "@/components/ui/Button";
import type { ServiceNavItem, SiteSettingsData } from "@/types/site";
import { cn, phoneHref } from "@/lib/utils";

const NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

const categoryIcon = {
  electrical: Zap,
  hvac: Wind,
  plumbing: Droplets,
} as const;

export interface HeaderProps {
  settings: Pick<
    SiteSettingsData,
    "businessName" | "phone" | "emergencyPhone" | "logoUrl"
  >;
  services: ServiceNavItem[];
}

export function Header({ settings, services }: HeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setMobileOpen(false);
      setServicesOpen(false);
      setMobileServicesOpen(false);
    });
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const emergency = settings.emergencyPhone || settings.phone;

  return (
    <header
      className={cn(
        "relative z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-strong border-b border-electric/20 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          : "border-b border-transparent bg-[#060b16]/90 backdrop-blur-md"
      )}
    >
      <div className="container-site flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
        <Logo variant="full" priority className="min-w-0 scale-90 sm:scale-100" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.slice(0, 2).map((item) => (
            <NavLink key={item.href} href={item.href} active={pathname === item.href}>
              {item.label}
            </NavLink>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold transition",
                pathname.startsWith("/services")
                  ? "text-cyan"
                  : "text-silver hover:text-foreground"
              )}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                className={cn("h-4 w-4 transition", servicesOpen && "rotate-180")}
              />
            </button>
            <AnimatePresence>
              {servicesOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="glass-strong absolute left-1/2 top-full z-50 mt-2 w-[22rem] -translate-x-1/2 rounded-2xl p-2 shadow-2xl"
                >
                  <ul className="grid gap-1">
                    {services.slice(0, 6).map((service) => {
                      const Icon =
                        categoryIcon[service.category as keyof typeof categoryIcon] ??
                        Zap;
                      return (
                        <li key={service.slug}>
                          <Link
                            href={`/services/${service.slug}`}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-silver transition hover:bg-electric/10 hover:text-foreground"
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-electric/25 bg-electric/10 text-cyan">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="font-medium">{service.name}</span>
                            {service.isEmergency ? (
                              <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-amber">
                                24/7
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <Link
                    href="/services"
                    className="mt-1 block rounded-xl px-3 py-2 text-center text-xs font-semibold uppercase tracking-wider text-cyan hover:bg-electric/10"
                  >
                    View all services
                  </Link>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {NAV.slice(2).map((item) => (
            <NavLink key={item.href} href={item.href} active={pathname === item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={phoneHref(emergency)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-amber transition hover:bg-amber/10"
          >
            <PhoneCall className="h-4 w-4" />
            Emergency
          </a>
          <MagneticButton>
            <Button href="/request-service" size="sm">
              Request Service
            </Button>
          </MagneticButton>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-electric/30 bg-navy/60 text-foreground lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="absolute inset-x-0 top-full z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="fixed inset-0 top-0 -z-10 bg-deep/80 backdrop-blur-sm"
              aria-label="Close menu overlay"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="glass-strong max-h-[min(80dvh,calc(100dvh-5rem))] overflow-y-auto border-b border-electric/25 p-4 pb-8 shadow-2xl"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              aria-label="Mobile"
            >
              <ul className="space-y-1">
                {NAV.slice(0, 2).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-electric/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-electric/10"
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    aria-expanded={mobileServicesOpen}
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition",
                        mobileServicesOpen && "rotate-180"
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen ? (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2"
                      >
                        {services.slice(0, 6).map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={`/services/${service.slug}`}
                              className="block rounded-lg px-4 py-2.5 text-sm text-silver hover:bg-electric/10 hover:text-foreground"
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link
                            href="/services"
                            className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-cyan"
                          >
                            All services
                          </Link>
                        </li>
                      </motion.ul>
                    ) : null}
                  </AnimatePresence>
                </li>
                {NAV.slice(2).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-electric/10"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                <Button href="/request-service" className="w-full justify-center">
                  Request Service
                </Button>
                <a href={phoneHref(emergency)} className="btn-emergency w-full justify-center">
                  <Phone className="h-4 w-4" />
                  Call Emergency
                </a>
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-2 text-sm font-semibold transition",
        active ? "text-cyan" : "text-silver hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export default Header;
