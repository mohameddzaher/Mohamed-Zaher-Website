/**
 * Comprehensive idempotent seed.
 *   npm run seed
 *
 * Creates / upserts:
 *   - Admin user (mohamedzaher.dev@gmail.com)
 *   - 3 demo clients (Ahmed Alshehri, Sarah Al-Mansoori, Omar Khaled)
 *   - Ventures, Skills, Certifications, Testimonials, Experience
 *   - Projects (24 real portfolio projects)
 *   - News posts (3 samples)
 *   - Site settings
 *   - Sample client projects, invoices, payments, files for each demo client
 */

import "dotenv/config";
import mongoose from "mongoose";
import { env } from "../config/env";
import { connectDB } from "../config/db";
import { User, hashPassword } from "../models/User";
import {
  Experience,
  Venture,
  Skill,
  Certification,
  Testimonial,
  SiteSettings,
  NewsPost,
  ClientProject,
  Invoice,
  Payment,
  FileAsset,
} from "../models";
import { Project } from "../models/Project";
import { logger } from "../utils/logger";

/* --------- Demo clients ---------- */
const DEMO_CLIENTS = [
  {
    name: "Ahmed Alshehri",
    email: "client1@demo.com",
    password: "Client01@Demo#2026",
    company: "Alshehri Group",
    phone: "+966 50 000 0001",
  },
  {
    name: "Sarah Al-Mansoori",
    email: "client2@demo.com",
    password: "Client02@Demo#2026",
    company: "Mansoori Ventures",
    phone: "+971 50 000 0002",
  },
  {
    name: "Omar Khaled",
    email: "client3@demo.com",
    password: "Client03@Demo#2026",
    company: "Khaled Trading",
    phone: "+20 100 000 0003",
  },
] as const;

/* --------- Portfolio ventures ---------- */
const VENTURES = [
  {
    slug: "ets",
    name: "ETS — Energize Tech Solutions",
    role: "CTO & Board Member",
    description: {
      en: "Saudi-based tech firm delivering custom enterprise platforms, e-commerce systems, and digital transformation across KSA.",
      ar: "شركة تقنية سعودية تقدم منصات للشركات وأنظمة تجارة إلكترونية.",
    },
    url: "https://ets-ksa.com",
    category: "Tech",
    accent: "brand",
    order: 0,
  },
  {
    slug: "tapix",
    name: "Tapix Electronics",
    role: "Founder",
    description: {
      en: "Consumer electronics brand bringing curated tech to the GCC. Sourcing, branding, e-commerce, fulfillment — owned end-to-end.",
      ar: "علامة إلكترونيات استهلاكية للخليج — من المصدر إلى العميل.",
    },
    url: "https://tapix-sa.com",
    category: "E-Commerce",
    accent: "violet",
    order: 1,
  },
  {
    slug: "gulf-trend",
    name: "Gulf Trend",
    role: "BD Manager & Consultant",
    description: {
      en: "Business development consultancy for regional brands on market entry, growth, and partnerships across MENA and GCC.",
      ar: "استشارات تطوير أعمال ودخول أسواق الخليج.",
    },
    url: "https://gulf-trend.com",
    category: "Consulting",
    accent: "brand",
    order: 2,
  },
  {
    slug: "dida-silver",
    name: "Dida Silver",
    role: "Founder",
    description: {
      en: "Silver accessories label out of Egypt. Vertically integrated — design, production, and DTC commerce.",
      ar: "علامة إكسسوارات فضية من مصر بسلسلة توريد متكاملة.",
    },
    category: "Founded",
    accent: "violet",
    order: 3,
  },
  {
    slug: "energize-logistics",
    name: "Energize Logistics",
    role: "Software Engineer & BD Account Manager",
    description: {
      en: "Logistics platform serving GCC accounts — partnerships include Amazon Prime, DHL, Keeta, HungerStation, Ninja.",
      ar: "منصة لوجستيات تخدم حسابات الخليج، بشراكات عالمية.",
    },
    url: "https://energize-logistics.com",
    category: "Logistics",
    accent: "brand",
    order: 4,
  },
];

/* --------- Portfolio projects ---------- */
const PORTFOLIO_PROJECTS: {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  category: "web" | "ecommerce" | "business" | "realestate" | "edtech";
  github?: string;
  featured?: boolean;
}[] = [
  { slug: "meylor", title: "Meylor", description: "Multi-brand marketplace with localized storefronts (EN/AR), gallery, news, admin.", tech: ["Next.js", "TypeScript", "Tailwind", "i18n"], category: "ecommerce", github: "https://github.com/mohameddzaher/Meylor", featured: true },
  { slug: "last-piece", title: "Last Piece", description: "E-commerce platform for limited-drop fashion — inventory, checkout, admin.", tech: ["Next.js", "Node.js", "MongoDB"], category: "ecommerce", github: "https://github.com/mohameddzaher/last-Piece-e-commerce" },
  { slug: "energize-logistics", title: "Energize Logistics Portal", description: "Logistics operations and partner-facing portal for Energize Logistics group.", tech: ["Next.js", "Express", "MongoDB", "Socket.io"], category: "business", github: "https://github.com/mohameddzaher/energize-logistics", featured: true },
  { slug: "kit-factory", title: "Kit Factory", description: "Manufacturing kit configurator and order management.", tech: ["React", "Node.js"], category: "business", github: "https://github.com/mohameddzaher/Kit-Factory" },
  { slug: "mitsubishi-system", title: "Mitsubishi System", description: "Internal ERP-style system for Mitsubishi-related operations.", tech: ["Next.js", "Prisma", "PostgreSQL"], category: "business", github: "https://github.com/mohameddzaher/Mitsubishi-System" },
  { slug: "energize-future", title: "Energize Future", description: "Corporate site for Energize Future — solar & sustainable energy.", tech: ["Next.js", "Tailwind"], category: "web", github: "https://github.com/mohameddzaher/energize-future" },
  { slug: "joyride", title: "Joyride", description: "Ride-hailing & lifestyle platform — full frontend and backend stacks.", tech: ["Next.js", "Express", "MongoDB"], category: "web", github: "https://github.com/mohameddzaher/Joyride-frontend", featured: true },
  { slug: "telal-real-estate", title: "Telal Real Estate", description: "Real estate marketplace with listings, search, and inquiry funnel.", tech: ["Next.js", "Node.js", "MongoDB"], category: "realestate", github: "https://github.com/mohameddzaher/Telal-Real-estate" },
  { slug: "tapix", title: "Tapix Storefront", description: "Tapix Electronics commerce platform — storefront + admin + inventory.", tech: ["Next.js", "Express", "MongoDB"], category: "ecommerce", github: "https://github.com/mohameddzaher/Tapix-frontend", featured: true },
  { slug: "ets", title: "ETS Corporate Site", description: "ETS marketing & services site, multilingual.", tech: ["Next.js", "Tailwind"], category: "web", github: "https://github.com/mohameddzaher/ETS" },
  { slug: "little-leaders", title: "Little Leaders", description: "Children's education platform — class management + parent portal.", tech: ["React", "Node.js"], category: "edtech", github: "https://github.com/mohameddzaher/little-leaders" },
  { slug: "energize-design", title: "Energize Design", description: "Design studio portfolio.", tech: ["Next.js", "Tailwind"], category: "web", github: "https://github.com/mohameddzaher/Energize-design" },
  { slug: "energize-global", title: "Energize Global", description: "Holding company platform.", tech: ["Next.js"], category: "web", github: "https://github.com/mohameddzaher/Energize-Global" },
  { slug: "e-marketing", title: "E-Marketing", description: "Marketing agency platform.", tech: ["Next.js"], category: "web", github: "https://github.com/mohameddzaher/E-Marketing" },
  { slug: "energize-events", title: "Energize Events", description: "Events agency site & booking workflow.", tech: ["Next.js"], category: "business", github: "https://github.com/mohameddzaher/Energize-Events" },
  { slug: "primo-shops", title: "Primo Shops", description: "Retail e-commerce with multi-vendor architecture.", tech: ["MERN"], category: "ecommerce", github: "https://github.com/mohameddzaher/Primo-shops" },
  { slug: "macalloria", title: "MacAlloria", description: "Fashion brand storefront.", tech: ["Next.js"], category: "ecommerce", github: "https://github.com/mohameddzaher/MacAlloria" },
  { slug: "royal-med", title: "Royal Med", description: "Medical service platform — appointments + patient portal.", tech: ["MERN"], category: "business", github: "https://github.com/mohameddzaher/royal-med" },
  { slug: "trans-expert", title: "Trans Expert", description: "Logistics & translation services portal.", tech: ["Next.js"], category: "business", github: "https://github.com/mohameddzaher/Trans-Expert" },
  { slug: "outfit", title: "OUTFIT", description: "Fashion lookbook and storefront.", tech: ["React"], category: "ecommerce", github: "https://github.com/mohameddzaher/OUTFIT" },
  { slug: "ezraa-app", title: "Ezraa App & Website", description: "Graduation project — Ezraa platform. Achieved A+ at MTI.", tech: ["MERN", "React Native"], category: "edtech", github: "https://github.com/mohameddzaher/Ezraa-app", featured: true },
  { slug: "bank-system", title: "Bank System", description: "Banking simulation — accounts, transactions, admin.", tech: ["C++", "OOP"], category: "business", github: "https://github.com/mohameddzaher/Bank-System" },
  { slug: "retetive-website", title: "Retetive Website", description: "Brand site for Retetive.", tech: ["HTML", "CSS", "JS"], category: "web", github: "https://github.com/mohameddzaher/ReteTive-Website" },
  { slug: "simpson-draw", title: "Simpson Draw", description: "Creative drawing tool.", tech: ["JS", "Canvas"], category: "web", github: "https://github.com/mohameddzaher/Simpson-Draw" },
];

/* --------- Experience ---------- */
const EXPERIENCE_ENTRIES = [
  { company: "ETS — Energize Tech Solutions", role: "CTO & Board Member", start: "Jan 2026", end: "Present", achievements: ["Setting technical strategy across product, infra, and engineering hiring.", "Leading delivery of multiple enterprise platforms.", "Architecting the SaaS roadmap for ETS tooling."], order: 0 },
  { company: "Tapix Electronics", role: "Founder", start: "2024", end: "Present", achievements: ["Built the brand from concept to revenue.", "Owns full P&L: sourcing, branding, e-commerce, fulfillment."], order: 1 },
  { company: "Gulf Trend", role: "BD Manager & Consultant", start: "2024", end: "Present", achievements: ["Driving market-entry and partnership strategies.", "Closed multi-year accounts with Tier-1 GCC players."], order: 2 },
  { company: "Energize Logistics", role: "Software Engineer & BD Account Manager", start: "Jun 2025", end: "Present", achievements: ["Engineering internal logistics tooling and partner portals.", "Managing key accounts: Amazon Prime, DHL, Keeta, HungerStation, Ninja."], order: 3 },
  { company: "Cairo Coding School", role: "Software Engineering Instructor", start: "Dec 2024", end: "Present", achievements: ["Teaching full-stack JavaScript and backend fundamentals.", "Mentoring cohorts to job-ready level."], order: 4 },
  { company: "Upwork", role: "Full-Stack Engineer (Freelance)", start: "Oct 2024", end: "Present", achievements: ["Top-rated profile delivering Next.js, MERN, and SaaS builds."], order: 5 },
  { company: "Dida Silver", role: "Founder", start: "2023", end: "Present", achievements: ["Founded silver accessories label in Egypt.", "Direct-to-consumer ops with online + retail."], order: 6 },
  { company: "VIP Education Center", role: "Web Development Instructor", start: "Nov 2024", end: "Jun 2025", achievements: ["Designed and delivered a full web development curriculum."], order: 7 },
  { company: "DocTabs", role: "Software Engineer & BD", start: "Mar 2024", end: "Dec 2024", achievements: ["Hybrid role: built features, closed accounts."], order: 8 },
  { company: "Vestiti-EG", role: "Branch Manager", start: "Feb 2022", end: "Dec 2023", achievements: ["Ran a retail branch end-to-end."], order: 9 },
  { company: "Amer Group", role: "Real Estate Sales Representative", start: "Mar 2021", end: "Jan 2022", achievements: ["Closed unit sales across Amer Group developments."], order: 10 },
  { company: "Scolarz Courses Academy", role: "Sales Specialist", start: "Feb 2020", end: "Jan 2021", achievements: ["Drove course enrollments through consultative selling."], order: 11 },
  { company: "GDSC — MTI", role: "Software Instructor", start: "Oct 2021", end: "Jan 2023", achievements: ["Taught web fundamentals within Google Developer Student Club."], order: 12 },
];

/* --------- Main ---------- */
async function seed() {
  await connectDB();
  logger.info("Seeding…");

  /* Admin */
  const adminEmail = env.SEED_ADMIN_EMAIL.toLowerCase();
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: env.SEED_ADMIN_NAME,
      email: adminEmail,
      passwordHash: await hashPassword(env.SEED_ADMIN_PASSWORD),
      role: "admin",
    });
    logger.info(`✓ Admin created: ${adminEmail}`);
  } else {
    // Rotate password on each seed run so new credentials take effect
    admin.passwordHash = await hashPassword(env.SEED_ADMIN_PASSWORD);
    admin.name = env.SEED_ADMIN_NAME;
    admin.role = "admin";
    await admin.save();
    logger.info(`✓ Admin password rotated: ${adminEmail}`);
  }

  /* Demo clients */
  for (const c of DEMO_CLIENTS) {
    let client = await User.findOne({ email: c.email.toLowerCase() });
    if (!client) {
      client = await User.create({
        name: c.name,
        email: c.email.toLowerCase(),
        passwordHash: await hashPassword(c.password),
        phone: c.phone,
        company: c.company,
        role: "client",
      });
      logger.info(`✓ Client created: ${c.email}`);
    } else {
      client.passwordHash = await hashPassword(c.password);
      client.name = c.name;
      client.company = c.company;
      client.phone = c.phone;
      await client.save();
      logger.info(`✓ Client password rotated: ${c.email}`);
    }

    /* Sample client projects */
    const existingProjects = await ClientProject.countDocuments({ client: client.id });
    if (existingProjects === 0) {
      await ClientProject.create([
        {
          client: client.id,
          title: `${c.company} — Core Platform`,
          description: "Next.js + Node.js platform with admin dashboard and client portal.",
          status: "in-progress",
          progress: 65,
          milestones: [
            { title: "Discovery & design", completed: true, completedAt: new Date() },
            { title: "Auth & core schema", completed: true, completedAt: new Date() },
            { title: "Admin dashboard", completed: false },
            { title: "Client portal", completed: false },
          ],
        },
        {
          client: client.id,
          title: `${c.company} — Landing`,
          description: "Marketing site with CMS-driven content.",
          status: "delivered",
          progress: 100,
        },
      ]);
    }

    /* Sample invoices */
    const invoiceCount = await Invoice.countDocuments({ client: client.id });
    if (invoiceCount === 0) {
      const inv1 = await Invoice.create({
        client: client.id,
        number: `INV-${Date.now().toString(36).toUpperCase()}-${c.email.slice(0, 3).toUpperCase()}1`,
        total: 12000,
        paid: 6000,
        currency: "USD",
        status: "partial",
        issueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        items: [{ description: "Platform development", quantity: 1, unitPrice: 12000 }],
      });
      await Payment.create({
        invoice: inv1.id,
        client: client.id,
        amount: 6000,
        method: "bank-transfer",
        reference: "WIRE-001",
      });

      await Invoice.create({
        client: client.id,
        number: `INV-${Date.now().toString(36).toUpperCase()}-${c.email.slice(0, 3).toUpperCase()}2`,
        total: 4500,
        paid: 4500,
        currency: "USD",
        status: "paid",
        issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        items: [{ description: "Landing page + CMS", quantity: 1, unitPrice: 4500 }],
      });
    }

    /* Sample file (URL points to a Cloudinary-ish placeholder) */
    const fileCount = await FileAsset.countDocuments({ owner: client.id });
    if (fileCount === 0) {
      await FileAsset.create({
        owner: client.id,
        name: "Project Kickoff - Discovery Notes.pdf",
        url: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
        mimeType: "application/pdf",
        size: 124_000,
        visibility: "client",
        uploadedBy: admin.id,
      });
    }
  }

  /* Ventures */
  for (const v of VENTURES) {
    await Venture.findOneAndUpdate({ slug: v.slug }, v, { upsert: true });
  }
  logger.info(`✓ Ventures: ${VENTURES.length}`);

  /* Experience */
  for (const e of EXPERIENCE_ENTRIES) {
    await Experience.findOneAndUpdate(
      { company: e.company, role: e.role, start: e.start },
      e,
      { upsert: true },
    );
  }
  logger.info(`✓ Experience entries: ${EXPERIENCE_ENTRIES.length}`);

  /* Projects */
  for (const [i, p] of PORTFOLIO_PROJECTS.entries()) {
    await Project.findOneAndUpdate(
      { slug: p.slug },
      {
        slug: p.slug,
        title: { en: p.title, ar: p.title },
        description: { en: p.description, ar: p.description },
        tech: p.tech,
        category: p.category,
        featured: p.featured ?? false,
        githubUrl: p.github,
        order: i,
        publishedAt: new Date(),
      },
      { upsert: true },
    );
  }
  logger.info(`✓ Projects: ${PORTFOLIO_PROJECTS.length}`);

  /* Skills */
  const skills = [
    { name: "React / Next.js", category: "engineering", level: 95, order: 0 },
    { name: "TypeScript", category: "engineering", level: 92, order: 1 },
    { name: "Node.js / Express", category: "engineering", level: 90, order: 2 },
    { name: "MongoDB", category: "engineering", level: 88, order: 3 },
    { name: "Three.js / WebGL", category: "engineering", level: 78, order: 4 },
    { name: "MERN Stack", category: "engineering", level: 95, order: 5 },
    { name: "Business Development", category: "business", level: 95, order: 0 },
    { name: "Strategy & Market Research", category: "business", level: 90, order: 1 },
    { name: "Account Management", category: "business", level: 92, order: 2 },
    { name: "Logistics & Supply Chain", category: "business", level: 85, order: 3 },
    { name: "B2B / B2C Partnerships", category: "business", level: 90, order: 4 },
    { name: "Team Building", category: "leadership", level: 92, order: 0 },
    { name: "Public Speaking", category: "leadership", level: 88, order: 1 },
    { name: "Mentoring & Teaching", category: "leadership", level: 90, order: 2 },
  ];
  for (const s of skills) {
    await Skill.findOneAndUpdate({ name: s.name, category: s.category }, s, { upsert: true });
  }
  logger.info(`✓ Skills: ${skills.length}`);

  /* Certifications */
  const certs = [
    { name: "Frontend Development Training", issuer: "Senior Academy", order: 0 },
    { name: "Full-Stack Bootcamp", issuer: "Index Academy", order: 1 },
    { name: "MBA Program", issuer: "Ehab Mesallum", order: 2 },
    { name: "AI for Business", issuer: "Multiple programs", order: 3 },
    { name: "Modern Web Development", issuer: "Tech programs", order: 4 },
    { name: "Business Strategy & BD", issuer: "Specialized courses", order: 5 },
  ];
  for (const c of certs) {
    await Certification.findOneAndUpdate({ name: c.name }, c, { upsert: true });
  }
  logger.info(`✓ Certifications: ${certs.length}`);

  /* Testimonials */
  const testimonials = [
    {
      name: "Ahmed Fouad",
      role: "Graphic Designer",
      company: "Budget Digital Marketing",
      quote: {
        en: "Mohamed delivers — he combines genuine engineering depth with the rare ability to talk business and design fluently. Every project he touched moved faster.",
        ar: "محمد يسلّم — عمق هندسي مع طلاقة في الأعمال والتصميم. كل مشروع تحرك أسرع.",
      },
      order: 0,
    },
    {
      name: "Refaat Elghandour",
      role: "Professional Photographer",
      company: "",
      quote: {
        en: "One of those people who actually ships. Calm under pressure, sharp on details, and treats every client like a partner.",
        ar: "من النوع اللي بيسلّم فعلاً. هادئ تحت الضغط، دقيق في التفاصيل، ويعامل كل عميل كشريك.",
      },
      order: 1,
    },
  ];
  for (const t of testimonials) {
    await Testimonial.findOneAndUpdate({ name: t.name }, t, { upsert: true });
  }
  logger.info(`✓ Testimonials: ${testimonials.length}`);

  /* News posts */
  const posts = [
    {
      slug: "building-for-the-gcc",
      title: { en: "Building for the GCC market", ar: "البناء لسوق الخليج" },
      excerpt: {
        en: "What I've learned operating across KSA, UAE, and Egypt on the commerce and logistics stack.",
        ar: "ملاحظات من العمل بين السعودية والإمارات ومصر.",
      },
      content: {
        en: "Three things stand out after a year of operating in the region: 1) infrastructure is much better than Western narratives suggest; 2) partnerships compound fast; 3) trust moves slowly but locks in deeply when you earn it.\n\nMore details on each soon.",
        ar: "ثلاث ملاحظات...",
      },
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "engineer-vs-operator",
      title: { en: "Engineer vs Operator — and why I picked both", ar: "المهندس في مقابل المشغّل" },
      excerpt: {
        en: "Short notes on holding the technical and commercial sides of a venture at the same time.",
        ar: "ملاحظات قصيرة عن الجمع بين الهندسة والتشغيل.",
      },
      content: {
        en: "Every time I've tried to pick one, the company suffers. The founders who scale fastest, in my observation, are the ones comfortable switching between 'why is this build failing' and 'why is this deal not closing' in the same day.",
        ar: "...",
      },
      published: true,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
    {
      slug: "what-im-building",
      title: { en: "What I'm building in 2026", ar: "ما أبنيه في ٢٠٢٦" },
      excerpt: {
        en: "A quick update on the ventures currently consuming my time and what I'm looking for.",
        ar: "تحديث سريع عن المشاريع الحالية.",
      },
      content: {
        en: "ETS is the biggest time sink — we're shipping three enterprise platforms concurrently. Tapix is in the scaling phase. Dida is stable and profitable. Gulf Trend is brokering two new partnerships. If any of these resonate, reach out.",
        ar: "...",
      },
      published: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];
  for (const p of posts) {
    await NewsPost.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
  }
  logger.info(`✓ News posts: ${posts.length}`);

  /* Site settings singleton */
  await SiteSettings.findOneAndUpdate(
    { key: "default" },
    {
      key: "default",
      contact: {
        email: "mohamedzaher.dev@gmail.com",
        phone: "+966 53 848 6109",
        location: "Available worldwide",
      },
      socials: {
        linkedin: "https://www.linkedin.com/in/mohameddzaher/",
        github: "https://github.com/mohameddzaher",
        instagram: "https://www.instagram.com/mohamedd.zaher",
        x: "https://x.com/mohameddzaher",
        facebook: "https://www.facebook.com/Mohamedzaherrr",
        whatsapp: "https://wa.me/966538486109",
      },
      seo: {
        defaultTitle: "Mohamed Zaher — Entrepreneur • Software Engineer • CTO",
        defaultDescription:
          "Tech entrepreneur and full-stack engineer. Open for investment, partnerships, and consulting.",
      },
      nowBuilding: "Tapix Storefront v2",
    },
    { upsert: true, new: true },
  );
  logger.info("✓ Site settings");

  logger.info("🎉 Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  logger.error(err);
  process.exit(1);
});
