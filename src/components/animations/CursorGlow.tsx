"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function cursorGlowEnabled() {
  if (typeof window === "undefined") return false;
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && !reduce;
}

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [enabled] = useState(cursorGlowEnabled);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed z-[55] hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22)_0%,rgba(34,211,238,0.08)_35%,transparent_70%)] mix-blend-screen md:block"
      aria-hidden
      animate={{ left: pos.x, top: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 28, mass: 0.4 }}
    />
  );
}

export default CursorGlow;
