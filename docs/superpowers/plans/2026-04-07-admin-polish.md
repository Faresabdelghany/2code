# Admin Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add keyboard shortcuts and make the admin panel fully usable on mobile devices.

**Architecture:** A `KeyboardShortcuts` client component handles global key events with a two-key sequence system. An `AdminShell` client wrapper manages mobile sidebar state (hamburger toggle) and injects responsive CSS. The `Sidebar` component gains props for mobile overlay mode. Each admin page gets a `className="admin-content"` for responsive padding override.

**Tech Stack:** React client components, CSS media queries, CustomEvent for cross-component communication.

**Spec:** `docs/superpowers/specs/2026-04-07-admin-polish-design.md`

**Important codebase notes:**
- No tests in this project. Verification via `npm run build` and manual checks.
- Admin styling uses inline `React.CSSProperties` — not Tailwind classes.
- Design tokens: `#0a0a09` (bg), `#111110` (card bg), `#2a2825` (border), `#f0ebe3` (text), `#9e9789` (muted), `#c4a96a` (gold accent).
- Sidebar is 220px fixed, layout uses `marginLeft: 220`.

---

### Task 1: Create KeyboardShortcuts component

**Files:**
- Create: `components/admin/KeyboardShortcuts.tsx`

- [ ] **Step 1: Create `components/admin/KeyboardShortcuts.tsx`**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Shortcut map ────────────────────────────────────────────

const NAV_SHORTCUTS: Record<string, string> = {
  d: "/admin",
  p: "/admin/pages",
  m: "/admin/media",
  s: "/admin/submissions",
  t: "/admin/settings",
};

const SHORTCUT_LIST = [
  { keys: "G then D", description: "Go to Dashboard" },
  { keys: "G then P", description: "Go to Pages" },
  { keys: "G then M", description: "Go to Media" },
  { keys: "G then S", description: "Go to Submissions" },
  { keys: "G then T", description: "Go to Settings" },
  { keys: "Esc", description: "Close overlay / modal" },
  { keys: "?", description: "Toggle this help" },
];

// ── Styles ──────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 12,
  padding: "28px 32px",
  maxWidth: 380,
  width: "90%",
  fontFamily: "var(--font-sans)",
};

const modalTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#f0ebe3",
  marginBottom: 20,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #2a2825",
};

const keyCellStyle: React.CSSProperties = {
  padding: "8px 12px 8px 0",
  fontSize: "0.8125rem",
  fontFamily: "monospace",
  color: "#c4a96a",
  whiteSpace: "nowrap",
  width: 100,
};

const descCellStyle: React.CSSProperties = {
  padding: "8px 0",
  fontSize: "0.8125rem",
  color: "#9e9789",
};

const hintStyle: React.CSSProperties = {
  marginTop: 16,
  fontSize: "0.75rem",
  color: "#9e9789",
  textAlign: "center",
};

// ── Component ───────────────────────────────────────────────

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [gPressed, setGPressed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Suppress when focus is in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      const key = e.key.toLowerCase();

      // Esc — close overlays
      if (key === "escape") {
        if (showHelp) {
          setShowHelp(false);
          return;
        }
        document.dispatchEvent(new CustomEvent("close-overlay"));
        return;
      }

      // ? — toggle help
      if (e.key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }

      // G — start nav sequence
      if (key === "g" && !gPressed) {
        setGPressed(true);
        setTimeout(() => setGPressed(false), 1000);
        return;
      }

      // Second key after G
      if (gPressed) {
        setGPressed(false);
        const route = NAV_SHORTCUTS[key];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }
    },
    [gPressed, showHelp, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!showHelp) return null;

  return (
    <div style={overlayStyle} onClick={() => setShowHelp(false)}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitleStyle}>Keyboard Shortcuts</div>
        <table style={tableStyle}>
          <tbody>
            {SHORTCUT_LIST.map((s) => (
              <tr key={s.keys} style={rowStyle}>
                <td style={keyCellStyle}>{s.keys}</td>
                <td style={descCellStyle}>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={hintStyle}>Press ? or Esc to close</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/KeyboardShortcuts.tsx
git commit -m "feat: add keyboard shortcuts component with help overlay"
```

---

### Task 2: Make Sidebar responsive

**Files:**
- Modify: `components/admin/Sidebar.tsx`

- [ ] **Step 1: Update Sidebar to accept mobile props and add responsive CSS**

Replace the entire `components/admin/Sidebar.tsx` with:

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Pages", href: "/admin/pages" },
  { label: "Media", href: "/admin/media" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Settings", href: "/admin/settings" },
];

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 220,
  height: "100vh",
  backgroundColor: "#111110",
  display: "flex",
  flexDirection: "column",
  zIndex: 50,
  borderRight: "1px solid rgba(255,255,255,0.06)",
  transition: "transform 0.25s ease",
};

const brandingStyle: React.CSSProperties = {
  padding: "28px 24px 24px",
  fontFamily: "var(--font-serif)",
  fontSize: "0.85rem",
  fontWeight: 700,
  letterSpacing: "0.15em",
  color: "#c4a96a",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const navStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px 0",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function navItemStyle(active: boolean): React.CSSProperties {
  return {
    display: "block",
    padding: "10px 24px",
    fontSize: "0.875rem",
    fontWeight: active ? 500 : 400,
    color: active ? "#f0ebe3" : "#9e9789",
    backgroundColor: active ? "rgba(196,169,106,0.12)" : "transparent",
    borderLeft: active ? "2px solid #c4a96a" : "2px solid transparent",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.15s ease, background-color 0.15s ease",
    fontFamily: "var(--font-sans)",
  };
}

const signOutButtonStyle: React.CSSProperties = {
  margin: "0 16px 24px",
  padding: "10px 16px",
  fontSize: "0.8125rem",
  fontWeight: 400,
  color: "#9e9789",
  backgroundColor: "transparent",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  transition: "color 0.15s ease, border-color 0.15s ease",
  textAlign: "left",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 49,
};

// ── Props ───────────────────────────────────────────────────

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

// ── Component ───────────────────────────────────────────────

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  }

  function handleNavClick(href: string) {
    if (onClose) onClose();
    router.push(href);
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"} !important;
          }
        }
      `}</style>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={backdropStyle}
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav style={sidebarStyle} className="admin-sidebar" aria-label="Admin navigation">
        <div style={brandingStyle}>FORMA CMS</div>

        <div style={navStyle}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                style={navItemStyle(active)}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <button
          onClick={handleSignOut}
          style={signOutButtonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f0ebe3";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#9e9789";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          Sign Out
        </button>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/Sidebar.tsx
git commit -m "feat: make sidebar responsive with mobile overlay mode"
```

---

### Task 3: Create AdminShell wrapper + update layout

**Files:**
- Create: `components/admin/AdminShell.tsx`
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Create `components/admin/AdminShell.tsx`**

```tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import KeyboardShortcuts from "@/components/admin/KeyboardShortcuts";

// ── Styles ──────────────────────────────────────────────────

const shellStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: 220,
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

const hamburgerStyle: React.CSSProperties = {
  position: "fixed",
  top: 14,
  left: 14,
  zIndex: 48,
  width: 40,
  height: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 8,
  cursor: "pointer",
  padding: 0,
};

const hamburgerLineStyle: React.CSSProperties = {
  width: 18,
  height: 2,
  backgroundColor: "#f0ebe3",
  borderRadius: 1,
};

// ── Component ───────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-content {
            margin-left: 0 !important;
            padding: 20px 16px !important;
          }
          .admin-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-hamburger { display: none !important; }
        }
      `}</style>

      <div style={shellStyle}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Hamburger — mobile only */}
        <button
          className="admin-hamburger"
          style={{ ...hamburgerStyle, display: "none" }}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <span style={hamburgerLineStyle} />
          <span style={hamburgerLineStyle} />
          <span style={hamburgerLineStyle} />
        </button>

        <main style={contentStyle} className="admin-content">
          {children}
        </main>
      </div>

      <KeyboardShortcuts />
    </>
  );
}
```

- [ ] **Step 2: Update `app/admin/layout.tsx`**

Replace the entire file with:

```tsx
import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "FORMA CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add components/admin/AdminShell.tsx app/admin/layout.tsx
git commit -m "feat: add AdminShell with hamburger menu, responsive layout, and keyboard shortcuts"
```

---

### Task 4: Add `admin-content` class to admin pages

**Files:**
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/pages/page.tsx`
- Modify: `app/admin/pages/[id]/page.tsx`
- Modify: `app/admin/settings/page.tsx`
- Modify: `components/admin/SubmissionsList.tsx`
- Modify: `components/admin/MediaLibrary.tsx`

Each page's root `<div>` needs `className="admin-content"` added. The `AdminShell` already applies `admin-content` to the `<main>` wrapper, which handles pages that don't have their own wrapper with padding (like `app/admin/submissions/page.tsx` and `app/admin/media/page.tsx` which just wrap their client components). But pages that define their own padding in a root div need the class so the mobile media query can override it.

- [ ] **Step 1: Update `app/admin/page.tsx` (dashboard)**

Find the root div:
```tsx
    <div style={pageStyle}>
```

Replace with:
```tsx
    <div style={pageStyle} className="admin-content">
```

This is the `<div>` rendered when the user is authenticated (the dashboard). The `<AdminLoginForm>` renders its own full-page layout, so it doesn't need the class.

- [ ] **Step 2: Update `app/admin/pages/page.tsx` (page list)**

Find:
```tsx
    <div style={pageStyle}>
```

Replace with:
```tsx
    <div style={pageStyle} className="admin-content">
```

- [ ] **Step 3: Update `app/admin/pages/[id]/page.tsx` (page detail)**

Find:
```tsx
    <div style={pageStyle}>
```

Replace with:
```tsx
    <div style={pageStyle} className="admin-content">
```

- [ ] **Step 4: Update `app/admin/settings/page.tsx`**

This page wraps `<SettingsEditor>` in a div with `pageStyle` which only sets `minHeight` and `backgroundColor` (no padding). The `SettingsEditor` client component has its own padding. For settings, add the class to the page wrapper:

Find:
```tsx
    <div style={pageStyle}>
```

Replace with:
```tsx
    <div style={pageStyle} className="admin-content">
```

- [ ] **Step 5: Update `components/admin/SubmissionsList.tsx`**

Find the root div of the component (first line of the return):
```tsx
    <div style={wrapperStyle}>
```

Replace with:
```tsx
    <div style={wrapperStyle} className="admin-content">
```

- [ ] **Step 6: Update `components/admin/MediaLibrary.tsx`**

Find the root div of the component (first line of the return):
```tsx
    <div style={wrapperStyle}>
```

Replace with:
```tsx
    <div style={wrapperStyle} className="admin-content">
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 8: Commit**

```bash
git add app/admin/page.tsx app/admin/pages/page.tsx 'app/admin/pages/[id]/page.tsx' app/admin/settings/page.tsx components/admin/SubmissionsList.tsx components/admin/MediaLibrary.tsx
git commit -m "feat: add admin-content class to all admin pages for responsive padding"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Test keyboard shortcuts (desktop)**

Navigate to `/admin`. Verify:
- Press `?` → shortcut help overlay appears with all 7 shortcuts listed
- Press `?` again or `Esc` → overlay closes
- Click backdrop → overlay closes
- Press `G` then `P` → navigates to Pages
- Press `G` then `M` → navigates to Media
- Press `G` then `S` → navigates to Submissions
- Press `G` then `T` → navigates to Settings
- Press `G` then `D` → navigates to Dashboard
- Type in an input field → shortcuts don't fire
- Press `G`, wait 2 seconds, press `P` → does NOT navigate (timeout expired)

- [ ] **Step 3: Test mobile layout**

Open browser DevTools, toggle device toolbar, select a phone viewport (e.g. iPhone 14, 390×844):
- Sidebar is hidden
- Hamburger button appears top-left
- Content has reduced padding (20px 16px)
- Tap hamburger → sidebar slides in from left with backdrop
- Tap a nav link → sidebar closes, navigates to page
- Tap backdrop → sidebar closes
- All admin pages (Dashboard, Pages, Page Detail, Media, Submissions, Settings) display without horizontal overflow

- [ ] **Step 4: Test tablet/desktop**

Switch to desktop viewport (>768px):
- Sidebar is always visible
- Hamburger button is hidden
- Content has normal padding (40px 48px)
- Layout unchanged from before
