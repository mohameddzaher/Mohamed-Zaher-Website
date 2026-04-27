import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { About } from "@/components/sections/About";
import { Speaking } from "@/components/sections/Speaking";
import { Certifications } from "@/components/sections/Certifications";
import { Reviews } from "@/components/sections/Reviews";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("eyebrow"),
    description: t("lead").slice(0, 160),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const ph = await getTranslations("PageHeaders.about");
  const nav = await getTranslations("Nav");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: nav("about") }]}
      />
      <About tone="light" />
      <Speaking tone="dark" />
      <Certifications tone="light" />
      <Reviews tone="dark" />
    </>
  );
}
