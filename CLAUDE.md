# TEK NAIJA LTD — Master Build Prompt

**Target tools:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Supabase · Cursor / Lovable
**Deliverable:** Production-grade marketing website + lightweight CMS for a Nigerian technology holding company.
**Audience reading the site:** Government partners, enterprise clients, institutional investors, prospective hires, fellow founders.

---

## 0. Identity Brief — Read this first, internalise it, never lose it

You are building the public face of **TEK NAIJA LTD** (RC No. 9181824), a Nigerian technology holding company incorporated 8 January 2026 under the Companies and Allied Matters Act 2020. Registered office: 5 Bauchi Link Street, Apapa, Lagos. Principal activity: Software Development and Solutions.

TEK NAIJA is the parent. Its work is the proof:

- **LEGTEK NAIJA** — Nigeria's premier digital dispute resolution infrastructure (procedural rules, hearing room infrastructure, real-time transcription, multi-role case management). Live at www.legtek.ng.
- **STK INDUSTRIES NIGERIA LTD** — Agricultural trade platform handling baking essentials, poultry products, and yam exports to the UK.
- A growing portfolio of bespoke e-commerce, enterprise platforms, and AI-assisted tooling.

**Leadership:**
- Sanctus Ojonimi Ejeh — Managing Director / Founder (100% PSC)
- Joseph Ugbede Ejeh — Director
- Benedict Ojimaojo Ukwenya — Director

**Team posture:** ~10 in-house, hundreds operating virtually across Nigeria.

**The single sentence the homepage must communicate within 3 seconds:**
> *TEK NAIJA builds the digital infrastructure that institutions in Nigeria — and the world — choose to run on.*

This is not a portfolio site for freelancers. This is the corporate identity of a holding company that ships sovereign-grade infrastructure. Build accordingly.

---

## 1. Aesthetic Direction — Afro-Futurist Bold

This is the design constitution. Every choice flows from here. Do not drift toward generic SaaS aesthetics.

### Colour System (CSS variables — define once, use everywhere)

```css
--ink:        #0B0E1A;   /* near-black indigo, primary background */
--ink-deep:   #060814;   /* deepest section breaks */
--ivory:      #F4EFE6;   /* warm off-white, primary text on dark */
--bone:       #E8E0D1;   /* secondary surface tone */
--terracotta: #C8553D;   /* primary accent — earthen, alive */
--ochre:      #D9A441;   /* secondary accent — gold without being gaudy */
--indigo:     #2A3270;   /* deep brand indigo for layered surfaces */
--clay:       #8B4A2B;   /* tertiary — for textures and dividers */
--moss:       #4A5D3A;   /* subtle success / status */
```

The site lives predominantly in **dark mode by default**, with strategic light-mode "interludes" for case study sections so the eye gets relief and the work pops.

### Typography (do not substitute these)

- **Display / headlines:** `Fraunces` (variable, soft optical) for serif gravitas, OR `Bricolage Grotesque` if a sans alternative is needed for system context. Use Fraunces with `opsz` near 144 for the largest type so the serifs do real work.
- **Body / UI:** `Söhne` if licensed, otherwise `Geist` for technical clarity. NOT Inter. NOT Space Grotesk. NOT Roboto.
- **Mono / metadata:** `JetBrains Mono` for case file numbers, RC numbers, timestamps, code snippets. Used sparingly as a "infrastructure tell."
- **Yoruba / Igbo / Hausa accent text** (used as design elements, not navigation): `Fraunces` italic at 0.85em.

### Pattern Language — the differentiator

Build a small library of SVG motifs derived from **Adire** (Yoruba indigo resist-dye), **Aso-oke** (woven strips), and **Nsibidi** (Cross River ideographs). These are NOT decorative wallpaper — they are structural elements:

- Section dividers as woven Aso-oke strip patterns (animated slow horizontal travel on scroll).
- Hero background: a generative grid of Adire-style concentric circles and broken lines, rendered in SVG with subtle `mix-blend-mode: screen` over the indigo ground.
- Hover states on portfolio cards: a Nsibidi-inspired glyph traces in as a corner mark.
- Number callouts (statistics, RC No., years) framed in Aso-oke "selvedge" borders.

Render these as inline SVG components in `/components/motifs/` so they are crisp, themable, and animatable.

### Motion

Use **Motion (formerly Framer Motion)** for React. Principles:

- **One orchestrated entrance per section**, not scattered micro-fidgets. On hero load: ivory text rises through indigo ground in a staggered reveal (`stagger: 0.06s`, `duration: 0.9s`, `ease: [0.16, 1, 0.3, 1]`).
- **Scroll-linked, not scroll-triggered, where it matters.** The Aso-oke divider scrolls with the page at 0.4× parallax. Portfolio thumbnails crossfade as they enter the viewport.
- **One signature moment.** When the user lands on the hero, the word *"NAIJA"* should set itself last, with a single terracotta underline drawing left-to-right beneath it over 600ms. This is the site's heartbeat.
- Respect `prefers-reduced-motion` — collapse all motion to opacity-only fades.

### Layout Principles

- **Editorial grid, not SaaS grid.** 12-column, but break out of it constantly. Hero headline spans 9 columns and bleeds 1 column into the left margin. Captions sit in the 2-column gutter.
- **Asymmetry as the default.** Never centre a hero. Never use the three-card-with-icons section. Never use the "trusted by" logo carousel — instead, present client/partner names as a typeset list, like masthead credits.
- **Density follows hierarchy.** Hero is generous. Capabilities are dense and editorial. Portfolio cases are cinematic full-bleed. Team is gridded with restraint.

---

## 2. Information Architecture

```
/                           Home
/work                       Portfolio index
/work/legtek-naija          Case study (flagship)
/work/stk-industries        Case study
/work/[slug]                Dynamic case studies from CMS
/capabilities               Services / what we build
/about                      Company story + leadership
/insights                   Blog index
/insights/[slug]            Blog post
/contact                    Email + WhatsApp + office address
/admin                      CMS (auth-gated, Supabase)
```

No "Home" link in the nav. The wordmark returns home. Nav order: **Work · Capabilities · About · Insights · Contact**. CTA on the right: a simple text link "Begin a conversation →" not a button.

---

## 3. Page-by-Page Specification

### 3.1 Home (`/`)

**Above the fold (single viewport, no scroll required to grasp it):**

- Top bar: wordmark `TEK NAIJA` set in Fraunces small caps, RC No. 9181824 set in JetBrains Mono next to it at 0.7em — this is the "infrastructure tell."
- Hero headline (Fraunces 144pt at desktop, fluid down): *"We build the systems Nigeria runs on."* The word "Nigeria" gets the terracotta underline animation described above.
- Sub-headline (Geist, 1.25rem, ivory at 70% opacity, max 52ch): *"A Lagos-headquartered technology holding company shipping sovereign-grade software for justice, commerce, and the institutions of a continent in motion."*
- No hero image. No hero video. The Adire SVG ground IS the image.
- Bottom of viewport, a single line in JetBrains Mono: `Incorporated 08.01.2026 — Lagos, Nigeria — Active across 4 sectors`

**Section 2 — Selected Work (the proof):**

Three cases, full-bleed, vertically stacked. Each is a horizontal split:
- Left 60%: a single oversized image / mockup of the product, framed with a 1px ochre rule.
- Right 40%: small JetBrains Mono label (`PROJECT 01 — JUSTICE INFRASTRUCTURE`), Fraunces case title (`LEGTEK ÈKÓ`), one paragraph (60–80 words) describing what was built and what it shifted, then a simple `Read the case →` link.
- The three featured cases: **LEGTEK NAIJA**, **STK INDUSTRIES**, and a third "in development" placeholder titled `LITIGATEIQ` with a "Forthcoming" tag.

**Section 3 — What we build (Capabilities preview):**

A two-column editorial spread. Left column is a single Fraunces line: *"Four practices. One standard."* Right column is a numbered list (Roman numerals in Fraunces, descriptions in Geist):

```
I.   Justice & Regulatory Technology
II.  Commerce & Trade Platforms
III. Institutional Software & Workflow Systems
IV.  Applied AI & Data Infrastructure
```

Each item is a link to the relevant capabilities sub-section.

**Section 4 — Voices (Testimonials, but redesigned):**

Not cards. A single rotating pull-quote, set in Fraunces at 3rem, with the attribution in JetBrains Mono below. Pulls from a Supabase `testimonials` table. Auto-rotates every 8 seconds with a slow crossfade. Manual arrow controls in the bottom right.

**Section 5 — From the desk (Insights preview):**

Three most recent posts in a magazine-index style. Title in Fraunces, dateline in JetBrains Mono, 2-line dek in Geist. No thumbnails. Title is the hyperlink.

**Section 6 — Footer:**

A typographic footer, not a sitemap. Three columns:
- Wordmark + RC No. + registered address + "An Ejeh Family enterprise" set small.
- Navigation as a clean list.
- A final pull-quote from the founder, italicised: *"We build for the next century, not the next quarter."* Attribution: Sanctus Ojonimi Ejeh, MD.

Bottom rule with `© 2026 TEK NAIJA LTD. All rights reserved.` and Privacy / Terms links.

### 3.2 Work (`/work`)

A single scrollable index. No filter chips. No grid of squares. Each project gets a horizontal "spread" — image left, metadata right, separated by a 1px ochre rule. Hovering a row shifts the image into focus and dims the others. Click takes you into the case.

### 3.3 Case Study Template (`/work/[slug]`)

Cinematic. Each case has the structure:
1. **Cover** — full-bleed product image, project title in Fraunces overlaid, mono metadata (sector, year, status).
2. **The brief** — 2 paragraphs of editorial prose (Fraunces body at 1.35rem, generous leading).
3. **What we built** — bullet-free prose grouped under H3s in Fraunces.
4. **Architecture / Stack** — a panel in JetBrains Mono listing the technical choices, set on the indigo with ochre rules.
5. **Outcomes** — three large-format statistics with mono labels and Fraunces numerals.
6. **Gallery** — 4–6 images in an asymmetric grid.
7. **Footer CTA** — *"Want this kind of work for your institution?"* → contact link.

For LEGTEK NAIJA specifically, mention: 19 procedural parts, 102 articles, real-time transcription via Gemini Live API + Daily.co, multi-role architecture (Party, Neutral, Counsel, Case Manager, Financial Administrator, Super Administrator, Agent).

For STK INDUSTRIES: full trade cycle (KYC, RFQ, payment, export documentation), UK yam export pipeline, SKU/inventory dashboards.

### 3.4 Capabilities (`/capabilities`)

One long page, four anchored sections (one per practice). Each section opens with a Roman numeral, a Fraunces statement, then editorial paragraphs describing the practice, the kinds of clients it serves, and 2–3 representative outputs. No icon grids. No pricing tables.

### 3.5 About (`/about`)

Three movements:
1. **The thesis** — a 400-word essay on why TEK NAIJA exists, set as a long-form editorial column (max 65ch). The first letter of the first paragraph is a drop-cap in terracotta Fraunces.
2. **The leadership** — three team members presented as masthead entries. Full name in Fraunces, role in mono, 80-word bio in Geist. No headshots in circles. If headshots are used, they sit in a strict square frame with a duotone treatment (indigo + ivory).
3. **The record** — registration data presented honestly: RC 9181824, incorporated 8 January 2026, ₦100,000 share capital, registered office 5 Bauchi Link Street Apapa, principal activity: Software Development and Solutions. This transparency IS the trust signal.

### 3.6 Insights (`/insights`)

A literary blog index. No card grid. A vertical list of entries, each entry: dateline in mono, title in Fraunces 2rem, dek in Geist, byline in mono. Hover lifts the title 4px and underlines it in terracotta.

Posts are markdown content rendered from Supabase, with a custom MDX-like component renderer for pull-quotes, image figures with captions, and code blocks (JetBrains Mono on the indigo).

### 3.7 Contact (`/contact`)

Deliberately spare. A single Fraunces line: *"Tell us what you are building."* Below it:
- Email (large, mono): `hello@teknaija.ng` — clickable mailto.
- WhatsApp (large, mono): `+234 803 044 0935` — opens wa.me link.
- Office address.
- Office hours.

No form. No fields. The lack of friction IS the message: serious enquiries reach us directly.

### 3.8 Admin / CMS (`/admin`)

Supabase-auth gated. Access only for the founder + designated editors (role-based via Supabase RLS).

Tables to manage:
- `projects` — slug, title, sector, status (live/forthcoming/archived), cover_image, body (markdown), gallery_images (jsonb), stack (jsonb), outcomes (jsonb), order, featured (bool).
- `team_members` — name, role, bio, headshot, order, active.
- `testimonials` — quote, author_name, author_role, author_org, active.
- `posts` — slug, title, dek, body (markdown), author_id, published_at, status, cover_image.
- `clients` — name, sector, displayed (bool).

The admin UI itself: NOT branded with the same Afro-futurist aesthetic — it is intentionally utilitarian (clean Geist, neutral greys, fast forms). The marketing site is the cathedral; the CMS is the workshop.

Use `react-hook-form` + `zod` for forms, `@tanstack/react-table` for lists, `tiptap` or a simple textarea + markdown preview for body fields, Supabase Storage for image uploads with on-the-fly resizing via `next/image` `loader`.

---

## 4. Technical Specification

### Stack
- **Framework:** Next.js 15 (App Router), React 19, TypeScript strict mode.
- **Styling:** Tailwind CSS v4 (use the new `@theme` directive for design tokens). No CSS-in-JS runtime. Custom utility classes for the motif system.
- **Animation:** `motion` (Framer Motion successor) for React components. CSS animations for everything that doesn't need orchestration.
- **Database / Auth / Storage:** Supabase (Postgres + Auth + Storage + Edge Functions for any server-side actions like contact-event logging).
- **Content:** Markdown stored in Supabase, rendered with `react-markdown` + `remark-gfm` + a custom component map.
- **Fonts:** Self-hosted via `next/font/google` (Fraunces, JetBrains Mono) and `next/font/local` for Söhne/Geist.
- **Icons:** Lucide React, but used sparingly — prefer text and motifs.
- **SEO:** Per-route Metadata API, OpenGraph image generation via `@vercel/og`, JSON-LD `Organization` + `WebSite` schemas in the root layout.
- **Analytics:** Vercel Analytics + Plausible (privacy-respecting, no cookie banner needed).
- **Deployment:** Vercel.

### Folder Structure
```
/app
  /(marketing)
    /page.tsx              Home
    /work
    /capabilities
    /about
    /insights
    /contact
    /layout.tsx            Marketing layout with nav + footer
  /(admin)
    /admin
      /layout.tsx          Admin shell with auth guard
      /projects
      /team
      /testimonials
      /posts
  /api
    /og/[slug]             Dynamic OG images
  /layout.tsx              Root layout, fonts, theme provider
/components
  /motifs                  Adire, Aso-oke, Nsibidi SVGs
  /marketing               Hero, CaseRow, MastheadEntry, etc.
  /admin                   Form primitives, DataTable, etc.
  /ui                      Primitives (Button, Link, etc.)
/lib
  /supabase                Client, server, admin clients
  /content                 Markdown rendering, type guards
/styles
  /globals.css             Tailwind + tokens
/supabase
  /migrations              SQL migrations
  /seed.sql                Initial content (3 projects, 3 team, 5 testimonials, 2 posts)
```

### Performance Budget
- LCP < 1.8s on 4G.
- Total JS < 150KB on home route (defer admin entirely).
- All hero typography rendered server-side; no FOIT.
- Images: AVIF/WebP via `next/image`, served from Supabase Storage with the Next.js loader.

### Accessibility
- WCAG 2.2 AA minimum.
- All motion respects `prefers-reduced-motion`.
- Colour contrast verified against ivory-on-indigo (passes AAA at body sizes).
- Keyboard-navigable case study galleries.
- All SVG motifs marked `aria-hidden="true"` since they are decorative.

### Content Seed (write the full polished copy in the build)

When generating the site, write the actual copy in TEK NAIJA's voice — confident, restrained, editorial, faintly literary. Avoid: "innovative solutions," "cutting-edge," "world-class," "passionate team." Prefer: specific verbs, concrete nouns, declarative sentences, the occasional well-placed semicolon.

Voice references to internalise:
- The opinion pages of *Stripe Press*.
- The case study writing on *Pentagram.com*.
- The institutional gravity of *Bridgewater* annual letters.
- The cultural confidence of *Nataal Magazine*.

---

## 5. Build Sequence (suggested order for the agent)

1. **Scaffold** — `create-next-app@latest` with TS, Tailwind v4, App Router. Install dependencies.
2. **Design system** — globals.css with CSS variables, Tailwind theme extension, font loading, base typography.
3. **Motif library** — build 4–6 SVG components in `/components/motifs/`.
4. **Layouts** — root layout, marketing layout (nav + footer), admin layout (auth guard).
5. **Home** — build it fully. This is the calibration moment. If the home page doesn't feel premium, stop and adjust the design system before proceeding.
6. **Supabase setup** — migrations for all tables, RLS policies, seed data.
7. **Case study template + Work index** — driven from Supabase.
8. **Capabilities, About, Insights, Contact** — in that order.
9. **Admin CMS** — last, utilitarian, fast.
10. **SEO + OG images + sitemap + robots.txt.**
11. **QA pass** — Lighthouse, Axe, real device test, motion-reduced test.

---

## 6. What good looks like (the bar)

When the homepage loads on a partner's MacBook in a Lagos boardroom, three things should happen in the first eight seconds:

1. They notice the typography before they read the words.
2. They scroll once, see LEGTEK presented like a feature in a design annual, and pause.
3. They form the unstated thought: *these people are not playing.*

That is the standard. Build to it.

---

## 7. Information still required from the client (ask before/during build)

Place these as TODO comments in the code where the data is needed:

- High-resolution product screenshots / mockups for LEGTEK NAIJA and STK INDUSTRIES (ideally in mockup frames — laptop, mobile, hearing-room display).
- Professional headshots for Sanctus, Joseph, and Benedict (or confirmation to use duotone-treated supplied photos).
- Final domain — confirm `teknaija.ng` is owned, or specify alternative.
- Final contact email — `hello@teknaija.ng` is assumed; confirm or replace.
- Any client logos / partner names that can be displayed publicly (Lagos State, etc.).
- Founder's by-line photo for Insights posts.
- Two or three real testimonial quotes from named clients, OR permission to leave the testimonial section seeded with placeholder attribution until real ones arrive.

---

**End of master prompt.**
*Version 1.0 — generated for Sanctus Ojonimi Ejeh, MD, TEK NAIJA LTD.*
