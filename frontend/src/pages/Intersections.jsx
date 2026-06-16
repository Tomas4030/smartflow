import React, { useState, useEffect, useRef } from "react";
import { AUTH } from "../auth.js";

function IcoPencil() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
}
function IcoTrash() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>;
}
function IcoPlus() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
function IcoClose() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function IcoCheck() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function IcoEmpty() {
  return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .3 }}><circle cx="12" cy="12" r="10" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="12" y1="8" x2="12" y2="16" /></svg>;
}

const STATUS_MAP = {
  idle: { label: "Inativo", color: "var(--cyan)", bg: "color-mix(in oklch, var(--cyan) 9%, transparent)", border: "color-mix(in oklch, var(--cyan) 22%, transparent)", pulse: false },
  priority: { label: "Prioridade", color: "var(--red)", bg: "color-mix(in oklch, var(--red) 10%, transparent)", border: "color-mix(in oklch, var(--red) 25%, transparent)", pulse: true },
  offline: { label: "Offline", color: "var(--fg-muted)", bg: "color-mix(in oklch, var(--surface) 70%, transparent)", border: "var(--hairline)", pulse: false },
  pending: { label: "Pendente", color: "var(--amber)", bg: "color-mix(in oklch, var(--amber) 10%, transparent)", border: "color-mix(in oklch, var(--amber) 28%, transparent)", pulse: false },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.offline;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 11px", borderRadius: 999, fontSize: 11,
      fontFamily: "var(--font-mono)", letterSpacing: "0.07em",
      textTransform: "uppercase", fontWeight: 500,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: s.color,
        animation: s.pulse ? "sf-int-pulse 1.8s ease-out infinite" : "none",
      }} />
      {s.label}
    </span>
  );
}

function Field({ label, id, type, value, onChange, placeholder, error, step, min, max }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label htmlFor={id} style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>
        {label}
      </label>
      <input
        id={id} type={type || "text"} value={value} onChange={onChange}
        placeholder={placeholder} step={step} min={min} max={max}
        className="sf-int-input"
        style={{
          height: 42, padding: "0 13px",
          background: "var(--surface)", border: `1px solid ${error ? "var(--red)" : "var(--hairline)"}`,
          borderRadius: "var(--radius-sm)", color: "var(--fg)",
          fontFamily: "var(--font-body)", fontSize: 13.5, outline: "none",
          transition: "border-color .16s", boxSizing: "border-box", width: "100%",
        }}
      />
      {error && <span style={{ fontSize: 11.5, color: "var(--red)" }}>{error}</span>}
    </div>
  );
}

function IntSkelRow() {
  const ws = ["44%", "62%", "36%", "24%", "24%", "80px"];
  return (
    <tr>
      {ws.map((w, i) => (
        <td key={i} style={{ padding: "14px 16px", borderBottom: "1px solid var(--hairline)" }}>
          <span style={{ display: "block", height: 12, width: w, borderRadius: 4, background: "var(--hairline)", animation: "sf-int-shimmer 1.4s ease-in-out infinite" }} />
        </td>
      ))}
    </tr>
  );
}

function MapPicker({ initialPin, onPin }) {
  const containerRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || typeof L === "undefined") return;
    const isDark = document.documentElement.dataset.theme !== "light";
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    const center = initialPin ? [initialPin.lat, initialPin.lng] : [37.0850, -8.2510];
    const zoom = initialPin ? 15 : 13;

    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: false })
      .setView(center, zoom);
    L.tileLayer(tileUrl, { subdomains: "abcd", maxZoom: 19 }).addTo(map);

    const mkIcon = L.divIcon({
      html: "<svg width='26' height='36' viewBox='0 0 26 36' fill='none'><path d='M13 0C5.82 0 0 5.82 0 13c0 9.75 13 23 13 23s13-13.25 13-23C26 5.82 20.18 0 13 0z' fill='#a855f7'/><circle cx='13' cy='13' r='5.5' fill='white' opacity='0.95'/></svg>",
      className: "sf-map-pin",
      iconSize: [26, 36],
      iconAnchor: [13, 36],
    });

    if (initialPin) {
      markerRef.current = L.marker([initialPin.lat, initialPin.lng], { icon: mkIcon }).addTo(map);
    }

    map.on("click", function (e) {
      var lat = parseFloat(e.latlng.lat.toFixed(6));
      var lng = parseFloat(e.latlng.lng.toFixed(6));
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: mkIcon }).addTo(map);
      }
      onPin({ lat, lng });
    });

    return function () { map.remove(); markerRef.current = null; };
  }, []);

  return (
    <div ref={containerRef} style={{
      height: 220, borderRadius: "var(--radius-sm)",
      overflow: "hidden", border: "1px solid var(--hairline)",
    }} />
  );
}

function Modal({ mode, target, onClose, onSaved }) {
  const isEdit = mode === "edit";
  const [form, setForm] = useState({ name: "", address: "" });
  const [pin, setPin] = useState(null);
  const [errs, setErrs] = useState({});
  const [saving, setSaving] = useState(false);
  const firstRef = useRef(null);

  useEffect(() => {
    if (isEdit && target) {
      setForm({ name: target.name, address: target.address });
      setPin({ lat: target.lat, lng: target.lng });
    } else {
      setForm({ name: "", address: "" });
      setPin(null);
    }
    setErrs({});
    setTimeout(() => firstRef.current && firstRef.current.focus(), 60);
  }, [mode, target]);

  function setF(k) { return e => setForm(f => ({ ...f, [k]: e.target.value })); }

  function validate() {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 3) e.name = "Mínimo 3 caracteres";
    if (!form.address.trim()) e.address = "Morada obrigatória";
    if (!pin) e.pin = "Coloque o cruzamento no mapa";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrs(e); return; }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), address: form.address.trim(), lat: pin.lat, lng: pin.lng };
      const url = isEdit ? `/api/intersections/${target.id}` : "/api/intersections";
      const method = isEdit ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...AUTH.authHeaders() },
        body: JSON.stringify(payload)
      });
      const json = await r.json();
      onSaved(json.data || json, isEdit);
    } catch (_) { /* silent */ }
    setSaving(false);
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.58)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div style={{ width: "100%", maxWidth: 500, background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "calc(100dvh - 60px)", boxShadow: "0 32px 72px -16px rgba(0,0,0,.65)" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--hairline)" }}>
          <h2 className="display" style={{ margin: 0, fontSize: 17, letterSpacing: "-0.02em" }}>
            {isEdit ? "Editar cruzamento" : "Novo cruzamento"}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-muted)", border: "1px solid var(--hairline)", background: "var(--surface)", cursor: "pointer", transition: "color .15s" }}>
            <IcoClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ padding: "22px 22px 20px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", flex: 1 }}>
            {!isEdit && (
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--fg-muted)", padding: "8px 12px", background: "color-mix(in oklch, var(--amber) 8%, transparent)", border: "1px solid color-mix(in oklch, var(--amber) 20%, transparent)", borderRadius: "var(--radius-sm)" }}>
                O novo cruzamento ficará com estado <strong style={{ color: "var(--amber)" }}>Pendente</strong> até aprovação pelo superadmin.
              </p>
            )}
            <div ref={firstRef} tabIndex={-1} style={{ outline: "none" }}>
              <Field id="f-name" label="Nome" value={form.name} onChange={setF("name")} placeholder="R. Exemplo × Av. Central" error={errs.name} />
            </div>
            <Field id="f-addr" label="Morada" value={form.address} onChange={setF("address")} placeholder="Av. da Liberdade 1" error={errs.address} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--fg-muted)" }}>Localização</label>
              <MapPicker
                initialPin={isEdit && target ? { lat: target.lat, lng: target.lng } : null}
                onPin={setPin}
              />
              <div style={{ minHeight: 18, marginTop: 2 }}>
                {pin ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
                    {Number(pin.lat).toFixed(6)}, {Number(pin.lng).toFixed(6)}
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: errs.pin ? "var(--red)" : "var(--fg-muted)" }}>
                    {errs.pin || "Clique no mapa para posicionar o cruzamento"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "14px 22px 20px", borderTop: "1px solid var(--hairline)" }}>
            <button type="button" onClick={onClose} style={{ height: 40, padding: "0 18px", borderRadius: "var(--radius-sm)", fontSize: 13.5, fontWeight: 500, color: "var(--fg-muted)", border: "1px solid var(--hairline)", background: "transparent", cursor: "pointer", transition: "color .15s, border-color .15s" }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={{ height: 40, padding: "0 20px", borderRadius: "var(--radius-sm)", fontSize: 13.5, fontWeight: 600, color: "#fff", background: "var(--accent)", border: "none", cursor: saving ? "default" : "pointer", opacity: saving ? .65 : 1, display: "flex", alignItems: "center", gap: 7, transition: "opacity .15s" }}>
              {saving ? "A guardar…" : <>{isEdit ? <><IcoCheck /> Guardar</> : <><IcoPlus /> Criar</>}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function IntersectionsPage() {
  const user = AUTH.getUser();
  const municipality = user?.municipality || "SmartFlow";
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  function loadRows() {
    setLoading(true);
    fetch("/api/intersections", { headers: AUTH.authHeaders() })
      .then(r => r.json())
      .then(d => { setRows(d.data || d || []); setLoading(false); })
      .catch(() => setLoading(false));
  }
  useEffect(() => { loadRows(); }, []);

  function showToast(msg, type) {
    setToast({ msg, type: type || "ok" });
    setTimeout(() => setToast(null), 2800);
  }

  function handleSaved(item, isEdit) {
    if (isEdit) {
      setRows(r => r.map(x => x.id === item.id ? item : x));
      showToast("Cruzamento atualizado.");
    } else {
      setRows(r => [item, ...r]);
      showToast("Cruzamento criado — aguarda aprovação.", "warn");
    }
    setModalMode(null);
    setEditTarget(null);
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      await fetch(`/api/intersections/${id}`, { method: "DELETE", headers: AUTH.authHeaders() });
      setRows(r => r.filter(x => x.id !== id));
      showToast("Cruzamento removido.");
    } catch (_) { /* silent */ }
    setDeleting(false);
    setDeletingId(null);
  }

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

  return (
    <>
      <style>{`
        @keyframes sf-int-shimmer { 0%,100%{opacity:.35} 50%{opacity:.7} }
        @keyframes sf-int-pulse {
          0%,100%{box-shadow:0 0 0 0 color-mix(in oklch,var(--red) 55%,transparent)}
          50%{box-shadow:0 0 0 5px color-mix(in oklch,var(--red) 0%,transparent)}
        }
        @keyframes sf-toast-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .sf-int-tr:hover td { background: color-mix(in oklch, var(--surface) 45%, transparent) !important; }
        .sf-int-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px color-mix(in oklch,var(--accent) 14%,transparent); }
        .sf-int-act-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 7px;
          border: 1px solid var(--hairline); background: var(--surface);
          color: var(--fg-muted); cursor: pointer;
          transition: color .15s, border-color .15s, background .15s;
        }
        .sf-int-act-btn:hover { color: var(--fg); background: var(--surface-2); border-color: var(--hairline-2); }
        .sf-int-act-btn.del:hover { color: var(--red); border-color: color-mix(in oklch,var(--red) 30%,transparent); background: color-mix(in oklch,var(--red) 6%,transparent); }
        .sf-map-pin { background: none !important; border: none !important; }
        .leaflet-container { cursor: crosshair !important; }
        .leaflet-attribution-flag { display: none !important; }
      `}</style>

      <div style={{ padding: "36px 0 56px" }}>
        <div className="container">

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, gap: 16, flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 6 }}>{municipality} · Gestão de rede</p>
              <h1 className="display" style={{ margin: 0, fontSize: 28, letterSpacing: "-0.025em" }}>Cruzamentos</h1>
            </div>
            {isAdmin && (
              <button
                onClick={() => setModalMode("add")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 18px", borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "#fff", border: "none", fontFamily: "var(--font-body)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", transition: "background .16s, transform .12s", flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent-2)"}
                onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
              >
                <IcoPlus /> Adicionar cruzamento
              </button>
            )}
          </div>

          <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                <thead>
                  <tr style={{ background: "var(--surface)" }}>
                    {["Nome", "Morada", "Estado", "Lat", "Lng", isAdmin ? "Ações" : ""].filter(Boolean).map(h => (
                      <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)", fontWeight: 500, borderBottom: "1px solid var(--hairline)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => <IntSkelRow key={i} />)
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "52px 16px", textAlign: "center", color: "var(--fg-muted)" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                          <IcoEmpty />
                          <span style={{ fontSize: 13.5 }}>Nenhum cruzamento registado.</span>
                        </div>
                      </td>
                    </tr>
                  ) : rows.map((row, idx) => (
                    <tr key={row.id} className="sf-int-tr" style={{ borderBottom: idx < rows.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                      <td style={{ padding: "13px 16px", fontSize: 13.5, color: "var(--fg)", fontWeight: 500, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.name}</td>
                      <td style={{ padding: "13px 16px", fontSize: 13, color: "var(--fg-dim)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.address}</td>
                      <td style={{ padding: "13px 16px" }}><StatusBadge status={row.status} /></td>
                      <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{Number(row.lat).toFixed(4)}</td>
                      <td style={{ padding: "13px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--fg-muted)" }}>{Number(row.lng).toFixed(4)}</td>
                      {isAdmin && (
                        <td style={{ padding: "10px 16px" }}>
                          {deletingId === row.id ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap" }}>
                              <span style={{ fontSize: 12, color: "var(--fg-muted)", whiteSpace: "nowrap" }}>Tem a certeza?</span>
                              <button onClick={() => setDeletingId(null)} style={{ height: 28, padding: "0 10px", borderRadius: 6, fontSize: 12, color: "var(--fg-muted)", border: "1px solid var(--hairline)", background: "transparent", cursor: "pointer" }}>Não</button>
                              <button onClick={() => handleDelete(row.id)} disabled={deleting} style={{ height: 28, padding: "0 10px", borderRadius: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "var(--red)", border: "none", cursor: deleting ? "default" : "pointer", opacity: deleting ? .65 : 1 }}>Sim</button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="sf-int-act-btn" title="Editar" onClick={() => { setEditTarget(row); setModalMode("edit"); }}><IcoPencil /></button>
                              <button className="sf-int-act-btn del" title="Apagar" onClick={() => setDeletingId(row.id)}><IcoTrash /></button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && rows.length > 0 && (
              <div style={{ padding: "11px 20px", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--fg-muted)" }}>{rows.length} cruzamento{rows.length !== 1 ? "s" : ""}</span>
                {["idle", "priority", "offline", "pending"].map(s => {
                  const n = rows.filter(r => r.status === s).length;
                  if (!n) return null;
                  return <StatusBadge key={s} status={s} />;
                })}
              </div>
            )}
          </div>

        </div>
      </div>

      {modalMode && (
        <Modal
          mode={modalMode}
          target={editTarget}
          onClose={() => { setModalMode(null); setEditTarget(null); }}
          onSaved={handleSaved}
        />
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          zIndex: 300, padding: "11px 20px", borderRadius: 999,
          background: toast.type === "warn"
            ? "color-mix(in oklch, var(--amber) 14%, var(--bg-2))"
            : "color-mix(in oklch, var(--green) 12%, var(--bg-2))",
          border: `1px solid ${toast.type === "warn" ? "color-mix(in oklch,var(--amber) 30%,transparent)" : "color-mix(in oklch,var(--green) 25%,transparent)"}`,
          color: toast.type === "warn" ? "var(--amber)" : "var(--green)",
          fontSize: 13, fontWeight: 500, whiteSpace: "nowrap",
          boxShadow: "0 8px 28px -8px rgba(0,0,0,.45)",
          animation: "sf-toast-in .22s ease",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <IcoCheck /> {toast.msg}
        </div>
      )}
    </>
  );
}
