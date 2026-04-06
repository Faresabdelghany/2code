"use client";

import type { HeroContent } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
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
      <RichTextField label="Eyebrow" value={content.eyebrow} onChange={(html) => update("eyebrow", html)} />
      <RichTextField label="Headline" value={content.headline} onChange={(html) => update("headline", html)} />
      <RichTextField label="Subheadline" value={content.subheadline} onChange={(html) => update("subheadline", html)} />

      <div style={cardStyle}>
        <div style={{ color: "#9e9789", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Primary CTA</div>
        <RichTextField label="Text" value={content.cta_primary.text} onChange={(html) => updateCtaPrimary("text", html)} />
        <div style={{ marginBottom: 0 }}>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={content.cta_primary.url} onChange={(e) => updateCtaPrimary("url", e.target.value)} />
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ color: "#9e9789", fontSize: 12, textTransform: "uppercase", marginBottom: 12 }}>Secondary CTA</div>
        <RichTextField label="Text" value={content.cta_secondary.text} onChange={(html) => updateCtaSecondary("text", html)} />
        <div style={{ marginBottom: 0 }}>
          <label style={labelStyle}>URL</label>
          <input style={inputStyle} value={content.cta_secondary.url} onChange={(e) => updateCtaSecondary("url", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
