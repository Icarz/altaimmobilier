import { useState } from 'react'

export default function PhotoGallery({ photos }) {
  const [active, setActive] = useState(0)

  if (!photos || photos.length === 0) return null

  const sorted = [...photos].sort((a, b) => a.display_order - b.display_order)

  function prev() {
    setActive(i => (i === 0 ? sorted.length - 1 : i - 1))
  }
  function next() {
    setActive(i => (i === sorted.length - 1 ? 0 : i + 1))
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-clay-100">
        <img
          key={sorted[active].id}
          src={sorted[active].url}
          alt={`Photo ${active + 1}`}
          className="w-full h-full object-cover animate-fade-in"
        />

        {sorted.length > 1 && (
          <>
            <button onClick={prev} className="gallery-btn left-3" aria-label="Précédent">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </button>
            <button onClick={next} className="gallery-btn right-3" aria-label="Suivant">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 bg-clay-900/60 backdrop-blur-sm text-white font-sans text-xs px-3 py-1 rounded-full">
              {active + 1} / {sorted.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === active ? 'border-terra' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={photo.url} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
