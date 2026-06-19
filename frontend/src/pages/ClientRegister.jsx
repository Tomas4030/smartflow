import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logomark } from "../components/Logomark";

export default function ClientRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) { setError("Preencha nome, email e password."); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/citizens/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro no registo"); setLoading(false); return; }
      localStorage.setItem("citizen_token", data.token);
      localStorage.setItem("citizen_user", JSON.stringify(data.user));
      navigate("/client/profile");
    } catch { setError("Erro de rede."); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ height: 68, display: "flex", alignItems: "center", padding: "0 24px", borderBottom: "1px solid var(--hairline)", background: "color-mix(in oklch, var(--bg) 82%, transparent)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={22} />
          <span className="display" style={{ fontSize: 17, fontWeight: 600 }}>Smart<span style={{ color: "var(--accent)" }}>Flow</span> <span style={{ color: "var(--red)", fontSize: 13 }}>SOS</span></span>
        </Link>
      </header>
      <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "40px 20px" }}>
        <form onSubmit={handleSubmit} style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: "36px 32px", width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 18, boxShadow: "0 28px 64px -20px rgba(0,0,0,0.4)" }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <h1 className="display" style={{ fontSize: 24, fontWeight: 600, margin: "0 0 4px" }}>Criar Conta</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--fg-muted)" }}>Registe-se no SmartFlow SOS</p>
          </div>
          {error && <div style={{ padding: "10px 14px", background: "color-mix(in oklch, var(--red) 10%, transparent)", border: "1px solid color-mix(in oklch, var(--red) 30%, transparent)", borderRadius: "var(--radius-sm)", color: "var(--red)", fontSize: 13 }}>{error}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Nome completo</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="João Silva" style={inputSty} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" style={inputSty} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputSty} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label className="mono" style={labelSty}>Telefone (opcional)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="912 345 678" style={inputSty} />
          </div>
          <button type="submit" disabled={loading} style={{ height: 46, background: "var(--accent)", color: "#fff", borderRadius: "var(--radius-sm)", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "A criar conta..." : "Registar"}
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "var(--fg-muted)", margin: 0 }}>
            Já tem conta? <Link to="/client/login" style={{ color: "var(--accent)", fontWeight: 500 }}>Entrar</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

const inputSty = { width: "100%", height: 46, padding: "0 16px", background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)", color: "var(--fg)", fontFamily: "var(--font-body)", fontSize: 15, outline: "none", boxSizing: "border-box" };
const labelSty = { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)" };
