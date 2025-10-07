import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import PatientDetail from './pages/PatientDetail'
import PatientMetrics from './pages/PatientMetrics'
import Visualization from './pages/Visualization'
import Analytics from './pages/Analytics'

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patient/:id" element={<PatientDetail />} />
        <Route path="/patients" element={<PatientMetrics />} />
        <Route path="/3d-view" element={<Visualization />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Layout>
  )
}

export default App