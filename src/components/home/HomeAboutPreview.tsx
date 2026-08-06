import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { PLACEHOLDER_IMAGES, IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";

export function HomeAboutPreview({
  eyebrow,
  title,
  description,
  body,
  ctaLabel,
  ctaUrl,
  imageUrl,
  imageAlt,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="relative grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl">
            <Image
              src={imageUrl || SITE_IMAGES.home.aboutMain}
              alt={imageAlt || IMAGE_ALTS.teamWork}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 45vw"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src={SITE_IMAGES.home.aboutTools} alt={IMAGE_ALTS.tools} fill className="object-cover" sizes="22vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={SITE_IMAGES.home.aboutSafety}
              alt={IMAGE_ALTS.safetyGear}
              fill
              className="object-cover"
              sizes="22vw"
            />
          </div>
        </Reveal>
        <Reveal direction="right" delay={0.12}>
          <SectionHeading
            eyebrow={eyebrow || "About Premier Home Services"}
            title={title || "Built around reliability, safety, and clear communication"}
            description={
              description ||
              "Our mission is to deliver fast, reliable, and professional electrical, HVAC, and plumbing services through licensed, skilled technicians—with transparent communication and workmanship you can trust."
            }
          />
          {body ? <p className="mt-5 text-muted">{body}</p> : null}
          <Button href={ctaUrl || "/about"} variant="secondary" className="mt-8">
            {ctaLabel || "Learn more about us"}
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
