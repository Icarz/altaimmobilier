import { useSearchParams } from 'react-router-dom'
import PublicLayout    from '../layouts/PublicLayout'
import ListingCard     from '../components/listings/ListingCard'
import ListingFilters  from '../components/listings/ListingFilters'
import { listings }    from '../data/mockData'

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const type     = searchParams.get('type')     ?? ''

  function setCategory(val) {
    const next = new URLSearchParams(searchParams)
    if (val) next.set('category', val)
    else next.delete('category')
    setSearchParams(next)
  }

  function setType(val) {
    const next = new URLSearchParams(searchParams)
    if (val) next.set('type', val)
    else next.delete('type')
    setSearchParams(next)
  }

  const filtered = listings.filter(l => {
    if (l.status === 'sold_rented') return false
    if (category && l.category !== category) return false
    if (type     && l.listing_type !== type) return false
    return true
  })

  const pageTitle = () => {
    const parts = []
    if (category === 'apartment') parts.push('Appartements')
    else if (category === 'house') parts.push('Maisons')
    else if (category === 'villa') parts.push('Villas')
    else parts.push('Tous les biens')
    if (type === 'sale') parts.push('à vendre')
    else if (type === 'rent') parts.push('à louer')
    return parts.join(' ')
  }

  return (
    <PublicLayout>
      {/* Page header */}
      <div className="pt-24 pb-10 bg-white border-b border-clay-100">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="font-display text-5xl lg:text-6xl text-clay-900 font-light mb-2">
            {pageTitle()}
          </h1>
          <p className="font-sans text-clay-500 text-sm">
            {filtered.length} bien{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ListingFilters
        category={category}
        type={type}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        total={filtered.length}
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-4xl text-clay-300 mb-4">Aucun résultat</p>
            <p className="font-sans text-clay-400 text-sm">
              Aucun bien ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
