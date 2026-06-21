import { Link } from "react-router-dom";
import { useT, Reveal } from "../../shared";

export function SOSFeature() {
  const [t] = useT();
  const colors = ["var(--red)", "var(--amber)", "var(--cyan)", "var(--green)"];

  return (
    <section
      id="sos"
      style={{
        padding: "120px 0",
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
          background: `
            radial-gradient(circle at 10% 50%, color-mix(in oklch, var(--red) 14%, transparent), transparent 38%),
            radial-gradient(circle at 90% 50%, color-mix(in oklch, var(--accent) 10%, transparent), transparent 38%)
          `,
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        <Reveal>
          <div style={{ marginBottom: 10 }}>
            <span className="tag urgent">
              <span className="dot" />
              {t.sos.eyebrow}
            </span>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div style={{ marginBottom: 56, maxWidth: 900 }}>
            <h2
              className="display"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                margin: "20px 0 0",
                fontWeight: 500,
              }}
            >
              {t.sos.title}
            </h2>
            <p
              style={{
                marginTop: 20,
                fontSize: 18,
                lineHeight: 1.55,
                color: "var(--fg-dim)",
                maxWidth: 720,
              }}
            >
              {t.sos.sub}
            </p>
          </div>
        </Reveal>

        <div
          className="sf-sos-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {t.sos.flow.map((f, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                style={{
                  padding: 28,
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-lg)",
                  background:
                    i === 3
                      ? "color-mix(in oklch, var(--accent) 6%, var(--surface))"
                      : "var(--surface)",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      i === 0
                        ? "radial-gradient(circle at 0% 0%, color-mix(in oklch, var(--red) 18%, transparent), transparent 52%)"
                        : i === 3
                          ? "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--accent) 16%, transparent), transparent 52%)"
                          : "none",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative" }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: colors[i],
                      marginBottom: 14,
                    }}
                  >
                    {f.step}
                  </div>

                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                      border: `1px solid color-mix(in oklch, ${colors[i]} 35%, transparent)`,
                      background: `color-mix(in oklch, ${colors[i]} 10%, transparent)`,
                      marginBottom: 18,
                    }}
                  >
                    {f.icon}
                  </div>

                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      color: colors[i],
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {f.label}
                  </div>

                  <h3
                    className="display"
                    style={{
                      fontSize: 19,
                      fontWeight: 500,
                      margin: 0,
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    {f.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: "var(--fg-dim)",
                      lineHeight: 1.55,
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div style={{ marginTop: 48, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Link to="/client/register" className="btn btn-primary">
              Registar no SOS →
            </Link>
            <Link
              to="/client/login"
              style={{ fontSize: 13, color: "var(--fg-dim)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
            >
              Já tens conta?{" "}
              <span style={{ color: "var(--accent)", fontWeight: 500 }}>Entrar</span>
            </Link>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .sf-sos-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .sf-sos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
