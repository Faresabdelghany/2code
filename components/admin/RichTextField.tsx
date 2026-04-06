"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface Props {
  label: string;
  value: string;
  onChange: (html: string) => void;
}

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  gap: 4,
  padding: "4px 6px",
  borderRadius: "6px 6px 0 0",
  border: "1px solid #2a2825",
  borderBottom: "none",
  background: "#1c1a17",
};

const btnBase: React.CSSProperties = {
  padding: "4px 8px",
  background: "transparent",
  color: "#9e9789",
  border: "none",
  borderRadius: 4,
  fontSize: 13,
  cursor: "pointer",
  lineHeight: 1,
};

const btnActive: React.CSSProperties = {
  ...btnBase,
  background: "#2a2825",
  color: "#f0ebe3",
};

const editorWrapperStyle: React.CSSProperties = {
  border: "1px solid #2a2825",
  borderTop: "none",
  borderRadius: "0 0 6px 6px",
  padding: "8px 12px",
  minHeight: 40,
  background: "#111110",
  color: "#f0ebe3",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#9e9789",
  fontSize: 12,
  marginBottom: 6,
  textTransform: "uppercase",
};

const fieldStyle: React.CSSProperties = { marginBottom: 16 };

export default function RichTextField({ label, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        listItem: false,
        orderedList: false,
        strike: false,
      }),
      Link.configure({ openOnClick: false }),
    ],
    content: value,
    onUpdate({ editor: ed }) {
      onChange(ed.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync external value changes (needed for revert feature)
  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  function handleLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  const isBold = editor?.isActive("bold") ?? false;
  const isItalic = editor?.isActive("italic") ?? false;
  const isLink = editor?.isActive("link") ?? false;

  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={toolbarStyle}>
        <button
          type="button"
          style={isBold ? btnActive : btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleBold().run();
          }}
        >
          B
        </button>
        <button
          type="button"
          style={isItalic ? btnActive : btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleItalic().run();
          }}
        >
          I
        </button>
        <button
          type="button"
          style={isLink ? btnActive : btnBase}
          onMouseDown={(e) => {
            e.preventDefault();
            handleLink();
          }}
        >
          🔗
        </button>
      </div>
      <div style={editorWrapperStyle}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
