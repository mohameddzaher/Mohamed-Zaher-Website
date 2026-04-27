"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const t = useTranslations("Breadcrumb");
  const all: Crumb[] = [{ href: "/", label: t("home") }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-xs">
      <ol className="flex items-center flex-wrap gap-1 text-[var(--section-muted)] font-mono">
        {all.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {c.href && i < all.length - 1 ? (
              <Link href={c.href} className="hover:text-[var(--color-gold-400)] transition-colors duration-150">
                {c.label}
              </Link>
            ) : (
              <span className="text-[var(--section-fg)]">{c.label}</span>
            )}
            {i < all.length - 1 && <ChevronRight className="h-3 w-3" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
