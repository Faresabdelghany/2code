"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Pages", href: "/admin/pages" },
  { label: "Media", href: "/admin/media" },
  { label: "Submissions", href: "/admin/submissions" },
  { label: "Settings", href: "/admin/settings" },
];

const sidebarStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 220,
  height: "100vh",
  backgroundColor: "#111110",
  display: "flex",
  flexDirection: "column",
  zIndex: 50,
  borderRight: "1px solid rgba(255,255,255,0.06)",
  transition: "transform 0.25s ease",
};

const brandingStyle: React.CSSProperties = {
  padding: "28px 24px 24px",
  fontFamily: "var(--font-serif)",
  fontSize: "0.85rem",
  fontWeight: 700,
  letterSpacing: "0.15em",
  color: "#c4a96a",
  textTransform: "uppercase",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};

const navStyle: React.CSSProperties = {
  flex: 1,
  padding: "16px 0",
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function navItemStyle(active: boolean): React.CSSProperties {
  return {
    display: "block",
    padding: "10px 24px",
    fontSize: "0.875rem",
    fontWeight: active ? 500 : 400,
    color: active ? "#f0ebe3" : "#9e9789",
    backgroundColor: active ? "rgba(196,169,106,0.12)" : "transparent",
    borderLeft: active ? "2px solid #c4a96a" : "2px solid transparent",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.15s ease, background-color 0.15s ease",
    fontFamily: "var(--font-sans)",
  };
}

const signOutButtonStyle: React.CSSProperties = {
  margin: "0 16px 24px",
  padding: "10px 16px",
  fontSize: "0.8125rem",
  fontWeight: 400,
  color: "#9e9789",
  backgroundColor: "transparent",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  transition: "color 0.15s ease, border-color 0.15s ease",
  textAlign: "left",
};

const backdropStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 49,
};

// ── Props ───────────────────────────────────────────────────

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

// ── Component ───────────────────────────────────────────────

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin");
  }

  function handleNavClick(href: string) {
    if (onClose) onClose();
    router.push(href);
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: ${mobileOpen ? "translateX(0)" : "translateX(-100%)"} !important;
          }
        }
      `}</style>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          style={backdropStyle}
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <nav style={sidebarStyle} className="admin-sidebar" aria-label="Admin navigation">
        <div style={brandingStyle}>FORMA CMS</div>

        <div style={navStyle}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                style={navItemStyle(active)}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <button
          onClick={handleSignOut}
          style={signOutButtonStyle}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f0ebe3";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#9e9789";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          Sign Out
        </button>
      </nav>

      <style>{`
        @media (min-width: 769px) {
          .admin-sidebar-backdrop { display: none !important; }
        }
      `}</style>
    </>
  );
}
