import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logomark } from "../components/Logomark";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("citizen_token")) navigate("/client/sos");
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/citizens/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Credenciais inválidas"); setLoading(false); return; }
      localStorage.setItem("citizen_token", data.token);
      localStorage.setItem("citizen_user", JSON.stringify(data.user));
      navigate("/client/sos");
    } catch { setError("Erro de rede."); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ height: 68, borderBottom: "1px solid var(--hairline)", background: "transparent" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logomark size={22} />
            <span className="display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>Smart<span style={{ color: "var(--accent)" }}>Flow</span> <span style={{ color: "var(--red)", fontSize: 12 }}>SOS</span></span>
          </Link>
          <Link to="/client/register" style={{ padding: "6px 12px", fontSize: 13, color: "var(--fg-dim)", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", textDecoration: "none" }}>Registar</Link>
        </div>
      </header>
      <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "40px 20px" }}>
        <form onSubmit={handleSubmit} style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: "36px 32px", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 28px 64px -20px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <Logomark size={36} />
            <h1 className="display" style={{ fontSize: 24, fontWeight: 600, margin: "12px 0 4px" }}>Entrar</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)" }}>Área do cidadão SmartFlow SOS</p>
          </div>
          {error && <div style={{ padding: "10px 14px", background: "color-mix(in oklch, var(--red) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--red) 30%, transparent)", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: 13 }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" style={inputSty} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputSty} />
          </div>
          <button type="submit" disabled={loading} style={{ height: 46, background: "var(--accent)", color: "#fff", borderRadius: "var(--radius-sm)", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "A verificar..." : "Entrar"}
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--fg-muted)", margin: 0 }}>
            Não tem conta? <Link to="/client/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Registar</Link>
          </p>

          <p style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "var(--fg-muted)", margin: "16px 0 0" }}>
            És um município?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>
              Aceder ao painel municipal
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}

const inputSty = { width: "100%", height: 46, padding: "0 16px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 15, outline: "none", boxSizing: "border-box" };
const labelSty = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)" };
