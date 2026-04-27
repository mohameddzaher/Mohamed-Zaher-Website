"use client";

import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";

type Row = Record<string, unknown> & { _id: string };

export function SimpleResourcePage({
  title,
  endpoint,
  columns,
  fields,
}: {
  title: string;
  endpoint: string;
  columns: Column<Row>[];
  fields: { key: string; label: string; type?: string; required?: boolean; nested?: string }[];
}) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);

  const { data, isLoading } = useQuery<Row[]>({
    queryKey: [endpoint, "admin"],
    queryFn: async () => {
      const r = await api.get<{ data: Row[] }>(`${endpoint}?limit=200`);
      return r.data.data;
    },
  });

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      qc.invalidateQueries({ queryKey: [endpoint, "admin"] });
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => { setEditing(null); setShowForm(true); }}>
          New
        </Button>
      </header>

      <ResourceTable<Row>
        rows={data ?? []}
        columns={columns}
        loading={isLoading}
        onEdit={(r) => { setEditing(r); setShowForm(true); }}
        onDelete={(r) => remove(r._id)}
      />

      {showForm && (
        <ResourceForm
          endpoint={endpoint}
          row={editing}
          fields={fields}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: [endpoint, "admin"] });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ResourceForm({
  endpoint,
  row,
  fields,
  onClose,
  onSaved,
}: {
  endpoint: string;
  row: Row | null;
  fields: { key: string; label: string; type?: string; required?: boolean; nested?: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!row;
  const initial: Record<string, string> = {};
  for (const f of fields) {
    const v = f.nested
      ? (row?.[f.nested] as Record<string, unknown> | undefined)?.[f.key]
      : row?.[f.key];
    initial[`${f.nested ?? ""}.${f.key}`] = v != null ? String(v) : "";
  }
  const [values, setValues] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const f of fields) {
        const raw = values[`${f.nested ?? ""}.${f.key}`];
        const value = f.type === "number" ? Number(raw) : raw;
        if (f.nested) {
          payload[f.nested] = { ...(payload[f.nested] as Record<string, unknown> | undefined), [f.key]: value };
        } else {
          payload[f.key] = value;
        }
      }
      if (editing && row) await api.put(`${endpoint}/${row._id}`, payload);
      else await api.post(endpoint, payload);
      toast.success(editing ? "Saved" : "Created");
      onSaved();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-lg glass-strong rounded-2xl p-6 max-h-[85vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-lg font-semibold">{editing ? "Edit" : "New"} item</h3>
        {fields.map((f) => (
          <Input
            key={`${f.nested ?? ""}.${f.key}`}
            label={f.label}
            type={f.type ?? "text"}
            required={f.required}
            value={values[`${f.nested ?? ""}.${f.key}`] ?? ""}
            onChange={(e) =>
              setValues({ ...values, [`${f.nested ?? ""}.${f.key}`]: e.target.value })
            }
          />
        ))}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={submitting}>{editing ? "Save" : "Create"}</Button>
        </div>
      </form>
    </div>
  );
}

export function asReactNode(value: unknown): ReactNode {
  if (value == null) return "—";
  if (typeof value === "object") {
    const v = value as Record<string, unknown>;
    return String(v.en ?? v.name ?? JSON.stringify(v));
  }
  return String(value);
}
