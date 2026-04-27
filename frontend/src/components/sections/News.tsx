"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { newsImage } from "@/lib/images";

type NewsItem = {
  _id: string;
  slug: string;
  title: { en: string; ar: string } | string;
  excerpt: { en: string; ar: string } | string;
  publishedAt: string;
  coverImage?: string;
};

function str(v: NewsItem["title"]): string {
  return typeof v === "string" ? v : v?.en ?? "";
}

export function News({ tone = "dark", limit = 3 }: { tone?: "dark" | "light"; limit?: number }) {
  const t = useTranslations("News");
  const { data, isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news", "public", limit],
    queryFn: async () => {
      const r = await api.get<{ data: NewsItem[] }>(`/news?published=true&limit=${limit}`);
      return r.data.data;
    },
    retry: 1,
  });

  return (
    <Section id="news" tone={tone} eyebrow={t("eyebrow")} title={t("title")}>
      {isLoading ? (
        <div className="grid sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="panel rounded-xl h-56 shimmer" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="panel rounded-xl p-10 text-center">
          <p className="text-[var(--section-muted)] font-mono text-xs">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {data.map((post, i) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15, margin: "-60px" }}
              transition={{ duration: 0.28, delay: i * 0.03 }}
              className="panel rounded-xl overflow-hidden hover:border-[var(--color-gold-400)]/30 transition-colors duration-200 group"
            >
              <Link href={`/insights/${post.slug}`}>
                <div className="relative aspect-video overflow-hidden bg-[var(--section-panel)]">
                  <Image
                    src={post.coverImage || newsImage(post.slug)}
                    alt={str(post.title)}
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
                    {str(post.title)}
                  </h3>
                  <p className="text-xs text-[var(--section-muted)] line-clamp-2">
                    {str(post.excerpt)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--color-gold-500)] group-hover:gap-1.5 transition-all">
                    {t("read_more")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </Section>
  );
}
