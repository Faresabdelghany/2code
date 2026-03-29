// components/BackToTop.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollTop}
          aria-label="Back to top"
          style={{
            position: "fixed",
            bottom: "2.5rem",
            right: "3.5rem",
            zIndex: 900,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(240,235,227,.15)",
            background: "rgba(10,10,9,.7)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          whileHover={{ borderColor: "var(--color-gd)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-cd)" strokeWidth={1.5}>
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
