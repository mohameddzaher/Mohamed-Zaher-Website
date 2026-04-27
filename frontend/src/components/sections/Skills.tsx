"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Code2, Briefcase, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { SKILL_TRACKS } from "@/lib/data";
import { useBi } from "@/lib/i18nText";

const ICONS = {
  engineering: Code2,
  business: Briefcase,
  leadership: Users,
} as const;

export function Skills({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Skills");
  const localize = useBi();

  return (
    <Section
      id="skills"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid lg:grid-cols-3 gap-4">
        {SKILL_TRACKS.map((track, ti) => {
          const Icon = ICONS[track.key];
          return (
            <motion.div
              key={track.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              transition={{ duration: 0.3, delay: ti * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="panel rounded-xl p-5 hover:border-[var(--color-gold-400)]/30 transition-colors duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center text-[var(--color-gold-500)]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-display text-base font-semibold">
                  {t(`tracks.${track.key}`)}
                </h3>
              </div>

              <div className="space-y-3">
                {track.skills.map((s) => (
                  <div key={s.name.en}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span className="text-[var(--section-fg)]">{localize(s.name)}</span>
                      <span className="font-mono text-[10px] text-[var(--section-muted)]">
                        {s.level}%
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--section-panel)] overflow-hidden">
                      {/* scaleX is composited — won't trigger layout per frame */}
                      <motion.div
                        style={{ width: `${s.level}%`, originX: 0 }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.15, margin: "-60px" }}
                        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                        className="h-full bg-gradient-to-r from-[var(--color-gold-400)] to-[var(--color-gold-600)] will-change-transform"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
