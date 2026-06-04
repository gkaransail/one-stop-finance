import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ThemesPage } from '@/pages/ThemesPage'
import { OptionsPage } from '@/pages/OptionsPage'
import { InsidersPage } from '@/pages/InsidersPage'
import { SentimentPage } from '@/pages/SentimentPage'
import { TrendPage } from '@/pages/TrendPage'
import { SearchPage } from '@/pages/SearchPage'
import { UpgradePage } from '@/pages/UpgradePage'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* App shell — authenticated routes */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/insiders" element={<InsidersPage />} />
        <Route path="/sentiment" element={<SentimentPage />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/alerts" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
