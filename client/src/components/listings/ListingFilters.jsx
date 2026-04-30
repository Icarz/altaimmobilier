// Filter bar used on the /listings page.
// Syncs state with URL search params via callbacks from parent.

const CATEGORIES = [
  { value: '',          label: 'Tous' },
  { value: 'apartment', label: 'Appartements' },
  { value: 'house',     label: 'Maisons' },
  { value: 'villa',     label: 'Villas' },
]

const TYPES = [
  { value: '',     label: 'Vente & Location' },
  { value: 'sale', label: 'À vendre' },
  { value: 'rent', label: 'À louer' },
]

export default function ListingFilters({ category, type, onCategoryChange, onTypeChange, total }) {
  return (
    <div className="bg-white border-b border-clay-100 sticky top-[72px] z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Category tabs */}
        <div className="flex items-center gap-1 bg-clay-50 rounded-full p-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`font-sans text-sm px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                category === cat.value
                  ? 'bg-clay-900 text-white shadow-sm'
                  : 'text-clay-600 hover:text-clay-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <span className="hidden sm:block w-px h-6 bg-clay-200" />

        {/* Type toggle */}
        <div className="flex items-center gap-1 bg-clay-50 rounded-full p-1">
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={`font-sans text-sm px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                type === t.value
                  ? t.value === 'sale'
                    ? 'bg-terra text-white shadow-sm'
                    : t.value === 'rent'
                      ? 'bg-azure text-white shadow-sm'
                      : 'bg-clay-900 text-white shadow-sm'
                  : 'text-clay-600 hover:text-clay-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="sm:ml-auto">
          <span className="font-sans text-sm text-clay-500">
            {total} bien{total !== 1 ? 's' : ''} trouvé{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
