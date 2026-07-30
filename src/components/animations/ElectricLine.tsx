"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export interface ElectricLineProps {
  className?: string;
  path?: string;
  height?: number;
}

export function ElectricLine({
  className,
  path = "M0 60 Q180 10 360 60 T720 60 T1080 60 T1440 60",
  height = 120,
}: ElectricLineProps) {
  const ref = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const gradId = useId().replace(/:/g, "");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (!pathRef.current || !glowRef.current || !ref.current) return;
        const length = pathRef.current.getTotalLength();
        gsap.set([pathRef.current, glowRef.current], {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              end: "bottom 25%",
              scrub: 0.6,
            },
          })
          .to([pathRef.current, glowRef.current], {
            strokeDashoffset: 0,
            ease: "none",
            duration: 1,
          })
          .to(
            glowRef.current,
            {
              opacity: 0.35,
              duration: 0.4,
            },
            0.6
          );
      }, ref);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [path]);

  return (
    <svg
      ref={ref}
      className={cn("w-full overflow-visible", className)}
      viewBox={`0 0 1440 ${height}`}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#22d3ee" />
          <stop offset="0.45" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <filter id={`${gradId}-glow`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref={glowRef}
        d={path}
        stroke={`url(#${gradId})`}
        strokeWidth="6"
        opacity="0.55"
        filter={`url(#${gradId}-glow)`}
      />
      <path
        ref={pathRef}
        d={path}
        stroke={`url(#${gradId})`}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default ElectricLine;
