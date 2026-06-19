import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logomark } from "../components/Logomark";

function getHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("citizen_token")}` };
}

export default function ClientSOS() {
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosState, setSosState] = useState("idle"); // idle | confirming | calling | done
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("citizen_token")) { navigate("/client/login"); return; }
    fetch("/api/citizens/me", { headers: getHeaders() })
      .then((r) => r.json())
      .then((d) => setCitizen(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleSOSClick() { setSosState("confirming"); }
  function cancelSOS() { setSosState("idle"); }

  async function confirmSOS() {
    setSosState("calling");
    setSteps([]);

    const simSteps = [
      "A ligar para 112...",
      "A enviar dados médicos...",
      "Localização enviada...",
      "Emergência registada...",
      "Ambulância simulada despachada...",
      "SmartFlow ativado no cruzamento mais próximo.",
    ];

    for (let i = 0; i < simSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setSteps((prev) => [...prev, simSteps[i]]);
    }

    try {
      const res = await fetch("/api/citizens/sos", { method: "POST", headers: getHeaders() });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "Erro ao criar emergência." });
    }
    setSosState("done");
  }

  function resetSOS() { setSosState("idle"); setSteps([]); setResult(null); }
  function logout() { localStorage.removeItem("citizen_token"); localStorage.removeItem("citizen_user"); navigate("/client/login"); }

  if (loading) return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)" }}><div className="mono" style={{ color: "var(--fg-muted)" }}>A carregar...</div></div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <header style={{ height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid var(--hairline)", background: "var(--bg-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={22} />
          <span className="display" style={{ fontSize: 15, fontWeight: 600 }}>Smart<span style={{ color: "var(--accent)" }}>Flow</span> <span style={{ color: "var(--red)", fontSize: 12 }}>SOS</span></span>
        </div>
        <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/client/sos" style={{ padding: "6px 12px", fontSize: 13, color: "var(--fg)", background: "color-mix(in oklch, var(--accent) 12%, var(--surface))", borderRadius: "var(--radius-sm)", border: "1px solid color-mix(in oklch, var(--accent) 28%, var(--hairline))" }}>SOS</Link>
          <Link to="/client/profile" style={{ padding: "6px 12px", fontSize: 13, color: "var(--fg-dim)", borderRadius: "var(--radius-sm)" }}>Perfil</Link>
          <button onClick={logout} style={{ padding: "6px 12px", fontSize: 13, color: "var(--fg-muted)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-sm)" }}>Sair</button>
        </nav>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        {sosState === "idle" && (
          <div style={{ textAlign: "center", maxWidth: 500 }}>
            <h1 className="display" style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px" }}>SmartFlow SOS</h1>
            <p style={{ fontSize: 15, color: "var(--fg-dim)", margin: "0 0 8px" }}>Olá, <strong>{citizen?.name}</strong>.</p>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: "0 0 40px", lineHeight: 1.6 }}>
              Em caso de emergência médica, carregue no botão abaixo.<br />
              <span style={{ fontSize: 12 }}>A chamada será apenas simulada para efeitos de demonstração académica.</span>
            </p>
            <button onClick={handleSOSClick} style={{ width: 200, height: 200, borderRadius: "50%", background: "linear-gradient(145deg, var(--red), var(--red-2))", border: "4px solid color-mix(in oklch, var(--red) 60%, #fff)", color: "#fff", fontSize: 22, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 60px color-mix(in oklch, var(--red) 40%, transparent), 0 8px 32px rgba(0,0,0,0.3)", transition: "transform .15s, box-shadow .15s", fontFamily: "var(--font-display)" }}>
              🚨 SOS
            </button>
            <p className="mono" style={{ marginTop: 20, fontSize: 11, color: "var(--fg-muted)" }}>Clique para pedir ajuda</p>
          </div>
        )}

        {sosState === "confirming" && (
          <div style={{ textAlign: "center", maxWidth: 420, background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-lg)", padding: 36 }}>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>Confirmar Emergência</h2>
            <p style={{ fontSize: 14, color: "var(--fg-muted)", margin: "0 0 24px" }}>Tem a certeza que quer simular uma emergência médica?</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={cancelSOS} style={{ padding: "10px 24px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 14, color: "var(--fg-muted)", cursor: "pointer" }}>Cancelar</button>
              <button onClick={confirmSOS} style={{ padding: "10px 24px", borderRadius: "var(--radius-sm)", background: "var(--red)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Confirmar SOS</button>
            </div>
          </div>
        )}

        {(sosState === "calling" || sosState === "done") && (
          <div style={{ width: "100%", maxWidth: 600 }}>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 600, margin: "0 0 20px", textAlign: "center" }}>
              {sosState === "calling" ? "A processar emergência..." : "✓ Emergência Simulada"}
            </h2>

            {/* Steps animation */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20 }}>
              {steps.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < steps.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                  <span style={{ color: "var(--green)", fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 14, color: "var(--fg-dim)" }}>{step}</span>
                </div>
              ))}
              {sosState === "calling" && <div className="mono" style={{ padding: "8px 0", fontSize: 12, color: "var(--fg-muted)", animation: "sf-pulse 1s ease infinite" }}>...</div>}
            </div>

            {/* Call transcript */}
            {sosState === "done" && result?.callTranscript && (
              <div style={{ background: "var(--bg-2)", border: "1px solid var(--hairline)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 20 }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--fg-muted)", marginBottom: 12 }}>Transcrição da Chamada Simulada</div>
                <pre style={{ margin: 0, fontSize: 13, color: "var(--fg-dim)", whiteSpace: "pre-wrap", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{result.callTranscript}</pre>
              </div>
            )}

            {/* SmartFlow event info */}
            {sosState === "done" && result?.smartflowEvent && (
              <div style={{ background: "color-mix(in oklch, var(--green) 8%, var(--surface))", border: "1px solid color-mix(in oklch, var(--green) 25%, var(--hairline))", borderRadius: "var(--radius)", padding: "16px 24px", marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>SmartFlow Ativado</div>
                <div style={{ fontSize: 13, color: "var(--fg-dim)" }}>Cruzamento <strong>{result.smartflowEvent.intersection}</strong> em modo prioridade.</div>
              </div>
            )}

            {sosState === "done" && (
              <div style={{ textAlign: "center" }}>
                <button onClick={resetSOS} style={{ padding: "10px 24px", borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 14, color: "var(--fg-muted)", cursor: "pointer" }}>Voltar</button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer style={{ padding: "12px 24px", borderTop: "1px solid var(--hairline)", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 11, color: "var(--fg-muted)" }}>⚠ O SmartFlow SOS não substitui o 112. Esta é uma simulação académica.</p>
      </footer>
    </div>
  );
}
