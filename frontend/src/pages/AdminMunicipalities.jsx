import { useState, useEffect } from "react";
import { AUTH } from "../auth.js";

export default function AdminMunicipalities() {
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  const headers = { ...AUTH.authHeaders(), "Content-Type": "application/json" };

  async function fetchMunicipalities() {
    try {
      const res = await fetch("/api/admin/municipalities", { headers });
      setMunicipalities((await res.json()).data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchMunicipalities(); }, []);

  function generatePassword() {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
    let pw = "";
    for (let i = 0; i < 14; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    return pw;
  }

  function toSlug(str) {
    return str.trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "").replace(/[^a-z0-9]/g, "");
  }

  function openCreate() { setEditing(null); setName(""); setDistrict(""); setAdminEmail(""); setAdminPassword(generatePassword()); setError(""); setCreated(null); setShowForm(true); }
  function openEdit(mun) { setEditing(mun); setName(mun.name); setDistrict(mun.district); setError(""); setCreated(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); setError(""); setCreated(null); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !district.trim()) { setError("Preencha nome e distrito."); return; }
    if (!editing && (!adminEmail.trim() || !adminPassword.trim())) { setError("Preencha email e password do administrador."); return; }
    setError("");
    try {
      const url = editing ? `/api/admin/municipalities/${editing.id}` : "/api/admin/municipalities";
      const method = editing ? "PUT" : "POST";
      const body = editing
        ? { name: name.trim(), district: district.trim() }
        : { name: name.trim(), district: district.trim(), adminEmail: adminEmail.trim(), adminPassword: adminPassword.trim() };
      const res = await fetch(url, { method, headers, body: JSON.stringify(body) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Erro"); return; }
      if (!editing) {
        setCreated({ municipality: name.trim(), email: adminEmail.trim(), password: adminPassword.trim() });
      } else {
        closeForm();
      }
      fetchMunicipalities();
    } catch { setError("Erro de rede."); }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja eliminar este município?")) return;
    const res = await fetch(`/api/admin/municipalities/${id}`, { method: "DELETE", headers });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Erro ao eliminar"); return; }
    fetchMunicipalities();
  }

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "var(--fg-muted)" }} className="mono">A carregar...</div>;

  return (
    <div style={{ padding: "40px clamp(24px, 5vw, 56px)", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>GESTÃO</div>
          <h1 style={{ fontSize: 26, fontFamily: "var(--font-display)", fontWeight: 600, margin: 0 }}>Municípios</h1>
        </div>
        <button onClick={openCreate} style={{ padding: "11px 22px", borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600 }}>+ Novo Município</button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "grid", placeItems: "center", zIndex: 100 }} onClick={closeForm}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 36, width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 18 }}>

            {created ? (
              <>
                <h2 style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 600, margin: 0, color: "var(--green)" }}>✓ Município Criado</h2>
                <p style={{ fontSize: 14, color: "var(--fg-dim)", margin: 0 }}>Credenciais de acesso para o administrador:</p>
                <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div><span className="mono" style={{ fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Município</span><div style={{ fontSize: 16, fontWeight: 500, marginTop: 4 }}>{created.municipality}</div></div>
                  <div><span className="mono" style={{ fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email</span><div className="mono" style={{ fontSize: 14, marginTop: 4, userSelect: "all" }}>{created.email}</div></div>
                  <div><span className="mono" style={{ fontSize: 10, color: "var(--fg-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Password</span><div className="mono" style={{ fontSize: 14, marginTop: 4, userSelect: "all" }}>{created.password}</div></div>
                </div>
                <p style={{ fontSize: 12, color: "var(--fg-muted)", margin: 0 }}>⚠ Guarde estas credenciais — a password não pode ser recuperada.</p>
                <button onClick={closeForm} style={{ padding: "11px 22px", borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600, alignSelf: "flex-end" }}>Fechar</button>
              </>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <h2 style={{ fontSize: 20, fontFamily: "var(--font-display)", fontWeight: 600, margin: 0 }}>{editing ? "Editar Município" : "Novo Município"}</h2>
                {error && <div style={{ padding: "10px 14px", background: "color-mix(in oklch, var(--red) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--red) 30%, transparent)", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: 13 }}>{error}</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label className="mono" style={labelSty}>Nome do Município</label>
                  <input value={name} onChange={(e) => { setName(e.target.value); if (!editing) setAdminEmail(`admin@${toSlug(e.target.value)}.pt`); }} placeholder="Ex: Loulé" style={inputSty} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label className="mono" style={labelSty}>Distrito</label>
                  <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="Ex: Faro" style={inputSty} />
                </div>
                {!editing && (
                  <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: 16 }}>
                    <div className="mono" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 14 }}>Conta do Administrador</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <label className="mono" style={labelSty}>Email</label>
                        <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@municipio.pt" style={inputSty} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                        <label className="mono" style={labelSty}>Password (gerada automaticamente)</label>
                        <input type="text" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} style={{ ...inputSty, fontFamily: "var(--font-mono)" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                  <button type="button" onClick={closeForm} style={{ padding: "10px 20px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 14, color: "var(--fg-muted)" }}>Cancelar</button>
                  <button type="submit" style={{ padding: "10px 22px", borderRadius: "var(--radius-sm)", background: "var(--accent)", color: "#fff", fontSize: 14, fontWeight: 600 }}>{editing ? "Guardar" : "Criar"}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: "auto", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "8px 0" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--hairline)" }}>
              <th style={thSty}>Nome</th>
              <th style={thSty}>Distrito</th>
              <th style={thSty}>Interseções</th>
              <th style={thSty}>Pendentes</th>
              <th style={thSty}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {municipalities.map((mun) => (
              <tr key={mun.id} style={{ borderBottom: "1px solid var(--hairline)" }}>
                <td style={tdSty}><span style={{ fontWeight: 600, fontSize: 15 }}>{mun.name}</span></td>
                <td style={tdSty}>{mun.district}</td>
                <td style={{ ...tdSty, fontSize: 15, fontWeight: 500 }}>{mun.total}</td>
                <td style={tdSty}>{mun.pending > 0 ? <span style={{ color: "var(--amber)", fontWeight: 600, fontSize: 15 }}>{mun.pending}</span> : <span style={{ color: "var(--fg-muted)" }}>0</span>}</td>
                <td style={tdSty}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => openEdit(mun)} style={{ padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, color: "var(--fg-dim)", cursor: "pointer" }}>Editar</button>
                    <button onClick={() => handleDelete(mun.id)} style={{ padding: "6px 14px", borderRadius: "var(--radius-sm)", border: "1px solid color-mix(in oklch, var(--red) 40%, var(--hairline))", fontSize: 13, color: "var(--red)", cursor: "pointer" }}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputSty = { width: "100%", height: 46, padding: "0 16px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 15, outline: "none", boxSizing: "border-box" };
const labelSty = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)" };
const thSty = { textAlign: "left", padding: "14px 16px", fontWeight: 500, color: "var(--fg-muted)", fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase" };
const tdSty = { padding: "14px 16px", color: "var(--fg-dim)", fontSize: 15 };
