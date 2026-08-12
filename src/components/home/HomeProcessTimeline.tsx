import { CmsImage } from "@/components/cms/CmsImage";
import { Reveal } from "@/components/animations/Reveal";
import { Counter } from "@/components/animations/Counter";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/lib/constants";
import { IMAGE_ALTS } from "@/lib/placeholders";
import { SITE_IMAGES } from "@/lib/site-images";

export function HomeProcessTimeline({
  images,
}: {
  images?: Array<{ url?: string; alt?: string }>;
}) {
  return (
    <Section>
      <Container>
        <div className="grid items-stretch gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <Reveal className="flex h-full min-h-0 flex-col">
            <SectionHeading
              eyebrow="Our process"
              title="From request to quality check"
              description="A clear path so you always know what happens next."
            />
            <div className="relative mt-8 min-h-[220px] flex-1 overflow-hidden rounded-3xl lg:min-h-0">
              <CmsImage
                src={images?.[0]?.url}
                fallback={SITE_IMAGES.home.process}
                alt={images?.[0]?.alt || IMAGE_ALTS.blueprint}
                fill
                className="object-cover object-center"
                sizes="(max-width:1024px) 100vw, 40vw"
              />
            </div>
          </Reveal>
          <ol className="flex h-full flex-col justify-between gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.05}>
                <li className="glass flex gap-4 rounded-2xl p-4 md:p-5">
                  <div className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-electric/20 text-lg font-bold text-cyan">
                    <Counter value={i + 1} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
