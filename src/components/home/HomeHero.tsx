import Image from "next/image";
import Link from "next/link";
import { PhoneCall, ShieldCheck, Clock3, MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import { phoneHref } from "@/lib/utils";
import { BUSINESS } from "@/lib/constants";

export function HomeHero({
  phone,
  emergencyPhone,
  serviceArea,
  emergencyAvailability,
  eyebrow,
  headline,
  description,
}: {
  phone: string;
  emergencyPhone: string;
  serviceArea: string;
  emergencyAvailability: string;
  eyebrow?: string;
  headline?: string;
  description?: string;
}) {
  return (
    <section className="relative min-h-[auto] overflow-hidden pt-6 sm:pt-10 md:min-h-[88vh] md:pt-16">
      <div className="absolute inset-0">
        <Image
          src={SITE_IMAGES.home.heroBg}
          alt={IMAGE_ALTS.nightCity}
          fill
          priority
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep via-deep/85 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-deep/50" />
      </div>

      <Container className="relative z-10 grid items-center gap-8 pb-12 sm:gap-12 sm:pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
        <Reveal direction="left" duration={0.9}>
          <Badge variant="emergency" className="mb-4 max-w-full truncate sm:mb-5">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
            </span>
            <span className="truncate">{emergencyAvailability}</span>
          </Badge>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan sm:mb-3 sm:text-sm">
            {eyebrow || "Premier Home Services"}
          </p>
          <h1 className="font-display text-[1.85rem] font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {headline || BUSINESS.headline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-silver sm:mt-6 sm:text-lg">
            {description ||
              "Fast, reliable electrical, HVAC, and plumbing support for homes and businesses across the Greater Toronto Area—scheduled appointments and 24/7 emergency response."}
          </p>
          <div className="btn-stack mt-6 sm:mt-8">
            <Button href="/request-service" size="lg">
              Request Service
            </Button>
            <Button href={phoneHref(emergencyPhone)} variant="emergency" size="lg">
              <PhoneCall className="h-4 w-4 shrink-0" />
              <span className="sm:hidden">Call 24/7</span>
              <span className="hidden sm:inline">Call 24/7 Emergency Line</span>
            </Button>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-sm text-silver sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-cyan" /> Licensed technicians
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 shrink-0 text-cyan" /> Same-day & emergency
            </span>
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {serviceArea}
            </span>
          </div>
          <p className="mt-4 text-sm text-muted">
            Or call{" "}
            <Link href={phoneHref(phone)} className="font-semibold text-cyan hover:underline">
              {phone}
            </Link>
          </p>
        </Reveal>

        <Reveal delay={0.15} direction="right" className="relative">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl electric-border">
              <Image
                src={SITE_IMAGES.home.heroElectrical}
                alt={IMAGE_ALTS.electricalTech}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 40vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image src={SITE_IMAGES.home.heroHvac} alt={IMAGE_ALTS.hvacUnit} fill className="object-cover" sizes="40vw" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={SITE_IMAGES.home.heroPlumbing}
                alt={IMAGE_ALTS.plumbingRepair}
                fill
                className="object-cover"
                sizes="40vw"
              />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
