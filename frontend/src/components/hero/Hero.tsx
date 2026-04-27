"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SITE } from "@/lib/site";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      id="home"
      className="section-dark relative min-h-[92vh] md:min-h-screen flex items-center overflow-hidden"
    >
      <HeroScene />

      <div
        aria-hidden
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, var(--bg) 95%)",
        }}
      />

      <div className="container-x relative z-10 pt-28 pb-16 md:pt-24 md:pb-20">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.035, delayChildren: 0.08 }}
          className="max-w-4xl"
        >
          {/* Badge with mini portrait */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full panel mb-5"
          >
            <span className="relative inline-block h-6 w-6 rounded-full overflow-hidden ring-1 ring-[var(--color-brand-500)]/40">
              <Image
                src={SITE.profileImage}
                alt="Mohamed Zaher"
                fill
                sizes="24px"
                className="object-cover object-top"
                priority
              />
            </span>
            <Sparkles className="h-3 w-3 text-[var(--color-brand-400)]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-brand-400)]">
              {`< ${t("badge")} />`}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <CircleDot className="h-2.5 w-2.5 animate-pulse-soft" /> {t("open_badge")}
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black tracking-tight leading-[0.98] text-4xl sm:text-5xl md:text-6xl"
          >
            {t("name")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 font-display font-bold text-2xl md:text-3xl tracking-tight leading-tight text-gradient"
          >
            {t("subtitle")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 font-display text-xl md:text-2xl text-[var(--fg)]"
          >
            {t("tagline")}
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-2xl text-sm md:text-base text-[var(--fg-muted)] leading-relaxed"
          >
            {t("description")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <Link href="/contact">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                {t("cta_primary")}
              </Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="secondary">
                {t("cta_secondary")}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl"
          >
            {[
              { v: SITE.stats.projects, suffix: "+", label: t("stats.projects") },
              { v: SITE.stats.yearsExperience, suffix: "+", label: t("stats.experience") },
              { v: SITE.stats.companies, suffix: "", label: t("stats.companies") },
              { v: SITE.stats.linkedinFollowers, suffix: "+", label: t("stats.clients") },
            ].map((s) => (
              <div
                key={s.label}
                className="panel rounded-lg p-3 hover:border-[var(--color-brand-500)]/40 transition-colors duration-200"
              >
                <div className="font-display text-2xl md:text-3xl font-bold text-gradient">
                  <AnimatedCounter to={s.v} suffix={s.suffix} duration={1100} />
                </div>
                <p className="mt-0.5 text-[11px] text-[var(--fg-muted)] leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.a
          href="#below-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono">
            {t("scroll")}
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </motion.a>
      </div>
    </section>
  );
}
