// components/Marquee.tsx
import type { MarqueeContent } from "@/lib/types/cms";

const defaultItems = [
  { text: "Landing Pages", italic: false },
  { text: "Web Apps", italic: true },
  { text: "Mobile Apps", italic: false },
  { text: "Custom Software", italic: true },
  { text: "UI/UX Design", italic: false },
  { text: "Brand Identity", italic: true },
];

interface MarqueeProps {
  content?: MarqueeContent;
}

export default function Marquee({ content }: MarqueeProps) {
  const items = content?.tags?.length
    ? content.tags.map((tag, i) => ({ text: tag, italic: i % 2 === 1 }))
    : defaultItems;

  const doubled = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      style={{
        padding: "3.5rem 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(240,235,227,.06)",
        borderBottom: "1px solid rgba(240,235,227,.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          animation: "marq 35s linear infinite",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: item.italic ? "1px var(--color-tn)" : "1px var(--color-cd)",
              padding: "0 2.5rem",
              flexShrink: 0,
              opacity: 0.35,
              fontStyle: item.italic ? "italic" : "normal",
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
