"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs: { href?: string; label: string }[];
  tone?: "dark" | "light";
}

export function PageHeader({ eyebrow, title, description, crumbs, tone = "dark" }: Props) {
  return (
    <section
      className={tone === "light" ? "section-light" : "section-dark"}
    >
      <div className="container-x pt-28 md:pt-32 pb-10 md:pb-12">
        <Breadcrumb items={crumbs} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest text-[var(--color-gold-400)] bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-sm md:text-base text-[var(--section-muted)] leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
