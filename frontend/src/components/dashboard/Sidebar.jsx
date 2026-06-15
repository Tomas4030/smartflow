import { Logomark } from '../Logomark'
import { Ic } from './Icons'

export function Sidebar({ active, onLogout, municipality }) {

  const navItems = [
    { key: "dashboard", label: "Painel", icon: Ic.grid, href: "/index.html" }, 
    { key: "intersections", label: "Interseções", icon: Ic.traffic, href: "/intersections.html" },
    { key: "detections", label: "Eventos", icon: Ic.camera, href: "/events.html" }, 
    { key: "alerts", label: "Alertas", icon: Ic.bell, href: "#" },
    { key: "settings", label: "Configurações", icon: Ic.settings, href: "#" },
  ]

  return (
    <aside style={{ width: 240, flexShrink: 0, height: "100vh", background: "var(--bg-2)", borderRight: "1px solid var(--hairline)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--hairline)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Logomark size={32} />
          <div>
            <div className="display" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Smart<span style={{ color: "var(--accent)" }}>Flow</span>
            </div>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: "var(--fg-muted)", textTransform: "uppercase", marginTop: 1 }}>
              {municipality}
            </div>
          </div>
        </div>
      </div>
      
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {navItems.map(({ key, label, icon, href }) => {
          const isActive = active === key
          return (

            <a 
              key={key} 
              href={href} 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                padding: "10px 12px", 
                borderRadius: "var(--radius)", 
                background: isActive ? "color-mix(in oklch, var(--accent) 15%, var(--surface))" : "transparent", 
                color: isActive ? "var(--fg)" : "var(--fg-dim)", 
                border: isActive ? "1px solid color-mix(in oklch, var(--accent) 30%, var(--hairline))" : "1px solid transparent", 
                fontSize: 13.5, 
                fontWeight: isActive ? 500 : 400, 
                cursor: "pointer", 
                transition: "all .15s", 
                textAlign: "left", 
                width: "100%",
                textDecoration: "none", 
                boxSizing: "border-box"
              }}
            >
              <span style={{ color: isActive ? "var(--accent)" : "var(--fg-muted)", display: "flex" }}>{icon}</span>
              {label}
            </a>
          )
        })}
      </nav>
      
      <div style={{ padding: "14px 16px", borderTop: "1px solid var(--hairline)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 8px var(--green)" }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg)" }}>Sistema Online</div>
            <div className="mono" style={{ fontSize: 9.5, color: "var(--fg-muted)", letterSpacing: "0.06em" }}>Operacional</div>
          </div>
        </div>
        <button onClick={onLogout} title="Sair" style={{ width: 30, height: 30, display: "grid", placeItems: "center", borderRadius: 8, border: "1px solid var(--hairline)", background: "var(--surface)", color: "var(--fg-muted)", cursor: "pointer" }}>
          {Ic.logout}
        </button>
      </div>
    </aside>
  )
}