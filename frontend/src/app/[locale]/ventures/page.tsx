import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Ventures } from "@/components/sections/Ventures";
import { Opportunities } from "@/components/sections/Opportunities";
import { Clients } from "@/components/sections/Clients";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Ventures" });
  return { title: t("eyebrow"), description: t("description") };
}

export default async function VenturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Ventures");
  const ph = await getTranslations("PageHeaders.ventures");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: t("eyebrow") }]}
      />
      <Ventures tone="light" />
      <Clients tone="dark" />
      <Opportunities tone="light" />
    </>
  );
}
