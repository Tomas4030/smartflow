import { useT } from "../shared";
import { Logomark } from "../Logomark";

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
