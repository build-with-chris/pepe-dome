'use client'

/**
 * Endgültiges Löschen eines Kurses.
 *
 * Steht nur super_admin zur Verfügung und nur auf der Bearbeitungsseite, nicht
 * in der Liste. Ein Kurs trägt seine Beschreibung mit sich, und die war
 * Schreibarbeit. Der übliche Weg ist deshalb „Pausiert", darauf weist der Text
 * daneben hin.
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

export default function DeleteCourseButton({
  courseId,
  courseTitle,
}: {
  courseId: string
  courseTitle: string
}) {
  const router = useRouter()
  const [offen, setOffen] = useState(false)
  const [loescht, setLoescht] = useState(false)
  const [fehler, setFehler] = useState<string | null>(null)

  async function loeschen() {
    setLoescht(true)
    setFehler(null)
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.error ?? 'Löschen fehlgeschlagen')
      }
      setOffen(false)
      router.push('/admin/courses')
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
        Kurs endgültig löschen
      </Button>

      <Dialog open={offen} onOpenChange={setOffen}>
        <DialogContent className="bg-[#111113] border-white/[0.08]">
          <DialogHeader>
            <DialogTitle className="text-white">Kurs löschen</DialogTitle>
            <DialogDescription className="text-white/50">
              „{courseTitle}&ldquo; wird mit allen Texten und Terminen entfernt. Das lässt
              sich nicht rückgängig machen.
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
              {loescht ? 'Löschen…' : 'Endgültig löschen'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
