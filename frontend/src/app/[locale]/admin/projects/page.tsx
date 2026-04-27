"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import { slugify } from "@/lib/utils";

type ProjectRow = {
  _id: string;
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  category: string;
  tech: string[];
  featured: boolean;
  githubUrl?: string;
  demoUrl?: string;
  publishedAt?: string;
};

const CATEGORIES = ["web", "ecommerce", "business", "realestate", "edtech"];

export default function AdminProjectsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery<ProjectRow[]>({
    queryKey: ["admin", "projects"],
    queryFn: async () => {
      const r = await api.get<{ data: ProjectRow[] }>("/projects?limit=200");
      return r.data.data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "projects"] });
      toast.success("Project deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const columns: Column<ProjectRow>[] = [
    {
      key: "title",
      header: "Title",
      render: (r) => (
        <div className="flex items-center gap-2">
          {r.featured && <Star className="h-3.5 w-3.5 fill-current text-amber-400" />}
          <div>
            <div className="font-medium">{r.title?.en}</div>
            <div className="text-xs text-[var(--fg-muted)] font-mono">/{r.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r) => <Badge variant="outline">{r.category}</Badge>,
    },
    {
      key: "tech",
      header: "Tech",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.tech?.slice(0, 3).map((t) => (
            <Badge key={t} variant="default">
              {t}
            </Badge>
          ))}
          {(r.tech?.length ?? 0) > 3 && (
            <span className="text-xs text-[var(--fg-muted)]">
              +{r.tech.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (r) => (r.publishedAt ? "Yes" : "Draft"),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Manage portfolio projects shown on the public site.
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} leftIcon={<Plus className="h-4 w-4" />}>
          New project
        </Button>
      </header>

      <ResourceTable<ProjectRow>
        rows={data ?? []}
        columns={columns}
        loading={isLoading}
        onEdit={(r) => { setEditing(r); setShowForm(true); }}
        onDelete={(r) => {
          if (confirm(`Delete "${r.title?.en}"?`)) remove.mutate(r._id);
        }}
        emptyMessage="No projects yet — add your first."
      />

      {showForm && (
        <ProjectFormDrawer
          row={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "projects"] });
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProjectFormDrawer({
  row,
  onClose,
  onSaved,
}: {
  row: ProjectRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!row;
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    slug: row?.slug ?? "",
    title_en: row?.title?.en ?? "",
    title_ar: row?.title?.ar ?? "",
    description_en: row?.description?.en ?? "",
    description_ar: row?.description?.ar ?? "",
    category: row?.category ?? "web",
    tech: row?.tech?.join(", ") ?? "",
    githubUrl: row?.githubUrl ?? "",
    demoUrl: row?.demoUrl ?? "",
    featured: row?.featured ?? false,
    published: !!row?.publishedAt,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        slug: form.slug || slugify(form.title_en),
        title: { en: form.title_en, ar: form.title_ar },
        description: { en: form.description_en, ar: form.description_ar },
        category: form.category,
        tech: form.tech.split(",").map((s) => s.trim()).filter(Boolean),
        githubUrl: form.githubUrl || undefined,
        demoUrl: form.demoUrl || undefined,
        featured: form.featured,
        publishedAt: form.published ? new Date().toISOString() : null,
      };
      if (editing && row) {
        await api.put(`/projects/${row._id}`, payload);
        toast.success("Project updated");
      } else {
        await api.post("/projects", payload);
        toast.success("Project created");
      }
      onSaved();
    } catch (e) {
      const msg = (e as { message?: string })?.message ?? "Save failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl glass-strong rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-2xl font-bold mb-1">
          {editing ? "Edit project" : "New project"}
        </h2>
        <p className="text-sm text-[var(--fg-muted)] mb-6">
          Fill bilingual fields (English required, Arabic optional).
        </p>

        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          <Input label="Title (EN)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
          <Input label="Title (AR)" value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} />
          <Input label="Slug" hint="auto from title if empty" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Textarea label="Description (EN)" className="sm:col-span-2" value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} required rows={3} />
          <Textarea label="Description (AR)" className="sm:col-span-2" value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={3} />
          <Input label="Tech (comma separated)" className="sm:col-span-2" value={form.tech} onChange={(e) => setForm({ ...form, tech: e.target.value })} />
          <Input label="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
          <Input label="Demo URL" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>

          <div className="sm:col-span-2 flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={submitting}>
              {editing ? "Save changes" : "Create project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
