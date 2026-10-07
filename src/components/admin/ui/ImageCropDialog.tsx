'use client'

/**
 * Zuschneide-Dialog für Fotos mit festem Seitenverhältnis.
 *
 * Erscheint, bevor ein Bild hochgeladen wird. Man verschiebt das Foto im
 * Rahmen und zoomt mit Regler oder Mausrad. Zurück kommt nur der Ausschnitt
 * in Pixeln des Originals; zugeschnitten wird in bildZuschneiden
 * (src/lib/bild-verkleinern.ts).
 */

import { useCallback, useEffect, useState } from 'react'
import Cropper, { type Area } from 'react-easy-crop'
import { Button } from '@/components/ui/Button'
import type { Ausschnitt } from '@/lib/bild-verkleinern'

export default function ImageCropDialog({
  bildUrl,
  seitenverhaeltnis,
  titel,
  onAbbrechen,
  onUebernehmen,
}: {
  /** Object-URL oder Adresse des Bildes, das zugeschnitten wird */
  bildUrl: string
  seitenverhaeltnis: number
  titel: string
  onAbbrechen: () => void
  onUebernehmen: (ausschnitt: Ausschnitt) => void
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [ausschnitt, setAusschnitt] = useState<Area | null>(null)

  const onCropComplete = useCallback((_bereich: Area, pixel: Area) => {
    setAusschnitt(pixel)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onAbbrechen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onAbbrechen])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="zuschnitt-titel"
    >
      <div className="w-full max-w-2xl rounded-xl border border-white/[0.08] bg-[#111113] p-5 space-y-4">
        <div>
          <h2 id="zuschnitt-titel" className="text-base font-semibold text-white">
            {titel}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            Foto verschieben und zoomen, bis der Ausschnitt passt. Hochgeladen wird nur, was im
            Rahmen liegt.
          </p>
        </div>

        <div className="relative h-[55vh] min-h-[280px] overflow-hidden rounded-lg bg-black">
          <Cropper
            image={bildUrl}
            crop={crop}
            zoom={zoom}
            maxZoom={4}
            aspect={seitenverhaeltnis}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-white/70">
          <span className="shrink-0">Zoom</span>
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#016dca]"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onAbbrechen}>
            Abbrechen
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={!ausschnitt}
            onClick={() => ausschnitt && onUebernehmen(ausschnitt)}
          >
            Ausschnitt übernehmen
          </Button>
        </div>
      </div>
    </div>
  )
}
