"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function PageTransition() {
  const pathname = usePathname();
  const [flash, setFlash] = useState(false);
  const reduce = prefersReducedMotion();

  useEffect(() => {
    if (reduce || pathname.startsWith("/admin")) return;
    const show = window.setTimeout(() => setFlash(true), 0);
    const hide = window.setTimeout(() => setFlash(false), 620);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {flash ? (
        <motion.div
          key={`flash-${pathname}`}
          className="pointer-events-none fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-transparent via-cyan to-electric shadow-[0_0_24px_rgba(34,211,238,0.8)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-electric/25 via-cyan/10 to-transparent"
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric/30 blur-3xl"
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.55 }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default PageTransition;
