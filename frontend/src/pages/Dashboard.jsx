import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH } from "../auth";
import {
  Sidebar,
  StatCards,
  MonitoringMap,
  EventsTable,
} from "../components/dashboard";

function DashboardContent({ intersections, events, municipality }) {
  return (
    <div style={{ padding: "0 28px 40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 0 18px",
        }}
      >
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>
            Município de {municipality}
          </div>
          <h1
            className="display"
            style={{ fontSize: 26, fontWeight: 500, margin: 0 }}
          >
            Visão Geral
          </h1>
        </div>
      </div>

      <StatCards intersections={intersections} events={events} />

      <div
        style={{
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
          marginBottom: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span className="display" style={{ fontSize: 16, fontWeight: 500 }}>
            Mapa de Monitoramento
          </span>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <MonitoringMap intersections={intersections} />
        </div>
      </div>

      <div
        style={{
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius-lg)",
          background: "var(--surface)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <span className="display" style={{ fontSize: 16, fontWeight: 500 }}>
            Eventos & Deteções Recentes
          </span>
          <span
            className="mono"
            style={{
              fontSize: 11,
              color: "var(--accent)",
              letterSpacing: "0.06em",
            }}
          >
            Ver todos →
          </span>
        </div>
        <EventsTable events={events} />
      </div>
    </div>
  );
}

function StubPage({ title, eyebrow }) {
  return (
    <div
      style={{
        padding: "60px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        textAlign: "center",
      }}
    >
      <div className="eyebrow">{eyebrow}</div>
      <h2
        className="display"
        style={{ fontSize: 36, fontWeight: 500, margin: 0, color: "var(--fg)" }}
      >
        {title}
      </h2>
      <p
        style={{
          color: "var(--fg-muted)",
          maxWidth: 420,
          lineHeight: 1.55,
          fontSize: 15,
        }}
      >
        Esta secção está em desenvolvimento.
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");
  const [intersections, setIntersections] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = AUTH.getUser();
  const municipality = user?.municipality || "Município";

  const fetchData = useCallback(async () => {
    const token = AUTH.getToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const [intRes, evRes] = await Promise.all([
        fetch("/api/intersections", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/events", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (intRes.status === 401 || evRes.status === 401) {
        AUTH.logout();
        navigate("/login");
        return;
      }
      if (intRes.ok) {
        const json = await intRes.json();
        setIntersections(json.data || []);
      }
      if (evRes.ok) {
        const json = await evRes.json();
        const raw = json.data || json || [];
        const enriched = raw.map((e) => {
          let _status;
          if (e.resolvedAt) _status = "resolvido";
          else if (e.triggeredBy === "manual") _status = "analise";
          else _status = "ativo";
          return { ...e, _status };
        });
        const unresolved = enriched.filter((e) => !e.resolvedAt);
        if (unresolved.length > 1)
          unresolved[unresolved.length - 1]._status = "alerta";
        setEvents(enriched);
      }
    } catch (e) {
      /* silent */
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!AUTH.getToken()) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate, fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes db-blink { 0%,100%{opacity:1}50%{opacity:.3} }
        .sf-traffic-marker { background: none !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 8px 24px -6px rgba(0,0,0,.3); }
        .leaflet-popup-content { margin: 12px 14px; }
      `}</style>
      <Sidebar
        active={activePage}
        onNav={setActivePage}
        onLogout={() => {
          AUTH.logout();
          navigate("/login");
        }}
        municipality={municipality}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        
        <main style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <div
              style={{ display: "grid", placeItems: "center", height: "100%" }}
            >
              <div className="mono" style={{ color: "var(--fg-muted)" }}>
                A carregar…
              </div>
            </div>
          ) : (
            <>
              {activePage === "dashboard" && (
                <DashboardContent
                  intersections={intersections}
                  events={events}
                  municipality={municipality}
                />
              )}
              {activePage === "intersections" && (
                <StubPage title="Interseções" eyebrow="GESTÃO" />
              )}
              {activePage === "detections" && (
                <StubPage title="Deteções" eyebrow="HISTÓRICO" />
              )}
              {activePage === "alerts" && (
                <StubPage title="Alertas" eyebrow="NOTIFICAÇÕES" />
              )}
              {activePage === "settings" && (
                <StubPage title="Configurações" eyebrow="SISTEMA" />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
