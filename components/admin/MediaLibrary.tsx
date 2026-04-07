"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MediaItem } from "@/lib/types/cms";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function uniqueFolders(items: MediaItem[]): string[] {
  const set = new Set<string>();
  for (const item of items) {
    if (item.folder) set.add(item.folder);
  }
  return Array.from(set).sort();
}

// ── Styles ───────────────────────────────────────────────────────────────────

const wrapperStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  padding: "40px 48px",
  color: "#f0ebe3",
};

const headerRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
  gap: 16,
  flexWrap: "wrap",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: 0,
};

const searchStyle: React.CSSProperties = {
  flex: "0 0 260px",
  padding: "8px 14px",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
};

const uploadButtonStyle: React.CSSProperties = {
  padding: "9px 20px",
  backgroundColor: "#c4a96a",
  color: "#0a0a09",
  border: "none",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  flexShrink: 0,
};

const pillsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 24,
};

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: "0.8125rem",
    fontFamily: "var(--font-sans)",
    cursor: "pointer",
    border: active ? "1px solid #c4a96a" : "1px solid #2a2825",
    backgroundColor: active ? "rgba(196,169,106,0.14)" : "#111110",
    color: active ? "#c4a96a" : "#9e9789",
    transition: "all 0.15s ease",
  };
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: 16,
  flex: 1,
  minWidth: 0,
};

function thumbCardStyle(selected: boolean): React.CSSProperties {
  return {
    backgroundColor: "#111110",
    border: `2px solid ${selected ? "#c4a96a" : "#2a2825"}`,
    borderRadius: 8,
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.15s ease",
    display: "flex",
    flexDirection: "column",
  };
}

const thumbImgWrapStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4/3",
  overflow: "hidden",
  backgroundColor: "#161514",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const thumbImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const thumbInfoStyle: React.CSSProperties = {
  padding: "8px 10px",
};

const thumbNameStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#f0ebe3",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginBottom: 2,
};

const thumbSizeStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  color: "#9e9789",
};

const layoutStyle: React.CSSProperties = {
  display: "flex",
  gap: 24,
  alignItems: "flex-start",
};

const detailPanelStyle: React.CSSProperties = {
  width: 280,
  flexShrink: 0,
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  padding: "20px",
  position: "sticky",
  top: 24,
};

const detailImgStyle: React.CSSProperties = {
  width: "100%",
  aspectRatio: "4/3",
  objectFit: "cover",
  borderRadius: 6,
  marginBottom: 16,
  backgroundColor: "#161514",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  marginBottom: 4,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "7px 10px",
  backgroundColor: "#161514",
  border: "1px solid #2a2825",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  marginBottom: 14,
};

const deleteButtonStyle: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "8px 0",
  backgroundColor: "rgba(248,113,113,0.1)",
  border: "1px solid rgba(248,113,113,0.3)",
  borderRadius: 6,
  color: "#f87171",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  fontWeight: 500,
};

const emptyStyle: React.CSSProperties = {
  padding: "64px 32px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.9375rem",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  width: "100%",
};

const detailHeadingStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#f0ebe3",
  marginBottom: 12,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

// ── Props ────────────────────────────────────────────────────────────────────

interface MediaLibraryProps {
  initialMedia: MediaItem[];
  pickerMode?: boolean;
  onPick?: (url: string) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MediaLibrary({ initialMedia, pickerMode, onPick }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [altDraft, setAltDraft] = useState("");
  const [folderDraft, setFolderDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  // Derive selected item
  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  // Sync drafts when selection changes
  const selectItem = useCallback(
    (item: MediaItem | null) => {
      setSelectedId(item?.id ?? null);
      setAltDraft(item?.alt_text ?? "");
      setFolderDraft(item?.folder ?? "");
    },
    []
  );

  // Filtered items
  const folders = uniqueFolders(items);
  const visible = items.filter((item) => {
    const matchFolder = folderFilter === "all" || item.folder === folderFilter;
    const matchSearch =
      search.trim() === "" ||
      item.filename.toLowerCase().includes(search.trim().toLowerCase());
    return matchFolder && matchSearch;
  });

  // ── Upload ──────────────────────────────────────────────────────────────────

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const timestamp = Date.now();
      const storagePath = `uploads/${timestamp}-${file.name}`;

      const { error: storageError } = await supabase.storage
        .from("media")
        .upload(storagePath, file, { upsert: false });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(storagePath);
      const publicUrl = urlData.publicUrl;

      const { data: inserted, error: dbError } = await supabase
        .from("media")
        .insert({
          filename: file.name,
          url: publicUrl,
          alt_text: null,
          size: file.size,
          mime_type: file.type || `image/${ext}`,
          folder: null,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      setItems((prev) => [inserted as MediaItem, ...prev]);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // ── Save alt text ───────────────────────────────────────────────────────────

  async function saveAlt() {
    if (!selectedItem) return;
    await supabase
      .from("media")
      .update({ alt_text: altDraft || null })
      .eq("id", selectedItem.id);
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, alt_text: altDraft || null } : i
      )
    );
  }

  // ── Save folder ─────────────────────────────────────────────────────────────

  async function saveFolder() {
    if (!selectedItem) return;
    await supabase
      .from("media")
      .update({ folder: folderDraft || null })
      .eq("id", selectedItem.id);
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, folder: folderDraft || null } : i
      )
    );
  }

  // ── Delete ──────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!selectedItem) return;
    if (!confirm(`Delete "${selectedItem.filename}"? This cannot be undone.`)) return;

    // Extract storage path from url
    const url = selectedItem.url;
    const marker = "/object/public/media/";
    const idx = url.indexOf(marker);
    if (idx !== -1) {
      const storagePath = decodeURIComponent(url.slice(idx + marker.length));
      await supabase.storage.from("media").remove([storagePath]);
    }

    await supabase.from("media").delete().eq("id", selectedItem.id);
    setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    selectItem(null);
  }

  // ── Click handler ───────────────────────────────────────────────────────────

  function handleCardClick(item: MediaItem) {
    if (pickerMode && onPick) {
      onPick(item.url);
      return;
    }
    if (selectedId === item.id) {
      selectItem(null);
    } else {
      selectItem(item);
    }
  }

  return (
    <div style={wrapperStyle} className="admin-content">
      {/* Header */}
      <div style={headerRowStyle}>
        <h1 style={headingStyle}>{pickerMode ? "Pick an Image" : "Media Library"}</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search files…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchStyle}
          />
          <button
            style={{ ...uploadButtonStyle, opacity: uploading ? 0.6 : 1 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Folder pills */}
      <div style={pillsRowStyle}>
        <button style={pillStyle(folderFilter === "all")} onClick={() => setFolderFilter("all")}>
          All
        </button>
        {folders.map((f) => (
          <button
            key={f}
            style={pillStyle(folderFilter === f)}
            onClick={() => setFolderFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div style={layoutStyle}>
        {/* Grid */}
        <div style={gridStyle}>
          {visible.length === 0 ? (
            <div style={emptyStyle}>No images found.</div>
          ) : (
            visible.map((item) => (
              <div
                key={item.id}
                style={thumbCardStyle(selectedId === item.id)}
                onClick={() => handleCardClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleCardClick(item)}
                aria-label={item.filename}
              >
                <div style={thumbImgWrapStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.alt_text ?? item.filename} style={thumbImgStyle} />
                </div>
                <div style={thumbInfoStyle}>
                  <div style={thumbNameStyle}>{item.filename}</div>
                  <div style={thumbSizeStyle}>{formatBytes(item.size)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        {selectedItem && !pickerMode && (
          <aside style={detailPanelStyle} aria-label="Image details">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedItem.url}
              alt={selectedItem.alt_text ?? selectedItem.filename}
              style={detailImgStyle}
            />
            <div style={detailHeadingStyle}>{selectedItem.filename}</div>
            <div style={{ fontSize: "0.75rem", color: "#9e9789", marginBottom: 16 }}>
              {formatBytes(selectedItem.size)}
              {selectedItem.mime_type ? ` · ${selectedItem.mime_type}` : ""}
            </div>

            {/* Alt text */}
            <label style={labelStyle}>Alt Text</label>
            <input
              type="text"
              value={altDraft}
              onChange={(e) => setAltDraft(e.target.value)}
              onBlur={saveAlt}
              placeholder="Describe the image…"
              style={inputStyle}
            />

            {/* Folder */}
            <label style={labelStyle}>Folder</label>
            <input
              type="text"
              value={folderDraft}
              onChange={(e) => setFolderDraft(e.target.value)}
              onBlur={saveFolder}
              placeholder="e.g. hero, logos…"
              style={inputStyle}
            />

            {/* Delete */}
            <button style={deleteButtonStyle} onClick={handleDelete}>
              Delete Image
            </button>
          </aside>
        )}
      </div>
    </div>
  );
}
