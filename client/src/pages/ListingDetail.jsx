import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PhotoGallery from '../components/listings/PhotoGallery'
import ListingMap   from '../components/listings/ListingMap'
import { api }      from '../lib/api'
import { formatPrice, CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../data/mockData'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '212662018283'

function Spec({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-clay-100 last:border-0">
      <span className="font-sans text-sm text-clay-500">{label}</span>
      <span className="font-sans text-sm font-medium text-clay-900">{value}</span>
    </div>
  )
}

export default function ListingDetail() {
  const { slug } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.getListing(slug)
      .then(setListing)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <PublicLayout>
        <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-clay-100 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
              <div className="lg:col-span-3 aspect-[4/3] bg-clay-100 rounded-2xl" />
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-clay-100 rounded w-3/4" />
                <div className="h-10 bg-clay-100 rounded" />
                <div className="h-32 bg-clay-100 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (notFound || !listing) return <Navigate to="/listings" replace />

  const isSale      = listing.listing_type === 'sale'
  const isSoldRented = listing.status === 'sold_rented'

  const waMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le bien "${listing.title}" (${listing.location}). Pouvez-vous me donner plus d'informations ?`
  )
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${waMessage}`

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
            <Link to={`/listings?category=${listing.category}`} className="hover:text-terra transition-colors">
              {CATEGORY_LABELS[listing.category]}s
            </Link>
            <span>/</span>
            <span className="text-clay-700 line-clamp-1">{listing.title}</span>
          </nav>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

            {/* Left — gallery */}
            <div className="lg:col-span-3">
              <PhotoGallery photos={listing.photos} />
            </div>

            {/* Right — details */}
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
                <p className="font-display text-3xl text-gold font-medium leading-snug">
                  {formatPrice(listing.price_mad, listing.price_eur, listing.listing_type)}
                </p>
              </div>

              {/* Specs */}
              <div className="mb-8">
                <Spec label="Surface"        value={`${listing.surface_area} m²`} />
                <Spec label="Pièces"         value={listing.rooms} />
                <Spec label="Salles de bain" value={listing.bathrooms} />
                {listing.floor != null && <Spec label="Étage" value={listing.floor} />}
                <Spec label="Type"           value={CATEGORY_LABELS[listing.category]} />
                <Spec label="Transaction"    value={isSale ? 'Vente' : 'Location'} />
              </div>

              {/* WhatsApp CTA — hidden when sold/rented */}
              {!isSoldRented && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white
                             font-sans rounded-2xl hover:bg-[#1ebe57] transition-colors duration-300 mb-3"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contacter sur WhatsApp
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

          {/* Map */}
          <div className="mt-14">
            <h2 className="font-display text-3xl text-clay-900 font-light mb-5">Localisation</h2>
            <div className="w-10 h-px bg-terra mb-6" />
            <ListingMap location={listing.location} />
          </div>

        </div>
      </div>
    </PublicLayout>
  )
}
