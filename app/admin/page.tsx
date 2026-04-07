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
    <div style={pageStyle} className="admin-content">
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
