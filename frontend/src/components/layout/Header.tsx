"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, ArrowUpRight, User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/site";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("Nav");
  const tHeader = useTranslations("HeaderMenu");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrate, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    let raf = 0;
    let last = false;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const next = window.scrollY > 24;
        if (next !== last) {
          last = next;
          setScrolled(next);
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    if (userOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userOpen]);

  function toggleLocale() {
    const next = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: next });
  }

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Hide public header inside admin/client shells (they have their own chrome)
  const inAppShell =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/client" ||
    pathname.startsWith("/client/") ||
    pathname === "/login";

  const initials = user
    ? user.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const dashHref = user?.role === "admin" ? "/admin" : "/client";
  const profileHref = user?.role === "admin" ? "/admin/profile" : "/client/profile";
  const settingsHref = user?.role === "admin" ? "/admin/settings" : "/client/profile";

  if (inAppShell) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 py-3">
      <div className="container-x">
        <div
          className={cn(
            "flex h-12 items-center justify-between gap-4 px-3 md:px-4 rounded-xl",
            "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled ? "glass-strong" : "bg-transparent border border-transparent",
          )}
        >
          <Link
            href="/"
            className="group inline-flex items-baseline select-none"
            aria-label="Home"
          >
            <span className="font-wordmark text-xl sm:text-2xl leading-none tracking-[0.08em] text-[var(--fg)] group-hover:text-[var(--color-gold-200)] transition-colors duration-300">
              Mohamed Zaher
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.key}
                  href={l.href}
                  className={cn(
                    "relative px-3 py-1.5 text-[11px] font-normal uppercase tracking-[0.18em] rounded-md transition-all duration-200",
                    active
                      ? "text-[var(--color-gold-300)]"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
                  )}
                >
                  {t(l.key)}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-[var(--color-gold-400)]"
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label="Toggle language"
              className="hidden md:inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-mono uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-white/[0.04] transition-colors duration-150"
            >
              <Globe className="h-3 w-3" />
              {locale === "en" ? "AR" : "EN"}
            </button>

            {user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserOpen((o) => !o)}
                  className="hidden md:inline-flex items-center gap-2 ps-1 pe-2 py-1 rounded-full panel hover:border-[var(--color-gold-400)]/40 transition-colors duration-150"
                  aria-label="User menu"
                  aria-haspopup="menu"
                  aria-expanded={userOpen}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] text-white text-[10px] font-bold">
                    {initials}
                  </span>
                  <span className="text-xs font-medium max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", userOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute end-0 mt-2 w-56 glass-strong rounded-xl p-1.5 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs font-semibold truncate">{user.name}</p>
                        <p className="text-[10px] font-mono text-[var(--fg-muted)] truncate">{user.email}</p>
                        <span className="mt-1 inline-block text-[9px] uppercase tracking-widest text-[var(--color-gold-300)]">
                          {user.role}
                        </span>
                      </div>
                      <UserMenuItem href={dashHref} Icon={LayoutDashboard} label={tHeader("dashboard")} />
                      <UserMenuItem href={profileHref} Icon={User} label={tHeader("profile")} />
                      <UserMenuItem href={settingsHref} Icon={Settings} label={tHeader("settings")} />
                      <button
                        type="button"
                        onClick={async () => {
                          await logout();
                          router.push("/");
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-md text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        {tHeader("sign_out")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden md:block">
                <Button variant="secondary" size="sm">
                  {tHeader("sign_in")}
                </Button>
              </Link>
            )}

            <Link href="/book" className="hidden sm:block">
              <Button size="sm" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                {t("book")}
              </Button>
            </Link>
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-md hover:bg-white/[0.04]"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: locale === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "-100%" : "100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "absolute top-0 h-full w-[80%] max-w-xs glass-strong p-5 overflow-y-auto",
                locale === "ar" ? "left-0" : "right-0",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-base font-semibold">Menu</span>
                <button
                  type="button"
                  className="p-1.5 rounded-md hover:bg-white/[0.04]"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {user && (
                <div className="mb-4 px-3 py-3 rounded-lg panel flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold-400)] to-[var(--color-gold-600)] text-white text-xs font-bold">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-gold-300)]">{user.role}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-0.5">
                {NAV_LINKS.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <Link
                      key={l.key}
                      href={l.href}
                      className={cn(
                        "px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150",
                        active
                          ? "bg-[var(--color-gold-400)]/15 text-[var(--color-gold-300)] border border-[var(--color-gold-400)]/30"
                          : "text-[var(--fg)] hover:bg-white/[0.04]",
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-0.5">
                {user ? (
                  <>
                    <Link href={dashHref} className="px-3 py-2 text-sm rounded-md hover:bg-white/[0.04] inline-flex items-center gap-2">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      {tHeader("dashboard")}
                    </Link>
                    <Link href={profileHref} className="px-3 py-2 text-sm rounded-md hover:bg-white/[0.04] inline-flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      {tHeader("profile")}
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                        router.push("/");
                      }}
                      className="px-3 py-2 text-sm text-red-400 rounded-md hover:bg-red-500/10 inline-flex items-center gap-2 text-start"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      {tHeader("sign_out")}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="px-3 py-2 text-sm rounded-md hover:bg-white/[0.04] inline-flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    {tHeader("sign_in")}
                  </Link>
                )}
                <button
                  type="button"
                  onClick={toggleLocale}
                  className="mt-2 px-3 py-2 text-left text-xs font-mono uppercase text-[var(--fg-muted)] rounded-md hover:bg-white/[0.04]"
                >
                  Switch to {locale === "en" ? "العربية" : "English"}
                </button>
                <Link href="/book" className="mt-3">
                  <Button fullWidth size="md" rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                    {t("book")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function UserMenuItem({
  href,
  Icon,
  label,
}: {
  href: string;
  Icon: typeof User;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-[var(--fg)] hover:bg-white/[0.05] transition-colors"
    >
      <Icon className="h-3.5 w-3.5 text-[var(--color-gold-300)]" />
      {label}
    </Link>
  );
}
