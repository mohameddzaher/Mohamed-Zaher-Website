"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  Trash2,
  Pencil,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  type: "task" | "meeting" | "call" | "note" | "deadline";
  dueAt?: string;
  startsAt?: string;
  durationMin?: number;
  meetingWith?: string;
  meetingLocation?: string;
  tags?: string[];
  completedAt?: string;
  createdAt: string;
};

const STATUS_TABS = ["all", "todo", "in-progress", "done"] as const;

export default function AdminTasksPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["admin", "tasks", tab],
    queryFn: async () => {
      const url = tab === "all" ? "/tasks" : `/tasks?status=${tab}`;
      const r = await api.get<{ data: Task[] }>(url);
      return r.data.data;
    },
  });

  const { data: summary } = useQuery<{
    today: Task[];
    upcoming: Task[];
    overdue: Task[];
    openCount: number;
  }>({
    queryKey: ["admin", "tasks", "today"],
    queryFn: async () => {
      const r = await api.get<{
        data: { today: Task[]; upcoming: Task[]; overdue: Task[]; openCount: number };
      }>("/tasks/today");
      return r.data.data;
    },
    staleTime: 30_000,
  });

  async function patch(id: string, body: Partial<Task>) {
    try {
      await api.patch(`/tasks/${id}`, body);
      qc.invalidateQueries({ queryKey: ["admin", "tasks"] });
      toast.success("Saved");
    } catch {
      toast.error("Failed");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      qc.invalidateQueries({ queryKey: ["admin", "tasks"] });
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Tasks & Schedule</h1>
          <p className="text-sm text-[var(--fg-muted)] mt-1">
            Personal task list, meetings, calls, and deadlines.
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          New
        </Button>
      </header>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard
            label="Today"
            value={summary.today.length}
            Icon={CalendarIcon}
            tone="brand"
          />
          <SummaryCard
            label="Overdue"
            value={summary.overdue.length}
            Icon={AlertCircle}
            tone={summary.overdue.length > 0 ? "danger" : "muted"}
          />
          <SummaryCard
            label="Upcoming (week)"
            value={summary.upcoming.length}
            Icon={Clock}
            tone="muted"
          />
          <SummaryCard
            label="Open total"
            value={summary.openCount}
            Icon={Circle}
            tone="muted"
          />
        </div>
      )}

      {/* Today + overdue surface */}
      {summary && (summary.today.length > 0 || summary.overdue.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-4">
          {summary.overdue.length > 0 && (
            <Card className="p-5">
              <h2 className="font-display text-base font-semibold mb-3 inline-flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400" /> Overdue
              </h2>
              <ul className="space-y-2">
                {summary.overdue.slice(0, 5).map((tk) => (
                  <TaskRow
                    key={tk._id}
                    task={tk}
                    onToggle={() => patch(tk._id, { status: tk.status === "done" ? "todo" : "done" })}
                    onEdit={() => {
                      setEditing(tk);
                      setShowForm(true);
                    }}
                    onDelete={() => remove(tk._id)}
                  />
                ))}
              </ul>
            </Card>
          )}
          {summary.today.length > 0 && (
            <Card className="p-5">
              <h2 className="font-display text-base font-semibold mb-3 inline-flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-[var(--color-gold-400)]" /> Today
              </h2>
              <ul className="space-y-2">
                {summary.today.slice(0, 5).map((tk) => (
                  <TaskRow
                    key={tk._id}
                    task={tk}
                    onToggle={() => patch(tk._id, { status: tk.status === "done" ? "todo" : "done" })}
                    onEdit={() => {
                      setEditing(tk);
                      setShowForm(true);
                    }}
                    onDelete={() => remove(tk._id)}
                  />
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      <div className="flex gap-1 border-b border-[var(--border)] overflow-x-auto pb-1">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setTab(s)}
            className={cn(
              "px-3 py-2 text-xs font-medium uppercase tracking-widest whitespace-nowrap transition-colors",
              tab === s
                ? "text-[var(--color-gold-400)] border-b-2 border-[var(--color-gold-400)]"
                : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 panel rounded-xl shimmer" />
          ))}
        </div>
      ) : !tasks || tasks.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-sm text-[var(--fg-muted)] font-mono">
            No tasks yet. Create your first one.
          </p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {tasks.map((tk) => (
            <TaskRow
              key={tk._id}
              task={tk}
              onToggle={() => patch(tk._id, { status: tk.status === "done" ? "todo" : "done" })}
              onEdit={() => {
                setEditing(tk);
                setShowForm(true);
              }}
              onDelete={() => remove(tk._id)}
            />
          ))}
        </ul>
      )}

      {showForm && (
        <TaskForm
          task={editing}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin", "tasks"] });
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  Icon,
  tone,
}: {
  label: string;
  value: number;
  Icon: typeof CalendarIcon;
  tone: "brand" | "muted" | "danger";
}) {
  const colors = {
    brand: "text-[var(--color-gold-400)]",
    muted: "text-[var(--fg-muted)]",
    danger: "text-red-400",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest text-[var(--fg-muted)] font-mono">{label}</p>
        <Icon className={cn("h-3.5 w-3.5", colors[tone])} />
      </div>
      <p className={cn("font-display text-2xl font-bold", tone === "danger" && "text-red-400")}>
        {value}
      </p>
    </Card>
  );
}

function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const done = task.status === "done";
  const priorityColor =
    task.priority === "urgent"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : task.priority === "high"
        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
        : task.priority === "medium"
          ? "bg-[var(--color-gold-400)]/15 text-[var(--color-gold-300)] border-[var(--color-gold-400)]/30"
          : "bg-[var(--bg-elev)] text-[var(--fg-muted)] border-[var(--border)]";

  const dueDate = task.dueAt || task.startsAt;
  const isOverdue = dueDate && !done && new Date(dueDate).getTime() < Date.now();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "panel rounded-xl p-3 flex items-start gap-3 hover:border-[var(--color-gold-400)]/30 transition-colors",
        done && "opacity-50",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={done ? "Mark not done" : "Mark done"}
        className="mt-0.5 shrink-0"
      >
        {done ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <Circle className="h-4 w-4 text-[var(--fg-muted)]" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p
            className={cn(
              "font-medium text-sm leading-snug",
              done && "line-through",
            )}
          >
            {task.title}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                priorityColor,
              )}
            >
              <Flag className="h-2.5 w-2.5" />
              {task.priority}
            </span>
            <Badge variant="outline">{task.type}</Badge>
          </div>
        </div>
        {task.description && (
          <p className="text-xs text-[var(--fg-muted)] mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--fg-muted)] font-mono flex-wrap">
          {dueDate && (
            <span className={cn("inline-flex items-center gap-1", isOverdue && "text-red-400")}>
              <Clock className="h-2.5 w-2.5" />
              {new Date(dueDate).toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
                timeZone: "Asia/Riyadh",
              })}
            </span>
          )}
          {task.meetingWith && <span>· with {task.meetingWith}</span>}
          {task.tags && task.tags.length > 0 && (
            <span>· {task.tags.map((tg) => `#${tg}`).join(" ")}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit"
          className="p-1.5 rounded-md hover:bg-white/[0.06] text-[var(--fg-muted)] hover:text-[var(--color-gold-300)]"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete"
          className="p-1.5 rounded-md hover:bg-red-500/10 text-[var(--fg-muted)] hover:text-red-400"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.li>
  );
}

function TaskForm({
  task,
  onClose,
  onSaved,
}: {
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!task;
  const [submitting, setSubmitting] = useState(false);

  function toLocal(iso?: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    // datetime-local format: YYYY-MM-DDTHH:mm
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60_000);
    return local.toISOString().slice(0, 16);
  }

  const [form, setForm] = useState({
    title: task?.title ?? "",
    description: task?.description ?? "",
    type: task?.type ?? "task",
    priority: task?.priority ?? "medium",
    status: task?.status ?? "todo",
    dueAt: toLocal(task?.dueAt),
    startsAt: toLocal(task?.startsAt),
    durationMin: task?.durationMin ?? 60,
    meetingWith: task?.meetingWith ?? "",
    meetingLocation: task?.meetingLocation ?? "",
    tags: task?.tags?.join(", ") ?? "",
  });

  const isMeeting = form.type === "meeting" || form.type === "call";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        type: form.type,
        priority: form.priority,
        status: form.status,
        dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : null,
        startsAt: isMeeting && form.startsAt ? new Date(form.startsAt).toISOString() : null,
        durationMin: isMeeting ? form.durationMin : null,
        meetingWith: form.meetingWith || undefined,
        meetingLocation: form.meetingLocation || undefined,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };
      if (editing && task) {
        await api.patch(`/tasks/${task._id}`, body);
        toast.success("Saved");
      } else {
        await api.post("/tasks", body);
        toast.success("Created");
      }
      onSaved();
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-lg glass-strong rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-display text-lg font-bold">
            {editing ? "Edit task" : "New task"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          autoFocus
        />
        <Textarea
          label="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as Task["type"] })}
            options={[
              { value: "task", label: "Task" },
              { value: "meeting", label: "Meeting" },
              { value: "call", label: "Call" },
              { value: "note", label: "Note" },
              { value: "deadline", label: "Deadline" },
            ]}
          />
          <Select
            label="Priority"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "urgent", label: "Urgent" },
            ]}
          />
        </div>

        <Select
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as Task["status"] })}
          options={[
            { value: "todo", label: "To do" },
            { value: "in-progress", label: "In progress" },
            { value: "done", label: "Done" },
            { value: "cancelled", label: "Cancelled" },
          ]}
        />

        {isMeeting ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="datetime-local"
                label="Starts at"
                value={form.startsAt}
                onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
              />
              <Input
                type="number"
                min={5}
                max={600}
                label="Duration (min)"
                value={form.durationMin}
                onChange={(e) => setForm({ ...form, durationMin: Number(e.target.value) })}
              />
            </div>
            <Input
              label="Meeting with"
              placeholder="Person or company"
              value={form.meetingWith}
              onChange={(e) => setForm({ ...form, meetingWith: e.target.value })}
            />
            <Input
              label="Location / Link"
              placeholder="Office address or video link"
              value={form.meetingLocation}
              onChange={(e) => setForm({ ...form, meetingLocation: e.target.value })}
            />
          </>
        ) : (
          <Input
            type="datetime-local"
            label="Due"
            value={form.dueAt}
            onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
          />
        )}

        <Input
          label="Tags (comma-separated)"
          placeholder="ets, follow-up, urgent"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" loading={submitting}>
            {editing ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
