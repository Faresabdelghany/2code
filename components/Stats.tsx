// components/Stats.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  target: number;
  suffix: string;
  label: string;
  decimal?: boolean;
  note?: string;
}

const stats: Stat[] = [
  { target: 50, suffix: "+", label: "Projects Delivered" },
  { target: 3, suffix: "x", label: "Avg. Conversion Lift", decimal: true, note: "across landing page & e-commerce projects" },
  { target: 98, suffix: "%", label: "Client Satisfaction", note: "based on post-launch surveys" },
  { target: 12, suffix: "+", label: "Industries Served" },
];

function StatItem({ stat, delay }: { stat: Stat; delay: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;

        const duration = 2000;
        const start = performance.now();

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
          setValue(stat.target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.target]);

  const displayValue = stat.decimal ? value.toFixed(1) : Math.floor(value);

  return (
    <div
      ref={ref}
      className={`rv${delay > 0 ? ` rv-d${delay}` : ""}`}
      style={{
        textAlign: "center",
        padding: "3.5rem 2rem",
        background: "var(--color-ds)",
        transition: "background 0.4s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-wd)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-ds)")}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 900,
          fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
          lineHeight: 1,
          marginBottom: "0.6rem",
        }}
      >
        {displayValue}
        <span style={{ color: "var(--color-gd)" }}>{stat.suffix}</span>
      </div>
      <div
        style={{
          fontSize: "0.68rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "var(--color-cd)",
        }}
      >
        {stat.label}
      </div>
      {stat.note && (
        <div
          style={{
            fontSize: "0.58rem",
            letterSpacing: "0.1em",
            color: "var(--color-cd)",
            opacity: 0.45,
            marginTop: "0.35rem",
          }}
        >
          {stat.note}
        </div>
      )}
    </div>
  );
}

export default function Stats() {
  return (
    <div className="stats-grid" data-sec="7">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} delay={i} />
      ))}
    </div>
  );
}
