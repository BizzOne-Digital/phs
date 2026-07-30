import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Reveal, RevealStagger, StaggerItem } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getServiceBySlug,
  getServices,
  getSettings,
} from "@/lib/data";
import {
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
  PROCESS_STEPS,
  withFallback,
} from "@/lib/constants";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { phoneHref, absoluteUrl } from "@/lib/utils";
import { resolveCmsImage } from "@/lib/upload/resolve";
import { SITE_IMAGES } from "@/lib/site-images";
import type { Service } from "@/types";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const services = await getServices();
    if (services?.length) {
      return services.map((s: { slug: string }) => ({ slug: s.slug }));
    }
  } catch {
    /* fallback */
  }
  return FALLBACK_SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let service: Service | null = null;
  try {
    service = await getServiceBySlug(slug);
  } catch {
    service = null;
  }
  if (!service) service = FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
  if (!service) return { title: "Service" };
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription,
    openGraph: {
      title: service.seoTitle || service.name,
      description: service.seoDescription || service.shortDescription,
      images: service.heroImage?.url ? [service.heroImage.url] : undefined,
    },
  };
}

function galleryFor(service: Service) {
  const local = SITE_IMAGES.services[service.slug];
  if (local?.gallery?.length) {
    return local.gallery.map((url, i) => ({
      url,
      alt: `${service.name} gallery ${i + 1}`,
    }));
  }

  const gallery = service.gallery?.filter((g) => g?.url) || [];
  const extras = [
    service.heroImage?.url
      ? { url: service.heroImage.url, alt: service.heroImage.alt || service.name }
      : null,
    { url: PLACEHOLDER_IMAGES.tools, alt: IMAGE_ALTS.tools },
    { url: PLACEHOLDER_IMAGES.safetyGear, alt: IMAGE_ALTS.safetyGear },
    { url: PLACEHOLDER_IMAGES.van, alt: IMAGE_ALTS.van },
    { url: PLACEHOLDER_IMAGES.commercialMech, alt: IMAGE_ALTS.commercialMech },
  ].filter(Boolean) as { url: string; alt: string }[];

  const merged: { url: string; alt: string }[] = [];
  for (const item of [...gallery, ...extras]) {
    const url = resolveCmsImage(item.url);
    if (merged.length >= 3) break;
    if (!merged.some((g) => g.url === url)) merged.push({ url, alt: item.alt });
  }
  return merged;
}

function heroFallback(category: string) {
  if (category === "hvac") return PLACEHOLDER_IMAGES.hvacTech;
  if (category === "plumbing") return PLACEHOLDER_IMAGES.plumbingRepair;
  return PLACEHOLDER_IMAGES.electricalTech;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  let found: Service | null = null;
  try {
    found = (await getServiceBySlug(slug)) as Service | null;
  } catch {
    found = null;
  }
  const service: Service | null =
    found || FALLBACK_SERVICES.find((s) => s.slug === slug) || null;

  if (!service) notFound();

  const settings = await withFallback(() => getSettings(), FALLBACK_SETTINGS);
  const allServices = (await withFallback(
    () => getServices(),
    FALLBACK_SERVICES
  )) as Service[];
  const relatedSlugs: string[] = service.relatedServiceSlugs || [];
  const related: Service[] = relatedSlugs
    .map((slugKey: string) => allServices.find((x: Service) => x.slug === slugKey))
    .filter((x: Service | undefined): x is Service => Boolean(x));
  const gallery = galleryFor(service);
  const process: { title: string; description: string }[] = service.processSteps?.length
    ? service.processSteps
    : [...PROCESS_STEPS];
  const phone = settings.emergencyPhone || settings.phone || "437-256-1028";
  const localPack = SITE_IMAGES.services[service.slug];
  const hero = localPack?.hero
    ? localPack.hero
    : resolveCmsImage(service.heroImage?.url, heroFallback(service.category));
  const heroAlt = service.heroImage?.alt || service.name;
  const residentialImg = localPack?.residential || PLACEHOLDER_IMAGES.residentialHome;
  const commercialImg = localPack?.commercial || PLACEHOLDER_IMAGES.officeBuilding;
  const ctaImg = localPack?.cta || PLACEHOLDER_IMAGES.nightCity;
  const commonProblems = service.commonProblems || [];
  const inclusions = service.inclusions || [];
  const residentialApps = service.residentialApps || [];
  const commercialApps = service.commercialApps || [];
  const faqs = service.faqs || [];

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.shortDescription,
          provider: {
            "@type": "LocalBusiness",
            name: settings.businessName || "VNEC",
            telephone: phone,
            email: settings.email,
            areaServed: settings.serviceArea,
          },
          url: absoluteUrl(`/services/${service.slug}`),
        }}
      />

      <section className="relative min-h-[48vh] overflow-hidden sm:min-h-[58vh] md:min-h-[75vh]">
        <div className="absolute inset-0">
          <Image
            src={hero}
            alt={heroAlt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#04080f]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04080f]/95 via-[#04080f]/75 to-[#04080f]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-transparent to-[#04080f]/40" />
        </div>
        <Container className="relative flex min-h-[48vh] flex-col justify-end px-4 pb-10 pt-6 sm:min-h-[58vh] sm:pb-14 md:min-h-[75vh] md:pb-20 md:pt-8">
          <Breadcrumbs
            items={[
              { label: "Services", href: "/services" },
              { label: service.name },
            ]}
            className="!px-0 !py-2"
          />
          <Reveal>
            <div className="mt-4 max-w-3xl sm:mt-6">
              <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                <Badge variant="cyan" className="capitalize">
                  {service.category}
                </Badge>
                {service.isEmergency ? (
                  <Badge variant="emergency">24/7 Emergency</Badge>
                ) : (
                  <Badge variant="muted">Scheduled service</Badge>
                )}
              </div>
              <h1 className="font-display text-[1.75rem] font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                {service.heroHeading || service.name}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-200 sm:mt-4 sm:text-lg">
                {service.heroSubheading || service.shortDescription}
              </p>
              <div className="btn-stack mt-6 sm:mt-8">
                <Link href="/request-service" className="btn-primary">
                  {service.ctaLabel || "Request Service"}
                </Link>
                <a href={phoneHref(phone)} className="btn-secondary">
                  <Phone className="h-4 w-4" /> {phone}
                </a>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal direction="left">
            <SectionHeading eyebrow="Overview" title={service.name} description={service.fullDescription} />
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(0, 3).map((img, i) => (
                <StaggerItem
                  key={`${img.url}-${i}`}
                  delay={i * 0.1}
                  direction={i === 0 ? "up" : i === 1 ? "left" : "right"}
                  className={i === 0 ? "col-span-2" : undefined}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl ${
                      i === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="40vw" />
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <Reveal direction="up">
            <SectionHeading eyebrow="Common problems" title="Issues we commonly resolve" className="mb-8" />
          </Reveal>
          <RevealStagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" alternate stagger={0.06}>
            {commonProblems.map((item) => (
              <div key={item} className="glass flex items-start gap-3 rounded-2xl px-5 py-4 text-sm text-slate-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                {item}
              </div>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="section-pad circuit-pattern">
        <Container>
          <Reveal direction="up">
            <SectionHeading eyebrow="What's included" title="Service inclusions" className="mb-8" />
          </Reveal>
          <RevealStagger className="grid gap-3 md:grid-cols-2" alternate stagger={0.06}>
            {inclusions.map((item) => (
              <div key={item} className="rounded-2xl border border-cyan-500/15 bg-white/5 px-5 py-4 text-slate-200">
                {item}
              </div>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal direction="left">
              <div className="glass overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={residentialImg}
                    alt={IMAGE_ALTS.residentialHome}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-2xl text-white">Residential applications</h2>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {residentialApps.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
            <Reveal direction="right" delay={0.12}>
              <div className="glass overflow-hidden rounded-3xl">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={commercialImg}
                    alt={IMAGE_ALTS.officeBuilding}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-6">
                  <h2 className="font-display text-2xl text-white">Commercial applications</h2>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {commercialApps.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container className="grid gap-8 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="glass h-full rounded-3xl p-8">
              <h2 className="font-display text-2xl text-white">Why hire a professional</h2>
              <p className="mt-4 leading-relaxed text-slate-300">{service.whyProfessional}</p>
            </div>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <div className="glass h-full rounded-3xl p-8">
              <h2 className="font-display text-2xl text-white">Safety statement</h2>
              <p className="mt-4 leading-relaxed text-slate-300">{service.safetyStatement}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="section-pad">
        <Container>
          <Reveal direction="up">
            <SectionHeading eyebrow="Process" title="How service works" className="mb-10" />
          </Reveal>
          <RevealStagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" alternate stagger={0.08}>
            {process.map((step, i) => (
              <div key={step.title} className="glass rounded-2xl p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan">Step {i + 1}</p>
                <h3 className="mt-2 font-display text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{step.description}</p>
              </div>
            ))}
          </RevealStagger>
        </Container>
      </section>

      <section className="section-pad pt-0">
        <Container>
          <div className="glass electric-border rounded-3xl p-8 md:p-10">
            <SectionHeading
              eyebrow="Pricing"
              title={service.startingPriceLabel || "Contact for starting price"}
              description="Starting labels are estimates only. Final pricing is confirmed after inspection before approved work begins."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" className="btn-secondary">
                View pricing overview
              </Link>
              <Link href="/request-service" className="btn-primary">
                Request a quote
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {(faqs).length > 0 ? (
        <section className="section-pad">
          <Container>
            <SectionHeading eyebrow="FAQs" title="Frequently asked questions" className="mb-8" />
            <div className="space-y-4">
              {(faqs).map((faq) => (
                <details key={faq.question} className="glass group rounded-2xl px-6 py-4">
                  <summary className="cursor-pointer list-none font-display text-lg text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="section-pad pt-0">
          <Container>
            <SectionHeading eyebrow="Related" title="Related services" className="mb-8" />
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((r: Service) => (
                <Link
                  key={r.slug}
                  href={`/services/${r.slug}`}
                  className="glass electric-border group flex gap-4 overflow-hidden rounded-2xl p-4 transition hover:border-cyan/40"
                >
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={resolveCmsImage(r.heroImage?.url, PLACEHOLDER_IMAGES.tools)}
                      alt={r.heroImage?.alt || r.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-white group-hover:text-cyan">{r.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">{r.shortDescription}</p>
                    <span className="mt-2 inline-flex items-center gap-1 text-sm text-cyan">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <section className="section-pad">
        <Container>
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src={ctaImg}
              alt={IMAGE_ALTS.nightCity}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#050a14]/80" />
            <div className="relative px-8 py-14 text-center md:px-12">
              <h2 className="font-display text-3xl text-white md:text-4xl">
                {service.isEmergency ? "Need emergency help now?" : "Ready to book this service?"}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                {service.isEmergency
                  ? `For immediate danger call 911 first. For urgent VNEC dispatch across the GTA, call ${phone} or submit a request.`
                  : `Submit a service request or call ${phone}. Serving ${settings.serviceArea || "the Greater Toronto Area"}.`}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/request-service" className="btn-primary">
                  Request Service
                </Link>
                <a href={phoneHref(phone)} className="btn-emergency">
                  <Phone className="h-4 w-4" /> Call {phone}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
