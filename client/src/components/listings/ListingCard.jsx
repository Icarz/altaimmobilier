import { Link } from 'react-router-dom'
import { getCoverPhoto, formatPrice, CATEGORY_LABELS } from '../../data/mockData'

function BedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v3H2V5zM1 10a1 1 0 011-1h16a1 1 0 011 1v4a1 1 0 01-1 1H3v1a1 1 0 11-2 0v-6z"/>
    </svg>
  )
}
function AreaIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm8 1H8v2h4V5zm-4 4h4v2H8V9zm0 4h4v2H8v-2z" clipRule="evenodd"/>
    </svg>
  )
}
function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
    </svg>
  )
}

export default function ListingCard({ listing }) {
  const cover  = getCoverPhoto(listing)
  const isSale = listing.listing_type === 'sale'
  const isSoldRented = listing.status === 'sold_rented'

  return (
    <Link
      to={`/listings/${listing.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={cover}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`font-sans text-xs font-semibold px-2.5 py-1 rounded-full ${
            isSale ? 'bg-terra text-white' : 'bg-azure text-white'
          }`}>
            {isSale ? 'Vente' : 'Location'}
          </span>
          <span className="font-sans text-xs font-medium px-2.5 py-1 rounded-full bg-clay-900/70 text-white backdrop-blur-sm">
            {CATEGORY_LABELS[listing.category]}
          </span>
          {isSoldRented && (
            <span className="font-sans text-xs font-semibold px-2.5 py-1 rounded-full bg-clay-700 text-white">
              {isSale ? 'Vendu' : 'Loué'}
            </span>
          )}
        </div>

        {/* Price overlay on hover */}
        <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-clay-900/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <p className="font-display text-white text-xl">Voir le bien →</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-clay-500 mb-2">
          <PinIcon />
          <span className="font-sans text-xs">{listing.location}</span>
        </div>

        <h3 className="font-display text-xl text-clay-900 leading-snug mb-3 line-clamp-2">
          {listing.title}
        </h3>

        <div className="flex items-center gap-4 text-clay-500 mb-4">
          <span className="flex items-center gap-1.5 font-sans text-sm">
            <BedIcon /> {listing.rooms} ch.
          </span>
          <span className="w-px h-4 bg-clay-200" />
          <span className="flex items-center gap-1.5 font-sans text-sm">
            <AreaIcon /> {listing.surface_area} m²
          </span>
          {listing.floor != null && (
            <>
              <span className="w-px h-4 bg-clay-200" />
              <span className="font-sans text-sm">Ét. {listing.floor}</span>
            </>
          )}
        </div>

        <div className="border-t border-clay-100 pt-4">
          <p className="font-display text-xl text-gold font-medium leading-snug">
            {formatPrice(listing.price_mad, listing.price_eur, listing.listing_type)}
          </p>
        </div>
      </div>
    </Link>
  )
}
