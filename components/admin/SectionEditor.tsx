"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Section, SectionType } from "@/lib/types/cms";

// ── Editor imports (created in the next task) ────────────────────────────────
import PreviewFrame from "@/components/admin/PreviewFrame";
import HeroEditor from "@/components/admin/editors/HeroEditor";
import StatementEditor from "@/components/admin/editors/StatementEditor";
import MarqueeEditor from "@/components/admin/editors/MarqueeEditor";
import ServicesEditor from "@/components/admin/editors/ServicesEditor";
import ProcessEditor from "@/components/admin/editors/ProcessEditor";
import StatsEditor from "@/components/admin/editors/StatsEditor";
import TrustEditor from "@/components/admin/editors/TrustEditor";
import TestimonialsEditor from "@/components/admin/editors/TestimonialsEditor";
import FaqEditor from "@/components/admin/editors/FaqEditor";
import CtaEditor from "@/components/admin/editors/CtaEditor";
import ContactEditor from "@/components/admin/editors/ContactEditor";

// ── Editor map ───────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EDITOR_MAP: Record<SectionType, React.ComponentType<{ content: any; onChange: (v: any) => void }>> = {
  hero: HeroEditor,
  statement: StatementEditor,
  marquee: MarqueeEditor,
  services: ServicesEditor,
  process: ProcessEditor,
  stats: StatsEditor,
  trust: TrustEditor,
  testimonials: TestimonialsEditor,
  faq: FaqEditor,
  cta: CtaEditor,
  contact: ContactEditor,
};

// ── Styles ───────────────────────────────────────────────────────────────────

const wrapperStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  padding: "28px 32px",
  fontFamily: "var(--font-sans)",
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  marginTop: 28,
  paddingTop: 24,
  borderTop: "1px solid #2a2825",
};

function saveButtonStyle(saving: boolean): React.CSSProperties {
  return {
    padding: "10px 24px",
    backgroundColor: saving ? "#8a7a54" : "#c4a96a",
    color: "#0a0a09",
    border: "none",
    borderRadius: 6,
    fontSize: "0.875rem",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    cursor: saving ? "not-allowed" : "pointer",
    transition: "background-color 0.15s ease",
  };
}

const cancelButtonStyle: React.CSSProperties = {
  padding: "10px 24px",
  backgroundColor: "transparent",
  color: "#9e9789",
  border: "1px solid #2a2825",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 400,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  transition: "color 0.15s ease, border-color 0.15s ease",
};

const savedBadgeStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  fontSize: "0.8125rem",
  color: "#4ade80",
  fontWeight: 500,
};

// ── Component ─────────────────────────────────────────────────────────────────

interface SectionEditorProps {
  section: Section;
}

export default function SectionEditor({ section }: SectionEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(section.content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previousContent, setPreviousContent] = useState(section.previous_content);
  const [showPreview, setShowPreview] = useState(true);

  const EditorComponent = EDITOR_MAP[section.type];

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const supabase = createClient();

    // Read current content before overwriting (for revert)
    const { data: current } = await supabase
      .from("sections")
      .select("content")
      .eq("id", section.id)
      .single();

    await supabase
      .from("sections")
      .update({
        content,
        previous_content: current?.content ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);

    setPreviousContent(current?.content ?? null);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleRevert() {
    if (!previousContent) return;
    if (!window.confirm("Are you sure? This will restore the last saved version.")) return;

    const supabase = createClient();
    await supabase
      .from("sections")
      .update({
        content: previousContent,
        previous_content: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", section.id);

    setContent(previousContent);
    setPreviousContent(null);
  }

  return (
    <div style={{ display: "flex", gap: 24, minHeight: "70vh" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={wrapperStyle}>
          <EditorComponent content={content} onChange={setContent} />

          <div style={actionsStyle}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={saveButtonStyle(saving)}
            >
              {saving ? "Saving…" : "Save"}
            </button>

            {previousContent != null && (
              <button
                onClick={handleRevert}
                style={{
                  padding: "10px 24px",
                  backgroundColor: "transparent",
                  color: "#c4a96a",
                  border: "1px solid #c4a96a",
                  borderRadius: 6,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                }}
              >
                Revert to Previous
              </button>
            )}

            <button
              onClick={() => router.back()}
              style={cancelButtonStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#f0ebe3";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#9e9789";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2825";
              }}
            >
              Cancel
            </button>

            {saved && <span style={savedBadgeStyle}>Saved!</span>}
          </div>
        </div>
      </div>
      {showPreview && (
        <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 32, alignSelf: "flex-start", height: "calc(100vh - 64px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ color: "#9e9789", fontSize: 13 }}>Live Preview</span>
            <button onClick={() => setShowPreview(false)} style={{ background: "none", border: "none", color: "#9e9789", cursor: "pointer", fontSize: 12 }}>Hide</button>
          </div>
          <PreviewFrame sectionId={section.id} sectionType={section.type} content={content} />
        </div>
      )}
      {!showPreview && (
        <button
          onClick={() => setShowPreview(true)}
          style={{ position: "fixed", right: 24, bottom: 24, padding: "8px 16px", borderRadius: 6, background: "#1c1a17", border: "1px solid #2a2825", color: "#9e9789", fontSize: 13, cursor: "pointer", zIndex: 50 }}
        >
          Show Preview
        </button>
      )}
    </div>
  );
}
