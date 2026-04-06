import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/lib/types/cms";

// ── Styles ─────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  padding: "40px 48px",
  fontFamily: "var(--font-sans)",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 32,
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  display: "block",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  padding: "20px 24px",
  textDecoration: "none",
  transition: "border-color 0.15s ease, background-color 0.15s ease",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#f0ebe3",
  marginBottom: 6,
};

const cardSlugStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#c4a96a",
  fontFamily: "monospace",
  marginBottom: 12,
};

const cardMetaStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#9e9789",
};

const emptyStyle: React.CSSProperties = {
  padding: "64px 32px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.9375rem",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
};

// ── Page Component ──────────────────────────────────────────────────────────

export default async function PagesListPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: true })
    .returns<Page[]>();

  const rows = pages ?? [];

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h1 style={headingStyle}>Pages</h1>
      </div>

      {rows.length === 0 ? (
        <div style={emptyStyle}>No pages yet.</div>
      ) : (
        <div style={gridStyle}>
          {rows.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page Card ───────────────────────────────────────────────────────────────

function PageCard({ page }: { page: Page }) {
  const edited = new Date(page.updated_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/admin/pages/${page.id}`} style={cardStyle}>
      <div style={cardTitleStyle}>{page.title}</div>
      <div style={cardSlugStyle}>/{page.slug}</div>
      <div style={cardMetaStyle}>Last edited {edited}</div>
    </Link>
  );
}
