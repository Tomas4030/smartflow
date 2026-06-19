/* Smart Flow — Simulator
   Fixed side-by-side layout: control panel left, map right.
   OSRM-driven road-following routes. */

const ALBUFEIRA = [37.0891, -8.2499];

const SCENE = {
  hospital: { id: "hosp", name: "Hospital de Albufeira", lat: 37.10120, lng: -8.24350 },
  call:     { id: "call", name: "Chamada · Av. dos Descobrimentos", lat: 37.07980, lng: -8.27050 },
  ambStart: { id: "amb",  name: "Quartel de Bombeiros", lat: 37.09870, lng: -8.26210 },
};

// OSRM public demo server — free, road routing on OSM data
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

async function osrmRoute(from, to) {
  // returns array of [lat, lng]
  const url = `${OSRM_URL}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("OSRM error");
    const j = await r.json();
    if (!j.routes || !j.routes.length) throw new Error("No route");
    return j.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  } catch (e) {
    // fallback: straight line
    return [[from.lat, from.lng], [to.lat, to.lng]];
  }
}

function polylineLengths(pts) {
  let total = 0;
  const segs = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const dx = pts[i+1][0] - pts[i][0];
    const dy = pts[i+1][1] - pts[i][1];
    const d = Math.hypot(dx, dy);
    segs.push(d);
    total += d;
  }
  return { total, segs };
}

function posAlong(pts, p) {
  if (pts.length < 2) return pts[0];
  const { total, segs } = polylineLengths(pts);
  const target = p * total;
  let acc = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= target) {
      const local = segs[i] === 0 ? 0 : (target - acc) / segs[i];
      const a = pts[i], b = pts[i+1];
      return [a[0] + (b[0]-a[0]) * local, a[1] + (b[1]-a[1]) * local];
    }
    acc += segs[i];
  }
  return pts[pts.length - 1];
}

// pick a sample of intersections along the route (every Nth point)
function sampleIntersections(routePts, count = 6) {
  if (routePts.length < 4) return [];
  const out = [];
  // skip start/end a bit
  const startSkip = Math.floor(routePts.length * 0.12);
  const endSkip = Math.floor(routePts.length * 0.88);
  const usable = endSkip - startSkip;
  if (usable <= 0) return [];
  for (let i = 0; i < count; i++) {
    const idx = startSkip + Math.floor((i + 1) * usable / (count + 1));
    const p = routePts[idx];
    out.push({ id: `int_${i}`, lat: p[0], lng: p[1], routeIdx: idx });
  }
  return out;
}

function Simulator() {
  const [t] = useT();
  const [theme] = useTheme();
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const intMarkersRef = useRef({});
  const ambMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  const [routePickup, setRoutePickup] = useState(null);
  const [routeHosp, setRouteHosp] = useState(null);
  const [intersections, setIntersections] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [smartFlow, setSmartFlow] = useState(true);
  const [preempted, setPreempted] = useState(0);
  const [tickMs, setTickMs] = useState(0);

  const PREEMPT_DIST = 0.0025;

  const [lightStates, setLightStates] = useState({});

  // ── fetch routes once on mount ─────────────────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      setRoutesLoading(true);
      const [pickup, hosp] = await Promise.all([
        osrmRoute(SCENE.ambStart, SCENE.call),
        osrmRoute(SCENE.call, SCENE.hospital),
      ]);
      if (!alive) return;
      setRoutePickup(pickup);
      setRouteHosp(hosp);
      // pick intersections from the full mission (both legs combined)
      const fullRoute = [...pickup, ...hosp];
      const ints = sampleIntersections(fullRoute, 6);
      setIntersections(ints);
      const initLights = {};
      ints.forEach(i => initLights[i.id] = "red");
      setLightStates(initLights);
      setRoutesLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  // ── init map ───────────────────────────────────────────
  useEffect(() => {
    if (!window.L || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: true, scrollWheelZoom: true, attributionControl: true,
    }).setView(ALBUFEIRA, 14);

    const tileUrl = theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";
    const tileLabels = theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png";

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19, subdomains: "abcd",
    }).addTo(map);
    L.tileLayer(tileLabels, { maxZoom: 19, subdomains: "abcd", pane: "shadowPane" }).addTo(map);

    mapInstance.current = map;

    // hospital pin
    L.marker([SCENE.hospital.lat, SCENE.hospital.lng], {
      icon: L.divIcon({ className: "sf-icon", html: `<div class="sf-pin sf-pin-hosp">H</div>`, iconSize: [28,28], iconAnchor: [14,14] }),
    }).addTo(map).bindTooltip(SCENE.hospital.name, { direction: "top", offset: [0,-10] });

    // call pin
    L.marker([SCENE.call.lat, SCENE.call.lng], {
      icon: L.divIcon({ className: "sf-icon", html: `<div class="sf-pin sf-pin-call"><span class="sf-pulse"></span>!</div>`, iconSize: [28,28], iconAnchor: [14,14] }),
    }).addTo(map).bindTooltip(SCENE.call.name, { direction: "top", offset: [0,-10] });

    // ambulance origin marker (small, just a dot)
    L.marker([SCENE.ambStart.lat, SCENE.ambStart.lng], {
      icon: L.divIcon({ className: "sf-icon", html: `<div class="sf-pin sf-pin-base">B</div>`, iconSize: [20,20], iconAnchor: [10,10] }),
    }).addTo(map).bindTooltip(SCENE.ambStart.name, { direction: "top", offset: [0,-8] });

    // ambulance live marker
    ambMarkerRef.current = L.marker([SCENE.ambStart.lat, SCENE.ambStart.lng], {
      icon: L.divIcon({ className: "sf-icon", html: `<div class="sf-amb">🚑</div>`, iconSize: [32,32], iconAnchor: [16,16] }),
      zIndexOffset: 1000,
    }).addTo(map);

    map.fitBounds([
      [SCENE.ambStart.lat, SCENE.ambStart.lng],
      [SCENE.hospital.lat, SCENE.hospital.lng],
      [SCENE.call.lat, SCENE.call.lng],
    ], { padding: [60, 60] });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [theme]);

  // ── once intersections are computed, drop their markers ──
  useEffect(() => {
    if (!mapInstance.current || !intersections.length) return;
    // remove old
    Object.values(intMarkersRef.current).forEach(m => m.remove());
    intMarkersRef.current = {};

    intersections.forEach(int => {
      const m = L.marker([int.lat, int.lng], {
        icon: L.divIcon({
          className: "sf-icon",
          html: `<div class="sf-int sf-int-red" data-id="${int.id}"></div>`,
          iconSize: [16,16], iconAnchor: [8,8],
        }),
      }).addTo(mapInstance.current);
      intMarkersRef.current[int.id] = m;
    });

    // also draw the full mission route faint underneath
    if (routePickup && routeHosp) {
      const full = [...routePickup, ...routeHosp];
      L.polyline(full, { color: "#a78bfa", weight: 2, opacity: 0.25 }).addTo(mapInstance.current);
    }
  }, [intersections, routePickup, routeHosp]);

  // ── update light marker dom on state change ──────────────
  useEffect(() => {
    Object.entries(lightStates).forEach(([id, state]) => {
      const m = intMarkersRef.current[id];
      if (!m) return;
      const el = m.getElement();
      if (!el) return;
      const inner = el.querySelector(".sf-int");
      if (inner) {
        inner.classList.remove("sf-int-red", "sf-int-green");
        inner.classList.add(state === "green" ? "sf-int-green" : "sf-int-red");
      }
    });
  }, [lightStates]);

  // ── normal-cycle clock when Smart Flow OFF ───────────────
  useEffect(() => {
    if (!intersections.length) return;
    const cycle = setInterval(() => {
      if (smartFlow) return;
      setLightStates(prev => {
        const next = { ...prev };
        intersections.forEach((int, idx) => {
          const phase = Math.floor(Date.now() / 6000) + idx;
          next[int.id] = phase % 2 === 0 ? "green" : "red";
        });
        return next;
      });
    }, 500);
    return () => clearInterval(cycle);
  }, [smartFlow, intersections]);

  // ── sim tick ─────────────────────────────────────────────
  useEffect(() => {
    if (status === "idle" || status === "arrived" || status === "pickup") return;
    if (!routePickup || !routeHosp) return;

    const route = status === "dispatched" ? routePickup : routeHosp;
    const { total } = polylineLengths(route);
    const baseSpeed = total * 0.06; // covers full leg in ~16s

    let raf, last = performance.now();
    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      setProgress(prev => {
        const pos = posAlong(route, prev);

        if (smartFlow) {
          intersections.forEach(int => {
            const dx = int.lat - pos[0];
            const dy = int.lng - pos[1];
            const d = Math.hypot(dx, dy);
            if (d < PREEMPT_DIST * 1.4) {
              setLightStates(ls => {
                if (ls[int.id] === "green") return ls;
                setPreempted(p => p + 1);
                return { ...ls, [int.id]: "green" };
              });
            }
          });
        }

        let speed = baseSpeed;
        if (!smartFlow) {
          for (const int of intersections) {
            const dx = int.lat - pos[0];
            const dy = int.lng - pos[1];
            const d = Math.hypot(dx, dy);
            if (d < 0.0006 && lightStates[int.id] === "red") {
              speed = baseSpeed * 0.06;
              break;
            }
          }
        }

        const advance = (speed * dt) / total;
        const next = prev + advance;
        setTickMs(ms => ms + dt * 1000);

        if (next >= 1) {
          if (status === "dispatched") {
            setStatus("pickup");
            setTimeout(() => { setStatus("hospital"); setProgress(0); }, 1800);
            return 1;
          } else if (status === "hospital") {
            setStatus("arrived");
            return 1;
          }
        }
        return Math.min(next, 1);
      });

      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [status, smartFlow, lightStates, routePickup, routeHosp, intersections]);

  // ── move ambulance + active polyline ─────────────────────
  useEffect(() => {
    if (!ambMarkerRef.current || !routePickup || !routeHosp) return;
    let route;
    if (status === "dispatched" || status === "pickup") route = routePickup;
    else if (status === "hospital" || status === "arrived") route = routeHosp;
    else route = [[SCENE.ambStart.lat, SCENE.ambStart.lng]];

    ambMarkerRef.current.setLatLng(posAlong(route, progress));

    if (mapInstance.current) {
      if (polylineRef.current) mapInstance.current.removeLayer(polylineRef.current);
      if (status !== "idle" && route.length > 1) {
        polylineRef.current = L.polyline(route, {
          color: "#a78bfa", weight: 5, opacity: 0.9,
        }).addTo(mapInstance.current);
      }
    }
  }, [progress, status, routePickup, routeHosp]);

  function dispatch() {
    if (status !== "idle" && status !== "arrived") return;
    if (routesLoading) return;
    setStatus("dispatched");
    setProgress(0);
    setPreempted(0);
    setTickMs(0);
  }

  function reset() {
    setStatus("idle");
    setProgress(0);
    setPreempted(0);
    setTickMs(0);
    setLightStates(() => {
      const o = {};
      intersections.forEach(i => o[i.id] = "red");
      return o;
    });
    if (ambMarkerRef.current) {
      ambMarkerRef.current.setLatLng([SCENE.ambStart.lat, SCENE.ambStart.lng]);
    }
    if (polylineRef.current && mapInstance.current) {
      mapInstance.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
  }

  const savedSec = smartFlow ? Math.round(tickMs / 1000 * 0.55) : 0;
  const statusLabel = {
    idle: t.sim.status_idle,
    dispatched: t.sim.status_dispatched,
    pickup: t.sim.status_pickup,
    hospital: t.sim.status_hospital,
    arrived: t.sim.status_arrived,
  }[status];

  return (
    <div style={{
      position: "fixed", inset: 0,
      display: "grid",
      gridTemplateColumns: "360px 1fr",
      gridTemplateRows: "64px 1fr",
      background: "var(--bg)",
      overflow: "hidden",
    }}>
      {/* top bar spanning both columns */}
      <div style={{
        gridColumn: "1 / -1",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid var(--hairline)",
        background: "color-mix(in oklch, var(--bg) 92%, transparent)",
        zIndex: 20,
      }}>
        <a href="index.html" style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--fg-dim)", fontSize: 14 }}>
          <Logomark size={20}/>
          <span className="display" style={{ fontWeight: 600, color: "var(--fg)" }}>
            Smart<span style={{color:"var(--accent)"}}>Flow</span>
          </span>
          <span style={{ marginLeft: 16, color: "var(--fg-muted)", fontSize: 13 }}>{t.sim.back}</span>
        </a>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--fg-muted)" }}>
          {t.sim.title.toUpperCase()} · {t.sim.sub.toUpperCase()}
        </div>
      </div>

      {/* left panel */}
      <aside style={{
        gridColumn: "1", gridRow: "2",
        borderRight: "1px solid var(--hairline)",
        background: "var(--bg)",
        padding: 24,
        overflowY: "auto",
        display: "flex", flexDirection: "column", gap: 22,
      }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t.sim.panel_status}</div>
          <div className="display" style={{ fontSize: 26, fontWeight: 500, lineHeight: 1.15, display: "flex", alignItems: "center", gap: 10 }}>
            {routesLoading ? (t === window.SF_I18N.pt ? "A carregar rotas…" : "Loading routes…") : statusLabel}
            {status !== "idle" && status !== "arrived" && (
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", boxShadow: "0 0 12px var(--red)", animation: "sf-blink 1s infinite" }}/>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid var(--hairline)", borderRadius: 10, overflow: "hidden" }}>
          <Stat label={t.sim.panel_lights} value={preempted} mono/>
          <Stat label={t.sim.panel_saved} value={`${savedSec}s`} mono accent/>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{t.sim.smartflow}</div>
          <div style={{ display: "flex", gap: 6, padding: 4, border: "1px solid var(--hairline)", borderRadius: 999, background: "var(--bg-2)" }}>
            {[{ v: true, l: t.sim.on }, { v: false, l: t.sim.off }].map(o => (
              <button key={String(o.v)} onClick={() => setSmartFlow(o.v)}
                style={{
                  flex: 1, padding: "10px 12px", borderRadius: 999,
                  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
                  color: smartFlow === o.v ? "#fff" : "var(--fg-dim)",
                  background: smartFlow === o.v ? (o.v ? "var(--accent)" : "var(--red)") : "transparent",
                  transition: "background .2s, color .2s",
                }}>
                {o.l}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--fg-muted)", marginTop: 10, lineHeight: 1.5 }}>
            {smartFlow
              ? (t === window.SF_I18N.pt ? "Os semáforos abrem antes da chegada da ambulância." : "Lights pre-empt to green before the ambulance arrives.")
              : (t === window.SF_I18N.pt ? "A ambulância segue o ciclo normal e pára nos vermelhos." : "The ambulance obeys the normal cycle and stops at red lights.")}
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={dispatch}
            disabled={(status !== "idle" && status !== "arrived") || routesLoading}
            className="btn btn-primary"
            style={{
              flex: 1, justifyContent: "center",
              opacity: ((status !== "idle" && status !== "arrived") || routesLoading) ? 0.5 : 1,
              cursor: ((status !== "idle" && status !== "arrived") || routesLoading) ? "not-allowed" : "pointer",
            }}>
            {t.sim.dispatch} →
          </button>
          <button onClick={reset} className="btn btn-ghost" style={{ padding: "12px 14px" }}>↺</button>
        </div>

        <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="eyebrow">{t === window.SF_I18N.pt ? "Legenda" : "Legend"}</div>
          <LegendRow color="var(--cyan)" label={t.sim.legend_hosp}/>
          <LegendRow color="var(--red)" label={t.sim.legend_call}/>
          <LegendRow color="var(--accent)" label={t.sim.legend_amb}/>
          <LegendRow color="var(--green)" label={t.sim.legend_int}/>
        </div>

        <div style={{ marginTop: "auto", fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.5 }}>
          {t === window.SF_I18N.pt
            ? "Rota calculada via OSRM/OpenStreetMap. Os tempos exibidos são ilustrativos."
            : "Route via OSRM/OpenStreetMap. Times shown are illustrative."}
        </div>
      </aside>

      {/* map */}
      <div style={{ gridColumn: "2", gridRow: "2", position: "relative" }}>
        <div ref={mapRef} style={{ position: "absolute", inset: 0 }}/>
      </div>

      <style>{`
        html, body { overflow: hidden !important; }
        @keyframes sf-blink { 0%,100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes sf-pulse-ring {
          0% { transform: scale(1); opacity: .8 }
          100% { transform: scale(2.6); opacity: 0 }
        }
        .sf-icon { background: transparent; border: 0; }
        .sf-pin { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
          color: #fff; font-family: var(--font-display); font-weight: 600; font-size: 14px;
          border: 2px solid var(--bg); box-shadow: 0 0 0 1px var(--hairline-2), 0 6px 14px rgba(0,0,0,.4);
          position: relative; }
        .sf-pin-hosp { background: var(--cyan); color: #0c1d24; }
        .sf-pin-call { background: var(--red); }
        .sf-pin-base { background: var(--accent-soft); color: #fff; width: 20px; height: 20px; font-size: 10px; }
        .sf-pulse { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid var(--red);
          animation: sf-pulse-ring 1.4s ease-out infinite; pointer-events: none; }
        .sf-int { width: 16px; height: 16px; border-radius: 50%; border: 2px solid var(--bg);
          box-shadow: 0 0 0 1px var(--hairline-2);
          transition: background .25s ease, box-shadow .25s ease; }
        .sf-int-red { background: var(--red); box-shadow: 0 0 0 1px var(--hairline-2), 0 0 10px var(--red); }
        .sf-int-green { background: var(--green); box-shadow: 0 0 0 1px var(--hairline-2), 0 0 14px var(--green); }
        .sf-amb { font-size: 26px; line-height: 1; filter: drop-shadow(0 4px 8px rgba(0,0,0,.5));
          animation: sf-amb-pulse 0.6s ease-in-out infinite alternate; }
        @keyframes sf-amb-pulse { from { transform: scale(1) } to { transform: scale(1.08) } }
        .leaflet-container { background: var(--bg) !important; font-family: var(--font-body); }
        .leaflet-tooltip { background: var(--surface); color: var(--fg); border: 1px solid var(--hairline); border-radius: 8px;
          padding: 6px 10px; font-size: 12px; box-shadow: 0 6px 18px rgba(0,0,0,.3); font-family: var(--font-mono); letter-spacing: 0.04em; }
        .leaflet-tooltip-top:before { border-top-color: var(--hairline) !important; }
        .leaflet-control-zoom a { background: var(--surface); color: var(--fg); border-color: var(--hairline) !important; }
        .leaflet-control-zoom a:hover { background: var(--surface-2); }
        .leaflet-control-attribution { background: color-mix(in oklch, var(--bg) 80%, transparent) !important;
          color: var(--fg-muted) !important; font-size: 10px !important; }
        .leaflet-control-attribution a { color: var(--fg-dim) !important; }
        @media (max-width: 880px) {
          aside { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Stat({ label, value, mono, accent }) {
  return (
    <div style={{ padding: "14px 16px", background: "var(--bg)", borderRight: "1px solid var(--hairline)" }}>
      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--fg-muted)", textTransform: "uppercase" }}>
        {label}
      </div>
      <div className={mono ? "mono" : "display"} style={{ fontSize: 24, marginTop: 4, color: accent ? "var(--accent)" : "var(--fg)", fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function LegendRow({ color, label }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "var(--fg-dim)" }}>
      <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }}/>
      {label}
    </div>
  );
}

window.Simulator = Simulator;
