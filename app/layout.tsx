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
  title: "2Code — Landing Pages, E-Commerce & Custom Software | Egypt",
  description:
    "2Code builds landing pages, e-commerce stores, custom software & mobile apps that convert. 50+ projects delivered across the Middle East. Get a free consultation.",
  alternates: {
    canonical: "https://2code.agency",
  },
  openGraph: {
    title: "2Code — We Build Digital Products That Convert",
    description:
      "Landing pages, e-commerce, custom software & mobile apps — built to perform, not just impress. 50+ projects, 3x avg. conversion lift.",
    type: "website",
    url: "https://2code.agency",
    siteName: "2Code",
  },
  twitter: {
    card: "summary_large_image",
    title: "2Code — We Build Digital Products That Convert",
    description:
      "Landing pages, e-commerce, custom software & mobile apps — built to perform. 50+ projects across the Middle East.",
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
                  telephone: "+201234567890",
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
                telephone: "+201234567890",
                email: "hello@2code.agency",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Giza",
                  addressCountry: "EG",
                },
                description:
                  "2Code builds landing pages, e-commerce stores, custom software and mobile apps that convert.",
                priceRange: "$$",
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
