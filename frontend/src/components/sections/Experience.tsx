"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { EXPERIENCE } from "@/lib/data";
import { useBi } from "@/lib/i18nText";

export function Experience({
  tone = "dark",
  compact = false,
  limit,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  limit?: number;
}) {
  const t = useTranslations("Experience");
  const localize = useBi();
  const items = typeof limit === "number" ? EXPERIENCE.slice(0, limit) : EXPERIENCE;

  return (
    <Section
      id="experience"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
    >
      <div className="relative max-w-3xl mx-auto">
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-3 md:left-1/2 md:-translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-brand-500)]/30 to-transparent pointer-events-none"
        />

        <ul className="relative space-y-8">
          {items.map((e, i) => {
            const left = i % 2 === 0;
            const company = localize(e.company);
            const role = localize(e.role);
            const start = localize(e.start);
            const end = localize(e.end);
            return (
              <motion.li
                key={`${company}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15, margin: "-60px" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative grid md:grid-cols-2 gap-4 md:gap-8 items-start"
              >
                <div className="absolute left-3 md:left-1/2 -translate-x-1/2 top-1 z-10">
                  <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand-500)] shadow-[0_0_12px_var(--color-brand-500)]" />
                </div>

                <div
                  className={`pl-8 md:pl-0 ${left ? "md:text-right md:pr-8" : "md:order-2 md:pl-8"}`}
                >
                  <div className="font-mono text-[10px] text-[var(--color-brand-600)] uppercase tracking-widest">
                    {start} — {end}
                  </div>
                  <h3 className="mt-1 font-display text-base font-semibold">{role}</h3>
                  <p className="text-xs text-[var(--section-muted)] mt-0.5">{company}</p>
                </div>

                <div
                  className={`pl-8 md:pl-0 ${left ? "md:order-2 md:pl-8" : "md:text-right md:pr-8"}`}
                >
                  <div className="panel rounded-lg p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <Briefcase className="h-3.5 w-3.5 text-[var(--color-brand-600)] mt-0.5 shrink-0" />
                      <p className="font-medium text-xs">{t("highlights")}</p>
                    </div>
                    <ul className="space-y-1.5 text-xs text-[var(--section-muted)] leading-relaxed">
                      {e.achievements.map((a, ai) => (
                        <li key={ai} className="flex gap-1.5 text-start">
                          <span className="text-[var(--color-brand-500)] shrink-0">›</span>
                          <span>{localize(a)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>

      {compact && (
        <div className="mt-10 text-center">
          <Link href="/experience">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              {t("view_all")}
            </Button>
          </Link>
        </div>
      )}
    </Section>
  );
}
