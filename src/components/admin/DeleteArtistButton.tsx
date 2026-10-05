'use client'

/**
 * Löschen eines Artists mit Rückfrage.
 *
 * Die Rückfrage nennt, an wie vielen Events der Artist hängt. Dort
 * verschwindet die Karte mit dem Löschen, die Events selbst bleiben.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function deleteQuestion(eventCount: number): string {
  if (eventCount === 0) return 'Hängt an keinem Event. Trotzdem löschen?'
  if (eventCount === 1) return 'Hängt an 1 Event. Trotzdem löschen?'
  return `Hängt an ${eventCount} Events. Trotzdem löschen?`
}

export default function DeleteArtistButton({
  artistId,
  artistName,
  eventCount,
}: {
  artistId: string
  artistName: string
  eventCount: number
}) {
  const router = useRouter()
  const [offen, setOffen] = useState(false)
  const [loescht, setLoescht] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  async function loeschen() {
    setLoescht(true)
    setFehler(null)
    try {
      const res = await fetch(`/api/admin/artists/${artistId}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Löschen fehlgeschlagen')
      }
      setOffen(false)
      router.push('/admin/artists')
      router.refresh()
    } catch (error) {
      setFehler(error instanceof Error ? error.message : 'Löschen fehlgeschlagen')
    } finally {
      setLoescht(false)
    }
  }

  return (
    <>
      <Button variant="destructive" size="sm" onClick={() => setOffen(true)}>
        Artist löschen
      </Button>

      <Dialog open={offen} onOpenChange={setOffen}>
        <DialogContent className="bg-[#111113] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">{artistName} löschen</DialogTitle>
            <DialogDescription className="text-white/50">
              {deleteQuestion(eventCount)}
              {eventCount > 0 &&
                ' Auf den Eventseiten verschwindet die Karte, die Events selbst bleiben unverändert.'}
            </DialogDescription>
          </DialogHeader>

          {fehler && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {fehler}
            </div>
          )}

          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setOffen(false)} disabled={loescht}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={loeschen} disabled={loescht}>
              {loescht ? 'Löschen…' : 'Löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
