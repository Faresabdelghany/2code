import { createClient } from "@/lib/supabase/server";
import MediaLibrary from "@/components/admin/MediaLibrary";
import type { MediaItem } from "@/lib/types/cms";

// ── Styles ───────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function MediaPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MediaItem[]>();

  const media = data ?? [];

  return (
    <div style={pageStyle}>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
