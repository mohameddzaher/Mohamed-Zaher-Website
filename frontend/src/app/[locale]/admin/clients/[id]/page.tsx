"use client";

import { use, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, FileText, Receipt, Folder } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

type Detail = {
  client: { _id: string; name: string; email: string; company?: string; phone?: string };
  projects: { _id: string; title: string; status: string; progress: number }[];
  invoices: {
    _id: string;
    number: string;
    total: number;
    paid: number;
    status: string;
    issueDate: string;
    dueDate?: string;
    currency: string;
  }[];
  files: { _id: string; name: string; url: string; size?: number; createdAt: string }[];
  totals: { billed: number; paid: number; remaining: number };
};

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const qc = useQueryClient();
  const [tab, setTab] = useState<"projects" | "invoices" | "files">("projects");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const { data, isLoading } = useQuery<Detail>({
    queryKey: ["admin", "client", id],
    queryFn: async () => {
      const r = await api.get<{ data: Detail }>(`/clients/${id}`);
      return r.data.data;
    },
  });

  if (isLoading) {
    return <div className="text-[var(--fg-muted)] font-mono text-sm">Loading…</div>;
  }
  if (!data) return null;

  const { client, projects, invoices, files, totals } = data;

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-violet-500)] flex items-center justify-center font-bold text-[#050507]">
            {client.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">{client.name}</h1>
            <p className="text-sm text-[var(--fg-muted)] font-mono">{client.email}</p>
            {client.company && (
              <p className="text-xs text-[var(--fg-muted)] mt-0.5">{client.company}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-right">
          <Card className="p-4 min-w-32">
            <p className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">Billed</p>
            <p className="font-display text-xl font-bold">${totals.billed.toLocaleString()}</p>
          </Card>
          <Card className="p-4 min-w-32">
            <p className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">Paid</p>
            <p className="font-display text-xl font-bold text-emerald-400">${totals.paid.toLocaleString()}</p>
          </Card>
          <Card className="p-4 min-w-32">
            <p className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">Remaining</p>
            <p className="font-display text-xl font-bold text-amber-400">${totals.remaining.toLocaleString()}</p>
          </Card>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[var(--border)]">
        {[
          { id: "projects", label: "Projects", Icon: Folder },
          { id: "invoices", label: "Invoices", Icon: Receipt },
          { id: "files", label: "Files", Icon: FileText },
        ].map(({ id: tid, label, Icon }) => (
          <button
            key={tid}
            onClick={() => setTab(tid as typeof tab)}
            className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === tid
                ? "text-[var(--color-brand-400)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {tab === tid && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--color-brand-400)]" />
            )}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowProjectForm(true)}>
              New project
            </Button>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8 font-mono">No projects yet</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <Card key={p._id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{p.title}</h3>
                    <Badge variant="brand">{p.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--fg-muted)]">Progress</span>
                      <span className="font-mono">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        style={{ width: `${p.progress}%` }}
                        className="h-full bg-gradient-to-r from-[var(--color-brand-400)] to-[var(--color-violet-500)]"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "invoices" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowInvoiceForm(true)}>
              New invoice
            </Button>
          </div>
          {invoices.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8 font-mono">No invoices yet</p>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--border)]">
                  <tr className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">
                    <th className="px-4 py-3 text-left">Number</th>
                    <th className="px-4 py-3 text-left">Issue date</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="border-b border-[var(--border)] last:border-b-0">
                      <td className="px-4 py-3 font-mono text-xs">{inv.number}</td>
                      <td className="px-4 py-3">{formatDate(inv.issueDate)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{inv.currency} {inv.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-400">{inv.currency} {inv.paid.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant={inv.status === "paid" ? "success" : "warning"}>{inv.status}</Badge></td>
                      <td className="px-4 py-3 text-right">
                        <RecordPaymentButton invoiceId={inv._id} onDone={() => qc.invalidateQueries({ queryKey: ["admin", "client", id] })} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "files" && (
        <div className="space-y-4">
          <FileUpload clientId={id} onUploaded={() => qc.invalidateQueries({ queryKey: ["admin", "client", id] })} />
          {files.length === 0 ? (
            <p className="text-sm text-[var(--fg-muted)] text-center py-8 font-mono">No files yet</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {files.map((f) => (
                <a key={f._id} href={f.url} target="_blank" rel="noopener noreferrer" className="glass rounded-xl p-4 flex items-center gap-3 hover:border-white/15 transition-colors">
                  <FileText className="h-5 w-5 text-[var(--color-brand-400)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{f.name}</p>
                    <p className="text-xs text-[var(--fg-muted)] font-mono">
                      {formatDate(f.createdAt)} · {f.size ? `${Math.round(f.size / 1024)} KB` : "—"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {showInvoiceForm && (
        <InvoiceForm
          clientId={id}
          onClose={() => setShowInvoiceForm(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "client", id] });
            setShowInvoiceForm(false);
          }}
        />
      )}
      {showProjectForm && (
        <ProjectForm
          clientId={id}
          onClose={() => setShowProjectForm(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "client", id] });
            setShowProjectForm(false);
          }}
        />
      )}
    </div>
  );
}

function RecordPaymentButton({ invoiceId, onDone }: { invoiceId: string; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/clients/invoices/${invoiceId}/payments`, { amount: Number(amount) });
      toast.success("Payment recorded");
      setOpen(false);
      setAmount("");
      onDone();
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Record payment</Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <form onSubmit={submit} className="w-full max-w-sm glass-strong rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg font-semibold">Record payment</h3>
            <Input label="Amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" loading={submitting}>Save</Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function ProjectForm({ clientId, onClose, onSaved }: { clientId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: "", description: "", status: "planning", progress: 0 });
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/clients/${clientId}/projects`, form);
      toast.success("Project added");
      onSaved();
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-lg glass-strong rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">New client project</h3>
        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { value: "planning", label: "Planning" },
            { value: "in-progress", label: "In progress" },
            { value: "review", label: "Review" },
            { value: "delivered", label: "Delivered" },
            { value: "on-hold", label: "On hold" },
          ]}
        />
        <Input label="Progress (%)" type="number" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create</Button>
        </div>
      </form>
    </div>
  );
}

function InvoiceForm({ clientId, onClose, onSaved }: { clientId: string; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ total: "", currency: "USD", dueDate: "" });
  const [submitting, setSubmitting] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/clients/${clientId}/invoices`, {
        total: Number(form.total),
        currency: form.currency,
        dueDate: form.dueDate || undefined,
        status: "sent",
      });
      toast.success("Invoice created");
      onSaved();
    } catch {
      toast.error("Failed");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-md glass-strong rounded-2xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">New invoice</h3>
        <Input label="Total" type="number" min="0" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} required />
        <Input label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
        <Input label="Due date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submitting}>Create</Button>
        </div>
      </form>
    </div>
  );
}

function FileUpload({ clientId, onUploaded }: { clientId: string; onUploaded: () => void }) {
  const [uploading, setUploading] = useState(false);
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("clientId", clientId);
      await api.post("/upload/client-file", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded");
      onUploaded();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }
  return (
    <label className="block glass rounded-xl p-4 border-2 border-dashed border-[var(--border-strong)] cursor-pointer hover:border-[var(--color-brand-400)]/50 transition-colors">
      <input type="file" className="hidden" onChange={onChange} disabled={uploading} />
      <div className="text-center text-sm text-[var(--fg-muted)]">
        {uploading ? "Uploading…" : "Click to upload a file for this client"}
      </div>
    </label>
  );
}
