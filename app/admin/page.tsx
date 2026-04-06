"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#0a0a09",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  fontFamily: "var(--font-sans)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#111110",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 12,
  padding: "40px 32px",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#c4a96a",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 8,
  textAlign: "center",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "#9e9789",
  textAlign: "center",
  marginBottom: 32,
  fontWeight: 300,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 500,
  color: "#9e9789",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  backgroundColor: "#0a0a09",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "#f0ebe3",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-sans)",
  outline: "none",
  boxSizing: "border-box",
};

const errorStyle: React.CSSProperties = {
  padding: "10px 14px",
  backgroundColor: "rgba(220,38,38,0.1)",
  border: "1px solid rgba(220,38,38,0.25)",
  borderRadius: 6,
  color: "#fca5a5",
  fontSize: "0.8125rem",
  marginBottom: 16,
};

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "12px 16px",
  backgroundColor: loading ? "#8a7a54" : "#c4a96a",
  color: "#0a0a09",
  border: "none",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: "var(--font-sans)",
  letterSpacing: "0.06em",
  cursor: loading ? "not-allowed" : "pointer",
  transition: "background-color 0.15s ease",
  marginTop: 8,
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin/pages");
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>FORMA CMS</h1>
        <p style={subtitleStyle}>Sign in to manage your site</p>

        <form onSubmit={handleSubmit} noValidate>
          {error && <div style={errorStyle} role="alert">{error}</div>}

          <div style={fieldStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={loading}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "#c4a96a";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={loading}
              onFocus={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "#c4a96a";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
          </div>

          <button type="submit" style={buttonStyle(loading)} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
