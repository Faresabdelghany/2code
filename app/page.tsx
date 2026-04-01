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
        body="Engineered from the ground up. Scalable, secure, and shaped precisely to your business logic."
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
        mockupType="phones"
      />

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
