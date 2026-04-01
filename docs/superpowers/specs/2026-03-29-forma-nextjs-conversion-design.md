# FORMA Landing Page — Next.js Conversion Design

**Date:** 2026-03-29
**Approach:** Option A — `create-next-app` + manual Tailwind v4 upgrade

---

## Overview

Convert `/Users/skuser/Forma/forma-landing-page.html` into a production-ready Next.js 15 App Router project. The result must be visually and functionally identical to the HTML source. No design changes, no added sections, no extra libraries.

**Tech stack:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- Framer Motion
- `next/font/google` for fonts

**Video asset:** `Creative-Spark-Design-Mar-29-10-19-29.mp4` (copied to `/public/`)

---

## Directory Structure

```
/Users/skuser/Forma/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Navbar.tsx          ← "use client"
│   ├── Hero.tsx            ← "use client"
│   ├── Statement.tsx       ← server
│   ├── BrowserMockup.tsx   ← server
│   ├── DashboardMockup.tsx ← server
│   ├── PhoneMockup.tsx     ← server
│   ├── Marquee.tsx         ← server
│   ├── Services.tsx        ← server
│   ├── ServiceCard.tsx     ← "use client"
│   ├── Process.tsx         ← server
│   ├── Stats.tsx           ← "use client"
│   ├── Trust.tsx           ← server
│   ├── Testimonials.tsx    ← "use client"
│   ├── FAQ.tsx             ← "use client"
│   ├── Contact.tsx         ← "use client"
│   ├── Footer.tsx          ← server
│   ├── SideDots.tsx        ← "use client"
│   ├── BackToTop.tsx       ← "use client"
│   └── WhatsApp.tsx        ← server
└── public/
    └── Creative-Spark-Design-Mar-29-10-19-29.mp4
```

---

## Color Palette

Defined as `@theme` variables in `globals.css`:

| Variable | Value | Usage |
|---|---|---|
| `--bk` | `#0a0a09` | Background black |
| `--dk` | `#111110` | Dark surface |
| `--ds` | `#161514` | Card surface |
| `--wd` | `#1c1a17` | Hover surface |
| `--cr` | `#f0ebe3` | Cream text |
| `--cd` | `#9e9789` | Dim text |
| `--tn` | `#baa87e` | Tan accent |
| `--gd` | `#c4a96a` | Gold accent |

---

## Typography

Loaded via `next/font/google` in `layout.tsx`, injected as CSS variables:

| Font | Weights | Variable | Usage |
|---|---|---|---|
| Playfair Display | 400, 700, 900 + italic | `--font-serif` | Headings, logo, hero title |
| DM Sans | 200–600 + italic | `--font-sans` | Body, nav, buttons |
| Cormorant Garamond | 300, 400, 600 + italic | `--font-serif-alt` | Testimonials, process numbers |

---

## Globals CSS

```css
@import "tailwindcss";

@theme {
  --color-bk: #0a0a09;
  --color-dk: #111110;
  --color-ds: #161514;
  --color-wd: #1c1a17;
  --color-cr: #f0ebe3;
  --color-cd: #9e9789;
  --color-tn: #baa87e;
  --color-gd: #c4a96a;
}

/* Custom keyframes: marq, shimmer, scrollPulse, floatWa */
/* Grain overlay as fixed ::after on body */
/* Scrollbar styling */
/* .rv scroll-reveal utility */
```

---

## Component Specifications

### layout.tsx
- Loads all three fonts via `next/font/google`
- Exports `metadata` with title, description, theme-color, Open Graph
- Renders grain overlay div: `position:fixed, inset:0, pointer-events:none, z-index:9999`
- Body gets font CSS variables, background `bg-bk`, color `text-cr`, `antialiased`

### page.tsx
- Server component
- Composes sections in order:
  `Navbar → Hero → Statement(browser) → Divider → Statement(dashboard) → Divider → Statement(phones) → Marquee → Services → Process → Stats → Trust → Testimonials → FAQ → Contact → Footer → SideDots → BackToTop → WhatsApp`

### Navbar.tsx (`"use client"`)
- `useState: scrolled, menuOpen`
- `useEffect`: scroll listener, toggles `scrolled` past 80px
- Hamburger: toggles `menuOpen`, locks `document.body.style.overflow`
- Mobile menu: full-screen overlay, staggered Framer Motion link entrance
- Nav links: Services, Process, Contact; CTA: "Start a Project" → `#contact`

### Hero.tsx (`"use client"`)
- `useScroll` + `useTransform`: `y` = scrollY × 0.35, opacity fades 1→0 over first 70vh
- `motion.div` entrance: eyebrow (delay 0.3s), title (0.5s), subtitle (0.9s), scroll indicator (1.3s)
- Video: `autoPlay muted loop playsInline preload="metadata"`, opacity 0.22, no conditional rendering
- Radial gradient overlay on video bg

### Statement.tsx (server)
- Props: `title: ReactNode, body: string, mockupType: 'browser' | 'dashboard' | 'phones'`
- CSS grid: two columns, `group` class on wrapper for hover-triggered mockup tilt flatten
- Mockup tilt: `perspective(1200px) rotateY(-4deg) rotateX(2deg)` → flattens on `group-hover`

### BrowserMockup.tsx (server)
- Pure JSX wireframe: browser chrome bar (3 dots + URL bar), body with skeleton lines, image placeholder, card grid, CTA button
- Shimmer animation on skeleton lines

### DashboardMockup.tsx (server)
- Browser chrome + sidebar (nav items) + main area (stat cards, bar chart, table rows)
- Sidebar hidden at 768px via `hidden md:flex`

### PhoneMockup.tsx (server)
- Three phone frames: left secondary (opacity 0.7, scale 0.9), center primary (translateY -20px), right secondary (scale 0.85)
- Side phones hidden at 1100px

### Marquee.tsx (server)
- `aria-hidden="true"`
- CSS `@keyframes marq` animation, 35s linear infinite
- Double-repeated content for seamless loop
- Items: Landing Pages, *Web Apps*, Mobile Apps, *Custom Software*, UI/UX Design, *Brand Identity*

### ServiceCard.tsx (`"use client"`)
- Framer Motion `whileHover` for: gold gradient bar scaleX 0→1, background color shift, radial glow opacity 0→1
- Tags brighten on hover via `group-hover:` classes
- Arrow circle: border-color + icon color shift on hover

### Services.tsx (server)
- Section header: label + serif title
- Renders 3 `ServiceCard` components:
  1. Landing Pages & Web Design — tags: Conversion Optimization, Responsive Design, A/B Testing
  2. Custom Software Development — tags: Full-Stack, Cloud Native, API Design
  3. Mobile App Development — tags: iOS & Android, Cross-Platform, App Store

### Process.tsx (server)
- 4-column grid with connecting line (CSS `::before` pseudo via `after:` utility)
- Steps: Discover, Design, Develop, Deliver
- Timeline dots: gold fill on hover (CSS-only)
- Responsive: 2-col at 768px, 1-col at 480px

### Stats.tsx (`"use client"`)
- `useInView` triggers counter animation per stat
- `requestAnimationFrame` loop with easeOutQuart: `1 - Math.pow(1 - progress, 4)`
- Stats: 50+ Projects, 3.0x Conversion Lift, 98% Satisfaction, 12+ Industries

### Trust.tsx (server)
- Client logo list: FinanceFlow, Meridian Group, NeuralDesk, Harvest & Co, Vaultline, ONYX Digital
- Serif italic font, opacity 0.2 → 0.5 on hover

### Testimonials.tsx (`"use client"`)
- `useState: current (0)`
- `useEffect`: `setInterval` 5000ms, calls `goTo((current + 1) % 3)`
- Manual dot click: `clearInterval` + restart
- `AnimatePresence` with crossfade (opacity + translateY)
- 3 testimonials: Sarah Mitchell / Ahmed Karim / Layla Hassan

### FAQ.tsx (`"use client"`)
- `useState: openIndex (null | number)`
- Click handler: set to index or null if same (toggle)
- `AnimatePresence` + `motion.div` with `height: 'auto'` for smooth expand
- Plus → minus: CSS rotate on vertical bar via `openIndex === i` conditional class
- 5 questions

### Contact.tsx (`"use client"`)
- `useState: { name, email, projectType, message }, submitted`
- Validation: name + email required
- `AnimatePresence`: form slides out, success state slides in on submit
- Success state: gold checkmark circle + "Message Sent" heading

### SideDots.tsx (`"use client"`)
- `IntersectionObserver` on all `[data-sec]` sections (threshold 0.35)
- 5 dots: hero(0), statement-1(1), statement-2(2), statement-3(3), services(4)
- Dot click: `scrollIntoView({ behavior: 'smooth' })`
- Hidden at 768px

### BackToTop.tsx (`"use client"`)
- `useState: visible`
- Scroll listener: visible past 600px
- Framer Motion: opacity + translateY transition
- `onClick`: `window.scrollTo({ top: 0, behavior: 'smooth' })`

### WhatsApp.tsx (server)
- Static `<a>` link to `https://wa.me/201234567890`
- CSS `@keyframes floatWa` — subtle 3s float animation
- `aria-label="WhatsApp"`

### Footer.tsx (server)
- 4-column grid: brand + desc, Services links, Company links, Get in Touch
- Bottom bar: copyright + social links (LinkedIn, Dribbble, Instagram, X)
- Responsive: 2-col at 1100px, 1-col at 768px

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| 1100px | Statement sections stack, service grid 1-col, side phones hidden, footer 2-col |
| 768px | Hamburger menu, nav links hidden, padding reduced, process 2-col, stats 2-col, dashboard sidebar hidden, footer 1-col |
| 480px | Process 1-col, stats 1-col |

---

## Animations Summary

| Animation | Implementation |
|---|---|
| Hero entrance | Framer Motion `initial/animate` stagger |
| Scroll reveal | `whileInView` + `viewport={{ once: true }}` |
| Hero parallax | `useScroll` + `useTransform` |
| Mockup 3D tilt | CSS `perspective()` + `group-hover:` Tailwind |
| Service card hover | Framer Motion `whileHover` |
| Stat counters | `useInView` + `requestAnimationFrame` |
| Testimonial crossfade | `AnimatePresence` + opacity |
| FAQ accordion | `AnimatePresence` + `motion.div height` |
| Marquee | CSS `@keyframes marq` (35s linear infinite) |
| Nav blur | CSS transition on scroll state class |
| Form success | `AnimatePresence` slide |
| Back-to-top | Framer Motion opacity + y |
| WhatsApp float | CSS `@keyframes floatWa` |
| Shimmer | CSS `@keyframes shimmer` on wireframe lines |

---

## SEO / Performance

- `metadata` export in `layout.tsx`: title, description, `theme-color: #0a0a09`, Open Graph
- All fonts via `next/font/google` (no external stylesheet)
- Video in `/public`, served statically
- `aria-label` on hamburger, back-to-top, WhatsApp
- `aria-hidden="true"` on marquee
- `"use client"` only where state/effects/Framer Motion needed

---

## Out of Scope

- No backend — form submit is frontend-only
- No image optimization needed (no `<img>` tags in design)
- No preloader
- No additional UI libraries
