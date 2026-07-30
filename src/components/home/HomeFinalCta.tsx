import Image from "next/image";
import { PhoneCall } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";
import { phoneHref } from "@/lib/utils";

export function HomeFinalCta({
  phone,
  email,
  emergencyAvailability,
}: {
  phone: string;
  email: string;
  emergencyAvailability: string;
}) {
  return (
    <Section className="!pt-8">
      <Container className="px-4">
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-3xl electric-border">
            <div className="absolute inset-0">
              <Image
                src={SITE_IMAGES.home.ctaHome}
                alt={IMAGE_ALTS.residentialHome}
                fill
                className="object-cover opacity-30"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep via-navy/90 to-deep/80" />
            </div>
            <div className="relative z-10 px-8 py-14 text-center md:px-16 md:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
                Ready when you need us
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold text-white md:text-5xl">
                Call now or request service online
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-silver">
                {emergencyAvailability}. Reach us at {phone} or {email} for electrical, HVAC, and plumbing support across the GTA.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={phoneHref(phone)} variant="emergency" size="lg">
                  <PhoneCall className="h-4 w-4" /> Call {phone}
                </Button>
                <Button href="/request-service" size="lg">
                  Request Service
                </Button>
                <Button href="/contact" variant="secondary" size="lg">
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
