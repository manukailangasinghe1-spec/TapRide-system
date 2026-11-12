import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPortal from './pages/AuthPortal'
import OwnerDashboard from './pages/OwnerDashboard'
import OwnerModulePlaceholder from './pages/OwnerModulePlaceholder'

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPortal />} />
        <Route path="/register" element={<AuthPortal />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/:module" element={<OwnerModulePlaceholder />} />
        <Route path="/operator" element={<Navigate to="/owner/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App
