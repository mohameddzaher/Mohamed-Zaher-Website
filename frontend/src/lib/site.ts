/**
 * Static site configuration.
 * Most fields can be overridden via admin Settings; these are defaults & fallbacks.
 */

export const SITE = {
  name: "Mohamed Zaher",
  fullName: "Mohamed Zaher Eldeeb",
  title: "Mohamed Zaher — Entrepreneur • Software Engineer • CTO",
  description:
    "Tech entrepreneur and full-stack engineer actively building across SaaS, e-commerce, and logistics. Open for investment opportunities, strategic partnerships, and consulting engagements.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "mohamedzaher.dev@gmail.com",
  phone: "+966 53 848 6109",
  availability: "Available worldwide",
  university: "MTI",
  dob: "01/12/1999",
  profileImage: "/images/mohamed-zaher.png",
  socials: {
    linkedin: "https://www.linkedin.com/in/mohameddzaher/",
    instagram: "https://www.instagram.com/mohamedd.zaher",
    github: "https://github.com/mohameddzaher",
    x: "https://x.com/mohameddzaher",
    snapchat: "https://snapchat.com/t/k4gscTiR",
    facebook: "https://www.facebook.com/Mohamedzaherrr",
    whatsapp: "https://wa.me/966538486109",
  },
  stats: {
    projects: 30,
    yearsExperience: 7,
    companies: 4,
    clients: 100,
    linkedinFollowers: 9745,
    freelanceYears: 1.7,
  },
} as const;

export const NAV_LINKS = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "ventures", href: "/ventures" },
  { key: "projects", href: "/projects" },
  { key: "experience", href: "/experience" },
  { key: "insights", href: "/insights" },
  { key: "book", href: "/book" },
  { key: "contact", href: "/contact" },
] as const;
