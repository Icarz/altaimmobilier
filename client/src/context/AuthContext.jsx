import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  // Verify session on mount
  useEffect(() => {
    api.me()
      .then(data => setIsAuthenticated(data.authenticated === true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setChecking(false))
  }, [])

  async function login(email, password) {
    try {
      await api.login(email, password)
      setIsAuthenticated(true)
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message || 'Email ou mot de passe incorrect.' }
    }
  }

  async function logout() {
    await api.logout().catch(() => {})
    setIsAuthenticated(false)
  }

  // Don't render until session check is done (prevents redirect flicker)
  if (checking) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
