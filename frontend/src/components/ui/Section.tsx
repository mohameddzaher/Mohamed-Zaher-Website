"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  containerClassName?: string;
  /** Controls background: dark (default) or light */
  tone?: "dark" | "light";
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  align = "center",
  className,
  containerClassName,
  tone = "dark",
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-20",
        tone === "light" ? "section-light" : "section-dark",
        className,
      )}
      {...props}
    >
      <div className={cn("container-x", containerClassName)}>
        {(eyebrow || title || description) && (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "-60px" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mb-10 max-w-3xl",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-600)] bg-[var(--color-brand-500)]/10 border border-[var(--color-brand-500)]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-600)] animate-pulse-soft" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-[var(--section-fg)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-4 text-base md:text-lg text-[var(--section-muted)] leading-relaxed">
                {description}
              </p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
}
