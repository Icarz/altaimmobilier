import { Link } from 'react-router-dom'
import { getCoverPhoto, formatPrice, CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS } from '../../data/mockData'

export default function ListingsTable({ listings, onDelete }) {
  if (listings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-clay-100 p-16 text-center">
        <p className="font-display text-2xl text-clay-400 mb-2">Aucune annonce</p>
        <p className="font-sans text-sm text-clay-400">Aucune annonce ne correspond aux filtres sélectionnés.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-clay-100">
            <th className="text-left font-sans text-xs text-clay-500 tracking-widest uppercase px-6 py-4">Bien</th>
            <th className="text-left font-sans text-xs text-clay-500 tracking-widest uppercase px-4 py-4 hidden md:table-cell">Catégorie</th>
            <th className="text-left font-sans text-xs text-clay-500 tracking-widest uppercase px-4 py-4 hidden lg:table-cell">Type</th>
            <th className="text-left font-sans text-xs text-clay-500 tracking-widest uppercase px-4 py-4">Prix</th>
            <th className="text-left font-sans text-xs text-clay-500 tracking-widest uppercase px-4 py-4 hidden md:table-cell">Statut</th>
            <th className="text-right font-sans text-xs text-clay-500 tracking-widest uppercase px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-clay-50">
          {listings.map(listing => (
            <tr key={listing._id} className="table-row-hover transition-colors">
              {/* Title + thumbnail */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-clay-100">
                    <img
                      src={getCoverPhoto(listing)}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-clay-900 line-clamp-1">{listing.title}</p>
                    <p className="font-sans text-xs text-clay-400 mt-0.5">{listing.location}</p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-4 py-4 hidden md:table-cell">
                <span className="font-sans text-sm text-clay-700">
                  {CATEGORY_LABELS[listing.category]}
                </span>
              </td>

              {/* Type */}
              <td className="px-4 py-4 hidden lg:table-cell">
                <span className={`font-sans text-xs font-medium px-2.5 py-1 rounded-full ${
                  listing.listing_type === 'sale'
                    ? 'bg-terra-50 text-terra-600'
                    : 'bg-blue-50 text-azure'
                }`}>
                  {listing.listing_type === 'sale' ? 'Vente' : 'Location'}
                </span>
              </td>

              {/* Price */}
              <td className="px-4 py-4">
                <span className="font-display text-base text-gold">
                  {formatPrice(listing.price_mad, listing.price_eur, listing.listing_type)}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-4 hidden md:table-cell">
                <span className={`font-sans text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[listing.status]}`}>
                  {STATUS_LABELS[listing.status]}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    to={`/admin/listings/${listing._id}/edit`}
                    className="font-sans text-xs px-3 py-1.5 rounded-lg border border-clay-200 text-clay-700 hover:border-terra hover:text-terra transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => onDelete(listing._id)}
                    className="font-sans text-xs px-3 py-1.5 rounded-lg border border-clay-200 text-clay-500 hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
