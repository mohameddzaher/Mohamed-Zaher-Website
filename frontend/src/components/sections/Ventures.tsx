"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { VENTURES } from "@/lib/data";
import { ventureImage } from "@/lib/images";
import { useBi } from "@/lib/i18nText";

export function Ventures({
  tone = "dark",
  compact = false,
  limit,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  limit?: number;
}) {
  const t = useTranslations("Ventures");
  const localize = useBi();
  const items = typeof limit === "number" ? VENTURES.slice(0, limit) : VENTURES;

  return (
    <Section
      id="ventures"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((v, i) => {
          const name = localize(v.name);
          const role = localize(v.role);
          const description = localize(v.description);
          return (
            <motion.div
              key={v.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
              className="group panel rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-500)]/40 hover:shadow-[0_8px_24px_-10px_var(--color-brand-600)] flex flex-col"
            >
              <Link
                href={`/ventures/${v.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-[var(--section-panel)]"
              >
                <Image
                  src={ventureImage(v.slug)}
                  alt={name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant="brand">{v.category}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="font-display text-base font-bold text-white drop-shadow leading-tight block">
                    {name.replace(/^.+?—\s*/, "")}
                  </span>
                  <span className="text-[10px] font-mono text-white/80 mt-0.5 block">
                    {role}
                  </span>
                </div>
              </Link>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <p className="text-sm text-[var(--section-muted)] leading-relaxed flex-1">
                  {description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[var(--section-border)] text-xs">
                  <Link
                    href={`/ventures/${v.slug}`}
                    className="font-medium text-[var(--section-fg)] hover:text-[var(--color-brand-600)] transition-colors"
                  >
                    {t("visit")}
                  </Link>
                  {v.url && (
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${name} website`}
                      title={`Open ${name} website`}
                      className="inline-flex items-center gap-1 font-medium text-[var(--color-brand-600)] hover:gap-1.5 transition-all"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {compact && (
        <div className="mt-8 text-center">
          <Link href="/ventures">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              {t("view_all")}
            </Button>
          </Link>
        </div>
      )}
    </Section>
  );
}
