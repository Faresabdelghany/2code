// components/Services.tsx
import ServiceCard from "./ServiceCard";
import type { ServicesContent } from "@/lib/types/cms";

const defaultServices = [
  {
    num: "01",
    name: "Landing Pages & Web Design",
    description:
      "High-converting landing pages and marketing sites built with React and Next.js. We handle everything from wireframes to A/B testing — every element optimized for conversion, responsive across all devices.",
    tags: ["Conversion Optimization", "Responsive Design", "A/B Testing", "React"],
  },
  {
    num: "02",
    name: "E-Commerce Solutions",
    description:
      "E-commerce stores built on Shopify, WooCommerce, or fully custom platforms. From product catalogs to checkout flows and payment gateway integration — every interaction designed to drive revenue and reduce cart abandonment.",
    tags: ["Shopify", "WooCommerce", "Payment Gateways", "Conversion"],
  },
  {
    num: "03",
    name: "Custom Software Development",
    description:
      "Custom software built to solve the problems templates can't. From internal tools to customer-facing platforms — engineered with .NET, Node.js, and cloud infrastructure on AWS and Azure for scale and security.",
    tags: ["Full-Stack", "Cloud Native", ".NET", "Node.js"],
  },
  {
    num: "04",
    name: "Mobile App Development",
    description:
      "Native and cross-platform mobile apps built with Flutter and React Native for iOS and Android. Smooth performance, beautiful interfaces, and users who actually keep your app on their home screen.",
    tags: ["iOS & Android", "Flutter", "React Native", "Cross-Platform"],
  },
];

interface ServicesProps {
  content?: ServicesContent;
}

export default function Services({ content }: ServicesProps) {
  const services = content?.items?.length
    ? content.items.map((item, i) => ({
        num: String(i + 1).padStart(2, "0"),
        name: item.title,
        description: item.description,
        tags: item.tags,
      }))
    : defaultServices;
  return (
    <section
      id="services"
      data-sec="5"
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
          Our{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Services</em>
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
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
          #services > div:last-of-type { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          #services > div:last-of-type { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          #services { padding: 4rem 1.5rem !important; }
        }
      `}</style>
    </section>
  );
}
