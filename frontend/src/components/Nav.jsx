import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useT, useTheme } from '../shared'
import { Logomark } from './Logomark'

export function LangToggle({ lang, setLang }) {
  const opts = ["pt", "en"]
  return (
    <div style={{ display: "inline-flex", padding: 3, border: "1px solid var(--hairline)", borderRadius: 999, background: "color-mix(in oklch, var(--surface) 60%, transparent)" }}>
      {opts.map((o) => (
        <button key={o} onClick={() => setLang(o)} style={{ padding: "6px 12px", borderRadius: 999, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", textTransform: "uppercase", color: lang === o ? "#fff" : "var(--fg-dim)", background: lang === o ? "var(--accent)" : "transparent", transition: "background .2s, color .2s" }}>
          {o}
        </button>
      ))}
    </div>
  )
}

export function Nav() {
  const [t, lang, setLang] = useT()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const linkSty = { fontSize: 13, color: "var(--fg-dim)", padding: "8px 12px", borderRadius: 999, transition: "color .2s, background .2s" }

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", background: scrolled ? "color-mix(in oklch, var(--bg) 78%, transparent)" : "transparent", borderBottom: scrolled ? "1px solid var(--hairline)" : "1px solid transparent", transition: "background .25s ease, border-color .25s ease" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, gap: 16 }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={22} />
          <span className="display" style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Smart<span style={{ color: "var(--accent)" }}>Flow</span>
          </span>
        </a>

        <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="sf-nav-links">
          <a href="#solution" style={linkSty}>{t.nav.product}</a>
          <a href="#sos" style={linkSty}>{t.nav.how}</a>
          <a href="#market" style={linkSty}>{t.nav.why}</a>
          <a href="#roadmap" style={linkSty}>{t.nav.sos}</a>
          <a href="#contact" style={linkSty}>{t.nav.cta}</a>
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <LangToggle lang={lang} setLang={setLang} />
          <Link to="/login" className="btn btn-primary" style={{ padding: "10px 16px" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
            {t.nav.loginBt}
          </Link>
        </div>
      </div>
      <style>{`@media (max-width: 880px) { .sf-nav-links { display: none !important; } }`}</style>
    </header>
  )
}
