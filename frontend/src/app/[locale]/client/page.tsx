"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder, Receipt, Wallet, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { io, type Socket } from "socket.io-client";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

type Dashboard = {
  projects: { _id: string; title: string; status: string; progress: number }[];
  invoices: { _id: string; number: string; total: number; paid: number; status: string; issueDate: string; currency: string }[];
  files: { _id: string; name: string; url: string; createdAt: string }[];
  totals: { billed: number; paid: number; remaining: number; pending: number };
};

export default function ClientDashboard() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<Dashboard>({
    queryKey: ["client", "dashboard"],
    queryFn: async () => {
      const r = await api.get<{ data: Dashboard }>("/clients/me/dashboard");
      return r.data.data;
    },
  });

  // Real-time updates
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000";
    const socket: Socket = io(url, { withCredentials: true });
    socket.on("project:updated", () => {
      qc.invalidateQueries({ queryKey: ["client", "dashboard"] });
      toast.success("A project was updated");
    });
    socket.on("project:new", () => {
      qc.invalidateQueries({ queryKey: ["client", "dashboard"] });
      toast.success("A new project was added");
    });
    socket.on("invoice:payment", () => {
      qc.invalidateQueries({ queryKey: ["client", "dashboard"] });
      toast.success("Payment recorded on your invoice");
    });
    return () => {
      socket.disconnect();
    };
  }, [qc]);

  const stats = [
    { label: "Active projects", value: data?.projects.filter((p) => p.status !== "delivered").length ?? 0, Icon: Folder },
    { label: "Total billed", value: `$${(data?.totals.billed ?? 0).toLocaleString()}`, Icon: Receipt },
    { label: "Paid", value: `$${(data?.totals.paid ?? 0).toLocaleString()}`, Icon: Wallet },
    { label: "Remaining", value: `$${(data?.totals.remaining ?? 0).toLocaleString()}`, Icon: Clock },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">Here&apos;s what&apos;s happening with your projects.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-[var(--fg-muted)] font-mono">{label}</p>
              <Icon className="h-4 w-4 text-[var(--color-gold-300)]" />
            </div>
            <p className="font-display text-3xl font-bold">{isLoading ? "—" : value}</p>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Active projects</h2>
          {!data || data.projects.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] font-mono py-6 text-center">No projects yet</p>
          ) : (
            <ul className="space-y-3">
              {data.projects.slice(0, 5).map((p) => (
                <li key={p._id}>
                  <div className="flex items-center justify-between mb-1.5 text-sm">
                    <span className="font-medium">{p.title}</span>
                    <Badge variant="brand">{p.status}</Badge>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                    <div style={{ width: `${p.progress}%` }} className="h-full bg-gradient-to-r from-[var(--color-gold-300)] to-[var(--color-violet-500)]" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Recent files</h2>
          {!data || data.files.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] font-mono py-6 text-center">No files shared yet</p>
          ) : (
            <ul className="space-y-2">
              {data.files.slice(0, 6).map((f) => (
                <li key={f._id}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                    <FileText className="h-4 w-4 text-[var(--color-gold-300)]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{f.name}</p>
                      <p className="text-xs text-[var(--fg-muted)] font-mono">{formatDate(f.createdAt)}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
