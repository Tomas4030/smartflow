import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useT, useTheme } from '../shared'
import { Logomark } from '../components/Logomark'

const ALBUFEIRA = [37.0930, -8.2470]

const SCENE = {
  hospital: { id: 'hosp', name: 'Hospital Lusíadas Albufeira', lat: 37.1028666, lng: -8.2332937 },
  call:     { id: 'call', name: 'Chamada · Av. dos Descobrimentos', lat: 37.07980, lng: -8.27050 },
  ambStart: { id: 'amb',  name: 'Quartel de Bombeiros', lat: 37.09870, lng: -8.26210 },
}

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving'

async function osrmRoute(from, to) {
  const url = `${OSRM_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
  try {
    const r = await fetch(url)
    if (!r.ok) throw new Error('OSRM error')
    const j = await r.json()
    if (!j.routes || !j.routes.length) throw new Error('No route')
    return j.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
  } catch {
    return [[from.lat, from.lng], [to.lat, to.lng]]
  }
}

function polylineLengths(pts) {
  let total = 0
  const segs = []
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i + 1][0] - pts[i][0]
    const dy = pts[i + 1][1] - pts[i][1]
    const d = Math.hypot(dx, dy)
    segs.push(d)
    total += d
  }
  return { total, segs }
}

function posAlong(pts, p) {
  if (pts.length < 2) return pts[0]
  const { total, segs } = polylineLengths(pts)
  const target = p * total
  let acc = 0
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const local = segs[i] === 0 ? 0 : (target - acc) / segs[i]
      const a = pts[i], b = pts[i + 1]
      return [a[0] + (b[0] - a[0]) * local, a[1] + (b[1] - a[1]) * local]
    }
    acc += segs[i]
  }
  return pts[pts.length - 1]
}

function sampleLegLights(legPts, leg) {
  if (legPts.length < 2) return []
  const { total } = polylineLengths(legPts)
  const count = Math.max(3, Math.min(7, Math.round(total / 0.0045)))
  const out = []
  for (let i = 0; i < count; i++) {
    const p = (i + 1) / (count + 1)
    const [lat, lng] = posAlong(legPts, p)
    out.push({ leg, p, lat, lng })
  }
  return out
}

function buildIntersections(pickup, hosp) {
  const all = [...sampleLegLights(pickup, 'pickup'), ...sampleLegLights(hosp, 'hosp')]
  return all.map((o, i) => ({ ...o, id: `int_${i}` }))
}

export default function Simulator() {
  const [t] = useT()
  const [theme] = useTheme()
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const intMarkersRef = useRef({})
  const ambMarkerRef = useRef(null)
  const polylineRef = useRef(null)
  const bgPolylineRef = useRef(null)

  const [routePickup, setRoutePickup] = useState(null)
  const [routeHosp, setRouteHosp] = useState(null)
  const [intersections, setIntersections] = useState([])
  const [routesLoading, setRoutesLoading] = useState(true)

  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [smartFlow, setSmartFlow] = useState(true)
  const [preempted, setPreempted] = useState(0)
  const [tickMs, setTickMs] = useState(0)
  const [wastedMs, setWastedMs] = useState(0)
  const [lightStates, setLightStates] = useState({})

  const progressRef = useRef(0)
  const lightStatesRef = useRef({})
  useEffect(() => { lightStatesRef.current = lightStates }, [lightStates])

  const sceneLeg = (status === 'hospital' || status === 'arrived') ? 'hosp' : 'pickup'

  useEffect(() => {
    let alive = true
    ;(async () => {
      setRoutesLoading(true)
      const [pickup, hosp] = await Promise.all([
        osrmRoute(SCENE.ambStart, SCENE.call),
        osrmRoute(SCENE.call, SCENE.hospital),
      ])
      if (!alive) return
      setRoutePickup(pickup)
      setRouteHosp(hosp)
      const ints = buildIntersections(pickup, hosp)
      setIntersections(ints)
      const initLights = {}
      ints.forEach(i => { initLights[i.id] = 'red' })
      setLightStates(initLights)
      setRoutesLoading(false)
    })()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (mapInstance.current) return
    const map = L.map(mapRef.current, {
      zoomControl: true, scrollWheelZoom: true, attributionControl: true,
    }).setView(ALBUFEIRA, 14)

    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
    const tileLabels = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19, subdomains: 'abcd',
    }).addTo(map)
    L.tileLayer(tileLabels, { maxZoom: 19, subdomains: 'abcd', pane: 'shadowPane' }).addTo(map)

    mapInstance.current = map

    L.marker([SCENE.hospital.lat, SCENE.hospital.lng], {
      icon: L.divIcon({ className: 'sf-icon', html: '<div class="sf-pin sf-pin-hosp">H</div>', iconSize: [28, 28], iconAnchor: [14, 14] }),
    }).addTo(map).bindTooltip(SCENE.hospital.name, { direction: 'top', offset: [0, -10] })

    L.marker([SCENE.call.lat, SCENE.call.lng], {
      icon: L.divIcon({ className: 'sf-icon', html: '<div class="sf-pin sf-pin-call"><span class="sf-pulse"></span>!</div>', iconSize: [28, 28], iconAnchor: [14, 14] }),
    }).addTo(map).bindTooltip(SCENE.call.name, { direction: 'top', offset: [0, -10] })

    L.marker([SCENE.ambStart.lat, SCENE.ambStart.lng], {
      icon: L.divIcon({ className: 'sf-icon', html: '<div class="sf-pin sf-pin-base">B</div>', iconSize: [20, 20], iconAnchor: [10, 10] }),
    }).addTo(map).bindTooltip(SCENE.ambStart.name, { direction: 'top', offset: [0, -8] })

    ambMarkerRef.current = L.marker([SCENE.ambStart.lat, SCENE.ambStart.lng], {
      icon: L.divIcon({ className: 'sf-icon', html: '<div class="sf-amb">🚑</div>', iconSize: [32, 32], iconAnchor: [16, 16] }),
      zIndexOffset: 1000,
    }).addTo(map)

    map.fitBounds([
      [SCENE.ambStart.lat, SCENE.ambStart.lng],
      [SCENE.hospital.lat, SCENE.hospital.lng],
      [SCENE.call.lat, SCENE.call.lng],
    ], { padding: [60, 60] })

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [theme])

  useEffect(() => {
    if (!mapInstance.current || !intersections.length) return
    Object.values(intMarkersRef.current).forEach(m => m.remove())
    intMarkersRef.current = {}

    intersections
      .filter(int => int.leg === sceneLeg)
      .forEach(int => {
        const m = L.marker([int.lat, int.lng], {
          icon: L.divIcon({
            className: 'sf-icon',
            html: `<div class="sf-int sf-int-red" data-id="${int.id}"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8],
          }),
        }).addTo(mapInstance.current)
        intMarkersRef.current[int.id] = m
      })

    if (routePickup && routeHosp) {
      if (bgPolylineRef.current) bgPolylineRef.current.remove()
      const full = [...routePickup, ...routeHosp]
      bgPolylineRef.current = L.polyline(full, { color: '#a78bfa', weight: 2, opacity: 0.25 }).addTo(mapInstance.current)
    }
  }, [intersections, routePickup, routeHosp, sceneLeg])

  useEffect(() => {
    Object.entries(lightStates).forEach(([id, state]) => {
      const m = intMarkersRef.current[id]
      if (!m) return
      const el = m.getElement()
      if (!el) return
      const inner = el.querySelector('.sf-int')
      if (inner) {
        inner.classList.remove('sf-int-red', 'sf-int-green')
        inner.classList.add(state === 'green' ? 'sf-int-green' : 'sf-int-red')
      }
    })
  }, [lightStates])

  useEffect(() => {
    if (!intersections.length) return
    const cycle = setInterval(() => {
      if (smartFlow) return
      setLightStates(prev => {
        const next = { ...prev }
        let changed = false
        intersections.forEach((int, idx) => {
          const phase = Math.floor(Date.now() / 6000) + idx
          const state = phase % 2 === 0 ? 'green' : 'red'
          if (next[int.id] !== state) { next[int.id] = state; changed = true }
        })
        return changed ? next : prev
      })
    }, 1000)
    return () => clearInterval(cycle)
  }, [smartFlow, intersections])

  useEffect(() => {
    if (status === 'idle' || status === 'arrived' || status === 'pickup') return
    if (!routePickup || !routeHosp) return

    const route = status === 'dispatched' ? routePickup : routeHosp
    const leg = status === 'dispatched' ? 'pickup' : 'hosp'
    const { total } = polylineLengths(route)
    const baseSpeed = total * 0.06
    const PREEMPT = 0.12
    const SLOW_ZONE = 0.015

    let raf
    let last = performance.now()
    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      const prog = progressRef.current
      let slowedAtRed = false

      if (smartFlow) {
        const nextLights = { ...lightStatesRef.current }
        let changed = false
        let newGreens = 0
        for (const int of intersections) {
          const approaching = int.leg === leg && prog >= int.p - PREEMPT && prog < int.p
          const desired = approaching ? 'green' : 'red'
          if (nextLights[int.id] !== desired) {
            if (desired === 'green') newGreens++
            nextLights[int.id] = desired
            changed = true
          }
        }
        if (changed) {
          lightStatesRef.current = nextLights
          setLightStates(nextLights)
          if (newGreens) setPreempted(p => p + newGreens)
        }
      } else {
        for (const int of intersections) {
          if (int.leg === leg && Math.abs(prog - int.p) < SLOW_ZONE && lightStatesRef.current[int.id] === 'red') {
            slowedAtRed = true
            break
          }
        }
      }

      const speed = slowedAtRed ? baseSpeed * 0.06 : baseSpeed
      const next = Math.min(prog + (speed * dt) / total, 1)
      progressRef.current = next
      setProgress(next)
      setTickMs(ms => ms + dt * 1000)
      if (slowedAtRed) setWastedMs(ms => ms + dt * 1000)

      if (next >= 1) {
        if (status === 'dispatched') {
          setStatus('pickup')
          setTimeout(() => { progressRef.current = 0; setStatus('hospital'); setProgress(0) }, 1800)
          return
        } else if (status === 'hospital') {
          setStatus('arrived')
          return
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [status, smartFlow, routePickup, routeHosp, intersections])

  function activeRoute() {
    if (status === 'dispatched' || status === 'pickup') return routePickup
    if (status === 'hospital' || status === 'arrived') return routeHosp
    return [[SCENE.ambStart.lat, SCENE.ambStart.lng]]
  }

  useEffect(() => {
    if (!ambMarkerRef.current || !routePickup || !routeHosp) return
    ambMarkerRef.current.setLatLng(posAlong(activeRoute(), progress))
  }, [progress, status, routePickup, routeHosp])

  useEffect(() => {
    if (!mapInstance.current || !routePickup || !routeHosp) return
    const route = activeRoute()
    if (polylineRef.current) {
      mapInstance.current.removeLayer(polylineRef.current)
      polylineRef.current = null
    }
    if (status !== 'idle' && route.length > 1) {
      polylineRef.current = L.polyline(route, {
        color: '#a78bfa', weight: 5, opacity: 0.9,
      }).addTo(mapInstance.current)
    }
  }, [status, routePickup, routeHosp])

  function dispatch() {
    if (status !== 'idle' && status !== 'arrived') return
    if (routesLoading) return
    progressRef.current = 0
    setStatus('dispatched')
    setProgress(0)
    setPreempted(0)
    setTickMs(0)
    setWastedMs(0)
  }

  function reset() {
    progressRef.current = 0
    setStatus('idle')
    setProgress(0)
    setPreempted(0)
    setTickMs(0)
    setWastedMs(0)
    setLightStates(() => {
      const o = {}
      intersections.forEach(i => { o[i.id] = 'red' })
      return o
    })
    if (ambMarkerRef.current) {
      ambMarkerRef.current.setLatLng([SCENE.ambStart.lat, SCENE.ambStart.lng])
    }
    if (polylineRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(polylineRef.current)
      polylineRef.current = null
    }
  }

  const savedSec = smartFlow ? Math.round(tickMs / 1000 * 0.55) : 0
  const wastedSec = Math.round(wastedMs / 1000)
  const statusLabel = {
    idle: t.sim.status_idle,
    dispatched: t.sim.status_dispatched,
    pickup: t.sim.status_pickup,
    hospital: t.sim.status_hospital,
    arrived: t.sim.status_arrived,
  }[status]

  const busy = (status !== 'idle' && status !== 'arrived') || routesLoading

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'grid',
      gridTemplateColumns: '360px 1fr',
      gridTemplateRows: '64px 1fr',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>
      {/* top bar */}
      <div style={{
        gridColumn: '1 / -1',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid var(--hairline)',
        background: 'color-mix(in oklch, var(--bg) 92%, transparent)',
        zIndex: 20,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--fg-dim)', fontSize: 14, textDecoration: 'none' }}>
          <Logomark size={20} />
          <span className="display" style={{ fontWeight: 600, color: 'var(--fg)' }}>
            Smart<span style={{ color: 'var(--accent)' }}>Flow</span>
          </span>
          <span style={{ marginLeft: 16, color: 'var(--fg-muted)', fontSize: 13 }}>{t.sim.back}</span>
        </Link>
        <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--fg-muted)' }}>
          {t.sim.title.toUpperCase()} · {t.sim.sub.toUpperCase()}
        </div>
      </div>

      {/* left panel */}
      <aside style={{
        gridColumn: '1', gridRow: '2',
        borderRight: '1px solid var(--hairline)',
        background: 'var(--bg)',
        padding: 24,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t.sim.panel_status}</div>
          <div className="display" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: 10 }}>
            {routesLoading ? t.sim.loading : statusLabel}
            {status !== 'idle' && status !== 'arrived' && (
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--red)', boxShadow: '0 0 12px var(--red)',
                animation: 'sf-blink 1s infinite',
              }} />
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid var(--hairline)', borderRadius: 10, overflow: 'hidden' }}>
          {smartFlow ? (
            <>
              <SimStat label={t.sim.panel_lights} value={preempted} mono />
              <SimStat label={t.sim.panel_saved} value={`${savedSec}s`} mono accent />
            </>
          ) : (
            <>
              <SimStat label={t.sim.panel_reds} value={intersections.length} mono />
              <SimStat label={t.sim.panel_wasted} value={`${wastedSec}s`} mono red />
            </>
          )}
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t.sim.smartflow}</div>
          <div style={{ display: 'flex', gap: 6, padding: 4, border: '1px solid var(--hairline)', borderRadius: 999, background: 'var(--bg-2)' }}>
            {[{ v: true, l: t.sim.on }, { v: false, l: t.sim.off }].map(o => (
              <button key={String(o.v)} onClick={() => setSmartFlow(o.v)} style={{
                flex: 1, padding: '10px 12px', borderRadius: 999,
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: smartFlow === o.v ? '#fff' : 'var(--fg-dim)',
                background: smartFlow === o.v ? (o.v ? 'var(--accent)' : 'var(--red)') : 'transparent',
                transition: 'background .2s, color .2s',
              }}>
                {o.l}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 10, lineHeight: 1.5 }}>
            {smartFlow ? t.sim.desc_on : t.sim.desc_off}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={dispatch}
            disabled={busy}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', opacity: busy ? 0.5 : 1, cursor: busy ? 'not-allowed' : 'pointer' }}
          >
            {t.sim.dispatch} →
          </button>
          <button onClick={reset} className="btn btn-ghost" style={{ padding: '12px 14px' }}>↺</button>
        </div>

        <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="eyebrow">{t.sim.legend}</div>
          <SimLegendRow color="var(--cyan)" label={t.sim.legend_hosp} />
          <SimLegendRow color="var(--red)" label={t.sim.legend_call} />
          <SimLegendRow color="var(--accent)" label={t.sim.legend_amb} />
          <SimLegendRow color="var(--green)" label={t.sim.legend_int} />
        </div>

        <div style={{ marginTop: 'auto', fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
          {t.sim.note}
        </div>
      </aside>

      {/* map */}
      <div style={{ gridColumn: '2', gridRow: '2', position: 'relative' }}>
        <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />
      </div>

      <style>{`
        html, body { overflow: hidden !important; }
        @keyframes sf-blink { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes sf-pulse-ring {
          0% { transform: scale(1); opacity: .8 }
          100% { transform: scale(2.6); opacity: 0 }
        }
        .sf-icon { background: transparent; border: 0; }
        .sf-pin {
          width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
          color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 14px;
          border: 2px solid var(--bg); box-shadow: 0 0 0 1px var(--hairline-2), 0 6px 14px rgba(0,0,0,.4);
          position: relative;
        }
        .sf-pin-hosp { background: var(--cyan); color: #0c1d24; }
        .sf-pin-call { background: var(--red); }
        .sf-pin-base { background: var(--accent-soft); color: #fff; width: 20px; height: 20px; font-size: 10px; }
        .sf-pulse {
          position: absolute; inset: -4px; border-radius: 50%; border: 2px solid var(--red);
          animation: sf-pulse-ring 1.4s ease-out infinite; pointer-events: none;
        }
        .sf-int {
          width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--bg);
          box-shadow: 0 0 0 1px var(--hairline-2);
          transition: background .25s ease, box-shadow .25s ease;
        }
        .sf-int-red { background: var(--red); box-shadow: 0 0 0 1px var(--hairline-2), 0 0 10px var(--red); }
        .sf-int-green { background: var(--green); box-shadow: 0 0 0 1px var(--hairline-2), 0 0 14px var(--green); }
        .sf-amb {
          font-size: 26px; line-height: 1;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,.5));
          animation: sf-amb-pulse 1.4s ease-in-out infinite;
        }
        @keyframes sf-amb-pulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 4px 8px rgba(0,0,0,.5)) }
          50% { transform: scale(1.05); filter: drop-shadow(0 4px 12px rgba(167,139,250,.55)) }
        }
        .leaflet-container { background: var(--bg) !important; font-family: var(--font-body); }
        .leaflet-tooltip {
          background: var(--surface); color: var(--fg); border: 1px solid var(--hairline); border-radius: 8px;
          padding: 6px 10px; font-size: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.3);
          font-family: var(--font-mono); letter-spacing: 0.04em;
        }
        .leaflet-tooltip-top:before { border-top-color: var(--hairline) !important; }
        .leaflet-control-zoom a { background: var(--surface); color: var(--fg); border-color: var(--hairline) !important; }
        .leaflet-control-zoom a:hover { background: var(--surface-2); }
        .leaflet-control-attribution {
          background: color-mix(in oklch, var(--bg) 80%, transparent) !important;
          color: var(--fg-muted) !important; font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: var(--fg-dim) !important; }
        @media (max-width: 880px) { aside { display: none !important; } }
      `}</style>
    </div>
  )
}

function SimStat({ label, value, mono, accent, red }) {
  const color = red ? 'var(--red)' : accent ? 'var(--accent)' : 'var(--fg)'
  return (
    <div style={{ padding: '14px 16px', background: 'var(--bg)', borderRight: '1px solid var(--hairline)' }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div className={mono ? 'mono' : 'display'} style={{ fontSize: 24, marginTop: 4, color, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  )
}

function SimLegendRow({ color, label }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'var(--fg-dim)' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}`, flexShrink: 0 }} />
      {label}
    </div>
  )
}
