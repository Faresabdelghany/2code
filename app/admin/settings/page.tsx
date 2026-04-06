import { createClient } from "@/lib/supabase/server";
import SettingsEditor from "@/components/admin/SettingsEditor";
import type { SettingsMap, SettingsRow } from "@/lib/types/cms";

// ── Styles ───────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("settings")
    .select("*")
    .returns<SettingsRow[]>();

  const rows = data ?? [];

  // Build SettingsMap and previousValues from rows
  const settings: Partial<SettingsMap> = {};
  const previousValues: Partial<SettingsMap> = {};
  for (const row of rows) {
    // Type-safe assignment for known keys
    if (row.key === "navbar_links") {
      settings.navbar_links = row.value as SettingsMap["navbar_links"];
      if (row.previous_value != null) previousValues.navbar_links = row.previous_value as SettingsMap["navbar_links"];
    } else if (row.key === "footer") {
      settings.footer = row.value as SettingsMap["footer"];
      if (row.previous_value != null) previousValues.footer = row.previous_value as SettingsMap["footer"];
    } else if (row.key === "contact_info") {
      settings.contact_info = row.value as SettingsMap["contact_info"];
      if (row.previous_value != null) previousValues.contact_info = row.previous_value as SettingsMap["contact_info"];
    } else if (row.key === "social_links") {
      settings.social_links = row.value as SettingsMap["social_links"];
      if (row.previous_value != null) previousValues.social_links = row.previous_value as SettingsMap["social_links"];
    }
  }

  return (
    <div style={pageStyle}>
      <SettingsEditor initial={settings} previousValues={previousValues} />
    </div>
  );
}
