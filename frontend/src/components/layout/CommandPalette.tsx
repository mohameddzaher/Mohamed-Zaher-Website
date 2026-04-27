"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Hash, ArrowRight, Mail, Github, Linkedin } from "lucide-react";
import { SITE, NAV_LINKS } from "@/lib/site";

type Action = {
  id: string;
  label: string;
  href: string;
  hint?: string;
  Icon?: typeof Search;
  external?: boolean;
};

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const actions = useMemo<Action[]>(
    () => [
      ...NAV_LINKS.map((l) => ({ id: `nav:${l.key}`, label: `Go to ${l.key}`, href: l.href, Icon: Hash })),
      { id: "client", label: "Client portal", href: "/client", Icon: ArrowRight },
      { id: "admin", label: "Admin", href: "/admin", Icon: ArrowRight },
      { id: "mail", label: "Email Mohamed", href: `mailto:${SITE.email}`, external: true, Icon: Mail },
      { id: "github", label: "GitHub", href: SITE.socials.github, external: true, Icon: Github },
      { id: "linkedin", label: "LinkedIn", href: SITE.socials.linkedin, external: true, Icon: Linkedin },
    ],
    [],
  );

  const filtered = q
    ? actions.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))
    : actions;

  function go(a: Action) {
    setOpen(false);
    setQ("");
    if (a.external) window.open(a.href, "_blank");
    else if (a.href.startsWith("/#")) {
      window.location.hash = a.href.slice(1);
    } else {
      router.push(a.href);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg glass-strong rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search className="h-4 w-4 text-[var(--fg-muted)]" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--fg-muted)]"
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] border border-[var(--border)]">
                ESC
              </kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-4 text-sm text-[var(--fg-muted)] text-center font-mono">
                  Nothing found
                </li>
              )}
              {filtered.map((a) => {
                const Icon = a.Icon ?? Search;
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => go(a)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-white/[0.04] transition-colors text-left"
                    >
                      <Icon className="h-4 w-4 text-[var(--color-brand-400)]" />
                      <span className="flex-1">{a.label}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--fg-muted)]">
              <span>Cmd / Ctrl + K to toggle</span>
              <span>↵ to go</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
