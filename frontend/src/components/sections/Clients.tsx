"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { CLIENT_LOGOS, type ClientLogo } from "@/lib/data";

function brandWordmark(c: ClientLogo): string {
  const w = c.wordmark?.case ?? "title";
  if (w === "lower") return c.name.toLowerCase();
  if (w === "upper") return c.name.toUpperCase();
  return c.name;
}

function ClientLogoTile({ c, tone }: { c: ClientLogo; tone: "dark" | "light" }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = c.logo && !logoFailed;
  const weight = c.wordmark?.weight ?? 700;

  return (
    <div className="shrink-0 flex items-center justify-center px-6 py-4 panel rounded-lg min-w-[180px] h-16 group">
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.logo!}
          alt={c.name}
          loading="lazy"
          onError={() => setLogoFailed(true)}
          className={`max-h-8 max-w-[140px] object-contain transition-all duration-200 ${
            tone === "light"
              ? "opacity-80 group-hover:opacity-100"
              : "opacity-70 group-hover:opacity-100"
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
      className="py-14 md:py-16"
    >
      <div className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-[var(--section-bg)] to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-[var(--section-bg)] to-transparent"
        />
        <div className="flex gap-6 animate-marquee will-change-transform">
          {items.map((c, i) => (
            <ClientLogoTile key={`${c.name}-${i}`} c={c} tone={tone} />
          ))}
        </div>
      </div>
    </Section>
  );
}
