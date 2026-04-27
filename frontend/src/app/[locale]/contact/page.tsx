import { Suspense } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Contact } from "@/components/sections/Contact";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("eyebrow"), description: t("description") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");
  const ph = await getTranslations("PageHeaders.contact");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: t("eyebrow") }]}
      />
      <Suspense fallback={<div className="container-x py-14 md:py-16"><div className="h-80 panel rounded-xl shimmer" /></div>}>
        <Contact tone="light" />
      </Suspense>
    </>
  );
}
