"use client";

import type { TestimonialsContent, TestimonialItem } from "@/lib/types/cms";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: "vertical" as const };
const fieldStyle: React.CSSProperties = { marginBottom: 16 };
const cardStyle: React.CSSProperties = { padding: 16, background: "#161514", borderRadius: 8, border: "1px solid #2a2825", marginBottom: 12 };

interface Props {
  content: TestimonialsContent;
  onChange: (c: TestimonialsContent) => void;
}

export default function TestimonialsEditor({ content, onChange }: Props) {
  function updateItem(index: number, updates: Partial<TestimonialItem>) {
    const items = content.items.map((item, i) => i === index ? { ...item, ...updates } : item);
    onChange({ ...content, items });
  }

  function addItem() {
    onChange({ ...content, items: [...content.items, { quote: "", name: "", role: "", avatar_url: null }] });
  }

  function removeItem(index: number) {
    onChange({ ...content, items: content.items.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Testimonials ({content.items.length})</span>
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
            <span style={{ color: "#f0ebe3", fontSize: 13, fontWeight: 600 }}>Testimonial {i + 1}</span>
            <button
              onClick={() => removeItem(i)}
              style={{ padding: "4px 10px", background: "transparent", color: "#9e9789", border: "1px solid #2a2825", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
            >
              Remove
            </button>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Quote</label>
            <textarea style={textareaStyle} value={item.quote} onChange={(e) => updateItem(i, { quote: e.target.value })} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={item.name} onChange={(e) => updateItem(i, { name: e.target.value })} />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} value={item.role} onChange={(e) => updateItem(i, { role: e.target.value })} />
          </div>

          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Avatar URL</label>
            <input style={inputStyle} value={item.avatar_url ?? ""} onChange={(e) => updateItem(i, { avatar_url: e.target.value || null })} />
          </div>
        </div>
      ))}
    </div>
  );
}
