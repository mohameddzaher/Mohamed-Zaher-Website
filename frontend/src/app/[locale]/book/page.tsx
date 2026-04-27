import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { BookMeeting } from "@/components/sections/BookMeeting";
import { PageHeader } from "@/components/layout/PageHeader";
import { GradientTitle } from "@/components/ui/GradientTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Booking" });
  return { title: t("eyebrow"), description: t("description") };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Booking");
  const ph = await getTranslations("PageHeaders.book");

  return (
    <>
      <PageHeader
        tone="dark"
        eyebrow={t("eyebrow")}
        title={<GradientTitle raw={ph("title")} />}
        description={ph("description")}
        crumbs={[{ label: t("eyebrow") }]}
      />
      <BookMeeting tone="light" />
    </>
  );
}
