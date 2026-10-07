'use client'

/**
 * ArtistForm
 *
 * Anlegen und Bearbeiten eines Artists. Eine Bio wird hier einmal gepflegt
 * und hängt an jedem Event, dem der Artist im Event-Formular zugeordnet wird.
 *
 * Der DeepL-Knopf übersetzt die deutsche Bio, die gerade im Feld steht, und
 * schreibt das Ergebnis nur ins EN-Feld. Gespeichert wird erst mit dem
 * Formular, damit man die Übersetzung vorher lesen und anpassen kann.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label, labelVariants } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import FieldHint from '@/components/admin/ui/FieldHint'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'
import { BIO_MAX, normalizeInstagram } from '@/lib/artist-validation'
import {
  ARTIST_BILDFORMATE,
  BILDFORMAT_INFO,
  STANDARD_BILDFORMAT,
  type ArtistBildformat,
} from '@/lib/artist-bildformat'

export type ArtistFormData = {
  id?: string
  name: string
  imageUrl: string
  imageFormat: ArtistBildformat
  bio: string
  bioEn: string
  instagramUrl: string
  websiteUrl: string
}

const LEERER_ARTIST: ArtistFormData = {
  name: '',
  imageUrl: '',
  imageFormat: STANDARD_BILDFORMAT,
  bio: '',
  bioEn: '',
  instagramUrl: '',
  websiteUrl: '',
}

type Errors = Partial<Record<keyof ArtistFormData, string>>

export default function ArtistForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<ArtistFormData>
}) {
  const router = useRouter()
  const [data, setData] = useState<ArtistFormData>({ ...LEERER_ARTIST, ...initial })
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [translating, setTranslating] = useState(false)
  const [translateMessage, setTranslateMessage] = useState<string | null>(null)
  /** Format, in dem das aktuelle Foto zugeschnitten wurde. */
  const [fotoFormat, setFotoFormat] = useState<ArtistBildformat>(data.imageFormat)

  function update<K extends keyof ArtistFormData>(key: K, value: ArtistFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  function validate(): Errors {
    const next: Errors = {}
    if (!data.name.trim()) next.name = 'Name ist Pflicht'
    if (!data.bio.trim()) next.bio = 'Bio ist Pflicht'
    else if (data.bio.trim().length > BIO_MAX) next.bio = `Höchstens ${BIO_MAX} Zeichen`
    if (data.bioEn.trim().length > BIO_MAX) next.bioEn = `Höchstens ${BIO_MAX} Zeichen`
    if (data.instagramUrl.trim() && !normalizeInstagram(data.instagramUrl)) {
      next.instagramUrl = 'Als @handle oder als Link auf instagram.com angeben'
    }
    if (data.websiteUrl.trim() && !/^https:\/\/[^\s]+\.[^\s]+$/i.test(data.websiteUrl.trim())) {
      next.websiteUrl = 'Muss mit https:// beginnen'
    }
    return next
  }

  async function handleTranslate() {
    setTranslateMessage(null)
    if (!data.bio.trim()) {
      setTranslateMessage('Erst die deutsche Bio eintragen.')
      return
    }
    setTranslating(true)
    try {
      const res = await fetch('/api/admin/artists/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: data.bio }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error ?? 'Übersetzung fehlgeschlagen')
      update('bioEn', body?.bio ?? '')
      setTranslateMessage('Übersetzt. Bitte lesen, bei Bedarf anpassen und dann speichern.')
    } catch (error) {
      setTranslateMessage(error instanceof Error ? error.message : 'Übersetzung fehlgeschlagen')
    } finally {
      setTranslating(false)
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setServerError(null)

    const gefunden = validate()
    if (Object.keys(gefunden).length > 0) {
      setErrors(gefunden)
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: data.name.trim(),
        imageUrl: data.imageUrl.trim() || null,
        imageFormat: data.imageFormat,
        bio: data.bio.trim(),
        bioEn: data.bioEn.trim() || null,
        instagramUrl: data.instagramUrl.trim() || null,
        websiteUrl: data.websiteUrl.trim() || null,
      }

      const res = await fetch(
        mode === 'create' ? '/api/admin/artists' : `/api/admin/artists/${data.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Speichern fehlgeschlagen')
      }

      router.push('/admin/artists')
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  const bioLaenge = data.bio.trim().length
  const bioEnLaenge = data.bioEn.trim().length

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Artist
        </h2>

        <div className="space-y-2.5">
          <Label htmlFor="name" hasError={!!errors.name} required>
            Name
          </Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            hasError={!!errors.name}
            placeholder="Vor- und Nachname oder Bühnenname"
            inputSize="lg"
          />
          {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
        </div>

        <fieldset className="space-y-2.5">
          <legend className={`${labelVariants()} mb-2.5`}>
            Bildformat
          </legend>
          <div className="flex flex-wrap gap-2">
            {ARTIST_BILDFORMATE.map((format) => {
              const info = BILDFORMAT_INFO[format]
              const aktiv = data.imageFormat === format
              return (
                <label
                  key={format}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#016dca] ${
                    aktiv
                      ? 'border-[#016dca] bg-[#016dca]/15 text-white'
                      : 'border-white/[0.12] text-white/70 hover:border-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="imageFormat"
                    value={format}
                    checked={aktiv}
                    onChange={() => update('imageFormat', format)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`inline-block border-2 rounded-sm ${aktiv ? 'border-[#016dca]' : 'border-white/40'}`}
                    style={{ height: 16, width: Math.round(16 * info.seitenverhaeltnis) }}
                  />
                  {info.label}
                  <span className="text-white/40">{info.verhaeltnis}</span>
                </label>
              )
            })}
          </div>
          <FieldHint>
            In diesem Format erscheint das Foto auf der Eventseite. Welches Format der
            Artist möchte, am besten vorher fragen. Beim Hochladen wählst du den
            Ausschnitt selbst, große Fotos werden dabei automatisch verkleinert.
          </FieldHint>
        </fieldset>

        <div className="space-y-2.5">
          <ImageDropzone
            label="Foto"
            value={data.imageUrl}
            onChange={(url) => {
              update('imageUrl', url)
              setFotoFormat(data.imageFormat)
            }}
            placeholder="Foto hierher ziehen oder klicken"
            zuschnitt={{
              seitenverhaeltnis: BILDFORMAT_INFO[data.imageFormat].seitenverhaeltnis,
              titel: `Ausschnitt wählen: ${BILDFORMAT_INFO[data.imageFormat].label}`,
            }}
          />
          {data.imageUrl && fotoFormat !== data.imageFormat ? (
            <p className="text-sm text-amber-300">
              Das Foto ist noch für {BILDFORMAT_INFO[fotoFormat].label} zugeschnitten. Mit der
              Maus aufs Foto und &bdquo;Ausschnitt ändern&ldquo;, damit es zum neuen Format passt.
            </p>
          ) : (
            <FieldHint>Am besten ein Foto, auf dem die Person gut zu erkennen ist.</FieldHint>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="bio" hasError={!!errors.bio} required>
            Bio
          </Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
            rows={5}
            placeholder="Was die Person kann, woher sie kommt, welchen Hintergrund sie hat."
          />
          <div className="flex items-start justify-between gap-4">
            {errors.bio ? (
              <p className="text-sm text-red-400">{errors.bio}</p>
            ) : (
              <FieldHint>Zwei bis drei Sätze reichen.</FieldHint>
            )}
            <span
              className={`text-[11px] shrink-0 ${bioLaenge > BIO_MAX ? 'text-red-400' : 'text-white/40'}`}
            >
              {bioLaenge}/{BIO_MAX}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label htmlFor="bioEn" hasError={!!errors.bioEn}>
              Bio (EN)
            </Label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleTranslate}
              disabled={translating}
            >
              {translating ? 'Übersetze…' : 'Übersetzen (DeepL)'}
            </Button>
          </div>
          <Textarea
            id="bioEn"
            value={data.bioEn}
            onChange={(e) => update('bioEn', e.target.value)}
            rows={5}
            placeholder="Leer lassen: Die englische Seite zeigt dann die deutsche Bio."
          />
          <div className="flex items-start justify-between gap-4">
            {errors.bioEn ? (
              <p className="text-sm text-red-400">{errors.bioEn}</p>
            ) : translateMessage ? (
              <p className="text-sm text-[#016dca]">{translateMessage}</p>
            ) : (
              <FieldHint>Ohne englische Bio zeigt die englische Seite die deutsche.</FieldHint>
            )}
            <span
              className={`text-[11px] shrink-0 ${bioEnLaenge > BIO_MAX ? 'text-red-400' : 'text-white/40'}`}
            >
              {bioEnLaenge}/{BIO_MAX}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Links
        </h2>

        <div className="space-y-2.5">
          <Label htmlFor="instagramUrl" hasError={!!errors.instagramUrl}>
            Instagram
          </Label>
          <Input
            id="instagramUrl"
            value={data.instagramUrl}
            onChange={(e) => update('instagramUrl', e.target.value)}
            hasError={!!errors.instagramUrl}
            placeholder="@handle oder https://www.instagram.com/…"
            inputSize="lg"
          />
          {errors.instagramUrl ? (
            <p className="text-sm text-red-400">{errors.instagramUrl}</p>
          ) : (
            <FieldHint>Wird als Link auf das Profil gespeichert.</FieldHint>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="websiteUrl" hasError={!!errors.websiteUrl}>
            Website
          </Label>
          <Input
            id="websiteUrl"
            value={data.websiteUrl}
            onChange={(e) => update('websiteUrl', e.target.value)}
            hasError={!!errors.websiteUrl}
            placeholder="https://…"
            inputSize="lg"
          />
          {errors.websiteUrl ? (
            <p className="text-sm text-red-400">{errors.websiteUrl}</p>
          ) : (
            <FieldHint>Nur https. Ein Linktree geht hier auch.</FieldHint>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Speichern…' : mode === 'create' ? 'Artist anlegen' : 'Änderungen speichern'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/artists')}
          disabled={saving}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
