"use client";

import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

type Sub = { _id: string; email: string; subscribed: boolean; createdAt: string };

export default function AdminNewsletterPage() {
  const { data, isLoading } = useQuery<Sub[]>({
    queryKey: ["admin", "newsletter"],
    queryFn: async () => {
      const r = await api.get<{ data: Sub[] }>("/newsletter");
      return r.data.data;
    },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Newsletter</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            {data ? `${data.filter((d) => d.subscribed).length} active subscribers` : "Loading…"}
          </p>
        </div>
        <a href="/api/newsletter/export.csv" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
            Export CSV
          </Button>
        </a>
      </header>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 rounded-xl shimmer" />
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((s) => (
                <tr key={s._id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs">{s.email}</td>
                  <td className="px-4 py-3">{s.subscribed ? "Active" : "Unsubscribed"}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
