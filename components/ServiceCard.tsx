"use client";

import { motion } from "framer-motion";

interface ServiceCardProps {
  num: string;
  name: string;
  description: string;
  tags: string[];
  delay?: number;
}

export default function ServiceCard({ num, name, description, tags, delay = 0 }: ServiceCardProps) {
  return (
    <motion.div
      className="rv"
      initial={false}
      whileHover="hovered"
      animate="idle"
      variants={{
        idle: { backgroundColor: "var(--color-ds)" },
        hovered: { backgroundColor: "var(--color-wd)" },
      }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      role="article"
      className="svc-card"
      style={{
        padding: "3.5rem 2.8rem",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Gold top bar */}
      <motion.div
        variants={{
          idle: { scaleX: 0 },
          hovered: { scaleX: 1 },
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, var(--color-gd), var(--color-tn))",
          transformOrigin: "left",
        }}
      />

      {/* Radial glow */}
      <motion.div
        variants={{
          idle: { opacity: 0 },
          hovered: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 80%, rgba(196,169,106,.06), transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Arrow */}
      <motion.div
        variants={{
          idle: { borderColor: "rgba(240,235,227,.1)", scale: 1 },
          hovered: { borderColor: "var(--color-gd)", scale: 1.1 },
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "3rem",
          right: "2.8rem",
          width: 32,
          height: 32,
          border: "1px solid rgba(240,235,227,.1)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth={1.5}>
          <motion.path
            d="M7 17L17 7M17 7H7M17 7v10"
            variants={{
              idle: { stroke: "var(--color-cd)" },
              hovered: { stroke: "var(--color-gd)" },
            }}
          />
        </svg>
      </motion.div>

      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-serif-alt)",
          fontSize: "0.8rem",
          color: "var(--color-tn)",
          letterSpacing: "0.15em",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {num}
      </div>

      {/* Name */}
      <h3
        dangerouslySetInnerHTML={{ __html: name }}
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 700,
          fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
          lineHeight: 1.25,
          marginBottom: "1.2rem",
          position: "relative",
          zIndex: 1,
        }}
      />

      {/* Description */}
      <p
        style={{
          fontSize: "0.88rem",
          color: "var(--color-cd)",
          lineHeight: 1.75,
          fontWeight: 300,
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {description}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", position: "relative", zIndex: 1 }}>
        {tags.map((tag) => (
          <motion.span
            key={tag}
            variants={{
              idle: { borderColor: "rgba(240,235,227,.1)", color: "var(--color-cd)" },
              hovered: { borderColor: "rgba(196,169,106,.35)", color: "var(--color-cr)" },
            }}
            transition={{ duration: 0.4 }}
            style={{
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.4rem 0.9rem",
              border: "1px solid rgba(240,235,227,.1)",
            }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
