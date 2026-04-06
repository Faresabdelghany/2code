"use client";

// components/Trust.tsx
import type { TrustContent } from "@/lib/types/cms";

const defaultLogos = [
  "FinanceFlow",
  "Meridian Group",
  "NeuralDesk",
  "Harvest & Co",
  "Vaultline",
  "ONYX Digital",
];

const defaultHeader = "Trusted by 50+ companies across Egypt, UAE & Saudi Arabia";

interface TrustProps {
  content?: TrustContent;
}

export default function Trust({ content }: TrustProps) {
  const header = content?.header || defaultHeader;
  const logos = content?.clients?.length
    ? content.clients.map((c) => c.name)
    : defaultLogos;
  return (
    <div
      className="rv"
      style={{
        padding: "5rem 6rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(240,235,227,.06)",
      }}
    >
      <p
        style={{
          fontSize: "0.62rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "var(--color-cd)",
          marginBottom: "3rem",
          opacity: 0.5,
        }}
      >
        {header}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(2rem, 5vw, 5rem)",
          flexWrap: "wrap",
        }}
      >
        {logos.map((logo) => (
          <span
            key={logo}
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              fontStyle: "italic",
              fontSize: "clamp(1rem, 1.5vw, 1.3rem)",
              opacity: 0.35,
              transition: "opacity 0.4s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.5")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.35")}
          >
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}
