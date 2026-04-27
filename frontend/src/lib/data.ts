/**
 * Default content. Admin panel writes override these via API in prod.
 * Every customer-facing string carries `en` + `ar` so Arabic toggle truly translates everything.
 *
 * Use `t(value, locale)` from "@/lib/i18nText" to render either side.
 */

export type Bilingual = { en: string; ar: string };

export type Venture = {
  slug: string;
  name: Bilingual;
  role: Bilingual;
  description: Bilingual;
  url?: string;
  category: "Tech" | "E-Commerce" | "Logistics" | "Consulting" | "Founded";
  accent: "brand" | "violet";
};

export const VENTURES: Venture[] = [
  {
    slug: "ets",
    name: {
      en: "ETS — Energize Tech Solutions",
      ar: "ETS — انرجايز تك سوليوشنز",
    },
    role: {
      en: "CTO & Board Member",
      ar: "رئيس قسم التقنية وعضو مجلس الإدارة",
    },
    description: {
      en: "Saudi-based tech firm delivering custom enterprise platforms, e-commerce systems, and digital transformation for regional businesses.",
      ar: "شركة تقنية سعودية تقدّم منصات للشركات وحلول تجارة إلكترونية ومشاريع تحول رقمي للأعمال الإقليمية.",
    },
    url: "https://ets-ksa.com",
    category: "Tech",
    accent: "brand",
  },
  {
    slug: "tapix",
    name: {
      en: "Tapix Electronics",
      ar: "تابكس إلكترونيكس",
    },
    role: { en: "Founder", ar: "مؤسس" },
    description: {
      en: "Consumer electronics brand bringing curated tech to the GCC market. Owns the entire stack — sourcing, branding, e-commerce, fulfillment, and customer experience.",
      ar: "علامة إلكترونيات استهلاكية تقدّم منتجات منتقاة لسوق الخليج. ندير كل المراحل — التوريد، الهوية، التجارة الإلكترونية، التشغيل، وتجربة العميل.",
    },
    url: "https://tapix-sa.com",
    category: "E-Commerce",
    accent: "violet",
  },
  {
    slug: "gulf-trend",
    name: { en: "Gulf Trend", ar: "جلف تريند" },
    role: {
      en: "BD Manager & Consultant",
      ar: "مدير تطوير الأعمال ومستشار",
    },
    description: {
      en: "Business development consultancy serving regional brands on market entry, growth strategy, and partnership development across the GCC.",
      ar: "استشارات تطوير أعمال للعلامات الإقليمية في دخول الأسواق ووضع الاستراتيجية وبناء الشراكات في الخليج.",
    },
    url: "https://gulf-trend.com",
    category: "Consulting",
    accent: "brand",
  },
  {
    slug: "dida-silver",
    name: { en: "Dida Silver", ar: "ديدا سيلفر" },
    role: { en: "Founder", ar: "مؤسس" },
    description: {
      en: "Silver accessories label out of Egypt. Vertically integrated — design, production, and direct-to-consumer commerce.",
      ar: "علامة إكسسوارات فضية من مصر بسلسلة توريد متكاملة — التصميم والإنتاج والبيع المباشر للمستهلك.",
    },
    category: "Founded",
    accent: "violet",
  },
  {
    slug: "energize-logistics",
    name: { en: "Energize Logistics", ar: "انرجايز لوجيستكس" },
    role: {
      en: "Software Engineer & BD Account Manager",
      ar: "مهندس برمجيات ومدير حسابات تطوير الأعمال",
    },
    description: {
      en: "Logistics company serving GCC accounts with last-mile, freight, and customs clearance. Working with Amazon Prime, DHL, Keeta, HungerStation, Ninja, and NexTracker.",
      ar: "شركة لوجستيات تخدم حسابات الخليج في التوصيل والشحن والتخليص الجمركي، بشراكات مع Amazon Prime و DHL و Keeta و HungerStation و Ninja و NexTracker.",
    },
    url: "https://energize-logistics.com",
    category: "Logistics",
    accent: "brand",
  },
];

export type SkillTrack = {
  key: "engineering" | "business" | "leadership";
  skills: { name: Bilingual; level: number }[];
};

export const SKILL_TRACKS: SkillTrack[] = [
  {
    key: "engineering",
    skills: [
      { name: { en: "React / Next.js", ar: "React / Next.js" }, level: 95 },
      { name: { en: "TypeScript", ar: "TypeScript" }, level: 92 },
      { name: { en: "Node.js / Express", ar: "Node.js / Express" }, level: 90 },
      { name: { en: "MongoDB / Mongoose", ar: "MongoDB / Mongoose" }, level: 88 },
      { name: { en: "Three.js / WebGL", ar: "Three.js / WebGL" }, level: 78 },
      { name: { en: "MERN Stack", ar: "MERN Stack" }, level: 95 },
      { name: { en: "C++ / Python", ar: "C++ / Python" }, level: 70 },
      { name: { en: "Git / Docker", ar: "Git / Docker" }, level: 80 },
    ],
  },
  {
    key: "business",
    skills: [
      { name: { en: "Business Development", ar: "تطوير الأعمال" }, level: 95 },
      { name: { en: "Strategy & Market Research", ar: "الاستراتيجية وأبحاث السوق" }, level: 90 },
      { name: { en: "Account Management", ar: "إدارة الحسابات" }, level: 92 },
      { name: { en: "Marketing & Sales", ar: "التسويق والمبيعات" }, level: 88 },
      { name: { en: "Operations & Supply Chain", ar: "التشغيل وسلاسل الإمداد" }, level: 85 },
      { name: { en: "Customs & Logistics", ar: "اللوجستيات والتخليص الجمركي" }, level: 82 },
      { name: { en: "B2B / B2C Partnerships", ar: "شراكات B2B / B2C" }, level: 90 },
      { name: { en: "MBA Program (Ehab Mesallum)", ar: "MBA — برنامج إيهاب مسلم" }, level: 85 },
    ],
  },
  {
    key: "leadership",
    skills: [
      { name: { en: "Team Building", ar: "بناء الفِرَق" }, level: 92 },
      { name: { en: "Public Speaking", ar: "التحدث أمام الجمهور" }, level: 88 },
      { name: { en: "Mentoring & Teaching", ar: "الإرشاد والتدريس" }, level: 90 },
      { name: { en: "Decision Making", ar: "اتخاذ القرار" }, level: 90 },
      { name: { en: "Project Management", ar: "إدارة المشاريع" }, level: 88 },
      { name: { en: "Event Planning", ar: "تخطيط الفعاليات" }, level: 85 },
      { name: { en: "Cross-Functional Leadership", ar: "القيادة بين الأقسام" }, level: 92 },
    ],
  },
];

export type ExperienceEntry = {
  company: Bilingual;
  role: Bilingual;
  start: Bilingual;
  end: Bilingual;
  achievements: Bilingual[];
};

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: { en: "ETS — Energize Tech Solutions", ar: "ETS — انرجايز تك سوليوشنز" },
    role: { en: "CTO & Board Member", ar: "CTO وعضو مجلس إدارة" },
    start: { en: "Jan 2026", ar: "يناير ٢٠٢٦" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Setting the technical strategy across product, infrastructure, and engineering hiring.", ar: "وضع الاستراتيجية التقنية للمنتج والبنية التحتية والتوظيف الهندسي." },
      { en: "Leading delivery of multiple enterprise platforms for KSA-based clients.", ar: "قيادة تسليم عدة منصات للشركات لعملاء سعوديين." },
      { en: "Architecting the SaaS roadmap for ETS internal tooling and client deliverables.", ar: "تصميم خارطة طريق SaaS للأدوات الداخلية وعمل العملاء." },
    ],
  },
  {
    company: { en: "Tapix Electronics", ar: "تابكس إلكترونيكس" },
    role: { en: "Founder", ar: "مؤسس" },
    start: { en: "2024", ar: "٢٠٢٤" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Built the brand from concept to revenue in the GCC consumer electronics space.", ar: "بنيت العلامة من الفكرة إلى الإيرادات في سوق الإلكترونيات الخليجي." },
      { en: "Owns full P&L: sourcing, branding, e-commerce, ops, fulfillment.", ar: "إدارة كاملة: التوريد، الهوية، التجارة الإلكترونية، التشغيل، التوصيل." },
    ],
  },
  {
    company: { en: "Gulf Trend", ar: "جلف تريند" },
    role: { en: "BD Manager & Consultant", ar: "مدير تطوير أعمال ومستشار" },
    start: { en: "2024", ar: "٢٠٢٤" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Driving market-entry and partnership strategies for regional brands.", ar: "قيادة استراتيجيات دخول الأسواق والشراكات للعلامات الإقليمية." },
      { en: "Closed multi-year accounts including Tier-1 GCC players.", ar: "إغلاق صفقات متعددة السنوات مع لاعبين كبار في الخليج." },
    ],
  },
  {
    company: { en: "Energize Logistics", ar: "انرجايز لوجيستكس" },
    role: {
      en: "Account Manager — Business Development & Software Engineering",
      ar: "مدير حسابات — تطوير أعمال وهندسة برمجيات",
    },
    start: { en: "Jul 2025", ar: "يوليو ٢٠٢٥" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Primary Account Manager and strategic advisor for Tier-1 GCC partners — Amazon Prime, DHL, Keeta, HungerStation, Ninja, NexTracker.", ar: "مدير حسابات رئيسي ومستشار استراتيجي لشركاء الخليج: Amazon Prime, DHL, Keeta, HungerStation, Ninja, NexTracker." },
      { en: "Designed growth strategies, market research, and competitor analysis that informed positioning, pricing, and expansion decisions.", ar: "تصميم استراتيجيات نمو وأبحاث سوق وتحليل منافسين، أثرت على التموضع والتسعير وقرارات التوسع." },
      { en: "Pioneered client onboarding flows and account success metrics, increasing retention and satisfaction.", ar: "إعادة تصميم رحلة استقبال العملاء ومؤشرات نجاح الحسابات لرفع معدلات الاحتفاظ والرضا." },
      { en: "Delivered custom web/software solutions and technical architectures aligned to BD outcomes.", ar: "تسليم حلول ويب وبرمجيات وبنى تقنية مخصصة لخدمة مخرجات تطوير الأعمال." },
    ],
  },
  {
    company: { en: "Cairo Coding School", ar: "كايرو كودينج سكول" },
    role: { en: "Software Development Instructor (C++, OOP & Problem Solving)", ar: "مدرّب تطوير برمجيات (C++ و OOP وحل المشكلات)" },
    start: { en: "Jan 2025", ar: "يناير ٢٠٢٥" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Designed and deliver a full C++ curriculum — fundamentals, OOP, SOLID, algorithms, data structures, competitive programming.", ar: "تصميم وتدريس منهج كامل في C++ — الأساسيات، OOP، SOLID، الخوارزميات، هياكل البيانات، البرمجة التنافسية." },
      { en: "Methodology: live coding, peer code reviews, weekly 1:1 check-ins, LeetCode/HackerRank interview prep.", ar: "منهجية: live coding، مراجعات أكواد بين الزملاء، جلسات أسبوعية فردية، تحضير مقابلات على LeetCode/HackerRank." },
    ],
  },
  {
    company: { en: "Upwork", ar: "Upwork" },
    role: { en: "Full-Stack Engineer (Freelance)", ar: "مهندس Full-Stack (Freelance)" },
    start: { en: "Oct 2024", ar: "أكتوبر ٢٠٢٤" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Top-rated profile delivering Next.js, MERN, and SaaS builds for global clients.", ar: "Top-rated أسلّم منصات Next.js و MERN و SaaS لعملاء عالميين." },
    ],
  },
  {
    company: { en: "Dida Silver", ar: "ديدا سيلفر" },
    role: { en: "Founder", ar: "مؤسس" },
    start: { en: "2023", ar: "٢٠٢٣" },
    end: { en: "Present", ar: "حتى الآن" },
    achievements: [
      { en: "Founded silver accessories label in Egypt with vertically integrated supply chain.", ar: "تأسيس علامة إكسسوارات فضية في مصر بسلسلة توريد متكاملة." },
      { en: "Direct-to-consumer ops with online + retail distribution.", ar: "بيع مباشر للمستهلك عبر الإنترنت والمتاجر." },
    ],
  },
  {
    company: { en: "VIP Education Center", ar: "مركز VIP التعليمي" },
    role: { en: "Web Development Instructor", ar: "مدرّب تطوير ويب" },
    start: { en: "Nov 2024", ar: "نوفمبر ٢٠٢٤" },
    end: { en: "Jun 2025", ar: "يونيو ٢٠٢٥" },
    achievements: [
      { en: "Designed and delivered a full web development curriculum.", ar: "تصميم وتسليم منهج كامل في تطوير الويب." },
    ],
  },
  {
    company: { en: "OctCode", ar: "OctCode" },
    role: { en: "Software Engineer & Business Developer", ar: "مهندس برمجيات ومطوّر أعمال" },
    start: { en: "Jan 2024", ar: "يناير ٢٠٢٤" },
    end: { en: "Dec 2024", ar: "ديسمبر ٢٠٢٤" },
    achievements: [
      { en: "Drove sales and acquired new clients with custom software solutions — including DocTabs clinic management system.", ar: "قيادة المبيعات واكتساب عملاء جدد بحلول برمجية مخصصة — منها نظام DocTabs لإدارة العيادات." },
      { en: "Built marketing strategy, social presence, and digital advertising for the studio's full client portfolio.", ar: "بناء استراتيجية التسويق والحضور على السوشيال والإعلانات الرقمية لكامل محفظة العملاء." },
      { en: "Led software delivery from coding to deployment alongside running BD pipeline end-to-end.", ar: "قيادة تسليم البرمجيات من الكود حتى النشر بالتوازي مع إدارة قناة تطوير الأعمال." },
    ],
  },
  {
    company: { en: "Route", ar: "Route" },
    role: { en: "Software Engineer", ar: "مهندس برمجيات" },
    start: { en: "Jul 2022", ar: "يوليو ٢٠٢٢" },
    end: { en: "Mar 2023", ar: "مارس ٢٠٢٣" },
    achievements: [
      { en: "Hands-on experience in C++, OOP, data structures & algorithms, Agile, SOLID, and design patterns.", ar: "خبرة عملية في C++ و OOP وهياكل البيانات والخوارزميات و Agile و SOLID وأنماط التصميم." },
      { en: "Delivered Bank System graduation project with clean code practices.", ar: "تسليم مشروع التخرج Bank System بأفضل ممارسات الكود النظيف." },
    ],
  },
  {
    company: { en: "Vestiti-EG", ar: "فِستيتي مصر" },
    role: { en: "Branch Manager", ar: "مدير فرع" },
    start: { en: "Feb 2022", ar: "فبراير ٢٠٢٢" },
    end: { en: "Dec 2023", ar: "ديسمبر ٢٠٢٣" },
    achievements: [
      { en: "Ran a retail branch end-to-end: P&L, team, ops, customer experience.", ar: "إدارة فرع كامل: الأرباح، الفريق، التشغيل، تجربة العميل." },
    ],
  },
  {
    company: { en: "Amer Group", ar: "مجموعة عامر" },
    role: { en: "Real Estate Sales Representative", ar: "مندوب مبيعات عقارية" },
    start: { en: "Mar 2021", ar: "مارس ٢٠٢١" },
    end: { en: "Jan 2022", ar: "يناير ٢٠٢٢" },
    achievements: [
      { en: "Closed unit sales across Amer Group developments in Egypt.", ar: "بيع وحدات سكنية في مشاريع مجموعة عامر بمصر." },
    ],
  },
  {
    company: { en: "Scolarz Courses Academy", ar: "أكاديمية Scolarz" },
    role: { en: "Sales Specialist", ar: "أخصائي مبيعات" },
    start: { en: "Feb 2020", ar: "فبراير ٢٠٢٠" },
    end: { en: "Jan 2021", ar: "يناير ٢٠٢١" },
    achievements: [
      { en: "Drove course enrollments through outbound and consultative selling.", ar: "زيادة التسجيل في الدورات عبر البيع الخارجي والاستشاري." },
    ],
  },
  {
    company: { en: "GDSC — MTI", ar: "GDSC — جامعة MTI" },
    role: { en: "Software Instructor", ar: "مدرّب برمجة" },
    start: { en: "Oct 2021", ar: "أكتوبر ٢٠٢١" },
    end: { en: "Jan 2023", ar: "يناير ٢٠٢٣" },
    achievements: [
      { en: "Taught web fundamentals to university peers within Google Developer Student Club.", ar: "تدريس أساسيات الويب لزملاء الجامعة في Google Developer Student Club." },
    ],
  },
];

export type Project = {
  slug: string;
  title: Bilingual;
  description: Bilingual;
  category: "web" | "ecommerce" | "business" | "realestate" | "edtech";
  github?: string;
  demo?: string;
  featured?: boolean;
  /** Optional override — admin can paste any image URL */
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "meylor",
    title: { en: "Meylor", ar: "ميلور" },
    description: {
      en: "Multi-branch nursery & schools chain platform — admissions, classes, parents portal, and full operational backend.",
      ar: "منصة لسلسلة حضانات ومدارس متعددة الفروع — التقديم، الفصول، بوابة أولياء الأمور، والتشغيل الكامل خلف الكواليس.",
    },
    category: "edtech",
    github: "https://github.com/mohameddzaher/Meylor",
    featured: true,
  },
  {
    slug: "joyride",
    title: { en: "Joyride", ar: "جوي رايد" },
    description: {
      en: "Specialty brand store offering therapeutic and sensory toys for children with autism — curated catalog, parent guides, and direct-to-home delivery.",
      ar: "متجر متخصص في الألعاب العلاجية والحسية للأطفال ذوي التوحد — كتالوج منتقى، إرشادات لأولياء الأمور، وتوصيل مباشر للمنزل.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/Joyride-frontend",
    featured: true,
  },
  {
    slug: "tapix",
    title: { en: "Tapix Electronics", ar: "تابكس إلكترونيكس" },
    description: {
      en: "Consumer electronics commerce platform — storefront, inventory, and admin tooling for the GCC market.",
      ar: "منصة تجارة إلكترونيات استهلاكية — متجر وإدارة مخزون ولوحة تحكم لسوق الخليج.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/Tapix-frontend",
    featured: true,
  },
  {
    slug: "energize-logistics",
    title: { en: "Energize Logistics", ar: "انرجايز لوجيستكس" },
    description: {
      en: "Official corporate platform for Energize Logistics — fast, fully responsive, SEO-optimized, with a structured Node.js + MongoDB backend powering dynamic content. Serves Tier-1 GCC partners with operations and account-management portals.",
      ar: "المنصة الرسمية لـ Energize Logistics — سريعة ومتجاوبة بالكامل ومُحسَّنة لمحركات البحث، مع باك اند مبني على Node.js و MongoDB لإدارة المحتوى الديناميكي. تخدم كبار شركاء الخليج ببوابات تشغيل وإدارة حسابات.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/energize-logistics",
    demo: "https://energize-logistics.com",
    featured: true,
  },
  {
    slug: "last-piece",
    title: { en: "Last Piece", ar: "لاست بيس" },
    description: {
      en: "Limited-drop fashion e-commerce — inventory management, drop scheduling, and full checkout.",
      ar: "تجارة إلكترونية لأزياء بكميات محدودة — إدارة المخزون، جدولة الإطلاقات، ودفع كامل.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/last-Piece-e-commerce",
  },
  {
    slug: "kit-factory",
    title: { en: "Kit Factory", ar: "كيت فاكتوري" },
    description: {
      en: "Manufacturing kit configurator — order intake, customization workflow, and production hand-off.",
      ar: "منصة تجميع طلبات تصنيع — استقبال الطلبات، تخصيصها، وتسليمها للإنتاج.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/Kit-Factory",
  },
  {
    slug: "mitsubishi-system",
    title: { en: "Mitsubishi System", ar: "نظام ميتسوبيشي" },
    description: {
      en: "Internal ERP-style system for Mitsubishi-related operations across sales, inventory, and reporting.",
      ar: "نظام ERP داخلي لعمليات ميتسوبيشي — المبيعات والمخزون والتقارير.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/Mitsubishi-System",
  },
  {
    slug: "energize-future",
    title: { en: "Energize Future", ar: "انرجايز فيوتشر" },
    description: {
      en: "Solar and sustainable energy company platform — service catalogue and partner inquiries.",
      ar: "منصة شركة طاقة شمسية ومستدامة — كتالوج الخدمات واستفسارات الشركاء.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/energize-future",
  },
  {
    slug: "telal-real-estate",
    title: { en: "Telal Real Estate", ar: "تلال للعقارات" },
    description: {
      en: "Real estate marketplace — listings, advanced search, and inquiry pipeline straight to the sales team.",
      ar: "منصة عقارية — قوائم العقارات، بحث متقدم، وخط استفسارات يصل مباشرة لفريق المبيعات.",
    },
    category: "realestate",
    github: "https://github.com/mohameddzaher/Telal-Real-estate",
  },
  {
    slug: "ets",
    title: { en: "ETS Corporate Site", ar: "موقع ETS الرسمي" },
    description: {
      en: "Multilingual marketing and services site for ETS — service pages and lead capture.",
      ar: "موقع تسويقي وخدمي متعدد اللغات لـ ETS — صفحات الخدمات وجمع العملاء المحتملين.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/ETS",
  },
  {
    slug: "little-leaders",
    title: { en: "Little Leaders", ar: "ليتل ليدرز" },
    description: {
      en: "Children's education platform — class management and parent communications.",
      ar: "منصة تعليم أطفال — إدارة الفصول وتواصل أولياء الأمور.",
    },
    category: "edtech",
    github: "https://github.com/mohameddzaher/little-leaders",
  },
  {
    slug: "energize-design",
    title: { en: "Energize Design", ar: "انرجايز ديزاين" },
    description: {
      en: "Design studio portfolio — service showcase and project galleries.",
      ar: "بورتفوليو استوديو تصميم — عرض الخدمات وأعمال المشاريع.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/Energize-design",
  },
  {
    slug: "energize-global",
    title: { en: "Energize Global", ar: "انرجايز جلوبال" },
    description: {
      en: "Holding company corporate platform — group narrative, ventures, and investor relations.",
      ar: "منصة شركة قابضة — قصة المجموعة، الشركات، وعلاقات المستثمرين.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/Energize-Global",
  },
  {
    slug: "e-marketing",
    title: { en: "E-Marketing", ar: "إي ماركتنج" },
    description: {
      en: "Marketing agency platform — campaign showcase and lead capture funnel.",
      ar: "منصة وكالة تسويق — عرض الحملات ومسار جمع العملاء المحتملين.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/E-Marketing",
  },
  {
    slug: "energize-events",
    title: { en: "Energize Events", ar: "انرجايز إيفنتس" },
    description: {
      en: "Events agency site with venue showcase and booking workflow.",
      ar: "موقع وكالة فعاليات بعرض القاعات ومسار الحجز.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/Energize-Events",
  },
  {
    slug: "primo-shops",
    title: { en: "Primo Shops", ar: "بريمو شوبس" },
    description: {
      en: "Multi-vendor retail e-commerce — vendor onboarding, storefronts, and unified checkout.",
      ar: "تجارة إلكترونية متعددة الباعة — إدخال البائعين ومتاجرهم ودفع موحّد.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/Primo-shops",
  },
  {
    slug: "macalloria",
    title: { en: "MacAlloria", ar: "ماك ألوريا" },
    description: {
      en: "Fashion brand storefront with collection drops and brand story.",
      ar: "متجر علامة أزياء مع إصدارات مجموعات وقصة العلامة.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/MacAlloria",
  },
  {
    slug: "royal-med",
    title: { en: "Royal Med", ar: "رويال ميد" },
    description: {
      en: "Education platform empowering healthcare professionals and students with accredited medical courses, expert-led video lectures, quizzes, certifications, and personalized learning paths. Mission: bridge the medical-education gap globally.",
      ar: "منصة تعليمية لمهنيي وطلاب الرعاية الصحية بدورات طبية معتمدة ومحاضرات فيديو بإشراف خبراء واختبارات وشهادات ومسارات تعلم مخصصة. الهدف: تقليل الفجوة في التعليم الطبي عالمياً.",
    },
    category: "edtech",
    github: "https://github.com/mohameddzaher/royal-med",
    featured: true,
  },
  {
    slug: "doctabs",
    title: { en: "DocTabs — Clinic Management", ar: "DocTabs — إدارة العيادات" },
    description: {
      en: "Comprehensive clinic and medical-institution management system — patient records, appointments, staff, and operations. Built end-to-end with administration and business growth in mind.",
      ar: "نظام شامل لإدارة العيادات والمؤسسات الطبية — السجلات الطبية والمواعيد والكوادر والتشغيل. مبني بنظرة كاملة على الإدارة ونمو الأعمال.",
    },
    category: "business",
    featured: true,
  },
  {
    slug: "trans-expert",
    title: { en: "Trans Expert", ar: "ترانس إكسبرت" },
    description: {
      en: "Logistics and translation services portal — quote request and account management.",
      ar: "بوابة خدمات لوجستية وترجمة — طلب عروض الأسعار وإدارة الحسابات.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/Trans-Expert",
  },
  {
    slug: "outfit",
    title: { en: "OUTFIT", ar: "OUTFIT" },
    description: {
      en: "Responsive e-commerce experience — product catalogue, optimised desktop & mobile UX. Currently being upgraded to a full-stack MERN platform with auth, product management, and secure payments.",
      ar: "تجربة تجارة إلكترونية متجاوبة — كتالوج منتجات وتجربة محسّنة على الديسكتوب والموبايل. يجري ترقيتها حالياً إلى منصة Full-Stack بالـ MERN مع تسجيل دخول وإدارة منتجات ومدفوعات آمنة.",
    },
    category: "ecommerce",
    github: "https://github.com/mohameddzaher/OUTFIT",
  },
  {
    slug: "ezraa-app",
    title: { en: "Ezraa App & Website", ar: "تطبيق وموقع ازرع" },
    description: {
      en: "Graduation project — full-stack platform earning A+ at MTI. Mobile + web with admin operations.",
      ar: "مشروع التخرج — منصة كاملة بدرجة A+ في MTI. تطبيق ويب وموبايل مع لوحة تحكم.",
    },
    category: "edtech",
    github: "https://github.com/mohameddzaher/Ezraa-app",
    featured: true,
  },
  {
    slug: "bank-system",
    title: { en: "Bank System", ar: "نظام بنكي" },
    description: {
      en: "Banking simulation system — accounts, transactions, and admin controls.",
      ar: "محاكاة نظام بنكي — حسابات، معاملات، وأدوات إدارة.",
    },
    category: "business",
    github: "https://github.com/mohameddzaher/Bank-System",
  },
  {
    slug: "retetive-website",
    title: { en: "Retetive Website", ar: "موقع ريتيتيف" },
    description: {
      en: "Brand site for Retetive — company narrative and contact funnel.",
      ar: "موقع علامة Retetive — قصة الشركة وقناة التواصل.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/ReteTive-Website",
  },
  {
    slug: "simpson-draw",
    title: { en: "Simpson Draw", ar: "سيمبسون درو" },
    description: {
      en: "Creative drawing tool with a Simpsons-themed playful UX.",
      ar: "أداة رسم إبداعية بأسلوب مرح مستوحى من Simpsons.",
    },
    category: "web",
    github: "https://github.com/mohameddzaher/Simpson-Draw",
  },
];

export type Certification = { name: Bilingual; issuer: Bilingual; date?: Bilingual };
export const CERTIFICATIONS: Certification[] = [
  {
    name: { en: "MBA Program", ar: "برنامج MBA" },
    issuer: { en: "Ehab Mesallum", ar: "إيهاب مسلم" },
    date: { en: "Completed Apr 2026", ar: "اكتمل أبريل ٢٠٢٦" },
  },
  {
    name: {
      en: "Software Engineering Diploma — C++, OOP, Algorithms, SOLID, Agile",
      ar: "دبلومة هندسة البرمجيات — C++ و OOP والخوارزميات و SOLID و Agile",
    },
    issuer: { en: "Route", ar: "Route" },
    date: { en: "Sep 2022 — Feb 2023", ar: "سبتمبر ٢٠٢٢ — فبراير ٢٠٢٣" },
  },
  {
    name: {
      en: "Full-Stack Web Development Bootcamp — MERN + REST APIs",
      ar: "بوت كامب Full-Stack — MERN و REST APIs",
    },
    issuer: { en: "Index Academy", ar: "Index Academy" },
    date: { en: "May 2024 — Jan 2025", ar: "مايو ٢٠٢٤ — يناير ٢٠٢٥" },
  },
  {
    name: {
      en: "Data Structures, Algorithms & Node.js Development",
      ar: "هياكل البيانات والخوارزميات وتطوير Node.js",
    },
    issuer: { en: "Metwally Labs", ar: "Metwally Labs" },
    date: { en: "Aug 2024 — Nov 2025", ar: "أغسطس ٢٠٢٤ — نوفمبر ٢٠٢٥" },
  },
  {
    name: {
      en: "Frontend Development Training — HTML, CSS, JavaScript",
      ar: "تدريب تطوير الواجهات — HTML و CSS و JavaScript",
    },
    issuer: { en: "Senior Academy", ar: "Senior Academy" },
    date: { en: "Jan 2022 — May 2022", ar: "يناير ٢٠٢٢ — مايو ٢٠٢٢" },
  },
  {
    name: { en: "Flutter Development Course", ar: "كورس تطوير Flutter" },
    issuer: { en: "Udemy", ar: "Udemy" },
    date: { en: "Jan 2021 — Apr 2021", ar: "يناير ٢٠٢١ — أبريل ٢٠٢١" },
  },
  {
    name: {
      en: "Continuous Business Learning — Strategy, BD, Operations, AI for Business",
      ar: "تعلم أعمال مستمر — الاستراتيجية، تطوير الأعمال، التشغيل، الذكاء الاصطناعي للأعمال",
    },
    issuer: { en: "Multiple programs", ar: "برامج متعددة" },
    date: { en: "Ongoing", ar: "مستمر" },
  },
];

export type SpeakingEntry = { title: Bilingual; venue: Bilingual; date: Bilingual; audience: Bilingual; description: Bilingual };
export const SPEAKING: SpeakingEntry[] = [
  {
    title: { en: "Spotlight Event — Banha University", ar: "فعالية Spotlight — جامعة بنها" },
    venue: { en: "Creativa Banha", ar: "Creativa بنها" },
    date: { en: "Feb 2025", ar: "فبراير ٢٠٢٥" },
    audience: { en: "100+ attendees", ar: "+١٠٠ حضور" },
    description: {
      en: "Talk on Time Management for Developers — balancing coding, learning, and deadlines; organising code & tasks for smoother teamwork; sprint planning and execution.",
      ar: "محاضرة عن إدارة الوقت للمطورين — الموازنة بين الكود والتعلّم والـ deadlines، تنظيم الأكواد والمهام للعمل الجماعي، وتخطيط وتنفيذ الـ Sprints.",
    },
  },
  {
    title: { en: "GDSC Software Instructor", ar: "GDSC — مدرّب برمجة" },
    venue: { en: "MTI University", ar: "جامعة MTI" },
    date: { en: "2021 – 2023", ar: "٢٠٢١ – ٢٠٢٣" },
    audience: { en: "Multiple cohorts", ar: "دفعات متعددة" },
    description: {
      en: "Taught web development fundamentals within Google Developer Student Club.",
      ar: "تدريس أساسيات تطوير الويب داخل Google Developer Student Club.",
    },
  },
  {
    title: { en: "Cairo Coding School — C++, OOP & Problem Solving Instructor", ar: "Cairo Coding School — مدرّب C++ و OOP وحل المشكلات" },
    venue: { en: "Cairo Coding School", ar: "Cairo Coding School" },
    date: { en: "Jan 2025 – Present", ar: "يناير ٢٠٢٥ — حتى الآن" },
    audience: { en: "Active cohorts", ar: "دفعات نشطة" },
    description: {
      en: "Designed and deliver a full C++ curriculum: fundamentals, OOP, SOLID, algorithms & data structures, competitive programming, plus weekly 1:1 mentoring and interview prep on LeetCode/HackerRank.",
      ar: "صممت وأقدّم منهج C++ كامل: الأساسيات، OOP، SOLID، الخوارزميات وهياكل البيانات، البرمجة التنافسية، مع جلسات أسبوعية فردية وتحضير مقابلات على LeetCode/HackerRank.",
    },
  },
  {
    title: { en: "VIP Education Center Instructor", ar: "VIP — مدرّب" },
    venue: { en: "VIP Education Center", ar: "مركز VIP التعليمي" },
    date: { en: "Nov 2024 – Jan 2025", ar: "نوفمبر ٢٠٢٤ — يناير ٢٠٢٥" },
    audience: { en: "CS students at Modern Academy", ar: "طلاب علوم حاسب في Modern Academy" },
    description: {
      en: "Online + offline sessions on HTTP, web servers, HTML/CSS/JS, and the backend lifecycle, with hands-on exercises tailored to multiple learning styles.",
      ar: "جلسات أونلاين وأوفلاين عن HTTP والـ Web Servers و HTML/CSS/JS ودورة حياة الباك اند، بتمارين عملية تناسب أساليب تعلم متنوعة.",
    },
  },
];

export type ClientLogo = {
  name: string;
  /** Slug used to look up a manually uploaded logo at /clients/{slug}.png|svg */
  slug: string;
  /**
   * Remote logo sources tried in order. First successful one wins.
   * Last fallback is /clients/{slug}.svg → /clients/{slug}.png (local) → wordmark text.
   */
  logos: string[];
  /** Brand colour for wordmark fallback */
  brandColor: string;
  /** Wordmark style override (font weight / case) */
  wordmark?: { weight?: number; case?: "lower" | "upper" | "title" };
};

export const CLIENT_LOGOS: ClientLogo[] = [
  {
    name: "Amazon",
    slug: "amazon",
    logos: [
      "https://cdn.simpleicons.org/amazon/FF9900",
      "https://logo.clearbit.com/amazon.com",
    ],
    brandColor: "#FF9900",
    wordmark: { weight: 700, case: "lower" },
  },
  {
    name: "DHL",
    slug: "dhl",
    logos: [
      "https://cdn.simpleicons.org/dhl/D40511",
      "https://logo.clearbit.com/dhl.com",
    ],
    brandColor: "#D40511",
    wordmark: { weight: 800, case: "upper" },
  },
  {
    name: "Keeta",
    slug: "keeta",
    logos: [
      "https://logo.clearbit.com/keeta.com",
      "https://logo.clearbit.com/keeta.sa",
    ],
    brandColor: "#FFD500",
    wordmark: { weight: 800, case: "title" },
  },
  {
    name: "HungerStation",
    slug: "hungerstation",
    logos: [
      "https://logo.clearbit.com/hungerstation.com",
    ],
    brandColor: "#F4A700",
    wordmark: { weight: 700, case: "title" },
  },
  {
    name: "Ninja",
    slug: "ninja",
    logos: [
      "https://logo.clearbit.com/ninja.com",
      "https://logo.clearbit.com/getninja.com",
    ],
    brandColor: "#E11D48",
    wordmark: { weight: 700, case: "title" },
  },
  {
    name: "NexTracker",
    slug: "nextracker",
    logos: [
      "https://logo.clearbit.com/nextracker.com",
    ],
    brandColor: "#0096D6",
    wordmark: { weight: 800, case: "title" },
  },
];

export type Testimonial = { name: string; role: Bilingual; company: string; quote: Bilingual };
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Ahmed Fouad",
    role: { en: "Graphic Designer", ar: "مصمم جرافيك" },
    company: "Budget Digital Marketing",
    quote: {
      en: "Mohamed delivers — he combines genuine engineering depth with the rare ability to talk business and design fluently. Every project he touched moved faster.",
      ar: "محمد يسلّم — عمق هندسي حقيقي مع قدرة نادرة على فهم الأعمال والتصميم بطلاقة. كل مشروع تحرّك أسرع.",
    },
  },
  {
    name: "Refaat Elghandour",
    role: { en: "Professional Photographer", ar: "مصور محترف" },
    company: "",
    quote: {
      en: "One of those people who actually ships. Calm under pressure, sharp on details, and treats every client like a partner.",
      ar: "من النوع اللي بيسلّم فعلاً. هادئ تحت الضغط، دقيق في التفاصيل، ويعامل كل عميل كشريك.",
    },
  },
];
