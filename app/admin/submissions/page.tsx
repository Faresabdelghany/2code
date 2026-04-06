import { createClient } from "@/lib/supabase/server";
import SubmissionsList from "@/components/admin/SubmissionsList";
import type { Submission } from "@/lib/types/cms";

// ── Styles ───────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
};

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function SubmissionsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Submission[]>();

  const submissions = data ?? [];

  return (
    <div style={pageStyle}>
      <SubmissionsList initialSubmissions={submissions} />
    </div>
  );
}
