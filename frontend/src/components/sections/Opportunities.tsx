"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { TrendingUp, Handshake, Rocket, Briefcase, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GradientTitle } from "@/components/ui/GradientTitle";

const CARDS = [
  {
    key: "invest",
    Icon: TrendingUp,
    subject: "Investment Opportunity",
  },
  {
    key: "partner",
    Icon: Handshake,
    subject: "Partnership Proposal",
  },
  {
    key: "startup",
    Icon: Rocket,
    subject: "Startup Collaboration",
  },
  {
    key: "advisory",
    Icon: Briefcase,
    subject: "Consulting Request",
  },
] as const;

export function Opportunities({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Opportunities");

  return (
    <Section
      id="opportunities"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ key, Icon, subject }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15, margin: "-60px" }}
            transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href={`/contact?subject=${encodeURIComponent(subject)}`}
              className="group block panel rounded-xl p-5 h-full transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--color-brand-500)]/40 hover:shadow-[0_8px_24px_-10px_var(--color-brand-600)]"
            >
              <div className="h-10 w-10 rounded-lg bg-[var(--color-brand-500)]/10 border border-[var(--color-brand-500)]/30 flex items-center justify-center mb-3">
                <Icon className="h-4 w-4 text-[var(--color-brand-600)]" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1.5 text-[var(--section-fg)]">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="text-sm text-[var(--section-muted)] leading-relaxed">
                {t(`cards.${key}.desc`)}
              </p>
              <div className="mt-4 pt-3 border-t border-[var(--section-border)] flex items-center justify-between text-xs font-medium text-[var(--color-brand-600)] group-hover:gap-2 transition-all">
                <span>{t("cta")}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
