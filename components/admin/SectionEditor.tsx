"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Section, SectionType } from "@/lib/types/cms";

// ── Editor imports (created in the next task) ────────────────────────────────
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

  const EditorComponent = EDITOR_MAP[section.type];

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const supabase = createClient();
    await supabase
      .from("sections")
      .update({ content, updated_at: new Date().toISOString() })
      .eq("id", section.id);

    setSaving(false);
    setSaved(true);

    // Clear "Saved!" feedback after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  }

  return (
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
  );
}
