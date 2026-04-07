"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaLibrary from "@/components/admin/MediaLibrary";
import type { MediaItem } from "@/lib/types/cms";

// ── Styles ──────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  marginBottom: 28,
  overflow: "hidden",
};

const panelHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 20px",
  cursor: "pointer",
  userSelect: "none",
};

const panelTitleStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  margin: 0,
};

const panelBodyStyle: React.CSSProperties = {
  padding: "0 20px 20px",
};

const fieldGroupStyle: React.CSSProperties = {
  marginBottom: 18,
};

const labelRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  backgroundColor: "#161514",
  border: "1px solid #2a2825",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical" as const,
  lineHeight: 1.5,
};

const placeholderBoxStyle: React.CSSProperties = {
  border: "2px dashed #2a2825",
  borderRadius: 8,
  padding: "28px 20px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.8125rem",
};

const thumbPreviewStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const thumbImgStyle: React.CSSProperties = {
  width: 120,
  height: 68,
  objectFit: "cover",
  borderRadius: 6,
  border: "1px solid #2a2825",
  backgroundColor: "#161514",
};

const smallBtnStyle: React.CSSProperties = {
  padding: "5px 12px",
  fontSize: "0.75rem",
  fontFamily: "var(--font-sans)",
  borderRadius: 4,
  cursor: "pointer",
  border: "1px solid #2a2825",
  backgroundColor: "#161514",
  color: "#f0ebe3",
};

const dangerBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  border: "1px solid rgba(248,113,113,0.3)",
  backgroundColor: "rgba(248,113,113,0.1)",
  color: "#f87171",
};

const saveButtonStyle: React.CSSProperties = {
  padding: "9px 24px",
  backgroundColor: "#c4a96a",
  color: "#0a0a09",
  border: "none",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  backgroundColor: "rgba(0,0,0,0.8)",
  display: "flex",
  flexDirection: "column",
};

const overlayHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "12px 20px",
};

const closeBtnStyle: React.CSSProperties = {
  padding: "6px 16px",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  borderRadius: 6,
  cursor: "pointer",
  border: "1px solid #2a2825",
  backgroundColor: "#111110",
  color: "#f0ebe3",
};

// ── Helpers ─────────────────────────────────────────────────

function charBadgeColor(len: number, green: number, yellow: number): string {
  if (len <= green) return "#4ade80";
  if (len <= yellow) return "#facc15";
  return "#f87171";
}

// ── Props ───────────────────────────────────────────────────

interface SeoEditorProps {
  pageId: string;
  initialTitle: string;
  initialDescription: string;
  initialOgImage: string;
}

// ── Component ───────────────────────────────────────────────

export default function SeoEditor({
  pageId,
  initialTitle,
  initialDescription,
  initialOgImage,
}: SeoEditorProps) {
  const [metaTitle, setMetaTitle] = useState(initialTitle);
  const [metaDescription, setMetaDescription] = useState(initialDescription);
  const [ogImage, setOgImage] = useState(initialOgImage);
  const [expanded, setExpanded] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  const supabase = createClient();

  async function openPicker() {
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    setMediaItems((data ?? []) as MediaItem[]);
    setShowPicker(true);
  }

  function handlePick(url: string) {
    setOgImage(url);
    setShowPicker(false);
  }

  async function handleSave() {
    setSaving(true);
    await supabase
      .from("pages")
      .update({
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        og_image: ogImage || null,
      })
      .eq("id", pageId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const chevron = expanded ? "\u25B2" : "\u25BC";

  return (
    <>
      <div style={panelStyle}>
        <div style={panelHeaderStyle} onClick={() => setExpanded(!expanded)}>
          <h2 style={panelTitleStyle}>SEO &amp; Meta</h2>
          <span style={{ fontSize: "0.625rem", color: "#9e9789" }}>{chevron}</span>
        </div>

        {expanded && (
          <div style={panelBodyStyle}>
            {/* Meta Title */}
            <div style={fieldGroupStyle}>
              <div style={labelRowStyle}>
                <span style={labelStyle}>Meta Title</span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontFamily: "monospace",
                    color: charBadgeColor(metaTitle.length, 60, 70),
                  }}
                >
                  {metaTitle.length}/60
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Page title for search engines\u2026"
                style={inputStyle}
              />
            </div>

            {/* Meta Description */}
            <div style={fieldGroupStyle}>
              <div style={labelRowStyle}>
                <span style={labelStyle}>Meta Description</span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    fontFamily: "monospace",
                    color: charBadgeColor(metaDescription.length, 160, 180),
                  }}
                >
                  {metaDescription.length}/160
                </span>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for search results\u2026"
                rows={3}
                style={textareaStyle}
              />
            </div>

            {/* OG Image */}
            <div style={fieldGroupStyle}>
              <div style={labelRowStyle}>
                <span style={labelStyle}>OG Image</span>
              </div>
              {ogImage ? (
                <div style={thumbPreviewStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ogImage} alt="OG preview" style={thumbImgStyle} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={smallBtnStyle} onClick={openPicker}>
                      Change
                    </button>
                    <button style={dangerBtnStyle} onClick={() => setOgImage("")}>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div style={placeholderBoxStyle}>
                  <button style={smallBtnStyle} onClick={openPicker}>
                    Choose from Media
                  </button>
                </div>
              )}
            </div>

            {/* Save */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 6 }}>
              <button
                style={{ ...saveButtonStyle, opacity: saving ? 0.6 : 1 }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving\u2026" : "Save SEO"}
              </button>
              {saved && (
                <span style={{ fontSize: "0.8125rem", color: "#4ade80", fontWeight: 500 }}>
                  Saved!
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media picker overlay */}
      {showPicker && (
        <div style={overlayStyle}>
          <div style={overlayHeaderStyle}>
            <button style={closeBtnStyle} onClick={() => setShowPicker(false)}>
              Close
            </button>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            <MediaLibrary initialMedia={mediaItems} pickerMode onPick={handlePick} />
          </div>
        </div>
      )}
    </>
  );
}
