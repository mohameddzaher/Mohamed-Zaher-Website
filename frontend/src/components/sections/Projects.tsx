"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, Star, Search, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { GradientTitle } from "@/components/ui/GradientTitle";
import { PROJECTS, type Project } from "@/lib/data";
import { projectImage } from "@/lib/images";
import { useBi } from "@/lib/i18nText";
import { cn } from "@/lib/utils";

const FILTERS = ["all", "web", "ecommerce", "business", "realestate", "edtech"] as const;

export function Projects({
  tone = "light",
  compact = false,
  limit,
  showSearch = false,
}: {
  tone?: "dark" | "light";
  compact?: boolean;
  limit?: number;
  showSearch?: boolean;
}) {
  const t = useTranslations("Projects");
  const localize = useBi();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
    const featured = compact ? list.filter((p) => p.featured) : list;
    list = featured.length > 0 ? featured : list;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (p) =>
          localize(p.title).toLowerCase().includes(s) ||
          localize(p.description).toLowerCase().includes(s),
      );
    }
    const capped = typeof limit === "number" ? list.slice(0, limit) : list;
    return showAll ? capped : capped.slice(0, 9);
  }, [filter, search, showAll, compact, limit, localize]);

  return (
    <Section
      id="projects"
      tone={tone}
      eyebrow={t("eyebrow")}
      title={<GradientTitle raw={t("title")} />}
      description={t("description")}
    >
      {!compact && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap justify-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => {
                  setFilter(f);
                  setShowAll(false);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
                  filter === f
                    ? "bg-[var(--color-brand-600)] text-white shadow-[0_4px_14px_-4px_var(--color-brand-600)]"
                    : "panel text-[var(--section-muted)] hover:text-[var(--section-fg)]",
                )}
              >
                {t(`filters.${f}`)}
              </button>
            ))}
          </div>
          {showSearch && (
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--section-muted)] pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search")}
                className="pl-10"
              />
            </div>
          )}
        </div>
      )}

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} t={t} title={localize(p.title)} description={localize(p.description)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {compact && (
        <div className="mt-8 text-center">
          <Link href="/projects">
            <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              {t("view_all")}
            </Button>
          </Link>
        </div>
      )}

      {!compact && !showAll && filtered.length === 9 && (
        <div className="mt-8 text-center">
          <Button variant="secondary" size="sm" onClick={() => setShowAll(true)}>
            {t("view_more")}
          </Button>
        </div>
      )}
    </Section>
  );
}

function ProjectCard({
  project,
  index,
  t,
  title,
  description,
}: {
  project: Project;
  index: number;
  t: (k: string) => string;
  title: string;
  description: string;
}) {
  const img = projectImage(project.slug, project.image);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
      className="group relative panel rounded-xl overflow-hidden hover:border-[var(--color-brand-500)]/30 transition-colors duration-200"
    >
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--section-panel)]">
          <Image
            src={img}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <span className="font-display text-base md:text-lg font-bold text-white drop-shadow leading-tight block">
              {title}
            </span>
          </div>
          {project.featured && (
            <div className="absolute top-2.5 right-2.5">
              <Badge variant="brand">
                <Star className="h-2.5 w-2.5 fill-current" /> {t("featured")}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/projects/${project.slug}`}>
          <h3 className="font-display text-base font-semibold mb-1 hover:text-[var(--color-brand-600)] transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-[var(--section-muted)] leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="mt-2">
          <Badge variant="outline">{t(`filters.${project.category}`)}</Badge>
        </div>

        <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[var(--section-border)]">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--section-muted)] hover:text-[var(--color-brand-600)] transition-colors"
            >
              <Github className="h-3 w-3" />
              {t("source")}
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--section-muted)] hover:text-[var(--color-brand-600)] transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {t("live_demo")}
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--color-brand-600)] hover:gap-1.5 transition-all ms-auto"
          >
            {t("case_study")}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
