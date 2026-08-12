import { CmsImage } from "@/components/cms/CmsImage";
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
  images,
}: {
  phone: string;
  email: string;
  emergencyAvailability: string;
  images?: Array<{ url?: string; alt?: string }>;
}) {
  return (
    <Section className="!pt-8">
      <Container>
        <Reveal direction="scale">
          <div className="relative overflow-hidden rounded-3xl electric-border">
            <div className="absolute inset-0">
              <CmsImage
                src={images?.[0]?.url}
                fallback={SITE_IMAGES.home.ctaHome}
                alt={images?.[0]?.alt || IMAGE_ALTS.residentialHome}
                fill
                className="object-cover opacity-30"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-deep via-navy/90 to-deep/80" />
            </div>
            <div className="relative z-10 px-5 py-10 text-center sm:px-8 sm:py-14 md:px-16 md:py-20">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan">
                Ready when you need us
              </p>
              <h2 className="font-display mt-4 text-2xl font-bold text-white sm:text-3xl md:text-5xl">
                Call now or request service online
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-silver sm:text-base">
                {emergencyAvailability}. Reach us at {phone} or {email} for electrical, HVAC, and plumbing support across the GTA.
              </p>
              <div className="btn-stack mt-8 justify-center">
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
