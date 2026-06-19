import { useT, Reveal } from "../shared";

export function Compare() {
  const [t] = useT();

  return (
    <section
      id="compare"
      style={{
        padding: "clamp(88px, 12vh, 140px) 0",
        borderTop: "1px solid var(--hairline)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,

          opacity: 0.8,
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              {t.compare.eyebrow}
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(22px, 2.8vw, 38px)",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {t.compare.title}
            </h2>
          </div>
        </Reveal>

        <div
          className="sf-compare-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            maxWidth: 1040,
            margin: "0 auto",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            background: "var(--surface)",
            boxShadow:
              "0 30px 90px rgba(0,0,0,.26), inset 0 1px 0 rgba(255,255,255,.04)",
          }}
        >
          <Reveal delay={120}>
            <CompareSide
              name={t.compare.b_name}
              pts={t.compare.b_pts}
              highlight
            />
          </Reveal>

          <Reveal>
            <CompareSide name={t.compare.a_name} pts={t.compare.a_pts} dim />
          </Reveal>
        </div>

        <style>{`
          @media (max-width: 760px) {
            .sf-compare-grid { grid-template-columns: 1fr !important; }
            .sf-compare-grid > *:last-child > div {
              border-right: 0 !important;
              border-top: 1px solid var(--hairline) !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

export function CompareSide({ name, pts, dim, highlight }) {
  return (
    <div
      style={{
        padding: 40,
        background: highlight
          ? "color-mix(in oklch, var(--accent) 8%, var(--surface))"
          : "var(--surface)",
        borderRight: "1px solid var(--hairline)",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        className="display"
        style={{
          fontSize: 28,
          fontWeight: 500,
          marginBottom: 4,
          color: highlight ? "var(--accent)" : "var(--fg)",
        }}
      >
        {name}
      </div>
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--fg-muted)",
          marginBottom: 28,
        }}
      >
        {highlight ? "RECOMMENDED" : "ALTERNATIVE"}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {pts.map((p, i) => (
          <li
            key={i}
            style={{ display: "flex", gap: 14, alignItems: "flex-start" }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                marginTop: 2,
                background: highlight
                  ? "var(--accent)"
                  : "color-mix(in oklch, #e53e3e 15%, transparent)",
                border: highlight ? "0" : "1px solid #e53e3e",
                color: highlight ? "#fff" : "#e53e3e",
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1,
                paddingBottom: 1,
              }}
            >
              {highlight ? "✓" : "−"}
            </span>
            <div>
              <div
                style={{
                  fontWeight: 500,
                  fontSize: 14,
                  marginBottom: 3,
                  color: dim ? "var(--fg-dim)" : "var(--fg)",
                }}
              >
                {p.t}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--fg-muted)",
                  lineHeight: 1.5,
                }}
              >
                {p.d}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
