# CMS Enhancements — Design Spec

## Overview

Three enhancements to the FORMA CMS admin panel: live preview while editing, rich text editing for all fields, and one-step undo/revert for sections and settings.

## Goals

- Let the admin see content changes in real-time before saving (live preview)
- Replace plain text inputs with a minimal rich text editor (bold, italic, links)
- Allow reverting a section or setting to its previous saved state

## Non-Goals

- Multi-version history or timeline UI
- Markdown or code block support
- Preview for settings (navbar, footer) — only section content
- Collaborative editing

---

## Feature 1: Live Preview

### Layout

The section editor page (`/admin/pages/[id]/sections/[sectionId]`) switches from full-width to a split layout:
- Left (50%): section editor form (existing)
- Right (50%): iframe showing the full public site, scrolled to the section being edited
- A toggle button to collapse/expand the preview panel

### Data Flow

1. The iframe loads the public site at `/?preview=true`
2. As the user types in any editor field, `SectionEditor` sends a `postMessage` to the iframe:
   ```json
   { "type": "cms-preview", "sectionId": "uuid", "sectionType": "hero", "content": { ... } }
   ```
3. The public `page.tsx` mounts a client-side `useEffect` listener (only active when `?preview=true` query param is present) that receives these messages and overrides the matching section's content in local React state
4. The iframe auto-scrolls to the edited section using the existing `data-sec` attributes or a `data-section-id` attribute added to each section wrapper
5. No temporary database writes — preview is entirely client-side via postMessage

### Preview Mode on Public Site

When `page.tsx` detects `?preview=true`:
- It wraps the page content in a client component (`PreviewWrapper`) that:
  - Listens for `message` events on `window`
  - Maintains a `Map<sectionId, content>` of overrides
  - Passes overridden content to section components
- All other behavior (fetching from Supabase, rendering, animations) stays the same
- The preview param is only used when embedded in the admin iframe — direct visits to `/?preview=true` just show the normal page with the listener mounted (no visual difference until postMessage arrives)

### Files

- Modify: `app/admin/pages/[id]/sections/[sectionId]/page.tsx` — split layout wrapper
- Modify: `components/admin/SectionEditor.tsx` — postMessage on content change, debounced (150ms)
- Create: `components/admin/PreviewFrame.tsx` — iframe wrapper with scroll-to-section
- Create: `components/PreviewWrapper.tsx` — client component for public site that listens for preview messages
- Modify: `app/page.tsx` — wrap content in PreviewWrapper when `?preview=true`

---

## Feature 2: Rich Text Editor

### Component

A shared `RichTextField` component wrapping Tiptap (headless, ProseMirror-based):

**Props:**
```ts
interface RichTextFieldProps {
  label: string;
  value: string;         // HTML string
  onChange: (html: string) => void;
}
```

**Toolbar:** Minimal floating toolbar that appears on focus with three buttons:
- **B** — toggle bold
- *I* — toggle italic
- Link icon — toggle link (prompt for URL)

**Styling:** The editor area matches existing admin input styles:
- Background: `#111110`
- Border: `1px solid #2a2825`
- Text: `#f0ebe3`
- Border radius: 6px
- Toolbar: small pill-style buttons above the editor, background `#1c1a17`

### Dependencies

```
@tiptap/react        — React integration
@tiptap/pm           — ProseMirror peer dependency
@tiptap/starter-kit  — Bold, Italic, History, and other basics
@tiptap/extension-link — Link support with URL editing
```

### Integration with Editors

Every editor in `components/admin/editors/` currently renders `<input style={inputStyle}>` or `<textarea style={textareaStyle}>`. All of these are replaced with `<RichTextField>`.

The content stored in Supabase JSONB stays as strings — they now contain HTML instead of plain text. Example:
```json
{ "headline": "We Build <strong>Things</strong> That Convert." }
```

### Rendering on Public Site

Components that display CMS text content use `dangerouslySetInnerHTML` to render the HTML:
```tsx
// Before:
<h2>{content.headline}</h2>

// After:
<h2 dangerouslySetInnerHTML={{ __html: content.headline }} />
```

This is safe because:
- Only one authenticated admin can write content
- Content goes through Supabase RLS
- No user-generated content is rendered this way

### Files

- Create: `components/admin/RichTextField.tsx` — shared Tiptap editor component
- Modify: `components/admin/editors/HeroEditor.tsx` — replace inputs with RichTextField
- Modify: `components/admin/editors/StatementEditor.tsx` — same
- Modify: `components/admin/editors/ServicesEditor.tsx` — same
- Modify: `components/admin/editors/ProcessEditor.tsx` — same
- Modify: `components/admin/editors/StatsEditor.tsx` — same
- Modify: `components/admin/editors/TrustEditor.tsx` — same
- Modify: `components/admin/editors/TestimonialsEditor.tsx` — same
- Modify: `components/admin/editors/FaqEditor.tsx` — same
- Modify: `components/admin/editors/CtaEditor.tsx` — same
- Modify: `components/admin/editors/ContactEditor.tsx` — same
- Modify: `components/admin/editors/MarqueeEditor.tsx` — same
- Modify: All 12 public components — render text with `dangerouslySetInnerHTML`

---

## Feature 3: Undo/Revert

### Database Changes

```sql
ALTER TABLE sections ADD COLUMN previous_content jsonb DEFAULT NULL;
ALTER TABLE settings ADD COLUMN previous_value jsonb DEFAULT NULL;
```

### Save Flow (Sections)

When the user clicks Save in a section editor:

1. Read current row: `SELECT content FROM sections WHERE id = ?`
2. Update with both: `UPDATE sections SET content = $new, previous_content = $old WHERE id = ?`
3. This is done in the `SectionEditor` component's save handler — two Supabase calls (select then update)

### Save Flow (Settings)

Same pattern in `SettingsEditor`:

1. For each setting key, read current `value`
2. Upsert with: `value = $new, previous_value = $old`

### Revert Flow

1. A "Revert" button appears in the editor toolbar (between Save and Cancel) only when `previous_content` is not null
2. Clicking Revert:
   - Sets `content = previous_content, previous_content = NULL`
   - Reloads the editor state with the restored content
3. After reverting, the Revert button disappears (previous_content is now null)
4. The revert itself does NOT create a new previous_content — it's a one-way restore

### Type Changes

```ts
// In lib/types/cms.ts
interface Section<T = unknown> {
  // ... existing fields
  previous_content: T | null;  // NEW
}

interface SettingsRow {
  // ... existing fields
  previous_value: unknown | null;  // NEW
}
```

### UI

The Revert button uses a muted style (not gold like Save) to avoid accidental clicks:
- Border: `1px solid #c4a96a`
- Background: transparent
- Color: `#c4a96a`
- Text: "Revert to Previous"
- Confirm dialog before reverting: "Are you sure? This will restore the last saved version."

### Files

- DB migration: add `previous_content` to sections, `previous_value` to settings
- Modify: `lib/types/cms.ts` — add previous_content and previous_value fields
- Modify: `components/admin/SectionEditor.tsx` — save stores old content, Revert button and handler
- Modify: `components/admin/SettingsEditor.tsx` — same pattern
- Modify: `app/admin/pages/[id]/sections/[sectionId]/page.tsx` — pass previous_content to editor
- Modify: `lib/schema.sql` — add columns to reference schema

---

## Implementation Order

1. **Rich Text Editor** — foundational, changes how content is stored/rendered
2. **Undo/Revert** — depends on content being saved (works with both plain and rich text)
3. **Live Preview** — builds on top of the editor, most complex feature

This order ensures each feature is independently testable and buildable.
