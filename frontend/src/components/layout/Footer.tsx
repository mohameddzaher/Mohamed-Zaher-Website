"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Github,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Facebook,
  Mail,
  Phone,
  Globe,
  ArrowUpRight,
} from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/site";

export function Footer() {
  const t = useTranslations("Nav");
  const tFooter = useTranslations("Footer");
  const pathname = usePathname();
  const year = new Date().getFullYear();

  // Don't show on admin/client/login routes
  if (
    pathname?.includes("/admin") ||
    pathname?.includes("/client") ||
    pathname?.endsWith("/login")
  ) {
    return null;
  }

  const socials = [
    { href: SITE.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: SITE.socials.github, label: "GitHub", Icon: Github },
    { href: SITE.socials.instagram, label: "Instagram", Icon: Instagram },
    { href: SITE.socials.x, label: "X", Icon: Twitter },
    { href: SITE.socials.facebook, label: "Facebook", Icon: Facebook },
    { href: SITE.socials.snapchat, label: "Snapchat", Icon: MessageCircle },
  ];

  return (
    <footer className="section-deep relative pt-20 pb-8 overflow-hidden">
      {/* Top accent line + glow (kept — user liked it) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--color-brand-500)]/60 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(225,29,72,0.4) 0%, rgba(225,29,72,0) 70%)",
        }}
      />

      <div className="container-x relative">
        {/* CTA band — kept (user liked it) */}
        <div className="panel rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="relative inline-block h-12 w-12 rounded-full overflow-hidden ring-2 ring-[var(--color-brand-500)]/40 shrink-0">
              <Image
                src={SITE.profileImage}
                alt="Mohamed Zaher"
                fill
                sizes="48px"
                className="object-cover object-top"
              />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight">
                {tFooter("tagline")}
              </p>
              <p className="text-xs text-[var(--fg-muted)] mt-1 max-w-sm leading-relaxed">
                {tFooter("description")}
              </p>
            </div>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white [background:linear-gradient(135deg,var(--color-brand-500),var(--color-brand-700))] hover:brightness-110 shadow-[0_4px_16px_-4px_var(--color-brand-600)] transition-all duration-200 shrink-0"
          >
            {t("book")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Big logotype — creative replacement for the old 3-column grid */}
        <div className="mb-10">
          <Link
            href="/"
            className="font-display font-black tracking-tight leading-none text-3xl md:text-4xl inline-block"
            aria-label="Home"
          >
            <span className="text-[var(--fg)]">Mohamed Zaher</span>
            <span className="text-[var(--color-brand-500)]">.</span>
          </Link>

          {/* Inline nav with separator slashes */}
          <nav className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 max-w-3xl">
            {NAV_LINKS.map((l, i) => (
              <span key={l.key} className="inline-flex items-center gap-3">
                <Link
                  href={l.href}
                  className="text-xs uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--color-brand-400)] transition-colors duration-150"
                >
                  {t(l.key)}
                </Link>
                {i < NAV_LINKS.length - 1 && (
                  <span aria-hidden className="text-[var(--fg-muted)]/40">/</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        {/* Inline contact strip + socials */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pt-8 border-t border-white/5">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[var(--fg-muted)]">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-brand-400)] transition-colors duration-150"
              >
                <Mail className="h-3 w-3 text-[var(--color-brand-500)]" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-brand-400)] transition-colors duration-150"
              >
                <Phone className="h-3 w-3 text-[var(--color-brand-500)]" />
                {SITE.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-[var(--color-brand-500)]" />
              {SITE.availability}
            </li>
          </ul>

          <div className="flex items-center gap-1.5 flex-wrap">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--color-brand-400)] hover:border-[var(--color-brand-500)]/40 transition-colors duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-[var(--fg-muted)] font-mono">
            © {year} Mohamed Zaher. {tFooter("rights")}
          </p>
          <p className="text-[10px] text-[var(--fg-muted)] font-mono inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-soft" />
            {tFooter("built_with")}
          </p>
        </div>
      </div>
    </footer>
  );
}
