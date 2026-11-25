import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import LandingPage from './pages/LandingPage'
import AuthPortal from './pages/AuthPortal'
import PassengerDashboard from './pages/PassengerDashboard'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminModulePlaceholder from './pages/AdminModulePlaceholder'
import PassengerQRBoarding from './pages/PassengerQRBoarding'
import ConductorScanner from './pages/ConductorScanner'
import SettlementSummary from './pages/SettlementSummary'
import AdminReportsManagement from './pages/AdminReportsManagement'
import OfflineSync from './pages/OfflineSync'
import ConductorPlaceholder from './pages/ConductorPlaceholder'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerModulePlaceholder from './pages/OwnerModulePlaceholder'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/register" element={<AuthPortal />} />
        <Route path="/passenger" element={<PassengerDashboard />} />
        <Route path="/passenger/wallet" element={<PassengerDashboard initialTab="wallet" />} />
        <Route path="/passenger/booking" element={<PassengerDashboard initialTab="booking" />} />
        <Route path="/passenger/scan-qr" element={<PassengerQRBoarding />} />
        <Route path="/passenger/boarding" element={<PassengerQRBoarding />} />
        <Route path="/conductor/scanner" element={<ConductorScanner />} />
        <Route path="/conductor/sync" element={<OfflineSync />} />
        <Route path="/conductor/dashboard" element={<ConductorPlaceholder title="Dashboard" />} />
        <Route path="/conductor/profile" element={<ConductorPlaceholder title="Profile" />} />
        <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/settlements" element={<SettlementSummary />} />
        <Route path="/owner/:module" element={<OwnerModulePlaceholder />} />
        <Route path="/operator" element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="/settlements" element={<SettlementSummary />} />
        <Route path="/admin/reports" element={<AdminReportsManagement />} />
        <Route path="/admin/management" element={<AdminReportsManagement />} />
        <Route path="/admin" element={<AdminReportsManagement />} />
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
