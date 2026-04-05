// components/Logo.tsx
interface LogoProps {
  height?: string;
}

export default function Logo({ height = "2.5rem" }: LogoProps) {
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height,
        overflow: "visible",
        userSelect: "none",
      }}
    >
      {/* Background "2" — large, centered on CODE text */}
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-serif)",
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: "4.5em",
          color: "rgba(255,255,255,.12)",
          lineHeight: 0.85,
          left: "35%",
          top: "50%",
          transform: "translate(-50%, -68%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        2
      </span>
      {/* "CODE." text */}
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-serif)",
          fontWeight: 700,
          fontSize: "1em",
          letterSpacing: "0.12em",
          color: "var(--color-cr)",
          lineHeight: 1,
          zIndex: 1,
        }}
      >
        CODE
        <span style={{ color: "var(--color-accent-red)", fontWeight: 700 }}>.</span>
      </span>
    </span>
  );
}
