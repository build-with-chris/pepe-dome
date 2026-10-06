'use client'

/**
 * Ablagefläche für mehrere Bilder auf einmal.
 *
 * ImageDropzone gibt es schon, die verwaltet aber genau ein Bild und ersetzt
 * es beim nächsten Upload. Für eine Galerie will man fünf Fotos markieren und
 * loslassen, deshalb diese Variante: sie lädt nacheinander hoch und meldet
 * jede fertige Adresse einzeln zurück.
 *
 * Nacheinander statt parallel, weil die Upload-Route jede Datei einzeln nach
 * Supabase schiebt. Fünf gleichzeitige Anfragen bringen nichts außer einem
 * schwerer lesbaren Fehlerfall.
 */

import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { bildFuerUpload, UPLOAD_GRENZE_BYTES, zuGrossMeldung } from '@/lib/bild-verkleinern'

const ERLAUBT = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export default function MultiImageUpload({
  onUploaded,
  label = 'Bilder hierher ziehen oder klicken',
}: {
  /** Wird pro fertig hochgeladenem Bild einmal aufgerufen. */
  onUploaded: (url: string) => void
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fortschritt, setFortschritt] = useState<{ fertig: number; gesamt: number } | null>(null)
  const [fehler, setFehler] = useState<string[]>([])

  const uploadAlle = useCallback(
    async (dateien: File[]) => {
      if (dateien.length === 0) return
      setFehler([])
      setFortschritt({ fertig: 0, gesamt: dateien.length })
      const gesammelteFehler: string[] = []

      for (let i = 0; i < dateien.length; i += 1) {
        const original = dateien[i]

        // Vorab prüfen statt den Server ablehnen zu lassen: so steht der
        // Grund direkt an der Datei, die ihn verursacht hat.
        if (!ERLAUBT.includes(original.type)) {
          gesammelteFehler.push(`${original.name}: kein unterstütztes Bildformat`)
          setFortschritt({ fertig: i + 1, gesamt: dateien.length })
          continue
        }

        try {
          const datei = await bildFuerUpload(original)
          if (datei.size > UPLOAD_GRENZE_BYTES) {
            gesammelteFehler.push(zuGrossMeldung(datei))
            setFortschritt({ fertig: i + 1, gesamt: dateien.length })
            continue
          }

          const body = new FormData()
          body.append('file', datei)
          const res = await fetch('/api/admin/upload', { method: 'POST', body })
          const text = await res.text()
          let daten: { url?: string; error?: string } = {}
          try {
            daten = text ? JSON.parse(text) : {}
          } catch {
            gesammelteFehler.push(
              res.status === 413
                ? `${datei.name}: zu groß für den Upload`
                : `${datei.name}: Serverfehler ${res.status}`
            )
            setFortschritt({ fertig: i + 1, gesamt: dateien.length })
            continue
          }

          if (!res.ok || !daten.url) {
            gesammelteFehler.push(`${datei.name}: ${daten.error ?? 'Upload fehlgeschlagen'}`)
          } else {
            onUploaded(daten.url)
          }
        } catch (error) {
          gesammelteFehler.push(
            `${original.name}: ${error instanceof Error ? error.message : 'Upload fehlgeschlagen'}`
          )
        }

        setFortschritt({ fertig: i + 1, gesamt: dateien.length })
      }

      setFehler(gesammelteFehler)
      setFortschritt(null)
    },
    [onUploaded]
  )

  const laeuft = fortschritt !== null

  return (
    <div className="space-y-2">
      <div
        onClick={() => !laeuft && inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!laeuft) uploadAlle([...e.dataTransfer.files])
        }}
        className={cn(
          'flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg transition-all',
          laeuft
            ? 'pointer-events-none opacity-70 border-white/[0.12]'
            : 'cursor-pointer border-white/[0.12] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25',
          dragging && 'border-[#016dca] bg-[#016dca]/10'
        )}
      >
        {laeuft ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#016dca] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white/70">
              {fortschritt.fertig} von {fortschritt.gesamt} hochgeladen
            </span>
          </div>
        ) : (
          <>
            <span className="text-sm text-white/70">{dragging ? 'Loslassen' : label}</span>
            <span className="text-[11px] text-white/40 mt-1">
              Mehrere auf einmal möglich · JPG, PNG, GIF, WebP · große Fotos werden verkleinert
            </span>
          </>
        )}
      </div>

      {fehler.length > 0 && (
        <ul className="space-y-1">
          {fehler.map((eintrag, i) => (
            <li key={i} className="text-sm text-red-400">
              {eintrag}
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ERLAUBT.join(',')}
        className="hidden"
        onChange={(e) => {
          uploadAlle([...(e.target.files ?? [])])
          if (inputRef.current) inputRef.current.value = ''
        }}
      />
    </div>
  )
}
