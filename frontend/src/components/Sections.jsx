import { useRef, useState, useEffect } from "react";
import { useT, Reveal, useScrollProgress, clamp } from "../shared";
import { SF_I18N } from "../i18n";
import { Logomark } from "./Logomark";

export function SectionHead({ eyebrow, title, sub, align = "left" }) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 56,
        maxWidth: align === "center" ? 820 : 900,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 16 }}>
        {eyebrow}
      </div>
      <h2
        className="display"
        style={{
          fontSize: "clamp(36px, 5vw, 64px)",
          margin: 0,
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            marginTop: 20,
            fontSize: 18,
            lineHeight: 1.55,
            color: "var(--fg-dim)",
            maxWidth: 720,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

export function Intro() {
  const [t] = useT();
  return (
    <section style={{ padding: "clamp(72px, 9vh, 110px) 0" }}>
      <div className="container">
        <Reveal>
          <div
            className="eyebrow"
            style={{
              color: "var(--red)",
              marginBottom: 20,
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
                boxShadow: "0 0 12px var(--red)",
              }}
            />
            {t.intro.eyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="display"
            style={{
              fontSize: "clamp(40px, 6.4vw, 88px)",
              lineHeight: 1.05,
              fontWeight: 500,
              margin: 0,
              maxWidth: 1100,
            }}
          >
            {t.intro.headline}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            style={{
              marginTop: 36,
              fontSize: 19,
              lineHeight: 1.6,
              color: "var(--fg-dim)",
              maxWidth: 760,
            }}
          >
            {t.intro.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

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
              resposta. O problema não é só chegar ao destino — é chegar a
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
                        "Redução da hipótese de sobreviver a cada 3 minutos."}
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

export function Solution() {
  const [t] = useT();
  return (
    <section
      id="solution"
      style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={t.solution.eyebrow} title={t.solution.title} />
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
          className="sf-solution-grid"
        >
          <Reveal>
            <SystemDiagram />
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {t.solution.points.map((p, i) => (
              <Reveal key={i} delay={i * 90}>
                <div style={{ display: "flex", gap: 20 }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid var(--hairline)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: "var(--accent)",
                      background:
                        "color-mix(in oklch, var(--accent) 8%, transparent)",
                    }}
                  >
                    0{i + 1}
                  </div>
                  <div>
                    <h3
                      className="display"
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        margin: 0,
                        marginBottom: 8,
                      }}
                    >
                      {p.t}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--fg-dim)",
                        lineHeight: 1.55,
                        fontSize: 15,
                      }}
                    >
                      {p.d}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <style>{`@media (max-width: 920px) { .sf-solution-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

export function SystemDiagram() {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        background: "color-mix(in oklch, var(--surface) 50%, transparent)",
        overflow: "hidden",
      }}
    >
      <div
        className="grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <svg
        viewBox="0 0 400 400"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--accent)" />
          </marker>
        </defs>
        <DiagramNode cx="80" cy="120" label="CÂMARA · IA" sub="detection" />
        <DiagramNode
          cx="200"
          cy="200"
          label="CONTROLADOR"
          sub="edge node"
          emphasized
        />
        <DiagramNode cx="320" cy="120" label="SEMÁFORO" sub="actuator" />
        <DiagramNode cx="200" cy="320" label="AMBULÂNCIA" sub="vehicle" />
        <path
          d="M 110 130 Q 105 165 155 200"
          stroke="var(--accent)"
          strokeWidth="1.4"
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-16"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 245 200 Q 280 165 290 130"
          stroke="var(--accent)"
          strokeWidth="1.4"
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-16"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M 200 230 L 200 290"
          stroke="var(--cyan)"
          strokeWidth="1.2"
          fill="none"
          opacity="0.6"
        />
        {/* Ambulância -> Câmara */}
        <path
          d="M 178 304 Q 118 235 96 146"
          stroke="var(--cyan)"
          strokeWidth="1.4"
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="4 6"
          strokeLinecap="round"
          opacity="0.75"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-20"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}

export function DiagramNode({ cx, cy, label, sub, emphasized }) {
  return (
    <g>
      <rect
        x={cx - 56}
        y={cy - 22}
        width="112"
        height="44"
        rx="6"
        fill={
          emphasized
            ? "color-mix(in oklch, var(--accent) 14%, var(--surface))" 
            : "var(--surface)"
        }
        stroke={emphasized ? "var(--accent)"  : "var(--hairline-2)"}
      />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.14em"
        fill="var(--fg)"
      >
        {label}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--fg-muted)"
      >
        {sub}
      </text>
    </g>
  );
}
export function TimeSaved() {
  const [t] = useT();
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [showTimeSaved, setShowTimeSaved] = useState(false);

  // Sped up durations to keep the entire experience snappy
  const slowDuration = 4.0; 
  const fastDuration = 4.0 * (688 / 1122); // ~2.45 seconds

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          
          // Pops up the exact moment the FAST track finishes its run
          const timer = setTimeout(() => {
            setShowTimeSaved(true);
          }, fastDuration * 1000);

          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [fastDuration]);

  return (
    <section
      ref={ref}
      style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container">
        <Reveal>
          <SectionHead
            eyebrow={t.timesaved.eyebrow}
            title={t.timesaved.title}
            sub={t.timesaved.body}
          />
        </Reveal>
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
            marginTop: 40,
          }}
        >
          <RaceTrack
            label={t === SF_I18N.pt ? "SEM Smart Flow" : "WITHOUT Smart Flow"}
            time="00:18:42"
            color="var(--red)"
            progress={isInView ? 1 : 0}
            duration={slowDuration}
          />
          <RaceTrack
            label={t === SF_I18N.pt ? "COM Smart Flow" : "WITH Smart Flow"}
            time="00:11:28"
            timeSaved={t === SF_I18N.pt ? "Poupança: 00:07:14" : "Saved: 00:07:14"}
            showTimeSaved={showTimeSaved}
            color="var(--green)"
            progress={isInView ? 1 : 0}
            duration={fastDuration}
            highlight
          />
        </div>
      </div>
    </section>
  );
}

export function RaceTrack({ 
  label, 
  time, 
  timeSaved, 
  showTimeSaved, 
  color, 
  progress, 
  duration, 
  highlight 
}) {
  return (
    <div
      style={{
        position: "relative",
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        background: highlight
          ? "color-mix(in oklch, var(--accent) 6%, var(--surface))"
          : "var(--surface)",
      }}
    >
      {/* Notification Bubble Pill */}
      {timeSaved && (
        <div
          className="mono"
          style={{
            position: "absolute",
            top: -16, 
            right: 24,
            background: "var(--green)",
            color: "var(--surface)",
            padding: "6px 14px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2), 0 0 12px color-mix(in oklch, var(--green) 30%, transparent)",
            zIndex: 10,
            opacity: showTimeSaved ? 1 : 0,
            transform: showTimeSaved ? "translateY(0) scale(1)" : "translateY(8px) scale(0.85)",
            transition: "opacity 0.3s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            pointerEvents: "none",
          }}
        >
          <span>⚡</span>
          <span>{timeSaved}</span>
          
          <div 
            style={{
              position: "absolute",
              bottom: -4,
              right: 20,
              width: 8,
              height: 8,
              background: "var(--green)",
              transform: "rotate(45deg)",
            }}
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
          width: "100%"
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 12,
            letterSpacing: "0.14em",
            color: highlight ? "var(--accent)" : "var(--fg-dim)",
          }}
        >
          {label}
        </div>
        
        <div className="mono" style={{ fontSize: 22, color }}>
          {time}
        </div>
      </div>
      
      <div
        style={{
          position: "relative",
          height: 6,
          background: "var(--hairline)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: color,
            transformOrigin: "left",
            transform: `scaleX(${progress})`,
            transition: `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`,
            borderRadius: 999,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
      </div>
      
      <div style={{ position: "relative", marginTop: 10, height: 22 }}>
        <div
          className="mono"
          style={{
            position: "absolute",
            left: `calc(${progress * 100}% - 14px)`,
            fontSize: 16,
            transition: `left ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`,
            filter: "drop-shadow(0 2px 6px rgba(0,0,0,.3))",
          }}
        >
          🚑
        </div>
      </div>
    </div>
  );
}
export function Market() {
  const [t] = useT();
  return (
    <section
      id="market"
      style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={t.market.eyebrow} title={t.market.title} />
        </Reveal>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {t.market.cards.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <div
                style={{
                  padding: 32,
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 100% 0%, color-mix(in oklch, var(--accent) 10%, transparent), transparent 50%)",
                  }}
                />
                <div
                  className="tag"
                  style={{ alignSelf: "flex-start", position: "relative" }}
                >
                  {c.k}
                </div>
                <div
                  className="display"
                  style={{
                    fontSize: "clamp(28px, 3.4vw, 40px)",
                    fontWeight: 500,
                    lineHeight: 1.1,
                    position: "relative",
                  }}
                >
                  {c.v}
                </div>
                <div
                  style={{
                    color: "var(--fg-dim)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    position: "relative",
                    marginTop: "auto",
                  }}
                >
                  {c.l}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          style={{
            position: "relative",
            marginTop: 40,
            maxWidth: 820,
          }}
        >
          {/* Linha atrás das bolas */}
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
                        maxWidth: 640,
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
      </div>
    </section>
  );
}

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
          <SectionHead
            eyebrow={t.compare.eyebrow}
            title={` ${t.compare.a_name} vs. ${t.compare.b_name}`}
            align="center"
          />
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
          <Reveal>
            <CompareSide name={t.compare.a_name} pts={t.compare.a_pts} dim />
          </Reveal>

          <Reveal delay={120}>
            <CompareSide
              name={t.compare.b_name}
              pts={t.compare.b_pts}
              highlight
            />
          </Reveal>
        </div>

        <style>{`
          @media (max-width: 760px) {
            .sf-compare-grid {
              grid-template-columns: 1fr !important;
            }

            .sf-compare-grid > *:first-child > div {
              border-right: 0 !important;
              border-bottom: 1px solid var(--hairline) !important;
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
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              color: dim ? "var(--fg-dim)" : "var(--fg)",
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 18,
                height: 18,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                marginTop: 1,
                background: highlight ? "var(--accent)" : "transparent",
                border: highlight ? "0" : "1px solid var(--hairline-2)",
                color: "#fff",
                fontSize: 11,
              }}
            >
              {highlight ? "✓" : "·"}
            </span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pricing() {
  const [t] = useT();
  return (
    <section
      style={{ padding: "120px 0", borderTop: "1px solid var(--hairline)" }}
    >
      <div className="container">
        <Reveal>
          <SectionHead eyebrow={t.pricing.eyebrow} title={t.pricing.title} />
        </Reveal>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          className="sf-pricing-grid"
        >
          <Reveal>
            <PricingCard
              lines={t.pricing.lines}
              total={t.pricing.total}
              title={
                t === SF_I18N.pt
                  ? "Custo por cruzamento"
                  : "Cost per intersection"
              }
            />
          </Reveal>
          <Reveal delay={120}>
            <PricingCard
              lines={t.pricing.invest_lines}
              total={t === SF_I18N.pt ? "€55.000 total" : "€55,000 total"}
              title={t.pricing.invest_title}
              secondary
            />
          </Reveal>
        </div>
        <style>{`@media (max-width: 760px) { .sf-pricing-grid { grid-template-columns: 1fr !important; } }`}</style>
      </div>
    </section>
  );
}

export function PricingCard({ title, lines, total, secondary }) {
  return (
    <div
      style={{
        padding: 32,
        border: "1px solid var(--hairline)",
        borderRadius: "var(--radius-lg)",
        background: secondary
          ? "var(--surface)"
          : "color-mix(in oklch, var(--accent) 6%, var(--surface))",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--fg-muted)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "20px 0 0 0",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {lines.map((l, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "14px 0",
              borderTop:
                i === 0
                  ? "1px solid var(--hairline)"
                  : "1px dashed var(--hairline)",
              fontSize: 15,
            }}
          >
            <span style={{ color: "var(--fg-dim)" }}>{l.k}</span>
            <span className="mono" style={{ color: "var(--fg)" }}>
              {l.v}
            </span>
          </li>
        ))}
      </ul>
      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          borderTop: "1px solid var(--hairline)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            color: "var(--fg-muted)",
          }}
        >
          TOTAL
        </span>
        <span
          className="display"
          style={{
            fontSize: 28,
            color: secondary ? "var(--fg)" : "var(--accent)",
            fontWeight: 500,
          }}
        >
          {total}
        </span>
      </div>
    </div>
  );
}

export function Team() {
  const [t] = useT();

  return (
    <section
      id="team"
      style={{
        padding: "clamp(90px, 12vh, 140px) 0",
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
          opacity: 0.75,
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        <Reveal>
          <SectionHead
            eyebrow={t.team.eyebrow}
            title={t.team.title}
            align="center"
          />
        </Reveal>

        <div
          className="sf-team-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 24,
            maxWidth: 860,
            margin: "0 auto",
            alignItems: "stretch",
          }}
        >
          {t.team.members.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <article
                style={{
                  height: "100%",
                  minHeight: 190,
                  padding: "clamp(26px, 3vw, 34px)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "var(--radius-lg)",
                  background:
                    "linear-gradient(180deg, color-mix(in oklch, var(--surface) 94%, white), var(--surface))",
                  boxShadow:
                    "0 24px 80px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.04)",
                  display: "flex",
                  gap: 22,
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "radial-gradient(circle at 0% 0%, color-mix(in oklch, var(--accent) 13%, transparent), transparent 42%)",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Avatar name={m.n} idx={i} />
                </div>

                <div style={{ position: "relative", minWidth: 0 }}>
                  <div
                    className="display"
                    style={{
                      fontSize: "clamp(22px, 2.2vw, 30px)",
                      fontWeight: 560,
                      lineHeight: 1.05,
                      letterSpacing: "-0.035em",
                      marginBottom: 8,
                    }}
                  >
                    {m.n}
                  </div>

                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.13em",
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      lineHeight: 1.45,
                    }}
                  >
                    {m.r}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <style>{`
          @media (max-width: 760px) {
            .sf-team-grid {
              grid-template-columns: 1fr !important;
              max-width: 520px !important;
            }

            .sf-team-grid article {
              min-height: 160px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

export function Avatar({ name, idx }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const palette = [
    ["oklch(0.50 0.22 300)", "oklch(0.30 0.15 300)"],
    ["oklch(0.55 0.16 200)", "oklch(0.30 0.12 200)"],
  ];
  const [a, b] = palette[idx % palette.length];
  return (
    <div
      style={{
        flexShrink: 0,
        width: 64,
        height: 64,
        borderRadius: 12,
        background: `linear-gradient(135deg, ${a}, ${b})`,
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: "-0.02em",
        border: "1px solid var(--hairline-2)",
      }}
    >
      {initials}
    </div>
  );
}

export function Contact() {
  const [t] = useT();
  return (
    <section
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
          background:
            "radial-gradient(ellipse at 50% 80%, color-mix(in oklch, var(--accent) 28%, transparent), transparent 65%)",
        }}
      />
      <div
        className="container"
        style={{ position: "relative", textAlign: "center" }}
      >
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            {t.contact.eyebrow}
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2
            className="display"
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              fontWeight: 500,
              margin: 0,
              maxWidth: 920,
              marginInline: "auto",
            }}
          >
            {t.contact.title}
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p style={{ marginTop: 24, fontSize: 18, color: "var(--fg-dim)" }}>
            {t.contact.sub}
          </p>
        </Reveal>
        <Reveal delay={220}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginTop: 36,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <a href={`mailto:${t.contact.email}`} className="btn btn-primary">
              {t.contact.cta} →
            </a>
            <a href="#top" className="btn btn-ghost">
              {t.nav.loginBt}
            </a>
          </div>
          <div
            className="mono"
            style={{ marginTop: 28, fontSize: 13, color: "var(--fg-muted)" }}
          >
            {t.contact.email}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function SOSFeature() {
  const [t] = useT()
  const colors = ["var(--red)", "var(--amber)", "var(--cyan)", "var(--green)"]

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

        <Reveal delay={80}>
          <div
            style={{
              marginTop: 32,
              padding: "14px 20px",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius)",
              background: "var(--surface)",
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 14, flexShrink: 0, opacity: 0.7, marginTop: 1 }}>ℹ</span>
            <p
              className="mono"
              style={{
                margin: 0,
                fontSize: 11,
                color: "var(--fg-muted)",
                lineHeight: 1.65,
                letterSpacing: "0.04em",
              }}
            >
              {t.sos.disclaimer}
            </p>
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
  )
}

export function Footer() {
  const [t] = useT();
  return (
    <footer
      style={{ padding: "40px 0 60px", borderTop: "1px solid var(--hairline)" }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Logomark size={18} />
          <span
            className="mono"
            style={{
              fontSize: 12,
              color: "var(--fg-muted)",
              letterSpacing: "0.08em",
            }}
          >
            {t.footer_note}
          </span>
        </div>
        <div
          className="mono"
          style={{ fontSize: 12, color: "var(--fg-muted)" }}
        >
          {t.contact.email}
        </div>
      </div>
    </footer>
  );
}
