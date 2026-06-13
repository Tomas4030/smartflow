import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { AUTH } from '../auth'
import { Logomark } from '../components/Logomark'

/* ── Icons ─────────────────────────────────────────────────── */
const Ic = {
  grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  traffic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="20" rx="3"/><circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>,
  camera: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  sim: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
}

/* ── Traffic light marker SVG ─────────────────────────────── */
function createTrafficIcon(status, phase) {
  const colors = { idle: '#4ade80', priority: '#ef4444', offline: '#6b7280' }
  const base = colors[status] || colors.idle

  // For idle status, cycle through green phases for animation
  let red = 'rgba(100,100,100,0.3)', amber = 'rgba(100,100,100,0.3)', green = 'rgba(100,100,100,0.3)'
  if (status === 'priority') {
    green = '#4ade80'
    if (phase === 1) { red = 'rgba(100,100,100,0.3)'; amber = 'rgba(100,100,100,0.3)'; green = '#4ade80' }
  } else if (status === 'offline') {
    red = 'rgba(100,100,100,0.3)'; amber = 'rgba(100,100,100,0.3)'; green = 'rgba(100,100,100,0.3)'
  } else {
    // idle — animate through red/amber/green
    if (phase === 0) { red = '#ef4444'; amber = 'rgba(100,100,100,0.3)'; green = 'rgba(100,100,100,0.3)' }
    else if (phase === 1) { red = 'rgba(100,100,100,0.3)'; amber = '#f59e0b'; green = 'rgba(100,100,100,0.3)' }
    else { red = 'rgba(100,100,100,0.3)'; amber = 'rgba(100,100,100,0.3)'; green = '#4ade80' }
  }

  const glow = status === 'priority' ? `<circle cx="20" cy="20" r="18" fill="none" stroke="${base}" stroke-width="2" opacity="0.6"><animate attributeName="r" from="18" to="28" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite"/></circle>` : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    ${glow}
    <rect x="13" y="4" width="14" height="32" rx="4" fill="#1a1a2e" stroke="${base}" stroke-width="1.5"/>
    <circle cx="20" cy="12" r="4" fill="${red}"/>
    <circle cx="20" cy="20" r="4" fill="${amber}"/>
    <circle cx="20" cy="28" r="4" fill="${green}"/>
  </svg>`

  return L.divIcon({
    html: svg,
    className: 'sf-traffic-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  })
}

/* ── Map auto-fit bounds ──────────────────────────────────── */
function FitBounds({ intersections }) {
  const map = useMap()
  useEffect(() => {
    if (intersections.length === 0) return
    const bounds = L.latLngBounds(intersections.map(i => [Number(i.lat), Number(i.lng)]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
  }, [intersections, map])
  return null
}

/* ── Sidebar ──────────────────────────────────────────────── */
function Sidebar({ active, onNav, onLogout, municipality }) {
  const navItems = [
    { key: "dashboard", label: "Painel", icon: Ic.grid },
    { key: "intersections", label: "Interseções", icon: Ic.traffic },
    { key: "detections", label: "Deteções", icon: Ic.camera },
    { key: "alerts", label: "Alertas", icon: Ic.bell },
    { key: "settings", label: "Configurações", icon: Ic.settings },
  ]
  return (
    <aside style={{ width: 240, flexShrink: 0, height: "100vh", background: "var(--bg-2)", borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={32} />
          <div>
            <div className="display" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Smart<span style={{ color: "var(--accent)" }}>Flow</span>
            </div>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "var(--fg-muted)", textTransform: "uppercase", marginTop: 1 }}>
              {municipality}
            </div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ key, label, icon }) => {
          const isActive = active === key
          return (
            <button key={key} onClick={() => onNav(key)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: "var(--radius)", background: isActive ? "color-mix(in oklch, var(--accent) 15%, var(--surface))" : "transparent", color: isActive ? "var(--fg)" : "var(--fg-dim)", border: isActive ? "1px solid color-mix(in oklch, var(--accent) 30%, var(--hairline))" : "1px solid transparent", fontSize: 13.5, fontWeight: isActive ? 500 : 400, cursor: "pointer", transition: "all .15s", textAlign: "left", width: "100%" }}>
              <span style={{ color: isActive ? "var(--accent)" : "var(--fg-muted)" }}>{icon}</span>
              {label}
            </button>
          )
        })}
      </nav>
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg)" }}>Sistema Online</div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>Operacional</div>
          </div>
        </div>
        <button onClick={onLogout} title="Sair" style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--fg-muted)", cursor: "pointer" }}>
          {Ic.logout}
        </button>
      </div>
    </aside>
  )
}

/* ── Top bar ──────────────────────────────────────────────── */
function TopBar({ user }) {
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

/* ── Status summary cards ─────────────────────────────────── */
function StatCards({ intersections }) {
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

/* ── Monitoring map with Leaflet ──────────────────────────── */
function MonitoringMap({ intersections }) {
  const [phase, setPhase] = useState(0)

  // Animate traffic light phases every 2s
  useEffect(() => {
    const timer = setInterval(() => setPhase(p => (p + 1) % 3), 2000)
    return () => clearInterval(timer)
  }, [])

  if (intersections.length === 0) {
    return (
      <div style={{ height: 500, display: "grid", placeItems: "center", background: "var(--bg)", borderRadius: "var(--radius)", border: "1px solid var(--hairline)" }}>
        <div style={{ textAlign: "center", color: "var(--fg-muted)" }}>
          <div style={{ fontSize: 14 }}>Nenhuma interseção registada</div>
          <div className="mono" style={{ fontSize: 11, marginTop: 8 }}>Adicione interseções ao seu município</div>
        </div>
      </div>
    )
  }

  const center = [
    intersections.reduce((s, i) => s + Number(i.lat), 0) / intersections.length,
    intersections.reduce((s, i) => s + Number(i.lng), 0) / intersections.length,
  ]

  return (
    <div style={{ height: 500, borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--hairline)" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds intersections={intersections} />
        {intersections.map(inter => (
          <Marker
            key={inter.id}
            position={[Number(inter.lat), Number(inter.lng)]}
            icon={createTrafficIcon(inter.status, phase)}
          >
            <Popup>
              <div style={{ fontFamily: "var(--font-body)", minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{inter.name}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{inter.address}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: inter.status === 'idle' ? '#dcfce7' : inter.status === 'priority' ? '#fee2e2' : '#f3f4f6', color: inter.status === 'idle' ? '#166534' : inter.status === 'priority' ? '#991b1b' : '#374151' }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: inter.status === 'idle' ? '#4ade80' : inter.status === 'priority' ? '#ef4444' : '#6b7280' }} />
                  {inter.status === 'idle' ? 'Ativo' : inter.status === 'priority' ? 'Prioridade' : 'Offline'}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

/* ── Legend ────────────────────────────────────────────────── */
function MapLegend({ intersections }) {
  const idle = intersections.filter(i => i.status === 'idle').length
  const priority = intersections.filter(i => i.status === 'priority').length
  const offline = intersections.filter(i => i.status === 'offline').length
  const items = [
    { c: "var(--green)", l: "Ativo", v: idle },
    { c: "var(--red)", l: "Prioridade", v: priority },
    { c: "var(--fg-muted)", l: "Offline", v: offline },
  ]
  return (
    <div style={{ display: "flex", gap: 0, background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: 999, overflow: "hidden", marginTop: 12 }}>
      {items.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRight: i < 2 ? "1px solid var(--hairline)" : "none" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.c, boxShadow: `0 0 6px ${s.c}` }} />
          <span className="mono" style={{ fontSize: 11, color: "var(--fg-dim)" }}>
            <strong style={{ color: "var(--fg)" }}>{s.v}</strong> {s.l}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ── Status badge ─────────────────────────────────────────── */
function StatusBadge({ event }) {
  const isActive = !event.resolvedAt
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

/* ── Events table ─────────────────────────────────────────── */
function EventsTable({ events }) {
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
              // Map triggeredBy to display type
              const types = ['Deteção Visual', 'Ciclo Restaurado', 'Falha de Sensor']
              const displayType = e.resolvedAt ? types[1] : (e.triggeredBy === 'camera' ? types[0] : (e._status === 'alerta' ? types[2] : types[0]))

              return (
              <tr key={e.id} style={{ background: i % 2 === 0 ? "transparent" : "color-mix(in oklch, var(--surface) 20%, transparent)", transition: "background .15s" }} onMouseEnter={ev => ev.currentTarget.style.background = "color-mix(in oklch, var(--accent) 5%, transparent)"} onMouseLeave={ev => ev.currentTarget.style.background = i % 2 === 0 ? "transparent" : "color-mix(in oklch, var(--surface) 20%, transparent)"}>
                <td style={{ ...tdSty, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
                  {e.id?.slice(0, 8).toUpperCase()}
                </td>
                <td style={tdSty}><TriggerBadge type={displayType} /></td>
                <td style={{ ...tdSty, color: "var(--fg)" }}>
                  <div>{e.intersection?.address || '—'}</div>
                </td>
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

/* ── Dashboard content ────────────────────────────────────── */
function DashboardContent({ intersections, events, municipality }) {
  return (
    <div style={{ padding: "0 28px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 0 18px" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Município de {municipality}</div>
          <h1 className="display" style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>Visão Geral</h1>
        </div>
      </div>

      <StatCards intersections={intersections} />

      <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--surface)", marginBottom: 24, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span className="display" style={{ fontSize: 16, fontWeight: 500 }}>Mapa de Monitoramento</span>
            {intersections.some(i => i.status === 'priority') && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, background: "color-mix(in oklch, var(--red) 12%, transparent)", border: "1px solid color-mix(in oklch, var(--red) 30%, transparent)", fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--red)" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)", animation: "db-blink 1s infinite" }} />
                Prioridade Ativa
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <MonitoringMap intersections={intersections} />
          <MapLegend intersections={intersections} />
        </div>
      </div>

      {/* Events table */}
      <div style={{ border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", background: "var(--surface)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--hairline)" }}>
          <span className="display" style={{ fontSize: 16, fontWeight: 500 }}>Eventos & Deteções Recentes</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--accent)", letterSpacing: "0.06em" }}>Ver todos →</span>
        </div>
        <EventsTable events={events} />
      </div>
    </div>
  )
}

/* ── Stub pages ───────────────────────────────────────────── */
function StubPage({ title, eyebrow }) {
  return (
    <div style={{ padding: "60px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="display" style={{ fontSize: 36, fontWeight: 500, margin: 0, color: "var(--fg)" }}>{title}</h2>
      <p style={{ color: "var(--fg-muted)", maxWidth: 420, lineHeight: 1.55, fontSize: 15 }}>
        Esta secção está em desenvolvimento.
      </p>
    </div>
  )
}

/* ── Root ─────────────────────────────────────────────────── */
export default function DashboardPage() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState("dashboard")
  const [intersections, setIntersections] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const user = AUTH.getUser()
  const municipality = user?.municipality || "Município"

  const fetchData = useCallback(async () => {
    const token = AUTH.getToken()
    if (!token) { navigate('/login'); return }
    try {
      const [intRes, evRes] = await Promise.all([
        fetch("/api/intersections", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/events", { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (intRes.status === 401 || evRes.status === 401) { AUTH.logout(); navigate('/login'); return }
      if (intRes.ok) { const json = await intRes.json(); setIntersections(json.data || []) }
      if (evRes.ok) {
        const json = await evRes.json()
        const raw = json.data || json || []
        // Enrich events with display status
        const enriched = raw.map(e => {
          let _status
          if (e.resolvedAt) _status = 'resolvido'
          else if (e.triggeredBy === 'manual') _status = 'analise'
          else _status = 'ativo'
          return { ...e, _status }
        })
        // Mark the oldest unresolved as 'alerta' for variety
        const unresolved = enriched.filter(e => !e.resolvedAt)
        if (unresolved.length > 1) unresolved[unresolved.length - 1]._status = 'alerta'
        setEvents(enriched)
      }
    } catch (e) { /* silent */ }
    setLoading(false)
  }, [navigate])

  useEffect(() => {
    if (!AUTH.getToken()) { navigate('/login'); return }
    fetchData()
  }, [navigate, fetchData])

  // Poll every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <style>{`
        @keyframes db-blink { 0%,100%{opacity:1}50%{opacity:.3} }
        .sf-traffic-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 8px 24px -6px rgba(0,0,0,.3); }
        .leaflet-popup-content { margin: 12px 14px; }
      `}</style>
      <Sidebar active={activePage} onNav={setActivePage} onLogout={() => { AUTH.logout(); navigate('/login') }} municipality={municipality} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar user={user} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
              <div className="mono" style={{ color: "var(--fg-muted)" }}>A carregar…</div>
            </div>
          ) : (
            <>
              {activePage === "dashboard" && <DashboardContent intersections={intersections} events={events} municipality={municipality} />}
              {activePage === "intersections" && <StubPage title="Interseções" eyebrow="GESTÃO" />}
              {activePage === "detections" && <StubPage title="Deteções" eyebrow="HISTÓRICO" />}
              {activePage === "alerts" && <StubPage title="Alertas" eyebrow="NOTIFICAÇÕES" />}
              {activePage === "settings" && <StubPage title="Configurações" eyebrow="SISTEMA" />}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
