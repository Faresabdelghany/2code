"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import KeyboardShortcuts from "@/components/admin/KeyboardShortcuts";

// ── Styles ──────────────────────────────────────────────────

const shellStyle: React.CSSProperties = {
  display: "flex",
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  marginLeft: 220,
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

const hamburgerStyle: React.CSSProperties = {
  position: "fixed",
  top: 14,
  left: 14,
  zIndex: 48,
  width: 40,
  height: 40,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 8,
  cursor: "pointer",
  padding: 0,
};

const hamburgerLineStyle: React.CSSProperties = {
  width: 18,
  height: 2,
  backgroundColor: "#f0ebe3",
  borderRadius: 1,
};

// ── Component ───────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-content {
            margin-left: 0 !important;
            padding: 20px 16px !important;
          }
          .admin-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-hamburger { display: none !important; }
        }
      `}</style>

      <div style={shellStyle}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        {/* Hamburger — mobile only */}
        <button
          className="admin-hamburger"
          style={{ ...hamburgerStyle, display: "none" }}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <span style={hamburgerLineStyle} />
          <span style={hamburgerLineStyle} />
          <span style={hamburgerLineStyle} />
        </button>

        <main style={contentStyle} className="admin-content">
          {children}
        </main>
      </div>

      <KeyboardShortcuts />
    </>
  );
}
