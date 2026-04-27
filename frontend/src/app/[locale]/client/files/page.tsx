"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Download } from "lucide-react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

type Dashboard = {
  files: { _id: string; name: string; url: string; size?: number; createdAt: string; mimeType?: string }[];
};

export default function ClientFilesPage() {
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
        <h1 className="font-display text-3xl font-bold tracking-tight">Files & deliverables</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">Download anything I&apos;ve shared with you.</p>
      </header>
      {isLoading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-xl shimmer" />)}</div>
      ) : !data?.files?.length ? (
        <Card className="p-12 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">No files yet</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {data.files.map((f) => (
            <a
              key={f._id}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-4 flex items-center gap-3 hover:border-white/15 group transition-colors"
            >
              <FileText className="h-5 w-5 text-[var(--color-brand-400)] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{f.name}</p>
                <p className="text-xs text-[var(--fg-muted)] font-mono">
                  {formatDate(f.createdAt)} {f.size ? `· ${Math.round(f.size / 1024)} KB` : ""}
                </p>
              </div>
              <Download className="h-4 w-4 text-[var(--fg-muted)] group-hover:text-[var(--color-brand-400)]" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
