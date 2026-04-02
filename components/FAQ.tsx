// components/FAQ.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. A landing page typically takes 2–4 weeks. A custom software project or mobile app ranges from 2–5 months. We'll give you a clear timeline during our discovery phase.",
  },
  {
    q: "What's your pricing structure?",
    a: "We work on a project basis with transparent pricing. After a free consultation, you'll receive a detailed proposal with fixed costs for each phase — no hidden fees, no surprises. Not sure if we fit your budget? Reach out and we'll tell you straight.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Absolutely. Bug fixes within 24 hours, monthly feature updates, and uptime monitoring — so you can focus on running your business while we keep everything running smoothly.",
  },
  {
    q: "What e-commerce platforms do you work with?",
    a: "We work with Shopify, WooCommerce, and custom-built storefronts. Whether you need a turnkey solution or a fully custom checkout experience, we'll recommend the right platform for your business and budget.",
  },
  {
    q: "What technologies do you work with?",
    a: "We pick the best tool for your project — not the one we're most comfortable with. That means faster builds and better results. Our stack commonly includes React, Next.js, .NET, Flutter, React Native, Node.js, and cloud platforms like AWS and Azure.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes. We plug into your Slack, join your standups, and ship alongside your devs — no friction, no ramp-up time. Whether it's a handoff, co-development, or augmenting your workflow, we fit right in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex(openIndex === i ? null : i);
  }

  return (
    <section id="faq" data-sec="9" style={{ padding: "10rem 6rem" }}>
      <div style={{ marginBottom: "5rem", textAlign: "center" }}>
        <p
          className="rv"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            marginBottom: "0.8rem",
          }}
        >
          Common Questions
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
          }}
        >
          Frequently{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Asked</em>
        </h2>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`rv${i > 0 ? ` rv-d${i}` : ""}`}
            style={{ borderBottom: "1px solid rgba(240,235,227,.08)" }}
          >
            <button
              onClick={() => toggle(i)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.8rem 0",
                cursor: "pointer",
                gap: "2rem",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
                color: openIndex === i ? "var(--color-tn)" : "var(--color-cr)",
                fontWeight: 400,
                transition: "color 0.3s ease",
              }}
            >
              {faq.q}
              {/* Plus/minus icon */}
              <span
                style={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: 12,
                    height: 1,
                    background: "var(--color-cd)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 12,
                    background: "var(--color-cd)",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${openIndex === i ? 90 : 0}deg)`,
                    opacity: openIndex === i ? 0 : 1,
                    transition: "transform 0.4s var(--ease), opacity 0.3s ease",
                  }}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    style={{
                      padding: "0 0 1.8rem",
                      fontSize: "0.88rem",
                      color: "var(--color-cd)",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          section:has(> div > .rv) { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
