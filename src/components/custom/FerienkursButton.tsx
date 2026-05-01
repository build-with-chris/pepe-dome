'use client'

/**
 * FerienkursButton
 * Öffnet das CourseDetailModal für den Holi-Poldini-Ferienkurs.
 * Anmeldungen gehen über die bestehende /api/course-interest Route
 * (wegen des Slug-Mappings landet die Mail direkt bei Doro Auer).
 */

import { useState } from 'react'
import CourseDetailModal from './CourseDetailModal'
import { Button } from '@/components/ui/Button'
import type { Kurs } from './CourseScheduleGrid'

const FERIENKURS: Kurs = {
  slug: 'ferienkurs-holi-poldini-pfingsten-2026',
  time: '10:00 – 16:00 Uhr',
  title: 'Holi Poldini — Ferienkurs',
  sub: '26. – 29. Mai 2026 · 4 Tage Zirkusabenteuer · 160€',
  target: 'kinder',
  trainer: 'Leopoldini Coaches',
  day: '26. – 29. Mai 2026',
  description:
    'Ferienspaß mit dem Circus Leopoldini im Pepe Dome München Ostpark: täglich von 10 bis 16 Uhr Zirkuskünste bei erfahrenen Leopoldini Coaches. Vier Tage Akrobatik, Jonglage, Handstand und Zirkus pur in den bayerischen Pfingstferien. Ohne Leistungsdruck, mit viel Spaß und kleinen Erfolgserlebnissen.',
  inhalte: [
    'Jonglage-Grundlagen (Bälle, Tücher, Keulen)',
    'Akrobatik-Basics (Partner- und Bodenakrobatik)',
    'Handstand und Balance',
    'Körperkontrolle & Körperspannung',
    'Spielerisches Warm-up und Cool-down',
  ],
  fuerWen:
    'Kinder & Jugendliche · 4-Tages-Programm · Kostenbeitrag 160€ · Plätze begrenzt, Vergabe nach Anmeldungseingang',
}

export default function FerienkursButton({
  variant = 'secondary',
  size = 'md',
  label = 'Platz vormerken',
}: {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  label?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <CourseDetailModal kurs={open ? FERIENKURS : null} onClose={() => setOpen(false)} />
    </>
  )
}
