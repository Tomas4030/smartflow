import { Outlet } from 'react-router-dom'
import { AUTH } from '../auth'
import { DashboardNav } from '../components/dashboard/DashboardNav'

export function StubPage({ title, eyebrow }) {
  return (
    <div style={{ padding: "60px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="display" style={{ fontSize: 36, fontWeight: 500, margin: 0, color: "var(--fg)" }}>{title}</h2>
      <p style={{ color: "var(--fg-muted)", maxWidth: 420, lineHeight: 1.55, fontSize: 15 }}>
        Esta secção está em desenvolvimento.
      </p>
    </div>
  )
}

export function DashboardLayout() {
  const user = AUTH.getUser()
  const municipality = user?.municipality || "SmartFlow"

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <DashboardNav municipality={municipality} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  )
}
