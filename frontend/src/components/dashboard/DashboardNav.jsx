import { NavLink, useNavigate } from "react-router-dom";
import { Logomark } from "../Logomark";
import { Ic } from "./Icons";
import { AUTH } from "../../auth";

const navItems = [
  { to: "/dashboard", label: "Painel", icon: Ic.grid, end: true },
  { to: "/dashboard/intersections", label: "Cruzamentos", icon: Ic.traffic },
  { to: "/dashboard/events", label: "Eventos", icon: Ic.camera },
  { to: "/dashboard/alerts", label: "Alertas", icon: Ic.bell },
  { to: "/dashboard/settings", label: "Configurações", icon: Ic.settings },
];

export function DashboardNav({ municipality }) {
  const navigate = useNavigate();
  const user = AUTH.getUser();
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <header
      style={{
        height: 58,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        background: "var(--bg-2)",
        borderBottom: "1px solid var(--hairline)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginRight: 28,
          flexShrink: 0,
        }}
      >
        <Logomark size={28} />
        <div>
          <div
            className="display"
            style={{
              fontSize: 14.5,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Smart<span style={{ color: "var(--accent)" }}>Flow</span>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.1em",
              color: "var(--fg-muted)",
              textTransform: "uppercase",
              marginTop: 1,
            }}
          >
            {municipality}
          </div>
        </div>
      </div>

      <nav style={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 12px",
              borderRadius: "var(--radius)",
              fontSize: 13.5,
              color: isActive ? "var(--fg)" : "var(--fg-dim)",
              background: isActive
                ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
                : "transparent",
              border: `1px solid ${isActive ? "color-mix(in oklch, var(--accent) 28%, var(--hairline))" : "transparent"}`,
              fontWeight: isActive ? 500 : 400,
              textDecoration: "none",
              transition: "all .15s",
            })}
          >
            <span style={{ display: "flex" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 300), oklch(0.30 0.15 300))",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 12,
              border: "1px solid var(--hairline-2)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          {user?.name && (
            <div>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "var(--fg)",
                  lineHeight: 1.2,
                }}
              >
                {user.name}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 9.5,
                  color: "var(--fg-muted)",
                  letterSpacing: "0.06em",
                }}
              >
                {user.role}
              </div>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            AUTH.logout();
            navigate("/login", { replace: true });
          }}
          title="Sair"
          style={{
            width: 30,
            height: 30,
            display: "grid",
            placeItems: "center",
            borderRadius: 8,
            border: "1px solid var(--hairline)",
            background: "var(--surface)",
            color: "var(--fg-muted)",
            cursor: "pointer",
          }}
        >
          {Ic.logout}
        </button>
      </div>
    </header>
  );
}
