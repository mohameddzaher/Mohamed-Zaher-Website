"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MapPin,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Booking = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  startsAt: string;
  durationMin: number;
  meetingType: "video" | "phone" | "in-person";
  status: "pending" | "confirmed" | "cancelled" | "completed";
};

type Task = {
  _id: string;
  title: string;
  type: "task" | "meeting" | "call" | "note" | "deadline";
  startsAt?: string;
  dueAt?: string;
  durationMin?: number;
  status: "todo" | "in-progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 9); // 09:00 → 21:00

function fmtDayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fmtHour(h: number): string {
  const am = h < 12;
  const hh = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hh}:00 ${am ? "AM" : "PM"}`;
}

function startOfDayUTC(d: Date): Date {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export default function AdminCalendarPage() {
  const qc = useQueryClient();
  const [day, setDay] = useState<Date>(() => startOfDayUTC(new Date()));

  const dayEnd = useMemo(() => {
    const e = new Date(day);
    e.setUTCDate(day.getUTCDate() + 1);
    return e;
  }, [day]);

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["admin", "calendar", "bookings", day.toISOString()],
    queryFn: async () => {
      const r = await api.get<{ data: Booking[] }>(
        `/bookings/range?from=${day.toISOString()}&to=${dayEnd.toISOString()}`,
      );
      return r.data.data;
    },
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["admin", "calendar", "tasks", day.toISOString()],
    queryFn: async () => {
      const r = await api.get<{ data: Task[] }>(
        `/tasks?from=${day.toISOString()}&to=${dayEnd.toISOString()}`,
      );
      return r.data.data;
    },
  });

  // Real-time
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5001";
    const socket: Socket = io(url, { withCredentials: true });
    socket.on("booking:new", () => {
      qc.invalidateQueries({ queryKey: ["admin", "calendar", "bookings"] });
      toast.success("New booking received");
    });
    return () => {
      socket.disconnect();
    };
  }, [qc]);

  // Group bookings by hour bucket
  function bookingAtHour(h: number): Booking | undefined {
    return bookings.find((b) => new Date(b.startsAt).getUTCHours() === h);
  }
  function tasksAtHour(h: number): Task[] {
    return tasks.filter((tk) => {
      const at = tk.startsAt ?? tk.dueAt;
      if (!at) return false;
      return new Date(at).getUTCHours() === h;
    });
  }

  const isToday = day.getTime() === startOfDayUTC(new Date()).getTime();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Day Calendar</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Bookings and tasks on the same time grid. Real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/bookings">
            <Button variant="secondary" size="sm" leftIcon={<ListChecks className="h-3.5 w-3.5" />}>
              List view
            </Button>
          </Link>
        </div>
      </header>

      {/* Day nav */}
      <div className="panel rounded-xl p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous day"
            onClick={() => {
              const d = new Date(day);
              d.setUTCDate(day.getUTCDate() - 1);
              setDay(d);
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md panel hover:border-[var(--color-gold-400)]/40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDay(startOfDayUTC(new Date()))}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium",
              isToday ? "bg-[var(--color-gold-500)] text-white" : "panel hover:border-[var(--color-gold-400)]/40",
            )}
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next day"
            onClick={() => {
              const d = new Date(day);
              d.setUTCDate(day.getUTCDate() + 1);
              setDay(d);
            }}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md panel hover:border-[var(--color-gold-400)]/40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="font-display text-base font-semibold inline-flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-[var(--color-gold-400)]" />
          {fmtDayLabel(day)}
        </p>
        <input
          type="date"
          value={day.toISOString().slice(0, 10)}
          onChange={(e) => {
            const d = new Date(e.target.value + "T00:00:00.000Z");
            if (!Number.isNaN(d.getTime())) setDay(d);
          }}
          className="bg-[var(--bg-elev)] border border-[var(--border)] rounded-md px-2 py-1 text-xs"
        />
      </div>

      {/* Grid */}
      <div className="panel rounded-2xl overflow-hidden">
        <ul>
          {HOURS.map((h, i) => {
            const b = bookingAtHour(h);
            const dayTasks = tasksAtHour(h);
            const isPast =
              isToday && new Date().getUTCHours() > h;
            return (
              <li
                key={h}
                className={cn(
                  "grid grid-cols-[80px_1fr] gap-3 px-4 py-3 border-b border-[var(--border)] last:border-b-0",
                  isPast && "opacity-60",
                )}
              >
                <div className="font-mono text-xs text-[var(--fg-muted)] pt-1">{fmtHour(h)}</div>
                <div className="min-w-0 space-y-2">
                  {b && (
                    <Link
                      href={`/admin/bookings/${b._id}`}
                      className="block p-3 rounded-lg bg-[var(--color-gold-400)]/10 border border-[var(--color-gold-400)]/30 hover:bg-[var(--color-gold-400)]/15 transition"
                    >
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-medium text-sm">
                            {b.subject}
                          </p>
                          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                            {b.name} · {b.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
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
                          {b.meetingType === "video" && <Video className="h-3 w-3 text-[var(--fg-muted)]" />}
                          {b.meetingType === "phone" && <Phone className="h-3 w-3 text-[var(--fg-muted)]" />}
                          {b.meetingType === "in-person" && <MapPin className="h-3 w-3 text-[var(--fg-muted)]" />}
                        </div>
                      </div>
                    </Link>
                  )}
                  {dayTasks.length > 0 &&
                    dayTasks.map((tk) => (
                      <Link
                        key={tk._id}
                        href={`/admin/tasks?focus=${tk._id}`}
                        className={cn(
                          "block p-2.5 rounded-lg border text-xs transition",
                          tk.priority === "urgent"
                            ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/15"
                            : tk.priority === "high"
                              ? "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15"
                              : "panel hover:border-[var(--color-gold-400)]/40",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn("font-medium", tk.status === "done" && "line-through opacity-60")}>
                            {tk.title}
                          </span>
                          <Badge variant="outline">{tk.type}</Badge>
                        </div>
                      </Link>
                    ))}
                  {!b && dayTasks.length === 0 && (
                    <span className="block h-7 text-[10px] text-[var(--fg-muted)]/40 italic font-mono">
                      free
                    </span>
                  )}
                  {i === 0 && bookings.length === 0 && tasks.length === 0 && (
                    <p className="text-[10px] text-[var(--fg-muted)] font-mono">
                      Nothing scheduled today.
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
