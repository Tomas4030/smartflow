import { Outlet } from 'react-router-dom'
import { AdminNav } from '../components/dashboard/AdminNav'

export function AdminLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      <AdminNav />
      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  )
}
