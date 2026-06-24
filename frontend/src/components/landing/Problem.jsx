import { useT, Reveal } from "../../shared";

export function Problem() {
  const [t] = useT();

  const icons = ["↗", "⏱", "🚑", "↓"];

  return (
    <section
      id="problem"
      style={{
        minHeight: "100svh",
        padding: "clamp(64px, 8vh, 96px) 0",
        borderTop: "1px solid var(--hairline)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 0% 15%, color-mix(in oklch, var(--red) 20%, transparent), transparent 32%),
            radial-gradient(circle at 70% 35%, color-mix(in oklch, var(--accent) 10%, transparent), transparent 42%),
            linear-gradient(180deg, color-mix(in oklch, var(--bg) 92%, var(--red)), var(--bg) 72%)
          `,
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,.16), transparent 28%, transparent 72%, rgba(0,0,0,.2))",
          pointerEvents: "none",
        }}
      />

      <div
        className="container"
        style={{ position: "relative", width: "100%" }}
      >
        <Reveal>
          <div
            style={{ maxWidth: 880, marginBottom: "clamp(32px, 5vh, 52px)" }}
          >
            <div
              className="eyebrow"
              style={{
                color: "var(--red)",
                marginBottom: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--red)",
                  boxShadow: "0 0 14px var(--red)",
                }}
              />
              {t.problem.eyebrow}
            </div>

            <h2
              className="display"
              style={{
                fontSize: "clamp(36px, 4.6vw, 68px)",
                lineHeight: 1.06,
                letterSpacing: "-0.052em",
                margin: 0,
                fontWeight: 520,
                maxWidth: 900,
              }}
            >
              1,4 milhões de chamadas por ano. Cada uma encontra o{" "}
              <span style={{ color: "var(--red)" }}>mesmo trânsito.</span>
            </h2>

            <p
              style={{
                marginTop: 22,
                fontSize: "clamp(16px, 1.2vw, 19px)",
                lineHeight: 1.55,
                color: "var(--fg-dim)",
                maxWidth: 680,
              }}
            >
              Em emergências, cada minuto perdido no trânsito reduz a margem de
              resposta. O problema não é só chegar ao destino, é chegar a
              tempo.
            </p>
          </div>
        </Reveal>

        <div
          className="sf-problem-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 20,
            alignItems: "stretch",
          }}
        >
          {t.problem.stats.map((s, i) => {
            const danger = i === 3;

            return (
              <Reveal key={i} delay={i * 70}>
                <article
                  style={{
                    height: "100%",
                    minHeight: 260,
                    padding: 28,
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--radius-lg)",
                    background:
                      "linear-gradient(180deg, color-mix(in oklch, var(--surface) 88%, transparent), color-mix(in oklch, var(--bg) 96%, var(--surface)))",
                    boxShadow:
                      "0 22px 70px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.045)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: danger
                        ? "radial-gradient(circle at 20% 0%, color-mix(in oklch, var(--red) 18%, transparent), transparent 48%)"
                        : "radial-gradient(circle at 20% 0%, color-mix(in oklch, var(--accent) 13%, transparent), transparent 48%)",
                      opacity: 0.75,
                    }}
                  />

                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        display: "grid",
                        placeItems: "center",
                        marginBottom: 24,
                        border: danger
                          ? "1px solid color-mix(in oklch, var(--red) 48%, transparent)"
                          : "1px solid color-mix(in oklch, var(--accent) 42%, transparent)",
                        background: danger
                          ? "color-mix(in oklch, var(--red) 10%, transparent)"
                          : "color-mix(in oklch, var(--accent) 10%, transparent)",
                        color: danger ? "var(--red)" : "var(--accent)",
                        fontSize: 23,
                      }}
                    >
                      {icons[i]}
                    </div>

                    <div
                      className="display"
                      style={{
                        fontSize: "clamp(42px, 4vw, 62px)",
                        lineHeight: 0.95,
                        letterSpacing: "-0.06em",
                        fontWeight: 560,
                        color: danger ? "var(--red)" : "var(--fg)",
                        marginBottom: 16,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.v}
                    </div>

                    <div
                      className="mono"
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: danger ? "var(--red)" : "var(--accent)",
                        marginBottom: 18,
                        minHeight: 28,
                      }}
                    >
                      {s.l}
                    </div>
                  </div>

                  <div style={{ position: "relative" }}>
                    <div
                      style={{
                        height: 1,
                        background: "var(--hairline)",
                        marginBottom: 18,
                      }}
                    />

                    <p
                      style={{
                        margin: 0,
                        color: "var(--fg-dim)",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {i === 0 && "Acionamentos anuais em Portugal."}
                      {i === 1 &&
                        "Tempo médio entre o pedido e o envio de ajuda."}
                      {i === 2 &&
                        "Tempo perdido no transporte até ao hospital."}
                      {i === 3 &&
                        "Redução da hipótese de sobreviver a cada 1 minuto."}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1180px) {
          .sf-problem-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 680px) {
          #problem {
            min-height: auto !important;
            padding: 84px 0 !important;
            align-items: flex-start !important;
          }

          .sf-problem-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }

          .sf-problem-grid article {
            min-height: 230px !important;
          }
        }

        @media (min-width: 1181px) and (max-height: 820px) {
          #problem {
            padding: 56px 0 !important;
          }

          #problem h2 {
            font-size: clamp(34px, 4.1vw, 58px) !important;
          }

          #problem p {
            margin-top: 18px !important;
          }

          .sf-problem-grid article {
            min-height: 230px !important;
            padding: 24px !important;
          }
        }
      `}</style>
    </section>
  );
}
