/**
 * GET /api/events/next-available
 *
 * Liefert den Monat, mit dem die Terminliste aufgeht. Die Seite /events
 * bestimmt ihn inzwischen selbst beim Rendern; diese Route ist die
 * Rückfallebene für den Fall, dass das dort scheitert.
 */

import { NextResponse } from 'next/server'
import { resolveListingMonth } from '@/lib/events-listing'

export async function GET() {
  try {
    return NextResponse.json(await resolveListingMonth())
  } catch {
    // Ohne Datenbank lieber der aktuelle Monat als ein Fehler: die Liste kann
    // damit weiterarbeiten und zeigt notfalls einen leeren Monat.
    const now = new Date()
    return NextResponse.json({ year: now.getFullYear(), month: now.getMonth() + 1 })
  }
}
