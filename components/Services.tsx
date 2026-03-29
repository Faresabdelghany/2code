// components/Services.tsx
import ServiceCard from "./ServiceCard";

const services = [
  {
    num: "01",
    name: "Landing Pages<br />&amp; Web Design",
    description:
      "High-conversion landing pages and marketing sites designed to capture attention and drive action. Every element is tested, every interaction is intentional.",
    tags: ["Conversion Optimization", "Responsive Design", "A/B Testing"],
  },
  {
    num: "02",
    name: "Custom Software<br />Development",
    description:
      "Bespoke software solutions built to solve the problems templates can't. From internal tools to customer-facing platforms — engineered for scale.",
    tags: ["Full-Stack", "Cloud Native", "API Design"],
  },
  {
    num: "03",
    name: "Mobile App<br />Development",
    description:
      "Native and cross-platform mobile applications that users actually want on their home screen. Smooth, fast, and beautifully crafted.",
    tags: ["iOS & Android", "Cross-Platform", "App Store"],
  },
];

export default function Services() {
  return (
    <section
      id="services"
      data-sec="4"
      style={{ padding: "10rem 6rem" }}
    >
      <div style={{ marginBottom: "5rem" }}>
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
          What We Do
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
            lineHeight: 1.1,
          }}
        >
          Craft That{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Converts</em>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
        }}
      >
        {services.map((svc, i) => (
          <ServiceCard key={svc.num} {...svc} delay={i * 0.1} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #services { padding: 5rem 2rem !important; }
          #services > div:last-child { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #services { padding: 5rem 2rem !important; }
        }
      `}</style>
    </section>
  );
}
