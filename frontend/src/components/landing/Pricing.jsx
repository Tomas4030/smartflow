import { useT, Reveal } from "../../shared";
import { SF_I18N } from "../../i18n";
import { SectionHead } from "./SectionHead";

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
