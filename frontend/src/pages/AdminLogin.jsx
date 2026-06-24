import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH } from "../auth";
import { Logomark } from "../components/Logomark";

function IconEye({ open }) {
  return open ? (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      style={{ animation: "sf-spin 0.8s linear infinite" }}
    >
      <path d="M21 12a9 9 0 1 1-6.22-8.56" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("superadmin@smartflow.pt");
  const [password, setPassword] = useState("password");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (AUTH.getToken()) {
      const u = AUTH.getUser();
      if (u?.role === "superadmin") navigate("/admin");
    }
  }, []);

  function shake(msg) {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 480);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk || !password) {
      shake(
        !emailOk && email
          ? "Formato de e-mail inválido."
          : "Preencha todos os campos.",
      );
      return;
    }
    setError("");
    setLoading(true);
    try {
      const user = await AUTH.login(email, password);
      if (user.role !== "superadmin") {
        AUTH.logout();
        shake("Esta área é exclusiva para administradores SmartFlow.");
        return;
      }
      navigate("/admin");
    } catch (err) {
      setLoading(false);
      shake(
        err.status === 401
          ? "Credenciais inválidas. Verifique e tente novamente."
          : "Erro de servidor. Tente mais tarde.",
      );
    }
  }

  const labelSty = {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: "var(--fg-muted)",
    userSelect: "none",
  };
  const inputSty = {
    width: "100%",
    height: 46,
    padding: "0 14px",
    background: "var(--surface)",
    border: "1px solid var(--hairline)",
    borderRadius: "var(--radius-sm)",
    color: "var(--fg)",
    fontFamily: "var(--font-body)",
    fontSize: 14,
    outline: "none",
    transition: "border-color .18s, box-shadow .18s",
    boxSizing: "border-box",
  };

  return (
    <>
      <style>{`
        .sf-login-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 15%, transparent); }
        .sf-login-btn { height: 46px; width: 100%; background: var(--accent); color: #fff; border: none; border-radius: var(--radius-sm); font-family: var(--font-body); font-weight: 600; font-size: 14.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background .18s, transform .14s, opacity .18s; }
        .sf-login-btn:hover:not(:disabled) { background: var(--accent-2); transform: translateY(-1px); }
        .sf-login-btn:disabled { opacity: .65; cursor: default; }
        .sf-eye-btn { position: absolute; right: 0; top: 0; bottom: 0; width: 46px; display: flex; align-items: center; justify-content: center; color: var(--fg-muted); background: none; border: none; cursor: pointer; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
        .sf-eye-btn:hover { color: var(--fg); }
        @keyframes sf-shake { 0%,100%{transform:translateX(0)} 18%{transform:translateX(-7px)} 36%{transform:translateX(7px)} 54%{transform:translateX(-5px)} 72%{transform:translateX(5px)} 88%{transform:translateX(-2px)} }
        @keyframes sf-fade-down { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sf-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .sf-error-msg { animation: sf-fade-down 0.22s ease; }
        .sf-card-shake { animation: sf-shake 0.46s ease; }
      `}</style>

      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            height: 68,
            display: "flex",
            alignItems: "center",
            background: "color-mix(in oklch, var(--bg) 82%, transparent)",
            backdropFilter: "blur(14px)",
            borderBottom: "1px solid var(--hairline)",
          }}
        >
          <div
            className="container"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
          >
            <Logomark size={22} />
            <span
              className="display"
              style={{
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--fg)",
              }}
            >
              Smart<span style={{ color: "var(--accent)" }}>Flow</span>
            </span>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            padding: "clamp(28px, 6vh, 72px) 20px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 396 }}>
            <form
              onSubmit={handleSubmit}
              className={shaking ? "sf-card-shake" : ""}
              noValidate
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(24px, 5vw, 36px) clamp(22px, 5vw, 32px)",
                boxShadow:
                  "0 28px 64px -20px rgba(0,0,0,0.42), 0 4px 16px -6px rgba(0,0,0,0.28)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <Logomark size={38} />
                <h1
                  className="display"
                  style={{
                    margin: "14px 0 5px",
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: "-0.027em",
                    color: "var(--fg)",
                  }}
                >
                  Administração
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    color: "var(--fg-muted)",
                  }}
                >
                  Acesso exclusivo equipa SmartFlow
                </p>
              </div>

              {error && (
                <div
                  className="sf-error-msg"
                  role="alert"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "10px 13px",
                    background:
                      "color-mix(in oklch, var(--red) 10%, transparent)",
                    border:
                      "1px solid color-mix(in oklch, var(--red) 30%, transparent)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--red)",
                    fontSize: 13,
                  }}
                >
                  <IconAlert />
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="sf-admin-email" style={labelSty}>
                  E-mail
                </label>
                <input
                  id="sf-admin-email"
                  type="email"
                  className="sf-login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartflow.pt"
                  autoComplete="email"
                  disabled={loading}
                  style={inputSty}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="sf-admin-password" style={labelSty}>
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="sf-admin-password"
                    type={showPw ? "text" : "password"}
                    className="sf-login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    style={{ ...inputSty, paddingRight: 48 }}
                  />
                  <button
                    type="button"
                    className="sf-eye-btn"
                    onClick={() => setShowPw((v) => !v)}
                    aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}
                  >
                    <IconEye open={showPw} />
                  </button>
                </div>
              </div>

              <button type="submit" className="sf-login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <IconSpinner />A verificar…
                  </>
                ) : (
                  <>
                    Entrar
                    <IconArrow />
                  </>
                )}
              </button>
            </form>

            <p
              style={{
                marginTop: 18,
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "var(--fg-muted)",
                opacity: 0.55,
                userSelect: "all",
              }}
            >
              dev — superadmin@smartflow.pt / password
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
