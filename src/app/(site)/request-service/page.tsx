import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ServiceRequestWizard } from "@/components/forms/ServiceRequestWizard";
import { getSettings } from "@/lib/data";
import { FALLBACK_SETTINGS, withFallback } from "@/lib/constants";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Request Service",
  description:
    "Request electrical, HVAC, or plumbing service from VNEC across the Greater Toronto Area—including 24/7 emergency support.",
};

type Props = {
  searchParams: Promise<{ category?: string; emergency?: string }>;
};

export default async function RequestServicePage({ searchParams }: Props) {
  const sp = await searchParams;
  const settings = await withFallback(() => getSettings(), FALLBACK_SETTINGS);
  const category =
    sp.category === "electrical" || sp.category === "hvac" || sp.category === "plumbing"
      ? sp.category
      : undefined;

  return (
    <div>
      <section className="section-pad pb-10 pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Request Service" }]} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Request Service"
              title="Tell us what you need"
              description="A short multi-step request helps us route the right technician. For immediate danger, call 911 first."
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.request.hero[0]} alt={IMAGE_ALTS.tools} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.request.hero[1]} alt={IMAGE_ALTS.electricalTech} fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative col-span-2 aspect-[21/9] overflow-hidden rounded-2xl">
                <Image src={SITE_IMAGES.request.hero[2]} alt={IMAGE_ALTS.hvacTech} fill className="object-cover" sizes="50vw" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container className="mx-auto max-w-3xl">
          <ServiceRequestWizard
            initialCategory={category}
            emergencyPhone={settings.emergencyPhone || settings.phone}
          />
        </Container>
      </section>

      <section className="section-pad">
        <Container className="grid gap-4 md:grid-cols-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={SITE_IMAGES.request.gallery[0]} alt={IMAGE_ALTS.plumbingRepair} fill className="object-cover" sizes="33vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={SITE_IMAGES.request.gallery[1]} alt={IMAGE_ALTS.safetyGear} fill className="object-cover" sizes="33vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={SITE_IMAGES.request.gallery[2]} alt={IMAGE_ALTS.emergencyResponse} fill className="object-cover" sizes="33vw" />
          </div>
        </Container>
      </section>
    </div>
  );
}
