"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { Mail, Archive, MessageCircle, RefreshCw, Inbox, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Inquiry = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  inquiry?: string;
  budget?: string;
  type?: string;
  status: "new" | "read" | "replied" | "archived";
  createdAt: string;
};

const TABS = ["all", "new", "replied", "archived"] as const;

export default function ContactInbox() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");

  const { data, isLoading, isFetching, refetch } = useQuery<Inquiry[]>({
    queryKey: ["admin", "contact", tab],
    queryFn: async () => {
      const url = tab === "all" ? "/contact" : `/contact?status=${tab}`;
      const r = await api.get<{ data: Inquiry[] }>(url);
      return r.data.data;
    },
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  // Real-time: incoming submissions
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5001";
    const socket: Socket = io(url, { withCredentials: true });
    socket.on("contact:new", (m: { name: string; subject: string; inquiry?: string }) => {
      qc.invalidateQueries({ queryKey: ["admin", "contact"] });
      toast.success(`New inquiry: ${m.name} — ${m.subject}${m.inquiry ? ` (${m.inquiry})` : ""}`);
    });
    return () => {
      socket.disconnect();
    };
  }, [qc]);

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Inquiry["status"] }) =>
      api.patch(`/contact/${id}`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contact"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/contact/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "contact"] });
      toast.success("Deleted");
    },
  });

  const newCount = data?.filter((m) => m.status === "new").length ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight inline-flex items-center gap-3">
            Inbox
            {newCount > 0 && (
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[var(--color-gold-400)]/15 text-[var(--color-gold-300)] border border-[var(--color-gold-400)]/30">
                {newCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Inquiries from the public contact form. Live updates.
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </header>

      <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto pb-1">
        {TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={cn(
              "px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap",
              tab === s
                ? "text-[var(--color-gold-400)] border-b-2 border-[var(--color-gold-400)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 panel rounded-2xl shimmer" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card className="p-12 text-center">
          <Inbox className="h-8 w-8 text-[var(--fg-muted)] mx-auto mb-3" />
          <p className="text-sm text-[var(--fg-muted)] font-mono">
            No {tab === "all" ? "" : tab + " "}inquiries yet.
          </p>
          <p className="text-xs text-[var(--fg-muted)] mt-2">
            Submissions from <code className="px-1 py-0.5 rounded bg-white/[0.05]">/contact</code> land here in real time.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((m) => (
            <Card
              key={m._id}
              className={cn(
                "p-5 space-y-3",
                m.status === "new" && "border-l-2 border-l-[var(--color-gold-400)]",
              )}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{m.name}</h3>
                    {m.status === "new" && <Badge variant="brand">New</Badge>}
                    {m.status === "replied" && <Badge variant="success">Replied</Badge>}
                    {m.status === "archived" && <Badge variant="default">Archived</Badge>}
                    {m.inquiry && <Badge variant="violet">{m.inquiry}</Badge>}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] font-mono mt-1">
                    <a href={`mailto:${m.email}`} className="hover:text-[var(--color-gold-300)]">{m.email}</a>
                    {m.company && <span> · {m.company}</span>}
                  </p>
                </div>
                <p className="text-xs text-[var(--fg-muted)] font-mono">{formatDate(m.createdAt)}</p>
              </div>

              <p className="font-medium">{m.subject}</p>

              <p className="text-sm text-[var(--fg-muted)] leading-relaxed whitespace-pre-line">
                {m.message}
              </p>

              {(m.budget || m.type) && (
                <div className="flex flex-wrap gap-1.5">
                  {m.budget && <Badge variant="outline">Budget: {m.budget}</Badge>}
                  {m.type && <Badge variant="outline">Type: {m.type}</Badge>}
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)] flex-wrap">
                <a
                  href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md bg-[var(--color-gold-400)]/15 border border-[var(--color-gold-400)]/30 text-[var(--color-gold-300)] hover:bg-[var(--color-gold-400)]/25"
                  onClick={() => update.mutate({ id: m._id, status: "replied" })}
                >
                  <Mail className="h-3 w-3" /> Reply
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hi ${m.name}, regarding "${m.subject}"`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                >
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </a>
                {m.status !== "archived" && (
                  <button
                    type="button"
                    onClick={() => update.mutate({ id: m._id, status: "archived" })}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md panel hover:border-[var(--color-gold-400)]/40"
                  >
                    <Archive className="h-3 w-3" /> Archive
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Delete this inquiry?")) remove.mutate(m._id);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md text-red-400 hover:bg-red-500/10 ml-auto"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
