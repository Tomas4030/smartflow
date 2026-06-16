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

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sf_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AuthRedirect({ children }) {
  const token = localStorage.getItem('sf_token')
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="intersections" element={<IntersectionsPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="alerts" element={<StubPage title="Alertas" eyebrow="NOTIFICAÇÕES" />} />
          <Route path="settings" element={<StubPage title="Configurações" eyebrow="SISTEMA" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
