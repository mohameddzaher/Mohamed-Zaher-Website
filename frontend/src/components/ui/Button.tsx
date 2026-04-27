"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "luxury" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-gold-400)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--section-bg)] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]";

const variants: Record<Variant, string> = {
  // Reserved for the Hero CTA — keeps the rose primary
  primary:
    "rounded-full font-medium text-white shadow-[0_4px_16px_-4px_var(--color-brand-600)] hover:shadow-[0_8px_28px_-6px_var(--color-brand-600)] [background:linear-gradient(135deg,var(--color-brand-500),var(--color-brand-700))] hover:brightness-110",
  // The new default for non-hero CTAs — champagne hairline
  luxury:
    "rounded-full font-light tracking-[0.18em] uppercase text-[var(--color-gold-200)] border border-[var(--color-gold-400)]/40 hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-100)] hover:bg-[color-mix(in_srgb,var(--color-gold-400)_8%,transparent)]",
  secondary:
    "rounded-full font-light tracking-wide text-[var(--section-fg)] border border-[var(--section-border)] hover:border-[var(--color-gold-400)]/50",
  ghost:
    "rounded-full font-light tracking-wide bg-transparent text-[var(--section-fg)] hover:bg-[var(--section-panel)]",
  outline:
    "rounded-full font-light tracking-wide border border-[var(--section-border)] bg-transparent text-[var(--section-fg)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-300)]",
  danger:
    "rounded-full font-medium bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-1.5 text-[10px] h-8",
  md: "px-5 py-2 text-xs h-10",
  lg: "px-7 py-2.5 text-xs h-12",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "luxury",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {loading && (
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-r-transparent" />
          </span>
        )}
        <span className={cn("inline-flex items-center gap-2", loading && "opacity-0")}>
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";
