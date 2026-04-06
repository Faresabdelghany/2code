"use client";

import type { HeroContent } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };
const cardStyle: React.CSSProperties = { padding: 16, background: "#161514", borderRadius: 8, border: "1px solid #2a2825", marginBottom: 12 };

interface Props {
  content: HeroContent;
  onChange: (c: HeroContent) => void;
}

export default function HeroEditor({ content, onChange }: Props) {
  function update(key: keyof HeroContent, value: string) {
    onChange({ ...content, [key]: value });
  }

  function updateCtaPrimary(key: "text" | "url", value: string) {
    onChange({ ...content, cta_primary: { ...content.cta_primary, [key]: value } });
  }

  function updateCtaSecondary(key: "text" | "url", value: string) {
    onChange({ ...content, cta_secondary: { ...content.cta_secondary, [key]: value } });
  }

  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Eyebrow</label>
        <input style={inputStyle} value={content.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Headline</label>
        <input style={inputStyle} value={content.headline} onChange={(e) => update("headline", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Subheadline</label>
        <textarea style={textareaStyle} value={content.subheadline} onChange={(e) => update("subheadline", e.target.value)} />
      </div>

      <div style={cardStyle}>
        <div style={{ color: "#9e9789", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Primary CTA</div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Text</label>
          <input style={inputStyle} value={content.cta_primary.text} onChange={(e) => updateCtaPrimary("text", e.target.value)} />
        </div>
        <div style={{ marginBottom: 0 }}>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={content.cta_primary.url} onChange={(e) => updateCtaPrimary("url", e.target.value)} />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ color: "#9e9789", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Secondary CTA</div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Text</label>
          <input style={inputStyle} value={content.cta_secondary.text} onChange={(e) => updateCtaSecondary("text", e.target.value)} />
        </div>
        <div style={{ marginBottom: 0 }}>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={content.cta_secondary.url} onChange={(e) => updateCtaSecondary("url", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
