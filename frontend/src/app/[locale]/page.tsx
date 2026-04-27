import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Opportunities } from "@/components/sections/Opportunities";
import { Ventures } from "@/components/sections/Ventures";
import { Projects } from "@/components/sections/Projects";
import { Clients } from "@/components/sections/Clients";
import { Reviews } from "@/components/sections/Reviews";
import { Newsletter } from "@/components/sections/Newsletter";

/**
 * Home is a landing page with teasers — each section has a "View All →"
 * button to its dedicated /about, /ventures, /projects etc. page.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <div id="below-hero" />
      <About tone="light" compact />
      <Ventures tone="dark" compact limit={3} />
      <Opportunities tone="light" />
      <Projects tone="dark" compact limit={6} />
      <Clients tone="light" />
      <Reviews tone="dark" />
      <Newsletter tone="light" />
    </>
  );
}
