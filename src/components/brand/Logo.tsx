import { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  priority?: boolean;
}

function LogoMark({ className, uid }: { className?: string; uid: string }) {
  const bolt = `${uid}-bolt`;
  const ring = `${uid}-ring`;

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={bolt} x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="0.55" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={ring} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.7" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <circle
        cx="24"
        cy="24"
        r="20"
        stroke={`url(#${ring})`}
        strokeWidth="1.75"
        strokeDasharray="4 3.5 2 3.5"
        opacity="0.9"
      />
      <circle cx="24" cy="4" r="1.6" fill="#22d3ee" />
      <circle cx="44" cy="24" r="1.6" fill="#3b82f6" />
      <circle cx="24" cy="44" r="1.6" fill="#f59e0b" />
      <circle cx="4" cy="24" r="1.6" fill="#22d3ee" />
      <path
        d="M27.5 8.5 16 24.2h7.2L18.8 39.5 33.5 22.8h-7.4L27.5 8.5Z"
        fill={`url(#${bolt})`}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-xl font-bold tracking-[0.18em] text-gradient-electric sm:text-2xl",
        className
      )}
    >
      PHS
    </span>
  );
}

export function Logo({ className, variant = "full", priority = false }: LogoProps) {
  const uid = useId().replace(/:/g, "");

  const content =
    variant === "mark" ? (
      <LogoMark className="h-9 w-9" uid={uid} />
    ) : variant === "wordmark" ? (
      <Wordmark />
    ) : (
      <span className="inline-flex items-center gap-2.5">
        <LogoMark className="h-9 w-9" uid={uid} />
        <Wordmark />
      </span>
    );

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center transition-opacity hover:opacity-90", className)}
      aria-label="Premier Home Services home"
      {...(priority ? { "data-priority": "true" } : {})}
    >
      {content}
    </Link>
  );
}

export default Logo;
