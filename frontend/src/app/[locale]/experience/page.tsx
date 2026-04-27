import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Experience" });
  return { title: t("eyebrow") };
}

/**
 * /experience — career timeline + capability tracks. No duplicate identity/credentials.
 */
export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Experience");
  const ph = await getTranslations("PageHeaders.experience");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: t("eyebrow") }]}
      />
      <Experience tone="light" />
      <Skills tone="dark" />
    </>
  );
}
