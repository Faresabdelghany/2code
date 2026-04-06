# CMS Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add rich text editing, one-step undo/revert, and live preview to the FORMA CMS admin panel.

**Architecture:** Rich text uses Tiptap (headless ProseMirror) storing HTML strings in existing JSONB fields. Undo/revert adds a `previous_content` column to sections — each save snapshots the old content. Live preview uses an iframe loading the public site with a `?preview=true` param; content changes are streamed via postMessage.

**Tech Stack:** Tiptap (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-link), existing Next.js 16 + Supabase stack

**Spec:** `docs/superpowers/specs/2026-04-06-cms-enhancements-design.md`

**Note:** This project has no test infrastructure (per CLAUDE.md). Verification uses dev server and browser.

---

## File Structure Overview

```
New files:
  components/admin/RichTextField.tsx     — Shared Tiptap editor component
  components/admin/PreviewFrame.tsx      — Iframe wrapper for live preview
  components/PreviewWrapper.tsx          — Client component on public site listening for preview messages

Modified files:
  package.json                           — Add Tiptap dependencies
  lib/types/cms.ts                       — Add previous_content to Section, previous_value to SettingsRow
  lib/schema.sql                         — Add columns to reference schema
  components/admin/SectionEditor.tsx     — Rich text, revert button, postMessage for preview, split layout
  components/admin/SettingsEditor.tsx     — Revert support for settings
  components/admin/editors/HeroEditor.tsx         — Replace inputs with RichTextField
  components/admin/editors/StatementEditor.tsx     — Same
  components/admin/editors/ServicesEditor.tsx      — Same
  components/admin/editors/ProcessEditor.tsx       — Same
  components/admin/editors/StatsEditor.tsx         — Same
  components/admin/editors/TrustEditor.tsx         — Same
  components/admin/editors/TestimonialsEditor.tsx  — Same
  components/admin/editors/FaqEditor.tsx           — Same
  components/admin/editors/CtaEditor.tsx           — Same
  components/admin/editors/ContactEditor.tsx       — Same
  components/admin/editors/MarqueeEditor.tsx       — Same
  app/admin/pages/[id]/sections/[sectionId]/page.tsx — Pass previous_content, split layout
  app/page.tsx                           — Add PreviewWrapper when ?preview=true
  components/Hero.tsx                    — Render HTML with dangerouslySetInnerHTML
  components/Services.tsx                — Same
  components/Process.tsx                 — Same
  components/Stats.tsx                   — Same
  components/Trust.tsx                   — Same
  components/Testimonials.tsx            — Same
  components/FAQ.tsx                     — Same
  components/Contact.tsx                 — Same
  components/Footer.tsx                  — Same
  components/Navbar.tsx                  — Same
  components/Marquee.tsx                 — Same
  components/Statement.tsx               — Same
```

---

## Phase 1: Rich Text Editor

### Task 1: Install Tiptap Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Tiptap packages**

```bash
cd /Users/skuser/Forma && npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/skuser/Forma && npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(cms): install Tiptap rich text editor dependencies"
```

---

### Task 2: Create RichTextField Component

**Files:**
- Create: `components/admin/RichTextField.tsx`

- [ ] **Step 1: Create the shared RichTextField component**

Create `/Users/skuser/Forma/components/admin/RichTextField.tsx`:

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useCallback } from "react";

interface RichTextFieldProps {
  label: string;
  value: string;
  onChange: (html: string) => void;
}

const wrapperStyle: React.CSSProperties = { marginBottom: 16 };

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#9e9789",
  fontSize: 12,
  marginBottom: 6,
  textTransform: "uppercase",
};

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  gap: 4,
  padding: "4px 6px",
  background: "#1c1a17",
  borderRadius: "6px 6px 0 0",
  border: "1px solid #2a2825",
  borderBottom: "none",
};

function toolbarButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: "4px 8px",
    background: active ? "#2a2825" : "transparent",
    color: active ? "#f0ebe3" : "#9e9789",
    border: "none",
    borderRadius: 4,
    fontSize: 13,
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    fontFamily: "var(--font-sans)",
    lineHeight: 1,
  };
}

const editorWrapperStyle: React.CSSProperties = {
  border: "1px solid #2a2825",
  borderRadius: "0 0 6px 6px",
  background: "#111110",
  color: "#f0ebe3",
  fontSize: 14,
  minHeight: 40,
  padding: "8px 12px",
  outline: "none",
};

export default function RichTextField({ label, value, onChange }: RichTextFieldProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable features we don't need
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: "outline: none; min-height: 24px;",
      },
    },
  });

  // Sync external value changes (e.g. revert)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div style={wrapperStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={toolbarStyle}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={toolbarButtonStyle(editor.isActive("bold"))}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={toolbarButtonStyle(editor.isActive("italic"))}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={setLink}
          style={toolbarButtonStyle(editor.isActive("link"))}
          title="Link"
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

Expected: No errors (RichTextField is not imported anywhere yet).

- [ ] **Step 3: Commit**

```bash
git add components/admin/RichTextField.tsx
git commit -m "feat(cms): add RichTextField component with Tiptap"
```

---

### Task 3: Replace Inputs with RichTextField in All Editors

**Files:**
- Modify: All 11 editors in `components/admin/editors/`

For every editor, the change is:
1. Add `import RichTextField from "@/components/admin/RichTextField";`
2. Replace every `<input style={inputStyle} value={...} onChange={...} />` and `<textarea style={textareaStyle} value={...} onChange={...} />` with `<RichTextField label="..." value={...} onChange={...} />`
3. Remove the now-unused `<label>` wrapper since RichTextField includes its own label
4. Remove unused `inputStyle`, `textareaStyle`, `labelStyle` constants if no longer needed
5. For `<select>` dropdowns (StatementEditor mockup_type), keep as-is — not a text field

**Important notes per editor:**

- **HeroEditor**: 5 fields — eyebrow, headline, subheadline, cta_primary.text, cta_primary.url, cta_secondary.text, cta_secondary.url. The CTA `url` fields should stay as plain `<input>` since URLs shouldn't have rich text. Replace the text fields with RichTextField.
- **StatementEditor**: Replace title_line1, title_line2, title_accent, body, proof_point with RichTextField. Keep mockup_type as `<select>`.
- **ServicesEditor**: Each item has title, description, tags (comma-separated), icon. Replace title and description with RichTextField. Keep tags as plain input (comma parsing). Keep icon as plain input.
- **ProcessEditor**: Replace title and description per item with RichTextField.
- **StatsEditor**: Replace label and note with RichTextField. Keep value as `type="number"` input. Keep suffix as plain input.
- **TrustEditor**: Replace header with RichTextField. Replace client name with RichTextField. Keep logo_url as plain input.
- **TestimonialsEditor**: Replace quote, name, role with RichTextField. Keep avatar_url as plain input.
- **FaqEditor**: Replace question and answer with RichTextField.
- **CtaEditor**: Replace headline, subtext, button_text with RichTextField. Keep button_url as plain input.
- **ContactEditor**: Replace heading, subtext, button_text, success_title, success_message with RichTextField.
- **MarqueeEditor**: Replace each tag input with RichTextField.

- [ ] **Step 1: Read each editor file before modifying**

Read all 11 editor files to see exact current code.

- [ ] **Step 2: Update all 11 editors**

Apply the pattern to each. The general transformation:

```tsx
// Before:
<div style={fieldStyle}>
  <label style={labelStyle}>Question</label>
  <input style={inputStyle} value={item.question} onChange={(e) => updateItem(i, { question: e.target.value })} />
</div>

// After:
<RichTextField
  label="Question"
  value={item.question}
  onChange={(html) => updateItem(i, { question: html })}
/>
```

For onChange handlers — the RichTextField passes the HTML string directly (not an event), so replace `(e) => update(key, e.target.value)` with `(html) => update(key, html)`.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/admin/editors/
git commit -m "feat(cms): replace plain inputs with RichTextField in all editors"
```

---

### Task 4: Render HTML in Public Components

**Files:**
- Modify: All public-facing components that render CMS text content

For each component, replace plain text rendering with `dangerouslySetInnerHTML`:

```tsx
// Before:
<h2>{content.headline}</h2>
<p>{content.description}</p>

// After:
<h2 dangerouslySetInnerHTML={{ __html: content.headline }} />
<p dangerouslySetInnerHTML={{ __html: content.description }} />
```

**Component-by-component changes:**

- **Hero.tsx**: subheadline text, eyebrow text, CTA button texts. The animated headline ("We Build Things That Convert") stays as-is (animation code, not CMS text).
- **Statement.tsx**: body text, proof_point text. Title parts (title_line1, title_line2, title_accent) — these are rendered as JSX from page.tsx, so update wherever they're rendered.
- **Services.tsx / ServiceCard**: service title, description
- **Process.tsx**: step title, step description
- **Stats.tsx**: stat label, stat note
- **Trust.tsx**: header text, client names
- **Testimonials.tsx**: quote, author name, role
- **FAQ.tsx**: question, answer
- **Contact.tsx**: heading, subtext, button text, success title, success message
- **Navbar.tsx**: nav link text, CTA text
- **Footer.tsx**: brand description, link texts
- **Marquee.tsx**: tag text

**Important:** Read each component file before modifying to understand exactly where each text is rendered. Some components render text inside elements with existing attributes — add `dangerouslySetInnerHTML` carefully without duplicating children.

When using `dangerouslySetInnerHTML`, the element must NOT have children:
```tsx
// WRONG:
<h2 dangerouslySetInnerHTML={{ __html: text }}>{text}</h2>

// RIGHT:
<h2 dangerouslySetInnerHTML={{ __html: text }} />
```

- [ ] **Step 1: Read all public component files**

Read each component to understand current rendering.

- [ ] **Step 2: Update all components**

Apply `dangerouslySetInnerHTML` to all CMS text fields. For short inline text (like nav link labels, tag names), use `<span dangerouslySetInnerHTML={{ __html: text }} />`.

- [ ] **Step 3: Verify build**

```bash
cd /Users/skuser/Forma && npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Verify in browser**

Start dev server and check that the public site renders correctly — bold/italic in content should display properly.

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat(cms): render rich text HTML in all public components"
```

---

## Phase 2: Undo/Revert

### Task 5: Database Migration + Type Updates

**Files:**
- Modify: `lib/types/cms.ts`
- Modify: `lib/schema.sql`

- [ ] **Step 1: Add columns via Supabase MCP**

Run this SQL via the Supabase MCP `execute_sql` tool (project_id: `prakshlmwgjdspaptkha`):

```sql
ALTER TABLE sections ADD COLUMN IF NOT EXISTS previous_content jsonb DEFAULT NULL;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS previous_value jsonb DEFAULT NULL;
```

- [ ] **Step 2: Update lib/types/cms.ts**

Add `previous_content` to the Section interface:

```ts
export interface Section<T = unknown> {
  id: string;
  page_id: string;
  type: SectionType;
  title: string;
  content: T;
  sort_order: number;
  visible: boolean;
  updated_at: string;
  previous_content: T | null;  // ADD THIS
}
```

Add `previous_value` to the SettingsRow interface:

```ts
export interface SettingsRow {
  key: string;
  value: unknown;
  updated_at: string;
  previous_value: unknown | null;  // ADD THIS
}
```

- [ ] **Step 3: Update lib/schema.sql reference**

Add after the settings table definition:

```sql
-- Added for undo/revert feature
ALTER TABLE sections ADD COLUMN IF NOT EXISTS previous_content jsonb DEFAULT NULL;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS previous_value jsonb DEFAULT NULL;
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add lib/types/cms.ts lib/schema.sql
git commit -m "feat(cms): add previous_content/previous_value columns for undo/revert"
```

---

### Task 6: Add Revert to SectionEditor

**Files:**
- Modify: `components/admin/SectionEditor.tsx`
- Modify: `app/admin/pages/[id]/sections/[sectionId]/page.tsx`

- [ ] **Step 1: Update the section editor page to pass previous_content**

Read `app/admin/pages/[id]/sections/[sectionId]/page.tsx`. The section is already fetched with `select("*")` which includes `previous_content`. No query change needed — just ensure SectionEditor receives it (it already gets the full `section` object).

- [ ] **Step 2: Update SectionEditor save handler**

Read `components/admin/SectionEditor.tsx`. Modify the `handleSave` function to:
1. First read the current content from DB
2. Then update with both new content and previous_content = old content

Replace the existing `handleSave`:

```ts
async function handleSave() {
  setSaving(true);
  setSaved(false);

  const supabase = createClient();

  // Read current content before overwriting (for revert)
  const { data: current } = await supabase
    .from("sections")
    .select("content")
    .eq("id", section.id)
    .single();

  await supabase
    .from("sections")
    .update({
      content,
      previous_content: current?.content ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", section.id);

  setSaving(false);
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
}
```

- [ ] **Step 3: Add revert handler and button**

Add state and handler:

```ts
const [previousContent, setPreviousContent] = useState(section.previous_content);

async function handleRevert() {
  if (!previousContent) return;
  if (!window.confirm("Are you sure? This will restore the last saved version.")) return;

  const supabase = createClient();
  await supabase
    .from("sections")
    .update({
      content: previousContent,
      previous_content: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", section.id);

  setContent(previousContent);
  setPreviousContent(null);
}
```

Add the Revert button in the actions bar, between Save and Cancel, only when `previousContent` is not null:

```tsx
{previousContent && (
  <button
    onClick={handleRevert}
    style={{
      padding: "10px 24px",
      backgroundColor: "transparent",
      color: "#c4a96a",
      border: "1px solid #c4a96a",
      borderRadius: 6,
      fontSize: "0.875rem",
      fontWeight: 500,
      fontFamily: "var(--font-sans)",
      cursor: "pointer",
    }}
  >
    Revert to Previous
  </button>
)}
```

Also update `handleSave` to refresh `previousContent` after saving:

```ts
// After the update succeeds:
setPreviousContent(content); // The content we just overwrote becomes the new "previous"
```

Wait — that's not right. The `previous_content` in the DB is what we just set (`current?.content`). So after save:

```ts
setPreviousContent(current?.content ?? null);
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/SectionEditor.tsx
git commit -m "feat(cms): add undo/revert support to section editor"
```

---

### Task 7: Add Revert to SettingsEditor

**Files:**
- Modify: `components/admin/SettingsEditor.tsx`

- [ ] **Step 1: Read the current SettingsEditor**

Read `components/admin/SettingsEditor.tsx` to understand the save flow.

- [ ] **Step 2: Update the save flow**

The SettingsEditor saves 4 keys in parallel. For each key, before upserting, read the current value and store it as `previous_value`.

Modify the save handler to:
1. Read all current settings first
2. Upsert each with `previous_value = oldValue`

- [ ] **Step 3: Add a Revert button**

Add a "Revert All Settings" button that:
1. Only shows when at least one setting has a non-null `previous_value`
2. On click (with confirm dialog), restores each setting: `value = previous_value, previous_value = null`
3. Updates local state to match

The SettingsEditor receives `initial: Partial<SettingsMap>`. Update the settings page (`app/admin/settings/page.tsx`) to also pass `initialPrevious` with the previous values. Or read `previous_value` from the same SettingsRow data already fetched.

Since SettingsRow already includes `previous_value` (after Task 5's type update), and the settings page fetches `select("*")`, the data is available. Pass the rows to SettingsEditor so it can track previous values.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add components/admin/SettingsEditor.tsx app/admin/settings/page.tsx
git commit -m "feat(cms): add undo/revert support to settings editor"
```

---

## Phase 3: Live Preview

### Task 8: Create PreviewWrapper for Public Site

**Files:**
- Create: `components/PreviewWrapper.tsx`

- [ ] **Step 1: Create PreviewWrapper**

Create `/Users/skuser/Forma/components/PreviewWrapper.tsx`:

```tsx
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

  // Auto-scroll to the section being edited
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
```

- [ ] **Step 2: Commit**

```bash
git add components/PreviewWrapper.tsx
git commit -m "feat(cms): add PreviewWrapper component for live preview messaging"
```

---

### Task 9: Integrate PreviewWrapper into page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Read current page.tsx fully**

Read the entire `app/page.tsx` to understand how sections are rendered.

- [ ] **Step 2: Add preview mode support**

The page needs to:
1. Detect `?preview=true` in the URL (use `searchParams`)
2. When in preview mode, wrap the content in `<PreviewWrapper>` which provides overrideable sections
3. Add `data-section-id={section.id}` attributes to each section's wrapper element for scroll-to targeting
4. When NOT in preview mode, render exactly as before (no wrapper, no overhead)

Key changes:
- Import `PreviewWrapper` from `@/components/PreviewWrapper`
- Accept `searchParams` prop (Next.js 16: `searchParams: Promise<{ preview?: string }>`)
- If `preview=true`, wrap content rendering in PreviewWrapper
- Add `data-section-id` to each section's container div

- [ ] **Step 3: Verify build**

```bash
cd /Users/skuser/Forma && npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(cms): integrate PreviewWrapper for live preview mode"
```

---

### Task 10: Create PreviewFrame and Update Section Editor

**Files:**
- Create: `components/admin/PreviewFrame.tsx`
- Modify: `components/admin/SectionEditor.tsx`
- Modify: `app/admin/pages/[id]/sections/[sectionId]/page.tsx`

- [ ] **Step 1: Create PreviewFrame component**

Create `/Users/skuser/Forma/components/admin/PreviewFrame.tsx`:

```tsx
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
```

- [ ] **Step 2: Add preview toggle and split layout to SectionEditor**

Modify `components/admin/SectionEditor.tsx`:

Add imports:
```tsx
import PreviewFrame from "@/components/admin/PreviewFrame";
```

Add state:
```tsx
const [showPreview, setShowPreview] = useState(true);
```

Wrap the return in a split layout:
```tsx
return (
  <div style={{ display: "flex", gap: 24, minHeight: "70vh" }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={wrapperStyle}>
        <EditorComponent content={content} onChange={setContent} />
        {/* actions bar (save, revert, cancel) */}
      </div>
    </div>
    {showPreview && (
      <div style={{ flex: 1, minWidth: 0, position: "sticky", top: 32, alignSelf: "flex-start", height: "calc(100vh - 64px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ color: "#9e9789", fontSize: 13 }}>Live Preview</span>
          <button
            onClick={() => setShowPreview(false)}
            style={{ background: "none", border: "none", color: "#9e9789", cursor: "pointer", fontSize: 12 }}
          >
            Hide
          </button>
        </div>
        <PreviewFrame sectionId={section.id} sectionType={section.type} content={content} />
      </div>
    )}
    {!showPreview && (
      <button
        onClick={() => setShowPreview(true)}
        style={{
          position: "fixed", right: 24, bottom: 24,
          padding: "8px 16px", borderRadius: 6,
          background: "#1c1a17", border: "1px solid #2a2825",
          color: "#9e9789", fontSize: 13, cursor: "pointer",
        }}
      >
        Show Preview
      </button>
    )}
  </div>
);
```

The postMessage is debounced inside PreviewFrame via the useEffect dependency on `content`.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd /Users/skuser/Forma && npx tsc --noEmit
```

- [ ] **Step 4: Verify in browser**

1. Navigate to `/admin/pages/{id}/sections/{sectionId}`
2. Should see split layout: editor left, iframe right
3. Typing in the editor should update the preview in real-time
4. "Hide" button collapses the preview; "Show Preview" brings it back

- [ ] **Step 5: Commit**

```bash
git add components/admin/PreviewFrame.tsx components/admin/SectionEditor.tsx
git commit -m "feat(cms): add live preview with split layout and postMessage"
```

---

## Phase 4: Verification

### Task 11: End-to-End Verification

- [ ] **Step 1: Verify build**

```bash
cd /Users/skuser/Forma && npm run build
```

Expected: Clean build, no errors.

- [ ] **Step 2: Verify rich text editing**

1. Navigate to `/admin`, login
2. Go to a section editor (e.g. Hero)
3. All fields should show Tiptap editors with B/I/Link toolbar
4. Select text, click B — text becomes bold
5. Save, reload — bold persists
6. Check public site — bold text renders correctly

- [ ] **Step 3: Verify undo/revert**

1. Edit a section, change some text, Save
2. "Revert to Previous" button should appear
3. Click it, confirm — content reverts to previous version
4. Revert button disappears (no more previous content)

- [ ] **Step 4: Verify live preview**

1. Open a section editor — should see split layout with iframe
2. Type in a field — iframe updates in real-time
3. Toggle preview off/on with Hide/Show buttons
4. Iframe scrolls to the section being edited

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(cms): complete rich text, revert, and live preview enhancements"
```
