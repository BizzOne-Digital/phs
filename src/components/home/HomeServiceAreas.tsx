import Image from "next/image";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICE_AREAS } from "@/lib/constants";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";

export function HomeServiceAreas({ serviceArea }: { serviceArea: string }) {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <SectionHeading
            eyebrow="Service areas"
            title="Proudly serving the Greater Toronto Area"
            description={`${serviceArea}. We provide scheduled and emergency electrical, HVAC, and plumbing support throughout the region.`}
          />
          <RevealStagger className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3" alternate stagger={0.05}>
            {SERVICE_AREAS.map((area) => (
              <div
                key={area}
                className="rounded-xl border border-electric/20 bg-deep/50 px-3 py-3 text-center text-sm font-medium text-silver"
              >
                {area}
              </div>
            ))}
          </RevealStagger>
        </Reveal>
        <Reveal direction="right" delay={0.12} className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl electric-border">
            <Image
              src={SITE_IMAGES.home.areasSkyline}
              alt={IMAGE_ALTS.torontoSkyline}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 45vw"
            />
          </div>
          <div className="absolute -bottom-5 right-6 hidden w-40 overflow-hidden rounded-2xl border border-white/10 md:block">
            <div className="relative aspect-[4/3]">
              <Image
                src={SITE_IMAGES.home.areasOffice}
                alt={IMAGE_ALTS.officeBuilding}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
