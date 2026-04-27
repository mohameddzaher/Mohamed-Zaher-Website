"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { api } from "@/lib/api";

export function Newsletter({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      setSubmitted(true);
      toast.success(t("success"));
    } catch {
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id="newsletter" tone={tone} className="py-14 md:py-16" containerClassName="">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15, margin: "-60px" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-2xl mx-auto panel rounded-2xl p-8 md:p-10 text-center overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-20 bg-gradient-to-br from-[var(--color-brand-500)]/30 via-transparent to-[var(--color-brand-800)]/30"
        />
        <div className="relative z-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] mb-3">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">
            {t("title")}
          </h2>
          <p className="text-sm text-[var(--section-muted)] mb-6 max-w-lg mx-auto leading-relaxed">
            {t("description")}
          </p>

          {submitted ? (
            <div className="inline-flex items-center gap-2 text-emerald-500 font-medium text-sm">
              <Check className="h-4 w-4" /> {t("success")}
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("placeholder")}
                required
                aria-label="Email"
                className="flex-1"
              />
              <Button type="submit" loading={loading} size="md">
                {t("cta")}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </Section>
  );
}
