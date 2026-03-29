// components/DashboardMockup.tsx
const barHeights = ["45%", "70%", "55%", "85%", "40%", "95%", "60%"];

export default function DashboardMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-dashboard w-full max-w-[540px] bg-ds rounded-[10px] overflow-hidden"
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
      </div>
      {/* Dash body */}
      <div className="grid md:grid-cols-[140px_1fr]" style={{ minHeight: 320 }}>
        {/* Sidebar — hidden on mobile */}
        <div
          className="hidden md:flex flex-col gap-1.5 p-4"
          style={{
            background: "rgba(240,235,227,.02)",
            borderRight: "1px solid rgba(240,235,227,.05)",
          }}
        >
          <div className="h-2 rounded w-[90%]" style={{ background: "var(--color-tn)", opacity: 0.5 }} />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div
            className="mt-2 mb-1"
            style={{ fontSize: "0.5rem", color: "var(--color-cd)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}
          >
            Analytics
          </div>
          <div className="shimmer h-2 rounded w-[80%]" />
          <div className="shimmer h-2 rounded w-[80%]" />
          <div
            className="mt-2 mb-1"
            style={{ fontSize: "0.5rem", color: "var(--color-cd)", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.4 }}
          >
            Settings
          </div>
          <div className="shimmer h-2 rounded w-[80%]" />
        </div>
        {/* Main */}
        <div className="p-4 flex flex-col gap-3.5">
          {/* Stat row */}
          <div className="flex gap-2.5">
            {[
              { val: "2,847", lbl: "Active Users" },
              { val: "94.2%", lbl: "Uptime" },
              { val: "$128k", lbl: "Revenue" },
            ].map((s) => (
              <div
                key={s.lbl}
                className="flex-1 h-14 rounded-md flex flex-col justify-between p-2.5"
                style={{ background: "rgba(240,235,227,.02)", border: "1px solid rgba(240,235,227,.05)" }}
              >
                <div
                  style={{ fontFamily: "var(--font-serif)", fontSize: "0.85rem", fontWeight: 700 }}
                >
                  {s.val}
                </div>
                <div style={{ fontSize: "0.45rem", color: "var(--color-cd)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div
            className="flex-1 rounded-md relative overflow-hidden"
            style={{
              background: "rgba(240,235,227,.02)",
              border: "1px solid rgba(240,235,227,.05)",
              minHeight: 100,
            }}
          >
            <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end gap-2" style={{ height: 80 }}>
              {barHeights.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{
                    height: h,
                    background:
                      i === 5
                        ? "linear-gradient(to top, var(--color-gd), rgba(196,169,106,.4))"
                        : "linear-gradient(to top, var(--color-tn), rgba(186,168,126,.3))",
                    opacity: i === 5 ? 0.7 : 0.5,
                  }}
                />
              ))}
            </div>
          </div>
          {/* Table rows */}
          <div className="flex gap-2">
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
            <div className="shimmer h-1.5 rounded flex-1" />
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
          </div>
          <div className="flex gap-2">
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
            <div className="shimmer h-1.5 rounded flex-1" />
            <div className="shimmer h-1.5 rounded" style={{ flex: 0.5 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
