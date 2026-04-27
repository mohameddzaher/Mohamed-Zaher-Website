import { useLocale } from "next-intl";

type Bilingual = { en: string; ar: string };

/** Render a Bilingual value (or string passthrough) for the given locale. */
export function bi(v: Bilingual | string | undefined | null, locale: string): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return locale === "ar" ? v.ar || v.en : v.en;
}

/** Hook helper for client components. */
export function useBi() {
  const locale = useLocale();
  return (v: Bilingual | string | undefined | null) => bi(v, locale);
}
