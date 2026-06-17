import { useState, useEffect } from "react";
import { AUTH } from "../auth.js";

export default function AdminHistory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = AUTH.authHeaders();

  useEffect(() => {
    fetch("/api/admin/history", { headers })
      .then((r) => r.json())
      .then((d) => setEvents(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }} className="mono">A carregar...</div>;

  return (
    <div style={{ padding: "40px clamp(24px, 5vw, 56px)", maxWidth: 1200, margin: "0 auto" }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>HISTÓRICO</div>
      <h1 style={{ fontSize: 26, fontFamily: "var(--font-display)", fontWeight: 600, margin: "0 0 28px" }}>Eventos de Deteção</h1>

      {events.length === 0 ? (
        <div style={{ padding: 40, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", color: "var(--fg-muted)", fontSize: 15, textAlign: "center" }}>
          Sem eventos registados.
        </div>
      ) : (
        <div style={{ overflowX: "auto", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "8px 0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
                <th style={thSty}>Interseção</th>
                <th style={thSty}>Município</th>
                <th style={thSty}>Tipo</th>
                <th style={thSty}>Duração</th>
                <th style={thSty}>Data</th>
                <th style={thSty}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                  <td style={tdSty}><span style={{ fontWeight: 500 }}>{ev.intersection?.name}</span></td>
                  <td style={tdSty}>{ev.intersection?.municipality?.name}</td>
                  <td style={tdSty}>
                    <span className="mono" style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999, background: ev.triggeredBy === "camera" ? "color-mix(in oklch, var(--cyan) 12%, transparent)" : "color-mix(in oklch, var(--amber) 12%, transparent)", color: ev.triggeredBy === "camera" ? "var(--cyan)" : "var(--amber)" }}>
                      {ev.triggeredBy}
                    </span>
                  </td>
                  <td style={tdSty} className="mono">{ev.greenDurationS}s</td>
                  <td style={tdSty} className="mono">{new Date(ev.detectedAt).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={tdSty}>
                    {ev.resolvedAt ? (
                      <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 500 }}>✓ Resolvido</span>
                    ) : (
                      <span style={{ fontSize: 13, color: "var(--amber)", fontWeight: 500 }}>● Ativo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thSty = { textAlign: "left", padding: "14px 16px", fontWeight: 500, color: "var(--fg-muted)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" };
const tdSty = { padding: "14px 16px", color: "var(--fg-dim)", fontSize: 15 };
