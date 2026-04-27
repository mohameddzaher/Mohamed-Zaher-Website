"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  ArrowRight,
  Video,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Section } from "@/components/ui/Section";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type Slot = {
  startsAt: string;
  durationMin: number;
  available: boolean;
  isBooked: boolean;
  isPast: boolean;
  isDayOff: boolean;
};

type Availability = {
  date: string;
  dayOff: boolean;
  slots: Slot[];
  workHours: { start: number; end: number };
  slotMin: number;
};

const STEPS = ["date", "slot", "details", "done"] as const;
type Step = (typeof STEPS)[number];

function fmtDateISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

export function BookMeeting({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const [step, setStep] = useState<Step>("date");
  const [date, setDate] = useState<Date>(() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  });
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{ id: string; startsAt: string } | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    meetingType: "video" as "video" | "phone" | "in-person",
  });

  useEffect(() => {
    let cancelled = false;
    setAvailability(null);
    api
      .get<{ data: Availability }>(`/bookings/availability?date=${fmtDateISO(date)}`)
      .then((r) => {
        if (!cancelled) setAvailability(r.data.data);
      })
      .catch(() => {
        if (!cancelled) {
          setAvailability({
            date: fmtDateISO(date),
            dayOff: false,
            slots: [],
            workHours: { start: 9, end: 21 },
            slotMin: 60,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  function fmtTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Riyadh",
    });
  }

  function fmtDay(d: Date): string {
    return d.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  async function submit() {
    if (!slot) return;
    setSubmitting(true);
    try {
      const r = await api.post<{ data: { id: string; startsAt: string } }>("/bookings", {
        ...form,
        startsAt: slot.startsAt,
      });
      setConfirmation(r.data.data);
      setStep("done");
      toast.success(t("success"));
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? t("error");
      toast.error(msg);
      // Refresh availability on conflict
      if (msg.toLowerCase().includes("slot")) {
        const rr = await api.get<{ data: Availability }>(`/bookings/availability?date=${fmtDateISO(date)}`);
        setAvailability(rr.data.data);
        setStep("slot");
        setSlot(null);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section id="book" tone={tone} eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="mb-6 flex items-center justify-center gap-2 text-xs font-mono">
          {(["date", "slot", "details"] as Step[]).map((s, i) => {
            const reached = STEPS.indexOf(step) >= STEPS.indexOf(s);
            const active = step === s;
            return (
              <div key={s} className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-6 w-6 inline-flex items-center justify-center rounded-full border text-[10px] transition-colors",
                    active
                      ? "bg-[var(--color-gold-500)] text-white border-[var(--color-gold-500)]"
                      : reached
                        ? "border-[var(--color-gold-400)] text-[var(--color-gold-500)]"
                        : "border-[var(--section-border)] text-[var(--section-muted)]",
                  )}
                >
                  {reached && step !== s ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={cn("uppercase tracking-widest text-[10px]", active ? "text-[var(--section-fg)]" : "text-[var(--section-muted)]")}>
                  {t(`step.${s}`)}
                </span>
                {i < 2 && <span className="w-6 h-px bg-[var(--section-border)] mx-1" />}
              </div>
            );
          })}
        </div>

        <div className="panel rounded-2xl p-6 md:p-8">
          {step === "date" && (
            <DatePicker
              date={date}
              setDate={(d) => {
                setDate(d);
                setSlot(null);
              }}
              fmtDay={fmtDay}
              continueLabel={t("continue")}
              onContinue={() => setStep("slot")}
            />
          )}

          {step === "slot" && (
            <div>
              <button
                type="button"
                onClick={() => setStep("date")}
                className="mb-4 text-xs text-[var(--section-muted)] hover:text-[var(--section-fg)] inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-3 w-3" /> {t("change_date")}
              </button>
              <p className="font-medium mb-1">{fmtDay(date)}</p>
              <p className="text-xs text-[var(--section-muted)] mb-4 font-mono">
                {availability?.dayOff
                  ? t("day_off")
                  : availability
                    ? t("pick_slot")
                    : t("loading")}
              </p>

              {availability && !availability.dayOff && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {availability.slots.map((s) => (
                    <button
                      key={s.startsAt}
                      type="button"
                      disabled={!s.available}
                      onClick={() => {
                        setSlot(s);
                        setStep("details");
                      }}
                      className={cn(
                        "px-3 py-2.5 rounded-lg text-sm font-medium border transition-all duration-150",
                        s.available
                          ? "panel hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-500)] cursor-pointer"
                          : s.isBooked
                            ? "bg-[var(--color-gold-400)]/10 border-[var(--color-gold-400)]/20 text-[var(--section-muted)] line-through cursor-not-allowed"
                            : "border-[var(--section-border)]/40 text-[var(--section-muted)]/40 cursor-not-allowed",
                      )}
                    >
                      {fmtTime(s.startsAt)}
                      {s.isBooked && (
                        <span className="block text-[9px] uppercase tracking-widest mt-0.5">
                          {t("taken")}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === "details" && slot && (
            <div>
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="mb-4 text-xs text-[var(--section-muted)] hover:text-[var(--section-fg)] inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-3 w-3" /> {t("change_slot")}
              </button>
              <div className="panel rounded-lg p-3 mb-5 flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-[var(--color-gold-500)] shrink-0" />
                <span className="font-medium">{fmtDay(date)}</span>
                <span className="text-[var(--section-muted)]">·</span>
                <Clock className="h-4 w-4 text-[var(--color-gold-500)] shrink-0" />
                <span className="font-mono">{fmtTime(slot.startsAt)}</span>
                <span className="text-[var(--section-muted)]">·</span>
                <span className="text-xs text-[var(--section-muted)]">{slot.durationMin} min</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="grid sm:grid-cols-2 gap-3"
              >
                <Input label={t("form.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required minLength={2} />
                <Input type="email" label={t("form.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input label={t("form.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label={t("form.company")} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <Input
                  label={t("form.subject")}
                  className="sm:col-span-2"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required
                  minLength={2}
                />
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium mb-1.5">{t("form.type")}</p>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { key: "video", Icon: Video },
                        { key: "phone", Icon: Phone },
                        { key: "in-person", Icon: MapPin },
                      ] as const
                    ).map(({ key, Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, meetingType: key })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border inline-flex items-center gap-1.5 transition",
                          form.meetingType === key
                            ? "bg-[var(--color-gold-500)] text-white border-[var(--color-gold-500)]"
                            : "panel text-[var(--section-muted)] hover:text-[var(--section-fg)]",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {t(`meeting_type.${key}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  label={t("form.message")}
                  className="sm:col-span-2"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <div className="sm:col-span-2 flex justify-end pt-2">
                  <Button type="submit" loading={submitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
                    {t("confirm")}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === "done" && confirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 mb-4">
                <Check className="h-5 w-5" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">{t("done.title")}</h3>
              <p className="text-sm text-[var(--section-muted)] max-w-sm mx-auto leading-relaxed">
                {t("done.body")}
              </p>
              <div className="panel rounded-lg p-3 mt-5 inline-flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-[var(--color-gold-500)]" />
                {fmtDay(new Date(confirmation.startsAt))}
                <span className="text-[var(--section-muted)]">·</span>
                <Clock className="h-4 w-4 text-[var(--color-gold-500)]" />
                <span className="font-mono">{fmtTime(confirmation.startsAt)}</span>
              </div>
              <div className="mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setConfirmation(null);
                    setSlot(null);
                    setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "", meetingType: "video" });
                    setStep("date");
                  }}
                >
                  {t("done.again")}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Date picker (compact 7-day strip + month nav) ---------- */
function DatePicker({
  date,
  setDate,
  fmtDay,
  onContinue,
  continueLabel,
}: {
  date: Date;
  setDate: (d: Date) => void;
  fmtDay: (d: Date) => string;
  onContinue: () => void;
  continueLabel: string;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }, []);

  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date(date);
    return d;
  });

  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(weekStart);
      d.setUTCDate(weekStart.getUTCDate() + i);
      return d;
    });
  }, [weekStart]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium text-sm">{fmtDay(date)}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => {
              const next = new Date(weekStart);
              next.setUTCDate(weekStart.getUTCDate() - 14);
              if (next.getTime() < today.getTime()) {
                setWeekStart(today);
              } else {
                setWeekStart(next);
              }
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md panel hover:border-[var(--color-gold-400)]/40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => {
              const next = new Date(weekStart);
              next.setUTCDate(weekStart.getUTCDate() + 14);
              setWeekStart(next);
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md panel hover:border-[var(--color-gold-400)]/40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const isPast = d.getTime() < today.getTime();
          const isSelected = isSameDay(d, date);
          const isToday = isSameDay(d, today);
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => setDate(new Date(d))}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-xs border transition-all duration-150",
                isSelected
                  ? "bg-[var(--color-gold-500)] text-white border-[var(--color-gold-500)] shadow-[0_4px_14px_-4px_var(--color-gold-500)]"
                  : isPast
                    ? "border-[var(--section-border)]/40 text-[var(--section-muted)]/40 cursor-not-allowed"
                    : "panel hover:border-[var(--color-gold-400)]/40",
              )}
            >
              <span className="text-[9px] uppercase tracking-widest opacity-70">
                {d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
              </span>
              <span className={cn("font-display text-base font-bold", isSelected || "mt-0.5")}>
                {d.getUTCDate()}
              </span>
              {isToday && !isSelected && (
                <span className="block h-1 w-1 rounded-full bg-[var(--color-gold-400)] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onContinue} rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
          {continueLabel}
        </Button>
      </div>
    </div>
  );
}
