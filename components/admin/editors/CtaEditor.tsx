"use client";

import type { CtaContent } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };

interface Props {
  content: CtaContent;
  onChange: (c: CtaContent) => void;
}

export default function CtaEditor({ content, onChange }: Props) {
  function update(key: keyof CtaContent, value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div>
      <RichTextField label="Headline" value={content.headline} onChange={(html) => update("headline", html)} />
      <RichTextField label="Subtext" value={content.subtext} onChange={(html) => update("subtext", html)} />
      <RichTextField label="Button Text" value={content.button_text} onChange={(html) => update("button_text", html)} />

      <div style={{ marginBottom: 0 }}>
        <label style={labelStyle}>Button URL</label>
        <input style={inputStyle} value={content.button_url} onChange={(e) => update("button_url", e.target.value)} />
      </div>
    </div>
  );
}
