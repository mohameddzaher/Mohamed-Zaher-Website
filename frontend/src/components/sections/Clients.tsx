"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { CLIENT_LOGOS, type ClientLogo } from "@/lib/data";

function brandWordmark(c: ClientLogo): string {
  const w = c.wordmark?.case ?? "title";
  if (w === "lower") return c.name.toLowerCase();
  if (w === "upper") return c.name.toUpperCase();
  return c.name;
}

/**
 * Tries each remote logo URL in order. After all remote attempts fail,
 * tries `/clients/{slug}.svg` then `/clients/{slug}.png` from /public/clients.
 * If everything fails, renders a styled wordmark of the brand name.
 */
function ClientLogoTile({ c, tone }: { c: ClientLogo; tone: "dark" | "light" }) {
  const sources = useMemo(
    () => [
      ...c.logos,
      `/clients/${c.slug}.svg`,
      `/clients/${c.slug}.png`,
    ],
    [c],
  );
  const [idx, setIdx] = useState(0);
  const exhausted = idx >= sources.length;
  const weight = c.wordmark?.weight ?? 700;

  return (
    <div className="shrink-0 flex items-center justify-center px-7 py-4 panel rounded-xl min-w-[200px] h-20 group hairline">
      {!exhausted ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sources[idx]}
          alt={c.name}
          loading="lazy"
          decoding="async"
          onError={() => setIdx((i) => i + 1)}
          className={`max-h-10 max-w-[150px] object-contain transition-all duration-300 ${
            tone === "light"
              ? "opacity-70 group-hover:opacity-100"
              : "opacity-60 group-hover:opacity-100"
          }`}
        />
      ) : (
        <span
          className="font-display tracking-tight whitespace-nowrap transition-all duration-200"
          style={{
            color: c.brandColor,
            fontWeight: weight,
            fontSize: "1.05rem",
            letterSpacing: "-0.02em",
          }}
        >
          {brandWordmark(c)}
        </span>
      )}
    </div>
  );
}

export function Clients({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("Clients");
  // Duplicate so the marquee scrolls seamlessly
  const items = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <Section
      id="clients"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={t("title")}
      className="py-20 md:py-24"
    >
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[var(--section-bg)] to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[var(--section-bg)] to-transparent"
        />
        <div className="flex gap-8 animate-marquee will-change-transform">
          {items.map((c, i) => (
            <ClientLogoTile key={`${c.slug}-${i}`} c={c} tone={tone} />
          ))}
        </div>
      </div>
    </Section>
  );
}
