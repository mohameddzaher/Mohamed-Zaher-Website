"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

type Review = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  email?: string;
  rating: number;
  quote: string;
  approved: boolean;
  featured: boolean;
  createdAt: string;
};

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"pending" | "approved">("pending");

  const { data, isLoading } = useQuery<Review[]>({
    queryKey: ["admin", "reviews", tab],
    queryFn: async () => {
      const r = await api.get<{ data: Review[] }>(`/reviews/all?status=${tab}`);
      return r.data.data;
    },
  });

  async function patch(id: string, body: Partial<Review>) {
    try {
      await api.patch(`/reviews/${id}`, body);
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews", "public"] });
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "reviews"] });
      qc.invalidateQueries({ queryKey: ["reviews", "public"] });
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Moderate visitor-submitted reviews. Approved ones appear on the home page.
        </p>
      </header>

      <div className="flex gap-2 border-b border-[var(--border)]">
        {(["pending", "approved"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={`px-3 py-2 text-xs font-medium uppercase tracking-widest transition-colors ${
              tab === s
                ? "text-[var(--color-brand-500)] border-b-2 border-[var(--color-brand-500)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
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
      ) : !data || data.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">
            No {tab} reviews.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <Card key={r._id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{r.name}</h3>
                    {r.featured && <Badge variant="brand">Featured</Badge>}
                    {r.approved && <Badge variant="success">Live</Badge>}
                  </div>
                  <p className="text-xs text-[var(--fg-muted)] font-mono">
                    {r.role && `${r.role}`}
                    {r.role && r.company && " · "}
                    {r.company}
                  </p>
                  {r.email && <p className="text-[10px] text-[var(--fg-muted)] font-mono mt-1">{r.email}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[var(--color-brand-500)] text-[var(--color-brand-500)]" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed">{r.quote}</p>
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--border)]">
                <p className="text-[10px] text-[var(--fg-muted)] font-mono mr-auto">
                  {formatDate(r.createdAt)}
                </p>
                {!r.approved ? (
                  <button
                    type="button"
                    onClick={() => patch(r._id, { approved: true })}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                  >
                    <Check className="h-3 w-3" /> Approve
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => patch(r._id, { approved: false })}
                    className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                  >
                    <X className="h-3 w-3" /> Unapprove
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => patch(r._id, { featured: !r.featured })}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md panel hover:border-[var(--color-brand-500)]/40"
                >
                  <Star className={`h-3 w-3 ${r.featured ? "fill-[var(--color-brand-500)] text-[var(--color-brand-500)]" : ""}`} />
                  {r.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(r._id)}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-md text-red-400 hover:bg-red-500/10"
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
