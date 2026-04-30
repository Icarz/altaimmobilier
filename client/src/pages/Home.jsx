import { Link } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import ListingCard  from '../components/listings/ListingCard'
import { listings, CATEGORY_LABELS } from '../data/mockData'

const CATEGORIES = [
  {
    id: 'apartment',
    label: 'Appartements',
    sub: 'En ville, au cœur de la vie',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=1000&fit=crop&q=85',
  },
  {
    id: 'house',
    label: 'Maisons',
    sub: 'Espace, jardin, tranquillité',
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=1000&fit=crop&q=85',
  },
  {
    id: 'villa',
    label: 'Villas',
    sub: "L'art de vivre sans compromis",
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=1000&fit=crop&q=85',
  },
]

export default function Home() {
  const available = listings.filter(l => l.status === 'available')
  const featured  = available.slice(0, 6)

  const cats = CATEGORIES.map(c => ({
    ...c,
    count: available.filter(l => l.category === c.id).length,
  }))

  return (
    <PublicLayout>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-end pb-20">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&h=1200&fit=crop&q=90"
            alt="Alta Immobilier"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-clay-900/30 via-clay-900/50 to-clay-900/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {/* Eyebrow */}
          <p className="font-display italic text-terra-200 text-xl mb-4 animate-fade-in delay-200">
            L'immobilier d'exception
          </p>

          {/* Headline */}
          <h1 className="font-display font-light text-white leading-none mb-10 animate-fade-in-up delay-300">
            <span className="block text-6xl sm:text-8xl lg:text-[9rem]">Trouvez</span>
            <span className="block text-6xl sm:text-8xl lg:text-[9rem] italic ml-4 sm:ml-12">
              votre chez-vous
            </span>
          </h1>

          {/* Category pills */}
          <div className="flex flex-wrap gap-3 animate-fade-in delay-500">
            {cats.map(c => (
              <Link
                key={c.id}
                to={`/listings?category=${c.id}`}
                className="px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/25 text-white
                           font-sans text-sm rounded-full hover:bg-white hover:text-clay-900
                           transition-all duration-300"
              >
                {c.label}
                <span className="ml-2 opacity-60 text-xs">({c.count})</span>
              </Link>
            ))}
            <Link
              to="/listings"
              className="px-5 py-2.5 bg-terra text-white font-sans text-sm rounded-full
                         hover:bg-terra-600 transition-colors duration-300"
            >
              Voir tous →
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-700">
          <span className="font-sans text-xs text-white/50 tracking-widest uppercase">Défiler</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <h2 className="font-display text-5xl lg:text-6xl text-clay-900 font-light mb-3">
            Nos catégories
          </h2>
          <div className="w-14 h-px bg-terra" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cats.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/listings?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl bg-clay-100"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-clay-900/85 via-clay-900/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="font-sans text-clay-300 text-sm mb-1.5">{cat.sub}</p>
                <h3 className="font-display text-white text-4xl font-light">{cat.label}</h3>
                <div className="flex items-center gap-2 mt-3">
                  <span className="font-sans text-white/60 text-sm">
                    {cat.count} bien{cat.count !== 1 ? 's' : ''}
                  </span>
                  <span className="text-terra-300 transition-transform duration-200 group-hover:translate-x-1 inline-block">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured listings ────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-display text-5xl lg:text-6xl text-clay-900 font-light mb-3">
                Sélection du moment
              </h2>
              <div className="w-14 h-px bg-terra" />
            </div>
            <Link
              to="/listings"
              className="hidden md:flex items-center gap-2 font-sans text-sm text-terra hover:gap-3 transition-all duration-200"
            >
              Voir tout →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 font-sans text-sm text-terra"
            >
              Voir toutes les annonces →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-clay-900">
        {/* Decorative geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              #C4622D 0,
              #C4622D 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-display italic text-terra text-xl mb-6">Alta Immobilier</p>
          <h2 className="font-display text-white font-light text-5xl lg:text-6xl mb-8 leading-tight">
            Vous n'avez pas trouvé<br />
            <span className="italic">ce que vous cherchez ?</span>
          </h2>
          <p className="font-sans text-clay-400 mb-10 max-w-lg mx-auto leading-relaxed">
            Notre équipe vous accompagne dans votre recherche et vous propose
            des biens en exclusivité, avant même leur mise en ligne.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-3 px-8 py-4 bg-terra text-white font-sans
                       rounded-full hover:bg-terra-600 transition-colors duration-300"
          >
            Explorer tous les biens →
          </Link>
        </div>
      </section>

    </PublicLayout>
  )
}
