import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal, RevealStagger, StaggerItem } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { getPricingItems, getSettings } from "@/lib/data";
import {
  FALLBACK_PRICING,
  FALLBACK_SETTINGS,
  BUSINESS,
  withFallback,
} from "@/lib/constants";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import type { PricingItem } from "@/types";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting price guidance for Premier Home Services electrical, HVAC, and plumbing services in the Greater Toronto Area. Final pricing confirmed after inspection.",
};

export default async function PricingPage() {
  const items = (await withFallback(
    () => getPricingItems(),
    FALLBACK_PRICING
  )) as PricingItem[];
  const settings = await withFallback(() => getSettings(), FALLBACK_SETTINGS);
  const disclaimer =
    settings.pricingDisclaimer || BUSINESS.pricingDisclaimer;

  return (
    <div>
      <section className="section-pad pb-10 pt-10">
        <Container>
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
            <Reveal direction="left">
              <SectionHeading
                eyebrow="Pricing"
                title="Clear starting guidance before work begins"
                description="These labels help you understand typical starting points. Final pricing depends on inspection, materials, labour, accessibility, and urgency."
              />
            </Reveal>
            <Reveal direction="right" delay={0.1}>
              <div className="grid grid-cols-2 gap-3">
                <StaggerItem delay={0} direction="up">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={SITE_IMAGES.pricing.hero[0]} alt={IMAGE_ALTS.officeBuilding} fill className="object-cover" sizes="25vw" />
                  </div>
                </StaggerItem>
                <StaggerItem delay={0.08} direction="right">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={SITE_IMAGES.pricing.hero[1]} alt={IMAGE_ALTS.blueprint} fill className="object-cover" sizes="25vw" />
                  </div>
                </StaggerItem>
                <StaggerItem delay={0.14} direction="up" className="col-span-2">
                  <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
                    <Image src={SITE_IMAGES.pricing.hero[2]} alt={IMAGE_ALTS.tools} fill className="object-cover" sizes="50vw" />
                  </div>
                </StaggerItem>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <Reveal direction="up">
            <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
              {disclaimer}
            </div>
          </Reveal>
          <RevealStagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" alternate stagger={0.09}>
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
          </RevealStagger>
        </Container>
      </section>

      <section className="section-pad">
        <Container className="grid gap-4 md:grid-cols-2">
          <Reveal direction="left">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={SITE_IMAGES.pricing.gallery[0]} alt={IMAGE_ALTS.electricalPanel} fill className="object-cover" sizes="50vw" />
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
              <Image src={SITE_IMAGES.pricing.gallery[1]} alt={IMAGE_ALTS.hvacUnit} fill className="object-cover" sizes="50vw" />
            </div>
          </Reveal>
          <Reveal direction="up" delay={0.15} className="md:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl md:aspect-[21/9]">
              <Image src={SITE_IMAGES.pricing.gallery[2]} alt={IMAGE_ALTS.plumbingTools} fill className="object-cover" sizes="100vw" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container className="text-center">
          <Reveal direction="scale">
            <h2 className="font-display text-3xl text-white">Need a tailored estimate?</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Tell us about the job and we will confirm clear pricing before approved work begins.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/request-service" className="btn-primary">Request Service</Link>
              <Link href="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
