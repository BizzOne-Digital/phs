import { cn } from "@/lib/utils";

const variants = {
  default: "border-electric/30 bg-electric/15 text-cyan",
  electric: "border-electric/40 bg-electric/20 text-electric",
  cyan: "border-cyan/40 bg-cyan/15 text-cyan",
  amber: "border-amber/40 bg-amber/15 text-amber",
  emergency: "border-danger/40 bg-danger/15 text-danger",
  muted: "border-white/10 bg-white/5 text-muted",
} as const;

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: keyof typeof variants;
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
