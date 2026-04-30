import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-clay-900 text-clay-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <p className="font-display text-white text-3xl mb-3">
              Alta <span className="italic font-light">Immobilier</span>
            </p>
            <p className="font-sans text-sm leading-relaxed text-clay-500">
              L'immobilier d'exception au Maroc.<br />
              Appartements, maisons et villas<br />
              à vendre et à louer.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-clay-600 mb-5">Explorer</p>
            <ul className="space-y-3">
              {[
                { label: 'Appartements', href: '/listings?category=apartment' },
                { label: 'Maisons',      href: '/listings?category=house'     },
                { label: 'Villas',       href: '/listings?category=villa'     },
                { label: 'Tous les biens', href: '/listings'                  },
              ].map(l => (
                <li key={l.href}>
                  <Link to={l.href} className="font-sans text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs tracking-widest uppercase text-clay-600 mb-5">Contact</p>
            <ul className="space-y-3 text-sm font-sans">
              <li className="text-clay-400">123 Boulevard Zerktouni</li>
              <li className="text-clay-400">Casablanca 20100, Maroc</li>
              <li>
                <a href="tel:+212522000000" className="hover:text-white transition-colors">
                  +212 5 22 00 00 00
                </a>
              </li>
              <li>
                <a href="mailto:contact@altaimmobilier.ma" className="hover:text-white transition-colors">
                  contact@altaimmobilier.ma
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-clay-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-clay-600">
            © {new Date().getFullYear()} Alta Immobilier. Tous droits réservés.
          </p>
          <Link
            to="/admin/login"
            className="font-sans text-xs text-clay-700 hover:text-clay-500 transition-colors"
          >
            Espace Administrateur
          </Link>
        </div>
      </div>
    </footer>
  )
}
