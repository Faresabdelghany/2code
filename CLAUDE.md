# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (runs on :3001 if :3000 is occupied)
npm run build    # Production build
npm run lint     # ESLint
```

There are no tests in this project.

## Architecture

Single-page marketing site for FORMA agency. All content lives in one route (`app/page.tsx`), which composes every section in order. There are no other routes.

**Component responsibilities:**
- `ScrollReveal` — mounts a global `IntersectionObserver` that adds `.vis` to any `.rv` element when it enters the viewport. It must be rendered before other components to catch early mounts.
- `SideDots` — fixed navigation dots driven by `data-sec={n}` attributes on each section. Add `data-sec` to any new full-screen section to include it in dot navigation.
- `Statement` — reusable split-screen section (text left, mockup right) used for the three service statements. Accepts `mockupType: "browser" | "dashboard" | "phones"` and a `dataSec` number.

## Design System

All tokens are defined in `app/globals.css` under `@theme` (Tailwind v4 syntax):

| Token | Value | Usage |
|---|---|---|
| `--color-bk` | `#0a0a09` | Page background |
| `--color-cr` | `#f0ebe3` | Primary text / cream |
| `--color-cd` | `#9e9789` | Muted text |
| `--color-tn` | `#baa87e` | Accent (tan/gold) |
| `--color-gd` | `#c4a96a` | Gold highlight |

**Fonts** (loaded via `next/font/google`, exposed as CSS variables):
- `--font-serif` → Playfair Display (headings)
- `--font-sans` → DM Sans (body/UI)
- `--font-serif-alt` → Cormorant Garamond (subheadings, descriptive text)

## Animation Patterns

Two systems are used — do not mix them arbitrarily:

**1. CSS scroll reveal** — for most sections. Add `className="rv"` to any element; `ScrollReveal` handles the rest. Use `rv-d1` through `rv-d4` for staggered delays.

**2. Framer Motion** — for the Hero section only (complex spring + shatter choreography). Uses `useInView({ once: false })` so animations replay on re-entry. The `useMotionValue` + `animate()` imperative API drives the "We … Convert." slide-in; `ShatterLetters` fires when "We" lands within 30px of its target.

The `--ease` CSS variable (`cubic-bezier(0.16, 1, 0.3, 1)`) and the JS `ease` constant in `Hero.tsx` must stay in sync if either is changed.

## Responsive Breakpoints

Handled with inline `@media` blocks scoped inside component `<style>` tags or in `globals.css`. Key breakpoints: `1100px` (Statement collapses to single column, 3D tilts disabled), `768px` (padding reduction, SideDots hidden), `480px` (Stats grid single column).
