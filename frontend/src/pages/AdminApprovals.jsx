import { useState, useEffect } from "react";
import { AUTH } from "../auth.js";

export default function AdminApprovals() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const headers = { ...AUTH.authHeaders(), "Content-Type": "application/json" };

  async function fetchPending() {
    try {
      const res = await fetch("/api/admin/intersections/pending", { headers });
      setPending((await res.json()).data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPending();
  }, []);

  async function handleApprove(id) {
    await fetch(`/api/admin/intersections/${id}/approve`, {
      method: "PUT",
      headers,
    });
    fetchPending();
  }
  async function handleReject(id) {
    await fetch(`/api/admin/intersections/${id}/reject`, {
      method: "PUT",
      headers,
    });
    fetchPending();
  }

  if (loading)
    return (
      <div
        style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }}
        className="mono"
      >
        A carregar...
      </div>
    );

  return (
    <div
      style={{
        padding: "40px clamp(24px, 5vw, 56px)",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 8 }}>
        APROVAÇÕES
      </div>
      <h1
        style={{
          fontSize: 26,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          margin: "0 0 28px",
        }}
      >
        Pedidos Pendentes
      </h1>

      {pending.length === 0 ? (
        <div
          style={{
            padding: 40,
            background: "var(--surface)",
            border: "1px solid var(--hairline)",
            borderRadius: "var(--radius)",
            color: "var(--fg-muted)",
            fontSize: 15,
            textAlign: "center",
          }}
        >
          Não existem pedidos pendentes de aprovação.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pending.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "20px 24px",
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 5 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 14, color: "var(--fg-muted)" }}>
                  {item.municipality?.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--fg-muted)",
                    marginTop: 2,
                  }}
                >
                  {item.address}
                </div>
              </div>
              <div
                className="mono"
                style={{ fontSize: 13, color: "var(--fg-muted)" }}
              >
                {Number(item.lat).toFixed(4)}, {Number(item.lng).toFixed(4)}
              </div>
              <div
                className="mono"
                style={{ fontSize: 12, color: "var(--fg-muted)" }}
              >
                {new Date(item.createdAt).toLocaleDateString("pt-PT")}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleApprove(item.id)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--green)",
                    color: "#000",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Aprovar
                </button>
                <button
                  onClick={() => handleReject(item.id)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--red)",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
