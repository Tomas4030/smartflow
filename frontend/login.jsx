const { useState, useEffect } = React;

function IconEye({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
         style={{ animation: "sf-spin 0.8s linear infinite" }}>
      <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
    </svg>
  );
}

function LoginPage() {
  const [theme, setTheme]               = useTheme();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPw, setShowPw]             = useState(false);
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [shaking, setShaking]           = useState(false);

  useEffect(() => {
    AUTH.redirectIfAuthed();
  }, []);

  function shake(msg) {
    setError(msg);
    setShaking(true);
    setTimeout(() => setShaking(false), 480);
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!emailOk || !password) {
      shake(!emailOk && email ? "Formato de e-mail inválido." : "Preencha todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await AUTH.login( email, password);
      window.location.href = "dashboard.html";
    } catch (err) {
      setLoading(false);
      if (err.status === 401) {
        shake("Credenciais inválidas. Verifique e tente novamente.");
      } else {
        shake("Erro de servidor. Tente mais tarde.");
      }
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
        .sf-login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-image:
            linear-gradient(var(--grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .sf-login-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 15%, transparent);
        }
        .sf-login-btn {
          height: 46px;
          width: 100%;
          background: var(--accent);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 14.5px;
          letter-spacing: -0.01em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .18s, transform .14s, opacity .18s;
        }
        .sf-login-btn:hover:not(:disabled) { background: var(--accent-2); transform: translateY(-1px); }
        .sf-login-btn:active:not(:disabled) { transform: translateY(0); }
        .sf-login-btn:disabled { opacity: .65; cursor: default; }
        .sf-eye-btn {
          position: absolute; right: 0; top: 0; bottom: 0; width: 46px;
          display: flex; align-items: center; justify-content: center;
          color: var(--fg-muted);
          background: none; border: none; cursor: pointer;
          transition: color .15s;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .sf-eye-btn:hover { color: var(--fg); }
        .sf-theme-btn {
          width: 34px; height: 34px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: var(--fg-muted);
          border: 1px solid var(--hairline);
          background: var(--surface);
          cursor: pointer;
          transition: color .15s, background .15s;
        }
        .sf-theme-btn:hover { color: var(--fg); background: var(--surface-2); }
        select.sf-login-input {
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(128,128,128,.7)' d='M0 0h10L5 6z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          cursor: pointer;
        }
        @keyframes sf-shake {
          0%, 100% { transform: translateX(0); }
          18%  { transform: translateX(-7px); }
          36%  { transform: translateX(7px); }
          54%  { transform: translateX(-5px); }
          72%  { transform: translateX(5px); }
          88%  { transform: translateX(-2px); }
        }
        @keyframes sf-fade-down {
          from { opacity: 0; transform: translateY(-5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sf-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .sf-error-msg  { animation: sf-fade-down 0.22s ease; }
        .sf-card-shake { animation: sf-shake 0.46s ease; }
      `}</style>

      <div className="sf-login-page">

        {/* ── Nav ──────────────────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50, height: 68,
          display: "flex", alignItems: "center",
          background: "color-mix(in oklch, var(--bg) 82%, transparent)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--hairline)",
        }}>
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="index.html" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <Logomark size={22} />
              <span className="display" style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--fg)" }}>
                Smart<span style={{ color: "var(--accent)" }}>Flow</span>
              </span>
            </a>
            <button className="sf-theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Alternar tema">
              {theme === "dark" ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ── Form ─────────────────────────────────────────── */}
        <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "clamp(28px, 6vh, 72px) 20px" }}>
          <div style={{ width: "100%", maxWidth: 396 }}>

            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <Logomark size={38} />
              <h1 className="display" style={{ margin: "14px 0 5px", fontSize: 26, fontWeight: 600, letterSpacing: "-0.027em", color: "var(--fg)" }}>
                Entrar
              </h1>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--fg-muted)", letterSpacing: "-0.005em" }}>
                Painel de controlo SmartFlow
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className={shaking ? "sf-card-shake" : ""}
              noValidate
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--radius-lg)",
                padding: "clamp(24px, 5vw, 36px) clamp(22px, 5vw, 32px)",
                boxShadow: "0 28px 64px -20px rgba(0,0,0,0.42), 0 4px 16px -6px rgba(0,0,0,0.28), 0 0 0 1px color-mix(in oklch, var(--accent) 6%, transparent)",
                display: "flex", flexDirection: "column", gap: 20,
              }}
            >
              {error && (
                <div className="sf-error-msg" role="alert" style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "10px 13px",
                  background: "color-mix(in oklch, var(--red) 10%, transparent)",
                  border: "1px solid color-mix(in oklch, var(--red) 30%, transparent)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--red)", fontSize: 13, lineHeight: 1.45,
                }}>
                  <IconAlert />{error}
                </div>
              )}

  

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="sf-email" style={labelSty}>E-mail</label>
                <input
                  id="sf-email" type="email" className="sf-login-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="operador@municipio.pt"
                  autoComplete="email" disabled={loading} style={inputSty}
                />
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="sf-password" style={labelSty}>Senha</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="sf-password" type={showPw ? "text" : "password"}
                    className="sf-login-input"
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password" disabled={loading}
                    style={{ ...inputSty, paddingRight: 48 }}
                  />
                  <button type="button" className="sf-eye-btn"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                    tabIndex={-1}>
                    <IconEye open={showPw} />
                  </button>
                </div>
              </div>

              <button type="submit" className="sf-login-btn" disabled={loading}>
                {loading ? <><IconSpinner />A verificar…</> : <>Entrar<IconArrow /></>}
              </button>
            </form>

            <p style={{
              marginTop: 18, textAlign: "center",
              fontFamily: "var(--font-mono)", fontSize: 10.5,
              color: "var(--fg-muted)", opacity: 0.55,
              letterSpacing: "0.01em", userSelect: "all",
            }}>
              dev — admin@albufeira.pt / password
            </p>

          </div>
        </main>
      </div>
    </>
  );
}

const loginRoot = ReactDOM.createRoot(document.getElementById("root"));
loginRoot.render(<LoginPage />);