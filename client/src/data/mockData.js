// Shared helpers and constants — no mock data, all listings come from the API

export function getCoverPhoto(listing) {
  return (
    listing.photos?.find(p => p.is_cover)?.url ??
    listing.photos?.[0]?.url ??
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80'
  )
}

// Shows both MAD and EUR as decided
export function formatPrice(price_mad, price_eur, type) {
  const mad = new Intl.NumberFormat('fr-MA', { maximumFractionDigits: 0 }).format(price_mad)
  const eur = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(price_eur)
  const suffix = type === 'rent' ? '/mois' : ''
  return `${mad} MAD${suffix}  ·  ${eur} €${suffix}`
}

export const CATEGORY_LABELS = {
  apartment: 'Appartement',
  house: 'Maison',
  villa: 'Villa',
}

export const STATUS_LABELS = {
  available:   'Disponible',
  sold_rented: 'Vendu / Loué',
}

export const STATUS_COLORS = {
  available:   'text-emerald-700 bg-emerald-50',
  sold_rented: 'text-clay-600 bg-clay-100',
}
