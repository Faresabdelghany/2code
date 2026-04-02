// components/BrowserMockup.tsx
export default function BrowserMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-browser w-full max-w-[520px] bg-ds rounded-[10px] overflow-hidden"
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.06)",
      }}
    >
      {/* Browser bar */}
      <div
        className="h-9 bg-wd flex items-center px-3.5 gap-1.5"
        style={{ borderBottom: "1px solid rgba(240,235,227,.06)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,95,87,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,189,46,.6)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "rgba(40,201,64,.6)" }} />
        <div
          className="ml-3 h-5 flex-1 max-w-[220px] rounded flex items-center px-2.5"
          style={{ background: "rgba(240,235,227,.04)", fontSize: "0.55rem", color: "var(--color-cd)" }}
        >
          2code.agency/project
        </div>
      </div>
      {/* Body */}
      <div className="p-6" style={{ minHeight: 300 }}>
        <div className="shimmer h-3.5 rounded w-[55%] mb-2" />
        <div className="shimmer h-3.5 rounded w-[35%] mb-6" style={{ background: "rgba(186,168,126,.08)" }} />
        <div
          className="w-full h-[120px] rounded-md mb-5"
          style={{ background: "linear-gradient(135deg,rgba(186,168,126,.12),rgba(196,169,106,.06))" }}
        />
        <div className="flex gap-3 mb-3">
          <div className="shimmer h-2 rounded flex-1" />
          <div className="shimmer h-2 rounded" style={{ flex: 0.6 }} />
        </div>
        <div className="flex gap-3 mb-3">
          <div className="shimmer h-2 rounded" style={{ flex: 0.3 }} />
          <div className="shimmer h-2 rounded flex-1" />
          <div className="shimmer h-2 rounded" style={{ flex: 0.6 }} />
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-[70px] rounded flex flex-col items-center justify-center gap-1.5"
              style={{
                background: "rgba(240,235,227,.03)",
                border: "1px solid rgba(240,235,227,.05)",
              }}
            >
              <div className="w-4 h-4 rounded-full" style={{ background: "rgba(186,168,126,.15)" }} />
              <div className="w-[60%] h-[5px] rounded" style={{ background: "rgba(240,235,227,.06)" }} />
            </div>
          ))}
        </div>
        <div
          className="w-[100px] h-7 rounded mt-4"
          style={{ background: "var(--color-tn)", opacity: 0.6 }}
        />
      </div>
    </div>
  );
}
