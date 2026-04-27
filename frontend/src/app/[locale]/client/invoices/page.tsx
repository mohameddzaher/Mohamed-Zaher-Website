"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

type Dashboard = {
  invoices: {
    _id: string;
    number: string;
    total: number;
    paid: number;
    status: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
    pdfUrl?: string;
  }[];
};

export default function ClientInvoicesPage() {
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
        <h1 className="font-display text-3xl font-bold tracking-tight">Invoices</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">All billing history in one place.</p>
      </header>
      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl shimmer" />)}</div>
      ) : !data?.invoices?.length ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">No invoices yet</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--border)]">
              <tr className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">
                <th className="px-4 py-3 text-left">Number</th>
                <th className="px-4 py-3 text-left">Issued</th>
                <th className="px-4 py-3 text-left">Due</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-[var(--border)] last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">{formatDate(inv.issueDate)}</td>
                  <td className="px-4 py-3 text-[var(--fg-muted)]">
                    {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {inv.currency} {inv.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-emerald-400">
                    {inv.currency} {inv.paid.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={inv.status === "paid" ? "success" : "warning"}>{inv.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
