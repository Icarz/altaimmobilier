import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  if (isAuthenticated) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simulate network latency
    await new Promise(r => setTimeout(r, 600))

    const result = await login(email, password)
    setLoading(false)

    if (result.ok) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-clay-900 flex">

      {/* Left — branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-16">
        <img
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=1600&fit=crop&q=85"
          alt="Alta Immobilier"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10">
          <p className="font-display italic text-terra-200 text-xl mb-4">
            L'immobilier d'exception
          </p>
          <h1 className="font-display text-white text-6xl font-light leading-none">
            Alta<br />
            <span className="italic">Immobilier</span>
          </h1>
          <p className="font-sans text-clay-400 mt-6 text-sm leading-relaxed max-w-xs">
            Gérez votre catalogue de biens immobiliers depuis votre tableau de bord sécurisé.
          </p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <p className="font-display text-white text-3xl">
              Alta <span className="italic font-light">Immobilier</span>
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-display text-white text-4xl font-light mb-2">
              Connexion
            </h2>
            <p className="font-sans text-clay-500 text-sm">
              Espace réservé à l'administrateur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-300 font-sans text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-clay-400 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@altaimmobilier.com"
                className="w-full bg-clay-800 border border-clay-700 text-white font-sans text-sm
                           rounded-xl px-4 py-3 outline-none placeholder:text-clay-600
                           focus:border-terra transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-clay-400 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-clay-800 border border-clay-700 text-white font-sans text-sm
                           rounded-xl px-4 py-3 outline-none placeholder:text-clay-600
                           focus:border-terra transition-colors"
              />
            </div>

            {/* Hint */}
            <p className="font-sans text-xs text-clay-600">
              Démo : admin@altaimmobilier.com / admin123
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-terra text-white font-sans font-medium rounded-xl
                         hover:bg-terra-600 disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-300"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="font-sans text-sm text-clay-500 hover:text-clay-300 transition-colors">
              ← Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
