const { useEffect, useMemo, useRef, useState } = React;

const STATUS_META = {
  idle: { label: "Operacional", tone: "ok" },
  priority: { label: "Prioridade", tone: "priority" },
  offline: { label: "Offline", tone: "crit" },
};

function Icon({ name, size = 18 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    map: <><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></>,
    events: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.82V22a2 2 0 0 1-4 0v-.18A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.82-.33H2a2 2 0 0 1 0-4h.18A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 6.96 3.3l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.82V2a2 2 0 0 1 4 0v.18A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06A2 2 0 1 1 19.7 6.96l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.14.69.35 1 .6.3.25.66.36 1.05.33H22a2 2 0 0 1 0 4h-.18A1.65 1.65 0 0 0 19.4 15z"/></>,
    camera: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>,
    alert: <><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function apiGet(path, signal) {
  const token = AUTH.getToken();

  return fetch(path, {
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.status === 401) {
      AUTH.logout();
      throw new Error("Sessão expirada");
    }

    if (!res.ok) {
      throw new Error(`Erro ao carregar ${path}`);
    }

    const json = await res.json();
    return json.data ?? json;
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getStatusMeta(status) {
  return STATUS_META[status] ?? { label: status || "Sem estado", tone: "muted" };
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes)) return "Sem dados";
  if (minutes < 1) return "<1 min";

  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;

  if (!hours) return `${mins} min`;
  if (!mins) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

function shortId(id) {
  return id ? id.slice(0, 8).toUpperCase() : "-";
}

function eventStatus(event) {
  return event.resolvedAt ? { label: "Resolvido", klass: "ok" } : { label: "Ativo", klass: "crit" };
}

function triggeredByLabel(value) {
  if (value === "manual") return "Manual";
  if (value === "camera") return "Câmara";
  return value || "-";
}

function matchesSearch(values, search) {
  if (!search.trim()) return true;
  const term = search.trim().toLowerCase();
  return values.some((value) => String(value ?? "").toLowerCase().includes(term));
}

function StatCard({ label, value, meta, tone = "accent", icon = "activity" }) {
  return (
    <div className={`sf-dash-stat ${tone}`}>
      <div className="sf-stat-top">
        <span className={`sf-stat-icon ${tone}`}><Icon name={icon} /></span>
        <span className="sf-stat-meta">{meta}</span>
      </div>
      <strong>{value}</strong>
      <p>{label}</p>
    </div>
  );
}

function LoadingBlock({ label }) {
  return (
    <div className="sf-empty-state">
      <span className="sf-spinner" />
      <p>{label}</p>
    </div>
  );
}

function MonitoringMap({ intersections, loading, onSelect }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!mapNodeRef.current || !window.L || mapRef.current) return;

    const map = window.L.map(mapNodeRef.current, {
      zoomControl: false,
      scrollWheelZoom: true,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    window.L.control.zoom({ position: "bottomright" }).addTo(map);
    layerRef.current = window.L.layerGroup().addTo(map);
    mapRef.current = map;

    setTimeout(() => map.invalidateSize(), 80);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer || !window.L) return;

    layer.clearLayers();

    const validIntersections = intersections
      .map((item) => ({ ...item, latNum: asNumber(item.lat), lngNum: asNumber(item.lng) }))
      .filter((item) => item.latNum !== null && item.lngNum !== null);

    if (validIntersections.length === 0) {
      map.setView([37.1, -8.25], 9);
      return;
    }

    const bounds = [];

    validIntersections.forEach((item) => {
      const meta = getStatusMeta(item.status);
      const marker = window.L.marker([item.latNum, item.lngNum], {
        icon: window.L.divIcon({
          className: "sf-map-marker-shell",
          html: `<span class="sf-map-marker ${meta.tone}"><span></span></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -16],
        }),
      });

      marker.bindPopup(`
        <div class="sf-map-popup">
          <strong>${escapeHtml(item.name)}</strong>
          <span class="sf-popup-status ${meta.tone}">${escapeHtml(meta.label)}</span>
          <p>${escapeHtml(item.address)}</p>
        </div>
      `);
      marker.on("click", () => onSelect(item.id));
      marker.addTo(layer);
      bounds.push([item.latNum, item.lngNum]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 15);
    } else {
      map.fitBounds(bounds, { padding: [42, 42], maxZoom: 15 });
    }
  }, [intersections, onSelect]);

  return (
    <div className="sf-leaflet-wrap">
      <div ref={mapNodeRef} className="sf-leaflet" />
      {loading && <LoadingBlock label="A carregar mapa..." />}
      {!loading && !window.L && (
        <div className="sf-empty-state">
          <p>Leaflet não carregou. Verifica a ligação ao CDN.</p>
        </div>
      )}
      {!loading && intersections.length === 0 && (
        <div className="sf-empty-state">
          <p>Sem interseções para mostrar no mapa.</p>
        </div>
      )}
    </div>
  );
}

function DashboardPage() {
  const [theme, setTheme] = useTheme();
  const [user, setUser] = useState(null);
  const [intersections, setIntersections] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIntersectionId, setSelectedIntersectionId] = useState(null);

  useEffect(() => {
    AUTH.requireAuth();
    if (!AUTH.getToken()) return;

    setUser(AUTH.getUser());
    const controller = new AbortController();

    Promise.all([
      apiGet("/api/intersections", controller.signal),
      apiGet("/api/events", controller.signal),
    ])
      .then(([apiIntersections, apiEvents]) => {
        setIntersections(Array.isArray(apiIntersections) ? apiIntersections : []);
        setEvents(Array.isArray(apiEvents) ? apiEvents : []);
        setError("");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Erro ao carregar dashboard");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    const activeEvents = events.filter((item) => !item.resolvedAt).length;
    const resolvedDurations = events
      .filter((item) => item.resolvedAt && item.detectedAt)
      .map((item) => (new Date(item.resolvedAt) - new Date(item.detectedAt)) / 60000)
      .filter(Number.isFinite);

    const avgResponse = resolvedDurations.length
      ? resolvedDurations.reduce((sum, value) => sum + value, 0) / resolvedDurations.length
      : NaN;

    return {
      total: intersections.length,
      priority: intersections.filter((item) => item.status === "priority").length,
      offline: intersections.filter((item) => item.status === "offline").length,
      activeEvents,
      avgResponse: formatDuration(avgResponse),
    };
  }, [intersections, events]);

  const filteredIntersections = useMemo(() => {
    return intersections.filter((item) => matchesSearch([item.id, item.name, item.address, item.status], search));
  }, [intersections, search]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((item) => matchesSearch([
        item.id,
        item.triggeredBy,
        item.intersection?.name,
        item.intersection?.address,
        item.intersectionId,
      ], search))
      .slice(0, 8);
  }, [events, search]);

  const selectedIntersection = useMemo(() => {
    return intersections.find((item) => item.id === selectedIntersectionId) || filteredIntersections[0] || null;
  }, [intersections, filteredIntersections, selectedIntersectionId]);

  const criticalText = stats.priority > 0
    ? `${stats.priority} prioridade ativa`
    : stats.offline > 0
      ? `${stats.offline} offline`
      : "Rede estável";

  return (
    <>
      <style>{`
        body {
          background:
            radial-gradient(circle at 18% -12%, color-mix(in oklch, var(--accent) 26%, transparent), transparent 30%),
            radial-gradient(circle at 90% 4%, color-mix(in oklch, var(--cyan) 18%, transparent), transparent 28%),
            linear-gradient(135deg, color-mix(in oklch, var(--bg) 92%, #000), var(--bg));
        }

        .sf-dashboard {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 276px minmax(0, 1fr);
        }

        .sf-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          padding: 24px 18px;
          border-right: 1px solid var(--hairline);
          background: color-mix(in oklch, var(--bg-2) 88%, transparent);
          backdrop-filter: blur(18px);
        }

        .sf-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .sf-brand h1 { margin: 0; font-size: 18px; font-weight: 600; }
        .sf-brand p { margin: -3px 0 0; font-size: 12px; color: var(--fg-muted); }

        .sf-side-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 14px;
          margin-bottom: 7px;
          border-radius: var(--radius-sm);
          color: var(--fg-dim);
          font-size: 14px;
          transition: .18s ease;
        }

        .sf-side-link:hover,
        .sf-side-link.active {
          color: var(--fg);
          background: color-mix(in oklch, var(--accent) 22%, transparent);
        }

        .sf-side-footer {
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: 20px;
          padding: 14px;
          border: 1px solid var(--hairline);
          border-radius: var(--radius);
          background: linear-gradient(145deg, color-mix(in oklch, var(--surface) 92%, transparent), color-mix(in oklch, var(--surface-2) 70%, transparent));
          color: var(--fg-dim);
          font-size: 12px;
        }

        .sf-main {
          padding: 26px clamp(18px, 3vw, 38px) 36px;
        }

        .sf-topbar {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 24px;
        }

        .sf-search {
          flex: 1;
          max-width: 560px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          border: 1px solid var(--hairline);
          border-radius: 999px;
          background: color-mix(in oklch, var(--surface) 72%, transparent);
          color: var(--fg-muted);
          box-shadow: inset 0 1px 0 color-mix(in oklch, #fff 8%, transparent);
        }

        .sf-search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: var(--fg);
          background: transparent;
          font: inherit;
        }

        .sf-search input::placeholder { color: var(--fg-muted); }

        .sf-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sf-avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: white;
          font-weight: 700;
          background: linear-gradient(135deg, var(--accent), var(--cyan));
          box-shadow: 0 14px 30px -18px var(--cyan);
        }

        .sf-hero {
          position: relative;
          overflow: hidden;
          padding: clamp(24px, 4vw, 38px);
          border: 1px solid var(--hairline);
          border-radius: 28px;
          background:
            linear-gradient(120deg, color-mix(in oklch, var(--surface-2) 84%, transparent), color-mix(in oklch, var(--surface) 78%, transparent)),
            radial-gradient(circle at 80% 10%, color-mix(in oklch, var(--accent) 24%, transparent), transparent 34%);
          box-shadow: 0 30px 90px -50px rgba(0,0,0,.72);
        }

        .sf-hero::after {
          content: "";
          position: absolute;
          inset: auto -8% -44% 44%;
          height: 260px;
          background: radial-gradient(circle, color-mix(in oklch, var(--cyan) 22%, transparent), transparent 64%);
          pointer-events: none;
        }

        .sf-hero-head {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        .sf-hero h2 {
          max-width: 720px;
          margin: 12px 0 10px;
          font-size: clamp(32px, 4vw, 56px);
        }

        .sf-hero p {
          max-width: 650px;
          margin: 0;
          color: var(--fg-dim);
        }

        .sf-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .sf-dash-stat {
          min-height: 154px;
          padding: 18px;
          border: 1px solid color-mix(in oklch, var(--hairline) 85%, transparent);
          border-radius: 18px;
          background: color-mix(in oklch, var(--bg-2) 72%, transparent);
          backdrop-filter: blur(12px);
        }

        .sf-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sf-stat-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: white;
          background: var(--accent);
        }

        .sf-stat-icon.green { background: var(--green); }
        .sf-stat-icon.red { background: var(--red); }
        .sf-stat-icon.amber { background: var(--amber); color: #17120a; }

        .sf-stat-meta {
          color: var(--fg-muted);
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .sf-dash-stat strong {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(30px, 3vw, 42px);
          line-height: 1;
        }

        .sf-dash-stat p {
          margin: 8px 0 0;
          color: var(--fg-dim);
          font-size: 13px;
        }

        .sf-panel {
          margin-top: 20px;
          border: 1px solid var(--hairline);
          border-radius: 24px;
          background: color-mix(in oklch, var(--bg-2) 86%, transparent);
          box-shadow: 0 24px 70px -42px rgba(0,0,0,.7);
          overflow: hidden;
        }

        .sf-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 22px 24px;
          border-bottom: 1px solid var(--hairline);
        }

        .sf-panel-head h2 {
          margin: 0;
          font-size: 22px;
        }

        .sf-panel-head p {
          margin: 6px 0 0;
          color: var(--fg-muted);
          font-size: 13px;
        }

        .sf-map-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 310px;
          gap: 18px;
          padding: 18px;
        }

        .sf-leaflet-wrap {
          position: relative;
          min-height: 520px;
          border: 1px solid var(--hairline);
          border-radius: 20px;
          overflow: hidden;
          background: var(--surface);
        }

        .sf-leaflet {
          position: absolute;
          inset: 0;
          min-height: 520px;
          z-index: 1;
        }

        html[data-theme="dark"] .sf-leaflet .leaflet-tile {
          filter: saturate(.72) brightness(.68) contrast(1.08);
        }

        .sf-leaflet .leaflet-control-attribution {
          color: var(--fg-muted);
          background: color-mix(in oklch, var(--bg-2) 82%, transparent);
        }

        .sf-leaflet .leaflet-control-zoom a {
          color: var(--fg);
          background: color-mix(in oklch, var(--bg-2) 88%, transparent);
          border-color: var(--hairline);
        }

        .sf-map-marker-shell { background: transparent; border: 0; }

        .sf-map-marker {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: 3px solid rgba(255,255,255,.88);
          background: var(--accent);
          box-shadow: 0 15px 32px rgba(0,0,0,.36);
        }

        .sf-map-marker span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #fff;
        }

        .sf-map-marker.priority { background: var(--green); animation: sf-pulse 1.45s infinite; }
        .sf-map-marker.crit { background: var(--red); }
        .sf-map-marker.ok { background: var(--accent); }
        .sf-map-marker.muted { background: var(--fg-muted); }

        @keyframes sf-pulse {
          0% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--green) 52%, transparent), 0 15px 32px rgba(0,0,0,.36); }
          70% { box-shadow: 0 0 0 16px color-mix(in oklch, var(--green) 0%, transparent), 0 15px 32px rgba(0,0,0,.36); }
          100% { box-shadow: 0 0 0 0 color-mix(in oklch, var(--green) 0%, transparent), 0 15px 32px rgba(0,0,0,.36); }
        }

        .sf-map-popup strong {
          display: block;
          margin-bottom: 6px;
          color: #111827;
          font-size: 14px;
        }

        .sf-map-popup p {
          margin: 8px 0 0;
          color: #4b5563;
          font-size: 12px;
        }

        .sf-popup-status {
          display: inline-flex;
          padding: 3px 8px;
          border-radius: 999px;
          color: #fff;
          background: #6d28d9;
          font-size: 11px;
        }

        .sf-popup-status.priority { background: #16a34a; }
        .sf-popup-status.crit { background: #dc2626; }

        .sf-map-rail {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sf-rail-card {
          padding: 18px;
          border: 1px solid var(--hairline);
          border-radius: 18px;
          background: var(--surface);
        }

        .sf-rail-card h3 {
          margin: 0 0 10px;
          font-size: 16px;
        }

        .sf-rail-card p {
          margin: 0;
          color: var(--fg-dim);
          font-size: 13px;
        }

        .sf-rail-list {
          display: grid;
          gap: 10px;
          margin-top: 14px;
        }

        .sf-rail-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: var(--fg-dim);
          font-size: 13px;
        }

        .sf-rail-row b { color: var(--fg); }

        .sf-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          color: var(--accent);
          background: color-mix(in oklch, var(--accent) 16%, transparent);
          white-space: nowrap;
        }

        .sf-status::before {
          content: "";
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .sf-status.ok { color: var(--green); background: color-mix(in oklch, var(--green) 16%, transparent); }
        .sf-status.priority { color: var(--green); background: color-mix(in oklch, var(--green) 16%, transparent); }
        .sf-status.crit { color: var(--red); background: color-mix(in oklch, var(--red) 16%, transparent); }
        .sf-status.muted { color: var(--fg-muted); background: color-mix(in oklch, var(--fg-muted) 14%, transparent); }

        .sf-table-wrap {
          padding: 0 18px 18px;
          overflow-x: auto;
        }

        .sf-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .sf-table th {
          text-align: left;
          padding: 13px 12px;
          color: var(--fg-muted);
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .1em;
          border-bottom: 1px solid var(--hairline);
        }

        .sf-table td {
          padding: 15px 12px;
          border-bottom: 1px solid var(--hairline);
          color: var(--fg-dim);
          vertical-align: top;
        }

        .sf-table strong { color: var(--fg); }

        .sf-muted { color: var(--fg-muted); }

        .sf-empty-state {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: grid;
          place-items: center;
          padding: 24px;
          text-align: center;
          color: var(--fg-dim);
          background: color-mix(in oklch, var(--bg-2) 78%, transparent);
          backdrop-filter: blur(8px);
        }

        .sf-table-empty {
          padding: 28px 12px;
          text-align: center;
          color: var(--fg-muted);
        }

        .sf-spinner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid color-mix(in oklch, var(--fg) 16%, transparent);
          border-top-color: var(--accent);
          animation: sf-spin .8s linear infinite;
        }

        @keyframes sf-spin { to { transform: rotate(360deg); } }

        .sf-error {
          margin-bottom: 18px;
          padding: 12px 14px;
          border: 1px solid color-mix(in oklch, var(--red) 38%, transparent);
          border-radius: var(--radius);
          color: var(--red);
          background: color-mix(in oklch, var(--red) 12%, transparent);
        }

        @media (max-width: 1120px) {
          .sf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .sf-map-grid { grid-template-columns: 1fr; }
          .sf-map-rail { grid-template-columns: repeat(2, minmax(0, 1fr)); display: grid; }
        }

        @media (max-width: 900px) {
          .sf-dashboard { grid-template-columns: 1fr; }
          .sf-sidebar {
            position: relative;
            height: auto;
            border-right: 0;
            border-bottom: 1px solid var(--hairline);
          }
          .sf-side-footer { position: static; margin-top: 18px; }
        }

        @media (max-width: 720px) {
          .sf-main { padding-inline: 14px; }
          .sf-topbar { align-items: stretch; flex-direction: column; }
          .sf-search { max-width: none; }
          .sf-user { justify-content: space-between; }
          .sf-hero-head, .sf-panel-head { align-items: flex-start; flex-direction: column; }
          .sf-grid, .sf-map-rail { grid-template-columns: 1fr; }
          .sf-leaflet-wrap, .sf-leaflet { min-height: 420px; }
          .sf-table { min-width: 760px; }
        }
      `}</style>

      <div className="sf-dashboard">
        <aside className="sf-sidebar">
          <a className="sf-brand" href="index.html">
            <Logomark size={34} />
            <div>
              <h1 className="display">Smart<span style={{ color: "var(--accent)" }}>Flow</span></h1>
              <p>Monitorização urbana 24h</p>
            </div>
          </a>

          <button className="sf-side-link active"><Icon name="dashboard" /> Dashboard</button>
          <button className="sf-side-link"><Icon name="map" /> Interseções</button>
          <button className="sf-side-link"><Icon name="events" /> Eventos</button>
          <button className="sf-side-link"><Icon name="settings" /> Configurações</button>
          <button className="sf-side-link" onClick={() => AUTH.logout()}><Icon name="logout" /> Terminar sessão</button>

          <div className="sf-side-footer">
            <span className={`sf-status ${stats.offline ? "crit" : "ok"}`}>
              {stats.offline ? "Atenção necessária" : "Sistema online"}
            </span>
            <br />
            <span style={{ display: "block", color: "var(--fg-muted)", marginTop: 10 }}>
              {stats.total} interseções carregadas da API
            </span>
          </div>
        </aside>

        <main className="sf-main">
          <div className="sf-topbar">
            <label className="sf-search">
              <Icon name="search" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar interseções, eventos ou localizações..."
              />
            </label>

            <div className="sf-user">
              <button
                className="sf-side-link"
                style={{ margin: 0, width: "auto" }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "Modo claro" : "Modo escuro"}
              </button>
              <div className="sf-avatar">
                {(user?.name || user?.email || "T").charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {error && <div className="sf-error">{error}</div>}

          <section className="sf-hero">
            <div className="sf-hero-head">
              <div>
                <span className={`tag ${stats.priority || stats.offline ? "urgent" : ""}`}>
                  <span className="dot" /> Centro operacional
                </span>
                <h2 className="display">Visão real da rede semafórica do município</h2>
                <p>Dados carregados diretamente da API: interseções, prioridades ativas e histórico recente de deteções.</p>
              </div>
              <span className={`sf-status ${stats.priority ? "priority" : stats.offline ? "crit" : "ok"}`}>{criticalText}</span>
            </div>

            <div className="sf-grid">
              <StatCard label="Interseções monitorizadas" value={loading ? "..." : stats.total} meta="API" tone="accent" icon="map" />
              <StatCard label="Prioridades em curso" value={loading ? "..." : stats.priority} meta="Agora" tone="green" icon="alert" />
              <StatCard label="Eventos ativos" value={loading ? "..." : stats.activeEvents} meta="Não resolvidos" tone="amber" icon="events" />
              <StatCard label="Resposta média" value={loading ? "..." : stats.avgResponse} meta="Eventos resolvidos" tone="red" icon="clock" />
            </div>
          </section>

          <section className="sf-panel">
            <div className="sf-panel-head">
              <div>
                <h2 className="display">Mapa de monitorização</h2>
                <p>Leaflet + OpenStreetMap com coordenadas reais das interseções da API.</p>
              </div>
              <span className="tag"><span className="dot" /> {filteredIntersections.length} no mapa</span>
            </div>

            <div className="sf-map-grid">
              <MonitoringMap intersections={filteredIntersections} loading={loading} onSelect={setSelectedIntersectionId} />

              <aside className="sf-map-rail">
                <div className="sf-rail-card">
                  <h3>Interseção selecionada</h3>
                  {selectedIntersection ? (
                    <>
                      <p><strong style={{ color: "var(--fg)" }}>{selectedIntersection.name}</strong></p>
                      <p style={{ marginTop: 8 }}>{selectedIntersection.address}</p>
                      <div className="sf-rail-list">
                        <div className="sf-rail-row"><span>Estado</span><span className={`sf-status ${getStatusMeta(selectedIntersection.status).tone}`}>{getStatusMeta(selectedIntersection.status).label}</span></div>
                        <div className="sf-rail-row"><span>Latitude</span><b>{asNumber(selectedIntersection.lat)?.toFixed(5) ?? "-"}</b></div>
                        <div className="sf-rail-row"><span>Longitude</span><b>{asNumber(selectedIntersection.lng)?.toFixed(5) ?? "-"}</b></div>
                      </div>
                    </>
                  ) : (
                    <p>Seleciona um marcador no mapa para ver detalhes.</p>
                  )}
                </div>

                <div className="sf-rail-card">
                  <h3>Estado da rede</h3>
                  <div className="sf-rail-list">
                    <div className="sf-rail-row"><span>Operacionais</span><b>{intersections.filter((item) => item.status === "idle").length}</b></div>
                    <div className="sf-rail-row"><span>Prioridade</span><b>{stats.priority}</b></div>
                    <div className="sf-rail-row"><span>Offline</span><b>{stats.offline}</b></div>
                    <div className="sf-rail-row"><span>Eventos totais</span><b>{events.length}</b></div>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="sf-panel">
            <div className="sf-panel-head">
              <div>
                <h2 className="display">Eventos recentes</h2>
                <p>Histórico devolvido por `/api/events`, sem dados mock.</p>
              </div>
              <span className="tag"><span className="dot" /> {filteredEvents.length} visíveis</span>
            </div>

            <div className="sf-table-wrap">
              <table className="sf-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Origem</th>
                    <th>Interseção</th>
                    <th>Localização</th>
                    <th>Detetado</th>
                    <th>Duração</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan="7"><div className="sf-table-empty">A carregar eventos...</div></td></tr>
                  )}
                  {!loading && filteredEvents.length === 0 && (
                    <tr><td colSpan="7"><div className="sf-table-empty">Sem eventos para mostrar.</div></td></tr>
                  )}
                  {!loading && filteredEvents.map((event) => {
                    const status = eventStatus(event);

                    return (
                      <tr key={event.id}>
                        <td><strong>{shortId(event.id)}</strong></td>
                        <td>{triggeredByLabel(event.triggeredBy)}</td>
                        <td>{event.intersection?.name || event.intersectionId || "-"}</td>
                        <td className="sf-muted">{event.intersection?.address || "-"}</td>
                        <td>{formatDateTime(event.detectedAt)}</td>
                        <td>{event.greenDurationS ? `${event.greenDurationS}s` : "-"}</td>
                        <td><span className={`sf-status ${status.klass}`}>{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<DashboardPage />);
