# Admin Polish — Design Spec

**Date:** 2026-04-07
**Scope:** Keyboard shortcuts + mobile-friendly admin panel

## Context

The Forma CMS admin panel has a fixed 220px sidebar, content areas with `40px 48px` padding, and no keyboard shortcuts. It is not usable on mobile screens. The admin layout is a server component (`app/admin/layout.tsx`) that renders a client-side `Sidebar` component (`components/admin/Sidebar.tsx`).

## 1. Keyboard Shortcuts

### Component

New client component: `components/admin/KeyboardShortcuts.tsx`

Mounted once in the admin layout. Listens for `keydown` events on `document`.

### Shortcut Scheme

**Navigation (two-key sequence: `G` then letter):**

| Keys | Destination |
|---|---|
| `G` then `D` | `/admin` (Dashboard) |
| `G` then `P` | `/admin/pages` |
| `G` then `M` | `/admin/media` |
| `G` then `S` | `/admin/submissions` |
| `G` then `T` | `/admin/settings` |

Implementation: when `G` is pressed, set a flag + 1-second timeout. If a second key arrives within 1 second and matches a route, navigate via `router.push`. If the timeout expires, reset the flag.

**Action shortcuts (single key):**

| Key | Action |
|---|---|
| `Esc` | Close any open modal/overlay (dispatches a custom `close-overlay` event) |
| `?` | Toggle the shortcut help overlay |

### Input Guard

All shortcuts are suppressed when `document.activeElement` is an `<input>`, `<textarea>`, `<select>`, or has `contenteditable` attribute. Check this at the top of the keydown handler and return early.

### Help Overlay

When `?` is pressed, a centered modal appears listing all shortcuts in a two-column table (key + description). Styled with admin design tokens: `#111110` background, `#2a2825` border, `#f0ebe3` text. Pressing `?` again or `Esc` closes it. The overlay has a backdrop (`rgba(0,0,0,0.6)`) and clicking the backdrop also closes it.

### Esc for Modals

The `KeyboardShortcuts` component dispatches a `CustomEvent("close-overlay")` on `document` when `Esc` is pressed. Existing overlay components (SeoEditor media picker, etc.) can listen for this event to close themselves. This is a loose coupling — components opt in by adding a listener.

## 2. Mobile-Friendly Admin

### Sidebar Responsive Behavior

The `Sidebar` component (`components/admin/Sidebar.tsx`) is modified to accept optional props:

```typescript
interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}
```

**Desktop (>768px):** Sidebar renders as it does now — fixed, 220px, always visible. `mobileOpen` and `onClose` are ignored.

**Mobile (≤768px):** Sidebar is hidden by default (`transform: translateX(-100%)`). When `mobileOpen` is true, it slides in (`transform: translateX(0)`) with a backdrop overlay. Clicking a nav link or the backdrop calls `onClose`.

The sidebar uses a `<style>` tag with a `@media` query to handle the responsive behavior via CSS, avoiding JS-based resize listeners.

### Admin Layout Changes

`app/admin/layout.tsx` is converted to use a client wrapper component (`components/admin/AdminShell.tsx`) that:
1. Renders the `Sidebar` with `mobileOpen` / `onClose` state
2. Renders a hamburger button (visible only ≤768px) fixed at top-left
3. Renders `KeyboardShortcuts`
4. Wraps `{children}` in a content container

The layout file itself stays as a server component for metadata, but delegates rendering to `AdminShell`.

### Content Padding

`AdminShell` includes a `<style>` tag with a global media query:

```css
@media (max-width: 768px) {
  .admin-content { padding: 20px 16px !important; margin-left: 0 !important; }
}
```

Each admin page's outermost div gets `className="admin-content"` added alongside its existing inline styles. This is the lightest touch — a single class name addition per page.

**Pages that need the class:**
- `app/admin/page.tsx` (dashboard)
- `app/admin/pages/page.tsx` (page list)
- `app/admin/pages/[id]/page.tsx` (page detail)
- `app/admin/submissions/page.tsx` (already wraps `SubmissionsList`)
- `app/admin/media/page.tsx` (already wraps `MediaLibrary`)
- `app/admin/settings/page.tsx`
- `components/admin/SubmissionsList.tsx` (has its own wrapper with padding)
- `components/admin/MediaLibrary.tsx` (has its own wrapper with padding)

Note: `SubmissionsList` and `MediaLibrary` are client components that define their own `wrapperStyle` with padding. Adding `className="admin-content"` to their root div lets the media query override the inline padding on mobile.

### Hamburger Button

A simple 3-line icon button, fixed position, top-left, only visible ≤768px. Uses admin design tokens: `#f0ebe3` color, `#111110` background, `#2a2825` border.

## 3. File Summary

| File | Action |
|---|---|
| `components/admin/KeyboardShortcuts.tsx` | **New** — shortcut listener + help overlay |
| `components/admin/AdminShell.tsx` | **New** — client wrapper with mobile sidebar + hamburger + responsive styles |
| `app/admin/layout.tsx` | **Modify** — delegate rendering to AdminShell |
| `components/admin/Sidebar.tsx` | **Modify** — accept `mobileOpen`/`onClose` props, add responsive CSS |
| `app/admin/page.tsx` | **Modify** — add `className="admin-content"` to root div |
| `app/admin/pages/page.tsx` | **Modify** — add `className="admin-content"` to root div |
| `app/admin/pages/[id]/page.tsx` | **Modify** — add `className="admin-content"` to root div |
| `app/admin/settings/page.tsx` | **Modify** — add `className="admin-content"` to root div |
| `components/admin/SubmissionsList.tsx` | **Modify** — add `className="admin-content"` to root div |
| `components/admin/MediaLibrary.tsx` | **Modify** — add `className="admin-content"` to root div |

## 4. What Does NOT Change

- Database schema
- Public-facing site
- Section editors (they use an iframe preview which has its own responsive handling)
- Authentication flow
