# E-Commerce Service Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add e-commerce as FORMA's 4th service offering — a new Statement section with a checkout card mockup, a matching service card, and updated section numbering.

**Architecture:** Extend the existing `Statement` component with a new `"cart"` mockup type backed by a new `CartMockup` component. Insert it as the 2nd statement in `page.tsx`. Add a matching entry to the `Services` grid. Bump all downstream `data-sec` attributes by 1.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (CSS-first config), inline styles matching existing patterns.

**Spec:** `docs/superpowers/specs/2026-04-01-ecommerce-service-design.md`

---

### Task 1: Create CartMockup component

**Files:**
- Create: `forma-app/components/CartMockup.tsx`

This component renders a floating checkout card mockup. It follows the same patterns as `BrowserMockup.tsx` and `DashboardMockup.tsx`: a self-contained presentational component using Tailwind utility classes + inline styles, the site's design tokens, and the `mock-tilt` CSS class for 3D hover effect.

- [ ] **Step 1: Create `CartMockup.tsx`**

```tsx
// components/CartMockup.tsx
export default function CartMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-cart w-full max-w-[340px] bg-ds rounded-[14px] overflow-hidden"
      style={{
        boxShadow:
          "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(240,235,227,.06)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--color-cr)",
          }}
        >
          Your Cart
        </span>
        <span
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
          }}
        >
          3 items
        </span>
      </div>

      {/* Line items */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {[
          { name: "Essential Tee", price: "$49.00" },
          { name: "Leather Folio", price: "$89.00" },
          { name: "Signal Watch", price: "$249.00" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 pb-3"
            style={{
              borderBottom:
                i < 2 ? "1px solid rgba(240,235,227,.06)" : "none",
            }}
          >
            {/* Product thumbnail */}
            <div
              className="w-10 h-10 rounded-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(186,168,126,.15), rgba(196,169,106,.06))",
              }}
            />
            {/* Name */}
            <div className="flex-1">
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-cr)",
                  fontWeight: 500,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "var(--color-cd)",
                  marginTop: 2,
                }}
              >
                Qty: 1
              </div>
            </div>
            {/* Price */}
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-tn)",
                fontWeight: 600,
                fontFamily: "var(--font-serif-alt)",
              }}
            >
              {item.price}
            </div>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div
        className="px-5 pb-5 pt-2"
        style={{ borderTop: "1px solid rgba(240,235,227,.06)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--color-cd)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--color-tn)",
            }}
          >
            $387.00
          </span>
        </div>
        <div
          className="w-full rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-gd), var(--color-tn))",
            padding: "0.7rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-bk)",
          }}
        >
          Checkout
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add `.mock-tilt-cart` CSS to `globals.css`**

Add the tilt style right after the existing `.mock-tilt-dashboard` block (line 133 of `globals.css`):

```css
.mock-tilt-cart {
  transform: perspective(1200px) rotateY(-3deg) rotateX(2deg);
}
```

Then add `.mock-tilt-cart` to the existing hover and media query rules. The hover rule at line 135 becomes:

```css
.group:hover .mock-tilt-browser,
.group:hover .mock-tilt-dashboard,
.group:hover .mock-tilt-cart {
  transform: perspective(1200px) rotateY(-1deg) rotateX(0deg);
}
```

The media query at line 139 becomes:

```css
@media (max-width: 1100px) {
  .mock-tilt-browser,
  .mock-tilt-dashboard,
  .mock-tilt-cart {
    transform: none !important;
  }
}
```

- [ ] **Step 3: Verify the dev server shows no errors**

Run: check the terminal running `npm run dev` for compilation errors.
Expected: no errors, clean compilation.

- [ ] **Step 4: Commit**

```bash
git add forma-app/components/CartMockup.tsx forma-app/app/globals.css
git commit -m "feat: add CartMockup component for e-commerce statement"
```

---

### Task 2: Extend Statement component to support cart mockup

**Files:**
- Modify: `forma-app/components/Statement.tsx`

- [ ] **Step 1: Add cart import and mockup type**

In `Statement.tsx`, add the import at line 4 (after the PhoneMockup import):

```tsx
import CartMockup from "./CartMockup";
```

Update the `mockupType` in the interface (line 10):

```tsx
mockupType: "browser" | "dashboard" | "phones" | "cart";
```

Add `cart` to `mockupMap` (after line 17):

```tsx
const mockupMap = {
  browser: BrowserMockup,
  dashboard: DashboardMockup,
  phones: PhoneMockup,
  cart: CartMockup,
};
```

- [ ] **Step 2: Verify clean compilation**

Check dev server terminal for errors.
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add forma-app/components/Statement.tsx
git commit -m "feat: extend Statement component with cart mockup type"
```

---

### Task 3: Add e-commerce Statement to page and update data-sec numbering

**Files:**
- Modify: `forma-app/app/page.tsx`
- Modify: `forma-app/components/Services.tsx` (data-sec only)
- Modify: `forma-app/components/Process.tsx` (data-sec only)
- Modify: `forma-app/components/Stats.tsx` (data-sec only)
- Modify: `forma-app/components/Testimonials.tsx` (data-sec only)
- Modify: `forma-app/components/FAQ.tsx` (data-sec only)
- Modify: `forma-app/components/Contact.tsx` (data-sec only)

- [ ] **Step 1: Insert e-commerce Statement in `page.tsx`**

After the first Statement block (Landing Pages, ending at line 52 with `<Divider />`), insert:

```tsx
      <Statement
        dataSec={2}
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Sell More.</em>
            <br />
            Effortlessly.
          </>
        }
        body="We build online stores that do the selling for you — from product pages to checkout, optimized for every click."
        mockupType="cart"
      />
      <Divider />
```

- [ ] **Step 2: Update dataSec on remaining Statements in `page.tsx`**

Custom Software Statement: change `dataSec={2}` to `dataSec={3}`
Mobile Apps Statement: change `dataSec={3}` to `dataSec={4}`

- [ ] **Step 3: Update data-sec in downstream section components**

Each file has a single `data-sec` attribute to bump by 1:

| File | Old | New |
|------|-----|-----|
| `Services.tsx` | `data-sec="4"` | `data-sec="5"` |
| `Process.tsx` | `data-sec="5"` | `data-sec="6"` |
| `Stats.tsx` | `data-sec="6"` | `data-sec="7"` |
| `Testimonials.tsx` | `data-sec="7"` | `data-sec="8"` |
| `FAQ.tsx` | `data-sec="8"` | `data-sec="9"` |
| `Contact.tsx` | `data-sec="9"` | `data-sec="10"` |

- [ ] **Step 4: Verify clean compilation and check the page**

Check dev server terminal for errors. Open http://localhost:3000 and scroll to verify the new e-commerce Statement appears in position 2 with the cart mockup, and side dots still work correctly.
Expected: 4 statement sections in order, all with working scroll reveal and tilt effects, side dots highlighting correctly.

- [ ] **Step 5: Commit**

```bash
git add forma-app/app/page.tsx forma-app/components/Services.tsx forma-app/components/Process.tsx forma-app/components/Stats.tsx forma-app/components/Testimonials.tsx forma-app/components/FAQ.tsx forma-app/components/Contact.tsx
git commit -m "feat: add e-commerce statement section and update data-sec numbering"
```

---

### Task 4: Add e-commerce service card to Services grid

**Files:**
- Modify: `forma-app/components/Services.tsx`

- [ ] **Step 1: Insert e-commerce service and renumber**

Replace the `services` array in `Services.tsx` with:

```tsx
const services = [
  {
    num: "01",
    name: "Landing Pages<br />&amp; Web Design",
    description:
      "Landing pages and marketing sites that turn visitors into customers. Every element tested, every interaction intentional.",
    tags: ["Conversion Optimization", "Responsive Design", "A/B Testing"],
  },
  {
    num: "02",
    name: "E-Commerce<br />Solutions",
    description:
      "Online stores built to convert — from product catalogs to checkout flows, every interaction designed to drive revenue.",
    tags: ["E-Commerce Platforms", "Payment Gateways", "Conversion"],
  },
  {
    num: "03",
    name: "Custom Software<br />Development",
    description:
      "Custom software built to solve the problems templates can't. From internal tools to customer-facing platforms — engineered for scale.",
    tags: ["Full-Stack", "Cloud Native", "API Design"],
  },
  {
    num: "04",
    name: "Mobile App<br />Development",
    description:
      "Native and cross-platform mobile applications that users actually want on their home screen. Smooth, fast, and beautifully crafted.",
    tags: ["iOS & Android", "Cross-Platform", "App Store"],
  },
];
```

- [ ] **Step 2: Update grid to 4 columns**

Change `gridTemplateColumns: "repeat(3, 1fr)"` to `gridTemplateColumns: "repeat(4, 1fr)"`.

- [ ] **Step 3: Verify the Services section**

Open http://localhost:3000 and scroll to the Services grid. Verify 4 cards show in a row on desktop, collapse to single column at 1100px, and all hover effects work.
Expected: 4 cards, numbered 01-04, all with working gold bar + glow hover effects.

- [ ] **Step 4: Commit**

```bash
git add forma-app/components/Services.tsx
git commit -m "feat: add e-commerce card to services grid"
```
