'use client'

import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

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
}

export default function ImageDropzone({
  value,
  onChange,
  label = 'Bild',
  hasError = false,
  error,
  className,
  placeholder = 'Bild hier ablegen oder klicken zum Hochladen',
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      const formData = new FormData()
      formData.append('file', file)

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
        setUploadError(`Serverfehler ${response.status}. Antwort war kein JSON – prüfe Vercel-Logs oder Supabase.`)
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

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.type.startsWith('image/')) {
          await uploadFile(file)
        } else {
          setUploadError('Bitte nur Bilddateien hochladen')
        }
      }
    },
    [uploadFile]
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        await uploadFile(files[0])
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [uploadFile]
  )

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleRemove = useCallback(() => {
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
          <div className="relative overflow-hidden rounded-lg border border-[var(--pepe-line)] bg-[var(--pepe-surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Vorschau"
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%231a1a1a" width="400" height="200"/><text fill="%23666" font-family="Arial" font-size="14" x="50%" y="50%" text-anchor="middle" dy=".3em">Bild konnte nicht geladen werden</text></svg>'
              }}
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
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
                JPG, PNG, GIF, WebP (max 10MB)
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

      {displayError && (
        <p className="text-sm text-[var(--pepe-error)]">{displayError}</p>
      )}
    </div>
  )
}
