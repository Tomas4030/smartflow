import { useT, Reveal } from "../../shared";

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
