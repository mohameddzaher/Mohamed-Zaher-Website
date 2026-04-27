"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Star, MessageSquarePlus, ChevronLeft, ChevronRight, Quote, X } from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { TESTIMONIALS } from "@/lib/data";
import { api } from "@/lib/api";
import { useBi } from "@/lib/i18nText";

type ApprovedReview = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  rating: number;
  quote: string;
  featured?: boolean;
};

/**
 * Combined display of seeded testimonials + approved public reviews.
 * Public visitors can submit a new review (held for admin moderation).
 */
export function Reviews({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Testimonials");
  const tForm = useTranslations("ReviewForm");
  const localize = useBi();
  const qc = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const { data: approved = [] } = useQuery<ApprovedReview[]>({
    queryKey: ["reviews", "public"],
    queryFn: async () => {
      try {
        const r = await api.get<{ data: ApprovedReview[] }>("/reviews");
        return r.data.data ?? [];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });

  // Static testimonials always shown first (so home renders instantly even when API is cold)
  const staticItems: ApprovedReview[] = TESTIMONIALS.map((tt, i) => ({
    _id: `static-${i}`,
    name: tt.name,
    role: localize(tt.role),
    company: tt.company,
    rating: 5,
    quote: localize(tt.quote),
  }));

  const all = [...staticItems, ...approved];
  const cur = all[activeIdx % all.length] ?? null;

  return (
    <Section id="testimonials" tone={tone} eyebrow={t("eyebrow")} title={t("title")}>
      <div className="max-w-2xl mx-auto">
        {cur && (
          <div className="relative panel rounded-2xl p-8 md:p-10 overflow-hidden">
            <Quote
              aria-hidden
              className="absolute top-4 left-4 h-12 w-12 text-[var(--color-gold-400)]/10"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={cur._id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(cur.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--color-gold-400)] text-[var(--color-gold-400)]" />
                  ))}
                </div>
                <p className="font-display text-lg md:text-xl leading-relaxed text-[var(--section-fg)]">
                  &ldquo;{cur.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] flex items-center justify-center font-display font-bold text-white text-sm">
                    {cur.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cur.name}</p>
                    <p className="text-[11px] text-[var(--section-muted)] font-mono">
                      {cur.role}
                      {cur.company && ` · ${cur.company}`}
                    </p>
                  </div>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {all.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i - 1 + all.length) % all.length)}
              aria-label="Previous"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full panel hover:border-[var(--color-gold-400)]/40 transition-colors duration-150"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {all.map((_, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Review ${idx + 1}`}
                  className={`h-1 rounded-full transition-all duration-200 ${
                    idx === activeIdx ? "w-6 bg-[var(--color-gold-500)]" : "w-1 bg-[var(--section-border)]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveIdx((i) => (i + 1) % all.length)}
              aria-label="Next"
              className="h-8 w-8 inline-flex items-center justify-center rounded-full panel hover:border-[var(--color-gold-400)]/40 transition-colors duration-150"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<MessageSquarePlus className="h-3.5 w-3.5" />}
            onClick={() => setOpenForm(true)}
          >
            {tForm("cta")}
          </Button>
        </div>
      </div>

      <ReviewModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmitted={() => {
          qc.invalidateQueries({ queryKey: ["reviews", "public"] });
          setOpenForm(false);
        }}
      />
    </Section>
  );
}

function ReviewModal({
  open,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const t = useTranslations("ReviewForm");
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    email: "",
    rating: 5,
    quote: "",
  });

  const submit = useMutation({
    mutationFn: async () => {
      await api.post("/reviews", form);
    },
    onSuccess: () => {
      toast.success(t("success"));
      setForm({ name: "", role: "", company: "", email: "", rating: 5, quote: "" });
      onSubmitted();
    },
    onError: () => toast.error(t("error")),
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-strong rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-xl font-bold">{t("title")}</h3>
            <p className="text-xs text-[var(--fg-muted)] mt-1">{t("hint")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (form.quote.length < 10) {
              toast.error(t("error"));
              return;
            }
            submit.mutate();
          }}
          className="space-y-3"
        >
          <Input
            label={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label={t("role")}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
            <Input
              label={t("company")}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <Input
            type="email"
            label={t("email")}
            hint={t("email_hint")}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div>
            <p className="text-xs font-medium text-[var(--fg)] mb-1.5">{t("rating")}</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  aria-label={`${n} stars`}
                  className="p-1"
                >
                  <Star
                    className={`h-5 w-5 transition-colors ${
                      n <= form.rating
                        ? "fill-[var(--color-gold-400)] text-[var(--color-gold-400)]"
                        : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label={t("quote")}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={4}
            required
            minLength={10}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              {t("cancel")}
            </Button>
            <Button type="submit" size="sm" loading={submit.isPending}>
              {t("submit")}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
