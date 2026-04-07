# Analytics & Submissions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add email notifications on new submissions, CSV export, and an admin dashboard with stats.

**Architecture:** Email notifications fire from the existing contact API route via Resend after a successful insert. CSV export is client-side generation in the submissions list component. The admin landing page becomes a server component that shows a dashboard when authenticated or the login form when not.

**Tech Stack:** Resend (email), Supabase (data), Next.js server components (dashboard)

**Spec:** `docs/superpowers/specs/2026-04-07-analytics-submissions-design.md`

**Important codebase notes:**
- No tests in this project. Verification via `npm run build` and manual checks.
- Admin styling uses inline `React.CSSProperties` — not Tailwind classes.
- Design tokens: `#0a0a09` (bg), `#111110` (card bg), `#2a2825` (border), `#f0ebe3` (text), `#9e9789` (muted), `#c4a96a` (gold accent), `#4ade80` (success), `#f87171` (danger).

---

### Task 1: Install Resend and add email notification to contact route

**Files:**
- Modify: `app/api/contact/route.ts`
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install Resend**

Run: `npm install resend`

- [ ] **Step 2: Add email notification to the contact route**

Replace the entire `app/api/contact/route.ts` with:

```tsx
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );

  const { error } = await supabase.from("submissions").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  // Send email notification (best-effort)
  if (process.env.RESEND_API_KEY) {
    try {
      // Fetch admin email from settings
      const { data: settingsRow } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "contact_info")
        .single();

      const adminEmail = (settingsRow?.value as { email?: string })?.email;

      if (adminEmail) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const timestamp = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        await resend.emails.send({
          from: "FORMA CMS <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New submission from ${name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="font-size: 18px; margin: 0 0 16px;">New Contact Submission</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 80px;">Name</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Time</td>
                  <td style="padding: 8px 0;">${timestamp}</td>
                </tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/api/contact/route.ts package.json package-lock.json
git commit -m "feat: add email notification on new submission via Resend"
```

---

### Task 2: Add CSV export to submissions list

**Files:**
- Modify: `components/admin/SubmissionsList.tsx`

- [ ] **Step 1: Add CSV export function and button**

In `components/admin/SubmissionsList.tsx`, add the export button style after the existing `deleteButtonStyle` (around line 198):

```tsx
const exportButtonStyle: React.CSSProperties = {
  padding: "7px 18px",
  backgroundColor: "rgba(196,169,106,0.1)",
  border: "1px solid rgba(196,169,106,0.3)",
  borderRadius: 6,
  color: "#c4a96a",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  cursor: "pointer",
  marginLeft: "auto",
};
```

Add the CSV export function inside the `SubmissionsList` component (after the `handleDelete` function, around line 293):

```tsx
  function exportCsv() {
    const header = "Name,Email,Message,Status,Date";
    const rows = submissions.map((s) => {
      const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const status = s.read ? "Read" : "Unread";
      const date = new Date(s.created_at).toISOString();
      return [esc(s.name), esc(s.email), esc(s.message), status, date].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `submissions-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
```

Then update the header row JSX. Replace the existing header `<div>`:

```tsx
      {/* Header */}
      <div style={headerRowStyle}>
        <h1 style={headingStyle}>{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</h1>
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount} new</span>
        )}
      </div>
```

With:

```tsx
      {/* Header */}
      <div style={headerRowStyle}>
        <h1 style={headingStyle}>{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</h1>
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount} new</span>
        )}
        {submissions.length > 0 && (
          <button style={exportButtonStyle} onClick={exportCsv}>
            Export CSV
          </button>
        )}
      </div>
```

Note: the `headerRowStyle` already has `display: "flex"` and `gap: 12`. The `marginLeft: "auto"` on the export button pushes it to the right.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/SubmissionsList.tsx
git commit -m "feat: add CSV export button to submissions list"
```

---

### Task 3: Extract login form to separate component

**Files:**
- Create: `components/admin/AdminLoginForm.tsx`

This extracts the existing login form from `app/admin/page.tsx` into its own client component so the admin page can become a server component in Task 4.

- [ ] **Step 1: Create `components/admin/AdminLoginForm.tsx`**

Create the file with the exact contents of the current `app/admin/page.tsx` — it is already a self-contained client component. Copy the entire file as-is, just rename the export:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "var(--font-sans)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#111110",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "40px 32px",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#c4a96a",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 8,
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#9e9789",
  textAlign: "center",
  marginBottom: 32,
  fontWeight: 300,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "#0a0a09",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  padding: "10px 14px",
  backgroundColor: "rgba(220,38,38,0.1)",
  border: "1px solid rgba(220,38,38,0.25)",
  borderRadius: 6,
  color: "#fca5a5",
  fontSize: "0.8125rem",
  marginBottom: 16,
};

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px 16px",
  backgroundColor: loading ? "#8a7a54" : "#c4a96a",
  color: "#0a0a09",
  border: "none",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "var(--font-sans)",
  letterSpacing: "0.06em",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "background-color 0.15s ease",
  marginTop: 8,
});

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/pages");
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>FORMA CMS</h1>
        <p style={subtitleStyle}>Sign in to manage your site</p>

        <form onSubmit={handleSubmit} noValidate>
          {error && <div style={errorStyle} role="alert">{error}</div>}

          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "#c4a96a";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "#c4a96a";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>

          <button type="submit" style={buttonStyle(loading)} disabled={loading}>
            {loading ? "Signing in\u2026" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds (component created but not imported yet).

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminLoginForm.tsx
git commit -m "refactor: extract admin login form to separate component"
```

---

### Task 4: Create admin dashboard

**Files:**
- Modify: `app/admin/page.tsx` (full rewrite — server component with dashboard)

- [ ] **Step 1: Rewrite `app/admin/page.tsx`**

Replace the entire file with:

```tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import type { Submission } from "@/lib/types/cms";

// ── Styles ──────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  padding: "40px 48px",
  fontFamily: "var(--font-sans)",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: "0 0 28px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 40,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  padding: "24px 20px",
};

const cardValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "2rem",
  fontWeight: 700,
  color: "#f0ebe3",
  marginBottom: 4,
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const sectionHeadingStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 14,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: 0,
};

const viewAllStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#c4a96a",
  textDecoration: "none",
};

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

function rowStyle(unread: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#111110",
    border: "1px solid #2a2825",
    borderLeft: unread ? "3px solid #c4a96a" : "3px solid transparent",
    borderRadius: 8,
    textDecoration: "none",
    gap: 12,
  };
}

const rowNameStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#f0ebe3",
  minWidth: 120,
};

const rowEmailStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#9e9789",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const rowTimeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#9e9789",
  flexShrink: 0,
};

const emptyStyle: React.CSSProperties = {
  padding: "32px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.875rem",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
};

// ── Helpers ─────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Page ────────────────────────────────────────────────────

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLoginForm />;
  }

  // Fetch stats + recent submissions in parallel
  const [totalRes, unreadRes, sectionsRes, recentRes] = await Promise.all([
    supabase.from("submissions").select("*", { count: "exact", head: true }),
    supabase.from("submissions").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("sections").select("*", { count: "exact", head: true }),
    supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<Submission[]>(),
  ]);

  const totalSubmissions = totalRes.count ?? 0;
  const unreadSubmissions = unreadRes.count ?? 0;
  const totalSections = sectionsRes.count ?? 0;
  const recentSubmissions = recentRes.data ?? [];

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Dashboard</h1>

      {/* Stat cards */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <div style={cardValueStyle}>{totalSubmissions}</div>
          <div style={cardLabelStyle}>Submissions</div>
        </div>
        <div style={cardStyle}>
          <div style={cardValueStyle}>{unreadSubmissions}</div>
          <div style={cardLabelStyle}>Unread</div>
        </div>
        <div style={cardStyle}>
          <div style={cardValueStyle}>{totalSections}</div>
          <div style={cardLabelStyle}>Sections</div>
        </div>
      </div>

      {/* Recent submissions */}
      <div style={sectionHeadingStyle}>
        <h2 style={sectionTitleStyle}>Recent Submissions</h2>
        <Link href="/admin/submissions" style={viewAllStyle}>
          View All
        </Link>
      </div>

      {recentSubmissions.length === 0 ? (
        <div style={emptyStyle}>No submissions yet.</div>
      ) : (
        <div style={listStyle}>
          {recentSubmissions.map((s) => (
            <Link key={s.id} href="/admin/submissions" style={rowStyle(!s.read)}>
              <span style={rowNameStyle}>{s.name}</span>
              <span style={rowEmailStyle}>{s.email}</span>
              <span style={rowTimeStyle}>{timeAgo(s.created_at)}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds. The `/admin` route now renders as a dynamic server component.

- [ ] **Step 3: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin dashboard with stats and recent submissions"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`

- [ ] **Step 2: Verify dashboard (authenticated)**

Navigate to `/admin`. If authenticated, confirm:
- Three stat cards showing Submissions, Unread, Sections counts
- Recent Submissions list with up to 5 entries
- Unread submissions have gold left border
- "View All" link goes to `/admin/submissions`

- [ ] **Step 3: Verify dashboard (unauthenticated)**

Open an incognito window and navigate to `/admin`. Confirm the login form renders (not the dashboard).

- [ ] **Step 4: Verify CSV export**

Navigate to `/admin/submissions`. Confirm:
- "Export CSV" button appears in the header (right-aligned)
- Clicking it downloads a CSV file named `submissions-YYYY-MM-DD.csv`
- CSV contains correct headers: Name, Email, Message, Status, Date
- All submissions are included regardless of filter

- [ ] **Step 5: Verify email notification**

If `RESEND_API_KEY` is configured in `.env.local`:
- Submit the contact form on the public site
- Check the admin email for a notification with submitter name, email, message
- Confirm the submission still appears in the admin inbox regardless of email success

If `RESEND_API_KEY` is not configured:
- Submit the contact form
- Confirm the submission saves successfully (no errors)
- Confirm no email-related errors in the console
