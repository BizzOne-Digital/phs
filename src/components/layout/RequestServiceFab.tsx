"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface RequestServiceFabProps {
  label?: string;
  threshold?: number;
}

export function RequestServiceFab({
  label = "Request Service",
  threshold = 280,
}: RequestServiceFabProps) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const onRequestPage = pathname?.startsWith("/request-service");

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (onRequestPage) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="fixed bottom-[calc(max(1.25rem,env(safe-area-inset-bottom))+3.75rem)] right-4 z-[60] sm:right-6 md:bottom-[calc(2rem+3.75rem)] md:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ type: "spring", stiffness: 360, damping: 24 }}
        >
          <Link
            href="/request-service"
            className="btn-primary inline-flex !px-3.5 !py-3 shadow-2xl md:!px-4"
            aria-label={label}
          >
            <ClipboardList className="h-5 w-5 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default RequestServiceFab;
