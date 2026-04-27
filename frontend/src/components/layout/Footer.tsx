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
      {/* Top hairline — champagne fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-[var(--color-gold-400)]/40 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.18]"
        style={{
          background:
            "radial-gradient(circle, rgba(201,168,107,0.45) 0%, rgba(201,168,107,0) 70%)",
        }}
      />

      <div className="container-x relative">
        {/* CTA band */}
        <div className="rounded-2xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hairline panel-luxe">
          <div className="flex items-center gap-4">
            <span className="relative inline-block h-12 w-12 rounded-full overflow-hidden ring-1 ring-[var(--color-gold-400)]/30 shrink-0">
              <Image
                src={SITE.profileImage}
                alt="Mohamed Zaher"
                fill
                sizes="48px"
                className="object-cover object-top"
              />
            </span>
            <div>
              <p className="font-serif text-xl md:text-2xl font-light tracking-tight leading-tight">
                {tFooter("tagline")}
              </p>
              <p className="text-xs text-[var(--fg-muted)] mt-1.5 max-w-sm leading-relaxed">
                {tFooter("description")}
              </p>
            </div>
          </div>
          <Link
            href="/book"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.22em] text-[var(--color-gold-200)] border border-[var(--color-gold-400)]/40 hover:border-[var(--color-gold-400)] hover:text-[var(--color-gold-100)] transition-all duration-300 shrink-0"
          >
            {t("book")}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Wordmark — luxury serif italic */}
        <div className="mb-10">
          <Link
            href="/"
            className="font-wordmark tracking-[0.06em] leading-[0.95] text-5xl md:text-6xl lg:text-7xl inline-block text-[var(--fg)] hover:text-[var(--color-gold-200)] transition-colors duration-500"
            aria-label="Home"
          >
            Mohamed Zaher
          </Link>

          {/* Inline nav with hairline separators */}
          <nav className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 max-w-3xl">
            {NAV_LINKS.map((l, i) => (
              <span key={l.key} className="inline-flex items-center gap-4">
                <Link
                  href={l.href}
                  className="text-[10px] uppercase tracking-[0.22em] text-[var(--fg-muted)] hover:text-[var(--color-gold-300)] transition-colors duration-200"
                >
                  {t(l.key)}
                </Link>
                {i < NAV_LINKS.length - 1 && (
                  <span aria-hidden className="h-px w-3 bg-[var(--color-gold-400)]/30" />
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
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-gold-300)] transition-colors duration-150"
              >
                <Mail className="h-3 w-3 text-[var(--color-gold-400)]" />
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 hover:text-[var(--color-gold-300)] transition-colors duration-150"
              >
                <Phone className="h-3 w-3 text-[var(--color-gold-400)]" />
                {SITE.phone}
              </a>
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-[var(--color-gold-400)]" />
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
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--color-gold-300)] hover:border-[var(--color-gold-400)]/40 transition-colors duration-150"
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
