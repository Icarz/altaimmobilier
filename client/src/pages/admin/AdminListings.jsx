import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout   from '../../layouts/AdminLayout'
import ListingsTable from '../../components/admin/ListingsTable'
import { api }       from '../../lib/api'

const CATEGORY_OPTS = [
  { value: '',          label: 'Toutes catégories' },
  { value: 'apartment', label: 'Appartements' },
  { value: 'house',     label: 'Maisons' },
  { value: 'villa',     label: 'Villas' },
]
const TYPE_OPTS = [
  { value: '',     label: 'Vente & Location' },
  { value: 'sale', label: 'À vendre' },
  { value: 'rent', label: 'À louer' },
]
const STATUS_OPTS = [
  { value: '',           label: 'Tous statuts' },
  { value: 'available',  label: 'Disponible' },
  { value: 'sold_rented', label: 'Vendu / Loué' },
]

export default function AdminListings() {
  const [listings, setListings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [category, setCategory] = useState('')
  const [type,     setType]     = useState('')
  const [status,   setStatus]   = useState('')
  const [search,   setSearch]   = useState('')
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.adminGetListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = listings.filter(l => {
    if (category && l.category     !== category) return false
    if (type     && l.listing_type !== type)     return false
    if (status   && l.status       !== status)   return false
    if (search   && !l.title.toLowerCase().includes(search.toLowerCase()) &&
                    !l.location.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  async function executeDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      await api.adminDeleteListing(toDelete)
      setListings(d => d.filter(l => l._id !== toDelete))
      setToDelete(null)
    } catch (err) {
      alert('Erreur lors de la suppression : ' + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AdminLayout title="Annonces">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <svg viewBox="0 0 20 20" fill="currentColor"
               className="w-4 h-4 text-clay-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-clay-200 text-clay-800
                       font-sans text-sm rounded-xl outline-none focus:border-terra transition-colors"
          />
        </div>

        {[
          { value: category, setter: setCategory, opts: CATEGORY_OPTS },
          { value: type,     setter: setType,     opts: TYPE_OPTS     },
          { value: status,   setter: setStatus,   opts: STATUS_OPTS   },
        ].map((f, i) => (
          <select key={i} value={f.value} onChange={e => f.setter(e.target.value)}
            className="bg-white border border-clay-200 text-clay-700 font-sans text-sm
                       rounded-xl px-3 py-2 outline-none focus:border-terra transition-colors">
            {f.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        ))}

        <Link
          to="/admin/listings/new"
          className="ml-auto inline-flex items-center gap-2 px-5 py-2 bg-terra text-white
                     font-sans text-sm rounded-xl hover:bg-terra-600 transition-colors shrink-0"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Nouvelle annonce
        </Link>
      </div>

      <p className="font-sans text-sm text-clay-400 mb-4">
        {loading ? 'Chargement…' : `${filtered.length} annonce${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 bg-clay-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <ListingsTable listings={filtered} onDelete={id => setToDelete(id)} />
      )}

      {/* Delete confirmation modal */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-clay-900/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-warm p-8 max-w-sm w-full animate-fade-in-up">
            <h3 className="font-display text-2xl text-clay-900 mb-3">Supprimer cette annonce ?</h3>
            <p className="font-sans text-sm text-clay-500 mb-8">
              Cette action est irréversible. L'annonce et toutes ses photos seront définitivement supprimées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 border border-clay-200 text-clay-700 font-sans text-sm
                           rounded-xl hover:border-clay-400 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={executeDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white font-sans text-sm
                           rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Suppression…' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}
