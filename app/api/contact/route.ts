import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return []; },
        setAll() {},
      },
    }
  );

  const { error } = await supabase.from("submissions").insert({ name, email, message });

  if (error) {
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }

  // Send email notification (best-effort)
  if (process.env.RESEND_API_KEY) {
    try {
      // Fetch admin email from settings
      const { data: settingsRow } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "contact_info")
        .single();

      const adminEmail = (settingsRow?.value as { email?: string })?.email;

      if (adminEmail) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const timestamp = new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        });

        await resend.emails.send({
          from: "FORMA CMS <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New submission from ${name}`,
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="font-size: 18px; margin: 0 0 16px;">New Contact Submission</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 80px;">Name</td>
                  <td style="padding: 8px 0;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Time</td>
                  <td style="padding: 8px 0;">${timestamp}</td>
                </tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${message}</div>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Email notification failed:", emailErr);
    }
  }

  return NextResponse.json({ success: true });
}
