"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BackToTopProps {
  className?: string;
  threshold?: number;
}

export function BackToTop({ className, threshold = 480 }: BackToTopProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          onClick={scrollTop}
          className={cn(
            "fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-electric/35 bg-navy/90 text-cyan shadow-lg backdrop-blur transition hover:border-cyan/50 hover:text-foreground md:bottom-8 md:left-8",
            className
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}

export default BackToTop;
