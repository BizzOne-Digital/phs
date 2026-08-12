import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ServicesFilterGrid } from "@/components/services/ServicesFilterGrid";
import { CmsHero, CmsBodySections } from "@/components/cms/CmsPageSections";
import { getServices, getPageBySlug } from "@/lib/data";
import { FALLBACK_SERVICES, withFallback } from "@/lib/constants";
import { findSection, visibleSections } from "@/lib/cms";
import type { Service } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("services").catch(() => null);
  return {
    title: page?.seoTitle || "Services",
    description:
      page?.seoDescription ||
      "Explore Premier Home Services electrical, HVAC, and plumbing services—including 24/7 emergency options—across the Greater Toronto Area.",
  };
}

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    withFallback(() => getServices({ activeOnly: true }), FALLBACK_SERVICES) as Promise<Service[]>,
    getPageBySlug("services").catch(() => null),
  ]);

  return (
    <div>
      <CmsHero section={findSection(page, "hero")} crumbs={[{ label: "Services" }]} />
      <section className="section-pad pt-0">
        <Container>
          <ServicesFilterGrid services={services.length ? services : FALLBACK_SERVICES} />
        </Container>
      </section>
      <CmsBodySections sections={visibleSections(page)} skipKeys={["hero", "services-grid"]} />
    </div>
  );
}
