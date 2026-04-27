"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mic, MapPin, Users, Calendar } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { SPEAKING } from "@/lib/data";
import { useBi } from "@/lib/i18nText";

export function Speaking({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Speaking");
  const localize = useBi();

  return (
    <Section
      id="speaking"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {SPEAKING.map((s, i) => {
          const title = localize(s.title);
          return (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              transition={{ duration: 0.28, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className="panel rounded-xl p-5 hover:border-[var(--color-brand-500)]/30 transition-colors duration-200"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-[var(--color-brand-500)] text-white flex items-center justify-center shrink-0">
                  <Mic className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-semibold leading-snug">{title}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--section-muted)] leading-relaxed mb-3">
                {localize(s.description)}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-[var(--section-muted)] font-mono pt-3 border-t border-[var(--section-border)]">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {localize(s.venue)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {localize(s.date)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {localize(s.audience)}
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>
    </Section>
  );
}
