import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServicesFilterGrid } from "@/components/services/ServicesFilterGrid";
import { Reveal, StaggerItem } from "@/components/animations/Reveal";
import { getServices } from "@/lib/data";
import { FALLBACK_SERVICES, withFallback } from "@/lib/constants";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import type { Service } from "@/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Premier Home Services electrical, HVAC, and plumbing services—including 24/7 emergency options—across the Greater Toronto Area.",
};

const HERO_IMGS = SITE_IMAGES.servicesIndex.hero.map((src, i) => ({
  src,
  alt: [
    IMAGE_ALTS.electricalPanel,
    IMAGE_ALTS.hvacUnit,
    IMAGE_ALTS.plumbingTools,
    IMAGE_ALTS.emergencyResponse,
    IMAGE_ALTS.commercialMech,
  ][i],
}));

export default async function ServicesPage() {
  const services = (await withFallback(
    () => getServices(),
    FALLBACK_SERVICES
  )) as Service[];

  return (
    <div>
      <section className="pb-8 pt-4 md:pt-6">
        <Container>
          <Breadcrumbs items={[{ label: "Services" }]} className="!px-0 !py-0" />
          <div className="mt-4 grid items-center gap-6 lg:mt-5 lg:grid-cols-2 lg:gap-8">
            <Reveal direction="left">
              <SectionHeading
                eyebrow="Services"
                title="Six focused service pathways"
                description="Filter by trade or emergency needs. Every service page includes process details, safety guidance, and a clear request path."
              />
            </Reveal>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {HERO_IMGS.map((img, i) => (
                <StaggerItem
                  key={img.src}
                  delay={i * 0.08}
                  direction={i % 2 === 0 ? "right" : "up"}
                  className="last:col-span-2 sm:last:col-span-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="33vw" />
                  </div>
                </StaggerItem>
              ))}
            </div>
          </div>
        </Container>
      </section>
      <section className="section-pad pt-0">
        <Container>
          <Reveal direction="up">
            <ServicesFilterGrid services={services} />
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
