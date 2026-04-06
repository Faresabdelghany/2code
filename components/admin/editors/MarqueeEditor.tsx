"use client";

import type { MarqueeContent } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

const labelStyle: React.CSSProperties = { display: "block", color: "#9e9789", fontSize: 12, marginBottom: 6, textTransform: "uppercase" };
const cardStyle: React.CSSProperties = { padding: 16, background: "#161514", borderRadius: 8, border: "1px solid #2a2825", marginBottom: 12 };

interface Props {
  content: MarqueeContent;
  onChange: (c: MarqueeContent) => void;
}

export default function MarqueeEditor({ content, onChange }: Props) {
  function updateTag(index: number, value: string) {
    const tags = [...content.tags];
    tags[index] = value;
    onChange({ ...content, tags });
  }

  function addTag() {
    onChange({ ...content, tags: [...content.tags, ""] });
  }

  function removeTag(index: number) {
    const tags = content.tags.filter((_, i) => i !== index);
    onChange({ ...content, tags });
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ ...labelStyle, marginBottom: 0 }}>Tags ({content.tags.length})</span>
        <button
          onClick={addTag}
          style={{ padding: "6px 14px", background: "#2a2825", color: "#f0ebe3", border: "none", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
        >
          + Add
        </button>
      </div>

      {content.tags.map((tag, i) => (
        <div key={i} style={{ ...cardStyle, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <RichTextField label={`Tag ${i + 1}`} value={tag} onChange={(html) => updateTag(i, html)} />
          </div>
          <button
            onClick={() => removeTag(i)}
            style={{ marginTop: 20, padding: "6px 10px", background: "transparent", color: "#9e9789", border: "1px solid #2a2825", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}
