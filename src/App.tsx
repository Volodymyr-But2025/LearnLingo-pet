import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthModal } from './components/AuthModal/AuthModal'
import { Header } from './components/Header/Header'
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage'
import { HomePage } from './pages/HomePage/HomePage'
import { TeachersPage } from './pages/TeachersPage/TeachersPage'
import styles from './App.module.css'

type AuthMode = 'login' | 'register' | null

function AppShell() {
  const [authMode, setAuthMode] = useState<AuthMode>(null)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className={`${styles.app}${isHome ? ` ${styles.home}` : ''}`}>
      <Header onLogin={() => setAuthMode('login')} onRegister={() => setAuthMode('register')} />
      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <FavoritesPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <AppShell />
      </FavoritesProvider>
    </AuthProvider>
  )
}
