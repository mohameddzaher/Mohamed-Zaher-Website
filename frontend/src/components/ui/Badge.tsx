import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "default" | "brand" | "violet" | "outline" | "success" | "warning";

const variants: Record<Variant, string> = {
  default: "bg-[var(--section-panel)] text-[var(--section-fg)] border-[var(--section-border)]",
  brand: "bg-[var(--color-brand-500)]/10 text-[var(--color-brand-600)] border-[var(--color-brand-500)]/30",
  violet: "bg-[var(--color-brand-400)]/10 text-[var(--color-brand-600)] border-[var(--color-brand-400)]/30",
  outline: "bg-transparent text-[var(--section-fg)] border-[var(--section-border)]",
  success: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-500 border-amber-500/30",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
