import { Link } from "react-router-dom";
import { useT, Reveal } from "../../shared";

export function Contact() {
  const [t] = useT();
  return (
    <section
      id="contact"
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
            <Link to="/client/register" className="btn btn-ghost">
              {t.contact.cta_sos} →
            </Link>
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
