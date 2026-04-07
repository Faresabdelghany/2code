"use client";

// components/Footer.tsx
import Logo from "./Logo";
import type { FooterSettings, ContactInfo, SocialLink } from "@/lib/types/cms";

const defaultBrandDescription =
  "2Code is a web development agency in Giza, Egypt \u2014 building high-converting landing pages, e-commerce stores, custom software, and mobile apps for businesses across the Middle East.";

const defaultServiceLinks = [
  { text: "Landing Pages", url: "#services" },
  { text: "E-Commerce", url: "#services" },
  { text: "Custom Software", url: "#services" },
  { text: "Mobile Apps", url: "#services" },
  { text: "UI/UX Design", url: "#services" },
];

const defaultCompanyLinks = [
  { text: "About", url: "#hero" },
  { text: "Process", url: "#process" },
  { text: "FAQ", url: "#faq" },
  { text: "Contact", url: "#contact" },
];

const defaultContactItems = [
  { label: "hello@2code.agency", href: "mailto:hello@2code.agency" },
  { label: "+20 100 790 5654", href: "https://wa.me/201007905654" },
  { label: "Giza, Egypt", href: "#" },
];

const defaultSocials = ["LinkedIn", "Dribbble", "Instagram", "X"];

interface FooterProps {
  footerSettings?: FooterSettings;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}

export default function Footer({ footerSettings, contactInfo, socialLinks }: FooterProps) {
  const brandDescription = footerSettings?.brand_description || defaultBrandDescription;

  const serviceLinks = footerSettings?.service_links?.length
    ? footerSettings.service_links
    : defaultServiceLinks;

  const companyLinks = footerSettings?.company_links?.length
    ? footerSettings.company_links
    : defaultCompanyLinks;

  const contactItems = contactInfo
    ? [
        { label: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { label: contactInfo.phone, href: contactInfo.whatsapp ? `https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}` : `tel:${contactInfo.phone}` },
        { label: contactInfo.location, href: "#" },
      ]
    : defaultContactItems;

  const socials = socialLinks?.length
    ? socialLinks.map((s) => ({ label: s.platform, href: s.url }))
    : defaultSocials.map((s) => ({ label: s, href: "#" }));
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
          <div style={{ marginBottom: "1rem" }}>
            <Logo height="3rem" />
          </div>
          <p style={{ fontSize: "0.88rem", color: "var(--color-cd)", lineHeight: 1.7, maxWidth: 280 }}>
            {brandDescription}
          </p>
        </div>

        {/* Services */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Services
          </h4>
          {serviceLinks.map((item) => (
            <a
              key={item.text}
              href={item.url}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onFocus={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onBlur={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </a>
          ))}
        </div>

        {/* Company */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Company
          </h4>
          {companyLinks.map((item) => (
            <a
              key={item.text}
              href={item.url}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onFocus={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onBlur={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              <span dangerouslySetInnerHTML={{ __html: item.text }} />
            </a>
          ))}
        </div>

        {/* Get in Touch */}
        <div>
          <h4 style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--color-cd)", marginBottom: "1.5rem" }}>
            Get in Touch
          </h4>
          {contactItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{ display: "block", fontSize: "0.88rem", color: "var(--color-cr)", marginBottom: "0.8rem", fontWeight: 300, transition: "color 0.3s ease" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onFocus={(e) => ((e.target as HTMLElement).style.color = "var(--color-tn)")}
              onBlur={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
            >
              <span dangerouslySetInnerHTML={{ __html: item.label }} />
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
          &copy; 2026 2Code. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "1.8rem" }}>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              style={{
                fontSize: "0.68rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-cd)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
              onFocus={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
              onBlur={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
            >
              {social.label}
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
          footer > div:last-of-type { flex-direction: column !important; gap: 1.5rem !important; text-align: center !important; }
        }
      `}</style>
    </footer>
  );
}
