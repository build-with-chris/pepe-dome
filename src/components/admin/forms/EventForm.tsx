'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'
import FieldHint from '@/components/admin/ui/FieldHint'
import MarkdownToolbar from '@/components/admin/ui/MarkdownToolbar'
import {
  EVENT_PRICE_PRESETS,
  detectPriceOption,
  priceTextFor,
  type EventPriceOption,
} from '@/lib/event-price'
import { isNormalizedTime, normalizeTime } from '@/lib/event-time'
import { isValidTrailerInput, parseTrailer } from '@/lib/event-trailer'

/**
 * EventForm component
 *
 * Reusable form for creating/editing events.
 * Features:
 * - All event fields
 * - Validation with zod
 * - Loading/error states
 * - Highlights management
 */

// Event schema for validation
const eventSchema = z.object({
  title: z.string().min(1, 'Titel ist erforderlich'),
  subtitle: z.string().optional(),
  description: z.string().min(1, 'Beschreibung ist erforderlich'),
  date: z.string().min(1, 'Datum ist erforderlich'),
  endDate: z.string().optional(),
  time: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().min(1, 'Location ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  ticketUrl: z.string().optional().or(z.literal('')),
  price: z.string().optional(),
  trailerUrl: z
    .string()
    .optional()
    .refine(
      isValidTrailerInput,
      'Bitte einen YouTube- oder Vimeo-Link eintragen, oder einen Pfad wie /videos/trailer.mp4'
    ),
  imageUrl: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  status: z.string().default('DRAFT'),
  recurrence: z.string().optional(),
  recurrenceEnd: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

/** Englische Übersetzung der übersetzbaren Event-Felder */
interface EventTranslation {
  title?: string
  subtitle?: string | null
  description?: string
  highlights?: string[]
  price?: string | null
}

interface Event {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  date: string
  endDate: string | null
  time: string | null
  endTime: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  trailerUrl: string | null
  imageUrl: string | null
  featured: boolean
  highlights: string[]
  status: string
  recurrence: string | null
  recurrenceEnd: string | null
  translations?: Record<string, EventTranslation>
}

interface EventFormProps {
  /** Existing event data for editing */
  event?: Event
  /** Form mode */
  mode: 'create' | 'edit'
}

const categories = [
  { value: 'SHOW', label: 'Show' },
  { value: 'PREMIERE', label: 'Premiere' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'OPEN_TRAINING', label: 'Open Training' },
  { value: 'KINDERTRAINING', label: 'Kindertraining' },
  { value: 'OPEN_AIR', label: 'Open Air' },
  { value: 'EVENT', label: 'Event' },
]

const recurrenceOptions = [
  { value: '', label: 'Keine Wiederholung' },
  { value: 'DAILY', label: 'Taglich' },
  { value: 'WEEKLY', label: 'Wochentlich' },
  { value: 'BIWEEKLY', label: 'Alle 2 Wochen' },
  { value: 'MONTHLY', label: 'Monatlich' },
]

const statusOptions = [
  { value: 'DRAFT', label: 'Entwurf' },
  { value: 'PUBLISHED', label: 'Veroffentlicht' },
  { value: 'ARCHIVED', label: 'Archiviert' },
]

/**
 * Auswahl statt Freitext beim Preis. Der Dome kennt drei Preise, das Textfeld
 * hatte trotzdem ein Dutzend Schreibweisen produziert. "Sonderpreis" bleibt als
 * Ausweg für Gastspiele und für Altbestand, der sonst beim Speichern verloren
 * ginge.
 */
const priceOptions: { value: EventPriceOption | 'NONE'; label: string }[] = [
  { value: 'NONE', label: 'Noch kein Preis' },
  ...EVENT_PRICE_PRESETS.map((preset) => ({ value: preset.option, label: preset.de })),
  { value: 'CUSTOM', label: 'Sonderpreis (Freitext)' },
]

/** Alle englischen Preistexte, die wir selbst gesetzt haben */
const presetEnglishPrices = EVENT_PRICE_PRESETS.map((preset) => preset.en)

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [highlights, setHighlights] = useState<string[]>(event?.highlights || [''])
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  // Englische Übersetzung (Highlights als eine Zeile pro Eintrag)
  const en = event?.translations?.en
  const [translating, setTranslating] = useState(false)
  const [translateMessage, setTranslateMessage] = useState<string | null>(null)
  const [enFields, setEnFields] = useState({
    title: en?.title || '',
    subtitle: en?.subtitle || '',
    description: en?.description || '',
    price: en?.price || '',
    highlights: (en?.highlights || []).join('\n'),
  })

  function updateEnField(field: keyof typeof enFields, value: string) {
    setEnFields((prev) => ({ ...prev, [field]: value }))
  }

  function buildTranslations(): Record<string, EventTranslation> {
    return {
      ...(event?.translations || {}),
      en: {
        title: enFields.title.trim(),
        subtitle: enFields.subtitle.trim() || null,
        description: enFields.description.trim(),
        price: enFields.price.trim() || null,
        highlights: enFields.highlights
          .split('\n')
          .map((h) => h.trim())
          .filter(Boolean),
      },
    }
  }

  async function handleTranslate() {
    if (!event?.id) return
    setTranslating(true)
    setTranslateMessage(null)
    try {
      const res = await fetch(`/api/admin/events/${event.id}/translate`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Übersetzung fehlgeschlagen')
      const newEn = (data.translations?.en || {}) as EventTranslation
      setEnFields({
        title: newEn.title || '',
        subtitle: newEn.subtitle || '',
        description: newEn.description || '',
        price: newEn.price || '',
        highlights: (newEn.highlights || []).join('\n'),
      })
      setTranslateMessage('Übersetzt und gespeichert. Bei Bedarf unten anpassen und "Speichern" klicken.')
    } catch (err) {
      setTranslateMessage(err instanceof Error ? err.message : 'Übersetzung fehlgeschlagen')
    } finally {
      setTranslating(false)
    }
  }

  // Form state
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    title: event?.title || '',
    subtitle: event?.subtitle || '',
    description: event?.description || '',
    date: event?.date ? formatDateForInput(event.date) : '',
    endDate: event?.endDate ? formatDateForInput(event.endDate) : '',
    // Die Zeit-Picker verlangen "HH:MM". Altbestand wie "ab 20" wird geparst,
    // damit das Feld nicht leer aussieht und die Zeit still verschwindet.
    time: normalizeTime(event?.time) || '',
    endTime: normalizeTime(event?.endTime) || '',
    location: event?.location || 'Pepe Dome, Ostpark Munchen',
    category: event?.category || 'SHOW',
    ticketUrl: event?.ticketUrl || '',
    price: event?.price || '',
    trailerUrl: event?.trailerUrl || '',
    imageUrl: event?.imageUrl || '',
    featured: event?.featured || false,
    status: event?.status || 'DRAFT',
    recurrence: event?.recurrence || '',
    recurrenceEnd: event?.recurrenceEnd ? formatDateForInput(event.recurrenceEnd) : '',
  })

  function formatDateForInput(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0]
  }

  // Preis als Auswahl. Der Freitext lebt nur noch im Sonderfall.
  const [priceOption, setPriceOption] = useState<EventPriceOption | 'NONE'>(
    detectPriceOption(event?.price) ?? 'NONE'
  )
  const [customPrice, setCustomPrice] = useState(
    detectPriceOption(event?.price) === 'CUSTOM' ? event?.price || '' : ''
  )

  function changePriceOption(next: EventPriceOption | 'NONE') {
    setPriceOption(next)

    // Englische Fassung mitziehen, solange dort nichts von Hand steht. Sonst
    // müsste die Redaktion den Preis zweimal pflegen und die EN-Seite zeigt
    // weiter den alten Betrag.
    const englishPreset = next === 'NONE' || next === 'CUSTOM' ? null : priceTextFor(next, 'en')
    if (englishPreset && (!enFields.price || presetEnglishPrices.includes(enFields.price))) {
      updateEnField('price', englishPreset)
    }
  }

  /** Was am Ende im Preisfeld der Datenbank steht */
  function resolvePrice(): string {
    if (priceOption === 'NONE') return ''
    if (priceOption === 'CUSTOM') return customPrice.trim()
    return priceTextFor(priceOption) ?? ''
  }

  // Rückmeldung noch beim Tippen: ein Link, den die Website später stumm
  // ignorieren würde, soll nicht erst beim Speichern auffallen.
  const trailerPreview = parseTrailer(formData.trailerUrl)

  // Uhrzeiten, die sich nicht in "HH:MM" übersetzen lassen ("nach Vereinbarung").
  // Beim Speichern würden sie durch den Picker-Wert ersetzt, deshalb sichtbar machen.
  const legacyTime = event?.time && !isNormalizedTime(event.time) ? event.time : null

  function updateField(field: keyof EventFormData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function addHighlight() {
    setHighlights([...highlights, ''])
  }

  function updateHighlight(index: number, value: string) {
    const newHighlights = [...highlights]
    newHighlights[index] = value
    setHighlights(newHighlights)
  }

  function removeHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Prepare data
    const data = {
      ...formData,
      price: resolvePrice(),
      highlights: highlights.filter((h) => h.trim() !== ''),
    }

    if (priceOption === 'CUSTOM' && data.price === '') {
      setErrors({ price: 'Bitte den Sonderpreis eintragen oder eine Stufe auswahlen' })
      setLoading(false)
      return
    }

    // Validate
    const result = eventSchema.safeParse(data)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    try {
      const url = mode === 'create' ? '/api/admin/events' : `/api/admin/events/${event?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      // translations läuft am zod-Schema vorbei (nur im Edit-Modus relevant)
      const payload =
        mode === 'edit' ? { ...result.data, translations: buildTranslations() } : result.data

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Fehler beim Speichern')
      }

      router.push('/admin/events')
      router.refresh()
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form-level error */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {errors.form}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">
        {/* LEFT COLUMN - Main content */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Basis-Informationen
            </h2>

            <div className="space-y-5">
              {/* Startseite: Featured-Events (sichtbar ohne Sidebar-Scroll auf Mobile) */}
              <div className="rounded-lg border border-white/[0.12] bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="featured-home" className="cursor-pointer text-white">
                      Auf Startseite anzeigen
                    </Label>
                    <p className="text-xs text-white/50 leading-relaxed max-w-xl">
                      Wenn aktiv, erscheint das Event in der Sektion &quot;Kommende Events&quot; auf der Startseite
                      (Featured Events). Es werden bis zu drei Featured-Events angezeigt; ohne Featured
                      nutzt die Startseite einfach die nachsten kommenden Events.
                    </p>
                  </div>
                  <Switch
                    id="featured-home"
                    checked={!!formData.featured}
                    onCheckedChange={(checked) => updateField('featured', checked)}
                    className="shrink-0"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="title" hasError={!!errors.title} required>
                  Titel
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  hasError={!!errors.title}
                  placeholder="Event-Titel"
                  inputSize="lg"
                />
                {errors.title && (
                  <p className="text-sm text-red-400">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="subtitle">Untertitel</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Optionaler Untertitel"
                  inputSize="lg"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="description" hasError={!!errors.description} required>
                  Beschreibung
                </Label>
                <MarkdownToolbar
                  textareaRef={descriptionRef}
                  value={formData.description || ''}
                  onChange={(next) => updateField('description', next)}
                />
                <Textarea
                  id="description"
                  ref={descriptionRef}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  hasError={!!errors.description}
                  rows={5}
                  placeholder="Beschreibung des Events..."
                  className="min-h-[140px]"
                />
                {errors.description ? (
                  <p className="text-sm text-red-400">{errors.description}</p>
                ) : (
                  <FieldHint>
                    Der Fliesstext auf der Event-Detailseite. Text markieren und auf
                    einen Knopf in der Leiste klicken, dann setzt sich die Formatierung
                    von selbst.
                  </FieldHint>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Datum & Zeit
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="date" hasError={!!errors.date} required>
                    Startdatum
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    hasError={!!errors.date}
                    inputSize="lg"
                  />
                  {errors.date && (
                    <p className="text-sm text-red-400">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="endDate">Enddatum</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    inputSize="lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="time">Beginn</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="endTime">Ende</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    inputSize="lg"
                  />
                </div>
              </div>

              <p className="text-xs text-white/50 leading-relaxed">
                Auf der Website steht damit &quot;20:00 bis 22:00 Uhr&quot;, ohne Ende nur
                &quot;20:00 Uhr&quot;. Das Ende ist optional, bei Shows ohne festes Ende
                einfach leer lassen.
              </p>

              {legacyTime && (
                <p className="text-xs text-amber-400/90 leading-relaxed">
                  Bisher stand hier &quot;{legacyTime}&quot;. Beim Speichern wird der Wert
                  aus den beiden Feldern oben ubernommen.
                </p>
              )}

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="recurrence">Wiederholung</Label>
                  <Select
                    value={formData.recurrence || 'none'}
                    onValueChange={(value) => updateField('recurrence', value === 'none' ? '' : value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Keine Wiederholung" />
                    </SelectTrigger>
                    <SelectContent>
                      {recurrenceOptions.map((opt) => (
                        <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="recurrenceEnd">Wiederholung bis</Label>
                  <Input
                    id="recurrenceEnd"
                    type="date"
                    value={formData.recurrenceEnd}
                    onChange={(e) => updateField('recurrenceEnd', e.target.value)}
                    disabled={!formData.recurrence}
                    inputSize="lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location & Tickets */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Location & Tickets
            </h2>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="location" hasError={!!errors.location} required>
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  hasError={!!errors.location}
                  placeholder="Veranstaltungsort"
                  inputSize="lg"
                />
                {errors.location && (
                  <p className="text-sm text-red-400">{errors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2.5">
                  <Label htmlFor="ticketUrl">Ticket-URL</Label>
                  <Input
                    id="ticketUrl"
                    type="url"
                    value={formData.ticketUrl}
                    onChange={(e) => updateField('ticketUrl', e.target.value)}
                    hasError={!!errors.ticketUrl}
                    placeholder="https://..."
                    inputSize="lg"
                  />
                  {errors.ticketUrl ? (
                    <p className="text-sm text-red-400">{errors.ticketUrl}</p>
                  ) : (
                    <FieldHint>
                      Ziel des Ticket-Knopfes. Ohne Link steht dort &quot;Tickets bald
                      verfugbar&quot;. Eine mailto-Adresse macht daraus eine Anfrage per
                      Mail statt eines Ticketkaufs.
                    </FieldHint>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="price">Preis</Label>
                  <Select
                    value={priceOption}
                    onValueChange={(value) => changePriceOption(value as EventPriceOption | 'NONE')}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {priceOption === 'FREE' && (
                    <p className="text-[11px] text-white/40">
                      Das Event bekommt auf der Website den Gratis-Sticker.
                    </p>
                  )}
                </div>
              </div>

              {priceOption === 'CUSTOM' && (
                <div className="space-y-2.5">
                  <Label htmlFor="customPrice" hasError={!!errors.price}>
                    Sonderpreis
                  </Label>
                  <Input
                    id="customPrice"
                    value={customPrice}
                    onChange={(e) => {
                      setCustomPrice(e.target.value)
                      if (errors.price) {
                        setErrors((prev) => {
                          const next = { ...prev }
                          delete next.price
                          return next
                        })
                      }
                    }}
                    hasError={!!errors.price}
                    placeholder="z.B. ab 18 EUR, Gastspiel"
                    inputSize="lg"
                  />
                  {errors.price ? (
                    <p className="text-sm text-red-400">{errors.price}</p>
                  ) : (
                    <p className="text-[11px] text-white/40">
                      Nur fur Gastspiele und Kooperationen. Regulare Termine laufen uber
                      die drei Stufen, damit die Preise einheitlich bleiben.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Highlights
            </h2>

            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    value={highlight}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder="z.B. Live-Musik"
                    className="flex-1"
                    inputSize="lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHighlight(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addHighlight}
                className="text-[#016dca] hover:text-[#016dca] hover:bg-[#016dca]/10 mt-2"
              >
                + Highlight hinzufugen
              </Button>

              <div className="pt-1">
                <FieldHint>
                  Kurze Stichpunkte, die auf der Detailseite als Hakenliste neben der
                  Beschreibung stehen. Drei bis funf reichen. Leere Zeilen werden beim
                  Speichern verworfen.
                </FieldHint>
              </div>
            </div>
          </div>

          {/* Englische Übersetzung */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
                Englische Übersetzung
              </h2>
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleTranslate}
                  disabled={translating}
                >
                  {translating ? 'Übersetze…' : 'Automatisch übersetzen (DeepL)'}
                </Button>
              )}
            </div>

            {mode === 'create' ? (
              <p className="text-sm text-white/50">
                Die englische Übersetzung ist verfügbar, sobald das Event erstellt wurde.
              </p>
            ) : (
              <div className="space-y-5">
                {translateMessage && (
                  <p className="text-sm text-[#016dca]">{translateMessage}</p>
                )}
                <p className="text-xs text-white/50 leading-relaxed">
                  Leere Felder fallen auf der Website automatisch auf den deutschen Text
                  zurück. Nach der automatischen Übersetzung kannst du hier einzelne
                  Formulierungen korrigieren und mit &quot;Speichern&quot; übernehmen.
                </p>

                <div className="space-y-2.5">
                  <Label htmlFor="en-title">Titel (EN)</Label>
                  <Input
                    id="en-title"
                    value={enFields.title}
                    onChange={(e) => updateEnField('title', e.target.value)}
                    placeholder="Event title"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="en-subtitle">Untertitel (EN)</Label>
                  <Input
                    id="en-subtitle"
                    value={enFields.subtitle}
                    onChange={(e) => updateEnField('subtitle', e.target.value)}
                    placeholder="Optional subtitle"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="en-description">Beschreibung (EN)</Label>
                  <Textarea
                    id="en-description"
                    value={enFields.description}
                    onChange={(e) => updateEnField('description', e.target.value)}
                    rows={5}
                    placeholder="Event description…"
                    className="min-h-[140px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="en-price">Preis (EN)</Label>
                    <Input
                      id="en-price"
                      value={enFields.price}
                      onChange={(e) => updateEnField('price', e.target.value)}
                      placeholder="e.g. Free entry"
                      inputSize="lg"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="en-highlights">Highlights (EN, eine Zeile pro Highlight)</Label>
                  <Textarea
                    id="en-highlights"
                    value={enFields.highlights}
                    onChange={(e) => updateEnField('highlights', e.target.value)}
                    rows={3}
                    placeholder={'Live music\nFood trucks'}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Image */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Event-Bild
            </h2>

            <ImageDropzone
              value={formData.imageUrl}
              onChange={(url) => updateField('imageUrl', url)}
              hasError={!!errors.imageUrl}
              error={errors.imageUrl}
              placeholder="Bild hier ablegen"
            />
          </div>

          {/* Trailer */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Trailer
            </h2>

            <div className="space-y-2.5">
              <Label htmlFor="trailerUrl" hasError={!!errors.trailerUrl}>
                Video-Link oder Dateipfad
              </Label>
              <Input
                id="trailerUrl"
                value={formData.trailerUrl}
                onChange={(e) => updateField('trailerUrl', e.target.value)}
                hasError={!!errors.trailerUrl}
                placeholder="https://youtu.be/... oder /videos/showreel.mp4"
                inputSize="lg"
              />
              {errors.trailerUrl ? (
                <p className="text-sm text-red-400">{errors.trailerUrl}</p>
              ) : (
                <FieldHint>
                  Steht auf der Detailseite uber der Beschreibung und als
                  Trailer-Knopf auf der Event-Karte. Erlaubt sind YouTube- und
                  Vimeo-Links sowie eigene Videos aus dem Projekt, z.B.
                  /videos/showreel.mp4. Der Film wird erst geladen, wenn jemand
                  auf Start klickt.
                </FieldHint>
              )}
              {trailerPreview && (
                <p className="text-[11px] text-white/40">
                  Erkannt als{' '}
                  {trailerPreview.provider ?? 'eigenes Video aus dem Projekt'}.
                </p>
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-6">
              Einstellungen
            </h2>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <Label htmlFor="category" hasError={!!errors.category} required>
                  Kategorie
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Kategorie wahlen" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
            <div className="space-y-3">
              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                {loading
                  ? 'Speichern...'
                  : mode === 'create'
                  ? 'Event erstellen'
                  : 'Speichern'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => router.push('/admin/events')}
                className="w-full"
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
