'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  bildFuerUpload,
  bildZuschneiden,
  UPLOAD_GRENZE_BYTES,
  zuGrossMeldung,
  type Ausschnitt,
} from '@/lib/bild-verkleinern'
import ImageCropDialog from './ImageCropDialog'

/** Zugeschnittene Fotos werden klein angezeigt, 1600 px reichen auch für Retina. */
const ZUSCHNITT_MAX_KANTE = 1600

type Zuschnitt = {
  /** Breite durch Höhe, z. B. 1 für quadratisch oder 4/3 für quer */
  seitenverhaeltnis: number
  /** Überschrift im Zuschneide-Dialog */
  titel?: string
}

type ZuschnittQuelle = { url: string; datei: Blob; name: string }

interface ImageDropzoneProps {
  /** Current image URL */
  value?: string
  /** Callback when image changes */
  onChange: (url: string) => void
  /** Label for the field */
  label?: string
  /** Show error state */
  hasError?: boolean
  /** Error message */
  error?: string
  /** Custom className */
  className?: string
  /** Placeholder text */
  placeholder?: string
  /**
   * Fester Bildausschnitt. Ist das gesetzt, öffnet sich vor dem Upload ein
   * Zuschneide-Dialog, und hochgeladen wird nur der gewählte Ausschnitt.
   */
  zuschnitt?: Zuschnitt
}

export default function ImageDropzone({
  value,
  onChange,
  label = 'Bild',
  hasError = false,
  error,
  className,
  placeholder = 'Bild hier ablegen oder klicken zum Hochladen',
  zuschnitt,
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [zuschnittQuelle, setZuschnittQuelle] = useState<ZuschnittQuelle | null>(null)
  /**
   * Das zuletzt gewählte Original. Wird danach das Format geändert, schneidet
   * "Ausschnitt ändern" wieder aus dem vollen Foto zu und nicht aus dem schon
   * beschnittenen.
   */
  const originalRef = useRef<File | null>(null)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true)
    setUploadError(null)

    try {
      const verkleinert = await bildFuerUpload(file)
      if (verkleinert.size > UPLOAD_GRENZE_BYTES) {
        setUploadError(zuGrossMeldung(verkleinert))
        return
      }

      const formData = new FormData()
      formData.append('file', verkleinert)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const text = await response.text()
      let data: { error?: string; url?: string } = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        console.error('Upload response was not JSON:', response.status, text?.slice(0, 200))
        setUploadError(
          response.status === 413
            ? 'Das Bild ist zu groß für den Upload. Bitte eine kleinere Fassung verwenden.'
            : `Serverfehler ${response.status}. Antwort war kein JSON, bitte Vercel-Logs oder Supabase prüfen.`
        )
        return
      }

      if (!response.ok) {
        const msg = data?.error || `Upload fehlgeschlagen (${response.status})`
        setUploadError(msg)
        return
      }

      if (data.url) {
        onChange(data.url)
      } else {
        setUploadError('Upload: Keine URL in der Antwort.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload fehlgeschlagen'
      setUploadError(msg)
      console.error('Upload error:', err)
    } finally {
      setIsUploading(false)
    }
  }, [onChange])

  const zuschnittSchliessen = useCallback(() => {
    setZuschnittQuelle((quelle) => {
      if (quelle) URL.revokeObjectURL(quelle.url)
      return null
    })
  }, [])

  const zuschnittOeffnen = useCallback((datei: Blob, name: string) => {
    setUploadError(null)
    setZuschnittQuelle({ url: URL.createObjectURL(datei), datei, name })
  }, [])

  /** Neue Datei: mit Zuschnitt erst in den Dialog, sonst direkt hochladen. */
  const handleFile = useCallback(
    async (file: File) => {
      if (zuschnitt && file.type !== 'image/gif') {
        originalRef.current = file
        zuschnittOeffnen(file, file.name)
        return
      }
      await uploadFile(file)
    },
    [zuschnitt, zuschnittOeffnen, uploadFile]
  )

  const zuschnittUebernehmen = useCallback(
    async (ausschnitt: Ausschnitt) => {
      if (!zuschnittQuelle) return
      const { datei, name } = zuschnittQuelle
      zuschnittSchliessen()
      setIsUploading(true)
      try {
        const zugeschnitten = await bildZuschneiden(datei, ausschnitt, name, ZUSCHNITT_MAX_KANTE)
        await uploadFile(zugeschnitten)
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : 'Zuschneiden fehlgeschlagen')
        setIsUploading(false)
      }
    },
    [zuschnittQuelle, zuschnittSchliessen, uploadFile]
  )

  /** Vorhandenes Foto neu zuschneiden, am liebsten aus dem Original dieser Sitzung. */
  const handleNeuZuschneiden = useCallback(async () => {
    if (originalRef.current) {
      zuschnittOeffnen(originalRef.current, originalRef.current.name)
      return
    }
    if (!value) return
    try {
      const res = await fetch(value)
      if (!res.ok) throw new Error(String(res.status))
      const blob = await res.blob()
      const name = value.split('/').pop()?.split('?')[0] || 'foto.jpg'
      zuschnittOeffnen(blob, name)
    } catch {
      setUploadError('Das Foto lässt sich hier nicht neu zuschneiden. Bitte noch einmal hochladen.')
    }
  }, [value, zuschnittOeffnen])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith('image/')) {
          await handleFile(file)
        } else {
          setUploadError('Bitte nur Bilddateien hochladen')
        }
      }
    },
    [handleFile]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        await handleFile(files[0])
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [handleFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemove = useCallback(() => {
    originalRef.current = null
    onChange('')
    setUploadError(null)
  }, [onChange])

  const displayError = uploadError || error

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className={cn(
          'block text-sm font-medium',
          hasError || displayError ? 'text-[var(--pepe-error)]' : 'text-[var(--pepe-t80)]'
        )}>
          {label}
        </label>
      )}

      {value ? (
        // Preview mode
        <div className="relative group">
          <div
            className={cn(
              'relative overflow-hidden rounded-lg border border-[var(--pepe-line)] bg-[var(--pepe-surface)]',
              zuschnitt && 'w-fit'
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Vorschau"
              style={zuschnitt ? { aspectRatio: zuschnitt.seitenverhaeltnis } : undefined}
              className={cn('h-48 object-cover', zuschnitt ? 'w-auto' : 'w-full')}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%231a1a1a" width="400" height="200"/><text fill="%23666" font-family="Arial" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Bild konnte nicht geladen werden</text></svg>'
              }}
            />
            {/* Overlay with actions */}
            <div
              className={cn(
                'absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex flex-wrap items-center justify-center content-center gap-2 p-2',
                isUploading && 'opacity-100'
              )}
            >
              {isUploading && (
                <span className="text-sm text-white">Wird hochgeladen...</span>
              )}
              {zuschnitt && !isUploading && (
                <button
                  type="button"
                  onClick={handleNeuZuschneiden}
                  className="px-4 py-2 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors text-sm font-medium"
                >
                  Ausschnitt ändern
                </button>
              )}
              <button
                type="button"
                onClick={handleClick}
                className="px-4 py-2 bg-[var(--pepe-blue)] text-white rounded-lg hover:bg-[var(--pepe-blue)]/80 transition-colors text-sm font-medium"
              >
                Ersetzen
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-[var(--pepe-error)] text-white rounded-lg hover:bg-[var(--pepe-error)]/80 transition-colors text-sm font-medium"
              >
                Entfernen
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-[var(--pepe-t48)] truncate">{value}</p>
        </div>
      ) : (
        // Dropzone mode
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all',
            isDragging
              ? 'border-[var(--pepe-gold)] bg-[var(--pepe-gold)]/10'
              : hasError || displayError
              ? 'border-[var(--pepe-error)] bg-[var(--pepe-error)]/5 hover:bg-[var(--pepe-error)]/10'
              : 'border-[var(--pepe-line)] bg-[var(--pepe-surface)] hover:bg-[var(--pepe-ink)] hover:border-[var(--pepe-t48)]',
            isUploading && 'pointer-events-none opacity-70'
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-[var(--pepe-gold)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[var(--pepe-t80)]">Wird hochgeladen...</span>
            </div>
          ) : (
            <>
              <svg
                className={cn(
                  'w-10 h-10 mb-3',
                  isDragging ? 'text-[var(--pepe-gold)]' : 'text-[var(--pepe-t48)]'
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-[var(--pepe-t80)] text-center px-4">
                {isDragging ? 'Hier ablegen' : placeholder}
              </p>
              <p className="mt-1 text-xs text-[var(--pepe-t48)]">
                JPG, PNG, GIF, WebP · große Fotos werden automatisch verkleinert
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {zuschnittQuelle && zuschnitt && (
        <ImageCropDialog
          bildUrl={zuschnittQuelle.url}
          seitenverhaeltnis={zuschnitt.seitenverhaeltnis}
          titel={zuschnitt.titel ?? 'Ausschnitt wählen'}
          onAbbrechen={zuschnittSchliessen}
          onUebernehmen={zuschnittUebernehmen}
        />
      )}

      {displayError && (
        <p className="text-sm text-[var(--pepe-error)]">{displayError}</p>
      )}
    </div>
  )
}
