'use client'

/**
 * Tageshinweise im Wochenplan.
 *
 * Das sind die Zeilen für Tage ohne Kurse: „Tricking & Breaking in Planung,
 * Termine folgen." Sie stehen bewusst unter der Kursliste und nicht in einem
 * eigenen Menüpunkt: es sind sieben Textfelder, und wer sie ändern will, ist
 * ohnehin gerade beim Kursplan.
 *
 * Leeres Feld heißt: kein Hinweis. Der Tag steht dann ohne Zusatz da.
 */

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { weekdayName } from '@/lib/course-types'

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7]

export default function ScheduleNotesPanel() {
  const [texte, setTexte] = useState<Record<number, string>>({})
  const [geladen, setGeladen] = useState(false)
  const [speichert, setSpeichert] = useState<number | null>(null)
  const [gespeichert, setGespeichert] = useState<number | null>(null)
  const [fehler, setFehler] = useState<string | null>(null)

  useEffect(() => {
    async function laden() {
      try {
        const res = await fetch('/api/admin/schedule-notes')
        if (!res.ok) throw new Error('Hinweise konnten nicht geladen werden')
        const body = await res.json()
        const next: Record<number, string> = {}
        for (const note of body.notes ?? []) next[note.weekday] = note.text
        setTexte(next)
      } catch (error) {
        console.error(error)
      } finally {
        setGeladen(true)
      }
    }
    laden()
  }, [])

  async function speichern(weekday: number) {
    setSpeichert(weekday)
    setFehler(null)
    try {
      const res = await fetch('/api/admin/schedule-notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekday, text: texte[weekday] ?? '' }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Speichern fehlgeschlagen')
      }
      setGespeichert(weekday)
      setTimeout(() => setGespeichert((current) => (current === weekday ? null : current)), 2000)
    } catch (error) {
      setFehler(error instanceof Error ? error.message : 'Speichern fehlgeschlagen')
    } finally {
      setSpeichert(null)
    }
  }

  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-4">
      <div>
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Hinweise im Wochenplan
        </h2>
        <p className="text-[11px] leading-relaxed text-white/45 mt-2">
          Steht im Wochenplan bei Tagen ohne Kurse. Leer lassen heißt: kein Hinweis.
        </p>
      </div>

      {fehler && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {fehler}
        </div>
      )}

      <div className="space-y-2">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="flex flex-wrap items-center gap-3">
            <span className="w-24 shrink-0 text-sm text-white/60">
              {weekdayName(weekday)}
            </span>
            <Input
              value={texte[weekday] ?? ''}
              onChange={(e) => setTexte((prev) => ({ ...prev, [weekday]: e.target.value }))}
              placeholder="z.B. Tricking & Breaking in Planung, Termine folgen."
              className="flex-1 min-w-[16rem]"
              disabled={!geladen}
              aria-label={`Hinweis für ${weekdayName(weekday)}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => speichern(weekday)}
              disabled={!geladen || speichert === weekday}
            >
              {speichert === weekday
                ? 'Speichern…'
                : gespeichert === weekday
                  ? 'Gespeichert'
                  : 'Speichern'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
