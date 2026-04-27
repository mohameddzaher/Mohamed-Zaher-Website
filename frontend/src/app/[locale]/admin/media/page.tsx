"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Uploaded = { url: string; publicId: string; size: number; mimeType: string };

export default function AdminMediaPage() {
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post<{ data: Uploaded }>("/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFiles((prev) => [r.data.data, ...prev]);
      toast.success("Uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold tracking-tight">Media library</h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Upload images and assets to Cloudinary. Copy the URL into project / experience records.
        </p>
      </header>

      <label className="block">
        <input type="file" className="hidden" onChange={onChange} disabled={uploading} />
        <Card className="p-10 text-center border-2 border-dashed cursor-pointer hover:border-[var(--color-brand-400)]/40 transition-colors">
          <Upload className="h-10 w-10 mx-auto mb-3 text-[var(--color-brand-400)]" />
          <p className="font-medium">{uploading ? "Uploading…" : "Click to upload"}</p>
          <p className="text-xs text-[var(--fg-muted)] mt-1">Images, PDF, video. Max 25 MB.</p>
        </Card>
      </label>

      {files.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((f) => (
            <Card key={f.publicId} className="p-3">
              {f.mimeType.startsWith("image/") && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={f.url} alt={f.publicId} className="aspect-video w-full object-cover rounded-lg" />
              )}
              <p className="mt-2 text-xs font-mono break-all text-[var(--fg-muted)]">{f.url}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(f.url);
                  toast.success("URL copied");
                }}
              >
                Copy URL
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
