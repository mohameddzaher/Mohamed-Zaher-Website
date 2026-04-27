"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { SITE } from "@/lib/site";

export function About({
  tone = "light",
  compact = false,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  const t = useTranslations("About");
  const values = t.raw("values") as string[];

  return (
    <Section
      id="about"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
    >
      <div className="grid lg:grid-cols-12 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15, margin: "-60px" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="relative aspect-[4/5] max-w-xs mx-auto rounded-2xl overflow-hidden panel">
            <Image
              src={SITE.profileImage}
              alt="Mohamed Zaher"
              fill
              sizes="(max-width: 1024px) 80vw, 320px"
              className="object-cover object-[center_15%]"
              priority
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--color-gold-400)]/20 rounded-2xl" />
            <div className="absolute bottom-3 left-3 right-3 glass rounded-lg p-2.5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] font-mono text-[var(--section-muted)]">
                {t("status_open")} · {SITE.availability}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-7 space-y-4">
          <p className="text-base md:text-lg text-[var(--section-fg)] leading-relaxed">
            {t("lead")}
          </p>

          <blockquote className="relative pl-4 border-l-2 border-[var(--color-gold-400)] py-1 italic text-lg md:text-xl font-display text-gradient">
            &ldquo;{t("quote")}&rdquo;
          </blockquote>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {values.map((v) => (
              <Badge key={v} variant="brand">
                {v}
              </Badge>
            ))}
          </div>

          {compact && (
            <div className="pt-4">
              <Link href="/about">
                <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                  {t("view_full")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
