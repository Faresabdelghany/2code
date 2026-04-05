"use client";

// components/Trust.tsx
const logos = [
  "FinanceFlow",
  "Meridian Group",
  "NeuralDesk",
  "Harvest & Co",
  "Vaultline",
  "ONYX Digital",
];

export default function Trust() {
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
        Trusted by 50+ companies across Egypt, UAE &amp; Saudi Arabia
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
