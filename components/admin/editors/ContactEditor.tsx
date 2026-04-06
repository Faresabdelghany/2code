"use client";

import type { ContactContent } from "@/lib/types/cms";
import RichTextField from "@/components/admin/RichTextField";

interface Props {
  content: ContactContent;
  onChange: (c: ContactContent) => void;
}

export default function ContactEditor({ content, onChange }: Props) {
  function update(key: keyof ContactContent, value: string) {
    onChange({ ...content, [key]: value });
  }

  return (
    <div>
      <RichTextField label="Heading" value={content.heading} onChange={(html) => update("heading", html)} />
      <RichTextField label="Subtext" value={content.subtext} onChange={(html) => update("subtext", html)} />
      <RichTextField label="Button Text" value={content.button_text} onChange={(html) => update("button_text", html)} />
      <RichTextField label="Success Title" value={content.success_title} onChange={(html) => update("success_title", html)} />
      <RichTextField label="Success Message" value={content.success_message} onChange={(html) => update("success_message", html)} />
    </div>
  );
}
