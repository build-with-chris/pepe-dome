/**
 * Hero Image Upload Component
 * Upload and preview hero images with aspect ratio validation
 */

'use client'

import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'

interface HeroImageUploadProps {
  currentImage?: string
  onUpload: (url: string) => void
}

export default function HeroImageUpload({
  currentImage,
  onUpload,
}: HeroImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || '')
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const TARGET_ASPECT_RATIO = 2 // 2:1 aspect ratio
  const TOLERANCE = 0.2 // Allow 20% tolerance

  const validateAspectRatio = (width: number, height: number) => {
    const aspectRatio = width / height
    const difference = Math.abs(aspectRatio - TARGET_ASPECT_RATIO)

    if (difference > TOLERANCE) {
      const recommendedHeight = Math.round(width / TARGET_ASPECT_RATIO)
      return {
        valid: false,
        warning: `Bildverhältnis ist ${aspectRatio.toFixed(2)}:1. Empfohlen: 2:1 (z.B. ${width}×${recommendedHeight}px)`,
      }
    }

    return { valid: true }
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    setWarning(null)

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Bitte wählen Sie eine Bilddatei aus')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Das Bild muss kleiner als 5MB sein')
      return
    }

    // Create preview and validate aspect ratio
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const validation = validateAspectRatio(img.width, img.height)

        if (!validation.valid) {
          setWarning(validation.warning || '')
        }

        setPreview(e.target?.result as string)
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Upload file
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      // For now, use a data URL as placeholder
      // In production, upload to S3 or similar storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        onUpload(dataUrl)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)

      // TODO: Implement actual upload to storage
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/admin/newsletters/upload-hero', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const result = await response.json()
      // onUpload(result.url)
    } catch (err: any) {
      setError(err.message || 'Bild konnte nicht hochgeladen werden')
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="form-label">Hero-Bild</label>
        <p className="text-sm text-pepe-t64 mb-3">
          Empfohlen: 1200×600px (2:1 Seitenverhältnis). Max. Dateigröße: 5MB
        </p>
      </div>

      {/* Preview Frame */}
      <div
        className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all ${
          isDragging
            ? 'border-pepe-gold bg-pepe-gold-glow'
            : 'border-pepe-line hover:border-pepe-gold'
        }`}
        style={{ aspectRatio: '2 / 1' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Hero-Vorschau"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="primary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                Bild ändern
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <svg
              className="w-16 h-16 text-pepe-t48 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-pepe-t80 mb-2">
              Bild hierher ziehen oder klicken zum Durchsuchen
            </p>
            <p className="text-sm text-pepe-t64 mb-4">
              2:1 Seitenverhältnis empfohlen (1200×600px)
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Wird hochgeladen...' : 'Bild auswählen'}
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Warning Message */}
      {warning && (
        <div className="bg-pepe-warning-bg border border-pepe-warning rounded-lg p-3">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-pepe-warning flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-pepe-warning">{warning}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-pepe-error-bg border border-pepe-error rounded-lg p-3">
          <p className="text-sm text-pepe-error">{error}</p>
        </div>
      )}
    </div>
  )
}
