"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Folder, FileText, Receipt, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/client", label: "Overview", Icon: LayoutDashboard },
  { href: "/client/projects", label: "Projects", Icon: Folder },
  { href: "/client/files", label: "Files", Icon: FileText },
  { href: "/client/invoices", label: "Invoices", Icon: Receipt },
  { href: "/client/profile", label: "Profile", Icon: UserIcon },
];

export function ClientShell({ children }: { children: ReactNode }) {
  const { user, loading, hydrate, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { void hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "client") {
    return (
      <div className="min-h-screen grid place-items-center text-[var(--fg-muted)] font-mono text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-[var(--bg-elev)] border-r border-[var(--border)] p-5">
        <Link href="/client" className="flex items-center gap-3 mb-10">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-gold-300)] to-[var(--color-violet-500)] font-bold text-[#050507]">MZ</span>
          <div>
            <p className="font-display font-semibold leading-tight">Client Portal</p>
            <p className="text-xs text-[var(--fg-muted)] font-mono">Welcome, {user.name.split(" ")[0]}</p>
          </div>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname === href || (href !== "/client" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-[var(--color-gold-300)]/15 text-[var(--fg)] border border-[var(--color-gold-300)]/20"
                    : "text-[var(--fg-muted)] hover:bg-white/[0.03] hover:text-[var(--fg)]",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
          className="mt-6 pt-4 border-t border-[var(--border)] flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--fg-muted)] hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="p-6 lg:p-10 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
