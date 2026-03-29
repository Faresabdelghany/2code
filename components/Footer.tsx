"use client";

// components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ padding: "5rem 6rem 2.5rem", borderTop: "1px solid rgba(240,235,227,.08)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "4rem",
          marginBottom: "5rem",
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            FORMA
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-cd)", lineHeight: 1.7, maxWidth: 280 }}>
            Digital craft agency specializing in landing pages, custom software, and mobile applications.
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Services
          </h4>
          {["Landing Pages", "Custom Software", "Mobile Apps", "UI/UX Design"].map((item) => (
            <a
              key={item}
              href="#services"
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item}
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Company
          </h4>
          {[
            { label: "About", href: "#hero" },
            { label: "Careers", href: "#contact" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "#contact" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Get in Touch */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Get in Touch
          </h4>
          {[
            { label: "hello@forma.agency", href: "mailto:hello@forma.agency" },
            { label: "+20 123 456 7890", href: "#" },
            { label: "Giza, Egypt", href: "#" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "2rem",
          borderTop: "1px solid rgba(240,235,227,.06)",
        }}
      >
        <p style={{ fontSize: "0.7rem", color: "var(--color-cd)" }}>
          &copy; 2026 FORMA. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "1.8rem" }}>
          {["LinkedIn", "Dribbble", "Instagram", "X"].map((social) => (
            <a
              key={social}
              href="#"
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-cd)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
            >
              {social}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; gap: 3rem !important; }
        }
        @media (max-width: 768px) {
          footer { padding: 3rem 2rem 2rem !important; }
          footer > div:first-child { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          footer > div:last-child { flex-direction: column !important; gap: 1.5rem !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
