"use client";

import { type ReactNode } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  width?: string;
  className?: string;
};

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function ResourceTable<T extends { _id?: string; id?: string }>({
  rows,
  columns,
  onEdit,
  onDelete,
  emptyMessage = "No items yet",
  loading,
}: Props<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-sm text-[var(--fg-muted)] font-mono">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--border)] bg-white/[0.02]">
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  style={{ width: c.width }}
                  className={cn(
                    "text-left px-4 py-3 font-medium text-xs uppercase tracking-widest text-[var(--fg-muted)]",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
              {(onEdit || onDelete) && <th className="w-24" />}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = row._id ?? row.id ?? Math.random().toString();
              return (
                <tr
                  key={id}
                  className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((c) => (
                    <td key={String(c.key)} className={cn("px-4 py-3 align-middle", c.className)}>
                      {c.render
                        ? c.render(row)
                        : String((row as unknown as Record<string, unknown>)[c.key as string] ?? "—")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            aria-label="Edit"
                            className="p-2 rounded-lg hover:bg-white/[0.06] text-[var(--fg-muted)] hover:text-[var(--color-brand-400)]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            aria-label="Delete"
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--fg-muted)] hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
