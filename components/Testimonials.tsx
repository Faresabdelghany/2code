// components/Testimonials.tsx
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TestimonialsContent } from "@/lib/types/cms";

const defaultTestimonials = [
  {
    text: "2Code didn't just build our platform \u2014 they redefined what we thought was possible. The attention to craft is unmatched.",
    author: "Sarah Mitchell",
    role: "CEO, FinanceFlow",
  },
  {
    text: "Working with 2Code felt like having an in-house team that actually cared. Our conversion rate tripled in the first quarter after launch.",
    author: "Ahmed Karim",
    role: "Founder, Meridian Group",
  },
  {
    text: "Our online store went from a clunky checkout to a seamless experience. Sales jumped 40% in the first month after 2Code rebuilt it.",
    author: "Omar Fayed",
    role: "Founder, Harvest & Co",
  },
  {
    text: "They took a complex vision and turned it into the most intuitive app our users have ever experienced. Truly world-class work.",
    author: "Layla Hassan",
    role: "CTO, NeuralDesk",
  },
];

interface TestimonialsProps {
  content?: TestimonialsContent;
}

export default function Testimonials({ content }: TestimonialsProps) {
  const testimonials = content?.items?.length
    ? content.items.map((item) => ({
        text: item.quote,
        author: item.name,
        role: item.role,
      }))
    : defaultTestimonials;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused]);

  function goTo(i: number) {
    setCurrent(i);
  }

  return (
    <section
      id="testimonials"
      data-sec="8"
      style={{ padding: "10rem 6rem", position: "relative", overflow: "hidden" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {/* Radial bg glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,169,106,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 850, margin: "0 auto", textAlign: "center" }}>
        {/* Opening quote */}
        <div
          className="rv"
          style={{
            fontFamily: "var(--font-serif-alt)",
            fontSize: "8rem",
            color: "var(--color-tn)",
            lineHeight: 0.4,
            opacity: 0.25,
            marginBottom: "2rem",
          }}
        >
          &ldquo;
        </div>

        {/* Slides */}
        <div aria-live="polite" aria-atomic="true" style={{ position: "relative", minHeight: 220 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                style={{
                  fontFamily: "var(--font-serif-alt)",
                  fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  marginBottom: "2.5rem",
                }}
              >
                {testimonials[current].text}
              </p>
              <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {testimonials[current].author}
              </p>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "var(--color-cd)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: "0.3rem",
                }}
              >
                {testimonials[current].role}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.8rem", marginTop: "3rem" }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === current ? 40 : 28,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.4s ease",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "100%",
                  height: 2,
                  background: i === current ? "var(--color-cr)" : "var(--color-cd)",
                  opacity: i === current ? 1 : 0.3,
                  transition: "opacity 0.4s ease",
                }}
              />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #testimonials { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
