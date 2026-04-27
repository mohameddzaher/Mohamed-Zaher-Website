"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  MessageCircle,
  Globe,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/ui/Section";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { api } from "@/lib/api";
import { SITE } from "@/lib/site";

const ContactSchema = z.object({
  name: z.string().min(2, "Min 2 characters"),
  email: z.string().email("Invalid email"),
  company: z.string().optional(),
  subject: z.string().min(2, "Required"),
  inquiry: z.string().min(1, "Required"),
  budget: z.string().optional(),
  type: z.string().optional(),
  message: z.string().min(10, "Tell me a bit more"),
});

type ContactValues = z.infer<typeof ContactSchema>;

export function Contact({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Contact");
  const budgets = t.raw("budgets") as string[];
  const types = t.raw("types") as string[];
  const inquiries = t.raw("inquiries") as string[];
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { inquiry: "", budget: "", type: "" },
  });

  useEffect(() => {
    const sub = searchParams.get("subject");
    if (sub) {
      setValue("subject", sub);
      const matchedInquiry = inquiries.find((i) => i.toLowerCase().includes(sub.toLowerCase().split(" ")[0] ?? ""));
      if (matchedInquiry) setValue("inquiry", matchedInquiry);
    }
  }, [searchParams, setValue, inquiries]);

  async function onSubmit(values: ContactValues) {
    try {
      await api.post("/contact", values);
      toast.success(t("form.success"));
      setSubmitted(true);
      reset();
    } catch (e) {
      const err = e as { message?: string; errors?: Record<string, string[]> };
      const detail = err?.errors
        ? Object.values(err.errors).flat().join(" · ")
        : err?.message;
      toast.error(detail ? `${t("form.error")} — ${detail}` : t("form.error"));
      // eslint-disable-next-line no-console
      console.error("Contact submit failed:", e);
    }
  }

  return (
    <Section
      id="contact"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15, margin: "-60px" }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 panel rounded-2xl p-5 md:p-7"
        >
          {submitted ? (
            <div className="py-10 text-center">
              <p className="text-lg font-display mb-2 text-gradient">{t("form.success")}</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => setSubmitted(false)}>
                {t("send_another")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-3">
              {/* Inquiry type — prominent, full width */}
              <Select
                label={t("form.inquiry")}
                {...register("inquiry")}
                error={errors.inquiry?.message}
                options={[
                  { value: "", label: "—" },
                  ...inquiries.map((b) => ({ value: b, label: b })),
                ]}
                className="sm:col-span-2"
              />
              <Input label={t("form.name")} {...register("name")} error={errors.name?.message} />
              <Input type="email" label={t("form.email")} {...register("email")} error={errors.email?.message} />
              <Input
                label={t("form.company")}
                {...register("company")}
                error={errors.company?.message}
                className="sm:col-span-2"
              />
              <Input
                label={t("form.subject")}
                {...register("subject")}
                error={errors.subject?.message}
                className="sm:col-span-2"
              />
              <Select
                label={t("form.budget")}
                {...register("budget")}
                error={errors.budget?.message}
                options={[
                  { value: "", label: "—" },
                  ...budgets.map((b) => ({ value: b, label: b })),
                ]}
              />
              <Select
                label={t("form.type")}
                {...register("type")}
                error={errors.type?.message}
                options={[
                  { value: "", label: "—" },
                  ...types.map((b) => ({ value: b, label: b })),
                ]}
              />
              <Textarea
                label={t("form.message")}
                {...register("message")}
                error={errors.message?.message}
                rows={5}
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2 pt-1">
                <Button
                  type="submit"
                  size="lg"
                  loading={isSubmitting}
                  rightIcon={<Send className="h-4 w-4" />}
                  fullWidth
                >
                  {t("form.submit")}
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Info */}
        <div className="lg:col-span-5 space-y-3">
          {/* Portrait card */}
          <div className="panel rounded-2xl p-5 flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full overflow-hidden ring-1 ring-[var(--color-gold-400)]/40 shrink-0">
              <Image
                src={SITE.profileImage}
                alt="Mohamed Zaher"
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <p className="font-display text-base font-semibold">{t("info.portrait_role") === "Entrepreneur · CTO" ? "Mohamed Zaher" : "محمد زاهر"}</p>
              <p className="text-xs text-[var(--color-gold-500)] font-mono">{t("info.portrait_role")}</p>
              <p className="text-[11px] text-[var(--section-muted)] mt-1">
                {t("info.portrait_line")}
              </p>
            </div>
          </div>

          <div className="panel rounded-xl p-5 space-y-3">
            <ContactItem Icon={Mail} label={t("info.email")} value={SITE.email} href={`mailto:${SITE.email}`} />
            <ContactItem Icon={Phone} label={t("info.phone")} value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
            <ContactItem Icon={Globe} label={t("info.availability")} value={SITE.availability} />
            <ContactItem Icon={Clock} label={t("info.response_label")} value={t("info.response")} />
          </div>

          <a
            href={SITE.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="panel rounded-xl p-4 flex items-center gap-3 hover:border-emerald-500/30 transition-colors duration-200"
          >
            <div className="h-9 w-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <MessageCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{t("info.whatsapp_label")}</p>
              <p className="text-[11px] text-[var(--section-muted)] font-mono">{t("info.whatsapp_hint")}</p>
            </div>
          </a>

          <div className="flex items-center gap-3 px-1 pt-1">
            <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--section-muted)]">
              {t("info.find_me")}
            </span>
            <span aria-hidden className="h-px flex-1 bg-[var(--section-border)]" />
            <div className="flex items-center gap-1">
              <SocialBtn href={SITE.socials.linkedin} Icon={Linkedin} label="LinkedIn" />
              <SocialBtn href={SITE.socials.github} Icon={Github} label="GitHub" />
              <SocialBtn href={SITE.socials.instagram} Icon={Instagram} label="Instagram" />
              <SocialBtn href={SITE.socials.x} Icon={Twitter} label="X" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContactItem({
  Icon,
  label,
  value,
  href,
}: {
  Icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-[var(--color-gold-500)]" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--section-muted)]">{label}</p>
        <p className="text-xs font-medium text-[var(--section-fg)]">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-80 transition-opacity duration-150">{inner}</a>
  ) : (
    inner
  );
}

function SocialBtn({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: typeof Mail;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="h-7 w-7 inline-flex items-center justify-center rounded-md text-[var(--section-muted)] hover:text-[var(--color-gold-500)] hover:bg-[color-mix(in_srgb,var(--color-gold-400)_10%,transparent)] transition-colors duration-150"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}
