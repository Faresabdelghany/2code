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
  title: "FORMA — Digital Craft Agency",
  description:
    "FORMA is a digital craft agency building high-converting landing pages, custom software, and mobile apps.",
  openGraph: {
    title: "FORMA — Digital Craft Agency",
    description:
      "FORMA is a digital craft agency building high-converting landing pages, custom software, and mobile apps.",
    type: "website",
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
        {children}
      </body>
    </html>
  );
}
