import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Appartements', href: '/listings?category=apartment' },
  { label: 'Maisons',      href: '/listings?category=house'     },
  { label: 'Villas',       href: '/listings?category=villa'     },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const transparent = isHome && !scrolled

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-clay-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between"
           style={{ height: '72px' }}>

        {/* Logo */}
        <Link
          to="/"
          className={`font-display text-2xl tracking-wide transition-colors duration-300 ${
            transparent ? 'text-white' : 'text-clay-900'
          }`}
        >
          Alta <span className="font-light italic">Immobilier</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-sans text-sm tracking-wide transition-colors duration-300 hover:text-terra ${
                transparent ? 'text-white/85' : 'text-clay-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className={`md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 transition-colors ${
              transparent ? 'text-white' : 'text-clay-900'
            }`}
            aria-label="Menu"
          >
            <span className={`block h-px w-full bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-full bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-clay-100 px-6 py-6 flex flex-col gap-4">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm text-clay-800 hover:text-terra transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
