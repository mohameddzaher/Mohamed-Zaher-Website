"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth";

export default function AdminProfilePage() {
  const { user } = useAuth();
  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [submitting, setSubmitting] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwd.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/change-password", pwd);
      toast.success("Password updated");
      setPwd({ current: "", next: "" });
    } catch (e) {
      toast.error((e as { message?: string })?.message ?? "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Your admin account information and security.
        </p>
      </header>

      <Card className="p-5 space-y-2">
        <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)]">Name</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mt-3">Email</p>
        <p className="font-medium font-mono text-sm">{user?.email}</p>
        <p className="text-[10px] uppercase tracking-widest font-mono text-[var(--fg-muted)] mt-3">Role</p>
        <p className="font-medium text-sm">{user?.role}</p>
      </Card>

      <Card className="p-5 space-y-3">
        <h2 className="font-display text-lg font-semibold">Change password</h2>
        <form onSubmit={changePassword} className="space-y-3">
          <Input
            type="password"
            label="Current password"
            value={pwd.current}
            onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
            required
          />
          <Input
            type="password"
            label="New password"
            hint="Min 8 characters."
            value={pwd.next}
            onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
            required
            minLength={8}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={submitting}>Update password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
