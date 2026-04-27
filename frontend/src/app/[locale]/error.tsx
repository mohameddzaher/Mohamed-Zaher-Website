"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-mono text-xs uppercase tracking-widest text-red-400">
        500 — runtime error
      </p>
      <h1 className="mt-4 font-display text-5xl md:text-7xl font-black">
        Something <span className="text-gradient">broke</span>.
      </h1>
      <p className="mt-4 max-w-lg text-[var(--fg-muted)]">
        {error.message || "Unexpected error. Try again, or take me home."}
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/"><Button variant="secondary">Home</Button></Link>
      </div>
    </div>
  );
}
