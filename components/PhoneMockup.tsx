// components/PhoneMockup.tsx

function PhoneFrame({
  style,
  children,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: 180,
        background: "var(--color-ds)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.08)",
        border: "2px solid rgba(240,235,227,.06)",
        ...style,
      }}
    >
      <div
        style={{
          width: 80,
          height: 20,
          background: "var(--color-bk)",
          borderRadius: "0 0 14px 14px",
          margin: "0 auto",
        }}
      />
      {children}
    </div>
  );
}

function PhoneScreen({ children, minHeight = 340 }: { children: React.ReactNode; minHeight?: number }) {
  return (
    <div style={{ padding: 14, minHeight, display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
    </div>
  );
}

function PhoneHeader() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(186,168,126,.2)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{ width: 16, height: 1.5, background: "rgba(240,235,227,.3)", display: "block" }} />
        ))}
      </div>
    </div>
  );
}

function PhoneCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,rgba(186,168,126,.15),rgba(186,168,126,.05))",
        borderRadius: 10,
        padding: 14,
        border: "1px solid rgba(186,168,126,.1)",
      }}
    >
      <div style={{ fontSize: "0.45rem", color: "var(--color-cd)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: "1rem", fontWeight: 700, marginBottom: 2 }}>
        {value}
      </div>
    </div>
  );
}

function PhoneListItem() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(240,235,227,.04)" }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(240,235,227,.04)", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ width: "70%", height: 6, background: "rgba(240,235,227,.1)", borderRadius: 2, display: "block" }} />
        <span style={{ width: "45%", height: 5, background: "rgba(240,235,227,.05)", borderRadius: 2, display: "block" }} />
      </div>
    </div>
  );
}

function PhoneTabs({ activeIndex = 0 }: { activeIndex?: number }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0 6px", borderTop: "1px solid rgba(240,235,227,.05)", marginTop: "auto" }}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: 20, height: 20, borderRadius: 6,
            background: i === activeIndex ? "rgba(186,168,126,.25)" : "rgba(240,235,227,.05)",
          }}
        />
      ))}
    </div>
  );
}

export default function PhoneMockup() {
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "flex-end", justifyContent: "center" }}>
      {/* Left secondary */}
      <PhoneFrame style={{ opacity: 0.7, transform: "scale(0.9)" }} >
        <PhoneScreen>
          <PhoneHeader />
          <PhoneCard label="Portfolio" value="$24,580" />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneTabs activeIndex={0} />
        </PhoneScreen>
      </PhoneFrame>

      {/* Center primary */}
      <PhoneFrame style={{ width: 200, zIndex: 2, transform: "translateY(-20px)" }}>
        <PhoneScreen minHeight={380}>
          <PhoneHeader />
          <div style={{ fontSize: "0.5rem", color: "var(--color-cd)" }}>Good morning</div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: "0.75rem", fontWeight: 700, margin: "2px 0 8px" }}>
            Dashboard
          </div>
          <PhoneCard label="Total Balance" value="$148,320" />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneListItem />
          <PhoneTabs activeIndex={0} />
        </PhoneScreen>
      </PhoneFrame>

      {/* Right secondary */}
      <PhoneFrame
        style={{ transform: "scale(0.85)", opacity: 0.7 }}
      >
        <PhoneScreen>
          <PhoneHeader />
          <PhoneCard label="Activity" value="127 Tasks" />
          <PhoneListItem />
          <PhoneTabs activeIndex={1} />
        </PhoneScreen>
      </PhoneFrame>
    </div>
  );
}
