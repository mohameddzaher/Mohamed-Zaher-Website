"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Eye,
  Users,
  Inbox,
  FileText,
  FolderKanban,
  DollarSign,
  CalendarClock,
  ListChecks,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type DashboardData = {
  pageviews30d: number;
  contactsCount: number;
  subscribersCount: number;
  postsCount: number;
  activeProjectsCount: number;
  clientsCount: number;
  revenue: { billed: number; paid: number };
  topPaths: { path: string; views: number }[];
  dailyPageviews: { date: string; views: number }[];
};

type Booking = {
  _id: string;
  name: string;
  subject: string;
  startsAt: string;
  status: string;
};

type Task = {
  _id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  dueAt?: string;
  startsAt?: string;
};

export default function AdminDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const r = await api.get<{ data: DashboardData }>("/analytics/dashboard");
      return r.data.data;
    },
  });

  const { data: upcomingBookings = [] } = useQuery<Booking[]>({
    queryKey: ["admin", "dashboard", "bookings-upcoming"],
    queryFn: async () => {
      const r = await api.get<{ data: Booking[] }>("/bookings?status=pending");
      return r.data.data
        .filter((b) => new Date(b.startsAt).getTime() > Date.now())
        .slice(0, 4);
    },
  });

  const { data: taskSummary } = useQuery<{ today: Task[]; overdue: Task[]; openCount: number }>({
    queryKey: ["admin", "dashboard", "tasks"],
    queryFn: async () => {
      const r = await api.get<{ data: { today: Task[]; overdue: Task[]; openCount: number } }>("/tasks/today");
      return r.data.data;
    },
  });

  // Real-time refresh on new booking
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5001";
    const socket: Socket = io(url, { withCredentials: true });
    socket.on("booking:new", (b: { name: string; subject: string }) => {
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success(`New booking: ${b.name} — ${b.subject}`);
    });
    return () => {
      socket.disconnect();
    };
  }, [qc]);

  const stats = [
    { label: "Pageviews (30d)", value: data?.pageviews30d ?? 0, Icon: Eye },
    { label: "Open tasks", value: taskSummary?.openCount ?? 0, Icon: ListChecks },
    { label: "Pending bookings", value: upcomingBookings.length, Icon: CalendarClock },
    { label: "Active projects", value: data?.activeProjectsCount ?? 0, Icon: FolderKanban },
    { label: "Clients", value: data?.clientsCount ?? 0, Icon: Users },
    { label: "Inquiries", value: data?.contactsCount ?? 0, Icon: Inbox },
    { label: "Subscribers", value: data?.subscribersCount ?? 0, Icon: FileText },
    {
      label: "Revenue collected",
      value: `$${(data?.revenue?.paid ?? 0).toLocaleString()}`,
      Icon: DollarSign,
    },
  ];

  function fmtBookingTime(iso: string) {
    return new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Riyadh",
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Overview of platform activity in the last 30 days.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-[var(--fg-muted)] font-mono">
                {label}
              </p>
              <Icon className="h-4 w-4 text-[var(--color-brand-500)]" />
            </div>
            <p className="font-display text-3xl font-bold">
              {isLoading ? "—" : value}
            </p>
          </Card>
        ))}
      </div>

      {/* Upcoming bookings + today tasks */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold inline-flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[var(--color-brand-500)]" />
              Upcoming bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-[10px] font-mono text-[var(--color-brand-400)] inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingBookings.length === 0 ? (
            <p className="text-xs text-[var(--fg-muted)] font-mono py-4 text-center">
              No pending bookings.
            </p>
          ) : (
            <ul className="space-y-2">
              {upcomingBookings.map((b) => (
                <li key={b._id}>
                  <Link
                    href={`/admin/bookings/${b._id}`}
                    className="block panel rounded-lg p-3 hover:border-[var(--color-brand-500)]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{b.subject}</p>
                        <p className="text-[10px] text-[var(--fg-muted)] font-mono mt-0.5">
                          {b.name} · {fmtBookingTime(b.startsAt)}
                        </p>
                      </div>
                      <Badge variant="brand">{b.status}</Badge>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-base font-semibold inline-flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-[var(--color-brand-500)]" />
              Today + overdue
              {taskSummary && taskSummary.overdue.length > 0 && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                  <AlertCircle className="h-2.5 w-2.5" /> {taskSummary.overdue.length} overdue
                </span>
              )}
            </h2>
            <Link
              href="/admin/tasks"
              className="text-[10px] font-mono text-[var(--color-brand-400)] inline-flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {!taskSummary || (taskSummary.today.length === 0 && taskSummary.overdue.length === 0) ? (
            <p className="text-xs text-[var(--fg-muted)] font-mono py-4 text-center">
              No tasks scheduled today.
            </p>
          ) : (
            <ul className="space-y-2">
              {[...taskSummary.overdue, ...taskSummary.today].slice(0, 5).map((tk) => {
                const at = tk.startsAt ?? tk.dueAt;
                const isOverdue = at && new Date(at).getTime() < Date.now() && tk.status !== "done";
                return (
                  <li key={tk._id}>
                    <Link
                      href="/admin/tasks"
                      className={cn(
                        "block panel rounded-lg p-3 hover:border-[var(--color-brand-500)]/40 transition-colors",
                        isOverdue && "border-red-500/30",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{tk.title}</p>
                          {at && (
                            <p
                              className={cn(
                                "text-[10px] font-mono mt-0.5",
                                isOverdue ? "text-red-400" : "text-[var(--fg-muted)]",
                              )}
                            >
                              {fmtBookingTime(at)}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{tk.type}</Badge>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Pageviews (last 30 days)</h2>
          <div className="h-72">
            {isLoading ? (
              <div className="h-full shimmer rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.dailyPageviews ?? []}>
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e11d48" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fill: "#7a7a95", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#7a7a95", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#e11d48"
                    strokeWidth={2}
                    fill="url(#g)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Top pages</h2>
          <ul className="space-y-3">
            {(data?.topPaths ?? []).slice(0, 8).map((p) => (
              <li key={p.path} className="flex items-center justify-between text-sm">
                <span className="font-mono text-[var(--fg-muted)] truncate">{p.path || "/"}</span>
                <span className="font-semibold tabular-nums">{p.views}</span>
              </li>
            ))}
            {(!data || data.topPaths.length === 0) && (
              <p className="text-xs text-[var(--fg-muted)] font-mono">
                No tracked views yet.
              </p>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
