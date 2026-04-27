"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type Dashboard = {
  projects: {
    _id: string;
    title: string;
    description?: string;
    status: string;
    progress: number;
    milestones?: { title: string; completed: boolean }[];
    startDate?: string;
    endDate?: string;
  }[];
};

export default function ClientProjectsPage() {
  const { data, isLoading } = useQuery<Dashboard>({
    queryKey: ["client", "dashboard"],
    queryFn: async () => {
      const r = await api.get<{ data: Dashboard }>("/clients/me/dashboard");
      return r.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Your projects</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">Real-time progress and milestones.</p>
      </header>
      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-32 rounded-2xl shimmer" />)}</div>
      ) : !data?.projects?.length ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">No projects yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {data.projects.map((p) => (
            <Card key={p._id} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-[var(--fg-muted)] mt-1">{p.description}</p>
                  )}
                </div>
                <Badge variant="brand">{p.status}</Badge>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--fg-muted)]">Progress</span>
                  <span className="font-mono">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div style={{ width: `${p.progress}%` }} className="h-full bg-gradient-to-r from-[var(--color-brand-400)] to-[var(--color-violet-500)]" />
                </div>
              </div>
              {p.milestones && p.milestones.length > 0 && (
                <div className="pt-4 border-t border-[var(--border)]">
                  <p className="text-xs uppercase tracking-widest text-[var(--fg-muted)] font-mono mb-2">Milestones</p>
                  <ul className="space-y-1.5">
                    {p.milestones.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span
                          className={`h-4 w-4 rounded-full border ${
                            m.completed ? "bg-emerald-500 border-emerald-500" : "border-white/20"
                          }`}
                        />
                        <span className={m.completed ? "line-through text-[var(--fg-muted)]" : ""}>
                          {m.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
