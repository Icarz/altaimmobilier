// Mock listings — mirrors the DB schema in PRD §7
// Photos use Unsplash with explicit IDs for reliability

export const listings = [
  // ── VILLAS ────────────────────────────────────────────────────────────
  {
    id: 'villa-ain-diab-01',
    title: "Villa Contemporaine — Vue sur l'Atlantique",
    category: 'villa',
    listing_type: 'sale',
    price: 8500000,
    surface_area: 450,
    rooms: 6,
    bathrooms: 4,
    floor: null,
    location: 'Ain Diab, Casablanca',
    description:
      "Somptueuse villa contemporaine nichée dans le quartier prisé d'Ain Diab, offrant une vue panoramique sur l'océan Atlantique. Conçue par un architecte de renom, cette propriété allie modernité et raffinement. Les espaces de vie généreux s'ouvrent sur une terrasse privative avec piscine à débordement. Cuisine équipée haut de gamme, home-cinéma, suite parentale avec dressing et salle de bain en marbre.",
    status: 'available',
    photos: [
      { id: 'p-v01-1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-v01-2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
      { id: 'p-v01-3', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 2 },
    ],
    created_at: '2026-01-15',
  },
  {
    id: 'villa-palmeraie-02',
    title: 'Villa de Charme — La Palmeraie',
    category: 'villa',
    listing_type: 'rent',
    price: 35000,
    surface_area: 380,
    rooms: 5,
    bathrooms: 3,
    floor: null,
    location: 'La Palmeraie, Marrakech',
    description:
      "Magnifique villa de charme au cœur de la Palmeraie de Marrakech. Jardin paysager de 800 m² avec bassin de natation privé. Décoration alliant traditions marocaines et confort moderne : zelliges, bois de cèdre, plafonds à caissons. Idéale pour un séjour longue durée ou une résidence secondaire.",
    status: 'available',
    photos: [
      { id: 'p-v02-1', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-v02-2', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-01-22',
  },
  {
    id: 'villa-agadir-03',
    title: 'Villa Moderne — Résidence Balnéaire',
    category: 'villa',
    listing_type: 'sale',
    price: 5500000,
    surface_area: 320,
    rooms: 5,
    bathrooms: 3,
    floor: null,
    location: 'Founty, Agadir',
    description:
      "Villa moderne à 300 m de la plage dans la résidence sécurisée Founty Beach. Architecture épurée, grandes baies vitrées, piscine privée de 10×4 m. Rez-de-chaussée : salon-séjour ouvert, cuisine américaine, chambre invités. Étage : 4 suites avec terrasses privatives. Garage double, domotique intégrée.",
    status: 'available',
    photos: [
      { id: 'p-v03-1', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-v03-2', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-02-03',
  },

  // ── APARTMENTS ───────────────────────────────────────────────────────
  {
    id: 'appt-maarif-04',
    title: 'Appartement de Standing — Maarif Extension',
    category: 'apartment',
    listing_type: 'sale',
    price: 2800000,
    surface_area: 160,
    rooms: 4,
    bathrooms: 2,
    floor: 5,
    location: 'Maarif Extension, Casablanca',
    description:
      "Appartement haut de gamme au 5ème étage d'un immeuble récent avec gardiennage 24h/24. Double salon lumineux, 3 chambres avec dressings, cuisine entièrement équipée, 2 salles de bain en marbre. Terrasse de 35 m² avec vue dégagée. Deux places de parking en sous-sol. Proche de toutes commodités.",
    status: 'available',
    photos: [
      { id: 'p-a04-1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-a04-2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
      { id: 'p-a04-3', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 2 },
    ],
    created_at: '2026-01-28',
  },
  {
    id: 'appt-hay-riad-05',
    title: 'Appartement Moderne — Hay Riad',
    category: 'apartment',
    listing_type: 'sale',
    price: 1200000,
    surface_area: 110,
    rooms: 3,
    bathrooms: 2,
    floor: 3,
    location: 'Hay Riad, Rabat',
    description:
      "Bel appartement de 110 m² dans le quartier résidentiel et verdoyant de Hay Riad. Salon-séjour de 40 m² avec baie vitrée, deux chambres avec placards intégrés, chambre principale avec salle de bain privative. Cuisine équipée, balcon orienté sud. Immeuble récent avec ascenseur et parking.",
    status: 'available',
    photos: [
      { id: 'p-a05-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-a05-2', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-02-10',
  },
  {
    id: 'appt-tanger-vue-mer-06',
    title: 'Penthouse Vue Mer — Malabata',
    category: 'apartment',
    listing_type: 'rent',
    price: 12000,
    surface_area: 95,
    rooms: 3,
    bathrooms: 2,
    floor: 8,
    location: 'Malabata, Tanger',
    description:
      "Penthouse au 8ème et dernier étage avec vue panoramique sur le détroit de Gibraltar. Séjour ouvert sur grande terrasse, cuisine semi-ouverte entièrement équipée, 2 chambres dont une suite avec baignoire. Copropriété sécurisée avec piscine commune sur rooftop. Disponible dès le 1er juin.",
    status: 'available',
    photos: [
      { id: 'p-a06-1', url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-a06-2', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-02-18',
  },
  {
    id: 'appt-marrakech-studio-07',
    title: 'Studio Premium — Medina Moderne',
    category: 'apartment',
    listing_type: 'rent',
    price: 8000,
    surface_area: 65,
    rooms: 2,
    bathrooms: 1,
    floor: 2,
    location: 'Guéliz, Marrakech',
    description:
      "Studio haut de gamme entièrement meublé et équipé dans le quartier animé de Guéliz. Salon-chambre avec canapé-lit king size, cuisine américaine moderne, salle de bain en tadelakt. Accès toit-terrasse privatif avec transats et barbecue. Idéal pour expatriés ou professionnel en déplacement.",
    status: 'available',
    photos: [
      { id: 'p-a07-1', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
    ],
    created_at: '2026-03-01',
  },

  // ── HOUSES ───────────────────────────────────────────────────────────
  {
    id: 'house-tanger-08',
    title: "Maison de Maître — Quartier du Vieux Port",
    category: 'house',
    listing_type: 'sale',
    price: 3500000,
    surface_area: 280,
    rooms: 5,
    bathrooms: 3,
    floor: null,
    location: 'Vieux Port, Tanger',
    description:
      "Maison de maître entièrement rénovée avec soin, préservant le cachet Art Déco de Tanger. Hall d'entrée monumental, grand salon avec cheminée, salle à manger formelle, cuisine de chef ouverte sur jardin intérieur à patios. 4 suites parentales au premier, terrasse panoramique avec vue sur le port.",
    status: 'available',
    photos: [
      { id: 'p-h08-1', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-h08-2', url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-01-10',
  },
  {
    id: 'house-anfa-09',
    title: 'Maison de Ville — Anfa Supérieur',
    category: 'house',
    listing_type: 'sale',
    price: 4200000,
    surface_area: 220,
    rooms: 4,
    bathrooms: 2,
    floor: null,
    location: 'Anfa Supérieur, Casablanca',
    description:
      "Maison de ville contemporaine dans l'un des quartiers les plus prisés de Casablanca. Salon-séjour en double hauteur baigné de lumière, terrasse-jardin de 120 m² avec pergola. 3 chambres à coucher, bureau, 2 salles de bain. Finitions premium, volets roulants motorisés, système d'alarme. Quartier calme et sécurisé.",
    status: 'available',
    photos: [
      { id: 'p-h09-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-h09-2', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-02-07',
  },
  {
    id: 'house-souissi-10',
    title: "Maison d'Architecte — Résidence Souissi",
    category: 'house',
    listing_type: 'rent',
    price: 18000,
    surface_area: 200,
    rooms: 4,
    bathrooms: 2,
    floor: null,
    location: 'Souissi, Rabat',
    description:
      "Maison d'architecte de standing dans la résidence arborée et sécurisée de Souissi. Conception bioclimatique avec grandes ouvertures orientées sud, matériaux nobles. Cuisine ouverte Boffi, 3 chambres, bureau, buanderie. Jardin entretenu inclus dans le loyer. Idéale pour famille diplomatique ou cadre supérieur.",
    status: 'under_offer',
    photos: [
      { id: 'p-h10-1', url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=800&fit=crop&q=85', is_cover: true,  display_order: 0 },
      { id: 'p-h10-2', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&h=800&fit=crop&q=85', is_cover: false, display_order: 1 },
    ],
    created_at: '2026-02-25',
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────

export function getListingById(id) {
  return listings.find(l => l.id === id) ?? null
}

export function getCoverPhoto(listing) {
  return (
    listing.photos.find(p => p.is_cover)?.url ??
    listing.photos[0]?.url ??
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80'
  )
}

export function formatPrice(price, type) {
  const formatted = new Intl.NumberFormat('fr-MA', {
    maximumFractionDigits: 0,
  }).format(price)
  return type === 'rent' ? `${formatted} MAD/mois` : `${formatted} MAD`
}

export const CATEGORY_LABELS = {
  apartment: 'Appartement',
  house: 'Maison',
  villa: 'Villa',
}

export const STATUS_LABELS = {
  available: 'Disponible',
  under_offer: 'Offre en cours',
  sold_rented: 'Vendu / Loué',
}

export const STATUS_COLORS = {
  available:   'text-emerald-700 bg-emerald-50',
  under_offer: 'text-amber-700 bg-amber-50',
  sold_rented: 'text-clay-600 bg-clay-100',
}
