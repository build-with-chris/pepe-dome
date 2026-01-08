'use client'

import { useState } from 'react'
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
import { cn } from '@/lib/utils'
import ImageDropzone from '@/components/admin/ui/ImageDropzone'

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
  location: z.string().min(1, 'Location ist erforderlich'),
  category: z.string().min(1, 'Kategorie ist erforderlich'),
  ticketUrl: z.string().url('Ungultige URL').optional().or(z.literal('')),
  price: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
  status: z.string().default('DRAFT'),
  recurrence: z.string().optional(),
  recurrenceEnd: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface Event {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string
  date: string
  endDate: string | null
  time: string | null
  location: string
  category: string
  ticketUrl: string | null
  price: string | null
  imageUrl: string | null
  featured: boolean
  highlights: string[]
  status: string
  recurrence: string | null
  recurrenceEnd: string | null
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
  { value: 'BUSINESS', label: 'Business' },
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

export default function EventForm({ event, mode }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [highlights, setHighlights] = useState<string[]>(event?.highlights || [''])

  // Form state
  const [formData, setFormData] = useState<Partial<EventFormData>>({
    title: event?.title || '',
    subtitle: event?.subtitle || '',
    description: event?.description || '',
    date: event?.date ? formatDateForInput(event.date) : '',
    endDate: event?.endDate ? formatDateForInput(event.endDate) : '',
    time: event?.time || '',
    location: event?.location || 'Pepe Dome, Ostpark Munchen',
    category: event?.category || 'SHOW',
    ticketUrl: event?.ticketUrl || '',
    price: event?.price || '',
    imageUrl: event?.imageUrl || '',
    featured: event?.featured || false,
    status: event?.status || 'DRAFT',
    recurrence: event?.recurrence || '',
    recurrenceEnd: event?.recurrenceEnd ? formatDateForInput(event.recurrenceEnd) : '',
  })

  function formatDateForInput(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0]
  }

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
      highlights: highlights.filter((h) => h.trim() !== ''),
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

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
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
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  hasError={!!errors.description}
                  rows={5}
                  placeholder="Beschreibung des Events..."
                  className="min-h-[140px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-400">{errors.description}</p>
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

              <div className="space-y-2.5">
                <Label htmlFor="time">Uhrzeit</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                  placeholder="z.B. 20:00 Uhr"
                  inputSize="lg"
                />
              </div>

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
                  {errors.ticketUrl && (
                    <p className="text-sm text-red-400">{errors.ticketUrl}</p>
                  )}
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="price">Preis</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="z.B. 25EUR"
                    inputSize="lg"
                  />
                </div>
              </div>
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
            </div>
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

              <div className="pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured" className="cursor-pointer text-white">
                      Featured Event
                    </Label>
                    <p className="text-[11px] text-white/40 mt-0.5">
                      Prominent auf der Startseite
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => updateField('featured', checked)}
                  />
                </div>
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
