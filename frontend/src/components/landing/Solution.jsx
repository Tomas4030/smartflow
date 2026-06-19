import { useT, Reveal } from "../shared";
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
        stroke={emphasized ? "var(--accent)" : "var(--hairline-2)"}
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
