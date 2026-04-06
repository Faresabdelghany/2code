"use client";

import type { FaqContent, FaqItem } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };
const cardStyle: React.CSSProperties = { padding: 16, background: "#161514", borderRadius: 8, border: "1px solid #2a2825", marginBottom: 12 };

interface Props {
  content: FaqContent;
  onChange: (c: FaqContent) => void;
}

export default function FaqEditor({ content, onChange }: Props) {
  function updateItem(index: number, updates: Partial<FaqItem>) {
    const items = content.items.map((item, i) => i === index ? { ...item, ...updates } : item);
    onChange({ ...content, items });
  }

  function addItem() {
    onChange({ ...content, items: [...content.items, { question: "", answer: "" }] });
  }

  function removeItem(index: number) {
    onChange({ ...content, items: content.items.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>FAQ Items ({content.items.length})</span>
        <button
          onClick={addItem}
          style={{ padding: "6px 14px", background: "#2a2825", color: "#f0ebe3", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
        >
          + Add
        </button>
      </div>

      {content.items.map((item, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#f0ebe3", fontSize: 13, fontWeight: 600 }}>Q{i + 1}</span>
            <button
              onClick={() => removeItem(i)}
              style={{ padding: "4px 10px", background: "transparent", color: "#9e9789", border: "1px solid #2a2825", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
            >
              Remove
            </button>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Question</label>
            <input style={inputStyle} value={item.question} onChange={(e) => updateItem(i, { question: e.target.value })} />
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Answer</label>
            <textarea style={textareaStyle} value={item.answer} onChange={(e) => updateItem(i, { answer: e.target.value })} />
          </div>
        </div>
      ))}
    </div>
  );
}
