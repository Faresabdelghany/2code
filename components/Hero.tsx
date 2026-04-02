"use client";

import { motion, useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring" as const, stiffness: 200, damping: 26 };
const SPRING_DELAY_MS = 500;

type L = [string, number, number, number]; // [char, x, y, rotate]

const buildThings: L[] = [
  ["B",  24, -38,  10],
  ["u", -18, -52, -13],
  ["i",   8, -26,  17],
  ["l",  30, -42,  -7],
  ["d", -13, -58,  11],
  [" ",   0,   0,   0],
  ["T",  32, -32,  -9],
  ["h", -22, -48,  14],
  ["i",  16, -38, -16],
  ["n", -26, -24,   8],
  ["g",  12, -52, -11],
  ["s",  -8, -42,  15],
];

const that: L[] = [
  ["T", -26, -32,  11],
  ["h",  18, -48, -13],
  ["a", -14, -26,  15],
  ["t",  22, -40,  -9],
];

function ShatterLetters({ letters, trigger }: { letters: L[]; trigger: boolean }) {
  return (
    <>
      {letters.map(([ch, x, y, r], i) =>
        ch === " " ? (
          <span key={i} style={{ display: "inline-block" }}>&nbsp;</span>
        ) : (
          <motion.span
            key={i}
            animate={
              trigger
                ? {
                    x:      [0, x * 0.3,  x,  x * 0.4,  0],
                    y:      [0, y * 0.3,  y,  y * 0.4,  0],
                    rotate: [0, r * 0.4,  r,  r * 0.25, 0],
                    opacity:[1, 1,       0.35, 0.7,      1],
                  }
                : undefined
            }
            transition={{
              delay: i * 0.012,
              duration: 0.85,
              ease: [0.2, 0.9, 0.25, 1],
            }}
            style={{ display: "inline-block" }}
          >
            {ch}
          </motion.span>
        )
      )}
    </>
  );
}

function handleAnchor(href: string) {
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export default function Hero() {
  const [impacted, setImpacted] = useState(false);
  const impactedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3, once: false });

  // Motion values drive both words — lets us watch position in real time
  const weX      = useMotionValue(-340);
  const weOp     = useMotionValue(0);
  const convX    = useMotionValue(340);
  const convOp   = useMotionValue(0);

  useEffect(() => {
    if (!inView) {
      // Reset when scrolled away so it replays on return
      weX.set(-340);
      weOp.set(0);
      convX.set(340);
      convOp.set(0);
      impactedRef.current = false;
      setImpacted(false);
      return;
    }

    const timer = setTimeout(() => {
      animate(weX,   0, SPRING);
      animate(convX, 0, SPRING);
      animate(weOp,  1, { duration: 0.35 });
      animate(convOp,1, { duration: 0.35 });
    }, SPRING_DELAY_MS);

    // Fire shatter the exact frame "We" reaches within 30px of its target
    const unsub = weX.on("change", (v) => {
      if (v > -30 && !impactedRef.current) {
        impactedRef.current = true;
        setImpacted(true);
      }
    });

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, [inView, weX, weOp, convX, convOp]);

  return (
    <section ref={sectionRef} id="hero" data-sec="0" className="relative min-h-screen overflow-hidden bg-bk">

      <video
        autoPlay muted loop playsInline preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "none" }}
      >
        <source src="/Creative-Spark-Design-Mar-29-10-19-29.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,9,.5) 0%, rgba(10,10,9,.4) 50%, #0a0a09 100%)",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 2rem",
          paddingTop: "6rem",
          zIndex: 10,
        }}
      >
        {/* Eyebrow */}
        <motion.p
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1, ease, delay: inView ? 0.25 : 0 }}
          style={{
            fontSize: "0.62rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "var(--color-tn)",
            marginBottom: "2rem",
          }}
        >
          50+ Projects &nbsp;·&nbsp; 3x Avg. Conversion Lift
        </motion.p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(3rem, 8vw, 7rem)",
            lineHeight: 1.03,
            letterSpacing: "-0.01em",
            marginBottom: "1.8rem",
          }}
        >
          {/* "We" — driven by motion value, triggers shatter when it lands */}
          <motion.em
            style={{
              x: weX,
              opacity: weOp,
              fontStyle: "italic",
              color: "var(--color-tn)",
              display: "inline-block",
            }}
          >
            We
          </motion.em>
          {" "}
          <span style={{ display: "inline-block" }}>
            <ShatterLetters letters={buildThings} trigger={impacted} />
          </span>
          <br />
          <span style={{ display: "inline-block" }}>
            <ShatterLetters letters={that} trigger={impacted} />
          </span>
          {" "}
          {/* "Convert." — mirror of "We" */}
          <motion.em
            style={{
              x: convX,
              opacity: convOp,
              fontStyle: "italic",
              color: "var(--color-tn)",
              display: "inline-block",
            }}
          >
            Convert.
          </motion.em>
        </h1>

        {/* Subheadline */}
        <motion.p
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 1, ease, delay: inView ? 0.65 : 0 }}
          style={{
            fontFamily: "var(--font-serif-alt)",
            fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
            color: "var(--color-cd)",
            fontWeight: 300,
            lineHeight: 1.75,
            maxWidth: "46ch",
            marginBottom: "3rem",
          }}
        >
          Landing pages, e-commerce, custom software, and mobile apps —{" "}
          built to perform, not just impress.
        </motion.p>

        {/* CTAs */}
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 1, ease, delay: inView ? 0.85 : 0 }}
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href="#contact"
            onClick={handleAnchor("#contact")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.8rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 400,
              padding: "1.1rem 3rem",
              background: "var(--color-cr)",
              color: "var(--color-bk)",
              transition: "background 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-tn)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-cr)")}
          >
            Get a Free Consultation
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>

          <a
            href="#services"
            onClick={handleAnchor("#services")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.8rem",
              fontFamily: "var(--font-sans)",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 400,
              padding: "1.1rem 3rem",
              border: "1px solid rgba(240,235,227,.25)",
              color: "var(--color-cr)",
              transition: "border-color 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(240,235,227,.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,235,227,.25)")}
          >
            See What We Build
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, delay: inView ? 1.5 : 0 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.6rem",
          zIndex: 10,
          cursor: "pointer",
        }}
        onClick={() =>
          document.querySelector("[data-sec='1']")?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span
          style={{
            fontSize: "0.52rem",
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            opacity: 0.55,
          }}
        >
          Scroll
        </span>
        <div
          className="scroll-pulse"
          style={{
            width: 1,
            height: 44,
            background: "linear-gradient(to bottom, var(--color-tn), transparent)",
          }}
        />
      </motion.div>

      <style>{`
        @media (max-width: 480px) {
          #hero h1 { font-size: clamp(2.2rem, 10vw, 3rem) !important; }
        }
      `}</style>
    </section>
  );
}
