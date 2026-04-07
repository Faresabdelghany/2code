# Analytics & Submissions — Design Spec

**Date:** 2026-04-07
**Scope:** Email notifications on new submissions, CSV export, admin dashboard stats

## Context

The Forma CMS has a contact form (`app/api/contact/route.ts`) that inserts submissions into Supabase. The admin panel has a submissions inbox (`app/admin/submissions/page.tsx` + `components/admin/SubmissionsList.tsx`) with filtering (All/Unread), expandable rows, mark-as-read, and delete. There are no email notifications, no export, and no dashboard.

## 1. Email Notifications on New Submission

### Trigger

After a successful insert in `app/api/contact/route.ts`, send a notification email.

### Service

Resend (`resend` npm package). API key stored as `RESEND_API_KEY` in `.env.local`.

### Recipient

Fetched from the `settings` table: `contact_info.email`. The route already has a Supabase client — query `settings` where `key = 'contact_info'`, extract `value.email`.

### Email Content

- **From:** `onboarding@resend.dev` (Resend's default sender for free tier, no domain verification needed)
- **Subject:** `New submission from {name}`
- **Body:** Simple HTML with the submitter's name, email (as a mailto link), message text, and a timestamp. No fancy template — a clean, readable layout.

### Error Handling

Email sending is best-effort. If Resend fails, log the error to console and still return `{ success: true }` to the submitter. The submission is already saved in the database — the email is a convenience notification, not a critical path.

### Guard

If `RESEND_API_KEY` is not set or `contact_info.email` is not found, skip email silently. This allows the form to work in development without Resend configured.

## 2. Export Submissions to CSV

### Location

An "Export CSV" button in the header of the submissions page, next to the existing filter pills.

### Implementation

Client-side CSV generation in `components/admin/SubmissionsList.tsx`. No API route needed.

### CSV Format

Columns: `Name, Email, Message, Status, Date`

- **Status:** "Read" or "Unread" based on the `read` boolean
- **Date:** ISO 8601 format (`2026-04-07T10:30:00Z`)
- **Message:** Escaped for CSV (double-quotes around values, internal quotes doubled)

### Export Scope

Exports ALL submissions (not just the currently filtered view). This avoids confusion about what was exported.

### Download Behavior

Creates a Blob with `text/csv` MIME type, generates a temporary download link, triggers click, and revokes the URL. Filename: `submissions-YYYY-MM-DD.csv`.

## 3. Dashboard Stats on Admin Home

### Location

`app/admin/page.tsx` — when the user is authenticated, show the dashboard instead of the login form. The login form still renders for unauthenticated users.

### Authentication Check

Use the existing Supabase client to check `supabase.auth.getUser()`. If a user is returned, render the dashboard. Otherwise, render the existing login form.

The login form is currently a client component with state. It will be extracted or kept inline — the page will conditionally render either the dashboard or the login form based on auth state.

### Stats Cards

Three cards in a responsive grid:

| Card | Label | Value Source | Icon/Color |
|---|---|---|---|
| Total Submissions | "Submissions" | `count` from `submissions` table | Gold accent |
| Unread | "Unread" | `count` from `submissions` where `read = false` | Gold accent |
| Sections | "Sections" | `count` from `sections` table | Gold accent |

Cards use existing admin styling: `#111110` background, `#2a2825` border, large number in `#f0ebe3`, label in `#9e9789`.

### Recent Submissions

Below the stats, a "Recent Submissions" section showing the 5 most recent submissions:
- Each row: name, email, relative time ("2h ago", "3d ago")
- Unread rows have a gold left border (same pattern as the submissions inbox)
- "View All" link to `/admin/submissions`

### Data Fetching

The dashboard is a server component. It fetches stats and recent submissions in parallel using `Promise.all`:
- `supabase.from("submissions").select("*", { count: "exact", head: true })`
- `supabase.from("submissions").select("*", { count: "exact", head: true }).eq("read", false)`
- `supabase.from("sections").select("*", { count: "exact", head: true })`
- `supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(5)`

## 4. File Summary

| File | Action |
|---|---|
| `app/api/contact/route.ts` | **Modify** — add Resend email after insert |
| `components/admin/SubmissionsList.tsx` | **Modify** — add CSV export button in header |
| `app/admin/page.tsx` | **Modify** — show dashboard when authenticated, keep login for unauthenticated |
| `package.json` | **Modify** — add `resend` dependency |

## 5. What Does NOT Change

- Database schema — no new tables or columns
- Submissions inbox functionality (filtering, mark-as-read, delete)
- Contact form UI on the public site
- Admin sidebar navigation (no new links — dashboard replaces the login landing)
