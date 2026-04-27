"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  Calendar as CalendarIcon,
  ArrowLeft,
  Building2,
  Video,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";

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

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const [savingNotes, setSavingNotes] = useState(false);

  const { data, isLoading } = useQuery<Booking>({
    queryKey: ["admin", "booking", id],
    queryFn: async () => {
      const r = await api.get<{ data: Booking }>(`/bookings/${id}`);
      return r.data.data;
    },
  });

  const [draft, setDraft] = useState({ meetingLink: "", notes: "" });
  if (data && !draft.meetingLink && !draft.notes && (data.meetingLink || data.notes)) {
    setDraft({ meetingLink: data.meetingLink ?? "", notes: data.notes ?? "" });
  }

  if (isLoading) return <p className="text-sm text-[var(--fg-muted)] font-mono">Loading…</p>;
  if (!data) return null;

  async function patch(body: Partial<Booking>) {
    try {
      await api.patch(`/bookings/${id}`, body);
      qc.invalidateQueries({ queryKey: ["admin", "booking", id] });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    }
  }

  const TypeIcon = data.meetingType === "video" ? Video : data.meetingType === "phone" ? Phone : MapPin;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]">
        <ArrowLeft className="h-3 w-3" /> All bookings
      </Link>

      <header className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{data.name}</h1>
          <p className="text-sm text-[var(--fg-muted)] font-mono">{data.email}</p>
        </div>
        <Badge
          variant={
            data.status === "confirmed"
              ? "success"
              : data.status === "cancelled"
                ? "warning"
                : data.status === "completed"
                  ? "default"
                  : "brand"
          }
        >
          {data.status}
        </Badge>
      </header>

      <Card className="p-5 space-y-3">
        <h2 className="font-display text-base font-semibold">Meeting</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mb-0.5">When</p>
            <p className="font-mono">
              {new Date(data.startsAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Riyadh" })}
            </p>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">{data.durationMin} min</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mb-0.5">Type</p>
            <p className="inline-flex items-center gap-1">
              <TypeIcon className="h-3.5 w-3.5 text-[var(--color-brand-500)]" />
              {data.meetingType}
            </p>
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mb-0.5">Subject</p>
          <p className="font-medium">{data.subject}</p>
        </div>
        {data.message && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mb-0.5">Message</p>
            <p className="text-sm leading-relaxed whitespace-pre-line">{data.message}</p>
          </div>
        )}
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-display text-base font-semibold">Contact</h2>
        <ul className="space-y-2 text-sm">
          <li className="inline-flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-[var(--color-brand-500)]" />
            <a href={`mailto:${data.email}`} className="hover:text-[var(--color-brand-400)]">{data.email}</a>
          </li>
          {data.phone && (
            <li className="inline-flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[var(--color-brand-500)]" />
              <a href={`tel:${data.phone}`} className="hover:text-[var(--color-brand-400)]">{data.phone}</a>
            </li>
          )}
          {data.company && (
            <li className="inline-flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-[var(--color-brand-500)]" />
              {data.company}
            </li>
          )}
        </ul>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-display text-base font-semibold">My notes & meeting link</h2>
        <Input
          label="Meeting link (sent to attendee on confirm)"
          value={draft.meetingLink}
          onChange={(e) => setDraft({ ...draft, meetingLink: e.target.value })}
          placeholder="https://meet.google.com/…"
        />
        <Textarea
          label="Internal notes"
          value={draft.notes}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          rows={4}
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            loading={savingNotes}
            onClick={async () => {
              setSavingNotes(true);
              try {
                await patch({ meetingLink: draft.meetingLink, notes: draft.notes });
              } finally {
                setSavingNotes(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-display text-base font-semibold">Status</h2>
        <Select
          label="Set status"
          value={data.status}
          onChange={(e) => patch({ status: e.target.value as Booking["status"] })}
          options={[
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />
      </Card>
    </div>
  );
}
