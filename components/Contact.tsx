// components/Contact.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ContactContent } from "@/lib/types/cms";

interface ContactProps {
  content?: ContactContent;
}

export default function Contact({ content }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", projectType: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; submit?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: { name?: string; email?: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Please enter a valid email";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: [form.projectType, form.message].filter(Boolean).join("\n\n"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors({ submit: data.error || "Failed to submit. Please try again." });
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Network error. Please try again." });
      setSubmitting(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(240,235,227,.15)",
    padding: "0.8rem 0",
    fontFamily: "var(--font-sans)",
    fontSize: "0.95rem",
    color: "var(--color-cr)",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.68rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--color-cd)",
    marginBottom: "0.6rem",
  };

  return (
    <section
      id="contact"
      data-sec="10"
      style={{ padding: "10rem 6rem", position: "relative", overflow: "hidden" }}
    >
      {/* Bg glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,106,.04), transparent 65%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      <div
        id="contact-inner"
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* CTA Left */}
        <div>
          <p
            className="rv"
            style={{
              fontSize: "0.68rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--color-cd)",
              marginBottom: "1.5rem",
            }}
          >
            Ready?
          </p>
          <h2
            className="rv rv-d1"
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.05,
              marginBottom: "1.5rem",
            }}
          >
            {content?.heading || <>Got a Project?<br /><em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Let&apos;s Talk.</em></>}
          </h2>
          <p
            className="rv rv-d2"
            style={{
              fontFamily: "var(--font-serif-alt)",
              fontSize: "1.1rem",
              color: "var(--color-cd)",
              fontWeight: 300,
              lineHeight: 1.7,
              maxWidth: 400,
            }}
          >
            {content?.subtext || "Tell us about your project and we'll get back to you within 24 hours."}
          </p>
        </div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rv rv-d2"
              style={{ display: "flex", flexDirection: "column", gap: "1.8rem", paddingTop: "1rem" }}
            >
              <div>
                <label htmlFor="contact-name" style={labelStyle}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((err) => ({ ...err, name: undefined })); }}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                  <p id="name-error" role="alert" style={{ color: "var(--color-accent-red, #e05246)", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" style={labelStyle}>Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((err) => ({ ...err, email: undefined })); }}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" role="alert" style={{ color: "var(--color-accent-red, #e05246)", fontSize: "0.75rem", marginTop: "0.4rem" }}>
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-project" style={labelStyle}>Project Type</label>
                <input
                  id="contact-project"
                  type="text"
                  placeholder="Landing page, app, software…"
                  value={form.projectType}
                  onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <div>
                <label htmlFor="contact-message" style={labelStyle}>Tell Us More</label>
                <textarea
                  id="contact-message"
                  rows={4}
                  placeholder="Describe your project…"
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  style={{ ...inputStyle, resize: "none", minHeight: 100 }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gd)")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "rgba(240,235,227,.15)")}
                />
              </div>
              <button
                type="submit"
                style={{
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  padding: "1.1rem 3rem",
                  border: "1px solid var(--color-cr)",
                  color: "var(--color-cr)",
                  background: "transparent",
                  cursor: "pointer",
                  fontWeight: 400,
                  marginTop: "0.5rem",
                  transition: "color 0.4s ease, background 0.4s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "var(--color-cr)";
                  el.style.color = "var(--color-bk)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "transparent";
                  el.style.color = "var(--color-cr)";
                }}
              >
                {submitting ? "Sending..." : (content?.button_text || "Send My Brief")}
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              {errors.submit && (
                <p role="alert" style={{ color: "var(--color-accent-red, #e05246)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  {errors.submit}
                </p>
              )}
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-cd)",
                  fontWeight: 300,
                  marginTop: "1rem",
                  opacity: 0.7,
                }}
              >
                No commitment required. We&apos;ll reach out with a free consultation.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "3rem",
                minHeight: 300,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  border: "2px solid var(--color-gd)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-gd)" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  marginBottom: "0.8rem",
                }}
              >
                {content?.success_title || "Message Sent"}
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--color-cd)", lineHeight: 1.6 }}>
                {content?.success_message || "Thank you. We'll get back to you within 24 hours."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #contact-inner { grid-template-columns: 1fr !important; gap: 4rem !important; }
        }
        @media (max-width: 768px) {
          #contact { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
