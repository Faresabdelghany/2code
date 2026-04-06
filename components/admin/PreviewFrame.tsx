"use client";

import { useRef, useEffect } from "react";

interface PreviewFrameProps {
  sectionId: string;
  sectionType: string;
  content: unknown;
}

export default function PreviewFrame({ sectionId, sectionType, content }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: "cms-preview", sectionId, sectionType, content },
      window.location.origin
    );
  }, [content, sectionId, sectionType]);

  return (
    <iframe
      ref={iframeRef}
      src="/?preview=true"
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #2a2825",
        borderRadius: 8,
        background: "#0a0a09",
      }}
      title="Live Preview"
    />
  );
}
