import Link from "next/link";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { PricingItem } from "@/types";

export function HomePricingPreview({
  items,
}: {
  items: PricingItem[];
}) {
  const cards = items.slice(0, 6);

  return (
    <Section tone="deep">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Starting estimates you can plan around"
            description="Transparent starting prices—final quotes follow inspection and scope confirmation."
            align="center"
          />
        </Reveal>
        <RevealStagger className="mt-12 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3" alternate stagger={0.1}>
          {cards.map((item) => (
            <article
              key={item._id}
              className="glass electric-border flex h-full min-h-0 flex-col rounded-2xl p-5 sm:min-h-[280px] sm:p-6"
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="muted">{item.category}</Badge>
                {item.isEmergency ? <Badge variant="emergency">Emergency</Badge> : null}
                {item.featured ? <Badge variant="amber">Featured</Badge> : null}
              </div>
              <h3 className="font-display text-xl font-bold text-white">{item.serviceName}</h3>
              <p className="mt-3 text-2xl font-semibold text-cyan">{item.startingPrice}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                {item.description || "\u00A0"}
              </p>
              <Link
                href={item.ctaUrl || "/request-service"}
                className="mt-auto pt-5 text-sm font-semibold text-cyan hover:underline"
              >
                {item.ctaLabel || "Request Service"} →
              </Link>
            </article>
          ))}
        </RevealStagger>
        <div className="mt-8 text-center">
          <Button href="/pricing" variant="secondary">
            View full pricing
          </Button>
        </div>
      </Container>
    </Section>
  );
}
