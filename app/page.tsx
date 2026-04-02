// app/page.tsx
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

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Navbar />
      <Hero />

      <Statement
        dataSec={1}
        title={
          <>
            Every Pixel
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Earns Its</em>
            <br />
            Place.
          </>
        }
        body="We craft landing pages that turn visitors into leads — built to convert, not just to impress."
        proof="3x average conversion lift across projects"
        mockupType="browser"
      />
      <Divider />

      <Statement
        dataSec={2}
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Sell More.</em>
            <br />
            Effortlessly.
          </>
        }
        body="We build online stores that do the selling for you — from product pages to checkout, optimized for every click."
        proof="40% sales increase for Harvest & Co after launch"
        mockupType="cart"
      />
      <Divider />

      <Statement
        dataSec={3}
        title={
          <>
            Custom Software.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Zero
            <br />
            Compromise.</em>
          </>
        }
        body="Built around your business logic — no templates, no workarounds. Scalable, secure, and precisely shaped to how you operate."
        proof="98% client satisfaction on custom builds"
        mockupType="dashboard"
      />
      <Divider />

      <Statement
        dataSec={4}
        title={
          <>
            <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Mobile-First.</em>
            <br />
            Always.
          </>
        }
        body="Your users live on their phones. We build native and cross-platform apps that feel effortless from the first tap."
        proof="iOS, Android & cross-platform — 12+ industries served"
        mockupType="phones"
      />

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
          Ready to build something that actually converts?
        </p>
        <a
          href="#contact"
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
          Get a Free Consultation
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <Marquee />
      <Services />
      <Process />
      <Stats />
      <Trust />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />

      <SideDots />
      <BackToTop />
      <WhatsApp />
    </>
  );
}
