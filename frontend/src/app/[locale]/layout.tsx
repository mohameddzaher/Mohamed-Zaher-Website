import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "../providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { PageLoader } from "@/components/layout/PageLoader";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { ConsoleSignature } from "@/components/layout/ConsoleSignature";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <Providers>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div dir={dir} className="font-body">
          <PageLoader />
          <ScrollProgress />
          <CommandPalette />
          <ConsoleSignature />
          <Header />
          <main className="relative z-10">{children}</main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </Providers>
  );
}
