"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { KeyboardSensor } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { createClient } from "@/lib/supabase/client";
import type { Section } from "@/lib/types/cms";

// ── Styles ──────────────────────────────────────────────────────────────────

const listStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

function rowStyle(isDragging: boolean): React.CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: 12,
    backgroundColor: isDragging ? "#1c1a17" : "#161514",
    border: `1px solid ${isDragging ? "#c4a96a" : "#2a2825"}`,
    borderRadius: 8,
    padding: "12px 16px",
    transition: "border-color 0.15s ease, background-color 0.15s ease",
    opacity: isDragging ? 0.9 : 1,
  };
}

const handleStyle: React.CSSProperties = {
  color: "#9e9789",
  cursor: "grab",
  fontSize: "1rem",
  userSelect: "none",
  flexShrink: 0,
  lineHeight: 1,
};

const titleLinkStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "0.9375rem",
  fontWeight: 500,
  color: "#f0ebe3",
  textDecoration: "none",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

function badgeStyle(type: string): React.CSSProperties {
  return {
    flexShrink: 0,
    padding: "3px 8px",
    backgroundColor: "rgba(196,169,106,0.12)",
    border: "1px solid rgba(196,169,106,0.25)",
    borderRadius: 4,
    fontSize: "0.6875rem",
    fontWeight: 500,
    color: "#c4a96a",
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    fontFamily: "var(--font-sans)",
  };
}

function visibilityButtonStyle(visible: boolean): React.CSSProperties {
  return {
    flexShrink: 0,
    padding: "4px 10px",
    backgroundColor: visible ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
    border: `1px solid ${visible ? "rgba(74,222,128,0.25)" : "rgba(248,113,113,0.25)"}`,
    borderRadius: 4,
    fontSize: "0.6875rem",
    fontWeight: 500,
    color: visible ? "#4ade80" : "#f87171",
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    letterSpacing: "0.04em",
    transition: "all 0.15s ease",
  };
}

// ── Sortable Row ─────────────────────────────────────────────────────────────

interface SortableRowProps {
  section: Section;
  pageId: string;
  onToggleVisible: (id: string, current: boolean) => void;
}

function SortableRow({ section, pageId, onToggleVisible }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={rowStyle(isDragging)}>
        {/* Drag handle */}
        <span style={handleStyle} {...attributes} {...listeners} aria-label="Drag to reorder">
          ⠿
        </span>

        {/* Title link */}
        <Link
          href={`/admin/pages/${pageId}/sections/${section.id}`}
          style={titleLinkStyle}
        >
          {section.title}
        </Link>

        {/* Type badge */}
        <span style={badgeStyle(section.type)}>{section.type}</span>

        {/* Visibility toggle */}
        <button
          style={visibilityButtonStyle(section.visible)}
          onClick={() => onToggleVisible(section.id, section.visible)}
          aria-label={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible ? "Visible" : "Hidden"}
        </button>
      </div>
    </div>
  );
}

// ── Section List ─────────────────────────────────────────────────────────────

interface SectionListProps {
  sections: Section[];
  pageId: string;
}

export default function SectionList({ sections: initialSections, pageId }: SectionListProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(sections, oldIndex, newIndex);

    // Optimistic local update
    setSections(reordered);

    // Persist new sort_order for every row
    await Promise.all(
      reordered.map((section, index) =>
        supabase
          .from("sections")
          .update({ sort_order: index })
          .eq("id", section.id)
      )
    );
  }

  async function handleToggleVisible(id: string, currentVisible: boolean) {
    // Optimistic local update
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !currentVisible } : s))
    );

    await supabase
      .from("sections")
      .update({ visible: !currentVisible })
      .eq("id", id);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div style={listStyle}>
          {sections.map((section) => (
            <SortableRow
              key={section.id}
              section={section}
              pageId={pageId}
              onToggleVisible={handleToggleVisible}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
