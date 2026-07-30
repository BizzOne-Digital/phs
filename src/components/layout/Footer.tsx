import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import type { ServiceNavItem, SiteSettingsData } from "@/types/site";
import { cn, phoneHref } from "@/lib/utils";

export interface FooterProps {
  settings: SiteSettingsData;
  services: ServiceNavItem[];
  className?: string;
}

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

export function Footer({ settings, services, className }: FooterProps) {
  const social = settings.socialLinks ?? {};
  const year = new Date().getFullYear();

  return (
    <footer className={cn("relative mt-auto border-t border-electric/15 bg-deep", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <div className="container-site section-pad !pb-10 !pt-12 px-4 sm:!pt-16">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo variant="full" />
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {settings.footerDescription ??
                "Licensed Electrical, HVAC & Plumbing experts serving the Greater Toronto Area with scheduled appointments and 24/7 emergency support."}
            </p>
            {settings.specialOfferActive && settings.specialOfferText ? (
              <p className="rounded-xl border border-amber/25 bg-amber/10 px-3 py-2 text-sm font-medium text-amber">
                {settings.specialOfferText}
              </p>
            ) : null}
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Services
            </h3>
            <ul className="mt-4 space-y-2">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted transition hover:text-cyan"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="text-sm font-semibold text-cyan">
                  All services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              <li>
                <a
                  href={phoneHref(settings.phone)}
                  className="inline-flex items-center gap-2 transition hover:text-cyan"
                >
                  <Phone className="h-4 w-4 text-electric" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 transition hover:text-cyan"
                >
                  <Mail className="h-4 w-4 text-electric" />
                  {settings.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                <span>{settings.serviceArea}</span>
              </li>
              <li className="inline-flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-electric" />
                <span>
                  {settings.businessHours}
                  <br />
                  <span className="text-amber">{settings.emergencyAvailability}</span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted transition hover:text-cyan">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted transition hover:text-cyan">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted transition hover:text-cyan">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted transition hover:text-cyan">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/request-service"
                  className="text-sm font-semibold text-cyan"
                >
                  Request Service
                </Link>
              </li>
            </ul>

            <h3 className="mt-8 font-display text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition hover:text-cyan"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-3">
              {social.facebook ? (
                <SocialIcon href={social.facebook} label="Facebook">
                  <SocialGlyph kind="facebook" />
                </SocialIcon>
              ) : null}
              {social.instagram ? (
                <SocialIcon href={social.instagram} label="Instagram">
                  <SocialGlyph kind="instagram" />
                </SocialIcon>
              ) : null}
              {social.linkedin ? (
                <SocialIcon href={social.linkedin} label="LinkedIn">
                  <SocialGlyph kind="linkedin" />
                </SocialIcon>
              ) : null}
              {social.google ? (
                <SocialIcon href={social.google} label="Google">
                  <SocialGlyph kind="google" />
                </SocialIcon>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-muted sm:flex-row sm:text-left">
          <p>
            {settings.copyrightText?.includes("©")
              ? settings.copyrightText.replace(/\d{4}/, String(year))
              : settings.copyrightText ??
                `© ${year} ${settings.businessName}. All rights reserved.`}
          </p>
          <p className="text-silver/60">Licensed · Insured · GTA Trusted</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-electric/25 bg-electric/10 text-cyan transition hover:border-cyan/50 hover:bg-electric/20"
    >
      {children}
    </a>
  );
}

function SocialGlyph({ kind }: { kind: "facebook" | "instagram" | "linkedin" | "google" }) {
  const common = "h-4 w-4 fill-current";
  if (kind === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9z" />
      </svg>
    );
  }
  if (kind === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm5.2-.9a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1zM12 9.5A2.5 2.5 0 1 1 9.5 12 2.5 2.5 0 0 1 12 9.5z" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden>
        <path d="M6.5 9H3.7v11.2h2.8zm.2-3.2a1.6 1.6 0 1 1-1.6-1.6 1.6 1.6 0 0 1 1.6 1.6zM20.3 14.4c0-3-1.6-4.4-3.8-4.4a3.3 3.3 0 0 0-3 1.6V10H10.7v10.2h2.8v-5.1c0-1.3.2-2.6 1.9-2.6s1.7 1.5 1.7 2.7v5h2.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden>
      <path d="M12 11.2v2.8h6.7c-.3 1.6-2.1 4.7-6.7 4.7A7.1 7.1 0 1 1 12 4.9a6.8 6.8 0 0 1 4.8 1.9l2-2A9.9 9.9 0 0 0 12 2a10 10 0 1 0 0 20c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7z" />
    </svg>
  );
}

export default Footer;
