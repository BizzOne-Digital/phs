"use client";

import { cn } from "@/lib/utils";

export interface MarqueeProps {
  items: string[];
  className?: string;
  speedSeconds?: number;
}

export function Marquee({ items, className, speedSeconds = 32 }: MarqueeProps) {
  const sequence = [...items, ...items];

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-electric/15 bg-navy/40 py-4",
        className
      )}
      aria-label="Trusted highlights"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
      <div
        className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap"
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {sequence.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-silver/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
