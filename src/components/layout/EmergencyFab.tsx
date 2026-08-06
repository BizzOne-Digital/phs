"use client";

import { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { phoneHref } from "@/lib/utils";

export interface EmergencyFabProps {
  phone: string;
  label?: string;
}

export function EmergencyFab({ phone, label = "Emergency" }: EmergencyFabProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.a
          href={phoneHref(phone)}
          className="btn-emergency fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-[60] !px-3.5 !py-3 shadow-2xl sm:right-6 md:bottom-8 md:right-8 md:!px-4"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
          aria-label={`${label} call ${phone}`}
        >
          <PhoneCall className="h-5 w-5" />
          <span className="hidden sm:inline">{label}</span>
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}

export default EmergencyFab;
