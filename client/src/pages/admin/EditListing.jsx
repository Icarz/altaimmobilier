import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom'
import AdminLayout from '../../layouts/AdminLayout'
import { api } from '../../lib/api'

const INPUT  = 'w-full bg-white border border-clay-200 text-clay-900 font-sans text-sm rounded-xl px-4 py-2.5 outline-none focus:border-terra transition-colors placeholder:text-clay-300'
const SELECT = INPUT + ' cursor-pointer'

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

export default function EditListing() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [listing,  setListing]  = useState(null)
  const [form,     setForm]     = useState(null)
  const [photos,   setPhotos]   = useState([])
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [notFound, setNotFound] = useState(false)
  const [dragging, setDragging] = useState(null)

  useEffect(() => {
    api.adminGetListing(id)
      .then(data => {
        setListing(data)
        setForm({
          title:        data.title,
          category:     data.category,
          listing_type: data.listing_type,
          price_mad:    data.price_mad,
          surface_area: data.surface_area,
          rooms:        data.rooms,
          bathrooms:    data.bathrooms,
          floor:        data.floor ?? '',
          location:     data.location,
          description:  data.description,
          status:       data.status,
        })
        setPhotos(data.photos.map(p => ({ ...p, isNew: false, preview: p.url })))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  // ── Photo management ────────────────────────────────────────────────

  async function handlePhotoAdd(e) {
    const files = Array.from(e.target.files)
    if (photos.length + files.length > 15) {
      alert('Maximum 15 photos par annonce.')
      return
    }
    const formData = new FormData()
    files.forEach(f => formData.append('photos', f))
    try {
      const res = await api.uploadPhotos(id, formData)
      setPhotos(res.photos.map(p => ({ ...p, isNew: false, preview: p.url })))
    } catch (err) {
      alert('Erreur upload : ' + err.message)
    }
  }

  async function removePhoto(photoId) {
    if (photos.length <= 1) {
      alert('Une annonce doit avoir au moins une photo.')
      return
    }
    try {
      const res = await api.deletePhoto(id, photoId)
      setPhotos(res.photos.map(p => ({ ...p, isNew: false, preview: p.url })))
    } catch (err) {
      alert('Erreur suppression : ' + err.message)
    }
  }

  async function setCover(photoId) {
    try {
      const res = await api.updatePhoto(id, photoId, { is_cover: true })
      setPhotos(res.photos.map(p => ({ ...p, isNew: false, preview: p.url })))
    } catch (err) {
      alert('Erreur : ' + err.message)
    }
  }

  // Drag-to-reorder — persisted immediately via PUT /photos/reorder
  function onDragStart(photoId) { setDragging(photoId) }
  async function onDrop(targetId) {
    if (!dragging || dragging === targetId) { setDragging(null); return }

    const next = [...photos]
    const from = next.findIndex(ph => ph._id === dragging)
    const to   = next.findIndex(ph => ph._id === targetId)
    ;[next[from], next[to]] = [next[to], next[from]]
    const ordered = next.map((ph, i) => ({ ...ph, display_order: i }))

    setPhotos(ordered)
    setDragging(null)

    try {
      await api.reorderPhotos(id, ordered.map(ph => ph._id))
    } catch {
      // revert to server state on failure
      const res = await api.adminGetListing(id)
      setPhotos(res.photos.map(p => ({ ...p, isNew: false, preview: p.url })))
    }
  }

  // ── Form submit ─────────────────────────────────────────────────────

  function validate() {
    const e = {}
    if (!form.title.trim())                          e.title       = 'Le titre est requis.'
    if (!form.price_mad || form.price_mad <= 0)      e.price_mad   = 'Un prix valide est requis.'
    if (!form.surface_area || form.surface_area <= 0) e.surface_area = 'La surface est requise.'
    if (!form.rooms || form.rooms <= 0)              e.rooms       = 'Le nombre de pièces est requis.'
    if (!form.bathrooms || form.bathrooms <= 0)      e.bathrooms   = 'Requis.'
    if (!form.location.trim())                       e.location    = 'La localisation est requise.'
    if (!form.description.trim())                    e.description = 'La description est requise.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    try {
      await api.adminUpdateListing(id, {
        ...form,
        price_mad:    Number(form.price_mad),
        surface_area: Number(form.surface_area),
        rooms:        Number(form.rooms),
        bathrooms:    Number(form.bathrooms),
        floor:        form.floor !== '' ? Number(form.floor) : null,
      })
      setSuccess(true)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Modifier l'annonce">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-clay-100 rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-clay-100 rounded-2xl" />
              <div className="h-48 bg-clay-100 rounded-2xl" />
            </div>
            <div className="h-80 bg-clay-100 rounded-2xl" />
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (notFound || !form) return <Navigate to="/admin/listings" replace />

  if (success) {
    return (
      <AdminLayout title="Modifier l'annonce">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-emerald-600">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="font-display text-3xl text-clay-900">Modifications enregistrées !</p>
          <div className="flex gap-3 mt-2">
            <button onClick={() => setSuccess(false)}
              className="font-sans text-sm text-terra hover:text-terra-600 transition-colors">
              Continuer à modifier
            </button>
            <span className="text-clay-300">·</span>
            <Link to="/admin/listings"
              className="font-sans text-sm text-clay-500 hover:text-clay-700 transition-colors">
              Retour aux annonces
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Modifier — ${listing?.title}`}>
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
                  maxLength={100} className={INPUT} />
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
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)} className={INPUT} />
              </Field>

              <Field label="Description" required error={errors.description}>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  maxLength={1000} rows={5} className={INPUT + ' resize-none'} />
                <p className="font-sans text-xs text-clay-300 text-right mt-1">{form.description.length}/1000</p>
              </Field>
            </div>

            <div className="bg-white rounded-2xl border border-clay-100 p-6 space-y-5">
              <h2 className="font-display text-xl text-clay-900">Caractéristiques</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Prix (MAD)" required error={errors.price_mad}>
                  <input type="number" min="0" value={form.price_mad}
                    onChange={e => set('price_mad', e.target.value)} className={INPUT} />
                </Field>
                <Field label="Surface (m²)" required error={errors.surface_area}>
                  <input type="number" min="1" value={form.surface_area}
                    onChange={e => set('surface_area', e.target.value)} className={INPUT} />
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Pièces" required error={errors.rooms}>
                  <input type="number" min="1" value={form.rooms}
                    onChange={e => set('rooms', e.target.value)} className={INPUT} />
                </Field>
                <Field label="Salles de bain" required error={errors.bathrooms}>
                  <input type="number" min="1" value={form.bathrooms}
                    onChange={e => set('bathrooms', e.target.value)} className={INPUT} />
                </Field>
                <Field label="Étage">
                  <input type="number" min="0" value={form.floor}
                    onChange={e => set('floor', e.target.value)} placeholder="—" className={INPUT} />
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
              <h2 className="font-display text-xl text-clay-900 mb-1">Photos</h2>
              <p className="font-sans text-xs text-clay-400 mb-4">
                Glissez pour réordonner. La photo marquée « Couv. » est la photo principale.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {photos.map(ph => (
                  <div
                    key={ph._id}
                    draggable
                    onDragStart={() => onDragStart(ph._id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => onDrop(ph._id)}
                    className={`relative group rounded-lg overflow-hidden aspect-square bg-clay-100 cursor-grab active:cursor-grabbing
                      ${dragging === ph._id ? 'ring-2 ring-terra opacity-60' : ''}`}
                  >
                    <img src={ph.preview} alt="" className="w-full h-full object-cover" />

                    {ph.is_cover && (
                      <div className="absolute top-1 left-1 bg-terra text-white font-sans px-1.5 py-0.5 rounded text-[10px]">
                        Couv.
                      </div>
                    )}

                    <div className="absolute inset-0 bg-clay-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      {!ph.is_cover && (
                        <button type="button" onClick={() => setCover(ph._id)}
                          className="font-sans text-white text-[10px] bg-terra px-2 py-0.5 rounded">
                          Couverture
                        </button>
                      )}
                      <button type="button" onClick={() => removePhoto(ph._id)}
                        className="font-sans text-white text-[10px] bg-red-600 px-2 py-0.5 rounded">
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}

                {photos.length < 15 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-clay-200
                                    flex flex-col items-center justify-center cursor-pointer hover:border-terra transition-colors">
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                      onChange={handlePhotoAdd} className="sr-only" />
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-clay-300">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                    </svg>
                    <span className="font-sans text-[10px] text-clay-300 mt-1">Ajouter</span>
                  </label>
                )}
              </div>

              <p className="font-sans text-xs text-clay-300 text-center">{photos.length}/15 photos</p>
            </div>

            <div className="flex flex-col gap-3">
              <button type="submit" disabled={saving}
                className="w-full py-3 bg-terra text-white font-sans font-medium rounded-xl
                           hover:bg-terra-600 disabled:opacity-50 transition-colors">
                {saving ? 'Enregistrement…' : 'Enregistrer les modifications'}
              </button>
              <Link to={`/listings/${listing?.slug}`} target="_blank"
                className="w-full py-2.5 border border-clay-200 text-clay-600 font-sans text-sm text-center
                           rounded-xl hover:border-clay-400 transition-colors">
                Voir l'annonce publique ↗
              </Link>
              <Link to="/admin/listings"
                className="w-full py-2.5 text-clay-400 font-sans text-sm text-center hover:text-clay-600 transition-colors">
                ← Retour aux annonces
              </Link>
            </div>
          </div>

        </div>
      </form>
    </AdminLayout>
  )
}
