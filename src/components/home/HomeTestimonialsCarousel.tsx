"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Testimonial } from "@/types";

export function HomeTestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.length ? testimonials : [];
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const current = items[index % items.length];

  return (
    <Section tone="deep">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What clients say about working with Premier Home Services"
          description="Trusted by homeowners and businesses across the GTA."
          align="center"
        />
        <div className="relative mx-auto mt-12 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={current._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="glass electric-border rounded-3xl p-8 text-center md:p-12"
            >
              <Quote className="mx-auto mb-4 h-8 w-8 text-cyan" />
              <div className="mb-4 flex justify-center gap-1">
                {Array.from({ length: Math.max(1, Math.min(5, current.rating || 5)) }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber text-amber" />
                ))}
              </div>
              <p className="text-lg leading-relaxed text-silver md:text-xl">&ldquo;{current.quote}&rdquo;</p>
              <footer className="mt-6">
                <p className="font-semibold text-white">{current.attribution}</p>
                {current.role ? <p className="text-sm text-muted">{current.role}</p> : null}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              className="rounded-full border border-electric/30 p-2 text-silver hover:border-cyan/50 hover:text-white"
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              className="rounded-full border border-electric/30 p-2 text-silver hover:border-cyan/50 hover:text-white"
              onClick={() => setIndex((i) => (i + 1) % items.length)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
