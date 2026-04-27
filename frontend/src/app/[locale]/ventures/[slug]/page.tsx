import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VENTURES } from "@/lib/data";
import { ventureImage } from "@/lib/images";
import { bi } from "@/lib/i18nText";

export function generateStaticParams() {
  return VENTURES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const venture = VENTURES.find((v) => v.slug === slug);
  if (!venture) return { title: "Venture" };
  return {
    title: bi(venture.name, locale),
    description: bi(venture.description, locale),
  };
}

export default async function VenturePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const venture = VENTURES.find((v) => v.slug === slug);
  if (!venture) notFound();
  const name = bi(venture.name, locale);
  const role = bi(venture.role, locale);
  const description = bi(venture.description, locale);
  const t = await getTranslations({ locale, namespace: "VentureDetail" });
  const tVentures = await getTranslations({ locale, namespace: "Ventures" });
  const cover = ventureImage(venture.slug);

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={venture.category}
        title={name}
        description={role}
        crumbs={[{ href: "/ventures", label: tVentures("eyebrow") }, { label: name }]}
      />
      <section className="section-light py-14 md:py-16">
        <div className="container-x max-w-3xl">
          <div className="panel rounded-xl overflow-hidden">
            <div className="relative aspect-[16/9] bg-[var(--section-panel)] overflow-hidden">
              <Image
                src={cover}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="brand">{role}</Badge>
                <Badge variant="outline">{venture.category}</Badge>
              </div>
              <p className="text-base leading-relaxed text-[var(--section-fg)]">
                {description}
              </p>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[var(--section-border)]">
                {venture.url && (
                  <a href={venture.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
                      {t("visit_site")}
                    </Button>
                  </a>
                )}
                <Link href="/contact?subject=Partnership+with+Mohamed+Zaher">
                  <Button size="sm" variant="secondary">
                    {t("partner_cta")}
                  </Button>
                </Link>
                <Link href="/ventures">
                  <Button size="sm" variant="ghost" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}>
                    {t("all")}
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
