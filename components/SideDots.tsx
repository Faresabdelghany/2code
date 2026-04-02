// components/SideDots.tsx
"use client";

import { useEffect, useState } from "react";

export default function SideDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-sec]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).dataset.sec ?? "0");
            setActive(idx);
          }
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(idx: number) {
    const target = document.querySelector<HTMLElement>(`[data-sec="${idx}"]`);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div
      data-sidedots=""
      style={{
        position: "fixed",
        right: "3.5rem",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {["Hero", "Web Design", "Software", "Mobile", "Services", "Process", "Stats", "Testimonials", "FAQ", "Contact"].map((label, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          aria-label={label}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            border: `1px solid ${active === i ? "var(--color-cr)" : "var(--color-cd)"}`,
            background: active === i ? "var(--color-cr)" : "transparent",
            cursor: "pointer",
            padding: 0,
            transform: active === i ? "scale(1.4)" : "scale(1)",
            transition: "all 0.4s ease",
          }}
        />
      ))}

      <style>{`
        @media (max-width: 768px) {
          [data-sidedots] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
