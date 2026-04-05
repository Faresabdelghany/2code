// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-alt",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0a0a09",
};

export const metadata: Metadata = {
  title: "2Code — Web Development Agency in Egypt | Landing Pages, E-Commerce & Custom Software",
  description:
    "2Code is a web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East. Get a free consultation today.",
  alternates: {
    canonical: "https://2code.agency",
  },
  openGraph: {
    title: "2Code — Web Development Agency in Egypt | Digital Products That Convert",
    description:
      "A web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East.",
    type: "website",
    url: "https://2code.agency",
    siteName: "2Code",
  },
  twitter: {
    card: "summary_large_image",
    title: "2Code — Web Development Agency in Egypt | Digital Products That Convert",
    description:
      "A web development agency in Egypt building landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects across the Middle East.",
  },
  other: {
    "geo.region": "EG",
    "geo.placename": "Giza, Egypt",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${cormorant.variable}`}>
      <body
        className="grain bg-bk text-cr antialiased overflow-x-hidden"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}
      >
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "2Code",
                url: "https://2code.agency",
                logo: "https://2code.agency/logo.png",
                contactPoint: {
                  "@type": "ContactPoint",
                  email: "hello@2code.agency",
                  telephone: "+201007905654",
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
                telephone: "+201007905654",
                email: "hello@2code.agency",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Giza",
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
                  "E-commerce stores built on Shopify, WooCommerce, or fully custom platforms — from product catalogs to checkout flows, optimized for revenue.",
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
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "How long does a typical project take?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "A landing page typically takes 2–4 weeks. A custom software project or mobile app ranges from 2–5 months.",
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
                  {
                    "@type": "Question",
                    name: "How much does a landing page cost in Egypt?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Landing page pricing varies based on complexity. A single high-converting landing page typically ranges from $1,500 to $5,000. We provide a detailed fixed-cost proposal after a free consultation — no hidden fees.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Do you offer UI/UX design services?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes. UI/UX design is core to everything we build. We handle wireframes, prototypes, user research, and high-fidelity design — whether it's a standalone design engagement or part of a full development project.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What industries do you serve?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We've delivered projects across fintech, e-commerce, real estate, healthcare, education, logistics, SaaS, and more. Our process adapts to any industry — we start every project with deep discovery to understand your specific market.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How much does it cost to build a mobile app in Egypt?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Mobile app costs depend on complexity, platform (iOS, Android, or both), and features. A cross-platform app typically ranges from $8,000 to $40,000. We build with Flutter and React Native to deliver native-quality experiences at a competitive cost.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
        {children}
      </body>
    </html>
  );
}
