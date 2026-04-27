import Link from "next/link";
import "./globals.css";

export default function NotFound() {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-brand-400)]">
            404 — not found
          </p>
          <h1 className="mt-4 font-display text-6xl md:text-8xl font-black">
            Lost in the <span className="text-gradient">stack</span>.
          </h1>
          <p className="mt-4 max-w-md text-[var(--fg-muted)]">
            The page you&apos;re looking for doesn&apos;t exist — or it&apos;s still under construction.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#050507] [background:linear-gradient(135deg,var(--color-brand-400),var(--color-violet-500))]"
          >
            Take me home
          </Link>
        </div>
      </body>
    </html>
  );
}
