/**
 * Shared mock data and API route helpers for Playwright tests.
 * All tests run against the frontend only — the backend API is intercepted here.
 */

export const MOCK_LISTINGS = [
  {
    _id: 'listing1',
    slug: 'villa-moderne-marrakech',
    title: 'Villa Moderne Marrakech',
    category: 'villa',
    listing_type: 'sale',
    price_mad: 3_500_000,
    price_eur: 324_074,
    surface_area: 350,
    rooms: 5,
    bathrooms: 3,
    floor: null,
    location: 'Marrakech',
    description: 'Magnifique villa avec piscine.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        public_id: 'photo1',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  {
    _id: 'listing2',
    slug: 'appartement-casablanca-centre',
    title: 'Appartement Casablanca Centre',
    category: 'apartment',
    listing_type: 'rent',
    price_mad: 8_000,
    price_eur: 741,
    surface_area: 85,
    rooms: 2,
    bathrooms: 1,
    floor: 3,
    location: 'Casablanca',
    description: 'Bel appartement en centre-ville.',
    status: 'available',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        public_id: 'photo2',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  {
    _id: 'listing3',
    slug: 'maison-rabat-vendue',
    title: 'Maison Rabat',
    category: 'house',
    listing_type: 'sale',
    price_mad: 1_200_000,
    price_eur: 111_111,
    surface_area: 150,
    rooms: 4,
    bathrooms: 2,
    floor: null,
    location: 'Rabat',
    description: 'Belle maison familiale.',
    status: 'sold_rented',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
        public_id: 'photo3',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
]

const API = 'http://localhost:5000/api'

/**
 * Mock all public API routes. Call inside test or beforeEach.
 * @param {import('@playwright/test').Page} page
 * @param {object} [overrides]
 * @param {object[]} [overrides.listings] - override the default listing list
 * @param {boolean} [overrides.authenticated] - whether /auth/me returns authenticated
 */
export async function mockPublicAPI(page, { listings = MOCK_LISTINGS, authenticated = false } = {}) {
  // Auth session check
  await page.route(`${API}/auth/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ authenticated }),
    })
  )

  // Listing list (with optional query params)
  await page.route(`${API}/listings**`, (route) => {
    const url = new URL(route.request().url())
    const category = url.searchParams.get('category')
    const type = url.searchParams.get('type')

    let filtered = listings
    if (category) filtered = filtered.filter((l) => l.category === category)
    if (type)     filtered = filtered.filter((l) => l.listing_type === type)

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filtered),
    })
  })

  // Single listing by slug
  await page.route(`${API}/listings/*`, (route) => {
    const slug = route.request().url().split('/listings/')[1]
    const listing = listings.find((l) => l.slug === slug)
    if (listing) {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(listing) })
    } else {
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ message: 'Not found' }) })
    }
  })
}

/**
 * Mock the login endpoint.
 * @param {import('@playwright/test').Page} page
 * @param {'success'|'failure'} result
 */
export async function mockLogin(page, result = 'success') {
  await page.route(`${API}/auth/login`, (route) => {
    if (result === 'success') {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) })
    } else {
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Email ou mot de passe incorrect.' }) })
    }
  })

  // After successful login, /auth/me should return authenticated
  if (result === 'success') {
    await page.route(`${API}/auth/me`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ authenticated: true }) })
    )
    await page.route(`${API}/admin/listings**`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) })
    )
  }
}
