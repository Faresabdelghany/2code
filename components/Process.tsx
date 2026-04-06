// components/Process.tsx
import type { ProcessContent } from "@/lib/types/cms";

const defaultSteps = [
  {
    num: "01",
    title: "Discover",
    desc: "We immerse ourselves in your world. Business goals, user needs, market landscape — every insight shapes the strategy.",
  },
  {
    num: "02",
    title: "Design",
    desc: "Wireframes to high-fidelity prototypes. We design interfaces that feel inevitable — like they couldn't exist any other way.",
  },
  {
    num: "03",
    title: "Develop",
    desc: "Clean, scalable code built for performance. Every interaction is smooth, every load is fast.",
  },
  {
    num: "04",
    title: "Deliver",
    desc: "Launch is just the beginning. We optimize, iterate, and refine based on real-world performance data.",
  },
];

interface ProcessProps {
  content?: ProcessContent;
}

export default function Process({ content }: ProcessProps) {
  const steps = content?.items?.length
    ? content.items.map((item, i) => ({
        num: String(i + 1).padStart(2, "0"),
        title: item.title,
        desc: item.description,
      }))
    : defaultSteps;
  return (
    <section id="process" data-sec="6" style={{ padding: "10rem 6rem", background: "var(--color-dk)" }}>
      <div style={{ textAlign: "center", marginBottom: "6rem" }}>
        <p
          className="rv"
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
            marginBottom: "0.8rem",
          }}
        >
          How We Work
        </p>
        <h2
          className="rv rv-d1"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 900,
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
          }}
        >
          Precision at{" "}
          <em style={{ fontStyle: "italic", color: "var(--color-tn)" }}>Every</em> Step
        </h2>
      </div>

      <div className="proc-grid">
        {steps.map((step, i) => (
          <div key={step.num} className={`proc-step rv${i > 0 ? ` rv-d${i}` : ""}`}>
            <div className="proc-num">{step.num}</div>
            <h3
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 700,
                fontSize: "1.25rem",
                marginBottom: "1rem",
              }}
            >
              {step.title}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--color-cd)", lineHeight: 1.7, fontWeight: 300 }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        .proc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        .proc-grid::before {
          content: '';
          position: absolute;
          top: 4rem;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(240,235,227,.1), transparent);
        }
        .proc-step {
          text-align: center;
          padding: 0 2rem;
          position: relative;
        }
        .proc-step::before {
          content: '';
          position: absolute;
          top: 3.65rem;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid var(--color-tn);
          background: var(--color-dk);
          z-index: 2;
          transition: background 0.4s ease;
        }
        .proc-step:hover::before { background: var(--color-tn); }
        .proc-num {
          font-family: var(--font-serif-alt);
          font-size: 3.5rem;
          font-weight: 300;
          color: var(--color-tn);
          opacity: 0.5;
          line-height: 1;
          margin-bottom: 2.5rem;
          transition: opacity 0.4s ease;
        }
        .proc-step:hover .proc-num { opacity: 0.9; }

        @media (max-width: 768px) {
          #process { padding: 5rem 2rem !important; }
          .proc-grid { grid-template-columns: 1fr 1fr; gap: 3rem; }
          .proc-grid::before, .proc-step::before { display: none; }
          .proc-step { text-align: left; padding: 0; }
        }
        @media (max-width: 480px) {
          .proc-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
