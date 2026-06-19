import { useT, Reveal } from "../../shared";
import { SectionHead } from "./SectionHead";

export function Roadmap() {
  const [t] = useT();

  return (
    <section
      id="roadmap"
      style={{
        padding: "120px 0",
        borderTop: "1px solid var(--hairline)",
      }}
    >
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={t.roadmap.eyebrow} title={t.roadmap.title} />
        </Reveal>

        <div
          className="sf-roadmap-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: 64,
            alignItems: "start",
            marginTop: 40,
          }}
        >
          {/* Timeline */}
          <div style={{ position: "relative" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 24,
                top: 24,
                bottom: 24,
                width: 1,
                background:
                  "linear-gradient(180deg, transparent, var(--accent) 10%, var(--accent) 85%, transparent)",
                zIndex: 0,
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 36,
                position: "relative",
                zIndex: 1,
              }}
            >
              {t.roadmap.steps.map((s, i) => (
                <Reveal key={i} delay={i * 70}>
                  <div
                    style={{
                      display: "flex",
                      gap: 28,
                      alignItems: "flex-start",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        border: "1px solid var(--accent)",
                        background: "var(--bg)",
                        display: "grid",
                        placeItems: "center",
                        color: "var(--accent)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: "0.08em",
                        boxShadow:
                          "0 0 24px color-mix(in oklch, var(--accent) 35%, transparent)",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {s.y}
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <h3
                        className="display"
                        style={{
                          fontSize: 24,
                          fontWeight: 500,
                          margin: 0,
                          marginBottom: 6,
                        }}
                      >
                        {s.t}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--fg-dim)",
                          lineHeight: 1.55,
                          fontSize: 15,
                        }}
                      >
                        {s.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Pilot panel */}
          <Reveal delay={100}>
            <div
              style={{
                padding: 28,
                border: "1px solid var(--accent)",
                borderRadius: "var(--radius-lg)",
                background:
                  "color-mix(in oklch, var(--accent) 6%, var(--surface))",
                position: "sticky",
                top: 96,
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  color: "var(--accent)",
                  marginBottom: 16,
                }}
              >
                {t.roadmap.panel_label}
              </div>
              <div
                className="display"
                style={{ fontSize: 26, fontWeight: 500, marginBottom: 20 }}
              >
                {t.roadmap.panel_city}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 28,
                }}
              >
                {t.roadmap.panel_pts.map((pt, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      fontSize: 13,
                      color: "var(--fg-dim)",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: i < 2 ? "var(--green)" : "var(--accent)",
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${i < 2 ? "var(--green)" : "var(--accent)"}`,
                      }}
                    />
                    {pt}
                  </div>
                ))}
              </div>
              <a
                href="mailto:smartflow@gmail.com"
                className="btn btn-primary"
                style={{ display: "block", textAlign: "center" }}
              >
                {t.roadmap.panel_cta} →
              </a>
            </div>
          </Reveal>
        </div>

        <style>{`
          @media (max-width: 860px) { .sf-roadmap-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  );
}
