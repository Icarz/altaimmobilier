import AdminLayout from '../../layouts/AdminLayout'
import { Link } from 'react-router-dom'
import { listings, formatPrice, CATEGORY_LABELS, STATUS_LABELS, STATUS_COLORS, getCoverPhoto } from '../../data/mockData'

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl border border-clay-100 p-6`}>
      <p className="font-sans text-xs tracking-widest uppercase text-clay-400 mb-3">{label}</p>
      <p className={`font-display text-5xl font-light ${color ?? 'text-clay-900'}`}>{value}</p>
      {sub && <p className="font-sans text-xs text-clay-400 mt-2">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const total     = listings.length
  const forSale   = listings.filter(l => l.listing_type === 'sale').length
  const forRent   = listings.filter(l => l.listing_type === 'rent').length
  const available = listings.filter(l => l.status === 'available').length

  const byCat = ['apartment', 'house', 'villa'].map(c => ({
    label: CATEGORY_LABELS[c] + 's',
    count: listings.filter(l => l.category === c).length,
  }))

  const recent = [...listings]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <AdminLayout title="Tableau de bord">

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total annonces" value={total}     color="text-clay-900" />
        <StatCard label="À vendre"       value={forSale}   color="text-terra"    />
        <StatCard label="À louer"        value={forRent}   color="text-azure"    />
        <StatCard label="Disponibles"    value={available} color="text-emerald-600" />
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {byCat.map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-clay-100 p-5">
            <p className="font-sans text-xs tracking-widest uppercase text-clay-400 mb-2">{c.label}</p>
            <p className="font-display text-4xl text-clay-900 font-light">{c.count}</p>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white rounded-2xl border border-clay-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-clay-100">
          <h2 className="font-display text-2xl text-clay-900 font-light">Annonces récentes</h2>
          <Link
            to="/admin/listings"
            className="font-sans text-sm text-terra hover:text-terra-600 transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-clay-50">
              <th className="text-left font-sans text-xs text-clay-400 tracking-widest uppercase px-6 py-3">Bien</th>
              <th className="text-left font-sans text-xs text-clay-400 tracking-widest uppercase px-4 py-3 hidden md:table-cell">Prix</th>
              <th className="text-left font-sans text-xs text-clay-400 tracking-widest uppercase px-4 py-3 hidden lg:table-cell">Statut</th>
              <th className="text-left font-sans text-xs text-clay-400 tracking-widest uppercase px-4 py-3 hidden md:table-cell">Date</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-clay-50">
            {recent.map(l => (
              <tr key={l.id} className="table-row-hover">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-clay-100">
                      <img src={getCoverPhoto(l)} alt={l.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-sans text-sm font-medium text-clay-900 line-clamp-1">{l.title}</p>
                      <p className="font-sans text-xs text-clay-400">{CATEGORY_LABELS[l.category]}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="font-display text-base text-gold">{formatPrice(l.price, l.listing_type)}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`font-sans text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[l.status]}`}>
                    {STATUS_LABELS[l.status]}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="font-sans text-xs text-clay-400">
                    {new Date(l.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/admin/listings/${l.id}/edit`}
                    className="font-sans text-xs px-3 py-1.5 rounded-lg border border-clay-200
                               text-clay-600 hover:border-terra hover:text-terra transition-colors"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick actions */}
      <div className="mt-6">
        <Link
          to="/admin/listings/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-terra text-white font-sans text-sm
                     rounded-xl hover:bg-terra-600 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          Ajouter une annonce
        </Link>
      </div>

    </AdminLayout>
  )
}
