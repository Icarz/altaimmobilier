import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { api } from '../../lib/api'

const EMPTY = {
  title: '', category: 'apartment', listing_type: 'sale',
  price_mad: '', surface_area: '', rooms: '', bathrooms: '', floor: '',
  location: '', description: '', status: 'available',
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block font-sans text-xs tracking-widest uppercase text-clay-500 mb-2">
        {label}{required && <span className="text-terra ml-1">*</span>}
      </label>
      {children}
      {error && <p className="font-sans text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

const INPUT  = 'w-full bg-white border border-clay-200 text-clay-900 font-sans text-sm rounded-xl px-4 py-2.5 outline-none focus:border-terra transition-colors placeholder:text-clay-300'
const SELECT = INPUT + ' cursor-pointer'

export default function NewListing() {
  const navigate = useNavigate()
  const [form,     setForm]     = useState(EMPTY)
  const [errors,   setErrors]   = useState({})
  const [photos,   setPhotos]   = useState([])
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  function handlePhotoAdd(e) {
    const files = Array.from(e.target.files)
    const added = files.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      file,
      preview: URL.createObjectURL(file),
      isCover: photos.length === 0 && i === 0,
    }))
    setPhotos(p => [...p, ...added].slice(0, 15))
    setErrors(e => ({ ...e, photos: '' }))
  }

  function removePhoto(id) {
    setPhotos(p => {
      const next = p.filter(ph => ph.id !== id)
      if (p.find(ph => ph.id === id)?.isCover && next.length > 0) next[0].isCover = true
      return next
    })
  }

  function setCover(id) {
    setPhotos(p => p.map(ph => ({ ...ph, isCover: ph.id === id })))
  }

  function validate() {
    const e = {}
    if (!form.title.trim())                          e.title       = 'Le titre est requis.'
    if (!form.price_mad || form.price_mad <= 0)      e.price_mad   = 'Un prix valide est requis.'
    if (!form.surface_area || form.surface_area <= 0) e.surface_area = 'La surface est requise.'
    if (!form.rooms || form.rooms <= 0)              e.rooms       = 'Le nombre de pièces est requis.'
    if (!form.bathrooms || form.bathrooms <= 0)      e.bathrooms   = 'Le nombre de salles de bain est requis.'
    if (!form.location.trim())                       e.location    = 'La localisation est requise.'
    if (!form.description.trim())                    e.description = 'La description est requise.'
    if (photos.length === 0)                         e.photos      = 'Au moins une photo est requise.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // 1 — Create the listing
      const listing = await api.adminCreateListing({
        ...form,
        price_mad:    Number(form.price_mad),
        surface_area: Number(form.surface_area),
        rooms:        Number(form.rooms),
        bathrooms:    Number(form.bathrooms),
        floor:        form.floor ? Number(form.floor) : null,
      })

      // 2 — Upload photos
      if (photos.length > 0) {
        const formData = new FormData()
        photos.forEach(ph => formData.append('photos', ph.file))
        await api.uploadPhotos(listing._id, formData)

        // 3 — Set cover photo (first by default, or user-selected)
        const coverIdx = photos.findIndex(ph => ph.isCover)
        if (coverIdx > 0) {
          // Cover was re-assigned — after upload photos are in order, patch the right one
          const fresh = await api.adminGetListing(listing._id)
          const coverPhoto = fresh.photos[coverIdx]
          if (coverPhoto) await api.updatePhoto(listing._id, coverPhoto._id, { is_cover: true })
        }
      }

      setSuccess(true)
      setTimeout(() => navigate('/admin/listings'), 1500)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AdminLayout title="Nouvelle annonce">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-emerald-600">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="font-display text-3xl text-clay-900">Annonce créée !</p>
          <p className="font-sans text-sm text-clay-400">Redirection en cours…</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Nouvelle annonce">
      <form onSubmit={handleSubmit} noValidate>

        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 font-sans text-sm px-4 py-3 rounded-xl">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main fields (2/3) ── */}
          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl border border-clay-100 p-6 space-y-5">
              <h2 className="font-display text-xl text-clay-900">Informations générales</h2>

              <Field label="Titre" required error={errors.title}>
                <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                  placeholder="ex. Villa Contemporaine — Vue sur Mer" maxLength={100} className={INPUT} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Catégorie" required>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={SELECT}>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison</option>
                    <option value="villa">Villa</option>
                  </select>
                </Field>
                <Field label="Type d'annonce" required>
                  <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)} className={SELECT}>
                    <option value="sale">À vendre</option>
                    <option value="rent">À louer</option>
                  </select>
                </Field>
              </div>

              <Field label="Localisation" required error={errors.location}>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                  placeholder="ex. Ain Diab, Casablanca" className={INPUT} />
              </Field>

              <Field label="Description" required error={errors.description}>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Décrivez le bien en détail…" maxLength={1000} rows={5}
                  className={INPUT + ' resize-none'} />
                <p className="font-sans text-xs text-clay-300 text-right mt-1">{form.description.length}/1000</p>
              </Field>
            </div>

            <div className="bg-white rounded-2xl border border-clay-100 p-6 space-y-5">
              <h2 className="font-display text-xl text-clay-900">Caractéristiques</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Prix (MAD)" required error={errors.price_mad}>
                  <input type="number" min="0" value={form.price_mad} onChange={e => set('price_mad', e.target.value)}
                    placeholder="ex. 2 500 000" className={INPUT} />
                </Field>
                <Field label="Surface (m²)" required error={errors.surface_area}>
                  <input type="number" min="1" value={form.surface_area} onChange={e => set('surface_area', e.target.value)}
                    placeholder="ex. 150" className={INPUT} />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Pièces" required error={errors.rooms}>
                  <input type="number" min="1" value={form.rooms} onChange={e => set('rooms', e.target.value)}
                    placeholder="4" className={INPUT} />
                </Field>
                <Field label="Salles de bain" required error={errors.bathrooms}>
                  <input type="number" min="1" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}
                    placeholder="2" className={INPUT} />
                </Field>
                <Field label="Étage (optionnel)">
                  <input type="number" min="0" value={form.floor} onChange={e => set('floor', e.target.value)}
                    placeholder="—" className={INPUT} />
                </Field>
              </div>

              <Field label="Disponibilité">
                <select value={form.status} onChange={e => set('status', e.target.value)} className={SELECT}>
                  <option value="available">Disponible</option>
                  <option value="sold_rented">Vendu / Loué</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ── Photos (1/3) ── */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-clay-100 p-6">
              <h2 className="font-display text-xl text-clay-900 mb-4">Photos</h2>

              {errors.photos && (
                <p className="font-sans text-xs text-red-500 mb-3">{errors.photos}</p>
              )}

              <label className="block border-2 border-dashed border-clay-200 rounded-xl p-6 text-center cursor-pointer hover:border-terra transition-colors">
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                  onChange={handlePhotoAdd} className="sr-only" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                     className="w-8 h-8 text-clay-300 mx-auto mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                </svg>
                <p className="font-sans text-sm text-clay-500">
                  Glisser-déposer ou <span className="text-terra">parcourir</span>
                </p>
                <p className="font-sans text-xs text-clay-300 mt-1">JPG, PNG, WEBP — max 5 MB</p>
              </label>

              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {photos.map(ph => (
                    <div key={ph.id} className="relative group rounded-lg overflow-hidden aspect-square bg-clay-100">
                      <img src={ph.preview} alt="" className="w-full h-full object-cover" />
                      {ph.isCover && (
                        <div className="absolute top-1 left-1 bg-terra text-white font-sans px-1.5 py-0.5 rounded text-[10px]">
                          Couv.
                        </div>
                      )}
                      <div className="absolute inset-0 bg-clay-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                        {!ph.isCover && (
                          <button type="button" onClick={() => setCover(ph.id)}
                            className="font-sans text-white text-[10px] bg-terra px-2 py-0.5 rounded">
                            Couverture
                          </button>
                        )}
                        <button type="button" onClick={() => removePhoto(ph.id)}
                          className="font-sans text-white text-[10px] bg-red-600 px-2 py-0.5 rounded">
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="font-sans text-xs text-clay-300 mt-3 text-center">{photos.length}/15 photos</p>
            </div>

            <div className="flex flex-col gap-3">
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-terra text-white font-sans font-medium rounded-xl
                           hover:bg-terra-600 disabled:opacity-50 transition-colors">
                {loading ? 'Publication…' : "Publier l'annonce"}
              </button>
              <Link to="/admin/listings"
                className="w-full py-3 border border-clay-200 text-clay-600 font-sans text-sm text-center
                           rounded-xl hover:border-clay-400 transition-colors">
                Annuler
              </Link>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
