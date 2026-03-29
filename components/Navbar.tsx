// components/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    closeMenu();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 5000,
          padding: scrolled ? "1rem 4rem" : "2rem 4rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(10,10,9,.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          transition: "padding 0.4s ease, background 0.4s ease",
        }}
      >
        <a
          href="#"
          onClick={(e) => handleAnchorClick(e, "#hero")}
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "1.35rem",
            letterSpacing: "0.06em",
          }}
        >
          FORMA
        </a>

        {/* Desktop nav */}
        <ul
          className="nav-links"
          style={{
            display: "flex",
            gap: "2.8rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                style={{
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-cd)",
                  fontWeight: 400,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--color-cr)")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--color-cd)")}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          onClick={(e) => handleAnchorClick(e, "#contact")}
          className="nav-cta-btn"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 400,
            padding: "0.7rem 2rem",
            border: "1px solid var(--color-cd)",
            color: "var(--color-cr)",
            transition: "color 0.4s ease, background 0.4s ease, border-color 0.4s ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "var(--color-cr)";
            el.style.color = "var(--color-bk)";
            el.style.borderColor = "var(--color-cr)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.color = "var(--color-cr)";
            el.style.borderColor = "var(--color-cd)";
          }}
        >
          Start a Project
        </a>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          className="hamburger-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 28,
            height: 20,
            position: "relative",
            zIndex: 5001,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(9.5px) rotate(45deg)" : "none",
              transition: "transform 0.35s var(--ease)",
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              opacity: menuOpen ? 0 : 1,
              transition: "opacity 0.35s var(--ease)",
            }}
          />
          <span
            style={{
              display: "block",
              width: "100%",
              height: 1,
              background: "var(--color-cr)",
              transformOrigin: "center",
              transform: menuOpen ? "translateY(-9.5px) rotate(-45deg)" : "none",
              transition: "transform 0.35s var(--ease)",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 4999,
              background: "var(--color-bk)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2.5rem",
            }}
          >
            {[...navLinks, { label: "Testimonials", href: "#testimonials" }].map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  fontWeight: 700,
                  fontStyle: "italic",
                  color: "var(--color-cr)",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget).style.color = "var(--color-tn)")}
                onMouseLeave={(e) => ((e.currentTarget).style.color = "var(--color-cr)")}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          nav { padding: 1.5rem 2rem !important; }
          .nav-links, .nav-cta-btn { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
