import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { CmsHero } from "@/components/cms/CmsPageSections";
import { CmsImageGrid } from "@/components/cms/CmsImageGrid";
import { getPricingItems, getSettings, getPageBySlug } from "@/lib/data";
import {
  FALLBACK_PRICING,
  FALLBACK_SETTINGS,
  withFallback,
} from "@/lib/constants";
import { findSection, sectionText } from "@/lib/cms";
import { SITE_IMAGES } from "@/lib/site-images";
import { IMAGE_ALTS } from "@/lib/placeholders";
import type { PricingItem } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("pricing").catch(() => null);
  return {
    title: page?.seoTitle || "Pricing",
    description:
      page?.seoDescription ||
      "Starting price guidance for Premier Home Services electrical, HVAC, and plumbing services in the Greater Toronto Area.",
  };
}

export default async function PricingPage() {
  const [items, settings, page] = await Promise.all([
    withFallback(() => getPricingItems(), FALLBACK_PRICING) as Promise<PricingItem[]>,
    withFallback(() => getSettings(), FALLBACK_SETTINGS),
    getPageBySlug("pricing").catch(() => null),
  ]);

  const hero = findSection(page, "hero");
  const disclaimerSection = findSection(page, "disclaimer");
  const gallerySection = findSection(page, "pricing-grid");
  const cta = findSection(page, "cta");
  const disclaimer = sectionText(
    disclaimerSection,
    "body",
    settings.pricingDisclaimer || ""
  );

  return (
    <div>
      <CmsHero section={hero} crumbs={[{ label: "Pricing" }]} />

      <section className="section-pad pt-0">
        <Container>
          {disclaimer ? (
            <Reveal direction="up">
              <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
                {disclaimer}
              </div>
            </Reveal>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article key={item._id} className="glass electric-border flex h-full flex-col rounded-3xl p-6">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="muted" className="capitalize">{item.category}</Badge>
                  {item.isEmergency ? <Badge variant="emergency">Emergency</Badge> : null}
                  {item.featured ? <Badge variant="cyan">Featured</Badge> : null}
                </div>
                <h2 className="font-display text-xl text-white">{item.serviceName}</h2>
                <p className="mt-3 text-2xl font-semibold text-cyan-300">{item.startingPrice}</p>
                {item.priceRange ? (
                  <p className="mt-1 text-sm text-slate-400">Range: {item.priceRange}</p>
                ) : null}
                {item.description ? (
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
                ) : (
                  <div className="flex-1" />
                )}
                {(item.included || []).length > 0 ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-300">
                    {item.included!.slice(0, 4).map((inc) => (
                      <li key={inc}>• {inc}</li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={item.ctaUrl || "/request-service"}
                  className="btn-primary mt-6 !w-full justify-center text-sm"
                >
                  {item.ctaLabel || "Request Service"}
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <CmsImageGrid
            images={gallerySection?.images}
            fallbacks={[...SITE_IMAGES.pricing.gallery]}
            alts={[IMAGE_ALTS.electricalPanel, IMAGE_ALTS.hvacUnit, IMAGE_ALTS.plumbingTools]}
            layout="gallery"
          />
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container className="text-center">
          <Reveal direction="scale">
            <h2 className="font-display text-3xl text-white">
              {sectionText(cta, "heading", "Need a tailored estimate?")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              {sectionText(
                cta,
                "body",
                "Tell us about the job and we will confirm clear pricing before approved work begins."
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={cta?.ctaUrl || "/request-service"} className="btn-primary">
                {sectionText(cta, "ctaLabel", "Request Service")}
              </Link>
              <Link href={cta?.secondaryCtaUrl || "/contact"} className="btn-secondary">
                {cta?.secondaryCtaLabel || "Contact Us"}
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
