# E-Commerce Service Addition — Design Spec

## Overview

Add e-commerce as FORMA's 4th service offering. This includes a new full-screen Statement section with a checkout card mockup, a matching service card in the Services grid, and updated section numbering throughout the page.

## Position in Page Flow

Insert after Landing Pages (position 2), before Custom Software:

1. Landing Pages (dataSec=1) — browser mockup
2. **E-Commerce (dataSec=2) — cart mockup** ← NEW
3. Custom Software (dataSec=3) — dashboard mockup (was dataSec=2)
4. Mobile Apps (dataSec=4) — phones mockup (was dataSec=3)

## Changes

### 1. New Component: `components/CartMockup.tsx`

A floating checkout card mockup using the site's design tokens:

- **Layout:** Centered card with rounded corners, subtle border (`rgba(240,235,227,.08)`)
- **Content:**
  - "Your Cart" header in `--color-cr`
  - 2–3 line items: placeholder product thumbnail (dark box), product name in `--color-cd`, price in `--color-tn`
  - Divider lines between items
  - Total row: label in `--color-cr`, amount in `--color-tn`
  - "Checkout" button: `--color-gd` background, `--color-bk` text, rounded
- **3D tilt:** Apply `.mock-tilt` class for the hover tilt effect (defined in `globals.css`), disabled below 1100px per existing responsive behavior
- **Scroll reveal:** Use `rv` / `rv-d*` classes for staggered entrance animation

### 2. Update `components/Statement.tsx`

- Extend `mockupType` union to `"browser" | "dashboard" | "phones" | "cart"`
- Import `CartMockup`
- Add `cart: CartMockup` to `mockupMap`

### 3. Update `app/page.tsx`

Insert new Statement block after the first Statement (Landing Pages):

```tsx
<Statement
  dataSec={2}
  title={<>
    <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Sell More.</em>
    <br />Effortlessly.
  </>}
  body="We build online stores that do the selling for you — from product pages to checkout, optimized for every click."
  mockupType="cart"
/>
<Divider />
```

Update existing statements:
- Custom Software: `dataSec={2}` → `dataSec={3}`
- Mobile Apps: `dataSec={3}` → `dataSec={4}`

Update downstream `data-sec` attributes (all +1):
- Services: `data-sec="4"` → `"5"` (in `Services.tsx`)
- Process: `data-sec="5"` → `"6"` (in `Process.tsx`)
- Stats: `data-sec="6"` → `"7"` (in `Stats.tsx`)
- Testimonials: `data-sec="7"` → `"8"` (in `Testimonials.tsx`)
- FAQ: `data-sec="8"` → `"9"` (in `FAQ.tsx`)
- Contact: `data-sec="9"` → `"10"` (in `Contact.tsx`)

### 4. Update `components/Services.tsx`

Insert e-commerce as service `"02"`, renumber existing:

```
01 — Landing Pages & Web Design (unchanged)
02 — E-Commerce Solutions (NEW)
     Description: "Online stores built to convert — from product catalogs to checkout flows, every interaction designed to drive revenue."
     Tags: ["E-Commerce Platforms", "Payment Gateways", "Conversion"]
03 — Custom Software Development (was 02)
04 — Mobile App Development (was 03)
```

Update grid: `gridTemplateColumns: "repeat(4, 1fr)"` on desktop. Existing `1100px` breakpoint already collapses to `1fr`.

Update `data-sec` on the section: `"4"` → `"5"`.

### 5. No Changes Required

- **`SideDots`** — driven by `data-sec` attributes, auto-discovers sections
- **`ScrollReveal`** — already handles any `.rv` elements
- **`globals.css`** — existing tokens and tilt styles are sufficient
- **Responsive breakpoints** — existing media queries in Statement handle single-column collapse

## Out of Scope

- No new routes
- No new fonts or color tokens
- No changes to Hero, Marquee, Process, Stats, Trust, Testimonials, FAQ, Contact, or Footer
