import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function createTrafficIcon(status, phase) {
  const colors = { idle: '#ef4444', priority: '#4ade80', offline: '#6b7280', pending: '#f59e0b' }
  const base = colors[status] || colors.offline

  let red = 'rgba(100,100,100,0.3)', amber = 'rgba(100,100,100,0.3)', green = 'rgba(100,100,100,0.3)'
  if (status === 'priority') {
    green = '#4ade80'
  } else if (status === 'offline' || status === 'pending' || status === 'idle') {
    // all off
  } else {
    if (phase === 0) { red = '#ef4444' }
    else if (phase === 1) { amber = '#f59e0b' }
    else { green = '#4ade80' }
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

function FitBounds({ intersections }) {
  const map = useMap()
  useEffect(() => {
    if (intersections.length === 0) return
    const bounds = L.latLngBounds(intersections.map(i => [Number(i.lat), Number(i.lng)]))
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
  }, [intersections, map])
  return null
}

export function MonitoringMap({ intersections }) {
  const [phase, setPhase] = useState(0)

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
          <Marker key={inter.id} position={[Number(inter.lat), Number(inter.lng)]} icon={createTrafficIcon(inter.status, phase)}>
            <Popup>
              <div style={{ fontFamily: "var(--font-body)", minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{inter.name}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{inter.address}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 500,
                  background: inter.status === 'idle' ? '#fee2e2' : inter.status === 'priority' ? '#dcfce7' : inter.status === 'pending' ? '#fef3c7' : '#f3f4f6',
                  color: inter.status === 'idle' ? '#991b1b' : inter.status === 'priority' ? '#166534' : inter.status === 'pending' ? '#92400e' : '#374151',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%",
                    background: inter.status === 'idle' ? '#ef4444' : inter.status === 'priority' ? '#4ade80' : inter.status === 'pending' ? '#f59e0b' : '#6b7280',
                  }} />
                  {inter.status === 'idle' ? 'Inativo' : inter.status === 'priority' ? 'Prioridade' : inter.status === 'pending' ? 'Pendente' : 'Offline'}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
