import { setRequestLocale } from "next-intl/server";
import { ClientShell } from "@/components/client/ClientShell";

export default async function ClientPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ClientShell>{children}</ClientShell>;
}
