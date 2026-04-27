"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth";

export default function ClientProfilePage() {
  const { user } = useAuth();
  const [pwd, setPwd] = useState({ current: "", next: "" });
  const [submitting, setSubmitting] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
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
        <h1 className="font-display text-3xl font-bold tracking-tight">Your profile</h1>
      </header>
      <Card className="p-6 space-y-2">
        <p className="text-sm text-[var(--fg-muted)]">Name</p>
        <p className="font-medium">{user?.name}</p>
        <p className="text-sm text-[var(--fg-muted)] mt-3">Email</p>
        <p className="font-medium font-mono">{user?.email}</p>
      </Card>

      <Card className="p-6 space-y-4">
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
            label="New password (min 8 chars)"
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
