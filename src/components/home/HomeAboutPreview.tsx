import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CmsImage } from "@/components/cms/CmsImage";
import { SITE_IMAGES } from "@/lib/site-images";
import { IMAGE_ALTS } from "@/lib/placeholders";

export function HomeAboutPreview({
  eyebrow,
  title,
  description,
  body,
  ctaLabel,
  ctaUrl,
  imageUrl,
  imageAlt,
  images,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  images?: Array<{ url?: string; alt?: string }>;
}) {
  const gallery = [
    { src: images?.[0]?.url || imageUrl, alt: images?.[0]?.alt || imageAlt || IMAGE_ALTS.teamWork, fallback: SITE_IMAGES.home.aboutMain },
    { src: images?.[1]?.url, alt: images?.[1]?.alt || IMAGE_ALTS.tools, fallback: SITE_IMAGES.home.aboutTools },
    { src: images?.[2]?.url, alt: images?.[2]?.alt || IMAGE_ALTS.safetyGear, fallback: SITE_IMAGES.home.aboutSafety },
  ];
  return (
    <Section>
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" className="relative grid grid-cols-2 gap-4">
          <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-2xl">
            <CmsImage src={gallery[0].src} fallback={gallery[0].fallback} alt={gallery[0].alt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 45vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <CmsImage src={gallery[1].src} fallback={gallery[1].fallback} alt={gallery[1].alt} fill className="object-cover" sizes="22vw" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <CmsImage src={gallery[2].src} fallback={gallery[2].fallback} alt={gallery[2].alt} fill className="object-cover" sizes="22vw" />
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
