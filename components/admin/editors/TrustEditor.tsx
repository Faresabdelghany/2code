"use client";

import type { TrustContent, TrustClient } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #2a2825", background: "#111110", color: "#f0ebe3", fontSize: 14, outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const cardStyle: React.CSSProperties = { padding: 16, background: "#161514", borderRadius: 8, border: "1px solid #2a2825", marginBottom: 12 };

interface Props {
  content: TrustContent;
  onChange: (c: TrustContent) => void;
}

export default function TrustEditor({ content, onChange }: Props) {
  function updateHeader(value: string) {
    onChange({ ...content, header: value });
  }

  function updateItem(index: number, updates: Partial<TrustClient>) {
    const clients = content.clients.map((client, i) => i === index ? { ...client, ...updates } : client);
    onChange({ ...content, clients });
  }

  function addItem() {
    onChange({ ...content, clients: [...content.clients, { name: "", logo_url: null }] });
  }

  function removeItem(index: number) {
    onChange({ ...content, clients: content.clients.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <RichTextField label="Header" value={content.header} onChange={updateHeader} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Clients ({content.clients.length})</span>
        <button
          onClick={addItem}
          style={{ padding: "6px 14px", background: "#2a2825", color: "#f0ebe3", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
        >
          + Add
        </button>
      </div>

      {content.clients.map((client, i) => (
        <div key={i} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#f0ebe3", fontSize: 13, fontWeight: 600 }}>Client {i + 1}</span>
            <button
              onClick={() => removeItem(i)}
              style={{ padding: "4px 10px", background: "transparent", color: "#9e9789", border: "1px solid #2a2825", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
            >
              Remove
            </button>
          </div>

          <RichTextField label="Name" value={client.name} onChange={(html) => updateItem(i, { name: html })} />

          <div style={{ marginBottom: 0 }}>
            <label style={labelStyle}>Logo URL</label>
            <input style={inputStyle} value={client.logo_url ?? ""} onChange={(e) => updateItem(i, { logo_url: e.target.value || null })} />
          </div>
        </div>
      ))}
    </div>
  );
}
