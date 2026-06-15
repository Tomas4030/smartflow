import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles.css'
import App from './pages/Landing'
import LoginPage from './pages/Login'
import DashboardPage from './pages/Dashboard'

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
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
