"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "phs-cookie-consent";

export interface CookieNoticeProps {
  analyticsId?: string;
}

export function CookieNotice({ analyticsId }: CookieNoticeProps) {
  const [visible, setVisible] = useState(() => {
    if (!analyticsId || typeof window === "undefined") return false;
    return !localStorage.getItem(STORAGE_KEY);
  });

  if (!analyticsId) return null;

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="glass-strong fixed inset-x-4 bottom-20 z-[65] mx-auto max-w-xl rounded-2xl p-4 shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          role="dialog"
          aria-label="Cookie notice"
        >
          <div className="flex gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-electric/30 bg-electric/15 text-cyan">
              <Cookie className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">We value your privacy</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                We use analytics cookies to understand site usage and improve your experience.
                You can accept or decline non-essential analytics.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={accept}>
                  Accept
                </Button>
                <Button size="sm" variant="secondary" onClick={decline}>
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default CookieNotice;
