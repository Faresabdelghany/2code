"use client";

import { useEffect, useState, useCallback } from "react";
import type {
  Section,
  HeroContent,
  StatementContent,
  MarqueeContent,
  ServicesContent,
  ProcessContent,
  StatsContent,
  TrustContent,
  TestimonialsContent,
  FaqContent,
  CtaContent,
  ContactContent,
  SettingsRow,
  NavLink,
  FooterSettings,
  ContactInfo,
  SocialLink,
} from "@/lib/types/cms";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Stats from "@/components/Stats";
import Trust from "@/components/Trust";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SideDots from "@/components/SideDots";
import BackToTop from "@/components/BackToTop";
import WhatsApp from "@/components/WhatsApp";
import ScrollReveal from "@/components/ScrollReveal";

// ── Helpers (same as page.tsx) ────────────────────────────

function getSectionContent<T>(sections: Section[], type: string): T | undefined {
  return sections.find((s) => s.type === type)?.content as T | undefined;
}

function getSectionId(sections: Section[], type: string): string | undefined {
  return sections.find((s) => s.type === type)?.id;
}

function getSectionsByType<T>(sections: Section[], type: string): { content: T; id: string }[] {
  return sections.filter((s) => s.type === type).map((s) => ({ content: s.content as T, id: s.id }));
}

function getSettingValue<T>(settings: SettingsRow[], key: string): T | undefined {
  return (settings.find((s) => s.key === key)?.value as T) ?? undefined;
}

function buildStatementTitle(c: StatementContent) {
  return (
    <>
      <span dangerouslySetInnerHTML={{ __html: c.title_line1 }} />{" "}
      <em><span dangerouslySetInnerHTML={{ __html: c.title_line2 }} /></em>{" "}
      <span style={{ color: "var(--color-tn)" }} dangerouslySetInnerHTML={{ __html: c.title_accent }} />
    </>
  );
}

const defaultStatements = [
  { title: (<>Landing Pages That <em>Actually</em> <span style={{ color: "var(--color-tn)" }}>Convert</span></>), body: "", proof: "", mockupType: "browser" as const },
  { title: (<>E-Commerce Stores <em>Built to</em> <span style={{ color: "var(--color-tn)" }}>Sell</span></>), body: "", proof: "", mockupType: "cart" as const },
  { title: (<>Custom Software <em>That Scales</em> <span style={{ color: "var(--color-tn)" }}>With You</span></>), body: "", proof: "", mockupType: "dashboard" as const },
  { title: (<>Mobile Apps <em>People Actually</em> <span style={{ color: "var(--color-tn)" }}>Use</span></>), body: "", proof: "", mockupType: "phones" as const },
];

// ── Divider ───────────────────────────────────────────────

function Divider() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "1rem 0" }}>
      <span
        style={{
          width: 28,
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--color-tn), transparent)",
          opacity: 0.25,
        }}
      />
    </div>
  );
}

// ── Preview Page ──────────────────────────────────────────

interface PreviewPageProps {
  initialSections: Section[];
  settings: SettingsRow[];
}

export default function PreviewPage({ initialSections, settings }: PreviewPageProps) {
  const [sections, setSections] = useState(initialSections);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type !== "cms-preview") return;
    const { sectionId, content } = event.data;
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content } : s))
    );
    // Auto-scroll
    setTimeout(() => {
      const el = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleMessage]);

  // Extract content
  const heroContent = getSectionContent<HeroContent>(sections, "hero");
  const marqueeContent = getSectionContent<MarqueeContent>(sections, "marquee");
  const servicesContent = getSectionContent<ServicesContent>(sections, "services");
  const processContent = getSectionContent<ProcessContent>(sections, "process");
  const statsContent = getSectionContent<StatsContent>(sections, "stats");
  const trustContent = getSectionContent<TrustContent>(sections, "trust");
  const testimonialsContent = getSectionContent<TestimonialsContent>(sections, "testimonials");
  const faqContent = getSectionContent<FaqContent>(sections, "faq");
  const ctaContent = getSectionContent<CtaContent>(sections, "cta");
  const contactContent = getSectionContent<ContactContent>(sections, "contact");

  const heroId = getSectionId(sections, "hero");
  const marqueeId = getSectionId(sections, "marquee");
  const servicesId = getSectionId(sections, "services");
  const processId = getSectionId(sections, "process");
  const statsId = getSectionId(sections, "stats");
  const trustId = getSectionId(sections, "trust");
  const testimonialsId = getSectionId(sections, "testimonials");
  const faqId = getSectionId(sections, "faq");
  const ctaId = getSectionId(sections, "cta");
  const contactId = getSectionId(sections, "contact");

  const statementRecords = getSectionsByType<StatementContent>(sections, "statement");

  const navLinks = getSettingValue<NavLink[]>(settings, "navbar_links");
  const footerSettings = getSettingValue<FooterSettings>(settings, "footer");
  const contactInfo = getSettingValue<ContactInfo>(settings, "contact_info");
  const socialLinks = getSettingValue<SocialLink[]>(settings, "social_links");

  const statements = statementRecords.length >= 4
    ? statementRecords.map((rec, i) => ({
        title: buildStatementTitle(rec.content),
        body: rec.content.body,
        proof: rec.content.proof_point,
        mockupType: rec.content.mockup_type,
        dataSec: i + 1,
        id: rec.id,
      }))
    : defaultStatements.map((s, i) => ({ ...s, dataSec: i + 1, id: undefined as string | undefined }));

  const ctaHeadline = ctaContent?.headline || "Ready to build something that actually converts?";
  const ctaButtonText = ctaContent?.button_text || "Start Your Project";
  const ctaButtonUrl = ctaContent?.button_url || "#contact";

  return (
    <>
      <ScrollReveal />
      <Navbar navLinks={navLinks} ctaText={ctaContent?.button_text} />
      <main id="main-content">
        <div data-section-id={heroId}>
          <Hero content={heroContent} />
        </div>

        {statements.map((stmt, i) => (
          <div key={i} data-section-id={stmt.id}>
            <Statement
              dataSec={stmt.dataSec}
              title={stmt.title}
              body={stmt.body}
              proof={stmt.proof}
              mockupType={stmt.mockupType}
            />
            {i < statements.length - 1 && <Divider />}
          </div>
        ))}

        <div
          className="rv"
          data-section-id={ctaId}
          style={{
            padding: "6rem 2rem",
            textAlign: "center",
            background: "linear-gradient(to bottom, transparent, rgba(186,168,126,.03), transparent)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif-alt)",
              fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
              color: "var(--color-cd)",
              fontWeight: 300,
              marginBottom: "2rem",
            }}
            dangerouslySetInnerHTML={{ __html: ctaHeadline }}
          />
          <a
            href={ctaButtonUrl}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.8rem",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 400,
              padding: "1.1rem 3rem",
              background: "var(--color-cr)",
              color: "var(--color-bk)",
              transition: "background 0.4s ease",
            }}
          >
            <span dangerouslySetInnerHTML={{ __html: ctaButtonText }} />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div data-section-id={marqueeId}><Marquee content={marqueeContent} /></div>
        <div data-section-id={servicesId}><Services content={servicesContent} /></div>
        <div data-section-id={processId}><Process content={processContent} /></div>
        <div data-section-id={statsId}><Stats content={statsContent} /></div>
        <div data-section-id={trustId}><Trust content={trustContent} /></div>
        <div data-section-id={testimonialsId}><Testimonials content={testimonialsContent} /></div>
        <div data-section-id={faqId}><FAQ content={faqContent} /></div>
        <div data-section-id={contactId}><Contact content={contactContent} /></div>
      </main>
      <Footer footerSettings={footerSettings} contactInfo={contactInfo} socialLinks={socialLinks} />
      <SideDots />
      <BackToTop />
      <WhatsApp />
    </>
  );
}
