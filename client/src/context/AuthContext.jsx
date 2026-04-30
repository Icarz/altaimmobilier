import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Mock credentials — in production these come from the server
const MOCK_EMAIL    = 'admin@altaimmobilier.com'
const MOCK_PASSWORD = 'admin123'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('alta_admin_token'))

  const isAuthenticated = Boolean(token)

  function login(email, password) {
    if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
      const mockToken = 'mock-jwt-' + Date.now()
      localStorage.setItem('alta_admin_token', mockToken)
      setToken(mockToken)
      return { ok: true }
    }
    return { ok: false, error: 'Email ou mot de passe incorrect.' }
  }

  function logout() {
    localStorage.removeItem('alta_admin_token')
    setToken(null)
  }

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
