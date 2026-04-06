"use client";

import type { ContactContent } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };

interface Props {
  content: ContactContent;
  onChange: (c: ContactContent) => void;
}

export default function ContactEditor({ content, onChange }: Props) {
  function update(key: keyof ContactContent, value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={content.heading} onChange={(e) => update("heading", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Subtext</label>
        <textarea style={textareaStyle} value={content.subtext} onChange={(e) => update("subtext", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Button Text</label>
        <input style={inputStyle} value={content.button_text} onChange={(e) => update("button_text", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Success Title</label>
        <input style={inputStyle} value={content.success_title} onChange={(e) => update("success_title", e.target.value)} />
      </div>

      <div style={{ marginBottom: 0 }}>
        <label style={labelStyle}>Success Message</label>
        <textarea style={textareaStyle} value={content.success_message} onChange={(e) => update("success_message", e.target.value)} />
      </div>
    </div>
  );
}
