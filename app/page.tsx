// app/page.tsx
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
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

import { cache } from "react";
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

// ── Data fetching helpers ───────────────────────────────

const fetchPageData = cache(async function fetchPageData() {
  try {
    const supabase = await createClient();

    // Fetch page and settings in parallel first
    const [pageRes, settingsRes] = await Promise.all([
      supabase.from("pages").select("*").eq("slug", "home").single(),
      supabase.from("settings").select("*"),
    ]);

    const page = pageRes.data;

    // Fetch sections for this page (filtered by page_id)
    let sections: Section[] = [];
    if (page?.id) {
      const sectionsRes = await supabase
        .from("sections")
        .select("*")
        .eq("page_id", page.id)
        .eq("visible", true)
        .order("sort_order", { ascending: true });
      sections = (sectionsRes.data ?? []) as Section[];
    }

    return {
      page,
      sections,
      settings: (settingsRes.data ?? []) as SettingsRow[],
    };
  } catch {
    // DB not available — fall back to defaults
    return { page: null, sections: [] as Section[], settings: [] as SettingsRow[] };
  }
});

function getSectionContent<T>(sections: Section[], type: string): T | undefined {
  const section = sections.find((s) => s.type === type);
  return section?.content as T | undefined;
}

function getSectionsByType<T>(sections: Section[], type: string): T[] {
  return sections.filter((s) => s.type === type).map((s) => s.content as T);
}

function getSettingValue<T>(settings: SettingsRow[], key: string): T | undefined {
  const row = settings.find((s) => s.key === key);
  return row?.value as T | undefined;
}

// ── Dynamic metadata (Task 19) ──────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const { page, sections, settings } = await fetchPageData();

  const title =
    page?.meta_title ||
    "2Code \u2014 Web Development Agency in Egypt | Landing Pages, E-Commerce & Custom Software";
  const description =
    page?.meta_description ||
    "2Code is a web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East. Get a free consultation today.";

  const contactInfo = getSettingValue<ContactInfo>(settings, "contact_info");
  const faqContent = getSectionContent<FaqContent>(sections, "faq");

  return {
    title,
    description,
    alternates: { canonical: "https://2code.agency" },
    openGraph: {
      title: page?.meta_title || "2Code \u2014 Web Development Agency in Egypt | Digital Products That Convert",
      description:
        page?.meta_description ||
        "A web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East.",
      type: "website",
      url: "https://2code.agency",
      siteName: "2Code",
      ...(page?.og_image ? { images: [{ url: page.og_image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page?.meta_title || "2Code \u2014 Web Development Agency in Egypt | Digital Products That Convert",
      description:
        page?.meta_description ||
        "A web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects across the Middle East.",
    },
    other: {
      "geo.region": "EG",
      "geo.placename": "Giza, Egypt",
    },
  };
}

// ── Page component ──────────────────────────────────────

function Divider() {
  return (
    <div style={{ padding: "0 6rem" }}>
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(240,235,227,.12), transparent)",
        }}
      />
    </div>
  );
}

// Build JSON-LD structured data from fetched content
function buildJsonLd(
  sections: Section[],
  settings: SettingsRow[],
) {
  const contactInfo = getSettingValue<ContactInfo>(settings, "contact_info");
  const faqContent = getSectionContent<FaqContent>(sections, "faq");

  const email = contactInfo?.email || "hello@2code.agency";
  const phone = contactInfo?.phone || "+201007905654";

  const schemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "2Code",
      url: "https://2code.agency",
      logo: "https://2code.agency/logo.png",
      contactPoint: {
        "@type": "ContactPoint",
        email,
        telephone: phone,
        contactType: "sales",
      },
      sameAs: [],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "2Code",
      url: "https://2code.agency",
      image: "https://2code.agency/logo.png",
      telephone: phone,
      email,
      address: {
        "@type": "PostalAddress",
        addressLocality: contactInfo?.location || "Giza",
        addressCountry: "EG",
      },
      description:
        "2Code is a web development agency in Egypt building high-converting landing pages, e-commerce stores, custom software and mobile apps for businesses across the Middle East.",
      priceRange: "$$",
      areaServed: [
        { "@type": "Country", name: "Egypt" },
        { "@type": "GeoCircle", name: "Middle East" },
      ],
      knowsAbout: [
        "Landing Page Design",
        "E-Commerce Development",
        "Custom Software Development",
        "Mobile App Development",
        "UI/UX Design",
        "React",
        "Next.js",
        ".NET",
        "Flutter",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Landing Page Design",
      provider: { "@type": "Organization", name: "2Code" },
      areaServed: { "@type": "Country", name: "Egypt" },
      description:
        "High-converting landing pages and marketing sites built with React and Next.js. Every element tested, every interaction optimized for conversion.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "E-Commerce Development",
      provider: { "@type": "Organization", name: "2Code" },
      areaServed: { "@type": "Country", name: "Egypt" },
      description:
        "E-commerce stores built on Shopify, WooCommerce, or fully custom platforms \u2014 from product catalogs to checkout flows, optimized for revenue.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Custom Software Development",
      provider: { "@type": "Organization", name: "2Code" },
      areaServed: { "@type": "Country", name: "Egypt" },
      description:
        "Custom software built around your business logic using .NET, Node.js, and cloud platforms like AWS and Azure. Scalable, secure, and precisely shaped to how you operate.",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Mobile App Development",
      provider: { "@type": "Organization", name: "2Code" },
      areaServed: { "@type": "Country", name: "Egypt" },
      description:
        "Native and cross-platform mobile apps built with Flutter and React Native for iOS and Android. Smooth, fast, and beautifully crafted.",
    },
  ];

  // FAQ schema — use CMS data if available, otherwise hardcoded defaults
  if (faqContent?.items?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqContent.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  } else {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long does a typical project take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A landing page typically takes 2\u20134 weeks. A custom software project or mobile app ranges from 2\u20135 months.",
          },
        },
        {
          "@type": "Question",
          name: "What's your pricing structure?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We work on a project basis with transparent pricing. After our initial consultation, you'll receive a detailed proposal with fixed costs for each phase. No hidden fees.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer ongoing support after launch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We offer flexible maintenance and support packages including bug fixes, feature updates, and performance monitoring.",
          },
        },
        {
          "@type": "Question",
          name: "What e-commerce platforms do you work with?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We work with Shopify, WooCommerce, and custom-built storefronts. We recommend the right platform for your business and budget.",
          },
        },
        {
          "@type": "Question",
          name: "What technologies do you work with?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We're technology-agnostic. Our stack includes React, Next.js, .NET, Flutter, React Native, Node.js, and cloud platforms like AWS and Azure.",
          },
        },
        {
          "@type": "Question",
          name: "Can you work with our existing team?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. We regularly integrate with in-house teams for handoffs, co-development, or workflow augmentation.",
          },
        },
      ],
    });
  }

  return schemas;
}

// Build statement title JSX from StatementContent
function buildStatementTitle(sc: StatementContent) {
  // Render title lines with accent styling
  const parts: React.ReactNode[] = [];
  if (sc.title_line1) {
    parts.push(sc.title_line1);
  }
  if (sc.title_accent) {
    if (parts.length > 0) parts.push(<br key="br1" />);
    parts.push(
      <em key="accent" style={{ fontStyle: "italic", color: "var(--color-tn)" }}>
        {sc.title_accent}
      </em>
    );
  }
  if (sc.title_line2) {
    if (parts.length > 0) parts.push(<br key="br2" />);
    parts.push(sc.title_line2);
  }
  return <>{parts}</>;
}

export default async function Home() {
  const { sections, settings } = await fetchPageData();

  // Extract section content
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

  // Statement sections — ordered by sort_order (already sorted from query)
  const statementContents = getSectionsByType<StatementContent>(sections, "statement");

  // Settings
  const navLinks = getSettingValue<NavLink[]>(settings, "navbar_links");
  const footerSettings = getSettingValue<FooterSettings>(settings, "footer");
  const contactInfo = getSettingValue<ContactInfo>(settings, "contact_info");
  const socialLinks = getSettingValue<SocialLink[]>(settings, "social_links");

  // Default statement data (when CMS has no data)
  const defaultStatements: { title: React.ReactNode; body: string; proof: string; mockupType: "browser" | "cart" | "dashboard" | "phones" }[] = [
    {
      title: (
        <>
          Landing Pages
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>That</em>
          <br />
          Convert.
        </>
      ),
      body: "We design and build landing pages in Egypt that turn visitors into leads \u2014 every element tested, every interaction optimized for conversion.",
      proof: "Up to 3x conversion lift across 15+ landing page projects",
      mockupType: "browser",
    },
    {
      title: (
        <>
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>E-Commerce</em>
          <br />
          That Sells.
        </>
      ),
      body: "We build e-commerce stores on Shopify, WooCommerce, and custom platforms \u2014 from product catalogs to checkout flows, optimized for every click.",
      proof: "40% sales increase for Harvest & Co within 3 months of launch",
      mockupType: "cart",
    },
    {
      title: (
        <>
          Custom Software
          <br />
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Development.</em>
          <br />
          Zero Compromise.
        </>
      ),
      body: "Custom software built around your business logic using .NET, Node.js, and cloud platforms like AWS and Azure \u2014 no templates, no workarounds. Scalable, secure, and precisely shaped to how you operate.",
      proof: "98% client satisfaction based on post-project surveys",
      mockupType: "dashboard",
    },
    {
      title: (
        <>
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Mobile App</em>
          <br />
          Development.
        </>
      ),
      body: "We build native and cross-platform mobile apps with Flutter and React Native \u2014 smooth, fast, and designed to keep users coming back. iOS, Android, or both.",
      proof: "Serving fintech, e-commerce, real estate, healthcare, education & more",
      mockupType: "phones",
    },
  ];

  // Build statements from CMS or defaults
  const statements = statementContents.length >= 4
    ? statementContents.map((sc, i) => ({
        title: buildStatementTitle(sc),
        body: sc.body,
        proof: sc.proof_point,
        mockupType: sc.mockup_type,
        dataSec: i + 1,
      }))
    : defaultStatements.map((s, i) => ({ ...s, dataSec: i + 1 }));

  // CTA content
  const ctaHeadline = ctaContent?.headline || "Ready to build something that actually converts?";
  const ctaButtonText = ctaContent?.button_text || "Start Your Project";
  const ctaButtonUrl = ctaContent?.button_url || "#contact";

  const jsonLd = buildJsonLd(sections, settings);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollReveal />
      <Navbar navLinks={navLinks} ctaText={ctaContent?.button_text} />
      <main id="main-content">
      <Hero content={heroContent} />

      {statements.map((stmt, i) => (
        <div key={i}>
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

      {/* Mid-page CTA */}
      <div
        className="rv"
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
        >
          {ctaHeadline}
        </p>
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
          {ctaButtonText}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <Marquee content={marqueeContent} />
      <Services content={servicesContent} />
      <Process content={processContent} />
      <Stats content={statsContent} />
      <Trust content={trustContent} />
      <Testimonials content={testimonialsContent} />
      <FAQ content={faqContent} />
      <Contact content={contactContent} />
      </main>
      <Footer
        footerSettings={footerSettings}
        contactInfo={contactInfo}
        socialLinks={socialLinks}
      />

      <SideDots />
      <BackToTop />
      <WhatsApp />
    </>
  );
}
