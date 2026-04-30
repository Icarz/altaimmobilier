import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    href: '/admin',
    exact: true,
    label: 'Tableau de bord',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
      </svg>
    ),
  },
  {
    href: '/admin/listings',
    label: 'Annonces',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
      </svg>
    ),
  },
  {
    href: '/admin/listings/new',
    label: 'Nouvelle annonce',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const { pathname } = useLocation()
  const { logout }   = useAuth()
  const navigate     = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  function isActive(href, exact) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <aside className="w-60 shrink-0 bg-clay-900 flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-clay-800">
        <Link to="/" className="font-display text-white text-xl">
          Alta <span className="italic font-light">Immobilier</span>
        </Link>
        <p className="font-sans text-xs text-clay-500 mt-1 tracking-widest uppercase">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV.map(item => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-sm transition-all duration-200 ${
                active
                  ? 'bg-terra text-white'
                  : 'text-clay-400 hover:bg-clay-800 hover:text-white'
              }`}
            >
              <span className={active ? 'text-white' : 'text-clay-500'}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-clay-800 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-sm text-clay-400 hover:bg-clay-800 hover:text-white transition-all duration-200"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-clay-500">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
          </svg>
          Déconnexion
        </button>

        <Link
          to="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-sans text-sm text-clay-600 hover:text-clay-400 transition-colors mt-1"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          Voir le site
        </Link>
      </div>
    </aside>
  )
}
