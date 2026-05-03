import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PublicLayout   from '../layouts/PublicLayout'
import ListingCard    from '../components/listings/ListingCard'
import ListingFilters from '../components/listings/ListingFilters'
import { api }        from '../lib/api'

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? ''
  const type     = searchParams.get('type')     ?? ''

  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    api.getListings({ category, type })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [category, type])

  function setCategory(val) {
    const next = new URLSearchParams(searchParams)
    if (val) next.set('category', val); else next.delete('category')
    setSearchParams(next)
  }

  function setType(val) {
    const next = new URLSearchParams(searchParams)
    if (val) next.set('type', val); else next.delete('type')
    setSearchParams(next)
  }

  const pageTitle = () => {
    const parts = []
    if      (category === 'apartment') parts.push('Appartements')
    else if (category === 'house')     parts.push('Maisons')
    else if (category === 'villa')     parts.push('Villas')
    else                               parts.push('Tous les biens')
    if      (type === 'sale') parts.push('à vendre')
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
            {loading ? 'Chargement…' : `${listings.length} bien${listings.length !== 1 ? 's' : ''} disponible${listings.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <ListingFilters
        category={category}
        type={type}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        total={listings.length}
      />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl bg-clay-100 animate-pulse aspect-[4/3]" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-4xl text-clay-300 mb-4">Aucun résultat</p>
            <p className="font-sans text-clay-400 text-sm">
              Aucun bien ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
