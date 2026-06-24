import { useT, Reveal } from "../../shared";
import { SectionHead } from "./SectionHead";

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
        background:
          "radial-gradient(circle at 50% 42%, color-mix(in oklch, var(--accent) 8%, transparent), transparent 34%), color-mix(in oklch, var(--surface) 54%, transparent)",
        overflow: "hidden",
      }}
    >
      <div
        className="grid-bg"
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          maskImage:
            "radial-gradient(ellipse at center, black 28%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 28%, transparent 78%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 22,
          left: 22,
          zIndex: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.16em",
          color: "var(--fg-muted)",
          textTransform: "uppercase",
        }}
      >
        Fluxo automático
      </div>

      <div
        style={{
          position: "absolute",
          right: 22,
          top: 18,
          zIndex: 2,
          padding: "8px 10px",
          border: "1px solid var(--hairline)",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.12em",
          color: "var(--accent)",
          background: "color-mix(in oklch, var(--accent) 7%, transparent)",
        }}
      >
        TEMPO REAL
      </div>

      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-labelledby="diagram-title diagram-desc"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <title id="diagram-title">Fluxo da Smart Flow num cruzamento</title>
        <desc id="diagram-desc">
          A câmara com IA deteta a ambulância, envia o sinal ao controlador
          local e o semáforo abre antes da chegada do veículo.
        </desc>

        <defs>
          <marker
            id="sf-arrow-accent"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--accent)" />
          </marker>

          <marker
            id="sf-arrow-cyan"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 z" fill="var(--cyan)" />
          </marker>

          <filter
            id="sf-soft-glow"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cruzamento */}
        <g opacity="0.36">
          <path
            d="M200 82 V318"
            stroke="var(--hairline-2)"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <path
            d="M82 200 H318"
            stroke="var(--hairline-2)"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <path
            d="M200 82 V318"
            stroke="var(--surface)"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M82 200 H318"
            stroke="var(--surface)"
            strokeWidth="30"
            strokeLinecap="round"
          />
          <path
            d="M200 96 V304"
            stroke="var(--hairline)"
            strokeWidth="1"
            strokeDasharray="5 8"
          />
          <path
            d="M96 200 H304"
            stroke="var(--hairline)"
            strokeWidth="1"
            strokeDasharray="5 8"
          />
        </g>

        {/* Pulso no cruzamento */}
        <circle
          cx="200"
          cy="200"
          r="28"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="none"
          opacity="0.28"
        >
          <animate
            className="sf-diagram-motion"
            attributeName="r"
            values="24;38;24"
            dur="2.4s"
            repeatCount="indefinite"
          />
          <animate
            className="sf-diagram-motion"
            attributeName="opacity"
            values="0.34;0.08;0.34"
            dur="2.4s"
            repeatCount="indefinite"
          />
        </circle>

        <DiagramNode
          cx={90}
          cy={120}
          label="CÂMARA + IA"
          sub="deteta"
          icon="camera"
        />

        <DiagramNode
          cx={200}
          cy={200}
          label="CONTROLADOR"
          sub="decide localmente"
          emphasized
          width={126}
        />

        <DiagramNode
          cx={310}
          cy={120}
          label="SEMÁFORO VERDE"
          sub="abre prioridade"
          icon="light"
          width={132}
        />

        <DiagramNode
          cx={200}
          cy={322}
          label="AMBULÂNCIA"
          sub="aproxima-se"
          icon="ambulance"
          width={124}
        />

        {/* Setas — renderizadas por último para ficarem acima das boxes */}
        {/* Câmara → Controlador */}
        <path
          d="M146 138 C158 158 164 168 174 174"
          stroke="var(--cyan)"
          strokeWidth="1.4"
          strokeDasharray="4 6"
          strokeLinecap="round"
          fill="none"
          opacity="0.75"
          markerEnd="url(#sf-arrow-cyan)"
        >
          <animate
            className="sf-diagram-motion"
            attributeName="stroke-dashoffset"
            from="0"
            to="-20"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Controlador → Semáforo */}
        <path
          d="M263 188 C276 176 282 162 286 146"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeDasharray="4 5"
          strokeLinecap="round"
          fill="none"
          opacity="0.86"
          markerEnd="url(#sf-arrow-accent)"
        >
          <animate
            className="sf-diagram-motion"
            attributeName="stroke-dashoffset"
            from="0"
            to="-18"
            dur="1.25s"
            repeatCount="indefinite"
          />
        </path>

        {/* Ambulância → Controlador */}
        <path
          d="M200 296 V226"
          stroke="var(--cyan)"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.78"
          markerEnd="url(#sf-arrow-cyan)"
        />

        {/* Câmara → Ambulância */}
        <path
          d="M75 146 L148 296"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
          markerEnd="url(#sf-arrow-accent)"
        >
          <animate
            className="sf-diagram-motion"
            attributeName="stroke-dashoffset"
            from="0"
            to="-18"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>

        {/* Ambulância → Câmara (sinal de deteção) */}
        <path
          d="M158 296 C140 240 120 180 100 146"
          stroke="var(--cyan)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
          markerEnd="url(#sf-arrow-cyan)"
        >
          <animate
            className="sf-diagram-motion"
            attributeName="stroke-dashoffset"
            from="0"
            to="-18"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          bottom: 22,
          display: "flex",
          justifyContent: "center",
          gap: 8,
          flexWrap: "wrap",
          zIndex: 2,
        }}
      >
        {["deteção", "prioridade", "ciclo normal"].map((step) => (
          <span
            key={step}
            style={{
              padding: "7px 10px",
              border: "1px solid var(--hairline)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--fg-muted)",
              background:
                "color-mix(in oklch, var(--surface) 70%, transparent)",
              textTransform: "uppercase",
            }}
          >
            {step}
          </span>
        ))}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .sf-diagram-motion {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export function DiagramNode({
  cx,
  cy,
  label,
  sub,
  emphasized = false,
  width = 112,
  icon,
}) {
  const x = cx - width / 2;

  return (
    <g>
      <rect
        x={x}
        y={cy - 26}
        width={width}
        height="52"
        rx="8"
        fill={
          emphasized
            ? "color-mix(in oklch, var(--accent) 14%, var(--surface))"
            : "color-mix(in oklch, var(--surface) 92%, transparent)"
        }
        stroke={emphasized ? "var(--accent)" : "var(--hairline-2)"}
        filter={emphasized ? "url(#sf-soft-glow)" : undefined}
      />

      {icon && (
        <g
          transform={`translate(${x + 13}, ${cy - 8})`}
          opacity="0.72"
          stroke={emphasized ? "var(--accent)" : "var(--fg-muted)"}
          fill="none"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon === "camera" && (
            <>
              <rect x="0" y="1" width="16" height="12" rx="3" />
              <circle cx="8" cy="7" r="3.2" />
            </>
          )}

          {icon === "light" && (
            <>
              <rect x="4" y="-1" width="8" height="17" rx="4" />
              <circle cx="8" cy="3.5" r="1.6" />
              <circle cx="8" cy="8" r="1.6" />
              <circle
                cx="8"
                cy="12.5"
                r="1.6"
                fill="var(--accent)"
                stroke="none"
              />
            </>
          )}

          {icon === "ambulance" && (
            <>
              <path d="M1 11h14V6h-4L9 3H1v8z" />
              <circle cx="5" cy="13" r="1.7" />
              <circle cx="12" cy="13" r="1.7" />
              <path d="M5 5v4M3 7h4" />
            </>
          )}
        </g>
      )}

      <text
        x={icon ? x + 38 : cx}
        y={cy - 4}
        textAnchor={icon ? "start" : "middle"}
        fontSize="9"
        fontFamily="var(--font-mono)"
        letterSpacing="0.13em"
        fill="var(--fg)"
      >
        {label}
      </text>

      <text
        x={icon ? x + 38 : cx}
        y={cy + 11}
        textAnchor={icon ? "start" : "middle"}
        fontSize="8"
        fontFamily="var(--font-mono)"
        fill="var(--fg-muted)"
      >
        {sub}
      </text>
    </g>
  );
}
