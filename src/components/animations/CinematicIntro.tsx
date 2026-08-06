"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Droplets, Wind, Zap } from "lucide-react";

const STORAGE_KEY = "phs-intro-seen";

export function CinematicIntro() {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || sessionStorage.getItem(STORAGE_KEY) === "1") {
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timers = [
      window.setTimeout(() => setPhase(1), 350),
      window.setTimeout(() => setPhase(2), 1100),
      window.setTimeout(() => setPhase(3), 2000),
      window.setTimeout(() => setPhase(4), 2800),
      window.setTimeout(() => finish(), 3600),
    ];

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function finish() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-deep"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          role="dialog"
          aria-label="Premier Home Services introduction"
        >
          <div className="pointer-events-none absolute inset-0 circuit-pattern opacity-40" />

          {/* Particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-cyan/80"
              style={{
                left: `${8 + ((i * 17) % 84)}%`,
                top: `${12 + ((i * 29) % 76)}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, -24 - (i % 5) * 6],
                scale: [0.6, 1.2, 0.4],
              }}
              transition={{
                duration: 2.2 + (i % 4) * 0.25,
                repeat: Infinity,
                delay: i * 0.08,
              }}
            />
          ))}

          {/* Electric current line */}
          <svg
            className="absolute left-0 top-1/2 h-24 w-full -translate-y-1/2"
            viewBox="0 0 1200 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <motion.path
              d="M0 50 Q150 10 300 50 T600 50 T900 50 T1200 50"
              fill="none"
              stroke="url(#intro-line)"
              strokeWidth="2.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={
                phase >= 1
                  ? { pathLength: 1, opacity: [0.4, 1, 0.7] }
                  : { pathLength: 0, opacity: 0 }
              }
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="intro-line" x1="0" y1="0" x2="1" y2="0">
                <stop stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <div className="mb-8 flex items-center gap-6 sm:gap-10">
              {[
                { Icon: Zap, label: "Power", delay: 0 },
                { Icon: Wind, label: "Comfort", delay: 0.12 },
                { Icon: Droplets, label: "Flow", delay: 0.24 },
              ].map(({ Icon, label, delay }) => (
                <motion.div
                  key={label}
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 18, scale: 0.85 }}
                  animate={
                    phase >= 2
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 18, scale: 0.85 }
                  }
                  transition={{ duration: 0.45, delay }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-electric/35 bg-electric/15 text-cyan shadow-[0_0_28px_rgba(59,130,246,0.35)] sm:h-16 sm:w-16">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-silver">
                    {label}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.p
              className="font-display text-2xl font-semibold tracking-wide text-foreground sm:text-3xl"
              initial={{ opacity: 0, letterSpacing: "0.4em" }}
              animate={
                phase >= 3
                  ? { opacity: 1, letterSpacing: "0.08em" }
                  : { opacity: 0, letterSpacing: "0.4em" }
              }
              transition={{ duration: 0.55 }}
            >
              Power. Comfort. Flow.
            </motion.p>

            <motion.h1
              className="mt-5 font-display text-5xl font-bold tracking-[0.28em] text-gradient sm:text-6xl"
              initial={{ opacity: 0, filter: "brightness(0.4)" }}
              animate={
                phase >= 4
                  ? { opacity: 1, filter: "brightness(1.15)" }
                  : { opacity: 0, filter: "brightness(0.4)" }
              }
              transition={{ duration: 0.65 }}
            >
              PHS
            </motion.h1>
          </div>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 right-6 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-silver transition hover:border-cyan/40 hover:text-foreground"
          >
            Skip Intro
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default CinematicIntro;
