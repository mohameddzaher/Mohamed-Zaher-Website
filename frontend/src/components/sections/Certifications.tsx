"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Award } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { CERTIFICATIONS } from "@/lib/data";
import { useBi } from "@/lib/i18nText";

export function Certifications({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Certifications");
  const localize = useBi();

  return (
    <Section
      id="certifications"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CERTIFICATIONS.map((c, i) => {
          const name = localize(c.name);
          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              transition={{ duration: 0.28, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className="panel rounded-lg p-4 flex items-start gap-3 hover:border-[var(--color-brand-500)]/30 transition-colors duration-200"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-[var(--color-brand-500)]/10 border border-[var(--color-brand-500)]/30 flex items-center justify-center">
                <Award className="h-4 w-4 text-[var(--color-brand-600)]" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-sm text-[var(--section-fg)] leading-snug">{name}</p>
                <p className="text-[11px] text-[var(--section-muted)] mt-0.5 font-mono">{localize(c.issuer)}</p>
                {c.date && (
                  <p className="text-[10px] text-[var(--section-muted)]/80 mt-0.5 font-mono">{localize(c.date)}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
