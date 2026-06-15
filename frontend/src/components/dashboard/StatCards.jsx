export function StatCards({ intersections }) {
  const total = intersections.length
  const idle = intersections.filter(i => i.status === 'idle').length
  const priority = intersections.filter(i => i.status === 'priority').length
  const offline = intersections.filter(i => i.status === 'offline').length

  const cards = [
    { label: "Total Interseções", value: total, color: "var(--cyan)", sub: "registadas no sistema" },
    { label: "Ativas (idle)", value: idle, color: "var(--green)", sub: "a funcionar normalmente" },
    { label: "Prioridade", value: priority, color: "var(--red)", sub: "emergência ativa" },
    { label: "Offline", value: offline, color: "var(--fg-muted)", sub: "sem comunicação" },
  ]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
      {cards.map((c, i) => (
        <div key={i} style={{ padding: "20px 22px", borderRadius: "var(--radius-lg)", border: "1px solid var(--hairline)", background: "var(--surface)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--fg-muted)" }}>{c.label}</div>
          <div className="display" style={{ fontSize: 36, fontWeight: 500, color: c.color, lineHeight: 1 }}>{c.value}</div>
          <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>{c.sub}</div>
        </div>
      ))}
    </div>
  )
}
