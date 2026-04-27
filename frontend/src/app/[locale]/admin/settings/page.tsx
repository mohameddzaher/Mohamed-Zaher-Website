"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Settings = {
  contact?: { email?: string; phone?: string; location?: string };
  socials?: Record<string, string | undefined>;
  seo?: { defaultTitle?: string; defaultDescription?: string; gaId?: string };
  nowBuilding?: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<{ data: Settings }>("/settings").then((r) => {
      setSettings(r.data.data ?? {});
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/settings", settings);
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-[var(--fg-muted)] font-mono">Loading…</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Site settings</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Global content used across the public site.
        </p>
      </header>

      <form onSubmit={save} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <Input
            label="Email"
            value={settings.contact?.email ?? ""}
            onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
          />
          <Input
            label="Phone"
            value={settings.contact?.phone ?? ""}
            onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
          />
          <Input
            label="Location"
            value={settings.contact?.location ?? ""}
            onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, location: e.target.value } })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Now building (badge under hero)</h2>
          <Input
            placeholder="e.g. Tapix Storefront v2"
            value={settings.nowBuilding ?? ""}
            onChange={(e) => setSettings({ ...settings, nowBuilding: e.target.value })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">SEO defaults</h2>
          <Input
            label="Default title"
            value={settings.seo?.defaultTitle ?? ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, defaultTitle: e.target.value } })}
          />
          <Textarea
            label="Default description"
            rows={3}
            value={settings.seo?.defaultDescription ?? ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, defaultDescription: e.target.value } })}
          />
          <Input
            label="Google Analytics ID"
            placeholder="G-XXXXXXX"
            value={settings.seo?.gaId ?? ""}
            onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, gaId: e.target.value } })}
          />
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold">Social links</h2>
          {(["linkedin", "github", "instagram", "x", "facebook", "snapchat", "whatsapp"] as const).map((k) => (
            <Input
              key={k}
              label={k}
              value={settings.socials?.[k] ?? ""}
              onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, [k]: e.target.value } })}
            />
          ))}
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} size="lg">
            Save settings
          </Button>
        </div>
      </form>
    </div>
  );
}
