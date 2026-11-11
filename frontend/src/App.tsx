import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AuthPortal from './pages/AuthPortal'
import PassengerDashboard from './pages/PassengerDashboard'

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
      </Routes>
    </Router>
  )
}

export default App
