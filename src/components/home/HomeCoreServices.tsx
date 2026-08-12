import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap, Wind, Droplets } from "lucide-react";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { TiltCard } from "@/components/animations/TiltCard";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import type { Service } from "@/types";
import { resolveCmsImage } from "@/lib/upload/resolve";

const icons = { electrical: Zap, hvac: Wind, plumbing: Droplets } as const;

const fallbackImages = {
  electrical: SITE_IMAGES.home.coreElectrical,
  hvac: SITE_IMAGES.home.coreHvac,
  plumbing: SITE_IMAGES.home.corePlumbing,
} as const;

const fallbackAlts = {
  electrical: IMAGE_ALTS.electricalPanel,
  hvac: IMAGE_ALTS.hvacTech,
  plumbing: IMAGE_ALTS.pipes,
} as const;

export function HomeCoreServices({
  services,
  images,
}: {
  services: Service[];
  images?: Array<{ url?: string; alt?: string }>;
}) {
  const core = ["electrical-services", "hvac-services", "plumbing-services"];
  const cards =
    services.filter((s) => core.includes(s.slug)).length >= 3
      ? services.filter((s) => core.includes(s.slug)).slice(0, 3)
      : services.filter((s) => !s.isEmergency).slice(0, 3);

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Core services"
            title="Electrical, HVAC & Plumbing—done right"
            description="Licensed technicians for residential and commercial properties across the Greater Toronto Area."
            align="center"
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-6 md:grid-cols-3" alternate stagger={0.12}>
          {cards.map((service, cardIndex) => {
            const Icon = icons[service.category] || Zap;
            const img = resolveCmsImage(
              images?.[cardIndex]?.url ||
                service.heroImage?.url ||
                fallbackImages[service.category] ||
                PLACEHOLDER_IMAGES.tools
            );
            const alt =
              images?.[cardIndex]?.alt ||
              service.heroImage?.alt ||
              fallbackAlts[service.category] ||
              IMAGE_ALTS.tools;
            return (
              <TiltCard key={service._id || service.slug}>
                <article className="glass electric-border flex h-full flex-col overflow-hidden rounded-2xl">
                  <div className="relative aspect-[4/3]">
                    <Image src={img} alt={alt} fill unoptimized={img.startsWith("/api/uploads/")} className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                    <div className="absolute left-4 top-4">
                      <Badge variant={service.isEmergency ? "emergency" : "cyan"}>
                        <Icon className="h-3.5 w-3.5" />
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-bold text-white">{service.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                      {service.shortDescription}
                    </p>
                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline"
                    >
                      Explore service <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </TiltCard>
            );
          })}
        </RevealStagger>
        <div className="mt-10 text-center">
          <Button href="/services" variant="secondary">
            View all services
          </Button>
        </div>
      </Container>
    </Section>
  );
}
