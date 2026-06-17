import { useState, useEffect } from "react";
import { AUTH } from "../auth.js";

const STATUS_MAP = {
  idle: { label: "Inativo", color: "var(--cyan)", bg: "color-mix(in oklch, var(--cyan) 9%, transparent)", border: "color-mix(in oklch, var(--cyan) 22%, transparent)" },
  priority: { label: "Prioridade", color: "var(--red)", bg: "color-mix(in oklch, var(--red) 10%, transparent)", border: "color-mix(in oklch, var(--red) 25%, transparent)" },
  offline: { label: "Offline", color: "var(--fg-muted)", bg: "color-mix(in oklch, var(--surface) 70%, transparent)", border: "var(--hairline)" },
  pending: { label: "Pendente", color: "var(--amber)", bg: "color-mix(in oklch, var(--amber) 10%, transparent)", border: "color-mix(in oklch, var(--amber) 28%, transparent)" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.offline;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 11px", borderRadius: 999, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
      {s.label}
    </span>
  );
}

function Card({ label, value, color }) {
  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "20px 24px", flex: "1 1 160px" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: color || "var(--fg)", fontFamily: "var(--font-display)" }}>{value}</div>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [municipalities, setMunicipalities] = useState([]);
  const [pending, setPending] = useState([]);
  const [allIntersections, setAllIntersections] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  const headers = { ...AUTH.authHeaders(), "Content-Type": "application/json" };

  async function fetchData() {
    try {
      const [munRes, pendRes, intRes] = await Promise.all([
        fetch("/api/admin/municipalities", { headers }),
        fetch("/api/admin/intersections/pending", { headers }),
        fetch("/api/admin/intersections", { headers }),
      ]);
      setMunicipalities((await munRes.json()).data || []);
      setPending((await pendRes.json()).data || []);
      setAllIntersections((await intRes.json()).data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleApprove(id) {
    await fetch(`/api/admin/intersections/${id}/approve`, { method: "PUT", headers });
    fetchData();
  }
  async function handleReject(id) {
    await fetch(`/api/admin/intersections/${id}/reject`, { method: "PUT", headers });
    fetchData();
  }

  const totalIntersections = allIntersections.length;
  const totalPending = allIntersections.filter((i) => i.status === "pending").length;
  const totalPriority = allIntersections.filter((i) => i.status === "priority").length;
  const totalOffline = allIntersections.filter((i) => i.status === "offline").length;

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }} className="mono">A carregar...</div>;

  return (
    <div style={{ padding: "32px clamp(20px, 4vw, 48px)", maxWidth: 1200, margin: "0 auto" }}>
      {/* Summary Cards */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <Card label="Municípios" value={municipalities.length} color="var(--accent)" />
        <Card label="Interseções" value={totalIntersections} color="var(--cyan)" />
        <Card label="Pendentes" value={totalPending} color="var(--amber)" />
        <Card label="Em Prioridade" value={totalPriority} color="var(--red)" />
        <Card label="Offline" value={totalOffline} color="var(--fg-muted)" />
      </div>

    
      {/* Municipalities + Intersections */}
      <section>
        <h2 style={{ fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: 16 }}>Municípios &amp; Interseções</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {municipalities.map((mun) => (
            <div key={mun.id} style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <button onClick={() => setExpanded(expanded === mun.id ? null : mun.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", textAlign: "left" }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{mun.name}</span>
                  <span style={{ marginLeft: 12, fontSize: 12, color: "var(--fg-muted)" }}>{mun.district}</span>
                </div>
                <div className="mono" style={{ fontSize: 11, color: "var(--fg-muted)", display: "flex", gap: 12 }}>
                  <span>{mun.total} total</span>
                  {mun.pending > 0 && <span style={{ color: "var(--amber)" }}>{mun.pending} pend.</span>}
                  {mun.priority > 0 && <span style={{ color: "var(--red)" }}>{mun.priority} prio.</span>}
                  <span style={{ fontSize: 14 }}>{expanded === mun.id ? "▾" : "▸"}</span>
                </div>
              </button>
              {expanded === mun.id && (
                <div style={{ borderTop: "1px solid var(--hairline)", padding: "12px 20px" }}>
                  {allIntersections.filter((i) => i.municipalityId === mun.id).length === 0 ? (
                    <div style={{ fontSize: 12, color: "var(--fg-muted)" }}>Sem interseções.</div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead><tr style={{ borderBottom: "1px solid var(--hairline)" }}>
                        <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 500, color: "var(--fg-muted)", fontSize: 11 }}>Nome</th>
                        <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 500, color: "var(--fg-muted)", fontSize: 11 }}>Morada</th>
                        <th style={{ textAlign: "left", padding: "6px 0", fontWeight: 500, color: "var(--fg-muted)", fontSize: 11 }}>Estado</th>
                      </tr></thead>
                      <tbody>
                        {allIntersections.filter((i) => i.municipalityId === mun.id).map((inter) => (
                          <tr key={inter.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                            <td style={{ padding: "8px 0" }}>{inter.name}</td>
                            <td style={{ padding: "8px 0", color: "var(--fg-dim)" }}>{inter.address}</td>
                            <td style={{ padding: "8px 0" }}><StatusBadge status={inter.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
