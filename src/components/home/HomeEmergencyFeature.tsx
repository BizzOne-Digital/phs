import Image from "next/image";
import { PhoneCall } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import { phoneHref } from "@/lib/utils";
import type { Service } from "@/types";

export function HomeEmergencyFeature({
  services,
  phone,
}: {
  services: Service[];
  phone: string;
}) {
  const emergencies =
    services.filter((s) => s.isEmergency).length > 0
      ? services.filter((s) => s.isEmergency)
      : services.slice(0, 3);

  return (
    <Section tone="deep" className="overflow-hidden">
      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <Reveal direction="left">
          <SectionHeading
            eyebrow="24/7 Emergency"
            title="When systems fail, response matters"
            description="Electrical, HVAC, and plumbing emergencies don’t wait for business hours. Premier Home Services provides around-the-clock support across the Greater Toronto Area."
          />
          <div className="mt-8 space-y-4">
            {emergencies.map((s, i) => (
              <Reveal key={s.slug} direction="left" delay={0.08 * (i + 1)}>
                <a
                  href={`/services/${s.slug}`}
                  className="glass block rounded-xl border border-danger/20 px-5 py-4 transition hover:border-danger/40 hover:translate-x-1"
                >
                  <p className="font-semibold text-white">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{s.shortDescription}</p>
                </a>
              </Reveal>
            ))}
          </div>
          <Button href={phoneHref(phone)} variant="emergency" className="mt-8">
            <PhoneCall className="h-4 w-4" /> Call {phone}
          </Button>
        </Reveal>
        <Reveal direction="right" delay={0.15} className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl electric-border">
            <Image
              src={SITE_IMAGES.home.emergencyMain}
              alt={IMAGE_ALTS.emergencyResponse}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-4 -left-4 hidden w-48 overflow-hidden rounded-2xl border border-electric/30 md:block">
            <div className="relative aspect-square">
              <Image src={SITE_IMAGES.home.emergencyVan} alt={IMAGE_ALTS.van} fill className="object-cover" sizes="192px" />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
