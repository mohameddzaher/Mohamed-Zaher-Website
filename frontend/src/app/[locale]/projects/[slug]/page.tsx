import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink, ArrowLeft } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PROJECTS } from "@/lib/data";
import { projectImage } from "@/lib/images";
import { bi } from "@/lib/i18nText";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project" };
  return {
    title: bi(project.title, locale),
    description: bi(project.description, locale),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();
  const title = bi(project.title, locale);
  const description = bi(project.description, locale);
  const t = await getTranslations({ locale, namespace: "ProjectDetail" });
  const tProjects = await getTranslations({ locale, namespace: "Projects" });
  const cover = projectImage(project.slug, project.image);

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={`${tProjects("eyebrow")} · ${tProjects(`filters.${project.category}`)}`}
        title={title}
        description={description}
        crumbs={[{ href: "/projects", label: tProjects("eyebrow") }, { label: title }]}
      />
      <section className="section-light py-14 md:py-16">
        <div className="container-x max-w-3xl">
          <div className="panel rounded-xl overflow-hidden">
            <div className="relative aspect-[16/9] bg-[var(--section-panel)] overflow-hidden">
              <Image
                src={cover}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="brand">{tProjects(`filters.${project.category}`)}</Badge>
                {project.featured && <Badge variant="violet">Featured</Badge>}
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold mb-2">{t("overview")}</h2>
                <p className="text-sm leading-relaxed text-[var(--section-fg)]">{description}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--section-border)]">
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                      {t("visit_live")}
                    </Button>
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary" rightIcon={<Github className="h-3.5 w-3.5" />}>
                      {t("view_source")}
                    </Button>
                  </a>
                )}
                <Link href="/projects">
                  <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    {t("all_projects")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
