import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's broken default icon paths in bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

async function geocode(location) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'fr' } })
  const data = await res.json()
  if (data.length === 0) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

export default function ListingMap({ location }) {
  const [coords, setCoords]   = useState(null)
  const [status, setStatus]   = useState('loading') // loading | ok | error
  const hasFetched            = useRef(false)

  useEffect(() => {
    if (!location || hasFetched.current) return
    hasFetched.current = true

    geocode(location)
      .then(result => {
        if (result) { setCoords(result); setStatus('ok') }
        else setStatus('error')
      })
      .catch(() => setStatus('error'))
  }, [location])

  if (status === 'error') return null

  if (status === 'loading') {
    return (
      <div className="w-full h-72 rounded-2xl bg-clay-100 animate-pulse flex items-center justify-center">
        <span className="font-sans text-sm text-clay-400">Chargement de la carte…</span>
      </div>
    )
  }

  return (
    <div className="w-full h-72 rounded-2xl overflow-hidden border border-clay-100 shadow-card">
      <MapContainer
        center={[coords.lat, coords.lng]}
        zoom={14}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[coords.lat, coords.lng]}>
          <Popup className="font-sans text-sm">{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
