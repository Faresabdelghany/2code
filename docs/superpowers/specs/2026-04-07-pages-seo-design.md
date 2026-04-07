# Pages & SEO — Design Spec

**Date:** 2026-04-07
**Scope:** SEO editor in admin + dynamic URL routing for existing pages

## Context

The Forma CMS already has `meta_title`, `meta_description`, and `og_image` fields on the `pages` table, but the admin panel exposes no editor for them. The public site hardcodes `eq("slug", "home")` in `app/page.tsx` — there is no dynamic route for other pages that exist in the database. This spec adds both capabilities.

## 1. Shared Page Rendering Module

**File:** `lib/render-page.tsx`

Extract the following from `app/page.tsx` into a shared module:

### Exports

| Export | Signature | Purpose |
|---|---|---|
| `fetchPageBySlug` | `(slug: string) => Promise<{ page, sections, settings }>` | Fetch page + visible sections + settings from Supabase |
| `renderPageContent` | `(sections, settings, options: { showSideDots: boolean }) => JSX.Element` | The full page renderer (Navbar, sections, Footer, etc.) |
| `buildJsonLd` | `(sections, settings) => object[]` | Structured data for SEO |
| `generatePageMetadata` | `(page: Page \| null) => Metadata` | Generates Next.js `Metadata` from page SEO fields |

### Behavior

- `fetchPageBySlug` reuses the existing caching pattern (`cache()` from React).
- `renderPageContent` accepts an `options` object. When `showSideDots` is `false`, the `<SideDots />` component is not rendered. All other elements (Navbar, Footer, BackToTop, WhatsApp, ScrollReveal) render on every page.
- `generatePageMetadata` uses `page.meta_title`, `page.meta_description`, and `page.og_image` with sensible fallbacks (the existing hardcoded defaults).

### Migration of `app/page.tsx`

`app/page.tsx` becomes a thin wrapper:

```tsx
import { fetchPageBySlug, renderPageContent, generatePageMetadata } from "@/lib/render-page";

export async function generateMetadata() {
  const { page } = await fetchPageBySlug("home");
  return generatePageMetadata(page);
}

export default async function Home({ searchParams }) {
  const { page, sections, settings } = await fetchPageBySlug("home");
  // ... preview logic stays ...
  return renderPageContent(sections, settings, { showSideDots: true });
}
```

All helper functions (`getSectionContent`, `getSectionId`, `getSectionsByType`, `getSettingValue`, `buildStatementTitle`, `defaultStatements`, `Divider`) move into `lib/render-page.tsx`. The preview logic and `PreviewPage` import stay in `app/page.tsx`.

## 2. Dynamic Route — `app/[slug]/page.tsx`

**File:** `app/[slug]/page.tsx`

### Behavior

1. Extract `slug` from route params.
2. If `slug === "home"` → `redirect("/")` (prevents duplicate content at `/home`).
3. If `slug === "admin"` — not needed, the explicit `app/admin/` route takes precedence in Next.js App Router.
4. Call `fetchPageBySlug(slug)`.
5. If `page` is null → `notFound()`.
6. Generate metadata via `generatePageMetadata(page)`.
7. Render via `renderPageContent(sections, settings, { showSideDots: false })`.

### Preview support

The `[slug]` route supports the same `?preview=true` query param as the home page, rendering via `<PreviewPage>` when active.

## 3. SEO Editor — Admin Panel

**File:** `components/admin/SeoEditor.tsx` (new client component)

### Location

Rendered on the page detail view (`app/admin/pages/[id]/page.tsx`), between the page heading/slug and the "Sections" list. The page detail view itself remains a server component — it passes `page` data as props to `SeoEditor`.

### Fields

| Field | Input Type | Character Guidance |
|---|---|---|
| Meta Title | Text input | Green ≤60, yellow 61-70, red >70 |
| Meta Description | Textarea (3 rows) | Green ≤160, yellow 161-180, red >180 |
| OG Image | Media library picker | Thumbnail preview when set |

### OG Image Interaction

- When no image is set: shows a dashed-border placeholder with "Choose from Media" button.
- When an image is set: shows a thumbnail (max 200px wide), the filename, a "Change" button, and a "Remove" button.
- "Choose from Media" / "Change" opens the existing `MediaLibrary` component in picker mode (it already supports `onSelect` callback).
- "Remove" clears the field (sets to `null`).

### Character Count Badge

A small inline badge next to each text field label showing `{current}/{limit}`:
- Green (`#4ade80`): within recommended limit
- Yellow (`#facc15`): slightly over (warning zone)
- Red (`#f87171`): significantly over

### Save Behavior

- "Save SEO" button updates only `meta_title`, `meta_description`, `og_image` on the `pages` table via Supabase client.
- Shows "Saved!" confirmation text (green, fades after 2s) — same pattern used in the settings page.
- No revert/undo for SEO fields (low-risk edits, not worth the complexity).

### Panel Styling

- Collapsible panel with a header row: "SEO & Meta" label + chevron toggle.
- Defaults to expanded.
- Follows existing admin styling: `#111110` background, `#2a2825` border, 10px border-radius, 20-24px padding.

## 4. What Does NOT Change

- **Database schema** — all required fields already exist on the `pages` table.
- **Seed script** — no changes needed.
- **Section editors** — untouched.
- **Public components** (Hero, Statement, Services, etc.) — untouched.
- **Admin sidebar / navigation** — untouched.
- **Page creation** — not in scope. Only existing pages are routable.

## 5. File Summary

| File | Action |
|---|---|
| `lib/render-page.tsx` | **New** — shared page rendering module |
| `app/page.tsx` | **Modify** — slim down to thin wrapper |
| `app/[slug]/page.tsx` | **New** — dynamic route for non-home pages |
| `components/admin/SeoEditor.tsx` | **New** — SEO editor client component |
| `app/admin/pages/[id]/page.tsx` | **Modify** — add SeoEditor below page heading |
