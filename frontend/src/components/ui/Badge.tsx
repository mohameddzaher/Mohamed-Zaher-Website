import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "brand" | "violet" | "outline" | "luxury" | "success" | "warning";

const variants: Record<Variant, string> = {
  default:
    "bg-[var(--section-panel)] text-[var(--section-fg)] border-[var(--section-border)]",
  brand:
    "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-600)] border-[var(--color-brand-500)]/30",
  violet:
    "bg-[var(--color-brand-400)]/10 text-[var(--color-brand-600)] border-[var(--color-brand-400)]/30",
  outline:
    "bg-transparent text-[var(--section-fg)] border-[var(--section-border)]",
  luxury:
    "bg-[color-mix(in_srgb,var(--color-gold-400)_8%,transparent)] text-[var(--color-gold-300)] border-[var(--color-gold-400)]/30",
  success:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  warning:
    "bg-[var(--color-gold-400)]/10 text-[var(--color-gold-300)] border-[var(--color-gold-400)]/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "luxury", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-light uppercase tracking-[0.18em] border",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
