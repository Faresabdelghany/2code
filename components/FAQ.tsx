// components/FAQ.tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FaqContent } from "@/lib/types/cms";

const defaultFaqs = [
  {
    q: "How long does a typical project take?",
    a: "It depends on scope. A landing page typically takes 2\u20134 weeks. A custom software project or mobile app ranges from 2\u20135 months. We'll give you a clear timeline during our discovery phase.",
  },
  {
    q: "What's your pricing structure?",
    a: "We work on a project basis with transparent pricing. After a free consultation, you'll receive a detailed proposal with fixed costs for each phase \u2014 no hidden fees, no surprises. Not sure if we fit your budget? Reach out and we'll tell you straight.",
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Absolutely. Bug fixes within 24 hours, monthly feature updates, and uptime monitoring \u2014 so you can focus on running your business while we keep everything running smoothly.",
  },
  {
    q: "What e-commerce platforms do you work with?",
    a: "We work with Shopify, WooCommerce, and custom-built storefronts. Whether you need a turnkey solution or a fully custom checkout experience, we'll recommend the right platform for your business and budget.",
  },
  {
    q: "What technologies do you work with?",
    a: "We pick the best tool for your project \u2014 not the one we're most comfortable with. That means faster builds and better results. Our stack commonly includes React, Next.js, .NET, Flutter, React Native, Node.js, and cloud platforms like AWS and Azure.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes. We plug into your Slack, join your standups, and ship alongside your devs \u2014 no friction, no ramp-up time. Whether it's a handoff, co-development, or augmenting your workflow, we fit right in.",
  },
  {
    q: "How much does a landing page cost in Egypt?",
    a: "Landing page pricing depends on complexity, content depth, and interactivity. A single high-converting landing page typically ranges from $1,500 to $5,000. We provide a detailed fixed-cost proposal after a free consultation \u2014 no hidden fees, no surprises.",
  },
  {
    q: "Do you offer UI/UX design services?",
    a: "Yes \u2014 UI/UX design is core to everything we build. We handle wireframes, user research, prototyping, and high-fidelity interface design. Whether it's a standalone design engagement or part of a full development project, we design interfaces that users love.",
  },
  {
    q: "What industries do you serve?",
    a: "We've delivered projects across fintech, e-commerce, real estate, healthcare, education, logistics, and SaaS \u2014 serving businesses in Egypt and across the Middle East. Our process starts with deep discovery to understand your specific market and users.",
  },
  {
    q: "How much does it cost to build a mobile app in Egypt?",
    a: "Mobile app costs depend on complexity, platform (iOS, Android, or both), and features. A cross-platform app built with Flutter or React Native typically ranges from $8,000 to $40,000. We'll give you a clear breakdown during our free consultation.",
  },
];

interface FaqProps {
  content?: FaqContent;
}

export default function FAQ({ content }: FaqProps) {
  const faqs = content?.items?.length
    ? content.items.map((item) => ({
        q: item.question,
        a: item.answer,
      }))
    : defaultFaqs;
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
              id={`faq-btn-${i}`}
              onClick={() => toggle(i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-panel-${i}`}
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
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
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
