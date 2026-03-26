import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import AadhaarPage from './components/pages/AadhaarPage'
import LanguagePage from './components/pages/LanguagePage'
import SymptomsPage from './components/pages/SymptomsPage'
import FollowUpPage from './components/pages/FollowUpPage'
import TriagePage from './components/pages/TriagePage'
import ReportPage from './components/pages/ReportPage'
import AppointmentPage from './components/pages/AppointmentPage'
import DashboardPage from './components/pages/DashboardPage'
import './index.css'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AadhaarPage />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/symptoms" element={<SymptomsPage />} />
          <Route path="/followup" element={<FollowUpPage />} />
          <Route path="/triage" element={<TriagePage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
