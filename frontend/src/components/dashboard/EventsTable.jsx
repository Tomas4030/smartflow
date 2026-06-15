import { useState } from 'react'
import { Ic } from './Icons'

function StatusBadge({ event }) {
  let s
  if (event._status === 'alerta') {
    s = { bg: "color-mix(in oklch, var(--red) 14%, transparent)", c: "var(--red)", border: "color-mix(in oklch, var(--red) 35%, transparent)", label: "Alerta", dot: "var(--red)" }
  } else if (event._status === 'analise') {
    s = { bg: "color-mix(in oklch, var(--amber) 14%, transparent)", c: "var(--amber)", border: "color-mix(in oklch, var(--amber) 35%, transparent)", label: "Em análise", dot: "var(--amber)" }
  } else if (event.resolvedAt) {
    s = { bg: "color-mix(in oklch, var(--green) 14%, transparent)", c: "var(--green)", border: "color-mix(in oklch, var(--green) 35%, transparent)", label: "Resolvido", dot: "var(--green)" }
  } else {
    s = { bg: "color-mix(in oklch, var(--accent) 16%, transparent)", c: "var(--accent)", border: "color-mix(in oklch, var(--accent) 40%, transparent)", label: "Pré-emissão ativa", dot: "var(--accent)" }
  }
  const blink = !event.resolvedAt && event._status !== 'analise'
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: `1px solid ${s.border}`, background: s.bg, color: s.c, fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, boxShadow: blink ? `0 0 8px ${s.dot}` : "none", animation: blink ? "db-blink 1s infinite" : "none" }} />
      {s.label}
    </span>
  )
}

function TriggerBadge({ type }) {
  const map = {
    'Deteção Visual': { color: "var(--cyan)", bg: "color-mix(in oklch, var(--cyan) 10%, transparent)", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg> },
    'Ciclo Restaurado': { color: "var(--green)", bg: "color-mix(in oklch, var(--green) 10%, transparent)", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> },
    'Falha de Sensor': { color: "var(--red)", bg: "color-mix(in oklch, var(--red) 10%, transparent)", icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  }
  const s = map[type] || map['Deteção Visual']
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: "1px solid var(--hairline)", background: s.bg, color: s.color, fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
      {s.icon}
      {type}
    </span>
  )
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "agora"
  if (mins < 60) return `${mins}m atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export function EventsTable({ events }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const pageSize = 5

  const filtered = events.filter(e =>
    !search || [e.intersection?.name, e.intersection?.address, e.triggeredBy, e.id?.slice(0, 8)].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const thSty = { fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", color: "var(--fg-muted)", textAlign: "left", padding: "12px 16px", borderBottom: "1px solid var(--hairline)", fontWeight: 500 }
  const tdSty = { padding: "16px 16px", fontSize: 13.5, color: "var(--fg-dim)", borderBottom: "1px solid var(--hairline)", verticalAlign: "middle" }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
          <thead>
            <tr style={{ background: "color-mix(in oklch, var(--surface) 50%, transparent)" }}>
              <th style={{ ...thSty, width: 90 }}>ID</th>
              <th style={{ ...thSty, width: 160 }}>TIPO</th>
              <th style={thSty}>LOCALIZAÇÃO</th>
              <th style={{ ...thSty, width: 130 }}>CRUZAMENTO</th>
              <th style={{ ...thSty, width: 110 }}>HORÁRIO</th>
              <th style={{ ...thSty, width: 160 }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((e, i) => {
              const types = ['Deteção Visual', 'Ciclo Restaurado', 'Falha de Sensor']
              const displayType = e.resolvedAt ? types[1] : (e.triggeredBy === 'camera' ? types[0] : (e._status === 'alerta' ? types[2] : types[0]))
              return (
                <tr key={e.id} style={{ background: i % 2 === 0 ? "transparent" : "color-mix(in oklch, var(--surface) 20%, transparent)", transition: "background .15s" }} onMouseEnter={ev => ev.currentTarget.style.background = "color-mix(in oklch, var(--accent) 5%, transparent)"} onMouseLeave={ev => ev.currentTarget.style.background = i % 2 === 0 ? "transparent" : "color-mix(in oklch, var(--surface) 20%, transparent)"}>
                  <td style={{ ...tdSty, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>{e.id?.slice(0, 8).toUpperCase()}</td>
                  <td style={tdSty}><TriggerBadge type={displayType} /></td>
                  <td style={{ ...tdSty, color: "var(--fg)" }}>{e.intersection?.address || '—'}</td>
                  <td style={tdSty}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg)" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
                      {e.intersection?.name || '—'}
                    </span>
                  </td>
                  <td style={{ ...tdSty, fontFamily: "var(--font-mono)", fontSize: 11 }}>
                    <div style={{ color: "var(--fg)" }}>{new Date(e.detectedAt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                    <div style={{ color: "var(--fg-muted)", fontSize: 10, marginTop: 2 }}>{timeAgo(e.detectedAt)}</div>
                  </td>
                  <td style={tdSty}><StatusBadge event={e} /></td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ ...tdSty, textAlign: "center", color: "var(--fg-muted)", padding: 40 }}>
                <div style={{ fontSize: 14 }}>Nenhum evento encontrado</div>
                <div className="mono" style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>Os eventos aparecem quando o sistema deteta uma emergência</div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderTop: "1px solid var(--hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 999, padding: "8px 14px", flex: "0 0 240px" }}>
          <span style={{ color: "var(--fg-muted)" }}>{Ic.search}</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Buscar eventos…" style={{ background: "none", border: "none", outline: "none", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 13, width: "100%" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-muted)" }}>{filtered.length} evento{filtered.length !== 1 ? 's' : ''}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid var(--hairline)", background: "var(--surface)", color: page === 1 ? "var(--fg-muted)" : "var(--fg)", cursor: page === 1 ? "default" : "pointer", transition: "all .15s" }}>‹</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid", fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer", borderColor: p === page ? "var(--accent)" : "var(--hairline)", background: p === page ? "var(--accent)" : "var(--surface)", color: p === page ? "#fff" : "var(--fg)", transition: "all .15s" }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid var(--hairline)", background: "var(--surface)", color: page === pages ? "var(--fg-muted)" : "var(--fg)", cursor: page === pages ? "default" : "pointer", transition: "all .15s" }}>›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
