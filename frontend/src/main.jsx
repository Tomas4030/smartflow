import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import App from './pages/Landing'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'
import { DashboardLayout, StubPage } from './pages/DashboardLayout'
import { IntersectionsPage } from './pages/Intersections'
import { EventsPage } from './pages/Events'
import { AdminLayout } from './pages/AdminLayout'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import AdminApprovals from './pages/AdminApprovals'
import AdminHistory from './pages/AdminHistory'
import AdminMunicipalities from './pages/AdminMunicipalities'
import AdminLoginPage from './pages/AdminLogin'
import ClientRegister from './pages/ClientRegister'
import ClientLogin from './pages/ClientLogin'
import ClientProfile from './pages/ClientProfile'
import ClientSOS from './pages/ClientSOS'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sf_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const token = localStorage.getItem('sf_token')
  if (!token) return <Navigate to="/admin/login" replace />
  const raw = localStorage.getItem('sf_user')
  const user = raw ? JSON.parse(raw) : null
  if (user?.role !== 'superadmin') return <Navigate to="/login" replace />
  return children
}

function AuthRedirect({ children }) {
  const token = localStorage.getItem('sf_token')
  if (token) {
    const raw = localStorage.getItem('sf_user')
    const user = raw ? JSON.parse(raw) : null
    return <Navigate to={user?.role === 'superadmin' ? '/admin' : '/dashboard'} replace />
  }
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Municipality dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="intersections" element={<IntersectionsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="alerts" element={<StubPage title="Alertas" eyebrow="NOTIFICAÇÕES" />} />
          <Route path="settings" element={<StubPage title="Configurações" eyebrow="SISTEMA" />} />
        </Route>

        {/* Super Admin area */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="history" element={<AdminHistory />} />
          <Route path="municipalities" element={<AdminMunicipalities />} />
        </Route>

        {/* Citizen SOS area */}
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/client/sos" element={<ClientSOS />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
