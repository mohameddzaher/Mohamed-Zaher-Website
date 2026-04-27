"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
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
  "relative inline-flex items-center justify-center gap-2 font-medium rounded-lg whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--section-bg)] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "text-white font-semibold shadow-[0_4px_16px_-4px_var(--color-brand-600)] hover:shadow-[0_6px_24px_-4px_var(--color-brand-600)] [background:linear-gradient(135deg,var(--color-brand-500),var(--color-brand-700))] hover:brightness-110",
  secondary:
    "panel text-[var(--section-fg)] hover:border-[var(--color-brand-500)]/40",
  ghost:
    "bg-transparent text-[var(--section-fg)] hover:bg-[var(--section-panel)]",
  outline:
    "border border-[var(--section-border)] bg-transparent text-[var(--section-fg)] hover:border-[var(--color-brand-500)] hover:text-[var(--color-brand-600)]",
  danger: "bg-red-700 text-white hover:bg-red-800",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs h-8",
  md: "px-4 py-2 text-sm h-10",
  lg: "px-5 py-2.5 text-sm h-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
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
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
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
