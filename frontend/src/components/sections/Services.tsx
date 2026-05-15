"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Compass,
  Boxes,
  Workflow,
  Gauge,
  GitMerge,
  Code2,
  ArrowRight,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GradientTitle } from "@/components/ui/GradientTitle";

/**
 * "How I Work With Companies" — services explainer.
 * Frames the offering: turning person-dependent operations into documented
 * systems, workflows, and a setup that scales — business + tech in one.
 */
const CARDS = [
  { key: "diagnose", Icon: Compass },
  { key: "systems", Icon: Boxes },
  { key: "workflows", Icon: Workflow },
  { key: "productivity", Icon: Gauge },
  { key: "bridge", Icon: GitMerge },
  { key: "software", Icon: Code2 },
] as const;

export function Services({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Services");

  return (
    <Section
      id="services"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(({ key, Icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "-60px" }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            className="panel rounded-xl p-5 h-full hover:border-[var(--color-gold-400)]/30 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center text-[var(--color-gold-500)]">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="font-display text-base font-semibold text-[var(--section-fg)]">
                {t(`cards.${key}.title`)}
              </h3>
            </div>
            <p className="text-sm text-[var(--section-muted)] leading-relaxed">
              {t(`cards.${key}.desc`)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Closing CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "-60px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8"
      >
        <Link
          href={`/contact?subject=${encodeURIComponent("Working With My Company")}`}
          className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 panel rounded-xl p-6 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-gold-400)]/40 hover:shadow-[0_8px_24px_-10px_var(--color-gold-500)]"
        >
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--section-fg)]">
              {t("ctaTitle")}
            </h3>
            <p className="mt-1 text-sm text-[var(--section-muted)] leading-relaxed">
              {t("ctaDesc")}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-gold-400)]/40 px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-gold-500)] transition-all group-hover:border-[var(--color-gold-400)] group-hover:gap-3">
            {t("ctaButton")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </motion.div>
    </Section>
  );
}
