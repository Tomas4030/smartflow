import { useT, Reveal } from "../shared";
import { SectionHead } from "./SectionHead";

const MARKET_ICONS = [
  /* camera scan */
  <svg
    key="cam"
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="15"
      y="18"
      width="22"
      height="16"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    <circle
      cx="26"
      cy="26"
      r="4.5"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    <circle cx="26" cy="26" r="1.5" fill="currentColor" />
    <path
      d="M4 12V8a4 4 0 0 1 4-4h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M48 12V8a4 4 0 0 0-4-4h-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M4 40v4a4 4 0 0 0 4 4h4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M48 40v4a4 4 0 0 1-4 4h-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
  </svg>,
  /* lightning bolt */
  <svg
    key="bolt"
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M29 14l-8 14h7l-4 10 10-14h-7l2-10z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>,
  /* shield check */
  <svg
    key="shield"
    width="52"
    height="52"
    viewBox="0 0 52 52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M26 6l18 7v12c0 10-8 18-18 21C16 43 8 35 8 25V13l18-7z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M19 26l5 5 9-9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>,
];

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
                {/* icon top-right */}
                <div
                  style={{
                    position: "absolute",
                    top: 24,
                    right: 24,
                    color:
                      "color-mix(in oklch, var(--accent) 45%, var(--fg-dim))",
                    opacity: 0.6,
                  }}
                >
                  {MARKET_ICONS[i]}
                </div>

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
