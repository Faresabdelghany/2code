# FORMA Landing Page — Next.js Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `forma-landing-page.html` into a pixel-perfect, production-ready Next.js 15 App Router project with Tailwind CSS v4 and Framer Motion.

**Architecture:** Bootstrap with `create-next-app`, replace Tailwind v3 with v4 (`@tailwindcss/postcss`), define design tokens in `globals.css` via `@theme`, and decompose the HTML into focused server/client components. Animations handled exclusively via Framer Motion; layout/styling via Tailwind utility classes only.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion 11, `next/font/google`

---

## File Map

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Font loading, metadata, grain overlay, body wrapper |
| `app/page.tsx` | Compose all sections in order |
| `app/globals.css` | Tailwind import, @theme tokens, keyframes, custom utilities |
| `components/Navbar.tsx` | Fixed nav, scroll blur, hamburger, mobile menu |
| `components/Hero.tsx` | Full-screen hero, video bg, parallax, entrance animations |
| `components/Statement.tsx` | Two-column section wrapper (text + mockup) |
| `components/BrowserMockup.tsx` | Browser wireframe SVG |
| `components/DashboardMockup.tsx` | Dashboard wireframe |
| `components/PhoneMockup.tsx` | Three-phone wireframe |
| `components/Marquee.tsx` | Infinite scrolling text marquee |
| `components/Services.tsx` | Section header + grid of 3 ServiceCards |
| `components/ServiceCard.tsx` | Individual service card with hover effects |
| `components/Process.tsx` | 4-step timeline |
| `components/Stats.tsx` | Animated counter stats bar |
| `components/Trust.tsx` | Client logo trust bar |
| `components/Testimonials.tsx` | Auto-rotating testimonial slider |
| `components/FAQ.tsx` | Accordion FAQ |
| `components/Contact.tsx` | Split CTA + contact form with success state |
| `components/Footer.tsx` | 4-column footer |
| `components/SideDots.tsx` | Fixed right-side section navigation dots |
| `components/BackToTop.tsx` | Floating back-to-top button |
| `components/WhatsApp.tsx` | Floating WhatsApp button |
| `public/Creative-Spark-Design-Mar-29-10-19-29.mp4` | Hero background video |

---

## Task 1: Bootstrap Next.js 15 Project

**Files:**
- Create: all Next.js scaffolding in `/Users/skuser/Forma/` (new subdirectory `forma-app/`)

> **Note:** We scaffold into a subdirectory `forma-app/` to avoid conflicts with the existing `forma-landing-page.html` and docs. The final project root is `/Users/skuser/Forma/forma-app/`.

- [ ] **Step 1: Scaffold the project**

```bash
cd /Users/skuser/Forma
npx create-next-app@latest forma-app --typescript --app --tailwind --eslint --no-src-dir --import-alias "@/*"
```

When prompted:
- Would you like to use Turbopack? → **No**

- [ ] **Step 2: Verify it runs**

```bash
cd /Users/skuser/Forma/forma-app
npm run dev
```

Open `http://localhost:3000` — should show the default Next.js welcome page. Stop the server (`Ctrl+C`).

- [ ] **Step 3: Commit baseline**

```bash
cd /Users/skuser/Forma/forma-app
git add -A
git commit -m "chore: scaffold Next.js 15 + TypeScript + Tailwind baseline"
```

---

## Task 2: Upgrade to Tailwind CSS v4

**Files:**
- Modify: `package.json`
- Modify: `postcss.config.mjs`
- Modify: `app/globals.css`
- Delete: `tailwind.config.ts`

- [ ] **Step 1: Remove Tailwind v3, install v4**

```bash
cd /Users/skuser/Forma/forma-app
npm uninstall tailwindcss autoprefixer
npm install tailwindcss@next @tailwindcss/postcss@next
```

- [ ] **Step 2: Update PostCSS config**

Replace `postcss.config.mjs` entirely:

```js
// postcss.config.mjs
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 3: Delete tailwind config file**

```bash
rm /Users/skuser/Forma/forma-app/tailwind.config.ts
```

- [ ] **Step 4: Verify build still works**

```bash
cd /Users/skuser/Forma/forma-app
npm run dev
```

Should start without errors. Stop server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: upgrade Tailwind CSS v3 → v4 with @tailwindcss/postcss"
```

---

## Task 3: Install Framer Motion

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Framer Motion**

```bash
cd /Users/skuser/Forma/forma-app
npm install framer-motion
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add framer-motion dependency"
```

---

## Task 4: Copy Video Asset

**Files:**
- Create: `public/Creative-Spark-Design-Mar-29-10-19-29.mp4`

- [ ] **Step 1: Copy video to public**

```bash
cp /Users/skuser/Forma/Creative-Spark-Design-Mar-29-10-19-29.mp4 \
   /Users/skuser/Forma/forma-app/public/Creative-Spark-Design-Mar-29-10-19-29.mp4
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add public/Creative-Spark-Design-Mar-29-10-19-29.mp4
git commit -m "feat: add hero background video to public/"
```

---

## Task 5: globals.css — Design Tokens, Keyframes, Utilities

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
/* app/globals.css */
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
  --color-gold-glow: rgba(196, 169, 106, 0.06);
}

:root {
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

html {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #baa87e #0a0a09;
}

::selection {
  background: #f0ebe3;
  color: #0a0a09;
}

img,
video {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid #c4a96a;
  outline-offset: 3px;
}

/* Grain overlay */
.grain::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.035'/%3E%3C/svg%3E");
  background-size: 256px;
}

/* Marquee animation */
@keyframes marq {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Scroll pulse (hero indicator) */
@keyframes scrollPulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scaleY(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.1);
  }
}

/* Shimmer for wireframe lines */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    rgba(240, 235, 227, 0.04) 25%,
    rgba(240, 235, 227, 0.1) 50%,
    rgba(240, 235, 227, 0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2.5s infinite;
}

/* WhatsApp float */
@keyframes floatWa {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

.wa-float {
  animation: floatWa 3s ease-in-out infinite;
}

/* Scroll pulse utility */
.scroll-pulse {
  animation: scrollPulse 2.5s ease-in-out infinite;
}

/* Mockup 3D tilt */
.mock-tilt {
  transition: transform 0.6s var(--ease);
}
.mock-tilt-browser {
  transform: perspective(1200px) rotateY(-4deg) rotateX(2deg);
}
.mock-tilt-dashboard {
  transform: perspective(1200px) rotateY(-3deg) rotateX(2deg);
}
.group:hover .mock-tilt-browser,
.group:hover .mock-tilt-dashboard {
  transform: perspective(1200px) rotateY(-1deg) rotateX(0deg);
}
@media (max-width: 1100px) {
  .mock-tilt-browser,
  .mock-tilt-dashboard {
    transform: none !important;
  }
}
```

- [ ] **Step 2: Verify CSS compiles**

```bash
cd /Users/skuser/Forma/forma-app
npm run build 2>&1 | tail -5
```

Expected: build completes without CSS errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add Tailwind v4 design tokens, keyframes, and custom utilities"
```

---

## Task 6: layout.tsx — Fonts, Metadata, Body

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-alt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORMA — Digital Craft Agency",
  description:
    "FORMA is a digital craft agency building high-converting landing pages, custom software, and mobile apps.",
  themeColor: "#0a0a09",
  openGraph: {
    title: "FORMA — Digital Craft Agency",
    description:
      "FORMA is a digital craft agency building high-converting landing pages, custom software, and mobile apps.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body
        className="grain bg-bk text-cr antialiased overflow-x-hidden"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify dev server starts**

```bash
cd /Users/skuser/Forma/forma-app
npm run dev
```

Page loads, background is `#0a0a09`. Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: configure fonts, metadata, and root layout"
```

---

## Task 7: BrowserMockup, DashboardMockup, PhoneMockup

**Files:**
- Create: `components/BrowserMockup.tsx`
- Create: `components/DashboardMockup.tsx`
- Create: `components/PhoneMockup.tsx`

These are pure server components — JSX-only wireframes with shimmer lines.

- [ ] **Step 1: Create BrowserMockup.tsx**

```tsx
// components/BrowserMockup.tsx
export default function BrowserMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-browser w-full max-w-[520px] bg-ds rounded-[10px] overflow-hidden"
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.06)",
      }}
    >
      {/* Browser bar */}
      <div
        className="h-9 bg-wd flex items-center px-3.5 gap-1.5"
        style={{ borderBottom: "1px solid rgba(240,235,227,.06)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,95,87,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,189,46,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(40,201,64,.6)" }} />
        <div
          className="ml-3 h-5 flex-1 max-w-[220px] rounded flex items-center px-2.5"
          style={{ background: "rgba(240,235,227,.04)", fontSize: "0.55rem", color: "var(--color-cd)" }}
        >
          forma.agency/project
        </div>
      </div>
      {/* Body */}
      <div className="p-6" style={{ minHeight: 300 }}>
        <div className="shimmer h-3.5 rounded w-[55%] mb-2" />
        <div className="shimmer h-3.5 rounded w-[35%] mb-6" style={{ background: "rgba(186,168,126,.08)" }} />
        <div
          className="w-full h-[120px] rounded-md mb-5"
          style={{ background: "linear-gradient(135deg,rgba(186,168,126,.12),rgba(196,169,106,.06))" }}
        />
        <div className="flex gap-3 mb-3">
          <div className="shimmer h-2 rounded flex-1" />
          <div className="shimmer h-2 rounded" style={{ flex: 0.6 }} />
        </div>
        <div className="flex gap-3 mb-3">
          <div className="shimmer h-2 rounded" style={{ flex: 0.3 }} />
          <div className="shimmer h-2 rounded flex-1" />
          <div className="shimmer h-2 rounded" style={{ flex: 0.6 }} />
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[70px] rounded flex flex-col items-center justify-center gap-1.5"
              style={{
                background: "rgba(240,235,227,.03)",
                border: "1px solid rgba(240,235,227,.05)",
              }}
            >
              <div className="w-4 h-4 rounded-full" style={{ background: "rgba(186,168,126,.15)" }} />
              <div className="w-[60%] h-[5px] rounded" style={{ background: "rgba(240,235,227,.06)" }} />
            </div>
          ))}
        </div>
        <div
          className="w-[100px] h-7 rounded mt-4"
          style={{ background: "var(--color-tn)", opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DashboardMockup.tsx**

```tsx
// components/DashboardMockup.tsx
const barHeights = ["45%", "70%", "55%", "85%", "40%", "95%", "60%"];

export default function DashboardMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-dashboard w-full max-w-[540px] bg-ds rounded-[10px] overflow-hidden"
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.06)",
      }}
    >
      {/* Browser bar */}
      <div
        className="h-9 bg-wd flex items-center px-3.5 gap-1.5"
        style={{ borderBottom: "1px solid rgba(240,235,227,.06)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,95,87,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,189,46,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(40,201,64,.6)" }} />
      </div>
      {/* Dash body */}
      <div className="grid md:grid-cols-[140px_1fr]" style={{ minHeight: 320 }}>
        {/* Sidebar — hidden on mobile */}
        <div
          className="hidden md:flex flex-col gap-1.5 p-4"
          style={{
            background: "rgba(240,235,227,.02)",
            borderRight: "1px solid rgba(240,235,227,.05)",
          }}
        >
          <div className="h-2 rounded w-[90%]" style={{ background: "var(--color-tn)", opacity: 0.5 }} />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div
            className="mt-2 mb-1"
            style={{ fontSize: "0.5rem", color: "var(--color-cd)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}
          >
            Analytics
          </div>
          <div className="shimmer h-2 rounded w-[80%]" />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div
            className="mt-2 mb-1"
            style={{ fontSize: "0.5rem", color: "var(--color-cd)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}
          >
            Settings
          </div>
          <div className="shimmer h-2 rounded w-[80%]" />
        </div>
        {/* Main */}
        <div className="p-4 flex flex-col gap-3.5">
          {/* Stat row */}
          <div className="flex gap-2.5">
            {[
              { val: "2,847", lbl: "Active Users" },
              { val: "94.2%", lbl: "Uptime" },
              { val: "$128k", lbl: "Revenue" },
            ].map((s) => (
              <div
                key={s.lbl}
                className="flex-1 h-14 rounded-md flex flex-col justify-between p-2.5"
                style={{ background: "rgba(240,235,227,.02)", border: "1px solid rgba(240,235,227,.05)" }}
              >
                <div
                  style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 700 }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: "0.45rem", color: "var(--color-cd)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div
            className="flex-1 rounded-md relative overflow-hidden"
            style={{
              background: "rgba(240,235,227,.02)",
              border: "1px solid rgba(240,235,227,.05)",
              minHeight: 100,
            }}
          >
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end gap-2" style={{ height: 80 }}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: h,
                    background:
                      i === 5
                        ? "linear-gradient(to top, var(--color-gd), rgba(196,169,106,.4))"
                        : "linear-gradient(to top, var(--color-tn), rgba(186,168,126,.3))",
                    opacity: i === 5 ? 0.7 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Table rows */}
          <div className="flex gap-2">
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
            <div className="shimmer h-1.5 rounded flex-1" />
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
          </div>
          <div className="flex gap-2">
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
            <div className="shimmer h-1.5 rounded flex-1" />
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create PhoneMockup.tsx**

```tsx
// components/PhoneMockup.tsx

function PhoneFrame({
  style,
  children,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 180,
        background: "var(--color-ds)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.08)",
        border: "2px solid rgba(240,235,227,.06)",
        ...style,
      }}
    >
      <div
        style={{
          width: 80,
          height: 20,
          background: "var(--color-bk)",
          borderRadius: "0 0 14px 14px",
          margin: "0 auto",
        }}
      />
      {children}
    </div>
  );
}

function PhoneScreen({ children, minHeight = 340 }: { children: React.ReactNode; minHeight?: number }) {
  return (
    <div style={{ padding: 14, minHeight, display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
    </div>
  );
}

function PhoneHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(186,168,126,.2)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 16, height: 1.5, background: "rgba(240,235,227,.3)", display: "block" }} />
        ))}
      </div>
    </div>
  );
}

function PhoneCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,rgba(186,168,126,.15),rgba(186,168,126,.05))",
        borderRadius: 10,
        padding: 14,
        border: "1px solid rgba(186,168,126,.1)",
      }}
    >
      <div style={{ fontSize: "0.45rem", color: "var(--color-cd)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, marginBottom: 2 }}>
        {value}
      </div>
    </div>
  );
}

function PhoneListItem() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(240,235,227,.04)" }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(240,235,227,.04)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ width: "70%", height: 6, background: "rgba(240,235,227,.1)", borderRadius: 2, display: "block" }} />
        <span style={{ width: "45%", height: 5, background: "rgba(240,235,227,.05)", borderRadius: 2, display: "block" }} />
      </div>
    </div>
  );
}

function PhoneTabs({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 6px", borderTop: "1px solid rgba(240,235,227,.05)", marginTop: "auto" }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 20, height: 20, borderRadius: 6,
            background: i === activeIndex ? "rgba(186,168,126,.25)" : "rgba(240,235,227,.05)",
          }}
        />
      ))}
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-end", justifyContent: "center" }}>
      {/* Left secondary */}
      <PhoneFrame style={{ opacity: 0.7, transform: "scale(0.9)" }} >
        <PhoneScreen>
          <PhoneHeader />
          <PhoneCard label="Portfolio" value="$24,580" />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneTabs activeIndex={0} />
        </PhoneScreen>
      </PhoneFrame>

      {/* Center primary */}
      <PhoneFrame style={{ width: 200, zIndex: 2, transform: "translateY(-20px)" }}>
        <PhoneScreen minHeight={380}>
          <PhoneHeader />
          <div style={{ fontSize: "0.5rem", color: "var(--color-cd)" }}>Good morning</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.75rem", fontWeight: 700, margin: "2px 0 8px" }}>
            Dashboard
          </div>
          <PhoneCard label="Total Balance" value="$148,320" />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneTabs activeIndex={0} />
        </PhoneScreen>
      </PhoneFrame>

      {/* Right secondary — hidden at 1100px */}
      <PhoneFrame
        style={{ transform: "scale(0.85)", opacity: 0.7 }}
      >
        <PhoneScreen>
          <PhoneHeader />
          <PhoneCard label="Activity" value="127 Tasks" />
          <PhoneListItem />
          <PhoneTabs activeIndex={1} />
        </PhoneScreen>
      </PhoneFrame>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/
git commit -m "feat: add BrowserMockup, DashboardMockup, PhoneMockup wireframe components"
```

---

## Task 8: Statement.tsx

**Files:**
- Create: `components/Statement.tsx`

- [ ] **Step 1: Create Statement.tsx**

```tsx
// components/Statement.tsx
import { ReactNode } from "react";
import BrowserMockup from "./BrowserMockup";
import DashboardMockup from "./DashboardMockup";
import PhoneMockup from "./PhoneMockup";

interface StatementProps {
  title: ReactNode;
  body: string;
  mockupType: "browser" | "dashboard" | "phones";
  dataSec: number;
}

const mockupMap = {
  browser: BrowserMockup,
  dashboard: DashboardMockup,
  phones: PhoneMockup,
};

export default function Statement({ title, body, mockupType, dataSec }: StatementProps) {
  const MockupComponent = mockupMap[mockupType];

  return (
    <section
      className="group"
      data-sec={dataSec}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "6rem",
        gap: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Text */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          className="rv"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h2>
        <p
          className="rv rv-d2"
          style={{
            fontFamily: "var(--font-serif-alt)",
            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            fontWeight: 300,
            color: "var(--color-cd)",
            marginTop: "2.5rem",
            maxWidth: 480,
            lineHeight: 1.8,
          }}
        >
          {body}
        </p>
      </div>

      {/* Mockup visual */}
      <div
        className="rv rv-d3"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: 400,
        }}
      >
        <MockupComponent />
      </div>

      {/* Tilt CSS is defined in globals.css via .mock-tilt, .mock-tilt-browser, .mock-tilt-dashboard */}
    </section>
  );
}
```

- [ ] **Step 2: Add responsive CSS to globals.css**

Append to `app/globals.css`:

```css
/* Statement responsive */
@media (max-width: 1100px) {
  [data-sec="1"],
  [data-sec="2"],
  [data-sec="3"] {
    grid-template-columns: 1fr !important;
    min-height: auto !important;
    padding: 5rem 2rem !important;
  }
}

@media (max-width: 768px) {
  [data-sec="1"],
  [data-sec="2"],
  [data-sec="3"] {
    padding: 5rem 2rem !important;
    gap: 3rem !important;
  }
}
```

- [ ] **Step 3: Add scroll-reveal utility to globals.css**

Append to `app/globals.css`:

```css
/* Scroll reveal */
.rv {
  opacity: 0;
  transform: translateY(45px);
  transition: opacity 0.9s var(--ease), transform 0.9s var(--ease);
}
.rv.vis {
  opacity: 1;
  transform: translateY(0);
}
.rv-d1 { transition-delay: 0.1s; }
.rv-d2 { transition-delay: 0.2s; }
.rv-d3 { transition-delay: 0.3s; }
.rv-d4 { transition-delay: 0.4s; }
```

- [ ] **Step 4: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Statement.tsx app/globals.css
git commit -m "feat: add Statement section component with mockup and scroll-reveal utilities"
```

---

## Task 9: Marquee.tsx

**Files:**
- Create: `components/Marquee.tsx`

- [ ] **Step 1: Create Marquee.tsx**

```tsx
// components/Marquee.tsx
const items = [
  { text: "Landing Pages", italic: false },
  { text: "Web Apps", italic: true },
  { text: "Mobile Apps", italic: false },
  { text: "Custom Software", italic: true },
  { text: "UI/UX Design", italic: false },
  { text: "Brand Identity", italic: true },
];

// Doubled for seamless loop
const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div
      aria-hidden="true"
      style={{
        padding: "3.5rem 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(240,235,227,.06)",
        borderBottom: "1px solid rgba(240,235,227,.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          animation: "marq 35s linear infinite",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: item.italic ? "1px var(--color-tn)" : "1px var(--color-cd)",
              padding: "0 2.5rem",
              flexShrink: 0,
              opacity: 0.35,
              fontStyle: item.italic ? "italic" : "normal",
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Marquee.tsx
git commit -m "feat: add infinite scrolling Marquee component"
```

---

## Task 10: ServiceCard.tsx + Services.tsx

**Files:**
- Create: `components/ServiceCard.tsx`
- Create: `components/Services.tsx`

- [ ] **Step 1: Create ServiceCard.tsx**

```tsx
// components/ServiceCard.tsx
"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  num: string;
  name: string;
  description: string;
  tags: string[];
  delay?: number;
}

export default function ServiceCard({ num, name, description, tags, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      className="rv"
      initial={false}
      whileHover="hovered"
      style={{ animationDelay: `${delay}s` }}
      animate="idle"
      variants={{
        idle: { backgroundColor: "var(--color-ds)" },
        hovered: { backgroundColor: "var(--color-wd)" },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      style={{
        padding: "3.5rem 2.8rem",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Gold top bar */}
      <motion.div
        variants={{
          idle: { scaleX: 0 },
          hovered: { scaleX: 1 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, var(--color-gd), var(--color-tn))",
          transformOrigin: "left",
        }}
      />

      {/* Radial glow */}
      <motion.div
        variants={{
          idle: { opacity: 0 },
          hovered: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 80%, rgba(196,169,106,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Arrow */}
      <motion.div
        variants={{
          idle: { borderColor: "rgba(240,235,227,.1)", scale: 1 },
          hovered: { borderColor: "var(--color-gd)", scale: 1.1 },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "3rem",
          right: "2.8rem",
          width: 32,
          height: 32,
          border: "1px solid rgba(240,235,227,.1)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth={1.5}>
          <motion.path
            d="M7 17L17 7M17 7H7M17 7v10"
            variants={{
              idle: { stroke: "var(--color-cd)" },
              hovered: { stroke: "var(--color-gd)" },
            }}
          />
        </svg>
      </motion.div>

      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-serif-alt)",
          fontSize: "0.8rem",
          color: "var(--color-tn)",
          letterSpacing: "0.15em",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {num}
      </div>

      {/* Name */}
      <h3
        dangerouslySetInnerHTML={{ __html: name }}
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 700,
          fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
          lineHeight: 1.25,
          marginBottom: "1.2rem",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontSize: "0.88rem",
          color: "var(--color-cd)",
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", position: "relative", zIndex: 1 }}>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            variants={{
              idle: { borderColor: "rgba(240,235,227,.1)", color: "var(--color-cd)" },
              hovered: { borderColor: "rgba(196,169,106,.35)", color: "var(--color-cr)" },
            }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.4rem 0.9rem",
              border: "1px solid rgba(240,235,227,.1)",
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create Services.tsx**

```tsx
// components/Services.tsx
import ServiceCard from "./ServiceCard";

const services = [
  {
    num: "01",
    name: "Landing Pages<br />&amp; Web Design",
    description:
      "High-conversion landing pages and marketing sites designed to capture attention and drive action. Every element is tested, every interaction is intentional.",
    tags: ["Conversion Optimization", "Responsive Design", "A/B Testing"],
  },
  {
    num: "02",
    name: "Custom Software<br />Development",
    description:
      "Bespoke software solutions built to solve the problems templates can't. From internal tools to customer-facing platforms — engineered for scale.",
    tags: ["Full-Stack", "Cloud Native", "API Design"],
  },
  {
    num: "03",
    name: "Mobile App<br />Development",
    description:
      "Native and cross-platform mobile applications that users actually want on their home screen. Smooth, fast, and beautifully crafted.",
    tags: ["iOS & Android", "Cross-Platform", "App Store"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-sec="4"
      style={{ padding: "10rem 6rem" }}
    >
      <div style={{ marginBottom: "5rem" }}>
        <p
          className="rv"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            marginBottom: "0.8rem",
          }}
        >
          What We Do
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            lineHeight: 1.1,
          }}
        >
          Craft That{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Converts</em>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {services.map((svc, i) => (
          <ServiceCard key={svc.num} {...svc} delay={i * 0.1} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #services { padding: 5rem 2rem !important; }
          #services [style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          #services { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/ServiceCard.tsx components/Services.tsx
git commit -m "feat: add Services section with animated ServiceCard hover effects"
```

---

## Task 11: Process.tsx

**Files:**
- Create: `components/Process.tsx`

- [ ] **Step 1: Create Process.tsx**

```tsx
// components/Process.tsx
const steps = [
  {
    num: "01",
    title: "Discover",
    desc: "We immerse ourselves in your world. Business goals, user needs, market landscape — every insight shapes the strategy.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Wireframes to high-fidelity prototypes. We design interfaces that feel inevitable — like they couldn't exist any other way.",
  },
  {
    num: "03",
    title: "Develop",
    desc: "Clean, scalable code with obsessive attention to performance. Every interaction is buttery smooth, every load is instant.",
  },
  {
    num: "04",
    title: "Deliver",
    desc: "Launch is just the beginning. We optimize, iterate, and refine based on real-world performance data.",
  },
];

export default function Process() {
  return (
    <section id="process" style={{ padding: "10rem 6rem", background: "var(--color-dk)" }}>
      <div style={{ textAlign: "center", marginBottom: "6rem" }}>
        <p
          className="rv"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            marginBottom: "0.8rem",
          }}
        >
          How We Work
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
          }}
        >
          Precision at{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Every</em> Step
        </h2>
      </div>

      <div className="proc-grid">
        {steps.map((step, i) => (
          <div key={step.num} className={`proc-step rv${i > 0 ? ` rv-d${i}` : ""}`}>
            <div className="proc-num">{step.num}</div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              {step.title}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-cd)", lineHeight: 1.7, fontWeight: 300 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .proc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        .proc-grid::before {
          content: '';
          position: absolute;
          top: 4rem;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(240,235,227,.1), transparent);
        }
        .proc-step {
          text-align: center;
          padding: 0 2rem;
          position: relative;
        }
        .proc-step::before {
          content: '';
          position: absolute;
          top: 3.65rem;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid var(--color-tn);
          background: var(--color-dk);
          z-index: 2;
          transition: background 0.4s ease;
        }
        .proc-step:hover::before { background: var(--color-tn); }
        .proc-num {
          font-family: var(--font-serif-alt);
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--color-tn);
          opacity: 0.5;
          line-height: 1;
          margin-bottom: 2.5rem;
          transition: opacity 0.4s ease;
        }
        .proc-step:hover .proc-num { opacity: 0.9; }

        @media (max-width: 768px) {
          #process { padding: 5rem 2rem !important; }
          .proc-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
          .proc-grid::before, .proc-step::before { display: none; }
          .proc-step { text-align: left; padding: 0; }
        }
        @media (max-width: 480px) {
          .proc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Process.tsx
git commit -m "feat: add Process 4-step timeline section"
```

---

## Task 12: Stats.tsx

**Files:**
- Create: `components/Stats.tsx`

- [ ] **Step 1: Create Stats.tsx**

```tsx
// components/Stats.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  decimal?: boolean;
}

const stats: Stat[] = [
  { target: 50, suffix: "+", label: "Projects Delivered" },
  { target: 3, suffix: "x", label: "Avg. Conversion Lift", decimal: true },
  { target: 98, suffix: "%", label: "Client Satisfaction" },
  { target: 12, suffix: "+", label: "Industries Served" },
];

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;

        const duration = 2000;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
          setValue(stat.target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.target]);

  const displayValue = stat.decimal ? value.toFixed(1) : Math.floor(value);

  return (
    <div
      ref={ref}
      className={`rv${delay > 0 ? ` rv-d${delay}` : ""}`}
      style={{
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "var(--color-ds)",
        transition: "background 0.4s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-wd)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-ds)")}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 900,
          fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
          lineHeight: 1,
          marginBottom: "0.6rem",
        }}
      >
        {displayValue}
        <span style={{ color: "var(--color-gd)" }}>{stat.suffix}</span>
      </div>
      <div
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--color-cd)",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function Stats() {
  return (
    <div
      className="stats-grid"
      style={{
        padding: "5rem 6rem",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 2,
      }}
    >
      {stats.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} delay={i} />
      ))}

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { padding: 3rem 2rem !important; grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Stats.tsx
git commit -m "feat: add Stats bar with animated counters (easeOutQuart)"
```

---

## Task 13: Trust.tsx

**Files:**
- Create: `components/Trust.tsx`

- [ ] **Step 1: Create Trust.tsx**

```tsx
// components/Trust.tsx
const logos = [
  "FinanceFlow",
  "Meridian Group",
  "NeuralDesk",
  "Harvest & Co",
  "Vaultline",
  "ONYX Digital",
];

export default function Trust() {
  return (
    <div
      className="rv"
      style={{
        padding: "5rem 6rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(240,235,227,.06)",
      }}
    >
      <p
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--color-cd)",
          marginBottom: "3rem",
          opacity: 0.5,
        }}
      >
        Trusted by companies across the region
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(2rem, 5vw, 5rem)",
          flexWrap: "wrap",
        }}
      >
        {logos.map((logo) => (
          <span
            key={logo}
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
              opacity: 0.2,
              transition: "opacity 0.4s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.5")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.2")}
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Trust.tsx
git commit -m "feat: add Trust client logo bar"
```

---

## Task 14: Testimonials.tsx

**Files:**
- Create: `components/Testimonials.tsx`

- [ ] **Step 1: Create Testimonials.tsx**

```tsx
// components/Testimonials.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  {
    text: "FORMA didn't just build our platform — they redefined what we thought was possible. The attention to craft is unmatched.",
    author: "Sarah Mitchell",
    role: "CEO, FinanceFlow",
  },
  {
    text: "Working with FORMA felt like having an in-house team that actually cared. Our conversion rate tripled in the first quarter after launch.",
    author: "Ahmed Karim",
    role: "Founder, Meridian Group",
  },
  {
    text: "They took a complex vision and turned it into the most intuitive app our users have ever experienced. Truly world-class work.",
    author: "Layla Hassan",
    role: "CTO, NeuralDesk",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startAuto() {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
  }

  useEffect(() => {
    startAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function goTo(i: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(i);
    startAuto();
  }

  return (
    <section
      id="testimonials"
      style={{ padding: "10rem 6rem", position: "relative", overflow: "hidden" }}
    >
      {/* Radial bg glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,106,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 850, margin: "0 auto", textAlign: "center" }}>
        {/* Opening quote */}
        <div
          className="rv"
          style={{
            fontFamily: "var(--font-serif-alt)",
            fontSize: "8rem",
            color: "var(--color-tn)",
            lineHeight: 0.4,
            opacity: 0.25,
            marginBottom: "2rem",
          }}
        >
          &ldquo;
        </div>

        {/* Slides */}
        <div style={{ position: "relative", minHeight: 220 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif-alt)",
                  fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  marginBottom: "2.5rem",
                }}
              >
                {testimonials[current].text}
              </p>
              <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {testimonials[current].author}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-cd)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                }}
              >
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginTop: "3rem" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Testimonial ${i + 1}`}
              style={{
                width: i === current ? 40 : 28,
                height: 2,
                background: i === current ? "var(--color-cr)" : "var(--color-cd)",
                opacity: i === current ? 1 : 0.3,
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #testimonials { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Testimonials.tsx
git commit -m "feat: add auto-rotating Testimonials slider with AnimatePresence crossfade"
```

---

## Task 15: FAQ.tsx

**Files:**
- Create: `components/FAQ.tsx`

- [ ] **Step 1: Create FAQ.tsx**

```tsx
// components/FAQ.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. A landing page typically takes 2–4 weeks. A custom software project or mobile app ranges from 2–5 months. We'll give you a clear timeline during our discovery phase.",
  },
  {
    q: "What's your pricing structure?",
    a: "We work on a project basis with transparent pricing. After our initial consultation, you'll receive a detailed proposal with fixed costs for each phase. No hidden fees.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Absolutely. We offer flexible maintenance and support packages. Whether you need bug fixes, feature updates, or performance monitoring — we're here for the long run.",
  },
  {
    q: "What technologies do you work with?",
    a: "We're technology-agnostic. Our stack commonly includes React, Next.js, .NET, Flutter, React Native, Node.js, and cloud platforms like AWS and Azure.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes. We regularly integrate with in-house teams. Whether it's a handoff, co-development, or augmenting your workflow — we fit seamlessly into your process.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section style={{ padding: "10rem 6rem" }}>
      <div style={{ marginBottom: "5rem" }}>
        <p
          className="rv"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            marginBottom: "0.8rem",
          }}
        >
          Common Questions
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
          }}
        >
          Frequently{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Asked</em>
        </h2>
      </div>

      <div style={{ maxWidth: 800 }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`rv rv-d${i}`}
            style={{ borderBottom: "1px solid rgba(240,235,227,.08)" }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.8rem 0",
                cursor: "pointer",
                gap: "2rem",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                color: openIndex === i ? "var(--color-tn)" : "var(--color-cr)",
                fontWeight: 400,
                transition: "color 0.3s ease",
              }}
            >
              {faq.q}
              {/* Plus/minus icon */}
              <span
                style={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 1,
                    background: "var(--color-cd)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 12,
                    background: "var(--color-cd)",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${openIndex === i ? 90 : 0}deg)`,
                    opacity: openIndex === i ? 0 : 1,
                    transition: "transform 0.4s var(--ease), opacity 0.3s ease",
                  }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      padding: "0 0 1.8rem",
                      fontSize: "0.88rem",
                      color: "var(--color-cd)",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          section:has(.faq-list) { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/FAQ.tsx
git commit -m "feat: add FAQ accordion with AnimatePresence height animation"
```

---

## Task 16: Contact.tsx

**Files:**
- Create: `components/Contact.tsx`

- [ ] **Step 1: Create Contact.tsx**

```tsx
// components/Contact.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(240,235,227,.15)",
    padding: "0.8rem 0",
    fontFamily: "var(--font-sans)",
    fontSize: "0.95rem",
    color: "var(--color-cr)",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.68rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--color-cd)",
    marginBottom: "0.6rem",
  };

  return (
    <section
      id="contact"
      style={{ padding: "10rem 6rem", position: "relative", overflow: "hidden" }}
    >
      {/* Bg glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,106,.04), transparent 65%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* CTA Left */}
        <div>
          <p
            className="rv"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--color-cd)",
              marginBottom: "1.5rem",
            }}
          >
            Ready?
          </p>
          <h2
            className="rv rv-d1"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            Build Something
            <br />
            That{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Lasts.</em>
          </h2>
          <p
            className="rv rv-d2"
            style={{
              fontFamily: "var(--font-serif-alt)",
              fontSize: "1.1rem",
              color: "var(--color-cd)",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: 400,
            }}
          >
            Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rv rv-d2"
              style={{ display: "flex", flexDirection: "column", gap: "1.8rem", paddingTop: "1rem" }}
            >
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <div>
                <label style={labelStyle}>Project Type</label>
                <input
                  type="text"
                  placeholder="Landing page, app, software…"
                  value={form.projectType}
                  onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <div>
                <label style={labelStyle}>Tell Us More</label>
                <textarea
                  rows={4}
                  placeholder="Describe your project…"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: "none", minHeight: 100 }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "1.1rem 3rem",
                  border: "1px solid var(--color-cr)",
                  color: "var(--color-cr)",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 400,
                  marginTop: "0.5rem",
                  transition: "color 0.4s ease, background 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-cr)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-bk)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--color-cr)";
                }}
              >
                Send Message
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "3rem",
                minHeight: 300,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "2px solid var(--color-gd)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gd)" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  marginBottom: "0.8rem",
                }}
              >
                Message Sent
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--color-cd)", lineHeight: 1.6 }}>
                Thank you. We'll get back to you within 24 hours.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #contact > div { grid-template-columns: 1fr !important; gap: 4rem !important; }
        }
        @media (max-width: 768px) {
          #contact { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Contact.tsx
git commit -m "feat: add Contact form with AnimatePresence success state"
```

---

## Task 17: Footer.tsx

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Create Footer.tsx**

```tsx
// components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ padding: "5rem 6rem 2.5rem", borderTop: "1px solid rgba(240,235,227,.08)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "4rem",
          marginBottom: "5rem",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            FORMA
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-cd)", lineHeight: 1.7, maxWidth: 280 }}>
            Digital craft agency specializing in landing pages, custom software, and mobile applications.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Services
          </h4>
          {["Landing Pages", "Custom Software", "Mobile Apps", "UI/UX Design"].map((item) => (
            <a
              key={item}
              href="#services"
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Company
          </h4>
          {[
            { label: "About", href: "#hero" },
            { label: "Careers", href: "#contact" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Get in Touch */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Get in Touch
          </h4>
          {[
            { label: "hello@forma.agency", href: "mailto:hello@forma.agency" },
            { label: "+20 123 456 7890", href: "#" },
            { label: "Giza, Egypt", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(240,235,227,.06)",
        }}
      >
        <p style={{ fontSize: "0.7rem", color: "var(--color-cd)" }}>
          &copy; 2026 FORMA. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "1.8rem" }}>
          {["LinkedIn", "Dribbble", "Instagram", "X"].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-cd)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
            >
              {social}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 768px) {
          footer { padding: 3rem 2rem 2rem !important; }
          footer > div:first-child { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          footer > div:last-child { flex-direction: column !important; gap: 1.5rem !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Footer.tsx
git commit -m "feat: add 4-column Footer with responsive layout"
```

---

## Task 18: SideDots.tsx

**Files:**
- Create: `components/SideDots.tsx`

- [ ] **Step 1: Create SideDots.tsx**

```tsx
// components/SideDots.tsx
"use client";

import { useEffect, useState } from "react";

const sectionIds = ["hero", null, null, null, "services"];
// data-sec 0=hero, 1=stmt-browser, 2=stmt-dashboard, 3=stmt-phones, 4=services

export default function SideDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-sec]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.sec ?? "0");
            setActive(idx);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(idx: number) {
    const target = document.querySelector<HTMLElement>(`[data-sec="${idx}"]`);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      data-sidedots=""
      style={{
        position: "fixed",
        right: "3.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          aria-label={`Navigate to section ${i + 1}`}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            border: "1px solid var(--color-cd)",
            background: active === i ? "var(--color-cr)" : "transparent",
            cursor: "pointer",
            padding: 0,
            transform: active === i ? "scale(1.4)" : "scale(1)",
            borderColor: active === i ? "var(--color-cr)" : "var(--color-cd)",
            transition: "all 0.4s ease",
          }}
        />
      ))}

      <style>{`
        @media (max-width: 768px) {
          /* SideDots hidden on mobile */
          [data-sidedots] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/SideDots.tsx
git commit -m "feat: add SideDots fixed navigation"
```

---

## Task 19: BackToTop.tsx + WhatsApp.tsx

**Files:**
- Create: `components/BackToTop.tsx`
- Create: `components/WhatsApp.tsx`

- [ ] **Step 1: Create BackToTop.tsx**

```tsx
// components/BackToTop.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: "2.5rem",
            right: "3.5rem",
            zIndex: 900,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(240,235,227,.15)",
            background: "rgba(10,10,9,.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          whileHover={{ borderColor: "var(--color-gd)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cd)" strokeWidth={1.5}>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create WhatsApp.tsx**

```tsx
// components/WhatsApp.tsx
export default function WhatsApp() {
  return (
    <a
      href="https://wa.me/201234567890"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="wa-float"
      style={{
        position: "fixed",
        bottom: "2.5rem",
        left: "2.5rem",
        zIndex: 900,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#25d366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(37,211,102,.3)",
        transition: "transform 0.3s var(--ease)",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/BackToTop.tsx components/WhatsApp.tsx
git commit -m "feat: add BackToTop and WhatsApp floating buttons"
```

---

## Task 20: Navbar.tsx

**Files:**
- Create: `components/Navbar.tsx`

- [ ] **Step 1: Create Navbar.tsx**

```tsx
// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    closeMenu();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5000,
          padding: scrolled ? "1rem 4rem" : "2rem 4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(10,10,9,.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "padding 0.4s ease, background 0.4s ease",
        }}
      >
        <a
          href="#"
          onClick={(e) => handleAnchorClick(e, "#hero")}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "1.35rem",
            letterSpacing: "0.06em",
          }}
        >
          FORMA
        </a>

        {/* Desktop nav */}
        <ul
          style={{
            display: "flex",
            gap: "2.8rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="nav-links"
        >
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-cd)",
                  fontWeight: 400,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          onClick={(e) => handleAnchorClick(e, "#contact")}
          className="nav-cta-btn"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 400,
            padding: "0.7rem 2rem",
            border: "1px solid var(--color-cd)",
            color: "var(--color-cr)",
            transition: "color 0.4s ease, background 0.4s ease, border-color 0.4s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "var(--color-cr)";
            el.style.color = "var(--color-bk)";
            el.style.borderColor = "var(--color-cr)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = "var(--color-cr)";
            el.style.borderColor = "var(--color-cd)";
          }}
        >
          Start a Project
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="hamburger-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 28,
            height: 20,
            position: "relative",
            zIndex: 5001,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(9.5px) rotate(45deg)" : "none",
              transition: "transform 0.35s var(--ease)",
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.35s var(--ease)",
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(-9.5px) rotate(-45deg)" : "none",
              transition: "transform 0.35s var(--ease)",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 4999,
              background: "var(--color-bk)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.5rem",
            }}
          >
            {[...navLinks, { label: "Testimonials", href: "#testimonials" }].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "var(--color-cr)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget).style.color = "var(--color-tn)")}
                onMouseLeave={(e) => ((e.currentTarget).style.color = "var(--color-cr)")}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 1.5rem 2rem !important; }
          .nav-links, .nav-cta-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Navbar.tsx
git commit -m "feat: add Navbar with scroll blur, hamburger menu, and mobile overlay"
```

---

## Task 21: Hero.tsx

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Create Hero.tsx**

```tsx
// components/Hero.tsx
"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 800], [0, 280]);
  const opacity = useTransform(scrollY, [0, 560], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      data-sec="0"
      style={{
        height: "100vh",
        minHeight: 600,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Video background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }}
        >
          <source src="/Creative-Spark-Design-Mar-29-10-19-29.mp4" type="video/mp4" />
        </video>
        {/* Radial vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 50%, transparent 0%, var(--color-bk) 72%)",
          }}
        />
      </div>

      {/* Hero content — parallax wrapper */}
      <motion.div
        style={{ y, opacity }}
        className="hero-content"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: {} }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            willChange: "transform, opacity",
          }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.55em",
              textTransform: "uppercase",
              color: "var(--color-cd)",
              marginBottom: "1.8rem",
            }}
          >
            Digital Craft Agency
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(4.5rem, 14vw, 13rem)",
              lineHeight: 0.88,
              letterSpacing: "0.02em",
            }}
          >
            FORMA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: "var(--font-serif-alt)",
              fontSize: "clamp(0.95rem, 1.5vw, 1.2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--color-cd)",
              marginTop: "2rem",
            }}
          >
            Build something that lasts.
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.7rem",
        }}
      >
        <span
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
          }}
        >
          Scroll
        </span>
        <div
          className="scroll-pulse"
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, var(--color-cd), transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add components/Hero.tsx
git commit -m "feat: add Hero section with video background and Framer Motion parallax"
```

---

## Task 22: page.tsx — Wire Everything Together

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Add scroll-reveal IntersectionObserver to layout or page**

Create a client component for the scroll observer:

```tsx
// components/ScrollReveal.tsx
"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
```

- [ ] **Step 2: Replace app/page.tsx**

```tsx
// app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Trust from "@/components/Trust";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SideDots from "@/components/SideDots";
import BackToTop from "@/components/BackToTop";
import WhatsApp from "@/components/WhatsApp";
import ScrollReveal from "@/components/ScrollReveal";

function Divider() {
  return (
    <div style={{ padding: "0 6rem" }}>
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(240,235,227,.12), transparent)",
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <Hero />

      <Statement
        dataSec={1}
        title={
          <>
            We Design
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Pages That</em>
            <br />
            Convert.
          </>
        }
        body="Every pixel earns its place. We craft landing pages that don't just look stunning — they drive measurable results."
        mockupType="browser"
      />
      <Divider />

      <Statement
        dataSec={2}
        title={
          <>
            Custom Software.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Zero
            <br />
            Compromise.</em>
          </>
        }
        body="Engineered from the ground up. Scalable, secure, and shaped precisely to your business logic."
        mockupType="dashboard"
      />
      <Divider />

      <Statement
        dataSec={3}
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Mobile-First.</em>
            <br />
            Always.
          </>
        }
        body="Your users live on their phones. We build native and cross-platform apps that feel effortless from the first tap."
        mockupType="phones"
      />

      <Marquee />
      <Services />
      <Process />
      <Stats />
      <Trust />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />

      <SideDots />
      <BackToTop />
      <WhatsApp />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/skuser/Forma/forma-app
git add app/page.tsx components/ScrollReveal.tsx
git commit -m "feat: wire all sections in page.tsx, add ScrollReveal observer"
```

---

## Task 23: Final Verification

- [ ] **Step 1: Run dev server and verify all sections render**

```bash
cd /Users/skuser/Forma/forma-app
npm run dev
```

Visit `http://localhost:3000` and check:
- [ ] Background is `#0a0a09` (dark charcoal)
- [ ] Hero video plays at low opacity with FORMA title in large serif italic
- [ ] Scrolling reveals each section with fade-up animation
- [ ] Marquee scrolls infinitely
- [ ] Service cards show gold bar on hover
- [ ] Stats count up when scrolled into view
- [ ] Testimonials auto-rotate every 5s
- [ ] FAQ accordion opens/closes one at a time
- [ ] Contact form shows success state after submit
- [ ] Hamburger menu works on mobile (resize to 768px)
- [ ] Side dots update as you scroll
- [ ] Back-to-top appears after scrolling down 600px
- [ ] WhatsApp button floats on bottom-left

- [ ] **Step 2: Run production build**

```bash
cd /Users/skuser/Forma/forma-app
npm run build
```

Expected output ends with:
```
✓ Compiled successfully
Route (app)  ...
```

No TypeScript errors, no CSS errors.

- [ ] **Step 3: Final commit**

```bash
cd /Users/skuser/Forma/forma-app
git add -A
git commit -m "feat: complete FORMA landing page — pixel-perfect Next.js 15 conversion"
```
