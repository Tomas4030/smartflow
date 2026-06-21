import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function createTrafficIcon(status, phase) {
  const colors = {
    idle: "#4ade80",
    priority: "#ef4444",
    offline: "#6b7280",
    pending: "#f59e0b",
  };
  const base = colors[status] || colors.offline;

  let red = "rgba(100,100,100,0.3)",
    amber = "rgba(100,100,100,0.3)",
    green = "rgba(100,100,100,0.3)";
  if (status === "priority") {
    green = "#4ade80";
  } else if (status === "offline" || status === "pending") {
    // all off
  } else if (status === "idle") {
    if (phase === 0) red = "#ef4444";
    else if (phase === 1) amber = "#f59e0b";
    else green = "#4ade80";
  }

  const glow =
    status === "priority"
      ? `<circle cx="20" cy="20" r="18" fill="none" stroke="${base}" stroke-width="2" opacity="0.6"><animate attributeName="r" from="18" to="28" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" from="0.6" to="0" dur="1.2s" repeatCount="indefinite"/></circle>`
      : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    ${glow}
    <rect x="13" y="4" width="14" height="32" rx="4" fill="#1a1a2e" stroke="${base}" stroke-width="1.5"/>
    <circle cx="20" cy="12" r="4" fill="${red}"/>
    <circle cx="20" cy="20" r="4" fill="${amber}"/>
    <circle cx="20" cy="28" r="4" fill="${green}"/>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: "sf-traffic-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -24],
  });
}

function FitBounds({ intersections }) {
  const map = useMap();
  useEffect(() => {
    if (intersections.length === 0) return;
    const bounds = L.latLngBounds(
      intersections.map((i) => [Number(i.lat), Number(i.lng)]),
    );
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [intersections, map]);
  return null;
}

export function MonitoringMap({ intersections }) {
  const [phase, setPhase] = useState(0);
  const [priorityId, setPriorityId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 3), 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (intersections.length === 0) return;
    const simulate = () => {
      const idx = Math.floor(Math.random() * intersections.length);
      setPriorityId(intersections[idx].id);
      setTimeout(() => setPriorityId(null), 8000);
    };
    const timer = setInterval(simulate, 15000);
    const initial = setTimeout(simulate, 5000);
    return () => { clearInterval(timer); clearTimeout(initial); };
  }, [intersections]);

  if (intersections.length === 0) {
    return (
      <div
        style={{
          height: 500,
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--hairline)",
        }}
      >
        <div style={{ textAlign: "center", color: "var(--fg-muted)" }}>
          <div style={{ fontSize: 14 }}>Nenhuma interseção registada</div>
          <div className="mono" style={{ fontSize: 11, marginTop: 8 }}>
            Adicione interseções ao seu município
          </div>
        </div>
      </div>
    );
  }

  const center = [
    intersections.reduce((s, i) => s + Number(i.lat), 0) / intersections.length,
    intersections.reduce((s, i) => s + Number(i.lng), 0) / intersections.length,
  ];

  return (
    <div
      style={{
        height: 500,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        border: "1px solid var(--hairline)",
      }}
    >
      <MapContainer
        center={center}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds intersections={intersections} />
        {intersections.map((inter, idx) => {
          const simStatus = inter.id === priorityId ? "priority" : inter.status;
          const localPhase = (phase + idx) % 3;
          return (
          <Marker
            key={inter.id}
            position={[Number(inter.lat), Number(inter.lng)]}
            icon={createTrafficIcon(simStatus, localPhase)}
          >
            <Popup>
              <div style={{ fontFamily: "var(--font-body)", minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {inter.name}
                </div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                  {inter.address}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 8px",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 500,
                    background:
                      simStatus === "idle"
                        ? "#dcfce7"
                        : simStatus === "priority"
                          ? "#fee2e2"
                          : simStatus === "pending"
                            ? "#fef3c7"
                            : "#f3f4f6",
                    color:
                      simStatus === "idle"
                        ? "#166534"
                        : simStatus === "priority"
                          ? "#991b1b"
                          : simStatus === "pending"
                            ? "#92400e"
                            : "#374151",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background:
                        simStatus === "idle"
                          ? "#4ade80"
                          : simStatus === "priority"
                            ? "#ef4444"
                            : simStatus === "pending"
                              ? "#f59e0b"
                              : "#6b7280",
                    }}
                  />
                  {simStatus === "idle"
                    ? "Ativo"
                    : simStatus === "priority"
                      ? "Prioridade"
                      : simStatus === "pending"
                        ? "Pendente"
                        : "Offline"}
                </div>
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
