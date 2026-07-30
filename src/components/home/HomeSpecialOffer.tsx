import { Reveal } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HomeSpecialOffer({
  text,
  active,
}: {
  text?: string;
  active?: boolean;
}) {
  if (!active || !text) return null;

  return (
    <Section className="!py-12">
      <Container className="px-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-amber/30 bg-gradient-to-r from-amber/15 via-electric/10 to-cyan/15 px-8 py-10 text-center md:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber">Special offer</p>
            <h2 className="font-display mt-3 text-3xl font-bold text-white md:text-4xl">{text}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-silver">
              Mention this offer when you request service. Final eligibility is confirmed before work begins.
            </p>
            <Button href="/request-service" className="mt-6">
              Claim offer / Request service
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
