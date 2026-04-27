"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  Calendar as CalendarIcon,
  Mail,
  Phone,
  Video,
  MapPin,
  Check,
  X,
  Clock,
  CheckCircle2,
  Building2,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

type Booking = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message?: string;
  startsAt: string;
  durationMin: number;
  meetingType: "video" | "phone" | "in-person";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  meetingLink?: string;
  notes?: string;
  createdAt: string;
};

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

export default function AdminBookingsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("all");

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["admin", "bookings", tab],
    queryFn: async () => {
      const url = tab === "all" ? "/bookings" : `/bookings?status=${tab}`;
      const r = await api.get<{ data: Booking[] }>(url);
      return r.data.data;
    },
  });

  // Real-time: live updates when a new booking arrives
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5001";
    const socket: Socket = io(url, { withCredentials: true });
    socket.on("booking:new", (b: { name: string; subject: string }) => {
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success(`New booking from ${b.name}: ${b.subject}`);
    });
    return () => {
      socket.disconnect();
    };
  }, [qc]);

  async function patch(id: string, body: Partial<Booking>) {
    try {
      await api.patch(`/bookings/${id}`, body);
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  }

  function fmtDateTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Meeting requests from the public booking page. Real-time updates.
          </p>
        </div>
        <Link href="/admin/bookings/calendar">
          <Button variant="secondary" size="sm" leftIcon={<CalendarIcon className="h-3.5 w-3.5" />}>
            Day calendar
          </Button>
        </Link>
      </header>

      <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto pb-1">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={cn(
              "px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors whitespace-nowrap",
              tab === s
                ? "text-[var(--color-brand-500)] border-b-2 border-[var(--color-brand-500)]"
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
            <div key={i} className="h-32 panel rounded-xl shimmer" />
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">No {tab} bookings.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const TypeIcon = b.meetingType === "video" ? Video : b.meetingType === "phone" ? Phone : MapPin;
            return (
              <Card key={b._id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{b.name}</h3>
                      <Badge
                        variant={
                          b.status === "confirmed"
                            ? "success"
                            : b.status === "cancelled"
                              ? "warning"
                              : b.status === "completed"
                                ? "default"
                                : "brand"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-[var(--fg-muted)] font-mono mt-1 flex items-center gap-3 flex-wrap">
                      <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1 hover:text-[var(--color-brand-400)]">
                        <Mail className="h-3 w-3" /> {b.email}
                      </a>
                      {b.phone && (
                        <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 hover:text-[var(--color-brand-400)]">
                          <Phone className="h-3 w-3" /> {b.phone}
                        </a>
                      )}
                      {b.company && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {b.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-mono text-sm">
                      <CalendarIcon className="inline h-3.5 w-3.5 mr-1 text-[var(--color-brand-500)]" />
                      {fmtDateTime(b.startsAt)}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                      <TypeIcon className="inline h-3 w-3 mr-1" />
                      {b.meetingType} · {b.durationMin} min
                    </p>
                  </div>
                </div>

                <p className="font-medium text-sm">{b.subject}</p>
                {b.message && (
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed whitespace-pre-line">
                    {b.message}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--border)]">
                  <p className="text-[10px] text-[var(--fg-muted)] font-mono mr-auto">
                    Requested {formatDate(b.createdAt)}
                  </p>
                  {b.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => patch(b._id, { status: "confirmed" })}
                      className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                    >
                      <Check className="h-3 w-3" /> Confirm
                    </button>
                  )}
                  {(b.status === "pending" || b.status === "confirmed") && (
                    <>
                      <button
                        type="button"
                        onClick={() => patch(b._id, { status: "completed" })}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md panel hover:border-[var(--color-brand-500)]/40"
                      >
                        <CheckCircle2 className="h-3 w-3" /> Mark done
                      </button>
                      <button
                        type="button"
                        onClick={() => patch(b._id, { status: "cancelled" })}
                        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                      >
                        <X className="h-3 w-3" /> Cancel
                      </button>
                    </>
                  )}
                  <Link
                    href={`/admin/bookings/${b._id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md hover:bg-white/[0.04]"
                  >
                    Details <ChevronRight className="h-3 w-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(b._id)}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md text-red-400 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
