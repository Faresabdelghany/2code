// components/Statement.tsx
import { ReactNode } from "react";
import BrowserMockup from "./BrowserMockup";
import DashboardMockup from "./DashboardMockup";
import PhoneMockup from "./PhoneMockup";
import CartMockup from "./CartMockup";

interface StatementProps {
  title: ReactNode;
  body: string;
  mockupType: "browser" | "dashboard" | "phones" | "cart";
  dataSec: number;
}

const mockupMap = {
  browser: BrowserMockup,
  dashboard: DashboardMockup,
  phones: PhoneMockup,
  cart: CartMockup,
};

export default function Statement({ title, body, mockupType, dataSec }: StatementProps) {
  const MockupComponent = mockupMap[mockupType];

  return (
    <section
      className="group"
      data-sec={dataSec}
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "6rem",
        gap: "4rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Text */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h2
          className="rv"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h2>
        <p
          className="rv rv-d2"
          style={{
            fontFamily: "var(--font-serif-alt)",
            fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
            fontWeight: 300,
            color: "var(--color-cd)",
            marginTop: "2.5rem",
            maxWidth: 480,
            lineHeight: 1.8,
          }}
        >
          {body}
        </p>
      </div>

      {/* Mockup visual */}
      <div
        className="rv rv-d3"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: 400,
        }}
      >
        <MockupComponent />
      </div>

      {/* Tilt CSS is defined in globals.css via .mock-tilt, .mock-tilt-browser, .mock-tilt-dashboard */}
    </section>
  );
}
