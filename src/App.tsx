import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import PatientDetail from './pages/PatientDetail'
import PatientMetrics from './pages/PatientMetrics'
import Visualization from './pages/Visualization'

import Login from './pages/Login'
import AuthService from './services/authService'
import { wsService } from './services/websocket'
import NotificationToast from './components/common/NotificationToast'

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = AuthService.isAuthenticated()
    setIsAuthenticated(isAuth)

    if (isAuth) {
      // Set auth header for API calls
      AuthService.setAuthHeader()
      // Initialize WebSocket connection if authenticated
      wsService.connect()
    }
    
    return () => {
      wsService.disconnect()
    }
  }, [])

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients" element={<PatientMetrics />} />
          <Route path="/3d-view" element={<Visualization />} />
          <Route path="/3d-view/:id" element={<Visualization />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <NotificationToast />
    </>
  )
}

export default App