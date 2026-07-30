"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { SmoothScroll } from "./SmoothScroll";
import { PageTransition } from "./PageTransition";
import { CursorGlow } from "./CursorGlow";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const chrome = (
    <>
      {!isAdmin ? <PageTransition /> : null}
      {!isAdmin ? <CursorGlow /> : null}
      {children}
      {!isAdmin ? (
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            classNames: {
              toast:
                "glass-strong border border-electric/25 text-foreground shadow-[0_0_30px_rgba(59,130,246,0.2)]",
              title: "font-semibold",
              description: "text-muted",
            },
          }}
        />
      ) : null}
    </>
  );

  if (isAdmin) return chrome;

  return <SmoothScroll>{chrome}</SmoothScroll>;
}

export default Providers;
