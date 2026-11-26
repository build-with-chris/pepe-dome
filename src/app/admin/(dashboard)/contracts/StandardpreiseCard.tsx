'use client'

/**
 * Standardwerte pflegen: Mietpreis für halben und ganzen Tag und der übliche
 * Ticketanteil der Gegenseite.
 *
 * Die Werte liegen in der Datenbank. Im Vertragsformular setzen die Preise
 * den regulären Preis mit einem Klick, und ein neuer Vertrag startet mit dem
 * Preis für den halben Tag und dem üblichen Ticketanteil.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import FieldHint from '@/components/admin/ui/FieldHint'
import { betragAlsEingabe, type Standardpreise } from '@/lib/vertraege/validation'

export default function StandardpreiseCard({ initial }: { initial: Standardpreise }) {
  const [halbtag, setHalbtag] = useState(betragAlsEingabe(initial.halbtag))
  const [ganztag, setGanztag] = useState(betragAlsEingabe(initial.ganztag))
  const [ticketanteil, setTicketanteil] = useState(betragAlsEingabe(initial.ticketanteil))
  const [speichert, setSpeichert] = useState(false)
  const [meldung, setMeldung] = useState<{ art: 'ok' | 'fehler'; text: string } | null>(null)

  async function speichern(event: React.FormEvent) {
    event.preventDefault()
    setSpeichert(true)
    setMeldung(null)
    try {
      const res = await fetch('/api/admin/contracts/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ halbtag, ganztag, ticketanteil }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error ?? `Fehler ${res.status}`)
      setHalbtag(betragAlsEingabe(body.standardpreise.halbtag))
      setGanztag(betragAlsEingabe(body.standardpreise.ganztag))
      setTicketanteil(betragAlsEingabe(body.standardpreise.ticketanteil))
      setMeldung({ art: 'ok', text: 'Gespeichert.' })
    } catch (error) {
      setMeldung({
        art: 'fehler',
        text: `Nicht gespeichert: ${error instanceof Error ? error.message : 'unbekannter Fehler'}`,
      })
    } finally {
      setSpeichert(false)
    }
  }

  return (
    <form
      onSubmit={speichern}
      className="bg-[#111113] border border-white/[0.08] rounded-xl p-6 space-y-4"
      noValidate
    >
      <div>
        <h2 className="text-[13px] font-semibold text-white uppercase tracking-wider">
          Standardwerte
        </h2>
        <FieldHint>
          Reguläre Miete: Ein neuer Vertrag startet mit dem Preis für den halben Tag, im Formular
          wechselt ein Klick auf den ganzen Tag. Ticketanteil: So viel bekommen Künstler:innen
          und Veranstalter:innen üblicherweise von den Ticketeinnahmen, der Rest bleibt beim Pepe
          Dome. Bestehende Verträge ändern sich dadurch nicht.
        </FieldHint>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2.5">
          <Label htmlFor="standard-halbtag">Halber Tag</Label>
          <div className="flex items-center gap-2">
            <Input
              id="standard-halbtag"
              inputMode="decimal"
              value={halbtag}
              onChange={(event) => setHalbtag(event.target.value)}
              className="w-32"
            />
            <span className="text-sm text-white/50">€</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="standard-ganztag">Ganzer Tag</Label>
          <div className="flex items-center gap-2">
            <Input
              id="standard-ganztag"
              inputMode="decimal"
              value={ganztag}
              onChange={(event) => setGanztag(event.target.value)}
              className="w-32"
            />
            <span className="text-sm text-white/50">€</span>
          </div>
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="standard-ticketanteil">Ticketanteil Gegenseite</Label>
          <div className="flex items-center gap-2">
            <Input
              id="standard-ticketanteil"
              inputMode="decimal"
              value={ticketanteil}
              onChange={(event) => setTicketanteil(event.target.value)}
              className="w-24"
            />
            <span className="text-sm text-white/50">%</span>
          </div>
        </div>
        <Button type="submit" variant="secondary" size="sm" disabled={speichert}>
          {speichert ? 'Speichern…' : 'Werte speichern'}
        </Button>
        {meldung && (
          <span
            role={meldung.art === 'fehler' ? 'alert' : 'status'}
            className={`text-sm ${meldung.art === 'ok' ? 'text-emerald-300' : 'text-red-300'}`}
          >
            {meldung.text}
          </span>
        )}
      </div>
    </form>
  )
}
