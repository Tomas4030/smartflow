import { useState, useEffect, useRef } from "react";
import { AUTH } from "../auth.js";

const PAGE_SIZE = 10;

function fmtDatetime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", { day: "2-digit", month: "short", year: "numeric" })
    + " · " + d.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
}

function IcoFilter() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
}
function IcoEmpty() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .35 }}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>;
}

function EventStatus({ status }) {
  const active = status === "active";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 11px", borderRadius: 999,
      fontSize: 11, fontFamily: "var(--font-mono)",
      letterSpacing: "0.07em", textTransform: "uppercase", fontWeight: 500,
      background: active
        ? "color-mix(in oklch, var(--red) 11%, transparent)"
        : "color-mix(in oklch, var(--green) 9%, transparent)",
      color: active ? "var(--red)" : "var(--green)",
      border: `1px solid ${active
        ? "color-mix(in oklch, var(--red) 22%, transparent)"
        : "color-mix(in oklch, var(--green) 20%, transparent)"}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: active ? "var(--red)" : "var(--green)",
        animation: active ? "sf-ev-pulse 1.8s ease-out infinite" : "none",
      }} />
      {active ? "Ativo" : "Resolvido"}
    </span>
  );
}

function SkeletonRow() {
  const widths = ["55%", "72%", "52%", "28%", "64%", "60%", "44%"];
  return (
    <tr>
      {widths.map((w, i) => (
        <td key={i} style={{ padding: "13px 16px", borderBottom: "1px solid var(--hairline)" }}>
          <span style={{ display: "block", height: 12, width: w, borderRadius: 4, background: "var(--hairline)", animation: "sf-ev-shimmer 1.4s ease-in-out infinite" }} />
        </td>
      ))}
    </tr>
  );
}

const ctrlSty = {
  height: 36,
  padding: "0 12px",
  background: "var(--surface)",
  border: "1px solid var(--hairline)",
  borderRadius: "var(--radius-sm)",
  color: "var(--fg)",
  fontFamily: "var(--font-body)",
  fontSize: 13,
  outline: "none",
  cursor: "pointer",
  transition: "border-color .16s",
  boxSizing: "border-box",
};

export function EventsPage({ limit, embedded } = {}) {
  const user = AUTH.getUser();
  const municipality = user?.municipality || "SmartFlow";
  const [events, setEvents] = useState([]);
  const [allIntersections, setAllIntersections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [newId, setNewId] = useState(null);
  const seqRef = useRef(0);

  const [fInt, setFInt] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [fStatus, setFStatus] = useState("");

  useEffect(() => {
    fetch("/api/intersections", { headers: AUTH.authHeaders() })
      .then(r => r.json())
      .then(d => setAllIntersections(d.data || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);

    const p = new URLSearchParams();
    if (fInt) p.set("intersection_id", fInt);
    if (fFrom) p.set("from", fFrom);
    if (fTo) p.set("to", fTo);
    if (fStatus) p.set("status", fStatus);

    fetch(`/api/events?${p.toString()}`, { headers: AUTH.authHeaders() })
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(d => {
        setEvents(d.data || d || []);
        setLoading(false);
      })
      .catch(() => {
        setEvents([]);
        setLoading(false);
      });
  }, [fInt, fFrom, fTo, fStatus]);

  const pageCount = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const pageEvents = events.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalActive = events.filter(e => e.status === "active").length;

  function resetFilters() {
    setFInt(""); setFFrom(""); setFTo(""); setFStatus("");
  }
  const hasFilter = fInt || fFrom || fTo || fStatus;

  useEffect(() => {
    if (loading || hasFilter || events.length < 2) return;
    const interval = setInterval(() => {
      seqRef.current += 1;
      const id = `sim_${seqRef.current}`;
      setNewId(id);
      setEvents((prev) => {
        if (prev.length < 2) return prev;
        const recycled = prev[prev.length - 1];
        const active = Math.random() > 0.6;
        const fresh = {
          ...recycled,
          id,
          detectedAt: new Date().toISOString(),
          resolvedAt: active ? null : new Date().toISOString(),
          status: active ? "active" : "resolved",
          greenDurationS: 18 + Math.floor(Math.random() * 42),
        };
        return [fresh, ...prev.slice(0, prev.length - 1)];
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [loading, hasFilter, events.length]);

  if (embedded) {
    const limitedEvents = events.slice(0, limit || 5);
    return (
      <>
        <style>{`
          @keyframes sf-ev-shimmer { 0%,100%{opacity:.35} 50%{opacity:.7} }
          @keyframes sf-ev-pulse {
            0%,100%{box-shadow:0 0 0 0 color-mix(in oklch, var(--red) 55%, transparent)}
            50%{box-shadow:0 0 0 5px color-mix(in oklch, var(--red) 0%, transparent)}
          }
          @keyframes sf-ev-rowin {
            0%{background:color-mix(in oklch,var(--accent) 22%,transparent);opacity:.4;transform:translateY(-7px)}
            100%{background:transparent;opacity:1;transform:none}
          }
          .sf-ev-new { animation: sf-ev-rowin .8s ease both; }
          .sf-ev-tr:hover td { background: color-mix(in oklch, var(--surface) 45%, transparent) !important; }
        `}</style>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                {["ID Cruzamento", "Cruzamento", "Acionado por", "Verde", "Detetado em", "Resolvido em", "Estado"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)", fontWeight: 500, borderBottom: "1px solid var(--hairline)", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: limit || 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : limitedEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "52px 16px", textAlign: "center", color: "var(--fg-muted)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                      <IcoEmpty />
                      <span style={{ fontSize: 13.5 }}>Nenhum evento encontrado.</span>
                    </div>
                  </td>
                </tr>
              ) : limitedEvents.map((ev, idx) => (
                <tr key={ev.id} className={`sf-ev-tr ${ev.id === newId ? "sf-ev-new" : ""}`} style={{ borderBottom: idx < limitedEvents.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{ev.intersectionId}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--fg)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ev.intersection?.name || "Cruzamento"}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--fg-dim)", whiteSpace: "nowrap" }}>
                    {ev.triggeredBy === "sos" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "color-mix(in oklch, var(--red) 12%, transparent)", color: "var(--red)", border: "1px solid color-mix(in oklch, var(--red) 25%, transparent)" }}>🚨 SOS Cidadão</span>
                    ) : ev.triggeredBy}
                  </td>
                  <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cyan)" }}>{ev.greenDurationS}s</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--fg-dim)", whiteSpace: "nowrap" }}>{fmtDatetime(ev.detectedAt)}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--fg-muted)", whiteSpace: "nowrap" }}>{fmtDatetime(ev.resolvedAt)}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <EventStatus status={ev.resolvedAt ? "resolved" : "active"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes sf-ev-shimmer { 0%,100%{opacity:.35} 50%{opacity:.7} }
        @keyframes sf-ev-pulse {
          0%,100%{box-shadow:0 0 0 0 color-mix(in oklch, var(--red) 55%, transparent)}
          50%{box-shadow:0 0 0 5px color-mix(in oklch, var(--red) 0%, transparent)}
        }
        @keyframes sf-ev-rowin {
          0%{background:color-mix(in oklch,var(--accent) 22%,transparent);opacity:.4;transform:translateY(-7px)}
          100%{background:transparent;opacity:1;transform:none}
        }
        .sf-ev-new { animation: sf-ev-rowin .8s ease both; }
        .sf-ev-tr:hover td { background: color-mix(in oklch, var(--surface) 45%, transparent) !important; }
        .sf-ev-input:focus { border-color: var(--accent) !important; }
        .sf-ev-status-pill {
          padding: 6px 14px; border-radius: 999px; font-size: 12.5px;
          font-family: var(--font-body); font-weight: 500; cursor: pointer;
          border: 1px solid var(--hairline); background: transparent;
          color: var(--fg-muted); transition: all .16s;
        }
        .sf-ev-status-pill:hover { border-color: var(--fg-dim); color: var(--fg); }
        .sf-ev-status-pill.active-all    { background: var(--surface-2); color: var(--fg); border-color: var(--hairline-2); }
        .sf-ev-status-pill.active-active { background: color-mix(in oklch,var(--red) 10%,transparent); color:var(--red); border-color:color-mix(in oklch,var(--red) 28%,transparent); }
        .sf-ev-status-pill.active-resolved { background: color-mix(in oklch,var(--green) 8%,transparent); color:var(--green); border-color:color-mix(in oklch,var(--green) 22%,transparent); }
        .sf-pag-btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 34px; min-width: 34px; padding: 0 12px; border-radius: 8px;
          font-size: 13px; font-weight: 500; cursor: pointer;
          border: 1px solid var(--hairline); background: var(--surface);
          color: var(--fg-muted); transition: all .15s;
        }
        .sf-pag-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); background: color-mix(in oklch,var(--accent) 7%,transparent); }
        .sf-pag-btn:disabled { opacity:.38; cursor: default; }
        .sf-pag-btn.cur { background: var(--accent); color: #fff; border-color: transparent; }
      `}</style>

      <div style={{ padding: "36px 0 56px" }}>
        <div className="container">

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 6 }}>{municipality} · Todos os cruzamentos</p>
              <h1 className="display" style={{ margin: 0, fontSize: 28, letterSpacing: "-0.025em" }}>
                Eventos de Deteção
              </h1>
            </div>
            {totalActive > 0 && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "8px 16px", borderRadius: 999,
                background: "color-mix(in oklch, var(--red) 10%, transparent)",
                border: "1px solid color-mix(in oklch, var(--red) 25%, transparent)",
                color: "var(--red)", fontSize: 13, fontWeight: 500,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red)", animation: "sf-ev-pulse 1.8s ease-out infinite" }} />
                {totalActive} ativo{totalActive !== 1 ? "s" : ""} agora
              </span>
            )}
          </div>

          <div style={{
            background: "var(--bg-2)", border: "1px solid var(--hairline)",
            borderRadius: "var(--radius)", padding: "18px 20px", marginBottom: 16,
            display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end",
          }}>

            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200, flex: "1 1 200px" }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>Cruzamento</label>
              <select className="sf-ev-input" value={fInt} onChange={e => setFInt(e.target.value)} style={{ ...ctrlSty, paddingRight: 28 }}>
                <option value="">Todos</option>
                {allIntersections.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>De</label>
              <input type="date" className="sf-ev-input" value={fFrom} onChange={e => setFFrom(e.target.value)} style={{ ...ctrlSty, width: 150, colorScheme: "dark" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>Até</label>
              <input type="date" className="sf-ev-input" value={fTo} onChange={e => setFTo(e.target.value)} style={{ ...ctrlSty, width: 150, colorScheme: "dark" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>Estado</label>
              <div style={{ display: "flex", gap: 6 }}>
                <button className={`sf-ev-status-pill ${!fStatus ? "active-all" : ""}`} onClick={() => setFStatus("")}>Todos</button>
                <button className={`sf-ev-status-pill ${fStatus === "active" ? "active-active" : ""}`} onClick={() => setFStatus("active")}>Ativo</button>
                <button className={`sf-ev-status-pill ${fStatus === "resolved" ? "active-resolved" : ""}`} onClick={() => setFStatus("resolved")}>Resolvido</button>
              </div>
            </div>

            {hasFilter && (
              <button onClick={resetFilters} style={{ alignSelf: "flex-end", height: 36, padding: "0 14px", borderRadius: "var(--radius-sm)", fontSize: 12.5, color: "var(--fg-muted)", border: "1px solid var(--hairline)", background: "transparent", cursor: "pointer", transition: "color .15s, border-color .15s", display: "flex", alignItems: "center", gap: 6 }}>
                <IcoFilter /> Limpar
              </button>
            )}
          </div>

          <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    {["ID Cruzamento", "Cruzamento", "Acionado por", "Verde", "Detetado em", "Resolvido em", "Estado"].map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)", fontWeight: 500, borderBottom: "1px solid var(--hairline)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                  ) : pageEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: "52px 16px", textAlign: "center", color: "var(--fg-muted)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                          <IcoEmpty />
                          <span style={{ fontSize: 13.5 }}>Nenhum evento encontrado{hasFilter ? " com estes filtros" : ""}.</span>
                        </div>
                      </td>
                    </tr>
                  ) : pageEvents.map((ev, idx) => (
                    <tr key={ev.id} className={`sf-ev-tr ${ev.id === newId ? "sf-ev-new" : ""}`} style={{ borderBottom: idx < pageEvents.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                      <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{ev.intersectionId}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--fg)", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ev.intersection?.name || "Cruzamento"}
                      </td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--fg-dim)", whiteSpace: "nowrap" }}>
                        {ev.triggeredBy === "sos" ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: "color-mix(in oklch, var(--red) 12%, transparent)", color: "var(--red)", border: "1px solid color-mix(in oklch, var(--red) 25%, transparent)" }}>🚨 SOS Cidadão</span>
                        ) : ev.triggeredBy}
                      </td>
                      <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--cyan)" }}>{ev.greenDurationS}s</td>
                      <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--fg-dim)", whiteSpace: "nowrap" }}>{fmtDatetime(ev.detectedAt)}</td>
                      <td style={{ padding: "13px 16px", fontSize: 12.5, color: "var(--fg-muted)", whiteSpace: "nowrap" }}>{fmtDatetime(ev.resolvedAt)}</td>
                      <td style={{ padding: "13px 16px" }}>
                        <EventStatus status={ev.resolvedAt ? "resolved" : "active"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && events.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid var(--hairline)", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12.5, color: "var(--fg-muted)", fontFamily: "var(--font-mono)" }}>
                  {events.length} resultado{events.length !== 1 ? "s" : ""} · pág. {page}/{pageCount}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="sf-pag-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
                  </button>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <button key={i} className={`sf-pag-btn ${page === i + 1 ? "cur" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
                  ))}
                  <button className="sf-pag-btn" disabled={page === pageCount} onClick={() => setPage(p => p + 1)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
