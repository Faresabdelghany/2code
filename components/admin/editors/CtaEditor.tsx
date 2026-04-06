"use client";

import type { CtaContent } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };

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
      <div style={fieldStyle}>
        <label style={labelStyle}>Headline</label>
        <input style={inputStyle} value={content.headline} onChange={(e) => update("headline", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Subtext</label>
        <textarea style={textareaStyle} value={content.subtext} onChange={(e) => update("subtext", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Button Text</label>
        <input style={inputStyle} value={content.button_text} onChange={(e) => update("button_text", e.target.value)} />
      </div>

      <div style={{ marginBottom: 0 }}>
        <label style={labelStyle}>Button URL</label>
        <input style={inputStyle} value={content.button_url} onChange={(e) => update("button_url", e.target.value)} />
      </div>
    </div>
  );
}
