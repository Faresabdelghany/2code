import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SectionEditor from "@/components/admin/SectionEditor";
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
  margin: "0 0 28px",
};

// ── Page Component ───────────────────────────────────────────────────────────

export default async function SectionEditorPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  const supabase = await createClient();

  const [{ data: page }, { data: section }] = await Promise.all([
    supabase.from("pages").select("*").eq("id", id).single<Page>(),
    supabase.from("sections").select("*").eq("id", sectionId).single<Section>(),
  ]);

  if (!page || !section) notFound();

  return (
    <div style={pageStyle}>
      {/* Breadcrumb */}
      <nav style={breadcrumbStyle} aria-label="Breadcrumb">
        <Link href="/admin/pages" style={breadcrumbLinkStyle}>
          Pages
        </Link>
        <span style={breadcrumbSepStyle}>/</span>
        <Link href={`/admin/pages/${id}`} style={breadcrumbLinkStyle}>
          {page.title}
        </Link>
        <span style={breadcrumbSepStyle}>/</span>
        <span style={breadcrumbCurrentStyle}>{section.title}</span>
      </nav>

      <h1 style={headingStyle}>{section.title}</h1>

      <SectionEditor section={section} />
    </div>
  );
}
