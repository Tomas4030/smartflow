import { useT, Reveal } from "../shared";
import { SectionHead } from "./SectionHead";

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
