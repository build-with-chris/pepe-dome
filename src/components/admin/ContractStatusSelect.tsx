'use client'

/**
 * Status eines Vertrags umschalten, in der Liste und auf der Vertragsseite.
 *
 * Der Wechsel weg vom Entwurf friert das Dokument ein (siehe PATCH in
 * src/app/api/admin/contracts/[id]/route.ts). Der Weg zurück auf „Entwurf“
 * verwirft diese Fassung, deshalb kommt davor eine Rückfrage.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { STATUS_LABEL, VERTRAGSSTATUS, type Vertragsstatus } from '@/lib/vertraege/validation'

const FARBEN: Record<Vertragsstatus, string> = {
  ENTWURF: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200',
  VERSCHICKT: 'border-blue-500/30 bg-blue-500/10 text-blue-200',
  UNTERSCHRIEBEN: 'border-violet-500/30 bg-violet-500/10 text-violet-200',
  BEZAHLT: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
}

export default function ContractStatusSelect({
  contractId,
  status,
  titel,
  onGeaendert,
}: {
  contractId: string
  status: Vertragsstatus
  /** Für die Rückfrage und für Screenreader. */
  titel: string
  onGeaendert: (status: Vertragsstatus) => void
}) {
  const [speichert, setSpeichert] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)
  const [rueckfrage, setRueckfrage] = useState(false)

  async function setze(neu: Vertragsstatus) {
    setSpeichert(true)
    setFehler(null)
    try {
      const res = await fetch(`/api/admin/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: neu }),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) throw new Error(body?.error ?? 'Status ließ sich nicht ändern')
      onGeaendert(neu)
    } catch (error) {
      setFehler(error instanceof Error ? error.message : 'Status ließ sich nicht ändern')
    } finally {
      setSpeichert(false)
      setRueckfrage(false)
    }
  }

  function waehle(neu: Vertragsstatus) {
    if (neu === status) return
    if (neu === 'ENTWURF') {
      setRueckfrage(true)
      return
    }
    void setze(neu)
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <select
        aria-label={`Status von ${titel}`}
        value={status}
        disabled={speichert}
        onChange={(event) => waehle(event.target.value as Vertragsstatus)}
        className={`h-8 rounded-lg border px-2 text-base sm:text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016dca] disabled:opacity-50 ${FARBEN[status]}`}
      >
        {VERTRAGSSTATUS.map((wert) => (
          <option key={wert} value={wert} className="bg-[#111113] text-white">
            {STATUS_LABEL[wert]}
          </option>
        ))}
      </select>
      {fehler && <p className="max-w-[16rem] text-[11px] text-red-300">{fehler}</p>}

      <Dialog open={rueckfrage} onOpenChange={setRueckfrage}>
        <DialogContent className="bg-[#111113] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Zurück auf Entwurf?</DialogTitle>
            <DialogDescription className="text-white/50">
              {titel} lässt sich dann wieder bearbeiten. Die eingefrorene Fassung wird verworfen.
              Das PDF entsteht danach neu aus dem Formular und der aktuellen Vorlage und kann von
              dem abweichen, was verschickt wurde.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setRueckfrage(false)} disabled={speichert}>
              Abbrechen
            </Button>
            <Button variant="primary" onClick={() => setze('ENTWURF')} disabled={speichert}>
              {speichert ? 'Setze zurück…' : 'Zurück auf Entwurf'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
