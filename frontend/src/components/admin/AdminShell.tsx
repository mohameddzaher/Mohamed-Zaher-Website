"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Briefcase,
  Sparkles,
  Award,
  Newspaper,
  Star,
  Users,
  Inbox,
  Mail,
  Settings,
  LogOut,
  Image as ImageIcon,
  MessageSquareQuote,
  UserCircle,
  CalendarClock,
  ListChecks,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/tasks", label: "Tasks & Schedule", Icon: ListChecks },
  { href: "/admin/bookings", label: "Bookings", Icon: CalendarClock },
  { href: "/admin/bookings/calendar", label: "Day Calendar", Icon: CalendarClock },
  { href: "/admin/projects", label: "Projects", Icon: FolderKanban },
  { href: "/admin/ventures", label: "Ventures", Icon: Building2 },
  { href: "/admin/experience", label: "Experience", Icon: Briefcase },
  { href: "/admin/skills", label: "Skills", Icon: Sparkles },
  { href: "/admin/certifications", label: "Certifications", Icon: Award },
  { href: "/admin/news", label: "News", Icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", Icon: Star },
  { href: "/admin/reviews", label: "Reviews", Icon: MessageSquareQuote },
  { href: "/admin/clients", label: "Clients", Icon: Users },
  { href: "/admin/contact", label: "Inbox", Icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter", Icon: Mail },
  { href: "/admin/media", label: "Media", Icon: ImageIcon },
  { href: "/admin/profile", label: "Profile", Icon: UserCircle },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading, hydrate, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { void hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      const next = encodeURIComponent(pathname);
      router.push(`/login?next=${next}`);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--fg-muted)] font-mono text-sm">
        Loading admin…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col bg-[var(--bg-elev)] border-r border-[var(--border)] p-5">
        <Link href="/admin" className="flex items-center gap-3 mb-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-violet-500)] font-bold text-[#050507]">
            MZ
          </span>
          <div>
            <p className="font-display font-semibold leading-tight">Admin</p>
            <p className="text-xs text-[var(--fg-muted)] font-mono">Control center</p>
          </div>
        </Link>

        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-gradient-to-r from-[var(--color-brand-400)]/15 to-[var(--color-violet-500)]/10 text-[var(--fg)] border border-[var(--color-brand-400)]/20"
                    : "text-[var(--fg-muted)] hover:bg-white/[0.03] hover:text-[var(--fg)]",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-2">
          <div className="text-xs">
            <p className="font-medium text-[var(--fg)]">{user.name}</p>
            <p className="text-[var(--fg-muted)] font-mono">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--fg-muted)] hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 glass-strong border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="font-display font-semibold">MZ Admin</Link>
        <select
          value={pathname}
          onChange={(e) => router.push(e.target.value)}
          className="bg-transparent text-sm border border-[var(--border)] rounded-md px-2 py-1"
        >
          {NAV.map((n) => (
            <option key={n.href} value={n.href} className="bg-[var(--bg-elev)]">
              {n.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <main className="flex-1 min-w-0 lg:pl-0 pt-16 lg:pt-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
