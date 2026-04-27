# Mohamed Zaher — Personal Portfolio + Corporate Platform + Client SaaS Portal

A full-stack platform that serves three roles in one site:

1. **Personal portfolio** — Mohamed Zaher's profile, ventures, projects, experience.
2. **Corporate business card** — premium feel for companies and clients to discover and reach out.
3. **Client SaaS portal** — every client gets a private dashboard with their projects, files, and invoices.

> Built with **Next.js 15 (App Router)**, **Three.js**, **Express + MongoDB**, **TypeScript strict**, **Tailwind v4**, **next-intl** (EN/AR + RTL), **Socket.io** for real-time, **Cloudinary** for media, **Gmail SMTP** for email.

---

## ⚡ TL;DR

```bash
# 1. Install (root installs both workspaces)
npm install

# 2. Configure env
cp backend/.env.example backend/.env       # fill MONGODB_URI, secrets, Cloudinary, SMTP
cp frontend/.env.example frontend/.env     # NEXT_PUBLIC_API_URL etc.

# 3. Seed initial admin + content
npm run seed

# 4. Run both apps in parallel
npm run dev

# Frontend → http://localhost:3000
# API      → http://localhost:5001/api
```

Default admin (after `npm run seed`):
- Email: `mohamedzaher.dev@gmail.com`
- Password: `ChangeMeImmediately!2026` ← **change immediately** via `/admin/settings → change password**.

---

## 📁 Project structure

```
mohamedzaher-platform/
├── frontend/                    Next.js 15 app
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx       Root layout (fonts, JSON-LD, metadata)
│   │   │   ├── globals.css      Design tokens (Tailwind v4 @theme)
│   │   │   ├── sitemap.ts       Auto sitemap
│   │   │   ├── robots.ts        Robots.txt
│   │   │   ├── api/og/route.tsx Dynamic OG image (Edge runtime)
│   │   │   ├── not-found.tsx    Custom 404
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx           Per-locale shell (Header, Footer, providers)
│   │   │       ├── page.tsx             Public home (Hero + 14 sections)
│   │   │       ├── login/page.tsx       Shared login (admin & client)
│   │   │       ├── error.tsx            Custom 500
│   │   │       ├── admin/               Admin panel (13 modules)
│   │   │       └── client/              Client portal
│   │   ├── components/
│   │   │   ├── ui/              Button, Input, Card, Badge, Section, AnimatedCounter
│   │   │   ├── layout/          Header, Footer, SmoothScroll, ScrollProgress, MagneticCursor, PageLoader, CommandPalette
│   │   │   ├── hero/            Hero (Three.js), HeroScene, TerminalTyper
│   │   │   ├── sections/        About, Ventures, Skills, Experience, Projects, Certifications,
│   │   │   │                    Speaking, Clients, Testimonials, News, Newsletter, Contact
│   │   │   ├── admin/           AdminShell, ResourceTable, SimpleResourcePage
│   │   │   ├── client/          ClientShell
│   │   │   └── seo/             JsonLd
│   │   ├── lib/                 utils, api (axios), auth (zustand), site config, content data
│   │   ├── i18n/                next-intl routing & request config
│   │   ├── messages/            en.json, ar.json
│   │   └── middleware.ts        next-intl middleware
│   ├── public/                  Images (placeholder for profile photo)
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs       Tailwind v4
│   └── netlify.toml
│
├── backend/                     Express + MongoDB API
│   ├── src/
│   │   ├── server.ts            Boot (DB connect, sockets, server.listen)
│   │   ├── app.ts               Express factory (helmet, cors, sanitize, routes)
│   │   ├── socket.ts            Socket.io with JWT auth + room join
│   │   ├── config/              env, db
│   │   ├── models/
│   │   │   ├── User.ts          admin + client (role enum)
│   │   │   ├── Project.ts       portfolio project (i18n title/desc)
│   │   │   ├── i18nString.ts    bilingual reusable schema
│   │   │   └── index.ts         Experience, Venture, Skill, Certification,
│   │   │                        NewsPost, Testimonial, ContactSubmission,
│   │   │                        NewsletterSubscriber, ClientProject, Invoice,
│   │   │                        Payment, FileAsset, Message, SiteSettings, AnalyticsEvent
│   │   ├── routes/
│   │   │   ├── index.ts         Mounts all routers under /api
│   │   │   ├── _crudRouter.ts   Generic CRUD factory (used for content resources)
│   │   │   ├── auth.routes.ts   login, refresh, logout, me, change-password
│   │   │   ├── contact.routes.ts
│   │   │   ├── newsletter.routes.ts (+ /export.csv)
│   │   │   ├── upload.routes.ts (Cloudinary)
│   │   │   ├── clients.routes.ts (admin client management + me/dashboard for clients)
│   │   │   ├── settings.routes.ts (singleton)
│   │   │   └── analytics.routes.ts (track + dashboard aggregation)
│   │   ├── middleware/          auth (JWT cookies), rateLimit, errorHandler
│   │   ├── services/            jwt, cloudinary, mailer (Nodemailer + templates)
│   │   ├── utils/               logger, ApiError, asyncHandler
│   │   └── scripts/
│   │       ├── seed.ts          Seeds admin + ventures + sample content
│   │       └── cron.ts          Hourly: mark overdue invoices
│   ├── tsconfig.json
│   └── render.yaml              Render service blueprint
│
├── docs/                        (extra docs)
├── package.json                 Root workspaces
├── .gitignore
└── README.md                    ← you are here
```

---

## 🎨 Design decisions

- **Palette**: Electric Cyan `#22D3EE` + Violet `#8B5CF6` on charcoal `#0A0A0F` — Linear-grade polish, entrepreneurial energy. Avoids red (used in ETS).
- **Typography**: Space Grotesk (display), Inter (body), JetBrains Mono (mono), IBM Plex Sans Arabic (AR).
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` luxury default; respects `prefers-reduced-motion`.
- **Scroll**: Lenis smooth scroll, GSAP available for richer effects.
- **Hero**: Three.js vanilla — morphing icosahedron with simplex noise, 3 orbiting torus rings, 18 floating shapes, 2000-point particle system with mouse attraction, 3 moving point lights, Bloom + Chromatic Aberration + Vignette + Film Grain post-processing. Mobile/low-end devices get reduced polygons and no post-processing automatically.
- **Cursor**: Custom magnetic cursor with hover state on interactive elements; auto-disabled on touch devices.

---

## 🌐 Internationalization

- **Locales**: `en` (default) and `ar` with full RTL.
- URLs:
  - English: `https://example.com/`
  - Arabic:  `https://example.com/ar`
- Static UI strings live in `frontend/src/messages/{en,ar}.json`.
- Dynamic DB content (projects, news, testimonials, ventures, settings) uses an `I18nString` schema `{ en: string, ar: string }`. Admin fills both languages.

To switch language at runtime: header globe icon (`Globe AR/EN`).

---

## 🔐 Authentication

- JWT access (15 min) + refresh (30 days) — both **httpOnly cookies**.
- Refresh token is hashed (bcrypt) at rest — server-side revocation on logout / password change.
- `/api/auth/login` — rate-limited (10/15min).
- Passwords: bcrypt cost 12.
- Roles: `admin` and `client`. Admin routes: `requireAdmin` middleware. Clients access `/api/clients/me/*` with `requireRole("client")`.

---

## 🛠️ Admin Panel — `/admin`

| Module | Route | Status |
| ------ | ----- | ------ |
| Dashboard (stats + chart) | `/admin` | ✅ |
| Projects (CRUD + i18n + featured) | `/admin/projects` | ✅ |
| Ventures | `/admin/ventures` | ✅ |
| Experience | `/admin/experience` | ✅ |
| Skills | `/admin/skills` | ✅ |
| Certifications | `/admin/certifications` | ✅ |
| News / Blog | `/admin/news` | ✅ |
| Testimonials | `/admin/testimonials` | ✅ |
| Clients (CRUD + projects + invoices + files) | `/admin/clients` + `/admin/clients/[id]` | ✅ |
| Inbox (contact form) | `/admin/contact` | ✅ |
| Newsletter (+ CSV export) | `/admin/newsletter` | ✅ |
| Media library (Cloudinary) | `/admin/media` | ✅ |
| Settings (contact, socials, SEO, now-building) | `/admin/settings` | ✅ |

Real-time:
- Admin upload to a client → client gets a Sonner toast + dashboard refresh via Socket.io rooms (`client:<id>`).
- Recording payment → client sees the new paid total live.

---

## 👤 Client Portal — `/client`

| Page | Route |
| ---- | ----- |
| Welcome / overview (stats + recent files + active projects) | `/client` |
| Projects (progress + milestones) | `/client/projects` |
| Files & deliverables | `/client/files` |
| Invoices (table + status) | `/client/invoices` |
| Profile (change password) | `/client/profile` |

Real-time updates via Socket.io (project updates, payment recordings).

---

## 📡 API Reference (selected)

All endpoints under `/api`. Auth uses cookies (`mz_access`, `mz_refresh`) — set automatically on login.

```bash
# Health
curl http://localhost:5001/api/health

# Public list endpoints
curl http://localhost:5001/api/projects?published=true
curl http://localhost:5001/api/projects/<slug>
curl http://localhost:5001/api/ventures
curl http://localhost:5001/api/experience
curl http://localhost:5001/api/skills
curl http://localhost:5001/api/news?published=true
curl http://localhost:5001/api/testimonials

# Submit contact form (rate-limited)
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@x.com","subject":"Hi","message":"Hello, I would like to chat about a project we have in mind."}'

# Newsletter
curl -X POST http://localhost:5001/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"sub@example.com"}'

# Login (cookies set)
curl -i -c cookies.txt -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mohamedzaher.dev@gmail.com","password":"ChangeMeImmediately!2026"}'

# Authenticated me
curl -b cookies.txt http://localhost:5001/api/auth/me

# Admin: list contact inquiries
curl -b cookies.txt http://localhost:5001/api/contact
```

---

## 🔍 SEO / Performance

- Per-page metadata via Next 15 Metadata API (root + locale).
- **Auto sitemap** at `/sitemap.xml` with hreflang for EN/AR.
- **robots.txt** at `/robots.txt` (excludes `/admin`, `/client`, `/api`).
- **Dynamic OG image** at `/api/og` (Edge runtime, no static asset).
- **JSON-LD**: `Person` + `WebSite` injected at `<body>` start.
- Fonts via `next/font` (preloaded, swap).
- Three.js loaded via `dynamic({ ssr: false })`.
- Image optimization via `next/image` and remote pattern allowlist.
- `optimizePackageImports` for `lucide-react` and `framer-motion` to keep bundle small.

---

## 🚀 Deployment

### Frontend → Netlify
1. Push the repo. In Netlify → "Add new site" → "Import an existing project" → pick the repo.
2. **Base directory**: `frontend`. The `netlify.toml` handles the rest (uses `@netlify/plugin-nextjs`).
3. Add the env vars from `frontend/.env.example`. **Crucially**, set `NEXT_PUBLIC_API_URL` to your Render backend URL.

### Backend → Render
1. Push the repo. In Render → "New +" → "Blueprint" → point at `backend/render.yaml`.
2. Render reads the blueprint and prompts for the secrets (MongoDB URI, Cloudinary keys, SMTP). Fill them.
3. After deploy, run the seed script once via Render's shell:
   ```bash
   npm run seed
   ```
4. Set `CLIENT_URL` to your Netlify URL so CORS works. Set `COOKIE_DOMAIN` to your apex domain (e.g. `mohamedzaher.com`) and `COOKIE_SECURE=true` for cross-domain cookies.

### Database → MongoDB Atlas
1. Free tier cluster → "Network Access" → allow `0.0.0.0/0` (Render IPs change) or whitelist Render IPs.
2. Create a user → grab the connection string → `MONGODB_URI`.

### Media → Cloudinary
1. Create a free account → grab cloud name + API key + secret → set in Render env.

### Email → Gmail SMTP (MVP)
1. Enable 2FA on Gmail.
2. Generate an "app password".
3. Set `SMTP_USER` (your gmail) + `SMTP_PASS` (the 16-char app password).

For production scale: swap to Postmark, Resend, or SendGrid by replacing `services/mailer.ts` transport.

---

## 🧪 Local development

```bash
# Frontend only
npm --workspace frontend run dev

# Backend only (with watch)
npm --workspace backend run dev

# Type-check both
npm run lint

# Build both
npm run build
```

---

## 🔧 What's known to ship vs what needs polish

This was scaffolded in a single session with the intent of being a **runnable, production-shaped foundation** rather than a fully QA'd 1.0. What you can run today:

- ✅ Hero with full Three.js scene (morphing ico + rings + particles + post-processing + cleanup)
- ✅ All 13 public sections, fully wired & responsive
- ✅ Backend with all schemas, auth, file upload, mailer, seed, cron
- ✅ Admin panel with 13 modules (Dashboard fully built, key modules complete, simpler resources via shared form)
- ✅ Client portal (overview, projects, files, invoices, profile) with Socket.io real-time
- ✅ EN/AR + RTL plumbing throughout
- ✅ Sitemap, robots, dynamic OG, JSON-LD
- ✅ Custom cursor, command palette (Cmd+K), page loader, scroll progress, console signature

To take to launch quality, the things to invest more time in:
- Replace placeholder profile photo, project thumbnails, certificate images, client logos
- Add a richer admin form for News content (TipTap is in deps but the textarea is plain — drop-in upgrade)
- Add the visual drag-drop reordering UI on top of the existing `/reorder` endpoint
- Extend the Settings module with hero/about overrides currently displayed via static config
- Hook up Google Analytics ID rendering once you set it in admin
- E2E run-through: login, content edits visible on public site, payment record visible to client, etc.

---

## 🙋 Contact

- **Email**: mohamedzaher.dev@gmail.com
- **Phone**: +966 53 848 6109
- **LinkedIn**: https://www.linkedin.com/in/mohameddzaher/
- **GitHub**: https://github.com/mohameddzaher

Built with care by Mohamed Zaher.
