"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Submission } from "@/lib/types/cms";

// ── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
  gap: 12,
  marginBottom: 24,
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: 0,
};

const badgeStyle: React.CSSProperties = {
  padding: "3px 10px",
  backgroundColor: "rgba(196,169,106,0.14)",
  border: "1px solid rgba(196,169,106,0.3)",
  borderRadius: 20,
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#c4a96a",
  fontFamily: "var(--font-sans)",
};

const pillsRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 20,
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

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

function rowStyle(unread: boolean): React.CSSProperties {
  return {
    backgroundColor: "#111110",
    border: "1px solid #2a2825",
    borderLeft: unread ? "3px solid #c4a96a" : "3px solid transparent",
    borderRadius: 8,
    overflow: "hidden",
  };
}

function rowHeaderStyle(unread: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    cursor: "pointer",
    backgroundColor: "transparent",
    width: "100%",
    border: "none",
    textAlign: "left",
    gap: 12,
    color: unread ? "#f0ebe3" : "#9e9789",
    fontFamily: "var(--font-sans)",
  };
}

const nameStyle = (unread: boolean): React.CSSProperties => ({
  fontSize: "0.9375rem",
  fontWeight: unread ? 600 : 400,
  color: unread ? "#f0ebe3" : "#9e9789",
  flexShrink: 0,
  minWidth: 140,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const emailPreviewStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#9e9789",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const timeStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#9e9789",
  flexShrink: 0,
  minWidth: 70,
  textAlign: "right",
};

const expandedStyle: React.CSSProperties = {
  padding: "0 18px 18px",
  borderTop: "1px solid #2a2825",
  marginTop: 0,
};

const emailLinkStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  color: "#c4a96a",
  textDecoration: "none",
  marginBottom: 12,
  display: "inline-block",
};

const messageStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#f0ebe3",
  lineHeight: 1.65,
  whiteSpace: "pre-wrap",
  backgroundColor: "#161514",
  border: "1px solid #2a2825",
  borderRadius: 6,
  padding: "12px 14px",
  marginBottom: 14,
  marginTop: 12,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

function markReadButtonStyle(): React.CSSProperties {
  return {
    padding: "7px 16px",
    backgroundColor: "rgba(196,169,106,0.1)",
    border: "1px solid rgba(196,169,106,0.3)",
    borderRadius: 6,
    color: "#c4a96a",
    fontSize: "0.8125rem",
    fontFamily: "var(--font-sans)",
    fontWeight: 500,
    cursor: "pointer",
  };
}

const deleteButtonStyle: React.CSSProperties = {
  padding: "7px 16px",
  backgroundColor: "rgba(248,113,113,0.1)",
  border: "1px solid rgba(248,113,113,0.3)",
  borderRadius: 6,
  color: "#f87171",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  cursor: "pointer",
};

const exportButtonStyle: React.CSSProperties = {
  padding: "7px 18px",
  backgroundColor: "rgba(196,169,106,0.1)",
  border: "1px solid rgba(196,169,106,0.3)",
  borderRadius: 6,
  color: "#c4a96a",
  fontSize: "0.8125rem",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  cursor: "pointer",
  marginLeft: "auto",
};

const emptyStyle: React.CSSProperties = {
  padding: "64px 32px",
  textAlign: "center",
  color: "#9e9789",
  fontSize: "0.9375rem",
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
};

// ── Row Component ─────────────────────────────────────────────────────────────

interface RowProps {
  submission: Submission;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function SubmissionRow({ submission, onMarkRead, onDelete }: RowProps) {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    if (!open && !submission.read) {
      onMarkRead(submission.id);
    }
    setOpen((v) => !v);
  }

  return (
    <div style={rowStyle(!submission.read)} aria-expanded={open}>
      <button
        style={rowHeaderStyle(!submission.read)}
        onClick={handleToggle}
        aria-label={`${submission.name} — ${submission.email}`}
      >
        <span style={nameStyle(!submission.read)}>{submission.name}</span>
        <span style={emailPreviewStyle}>{submission.email}</span>
        <span style={{ ...emailPreviewStyle, color: "#9e9789", display: open ? "none" : "block" }}>
          {submission.message.slice(0, 80)}{submission.message.length > 80 ? "…" : ""}
        </span>
        <span style={timeStyle}>{timeAgo(submission.created_at)}</span>
      </button>

      {open && (
        <div style={expandedStyle}>
          <a href={`mailto:${submission.email}`} style={emailLinkStyle}>
            {submission.email}
          </a>
          <div style={messageStyle}>{submission.message}</div>
          <div style={actionsStyle}>
            {!submission.read && (
              <button style={markReadButtonStyle()} onClick={() => onMarkRead(submission.id)}>
                Mark Read
              </button>
            )}
            <button style={deleteButtonStyle} onClick={() => onDelete(submission.id)}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface SubmissionsListProps {
  initialSubmissions: Submission[];
}

export default function SubmissionsList({ initialSubmissions }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const supabase = createClient();

  const unreadCount = submissions.filter((s) => !s.read).length;

  const visible =
    filter === "unread" ? submissions.filter((s) => !s.read) : submissions;

  async function handleMarkRead(id: string) {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: true } : s))
    );
    await supabase.from("submissions").update({ read: true }).eq("id", id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("submissions").delete().eq("id", id);
  }

  function exportCsv() {
    const header = "Name,Email,Message,Status,Date";
    const rows = submissions.map((s) => {
      const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
      const status = s.read ? "Read" : "Unread";
      const date = new Date(s.created_at).toISOString();
      return [esc(s.name), esc(s.email), esc(s.message), status, date].join(",");
    });
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `submissions-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={wrapperStyle} className="admin-content">
      {/* Header */}
      <div style={headerRowStyle}>
        <h1 style={headingStyle}>{submissions.length} submission{submissions.length !== 1 ? "s" : ""}</h1>
        {unreadCount > 0 && (
          <span style={badgeStyle}>{unreadCount} new</span>
        )}
        {submissions.length > 0 && (
          <button style={exportButtonStyle} onClick={exportCsv}>
            Export CSV
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div style={pillsRowStyle}>
        <button style={pillStyle(filter === "all")} onClick={() => setFilter("all")}>
          All
        </button>
        <button style={pillStyle(filter === "unread")} onClick={() => setFilter("unread")}>
          Unread
        </button>
      </div>

      {/* List */}
      <div style={listStyle}>
        {visible.length === 0 ? (
          <div style={emptyStyle}>
            {filter === "unread" ? "No unread submissions." : "No submissions yet."}
          </div>
        ) : (
          visible.map((s) => (
            <SubmissionRow
              key={s.id}
              submission={s}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
