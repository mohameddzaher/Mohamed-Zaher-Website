import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { InsightsBoard } from "@/components/sections/InsightsBoard";
import { Newsletter } from "@/components/sections/Newsletter";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  return { title: t("eyebrow"), description: t("title") };
}

export default async function InsightsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("News");
  const ph = await getTranslations("PageHeaders.insights");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: t("eyebrow") }]}
      />
      <InsightsBoard tone="light" />
      <Newsletter tone="dark" />
    </>
  );
}
