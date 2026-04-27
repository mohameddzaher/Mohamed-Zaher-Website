"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { newsImage } from "@/lib/images";
import { formatDate } from "@/lib/utils";
import { useBi } from "@/lib/i18nText";

type Bilingual = { en: string; ar: string } | string;
type ApiPost = {
  _id: string;
  slug: string;
  title: Bilingual;
  excerpt: Bilingual;
  publishedAt: string;
  coverImage?: string;
  tags?: string[];
  views?: number;
};

/**
 * Full insights board: featured hero + search + tag filters + grid.
 * Falls back gracefully when backend is cold or empty.
 */
export function InsightsBoard({ tone = "light" }: { tone?: "dark" | "light" }) {
  const t = useTranslations("News");
  const localize = useBi();
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("all");

  const { data: posts = [], isLoading } = useQuery<ApiPost[]>({
    queryKey: ["insights", "all"],
    queryFn: async () => {
      try {
        const r = await api.get<{ data: ApiPost[] }>("/news?published=true&limit=100");
        return r.data.data ?? [];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) (p.tags ?? []).forEach((tg) => set.add(tg));
    return Array.from(set).slice(0, 12);
  }, [posts]);

  const filtered = useMemo(() => {
    let list = posts;
    if (activeTag !== "all") list = list.filter((p) => (p.tags ?? []).includes(activeTag));
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          localize(p.title).toLowerCase().includes(s) ||
          localize(p.excerpt).toLowerCase().includes(s),
      );
    }
    return list;
  }, [posts, activeTag, search, localize]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <Section id="insights" tone={tone} className="py-16">
      {isLoading ? (
        <div className="grid lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="panel rounded-xl h-72 shimmer" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="panel rounded-xl p-12 text-center max-w-xl mx-auto">
          <p className="text-sm text-[var(--section-muted)] font-mono">{t("empty")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Search + tags */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--section-muted)] pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search") || "Search…"}
                className="pl-10"
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveTag("all")}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                    activeTag === "all"
                      ? "bg-[var(--color-brand-600)] text-white"
                      : "panel text-[var(--section-muted)] hover:text-[var(--section-fg)]"
                  }`}
                >
                  All
                </button>
                {allTags.map((tg) => (
                  <button
                    key={tg}
                    type="button"
                    onClick={() => setActiveTag(tg)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      activeTag === tg
                        ? "bg-[var(--color-brand-600)] text-white"
                        : "panel text-[var(--section-muted)] hover:text-[var(--section-fg)]"
                    }`}
                  >
                    {tg}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Featured hero post */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="panel rounded-2xl overflow-hidden grid md:grid-cols-2 gap-0 group hover:border-[var(--color-brand-500)]/30 transition-colors"
            >
              <Link
                href={`/insights/${featured.slug}`}
                className="relative block aspect-video md:aspect-auto bg-[var(--section-panel)] overflow-hidden"
              >
                <Image
                  src={featured.coverImage || newsImage(featured.slug)}
                  alt={localize(featured.title)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="brand">Featured</Badge>
                </div>
              </Link>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-1 text-[10px] text-[var(--section-muted)] font-mono mb-2">
                  <Calendar className="h-3 w-3" />
                  {formatDate(featured.publishedAt)}
                </div>
                <Link href={`/insights/${featured.slug}`}>
                  <h2 className="font-display text-xl md:text-2xl font-bold leading-tight mb-2 hover:text-[var(--color-brand-600)] transition-colors">
                    {localize(featured.title)}
                  </h2>
                </Link>
                <p className="text-sm text-[var(--section-muted)] leading-relaxed line-clamp-3 mb-4">
                  {localize(featured.excerpt)}
                </p>
                <Link
                  href={`/insights/${featured.slug}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-brand-600)] hover:gap-1.5 transition-all"
                >
                  {t("read_more")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rest.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15, margin: "-60px" }}
                  transition={{ duration: 0.28, delay: i * 0.03 }}
                  className="panel rounded-xl overflow-hidden hover:border-[var(--color-brand-500)]/30 transition-colors duration-200 group"
                >
                  <Link href={`/insights/${post.slug}`}>
                    <div className="relative aspect-video overflow-hidden bg-[var(--section-panel)]">
                      <Image
                        src={post.coverImage || newsImage(post.slug)}
                        alt={localize(post.title)}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-[10px] text-[var(--section-muted)] font-mono mb-1.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <h3 className="font-display text-base font-semibold mb-1.5 leading-snug">
                        {localize(post.title)}
                      </h3>
                      <p className="text-xs text-[var(--section-muted)] line-clamp-2">
                        {localize(post.excerpt)}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-brand-600)] group-hover:gap-1.5 transition-all">
                        {t("read_more")} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
