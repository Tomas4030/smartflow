
function Nav({ onTweaksOpen }) {
  const [t, lang, setLang] = useT();
  const [theme, setTheme] = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkSty = {
    fontSize: 13,
    color: "var(--fg-dim)",
    padding: "8px 12px",
    borderRadius: 999,
    transition: "color .2s, background .2s",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        background: scrolled
          ? "color-mix(in oklch, var(--bg) 78%, transparent)"
          : "transparent",
        borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent",
        transition: "background .25s ease, border-color .25s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          gap: 16,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={22} />
          <span
            className="display"
            style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Smart<span style={{ color: "var(--accent)" }}>Flow</span>
          </span>
        </a>

        <nav
          style={{
            display: "flex",
            gap: 4,
            alignItems: "center",
          }}
          className="sf-nav-links"
        >
          <a href="#problem" style={linkSty}>{t.nav.problem}</a>
          <a href="#solution" style={linkSty}>{t.nav.solution}</a>
          <a href="#market" style={linkSty}>{t.nav.market}</a>
          <a href="#roadmap" style={linkSty}>{t.nav.roadmap}</a>
          <a href="#team" style={linkSty}>{t.nav.team}</a>
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LangToggle lang={lang} setLang={setLang} />
          <a href="simulator.html" className="btn btn-primary" style={{ padding: "10px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
            {t.nav.simulator}
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .sf-nav-links { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function LangToggle({ lang, setLang }) {
  const opts = ["pt", "en"];
  return (
    <div
      style={{
        display: "inline-flex",
        padding: 3,
        border: "1px solid var(--hairline)",
        borderRadius: 999,
        background: "color-mix(in oklch, var(--surface) 60%, transparent)",
      }}
    >
      {opts.map((o) => (
        <button
          key={o}
          onClick={() => setLang(o)}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: lang === o ? "#fff" : "var(--fg-dim)",
            background: lang === o ? "var(--accent)" : "transparent",
            transition: "background .2s, color .2s",
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function Logomark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" stroke="var(--accent)" strokeOpacity="0.55"/>
      <path d="M5 15 C 8 15, 8 9, 12 9 C 16 9, 16 15, 19 15"
            stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="12" r="1.6" fill="var(--accent)"/>
    </svg>
  );
}

window.Nav = Nav;
window.Logomark = Logomark;
