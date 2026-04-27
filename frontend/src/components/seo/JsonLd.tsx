import { SITE } from "@/lib/site";

export function JsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.fullName,
    alternateName: "Mohamed Zaher",
    url: SITE.url,
    image: `${SITE.url}/api/og`,
    email: SITE.email,
    telephone: SITE.phone,
    jobTitle: "Entrepreneur · Software Engineer · CTO",
    worksFor: [
      { "@type": "Organization", name: "ETS — Energize Tech Solutions" },
      { "@type": "Organization", name: "Tapix Electronics" },
    ],
    sameAs: [
      SITE.socials.linkedin,
      SITE.socials.github,
      SITE.socials.instagram,
      SITE.socials.x,
      SITE.socials.facebook,
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["en", "ar"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
