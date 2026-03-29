"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 210]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);

  return (
    <section id="hero" data-sec="0"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bk">

      {/* Video background */}
      <video
        autoPlay muted loop playsInline preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.22 }}
      >
        <source src="/Creative-Spark-Design-Mar-29-10-19-29.mp4" type="video/mp4" />
      </video>

      {/* Radial vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(10,10,9,0.6) 60%, rgba(10,10,9,0.95) 100%)",
        }}
      />

      {/* Scrolling / parallax wrapper */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-tn text-xs tracking-[0.25em] uppercase mb-8 font-sans"
        >
          Digital Craft Agency
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-none tracking-tight text-cr mb-6"
        >
          FORMA
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-cd text-lg md:text-xl font-sans font-light max-w-xl mx-auto leading-relaxed"
        >
          We design and build digital products that convert browsers into believers.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex items-center justify-center gap-4 flex-wrap"
        >
          <a
            href="#contact"
            className="px-8 py-3 bg-tn text-bk text-sm font-sans font-medium tracking-wide hover:bg-gd transition-colors duration-300"
          >
            Start a Project
          </a>
          <a
            href="#services"
            className="px-8 py-3 border border-cr/20 text-cr text-sm font-sans font-light tracking-wide hover:border-cr/40 transition-colors duration-300"
          >
            Our Work
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-cd text-xs tracking-[0.2em] uppercase font-sans">Scroll</span>
          <div className="w-px h-12 bg-cd/30 scroll-pulse" />
        </motion.div>
      </motion.div>
    </section>
  );
}
