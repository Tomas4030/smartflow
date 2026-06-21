import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logomark } from "../components/Logomark";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("citizen_token")}`,
  };
}

function navLink(active) {
  return {
    padding: "6px 12px",
    fontSize: 13,
    color: active ? "var(--fg)" : "var(--fg-dim)",
    background: active
      ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
      : "transparent",
    borderRadius: "var(--radius-sm)",
    border: active
      ? "1px solid color-mix(in oklch, var(--accent) 28%, var(--hairline))"
      : "1px solid transparent",
    textDecoration: "none",
  };
}

/* ─── Ring Animation Phase ─── */
function RingingPhase({ onAnswered }) {
  useEffect(() => {
    const t = setTimeout(onAnswered, 3500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          width: 140,
          height: 140,
          margin: "0 auto 28px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--red)",
            animation: "sos-ring 1.4s ease-out infinite",
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--red)",
            animation: "sos-ring 1.4s ease-out infinite 0.4s",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px solid var(--red)",
            animation: "sos-ring 1.4s ease-out infinite 0.8s",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 20,
            borderRadius: "50%",
            background: "linear-gradient(145deg, var(--red), #b91c1c)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <span style={{ fontSize: 36 }}>📞</span>
        </div>
      </div>
      <h2
        className="display"
        style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}
      >
        A ligar para o 112...
      </h2>
      <p
        className="mono"
        style={{
          fontSize: 12,
          color: "var(--fg-muted)",
          animation: "sos-fade 1s ease infinite",
        }}
      >
        a estabelecer ligação
      </p>
    </div>
  );
}

/* ─── Call Screen Phase ─── */
function CallPhase({ onHangup, elapsed }) {
  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  return (
    <div style={{ textAlign: "center", maxWidth: 360, margin: "0 auto" }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #1e40af, #3b82f6)",
          margin: "0 auto 16px",
          display: "grid",
          placeItems: "center",
          border:
            "3px solid color-mix(in oklch, var(--accent) 30%, var(--hairline))",
        }}
      >
        <span style={{ fontSize: 32 }}>👩‍⚕️</span>
      </div>
      <h2
        className="display"
        style={{ fontSize: 20, fontWeight: 600, margin: "0 0 4px" }}
      >
        Operador INEM
      </h2>
      <p
        className="mono"
        style={{ fontSize: 12, color: "var(--green)", margin: "0 0 4px" }}
      >
        ● Em chamada
      </p>
      <p
        className="mono"
        style={{
          fontSize: 22,
          color: "var(--fg)",
          margin: "0 0 24px",
          letterSpacing: "0.05em",
        }}
      >
        {fmt(elapsed)}
      </p>
      <button
        onClick={onHangup}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--red)",
          border: "none",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          margin: "0 auto",
          boxShadow:
            "0 4px 20px color-mix(in oklch, var(--red) 40%, transparent)",
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 004.38.77 2 2 0 012 2v3a2 2 0 01-2.18 2A19.79 19.79 0 013.07 4.18 2 2 0 015 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.91 9.91a16 16 0 001.77 3.4z" />
          <line x1="23" y1="1" x2="1" y2="23" />
        </svg>
      </button>
      <p
        className="mono"
        style={{ fontSize: 10, color: "var(--fg-muted)", marginTop: 12 }}
      >
        desligar
      </p>
    </div>
  );
}

/* ─── Chat Transcript Phase ─── */
function TranscriptPhase({
  messages,
  visibleCount,
  done,
  onReset,
  smartflowEvent,
}) {
  const endRef = useRef(null);
  const nextMessage = messages[visibleCount];
  const nextIsOperator = nextMessage?.from === "op";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount]);
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--fg-muted)",
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Transcrição da chamada
      </div>
      <div
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--hairline)",
          borderRadius: "var(--radius)",
          padding: "16px 20px",
          maxHeight: 360,
          overflowY: "auto",
        }}
      >
        {messages.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              flexDirection: msg.from === "op" ? "row" : "row-reverse",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: msg.from === "op" ? "#1e40af" : "var(--accent)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                fontSize: 12,
              }}
            >
              {msg.from === "op" ? "👩‍⚕️" : "🤖"}
            </div>
            <div
              style={{
                background:
                  msg.from === "op"
                    ? "var(--surface)"
                    : "color-mix(in oklch, var(--accent) 14%, var(--surface))",
                border: "1px solid var(--hairline)",
                borderRadius: 12,
                padding: "8px 14px",
                maxWidth: "78%",
                fontSize: 13,
                color: "var(--fg-dim)",
                lineHeight: 1.5,
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {!done && visibleCount < messages.length && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexDirection: nextIsOperator ? "row" : "row-reverse",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: nextIsOperator ? "#1e40af" : "var(--accent)",
                display: "grid",
                placeItems: "center",
                fontSize: 12,
              }}
            >
              {nextIsOperator ? "👩‍⚕️" : "🤖"}
            </div>
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--hairline)",
                borderRadius: 12,
                padding: "10px 16px",
              }}
            >
              <span style={{ display: "inline-flex", gap: 4 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--fg-muted)",
                    animation: "sos-dot 1s infinite 0s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--fg-muted)",
                    animation: "sos-dot 1s infinite 0.2s",
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--fg-muted)",
                    animation: "sos-dot 1s infinite 0.4s",
                  }}
                />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
    
      {done && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button
            onClick={onReset}
            style={{
              padding: "10px 24px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--hairline)",
              fontSize: 14,
              color: "var(--fg-muted)",
              cursor: "pointer",
              background: "transparent",
            }}
          >
            Voltar ao início
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function ClientSOS() {
  const navigate = useNavigate();
  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("idle"); // idle | confirming | ringing | call | transcript
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState(null);
  const [visibleMsgs, setVisibleMsgs] = useState(0);
  const [transcriptDone, setTranscriptDone] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!localStorage.getItem("citizen_token")) {
      navigate("/client/login");
      return;
    }
    fetch("/api/citizens/me", { headers: getHeaders() })
      .then((r) => r.json())
      .then((d) => setCitizen(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleSOSClick() {
    setPhase("confirming");
  }
  function cancelSOS() {
    setPhase("idle");
  }

  async function confirmSOS() {
    setPhase("ringing");
    setElapsed(0);
    setVisibleMsgs(0);
    setTranscriptDone(false);
    setResult(null);

    try {
      const res = await fetch("/api/citizens/sos", {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Erro ao criar emergência." });
    }
  }

  // Call timer
  useEffect(() => {
    if (phase === "call") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
      const t = setTimeout(() => setPhase("transcript"), 6000);
      return () => {
        clearInterval(timerRef.current);
        clearTimeout(t);
      };
    }
  }, [phase]);

  // Transcript typewriter
  const chatMessages = buildChatMessages(citizen, result);
  useEffect(() => {
    if (phase !== "transcript") return;
    if (visibleMsgs >= chatMessages.length) {
      setTranscriptDone(true);
      return;
    }
    const t = setTimeout(() => setVisibleMsgs((v) => v + 1), 1400);
    return () => clearTimeout(t);
  }, [phase, visibleMsgs]);

  function resetSOS() {
    setPhase("idle");
    setResult(null);
    setElapsed(0);
    setVisibleMsgs(0);
    setTranscriptDone(false);
  }
  function logout() {
    localStorage.removeItem("citizen_token");
    localStorage.removeItem("citizen_user");
    navigate("/client/login");
  }

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "var(--bg)",
        }}
      >
        <div className="mono" style={{ color: "var(--fg-muted)" }}>
          A carregar...
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
      }}
    >
      <style>{`
        @keyframes sos-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes sos-fade { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes sos-dot { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      <header
        style={{
          height: 68,
          borderBottom: "1px solid var(--hairline)",
          background: "transparent",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <Logomark size={22} />
            <span
              className="display"
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Smart<span style={{ color: "var(--accent)" }}>Flow</span>{" "}
              <span style={{ color: "var(--red)", fontSize: 12 }}>SOS</span>
            </span>
          </Link>
          <nav style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/client/sos" style={navLink(true)}>
              SOS
            </Link>
            <Link to="/client/profile" style={navLink(false)}>
              Perfil
            </Link>
            <button
              onClick={logout}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                color: "var(--fg-muted)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-sm)",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </nav>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        {phase === "idle" && (
          <div style={{ textAlign: "center", maxWidth: 500 }}>
            <h1
              className="display"
              style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px" }}
            >
              SmartFlow SOS
            </h1>
            <p
              style={{
                fontSize: 15,
                color: "var(--fg-dim)",
                margin: "0 0 8px",
              }}
            >
              Olá, <strong>{citizen?.name}</strong>.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg-muted)",
                margin: "0 0 40px",
                lineHeight: 1.6,
              }}
            >
              Em caso de emergência médica, carregue no botão abaixo.
              <br />
              <span style={{ fontSize: 12 }}>
                A chamada será apenas simulada para efeitos de demonstração
                académica.
              </span>
            </p>
            <button
              onClick={handleSOSClick}
              style={{
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "linear-gradient(145deg, var(--red), var(--red-2))",
                border: "4px solid color-mix(in oklch, var(--red) 60%, #fff)",
                color: "#fff",
                fontSize: 22,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 0 60px color-mix(in oklch, var(--red) 40%, transparent), 0 8px 32px rgba(0,0,0,0.3)",
                transition: "transform .15s, box-shadow .15s",
                fontFamily: "var(--font-display)",
              }}
            >
              🚨 SOS
            </button>
            <p
              className="mono"
              style={{ marginTop: 20, fontSize: 11, color: "var(--fg-muted)" }}
            >
              Clique para pedir ajuda
            </p>
          </div>
        )}

        {phase === "confirming" && (
          <div
            style={{
              textAlign: "center",
              maxWidth: 420,
              background: "var(--bg-2)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--radius-lg)",
              padding: 36,
            }}
          >
            <h2
              className="display"
              style={{ fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}
            >
              Confirmar Emergência
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "var(--fg-muted)",
                margin: "0 0 24px",
              }}
            >
              Tem a certeza que quer simular uma emergência médica?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={cancelSOS}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--hairline)",
                  fontSize: 14,
                  color: "var(--fg-muted)",
                  cursor: "pointer",
                  background: "transparent",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmSOS}
                style={{
                  padding: "10px 24px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--red)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Confirmar SOS
              </button>
            </div>
          </div>
        )}

        {phase === "ringing" && (
          <RingingPhase onAnswered={() => setPhase("call")} />
        )}
        {phase === "call" && (
          <CallPhase
            elapsed={elapsed}
            onHangup={() => setPhase("transcript")}
          />
        )}
        {phase === "transcript" && (
          <TranscriptPhase
            messages={chatMessages}
            visibleCount={visibleMsgs}
            done={transcriptDone}
            onReset={resetSOS}
            smartflowEvent={result?.smartflowEvent}
          />
        )}
      </main>

      <footer
        style={{
          padding: "12px 24px",
          borderTop: "1px solid var(--hairline)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontSize: 11, color: "var(--fg-muted)" }}>
          ⚠ O SmartFlow SOS não substitui o 112. Esta é uma simulação académica.
        </p>
      </footer>
    </div>
  );
}

function buildChatMessages(citizen, result) {
  const name = citizen?.name || "Cidadão";
  const location =
    citizen?.address || "localização GPS enviada automaticamente";
  const medicalData = citizen?.conditions
    ? `Condições médicas registadas: ${citizen.conditions}.`
    : "Sem condições médicas registadas no perfil.";

  return [
    { from: "op", text: "112, qual é a sua emergência?" },
    {
      from: "bot",
      text: "Sou o assistente automático do SmartFlow SOS. O utilizador acionou um pedido de emergência médica e poderá não conseguir falar.",
    },
    {
      from: "bot",
      text: `Utente: ${name}. Solicito o envio de uma ambulância.`,
    },
    {
      from: "bot",
      text: `Localização: ${location}.`,
    },
    {
      from: "bot",
      text: medicalData,
    },
    {
      from: "op",
      text: "Dados recebidos. Ambulância despachada para a localização indicada.",
    },
    {
      from: "op",
      text: "O SmartFlow Municipal está a preparar a prioridade semafórica no percurso. Tempo estimado de chegada: 4 minutos.",
    },
    {
      from: "bot",
      text: "Confirmação recebida. O SmartFlow SOS continuará a partilhar a localização e os dados essenciais até à chegada da equipa.",
    },
  ];
}
