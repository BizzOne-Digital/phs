"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  emergency: "btn-emergency",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 font-semibold text-silver transition hover:bg-white/5 hover:text-foreground",
  link: "inline-flex items-center gap-1 font-semibold text-cyan underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "",
  lg: "px-7 py-3.5 text-base",
} as const;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  href?: string;
  external?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      external,
      children,
      type = "button",
      disabled,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      variants[variant],
      size !== "md" && sizes[size],
      disabled && "pointer-events-none opacity-50",
      className
    );

    if (href) {
      if (external) {
        return (
          <a
            href={href}
            className={classes}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={disabled}
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes} aria-disabled={disabled}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
