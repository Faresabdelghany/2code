"use client";

import type { StatementContent } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
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
      <RichTextField label="Title Line 1" value={content.title_line1} onChange={(html) => update("title_line1", html)} />
      <RichTextField label="Title Line 2" value={content.title_line2} onChange={(html) => update("title_line2", html)} />
      <RichTextField label="Title Accent" value={content.title_accent} onChange={(html) => update("title_accent", html)} />
      <RichTextField label="Body" value={content.body} onChange={(html) => update("body", html)} />
      <RichTextField label="Proof Point" value={content.proof_point} onChange={(html) => update("proof_point", html)} />

      <div style={fieldStyle}>
        <label style={{ display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" }}>Mockup Type</label>
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
