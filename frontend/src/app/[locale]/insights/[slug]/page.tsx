import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";

/**
 * Dynamic insights article.
 * Content is rendered client-side from the API (client-only fetch to avoid
 * server-side DB access at build time) — falls back gracefully if missing.
 */
export default async function InsightsArticle({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow="Insights"
        title={slug.replace(/-/g, " ")}
        crumbs={[{ href: "/insights", label: "Insights" }, { label: slug }]}
      />
      <section className="section-light py-14 md:py-16">
        <div className="container-x max-w-2xl">
          <Suspense fallback={<div className="h-60 shimmer rounded-xl" />}>
            <ArticleBody slug={slug} />
          </Suspense>
          <div className="mt-8">
            <Link href="/insights">
              <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                All insights
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

async function ArticleBody({ slug }: { slug: string }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
  try {
    const res = await fetch(`${apiBase}/news/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error("not-found");
    const json = (await res.json()) as {
      data: { title: { en: string }; content: { en: string }; publishedAt?: string };
    };
    const d = json.data;
    return (
      <article className="panel rounded-xl p-6 prose prose-sm max-w-none">
        <h1 className="font-display text-2xl font-bold mb-3">{d.title.en}</h1>
        <div
          className="text-sm leading-relaxed text-[var(--section-fg)] whitespace-pre-line"
        >
          {d.content.en}
        </div>
      </article>
    );
  } catch {
    return (
      <div className="panel rounded-xl p-10 text-center">
        <p className="text-sm text-[var(--section-muted)] font-mono">
          This insight hasn&apos;t been published yet.
        </p>
      </div>
    );
  }
}
