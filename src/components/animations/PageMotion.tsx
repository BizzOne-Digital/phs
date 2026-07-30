"use client";

import { Reveal, RevealAlternate, StaggerItem } from "@/components/animations/Reveal";

type Direction = "up" | "down" | "left" | "right" | "scale";

/** Hero text / title block — rises from below with slight scale */
export function HeroReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal className={className} direction="scale" delay={delay} duration={0.85}>
      {children}
    </Reveal>
  );
}

/** Two-column split: text one side, media the other */
export function SplitReveal({
  left,
  right,
  className,
  reverse = false,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div className={className}>
      <Reveal direction={reverse ? "right" : "left"} className="h-full">
        {left}
      </Reveal>
      <Reveal direction={reverse ? "left" : "right"} delay={0.12} className="h-full">
        {right}
      </Reveal>
    </div>
  );
}

/** Card / list item with staggered entrance */
export function CardReveal({
  children,
  index = 0,
  className,
  direction,
}: {
  children: React.ReactNode;
  index?: number;
  className?: string;
  direction?: Direction;
}) {
  const cycle: Direction[] = ["up", "left", "right", "up"];
  return (
    <StaggerItem
      className={className}
      delay={index * 0.08}
      direction={direction || cycle[index % cycle.length]}
    >
      {children}
    </StaggerItem>
  );
}

export { Reveal, RevealAlternate };
