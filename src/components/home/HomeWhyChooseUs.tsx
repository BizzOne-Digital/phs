import { Shield, Scale, Timer, MessageSquare, Wrench, HeartHandshake } from "lucide-react";
import { Reveal, RevealStagger } from "@/components/animations/Reveal";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WHY_CHOOSE } from "@/lib/constants";

const icons = [Shield, Scale, Timer, MessageSquare, Wrench, HeartHandshake];

export function HomeWhyChooseUs() {
  return (
    <Section tone="energy">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why choose us"
            title="Service standards that protect your property"
            description="From first contact to final check, we focus on professionalism, clarity, and careful workmanship."
            align="center"
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" alternate stagger={0.08}>
          {WHY_CHOOSE.map((item, i) => {
            const Icon = icons[i] || Shield;
            return (
              <div key={item.title} className="glass rounded-2xl p-6">
                <Icon className="mb-4 h-7 w-7 text-cyan" />
                <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            );
          })}
        </RevealStagger>
      </Container>
    </Section>
  );
}
