"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";

type Client = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  active: boolean;
  createdAt: string;
};

export default function AdminClientsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<Client[]>({
    queryKey: ["admin", "clients"],
    queryFn: async () => {
      const r = await api.get<{ data: Client[] }>("/clients");
      return r.data.data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "clients"] });
      toast.success("Client removed");
    },
  });

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: "Client",
      render: (r) => (
        <Link
          href={`/admin/clients/${r._id}`}
          className="flex items-center gap-2 hover:text-[var(--color-brand-400)] transition-colors"
        >
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-violet-500)] flex items-center justify-center text-xs font-bold text-[#050507]">
            {r.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </span>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-xs text-[var(--fg-muted)] font-mono">{r.email}</div>
          </div>
          <ExternalLink className="h-3.5 w-3.5 opacity-50" />
        </Link>
      ),
    },
    { key: "company", header: "Company", render: (r) => r.company ?? "—" },
    { key: "phone", header: "Phone", render: (r) => r.phone ?? "—" },
    {
      key: "active",
      header: "Status",
      render: (r) => (r.active ? "Active" : "Disabled"),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Each client gets their own portal with projects, files, and invoices.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowForm(true)}>
          New client
        </Button>
      </header>

      <ResourceTable<Client>
        rows={data ?? []}
        columns={columns}
        loading={isLoading}
        onDelete={(r) => {
          if (confirm(`Delete client ${r.name}? This is permanent.`)) remove.mutate(r._id);
        }}
        emptyMessage="No clients yet — create one and share their portal credentials."
      />

      {showForm && (
        <CreateClientDrawer
          onClose={() => setShowForm(false)}
          onCreated={() => {
            qc.invalidateQueries({ queryKey: ["admin", "clients"] });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function CreateClientDrawer({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/clients", form);
      toast.success("Client created");
      onCreated();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg glass-strong rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-display text-2xl font-bold mb-6">New client</h2>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Initial password" type="text" hint="Share securely" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create client</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
