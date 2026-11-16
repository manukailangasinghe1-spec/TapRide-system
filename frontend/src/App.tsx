import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import LandingPage from './pages/LandingPage'
import AuthPortal from './pages/AuthPortal'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminModulePlaceholder from './pages/AdminModulePlaceholder'

// Each /admin route wraps its page in the shared AdminLayout (title, top bar,
// sidebar). Explicit routes only — no catch-all.
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/register" element={<AuthPortal />} />

        <Route path="/admin" element={<Navigate to="/admin/settings" replace />} />
        <Route
          path="/admin/settings"
          element={
            <AdminLayout
              title="TapRide - System Oversight & Audit"
              subtitle="Manage your TapRide system configuration and preferences"
              footerNote="All configuration changes are logged for audit purposes."
            >
              <AdminSettingsPage />
            </AdminLayout>
          }
        />

        {/* Placeholder modules owned by other tickets (Sprint 2) */}
        {[
          { path: 'dashboard', title: 'Dashboard' },
          { path: 'live-operations', title: 'Live Operations' },
          { path: 'passengers', title: 'Passengers' },
          { path: 'bus-owners', title: 'Bus Owners' },
          { path: 'fleet', title: 'Fleet Management' },
          { path: 'conductors', title: 'Conductors' },
          { path: 'routes-fares', title: 'Routes & Fares' },
          { path: 'transactions', title: 'Transactions' },
          { path: 'settlements', title: 'Settlements' },
          { path: 'reports', title: 'Reports' },
        ].map(({ path, title }) => (
          <Route
            key={path}
            path={`/admin/${path}`}
            element={
              <AdminLayout title={`TapRide - ${title}`} subtitle={`Manage ${title.toLowerCase()} across the TapRide system`}>
                <AdminModulePlaceholder title={title} />
              </AdminLayout>
            }
          />
        ))}
      </Routes>
    </Router>
  )
}

export default App
