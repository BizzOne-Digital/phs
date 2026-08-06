"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Zap, Wind, Droplets, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CardReveal } from "@/components/animations/PageMotion";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import type { Service } from "@/types";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { SITE_IMAGES } from "@/lib/site-images";

const filters = [
  { id: "all", label: "All" },
  { id: "electrical", label: "Electrical" },
  { id: "hvac", label: "HVAC" },
  { id: "plumbing", label: "Plumbing" },
  { id: "emergency", label: "Emergency" },
] as const;

const icons = { electrical: Zap, hvac: Wind, plumbing: Droplets } as const;

export function ServicesFilterGrid({ services }: { services: Service[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (filter === "all") return true;
      if (filter === "emergency") return s.isEmergency;
      return s.category === filter;
    });
  }, [services, filter]);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:px-4 sm:py-2 sm:text-sm",
              filter === f.id
                ? "border-cyan/50 bg-cyan/15 text-cyan"
                : "border-electric/20 text-silver hover:border-electric/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((service, i) => {
          const Icon = icons[service.category] || Zap;
          const img = resolveCmsImage(
            SITE_IMAGES.servicesIndex.cards[service.slug] ||
              service.heroImage?.url ||
              (service.category === "electrical"
                ? PLACEHOLDER_IMAGES.electricalTech
                : service.category === "hvac"
                  ? PLACEHOLDER_IMAGES.hvacUnit
                  : PLACEHOLDER_IMAGES.plumbingRepair)
          );
          const alt = service.heroImage?.alt || IMAGE_ALTS.tools;
          return (
            <CardReveal key={service.slug} index={i} className="h-full">
              <article className="glass electric-border flex h-full flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                <div className="relative aspect-[16/10]">
                  <Image src={img} alt={alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge variant="cyan">
                      <Icon className="h-3.5 w-3.5" /> {service.category}
                    </Badge>
                    {service.isEmergency ? <Badge variant="emergency">Emergency</Badge> : <Badge variant="muted">Scheduled</Badge>}
                  </div>
                  <h2 className="font-display text-xl font-bold text-white">{service.name}</h2>
                  <p className="mt-3 flex-1 text-sm text-muted">{service.shortDescription}</p>
                  {service.startingPriceLabel ? (
                    <p className="mt-3 text-sm font-semibold text-cyan">{service.startingPriceLabel}</p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button href={`/services/${service.slug}`} size="sm" variant="secondary">
                      Explore Service <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button href="/request-service" size="sm">
                      Request Service
                    </Button>
                  </div>
                </div>
              </article>
            </CardReveal>
          );
        })}
      </div>

      {!filtered.length ? (
        <p className="mt-10 text-center text-muted">No services match this filter.</p>
      ) : null}

      <p className="mt-8 text-center text-sm text-muted">
        Looking for something specific?{" "}
        <Link href="/contact" className="text-cyan hover:underline">
          Contact our team
        </Link>
        .
      </p>
    </div>
  );
}
