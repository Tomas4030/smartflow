import { Ic } from './Icons'

export function TopBar({ user }) {
  const now = new Date()
  const dateStr = now.toLocaleDateString("pt-PT", { weekday: "short", day: "numeric", month: "short" })
  const initials = user?.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "?"
  return (
    <div style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", borderBottom: "1px solid var(--hairline)", background: "color-mix(in oklch, var(--bg) 85%, transparent)", backdropFilter: "blur(12px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 999, padding: "8px 16px", flex: "0 0 320px" }}>
        <span style={{ color: "var(--fg-muted)" }}>{Ic.search}</span>
        <input placeholder="Buscar interseções…" style={{ background: "none", border: "none", outline: "none", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 13, width: "100%" }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, oklch(0.50 0.22 300), oklch(0.30 0.15 300))", display: "grid", placeItems: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14, border: "1px solid var(--hairline-2)" }}>
          {initials}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", lineHeight: 1.2 }}>{user?.name || "Admin"}</div>
          <div className="mono" style={{ fontSize: 10, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>{dateStr}</div>
        </div>
      </div>
    </div>
  )
}
