"use client";

import type { StatementContent } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };

interface Props {
  content: StatementContent;
  onChange: (c: StatementContent) => void;
}

export default function StatementEditor({ content, onChange }: Props) {
  function update(key: keyof StatementContent, value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div>
      <div style={fieldStyle}>
        <label style={labelStyle}>Title Line 1</label>
        <input style={inputStyle} value={content.title_line1} onChange={(e) => update("title_line1", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Title Line 2</label>
        <input style={inputStyle} value={content.title_line2} onChange={(e) => update("title_line2", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Title Accent</label>
        <input style={inputStyle} value={content.title_accent} onChange={(e) => update("title_accent", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Body</label>
        <textarea style={textareaStyle} value={content.body} onChange={(e) => update("body", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Proof Point</label>
        <input style={inputStyle} value={content.proof_point} onChange={(e) => update("proof_point", e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Mockup Type</label>
        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={content.mockup_type}
          onChange={(e) => update("mockup_type", e.target.value)}
        >
          <option value="browser">Browser</option>
          <option value="cart">Cart</option>
          <option value="dashboard">Dashboard</option>
          <option value="phones">Phones</option>
        </select>
      </div>
    </div>
  );
}
