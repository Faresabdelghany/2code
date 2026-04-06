"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  SettingsMap,
  NavLink,
  SocialLink,
  FooterSettings,
  ContactInfo,
} from "@/lib/types/cms";

// ── Default values ────────────────────────────────────────────────────────────

const defaultFooter: FooterSettings = {
  brand_description: "",
  service_links: [],
  company_links: [],
};

const defaultContact: ContactInfo = {
  email: "",
  phone: "",
  location: "",
  whatsapp: "",
};

// ── Styles ───────────────────────────────────────────────────────────────────

const wrapperStyle: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  padding: "40px 48px",
  color: "#f0ebe3",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#f0ebe3",
  margin: "0 0 32px",
};

const sectionsStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
  maxWidth: 760,
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#111110",
  border: "1px solid #2a2825",
  borderRadius: 10,
  padding: "24px 28px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#f0ebe3",
  marginBottom: 20,
  paddingBottom: 12,
  borderBottom: "1px solid #2a2825",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  marginBottom: 5,
  display: "block",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 12px",
  backgroundColor: "#161514",
  border: "1px solid #2a2825",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.875rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  minHeight: 80,
};

const pairRowStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr auto",
  gap: 8,
  alignItems: "center",
  marginBottom: 8,
};

const addButtonStyle: React.CSSProperties = {
  marginTop: 8,
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

const removeButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  backgroundColor: "rgba(248,113,113,0.08)",
  border: "1px solid rgba(248,113,113,0.2)",
  borderRadius: 6,
  color: "#f87171",
  fontSize: "0.75rem",
  fontFamily: "var(--font-sans)",
  cursor: "pointer",
  flexShrink: 0,
};

const contactGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px 20px",
};

const fieldBlockStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 5,
};

const bottomBarStyle: React.CSSProperties = {
  marginTop: 32,
  display: "flex",
  alignItems: "center",
  gap: 16,
  maxWidth: 760,
};

function saveButtonStyle(saving: boolean): React.CSSProperties {
  return {
    padding: "11px 28px",
    backgroundColor: saving ? "#8a7a54" : "#c4a96a",
    color: "#0a0a09",
    border: "none",
    borderRadius: 6,
    fontSize: "0.9375rem",
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
    cursor: saving ? "not-allowed" : "pointer",
    transition: "background-color 0.15s ease",
  };
}

const savedMessageStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#4ade80",
  fontFamily: "var(--font-sans)",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface SettingsEditorProps {
  initial: Partial<SettingsMap>;
  previousValues?: Partial<SettingsMap>;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SettingsEditor({ initial, previousValues }: SettingsEditorProps) {
  const [navLinks, setNavLinks] = useState<NavLink[]>(
    initial.navbar_links ?? []
  );
  const [contact, setContact] = useState<ContactInfo>(
    initial.contact_info ?? defaultContact
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    initial.social_links ?? []
  );
  const [footer, setFooter] = useState<FooterSettings>(
    initial.footer ?? defaultFooter
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prevValues, setPrevValues] = useState<Partial<SettingsMap> | null>(
    previousValues && Object.keys(previousValues).length > 0 ? previousValues : null
  );

  const supabase = createClient();

  // ── Nav Links ────────────────────────────────────────────────────────────────

  function updateNavLink(index: number, field: keyof NavLink, value: string) {
    setNavLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function addNavLink() {
    setNavLinks((prev) => [...prev, { text: "", url: "" }]);
  }

  function removeNavLink(index: number) {
    setNavLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Social Links ─────────────────────────────────────────────────────────────

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    setSocialLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }

  function addSocialLink() {
    setSocialLinks((prev) => [...prev, { platform: "", url: "" }]);
  }

  function removeSocialLink(index: number) {
    setSocialLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Contact ──────────────────────────────────────────────────────────────────

  function updateContact(field: keyof ContactInfo, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  // ── Save ─────────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      // Read current values before overwriting (for revert)
      const { data: currentRows } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", ["navbar_links", "contact_info", "social_links", "footer"]);

      const currentMap: Partial<SettingsMap> = {};
      for (const row of currentRows ?? []) {
        if (row.key === "navbar_links") currentMap.navbar_links = row.value as SettingsMap["navbar_links"];
        else if (row.key === "contact_info") currentMap.contact_info = row.value as SettingsMap["contact_info"];
        else if (row.key === "social_links") currentMap.social_links = row.value as SettingsMap["social_links"];
        else if (row.key === "footer") currentMap.footer = row.value as SettingsMap["footer"];
      }

      await Promise.all([
        supabase.from("settings").upsert({ key: "navbar_links", value: navLinks, previous_value: currentMap.navbar_links ?? null }),
        supabase.from("settings").upsert({ key: "contact_info", value: contact, previous_value: currentMap.contact_info ?? null }),
        supabase.from("settings").upsert({ key: "social_links", value: socialLinks, previous_value: currentMap.social_links ?? null }),
        supabase.from("settings").upsert({ key: "footer", value: footer, previous_value: currentMap.footer ?? null }),
      ]);

      setPrevValues(Object.keys(currentMap).length > 0 ? currentMap : null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Settings save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleRevertAll() {
    if (!prevValues) return;
    if (!window.confirm("Are you sure? This will restore all settings to the last saved version.")) return;

    try {
      await Promise.all([
        supabase.from("settings").upsert({ key: "navbar_links", value: prevValues.navbar_links ?? navLinks, previous_value: null }),
        supabase.from("settings").upsert({ key: "contact_info", value: prevValues.contact_info ?? contact, previous_value: null }),
        supabase.from("settings").upsert({ key: "social_links", value: prevValues.social_links ?? socialLinks, previous_value: null }),
        supabase.from("settings").upsert({ key: "footer", value: prevValues.footer ?? footer, previous_value: null }),
      ]);

      if (prevValues.navbar_links) setNavLinks(prevValues.navbar_links);
      if (prevValues.contact_info) setContact(prevValues.contact_info);
      if (prevValues.social_links) setSocialLinks(prevValues.social_links);
      if (prevValues.footer) setFooter(prevValues.footer);
      setPrevValues(null);
    } catch (err) {
      console.error("Settings revert failed:", err);
    }
  }

  return (
    <div style={wrapperStyle}>
      <h1 style={headingStyle}>Settings</h1>

      <div style={sectionsStyle}>
        {/* ── 1. Navbar Links ───────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Navbar Links</div>

          {navLinks.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ ...pairRowStyle, marginBottom: 6 }}>
                <span style={labelStyle}>Label</span>
                <span style={labelStyle}>URL</span>
                <span />
              </div>
              {navLinks.map((link, i) => (
                <div key={i} style={pairRowStyle}>
                  <input
                    type="text"
                    value={link.text}
                    onChange={(e) => updateNavLink(i, "text", e.target.value)}
                    placeholder="Label"
                    style={inputStyle}
                    aria-label={`Nav link ${i + 1} label`}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateNavLink(i, "url", e.target.value)}
                    placeholder="/path"
                    style={inputStyle}
                    aria-label={`Nav link ${i + 1} URL`}
                  />
                  <button
                    style={removeButtonStyle}
                    onClick={() => removeNavLink(i)}
                    aria-label="Remove nav link"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button style={addButtonStyle} onClick={addNavLink}>
            + Add Link
          </button>
        </div>

        {/* ── 2. Contact Info ───────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Contact Info</div>
          <div style={contactGridStyle}>
            {(["email", "phone", "location", "whatsapp"] as const).map((field) => (
              <div key={field} style={fieldBlockStyle}>
                <label style={labelStyle}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="text"
                  value={contact[field]}
                  onChange={(e) => updateContact(field, e.target.value)}
                  placeholder={
                    field === "email"
                      ? "hello@example.com"
                      : field === "phone"
                      ? "+1 234 567 890"
                      : field === "whatsapp"
                      ? "+1 234 567 890"
                      : "City, Country"
                  }
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Social Links ───────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Social Links</div>

          {socialLinks.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ ...pairRowStyle, marginBottom: 6 }}>
                <span style={labelStyle}>Platform</span>
                <span style={labelStyle}>URL</span>
                <span />
              </div>
              {socialLinks.map((link, i) => (
                <div key={i} style={pairRowStyle}>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                    placeholder="e.g. instagram"
                    style={inputStyle}
                    aria-label={`Social link ${i + 1} platform`}
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                    placeholder="https://…"
                    style={inputStyle}
                    aria-label={`Social link ${i + 1} URL`}
                  />
                  <button
                    style={removeButtonStyle}
                    onClick={() => removeSocialLink(i)}
                    aria-label="Remove social link"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button style={addButtonStyle} onClick={addSocialLink}>
            + Add Link
          </button>
        </div>

        {/* ── 4. Footer ─────────────────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={cardTitleStyle}>Footer</div>
          <label style={labelStyle}>Brand Description</label>
          <textarea
            value={footer.brand_description}
            onChange={(e) =>
              setFooter((prev) => ({ ...prev, brand_description: e.target.value }))
            }
            placeholder="Short description of your agency…"
            style={textareaStyle}
            rows={3}
          />
        </div>
      </div>

      {/* Save button */}
      <div style={bottomBarStyle}>
        <button style={saveButtonStyle(saving)} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save All Settings"}
        </button>

        {prevValues && (
          <button
            onClick={handleRevertAll}
            style={{
              padding: "11px 28px",
              backgroundColor: "transparent",
              color: "#c4a96a",
              border: "1px solid #c4a96a",
              borderRadius: 6,
              fontSize: "0.9375rem",
              fontWeight: 500,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
            }}
          >
            Revert All Settings
          </button>
        )}

        {saved && <span style={savedMessageStyle}>Saved!</span>}
      </div>
    </div>
  );
}
