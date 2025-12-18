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
  imageUrl: z.string().url('Ungultige URL').optional().or(z.literal('')),
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Form-level error */}
      {errors.form && (
        <div className="p-4 bg-[var(--pepe-error)]/10 border border-[var(--pepe-error)]/20 rounded-lg text-[var(--pepe-error)]">
          {errors.form}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Basis-Informationen
        </h2>

        <div className="space-y-2">
          <Label htmlFor="title" hasError={!!errors.title} required>
            Titel
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            hasError={!!errors.title}
            placeholder="Event-Titel"
          />
          {errors.title && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Untertitel</Label>
          <Input
            id="subtitle"
            value={formData.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
            placeholder="Optionaler Untertitel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" hasError={!!errors.description} required>
            Beschreibung
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            hasError={!!errors.description}
            rows={4}
            placeholder="Beschreibung des Events..."
          />
          {errors.description && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" hasError={!!errors.category} required>
              Kategorie
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => updateField('category', value)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateField('status', value)}
            >
              <SelectTrigger>
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

      {/* Date & Time */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Datum & Zeit
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" hasError={!!errors.date} required>
              Startdatum
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateField('date', e.target.value)}
              hasError={!!errors.date}
            />
            {errors.date && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Enddatum</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Uhrzeit</Label>
          <Input
            id="time"
            value={formData.time}
            onChange={(e) => updateField('time', e.target.value)}
            placeholder="z.B. 20:00 Uhr"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recurrence">Wiederholung</Label>
            <Select
              value={formData.recurrence || ''}
              onValueChange={(value) => updateField('recurrence', value || undefined)}
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="recurrenceEnd">Wiederholung bis</Label>
            <Input
              id="recurrenceEnd"
              type="date"
              value={formData.recurrenceEnd}
              onChange={(e) => updateField('recurrenceEnd', e.target.value)}
              disabled={!formData.recurrence}
            />
          </div>
        </div>
      </div>

      {/* Location & Tickets */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Location & Tickets
        </h2>

        <div className="space-y-2">
          <Label htmlFor="location" hasError={!!errors.location} required>
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => updateField('location', e.target.value)}
            hasError={!!errors.location}
            placeholder="Veranstaltungsort"
          />
          {errors.location && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ticketUrl">Ticket-URL</Label>
            <Input
              id="ticketUrl"
              type="url"
              value={formData.ticketUrl}
              onChange={(e) => updateField('ticketUrl', e.target.value)}
              hasError={!!errors.ticketUrl}
              placeholder="https://..."
            />
            {errors.ticketUrl && (
              <p className="text-sm text-[var(--pepe-error)]">{errors.ticketUrl}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preis</Label>
            <Input
              id="price"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              placeholder="z.B. 25EUR / ermassigt 18EUR"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Medien & Optionen
        </h2>

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Bild-URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            hasError={!!errors.imageUrl}
            placeholder="https://..."
          />
          {errors.imageUrl && (
            <p className="text-sm text-[var(--pepe-error)]">{errors.imageUrl}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Switch
            id="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => updateField('featured', checked)}
          />
          <Label htmlFor="featured" className="cursor-pointer">
            Featured Event (prominent auf der Startseite anzeigen)
          </Label>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
          Highlights
        </h2>

        {highlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              placeholder="z.B. Live-Musik"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeHighlight(index)}
              className="text-[var(--pepe-error)] hover:text-[var(--pepe-error)]"
            >
              Entfernen
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addHighlight}
          className="text-[var(--pepe-gold)]"
        >
          + Highlight hinzufugen
        </Button>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading
            ? 'Speichern...'
            : mode === 'create'
            ? 'Event erstellen'
            : 'Anderungen speichern'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/events')}
        >
          Abbrechen
        </Button>
      </div>
    </form>
  )
}
