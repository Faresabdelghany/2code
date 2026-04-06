import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionList from "@/components/admin/SectionList";
import type { Page, Section } from "@/lib/types/cms";

// ── Styles ──────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  padding: "40px 48px",
  fontFamily: "var(--font-sans)",
};

const breadcrumbStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: "0.8125rem",
  color: "#9e9789",
  marginBottom: 28,
};

const breadcrumbLinkStyle: React.CSSProperties = {
  color: "#9e9789",
  textDecoration: "none",
  transition: "color 0.15s ease",
};

const breadcrumbSepStyle: React.CSSProperties = {
  color: "#2a2825",
};

const breadcrumbCurrentStyle: React.CSSProperties = {
  color: "#f0ebe3",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: "0 0 8px",
};

const slugStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#c4a96a",
  fontFamily: "monospace",
  marginBottom: 32,
};

const sectionHeaderStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 12,
};

const emptyStyle: React.CSSProperties = {
  padding: "48px 32px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.9375rem",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
};

// ── Page Component ───────────────────────────────────────────────────────────

export default async function PageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: page }, { data: sections }] = await Promise.all([
    supabase.from("pages").select("*").eq("id", id).single<Page>(),
    supabase
      .from("sections")
      .select("*")
      .eq("page_id", id)
      .order("sort_order", { ascending: true })
      .returns<Section[]>(),
  ]);

  if (!page) notFound();

  const rows = sections ?? [];

  return (
    <div style={pageStyle}>
      {/* Breadcrumb */}
      <nav style={breadcrumbStyle} aria-label="Breadcrumb">
        <Link href="/admin/pages" style={breadcrumbLinkStyle}>
          Pages
        </Link>
        <span style={breadcrumbSepStyle}>/</span>
        <span style={breadcrumbCurrentStyle}>{page.title}</span>
      </nav>

      {/* Page info */}
      <h1 style={headingStyle}>{page.title}</h1>
      <div style={slugStyle}>/{page.slug}</div>

      {/* Sections */}
      <div style={sectionHeaderStyle}>Sections</div>
      {rows.length === 0 ? (
        <div style={emptyStyle}>No sections yet.</div>
      ) : (
        <SectionList sections={rows} pageId={id} />
      )}
    </div>
  );
}
