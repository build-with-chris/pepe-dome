'use client'

/**
 * CourseForm
 *
 * Anlegen und Bearbeiten eines Kurses samt seiner Wochentermine.
 *
 * Der Unterschied zum EventForm ist die Terminliste: ein Event hat ein Datum,
 * ein Kurs hat beliebig viele wöchentliche Termine. Luftakrobatik läuft
 * viermal, ist aber ein Kurs — genau deshalb wird hier eine Liste gepflegt
 * und nicht viermal derselbe Kurs angelegt.
 *
 * Löschen bietet dieses Formular bewusst nicht an. Wer einen Kurs loswerden
 * will, setzt ihn auf „Pausiert": die Texte bleiben erhalten und der Kurs ist
 * mit einem Klick zurück. Echtes Löschen gibt es nur in der Liste und nur für
 * super_admin.
 */

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import FieldHint from '@/components/admin/ui/FieldHint'
import MarkdownToolbar from '@/components/admin/ui/MarkdownToolbar'
import { normalizeTime } from '@/lib/event-time'
import { weekdayName } from '@/lib/course-types'

export type CourseFormSlot = { weekday: number; startTime: string; endTime: string }

export type CourseFormData = {
  id?: string
  slug?: string
  title: string
  sub: string
  description: string
  inhalte: string[]
  alter: string
  fuerWen: string
  target: 'kinder' | 'teens' | 'erwachsene'
  trainer: string
  bookingUrl: string
  bookingLabel: string
  bookingNote: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  sortOrder: number
  slots: CourseFormSlot[]
}

const LEERER_KURS: CourseFormData = {
  title: '',
  sub: '',
  description: '',
  inhalte: [],
  alter: '',
  fuerWen: '',
  target: 'erwachsene',
  trainer: '',
  bookingUrl: '',
  bookingLabel: '',
  bookingNote: '',
  status: 'DRAFT',
  sortOrder: 0,
  slots: [{ weekday: 1, startTime: '17:00', endTime: '18:00' }],
}

const ZIELGRUPPEN: { value: CourseFormData['target']; label: string }[] = [
  { value: 'kinder', label: 'Kinder' },
  // Technisch heisst die Gruppe weiterhin teens, angezeigt wird Jugendliche.
  { value: 'teens', label: 'Jugendliche' },
  { value: 'erwachsene', label: 'Erwachsene' },
]

const STATUS: { value: CourseFormData['status']; label: string; hint: string }[] = [
  { value: 'DRAFT', label: 'Entwurf', hint: 'Steht noch nicht auf der Website.' },
  { value: 'PUBLISHED', label: 'Veröffentlicht', hint: 'Ist auf der Website sichtbar.' },
  { value: 'ARCHIVED', label: 'Pausiert', hint: 'Von der Website genommen, Texte bleiben erhalten.' },
]

type Errors = Record<string, string>

export default function CourseForm({
  mode,
  initial,
}: {
  mode: 'create' | 'edit'
  initial?: Partial<CourseFormData>
}) {
  const router = useRouter()
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const [data, setData] = useState<CourseFormData>({ ...LEERER_KURS, ...initial })
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  function update<K extends keyof CourseFormData>(key: K, value: CourseFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key as string]) return prev
      const next = { ...prev }
      delete next[key as string]
      return next
    })
  }

  // ── Inhalte ───────────────────────────────────────────────────────────────

  const addInhalt = () => update('inhalte', [...data.inhalte, ''])
  const setInhalt = (index: number, value: string) =>
    update('inhalte', data.inhalte.map((entry, i) => (i === index ? value : entry)))
  const removeInhalt = (index: number) =>
    update('inhalte', data.inhalte.filter((_, i) => i !== index))

  // ── Termine ───────────────────────────────────────────────────────────────

  const addSlot = () => {
    // Neuen Termin auf dem zuletzt gewaehlten Tag anlegen: wer Montag 17:15
    // eintraegt, will als naechstes meistens Montag 18:15, nicht Montag 17:00.
    const letzter = data.slots[data.slots.length - 1]
    update('slots', [
      ...data.slots,
      letzter
        ? { weekday: letzter.weekday, startTime: letzter.endTime, endTime: letzter.endTime }
        : { weekday: 1, startTime: '17:00', endTime: '18:00' },
    ])
  }

  const setSlot = (index: number, patch: Partial<CourseFormSlot>) =>
    update('slots', data.slots.map((slot, i) => (i === index ? { ...slot, ...patch } : slot)))

  const removeSlot = (index: number) =>
    update('slots', data.slots.filter((_, i) => i !== index))

  // ── Prüfen und speichern ──────────────────────────────────────────────────

  function validate(): Errors {
    const next: Errors = {}
    if (!data.title.trim()) next.title = 'Titel ist Pflicht'
    if (!data.description.trim()) next.description = 'Beschreibung ist Pflicht'
    if (!data.fuerWen.trim()) next.fuerWen = '„Für wen" ist Pflicht'
    if (!data.trainer.trim()) next.trainer = 'Trainer:in ist Pflicht'

    if (data.slots.length === 0) {
      next.slots = 'Mindestens ein Termin ist nötig'
    } else {
      data.slots.forEach((slot, index) => {
        const start = normalizeTime(slot.startTime)
        const ende = normalizeTime(slot.endTime)
        if (!start || !ende) {
          next[`slot-${index}`] = 'Zeiten bitte als HH:MM angeben'
        } else if (start >= ende) {
          next[`slot-${index}`] = 'Ende muss nach dem Beginn liegen'
        }
      })
    }

    if (data.bookingUrl.trim() && !/^(https?:\/\/|mailto:)/i.test(data.bookingUrl.trim())) {
      next.bookingUrl = 'Muss mit http://, https:// oder mailto: beginnen'
    }

    return next
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
        title: data.title.trim(),
        sub: data.sub.trim() || null,
        description: data.description.trim(),
        // Leere Zeilen verwerfen, sonst stehen auf der Website leere Punkte.
        inhalte: data.inhalte.map((entry) => entry.trim()).filter(Boolean),
        alter: data.alter.trim() || null,
        fuerWen: data.fuerWen.trim(),
        target: data.target,
        trainer: data.trainer.trim(),
        bookingUrl: data.bookingUrl.trim() || null,
        bookingLabel: data.bookingLabel.trim() || null,
        bookingNote: data.bookingNote.trim() || null,
        status: data.status,
        sortOrder: data.sortOrder,
        slots: data.slots.map((slot) => ({
          weekday: slot.weekday,
          startTime: normalizeTime(slot.startTime) ?? slot.startTime,
          endTime: normalizeTime(slot.endTime) ?? slot.endTime,
        })),
      }

      const res = await fetch(
        mode === 'create' ? '/api/admin/courses' : `/api/admin/courses/${data.id}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Speichern fehlgeschlagen')
      }

      router.push('/admin/courses')
      router.refresh()
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Speichern fehlgeschlagen')
    } finally {
      setSaving(false)
    }
  }

  const statusHint = STATUS.find((entry) => entry.value === data.status)?.hint

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      {/* ── Grunddaten ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Kurs
        </h2>

        <div className="space-y-2.5">
          <Label htmlFor="title" hasError={!!errors.title} required>
            Titel
          </Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => update('title', e.target.value)}
            hasError={!!errors.title}
            placeholder="z.B. Kinder Akrobatik"
            inputSize="lg"
          />
          {errors.title ? (
            <p className="text-sm text-red-400">{errors.title}</p>
          ) : (
            <FieldHint>Die Überschrift auf der Kurskarte und im Detail-Fenster.</FieldHint>
          )}
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="sub">Unterzeile</Label>
          <Input
            id="sub"
            value={data.sub}
            onChange={(e) => update('sub', e.target.value)}
            placeholder="z.B. 5 bis 12 Jahre · mit Michael"
            inputSize="lg"
          />
          <FieldHint>
            Steht im Wochenplan klein unter dem Titel. In der Kursübersicht wird
            stattdessen die Altersangabe gezeigt.
          </FieldHint>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="description" hasError={!!errors.description} required>
            Beschreibung
          </Label>
          <MarkdownToolbar
            textareaRef={descriptionRef}
            value={data.description}
            onChange={(next) => update('description', next)}
          />
          <Textarea
            id="description"
            ref={descriptionRef}
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            hasError={!!errors.description}
            rows={6}
            placeholder="Was passiert in der Stunde?"
            className="min-h-[160px]"
          />
          {errors.description ? (
            <p className="text-sm text-red-400">{errors.description}</p>
          ) : (
            <FieldHint>
              Der erste Satz landet als Vorschautext auf der Kurskarte, der ganze Text
              im Detail-Fenster. Es lohnt sich also, mit einem Satz zu beginnen, der
              für sich steht.
            </FieldHint>
          )}
        </div>
      </div>

      {/* ── Termine ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
            Termine
          </h2>
          <p className="text-[11px] leading-relaxed text-white/45 mt-2">
            Alle wöchentlichen Termine dieses Kurses. Ein Kurs, der montags und
            mittwochs läuft, bekommt hier zwei Zeilen und bleibt ein Kurs.
          </p>
        </div>

        <div className="space-y-3">
          {data.slots.map((slot, index) => (
            <div key={index} className="rounded-lg border border-white/[0.12] bg-white/[0.03] p-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1.5 min-w-[9rem]">
                  <Label htmlFor={`slot-day-${index}`}>Tag</Label>
                  <Select
                    value={String(slot.weekday)}
                    onValueChange={(value) => setSlot(index, { weekday: Number(value) })}
                  >
                    <SelectTrigger id={`slot-day-${index}`} className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((weekday) => (
                        <SelectItem key={weekday} value={String(weekday)}>
                          {weekdayName(weekday)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`slot-start-${index}`}>Beginn</Label>
                  <Input
                    id={`slot-start-${index}`}
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => setSlot(index, { startTime: e.target.value })}
                    className="w-32"
                    inputSize="lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor={`slot-end-${index}`}>Ende</Label>
                  <Input
                    id={`slot-end-${index}`}
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => setSlot(index, { endTime: e.target.value })}
                    className="w-32"
                    inputSize="lg"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSlot(index)}
                  // Den letzten Termin nicht wegnehmbar machen: ein Kurs ohne
                  // Termin wuerde von der API ohnehin abgelehnt.
                  disabled={data.slots.length === 1}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-30"
                  aria-label={`Termin ${index + 1} entfernen`}
                >
                  Entfernen
                </Button>
              </div>

              {errors[`slot-${index}`] && (
                <p className="text-sm text-red-400 mt-2">{errors[`slot-${index}`]}</p>
              )}
            </div>
          ))}

          {errors.slots && <p className="text-sm text-red-400">{errors.slots}</p>}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addSlot}
            className="text-[#016dca] hover:text-[#016dca] hover:bg-[#016dca]/10"
          >
            + Termin hinzufügen
          </Button>
        </div>
      </div>

      {/* ── Für wen ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Für wen
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <Label htmlFor="target" required>
              Zielgruppe
            </Label>
            <Select
              value={data.target}
              onValueChange={(value) => update('target', value as CourseFormData['target'])}
            >
              <SelectTrigger id="target">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZIELGRUPPEN.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldHint>Bestimmt die Farbe und den Filter auf der Kursseite.</FieldHint>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="trainer" hasError={!!errors.trainer} required>
              Trainer:in
            </Label>
            <Input
              id="trainer"
              value={data.trainer}
              onChange={(e) => update('trainer', e.target.value)}
              hasError={!!errors.trainer}
              placeholder="z.B. Michael"
              inputSize="lg"
            />
            {errors.trainer && <p className="text-sm text-red-400">{errors.trainer}</p>}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="alter">Altersangabe</Label>
          <Input
            id="alter"
            value={data.alter}
            onChange={(e) => update('alter', e.target.value)}
            placeholder="z.B. Für Kinder von 5 bis 12"
            inputSize="lg"
          />
          <FieldHint>
            Steht ganz oben auf der Kurskarte, in Kursfarbe. Eltern suchen zuerst
            danach. Ohne Angabe steht dort nur die Zielgruppe.
          </FieldHint>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="fuerWen" hasError={!!errors.fuerWen} required>
            Für wen, ausführlich
          </Label>
          <Textarea
            id="fuerWen"
            value={data.fuerWen}
            onChange={(e) => update('fuerWen', e.target.value)}
            hasError={!!errors.fuerWen}
            rows={3}
            placeholder="z.B. Kinder 5 bis 12 Jahre, Einstieg jederzeit möglich"
          />
          {errors.fuerWen ? (
            <p className="text-sm text-red-400">{errors.fuerWen}</p>
          ) : (
            <FieldHint>Steht im Detail-Fenster in der Spalte „Für wen&ldquo;.</FieldHint>
          )}
        </div>
      </div>

      {/* ── Inhalte ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-3">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Inhalte
        </h2>

        {data.inhalte.map((inhalt, index) => (
          <div key={index} className="flex gap-3">
            <Input
              value={inhalt}
              onChange={(e) => setInhalt(index, e.target.value)}
              placeholder="z.B. Trapez-Grundlagen"
              className="flex-1"
              inputSize="lg"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeInhalt(index)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              aria-label={`Inhalt ${index + 1} entfernen`}
            >
              Entfernen
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addInhalt}
          className="text-[#016dca] hover:text-[#016dca] hover:bg-[#016dca]/10"
        >
          + Inhalt hinzufügen
        </Button>

        <FieldHint>
          Stichpunkte für das Detail-Fenster, drei bis sechs reichen. Leere Zeilen
          werden beim Speichern verworfen.
        </FieldHint>
      </div>

      {/* ── Buchung ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
            Buchung
          </h2>
          <p className="text-[11px] leading-relaxed text-white/45 mt-2">
            Leer lassen, wenn der Kurs wie üblich über Eversports gebucht wird. Nur
            ausfüllen, wenn die Buchung woanders läuft, wie bei Aircrobatics.
          </p>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="bookingUrl" hasError={!!errors.bookingUrl}>
            Buchungslink
          </Label>
          <Input
            id="bookingUrl"
            value={data.bookingUrl}
            onChange={(e) => update('bookingUrl', e.target.value)}
            hasError={!!errors.bookingUrl}
            placeholder="https://… oder mailto:…"
            inputSize="lg"
          />
          {errors.bookingUrl && <p className="text-sm text-red-400">{errors.bookingUrl}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <Label htmlFor="bookingLabel">Beschriftung des Knopfs</Label>
            <Input
              id="bookingLabel"
              value={data.bookingLabel}
              onChange={(e) => update('bookingLabel', e.target.value)}
              placeholder="z.B. Bei Aircrobatic Studios buchen"
              inputSize="lg"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="bookingNote">Hinweis über dem Knopf</Label>
            <Input
              id="bookingNote"
              value={data.bookingNote}
              onChange={(e) => update('bookingNote', e.target.value)}
              placeholder="z.B. Läuft nicht über Eversports"
              inputSize="lg"
            />
          </div>
        </div>
      </div>

      {/* ── Sichtbarkeit ── */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-5">
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Sichtbarkeit
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <Label htmlFor="status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(value) => update('status', value as CourseFormData['status'])}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {statusHint && <FieldHint>{statusHint}</FieldHint>}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="sortOrder">Reihenfolge</Label>
            <Input
              id="sortOrder"
              type="number"
              value={String(data.sortOrder)}
              onChange={(e) => update('sortOrder', Number(e.target.value) || 0)}
              inputSize="lg"
            />
            <FieldHint>
              Kleinere Zahl steht weiter vorn in der Kursübersicht. Bei gleicher Zahl
              entscheidet der Titel.
            </FieldHint>
          </div>
        </div>
      </div>

      {/* ── Aktionen ── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Speichern…' : mode === 'create' ? 'Kurs anlegen' : 'Änderungen speichern'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/courses')}
          disabled={saving}
        >
          Abbrechen
        </Button>
        {mode === 'edit' && (
          <p className="text-[11px] text-white/45">
            Änderungen sind sofort nach dem Speichern auf der Website sichtbar.
          </p>
        )}
      </div>
    </form>
  )
}
