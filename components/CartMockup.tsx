// components/CartMockup.tsx
export default function CartMockup() {
  return (
    <div
      className="mock-tilt mock-tilt-cart w-full max-w-[340px] bg-ds rounded-[14px] overflow-hidden"
      style={{
        boxShadow:
          "0 30px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(240,235,227,.08)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 pt-5 pb-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(240,235,227,.06)" }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "var(--color-cr)",
          }}
        >
          Your Cart
        </span>
        <span
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--color-cd)",
          }}
        >
          3 items
        </span>
      </div>

      {/* Line items */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {[
          { name: "Essential Tee", price: "$49.00" },
          { name: "Leather Folio", price: "$89.00" },
          { name: "Signal Watch", price: "$249.00" },
        ].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 pb-3"
            style={{
              borderBottom:
                i < 2 ? "1px solid rgba(240,235,227,.06)" : "none",
            }}
          >
            {/* Product thumbnail */}
            <div
              className="w-10 h-10 rounded-md flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(186,168,126,.15), rgba(196,169,106,.06))",
              }}
            />
            {/* Name */}
            <div className="flex-1">
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-cr)",
                  fontWeight: 500,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: "0.55rem",
                  color: "var(--color-cd)",
                  marginTop: 2,
                }}
              >
                Qty: 1
              </div>
            </div>
            {/* Price */}
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-tn)",
                fontWeight: 600,
                fontFamily: "var(--font-serif-alt)",
              }}
            >
              {item.price}
            </div>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div
        className="px-5 pb-5 pt-2"
        style={{ borderTop: "1px solid rgba(240,235,227,.06)" }}
      >
        <div className="flex justify-between items-center mb-4">
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--color-cd)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Total
          </span>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.05rem",
              fontWeight: 700,
              color: "var(--color-tn)",
            }}
          >
            $387.00
          </span>
        </div>
        <div
          className="w-full rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-gd), var(--color-tn))",
            padding: "0.7rem",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-bk)",
          }}
        >
          Checkout
        </div>
      </div>
    </div>
  );
}
