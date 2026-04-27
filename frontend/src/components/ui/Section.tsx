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
        "relative py-24 md:py-32 [content-visibility:auto] [contain-intrinsic-size:1px_900px]",
        tone === "light" ? "section-light" : "section-dark",
        className,
      )}
      {...props}
    >
      <div className={cn("container-x", containerClassName)}>
        {(eyebrow || title || description) && (
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "mb-14 md:mb-16 max-w-3xl",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <div
                className={cn(
                  "mb-5 inline-flex items-center gap-3 text-[10px] font-light uppercase tracking-[0.32em] text-[var(--section-accent)]",
                  align === "center" ? "justify-center" : "",
                )}
              >
                <span aria-hidden className="rule-luxe" />
                {eyebrow}
                <span aria-hidden className="rule-luxe" />
              </div>
            )}
            {title && (
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.01em] leading-[1.05] text-[var(--section-fg)]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-6 text-base md:text-lg text-[var(--section-muted)] leading-relaxed font-light">
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
