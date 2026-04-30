import { useParams, Link, Navigate } from 'react-router-dom'
import PublicLayout  from '../layouts/PublicLayout'
import PhotoGallery  from '../components/listings/PhotoGallery'
import { getListingById, formatPrice, CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../data/mockData'

function Spec({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-clay-100 last:border-0">
      <span className="font-sans text-sm text-clay-500">{label}</span>
      <span className="font-sans text-sm font-medium text-clay-900">{value}</span>
    </div>
  )
}

export default function ListingDetail() {
  const { id }    = useParams()
  const listing   = getListingById(id)

  if (!listing) return <Navigate to="/listings" replace />

  const isSale   = listing.listing_type === 'sale'
  const isHidden = listing.status === 'sold_rented'

  return (
    <PublicLayout>
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 font-sans text-sm text-clay-400 mb-8">
            <Link to="/" className="hover:text-terra transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/listings" className="hover:text-terra transition-colors">Annonces</Link>
            <span>/</span>
            <Link
              to={`/listings?category=${listing.category}`}
              className="hover:text-terra transition-colors"
            >
              {CATEGORY_LABELS[listing.category]}s
            </Link>
            <span>/</span>
            <span className="text-clay-700 line-clamp-1">{listing.title}</span>
          </nav>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Left — gallery (3/5) */}
            <div className="lg:col-span-3">
              <PhotoGallery photos={listing.photos} />
            </div>

            {/* Right — details (2/5) */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className={`font-sans text-xs font-semibold px-3 py-1 rounded-full ${
                  isSale ? 'bg-terra text-white' : 'bg-azure text-white'
                }`}>
                  {isSale ? 'À vendre' : 'À louer'}
                </span>
                <span className="font-sans text-xs font-medium px-3 py-1 rounded-full bg-clay-100 text-clay-700">
                  {CATEGORY_LABELS[listing.category]}
                </span>
                <span className={`font-sans text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[listing.status]}`}>
                  {STATUS_LABELS[listing.status]}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl lg:text-4xl text-clay-900 font-light leading-snug mb-3">
                {listing.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-clay-500 mb-6">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="font-sans text-sm">{listing.location}</span>
              </div>

              {/* Price */}
              <div className="bg-clay-50 rounded-2xl p-6 mb-8">
                <p className="font-sans text-xs text-clay-400 tracking-widest uppercase mb-1">
                  {isSale ? 'Prix de vente' : 'Loyer mensuel'}
                </p>
                <p className="font-display text-4xl text-gold font-medium">
                  {formatPrice(listing.price, listing.listing_type)}
                </p>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <Spec label="Surface"          value={`${listing.surface_area} m²`} />
                <Spec label="Pièces"           value={listing.rooms} />
                <Spec label="Salles de bain"   value={listing.bathrooms} />
                {listing.floor != null && (
                  <Spec label="Étage"          value={listing.floor} />
                )}
                <Spec label="Type"             value={CATEGORY_LABELS[listing.category]} />
                <Spec label="Transaction"      value={isSale ? 'Vente' : 'Location'} />
              </div>

              {/* Contact CTA */}
              {!isHidden && (
                <a
                  href="tel:+212522000000"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-terra text-white
                             font-sans rounded-2xl hover:bg-terra-600 transition-colors duration-300 mb-3"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  Nous appeler
                </a>
              )}
              <Link
                to="/listings"
                className="w-full flex items-center justify-center gap-2 py-3 border border-clay-200
                           text-clay-600 font-sans text-sm rounded-2xl hover:border-clay-400 transition-colors"
              >
                ← Retour aux annonces
              </Link>
            </div>
          </div>

          {/* Description */}
          <div className="mt-14 max-w-3xl">
            <h2 className="font-display text-3xl text-clay-900 font-light mb-5">Description</h2>
            <div className="w-10 h-px bg-terra mb-6" />
            <p className="font-sans text-clay-700 leading-relaxed text-base">
              {listing.description}
            </p>
          </div>

        </div>
      </div>
    </PublicLayout>
  )
}
