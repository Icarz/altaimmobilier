const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const { body, headers, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Erreur serveur')
  }
  return res.json()
}

// Separate helper for FormData (no Content-Type — browser sets it with boundary)
async function upload(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Erreur upload')
  }
  return res.json()
}

export const api = {
  // ── Public ──────────────────────────────────────────────────────────
  getListings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v))
    ).toString()
    return request(`/listings${qs ? '?' + qs : ''}`)
  },
  getListing: (slug) => request(`/listings/${slug}`),

  // ── Auth ─────────────────────────────────────────────────────────────
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),

  // ── Admin listings ───────────────────────────────────────────────────
  adminGetListings: () => request('/admin/listings'),
  adminGetListing: (id) => request(`/admin/listings/${id}`),
  adminCreateListing: (data) =>
    request('/admin/listings', { method: 'POST', body: data }),
  adminUpdateListing: (id, data) =>
    request(`/admin/listings/${id}`, { method: 'PUT', body: data }),
  adminDeleteListing: (id) =>
    request(`/admin/listings/${id}`, { method: 'DELETE' }),

  // ── Photos ───────────────────────────────────────────────────────────
  uploadPhotos: (listingId, formData) =>
    upload(`/admin/listings/${listingId}/photos`, formData),
  updatePhoto: (listingId, photoId, data) =>
    request(`/admin/listings/${listingId}/photos/${photoId}`, {
      method: 'PATCH',
      body: data,
    }),
  deletePhoto: (listingId, photoId) =>
    request(`/admin/listings/${listingId}/photos/${photoId}`, {
      method: 'DELETE',
    }),
  reorderPhotos: (listingId, order) =>
    request(`/admin/listings/${listingId}/photos/reorder`, {
      method: 'PUT',
      body: { order },
    }),
}
