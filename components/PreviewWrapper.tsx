"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import type { Section } from "@/lib/types/cms";

interface PreviewWrapperProps {
  sections: Section[];
  children: (sections: Section[]) => ReactNode;
}

export default function PreviewWrapper({ sections: initialSections, children }: PreviewWrapperProps) {
  const [sections, setSections] = useState(initialSections);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type !== "cms-preview") return;
    const { sectionId, content } = event.data;
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content } : s))
    );
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Auto-scroll to edited section
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "cms-preview") return;
      const { sectionId } = event.data;
      const el = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return <>{children(sections)}</>;
}
