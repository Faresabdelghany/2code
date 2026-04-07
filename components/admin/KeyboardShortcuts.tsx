"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Shortcut map ────────────────────────────────────────────

const NAV_SHORTCUTS: Record<string, string> = {
  d: "/admin",
  p: "/admin/pages",
  m: "/admin/media",
  s: "/admin/submissions",
  t: "/admin/settings",
};

const SHORTCUT_LIST = [
  { keys: "G then D", description: "Go to Dashboard" },
  { keys: "G then P", description: "Go to Pages" },
  { keys: "G then M", description: "Go to Media" },
  { keys: "G then S", description: "Go to Submissions" },
  { keys: "G then T", description: "Go to Settings" },
  { keys: "Esc", description: "Close overlay / modal" },
  { keys: "?", description: "Toggle this help" },
];

// ── Styles ──────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 9999,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 12,
  padding: "28px 32px",
  maxWidth: 380,
  width: "90%",
  fontFamily: "var(--font-sans)",
};

const modalTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#f0ebe3",
  marginBottom: 20,
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const rowStyle: React.CSSProperties = {
  borderBottom: "1px solid #2a2825",
};

const keyCellStyle: React.CSSProperties = {
  padding: "8px 12px 8px 0",
  fontSize: "0.8125rem",
  fontFamily: "monospace",
  color: "#c4a96a",
  whiteSpace: "nowrap",
  width: 100,
};

const descCellStyle: React.CSSProperties = {
  padding: "8px 0",
  fontSize: "0.8125rem",
  color: "#9e9789",
};

const hintStyle: React.CSSProperties = {
  marginTop: 16,
  fontSize: "0.75rem",
  color: "#9e9789",
  textAlign: "center",
};

// ── Component ───────────────────────────────────────────────

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const [gPressed, setGPressed] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Suppress when focus is in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      const key = e.key.toLowerCase();

      // Esc — close overlays
      if (key === "escape") {
        if (showHelp) {
          setShowHelp(false);
          return;
        }
        document.dispatchEvent(new CustomEvent("close-overlay"));
        return;
      }

      // ? — toggle help
      if (e.key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        setShowHelp((v) => !v);
        return;
      }

      // G — start nav sequence
      if (key === "g" && !gPressed) {
        setGPressed(true);
        setTimeout(() => setGPressed(false), 1000);
        return;
      }

      // Second key after G
      if (gPressed) {
        setGPressed(false);
        const route = NAV_SHORTCUTS[key];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
        return;
      }
    },
    [gPressed, showHelp, router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!showHelp) return null;

  return (
    <div style={overlayStyle} onClick={() => setShowHelp(false)}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={modalTitleStyle}>Keyboard Shortcuts</div>
        <table style={tableStyle}>
          <tbody>
            {SHORTCUT_LIST.map((s) => (
              <tr key={s.keys} style={rowStyle}>
                <td style={keyCellStyle}>{s.keys}</td>
                <td style={descCellStyle}>{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={hintStyle}>Press ? or Esc to close</div>
      </div>
    </div>
  );
}
