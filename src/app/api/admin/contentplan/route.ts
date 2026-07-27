import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import {
  baselineMedian,
  budgetOverdue,
  bufferStatus,
  scaledCount,
  suggestedThreshold,
  type ReelMetrics,
} from '@/lib/contentplan'

/**
 * Contentplan: Liste aller Reels plus die Zahlen, an denen Entscheidungen
 * hängen.
 *
 * Puffer, Baseline und Schwelle werden hier auf dem Server gerechnet und nicht
 * in der Seite. Sonst zeigten zwei geöffnete Tabs zwei verschiedene Puffer,
 * und die Zahl, die wöchentlich kontrolliert wird, hinge davon ab, wer wann
 * neu geladen hat.
 */

const reelSchema = z.object({
  position: z.number().int().min(1).max(99),
  artist: z.string().min(1, 'Künstlername fehlt'),
  discipline: z.string().min(1, 'Disziplin fehlt'),
  shootDate: z.string().optional().nullable(),
  plannedFor: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

/** Leerer String heißt "nicht gesetzt", nicht "1970". */
function toDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export async function GET() {
  const guard = await requireApiRole(ROLES.VIEWER)
  if (guard.response) return guard.response

  const [reels, config] = await Promise.all([
    prisma.contentReel.findMany({ orderBy: { position: 'asc' } }),
    prisma.contentPlanConfig.findUnique({ where: { id: 1 } }),
  ])

  const metrics = reels as unknown as ReelMetrics[]
  const now = new Date()
  const baseline = baselineMedian(metrics)
  const threshold = config?.threshold ?? null

  // "Überfällig" hängt an der aktuellen Uhrzeit und wird deshalb hier bestimmt
  // und nicht in der Seite. Im Browser wäre es eine Rechnung während des
  // Renderns, die bei jedem erneuten Zeichnen ein anderes Ergebnis haben kann.
  // Über metrics abgebildet und nicht über reels: Der exportierte Prisma-Client
  // ist eine Union aus echtem Client und Mock (siehe src/lib/prisma.ts) und
  // damit für neue Modelle untypisiert. metrics trägt den Typ.
  const withFlags = metrics.map((metric, index) => ({
    ...reels[index],
    overdue: budgetOverdue(metric, threshold, now),
  }))

  return NextResponse.json({
    reels: withFlags,
    config: config ?? { id: 1, baselineMedian: null, threshold: null, fixedAt: null, priorMedian: null },
    stats: {
      buffer: bufferStatus(metrics, now),
      // Der laufend gerechnete Median ist nur ein Vorschlag. Verbindlich ist
      // config.threshold, sobald die Schwelle einmal fixiert wurde.
      baselineMedian: baseline,
      suggestedThreshold: suggestedThreshold(baseline),
      scaled: scaledCount(metrics),
      published: metrics.filter((reel) => reel.status === 'PUBLISHED').length,
    },
  })
}

export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  try {
    const data = reelSchema.parse(await request.json())

    const taken = await prisma.contentReel.findUnique({ where: { position: data.position } })
    if (taken) {
      return NextResponse.json(
        { error: 'Position vergeben', message: `Reel ${data.position} gibt es schon.` },
        { status: 409 }
      )
    }

    const reel = await prisma.contentReel.create({
      data: {
        position: data.position,
        artist: data.artist,
        discipline: data.discipline,
        shootDate: toDate(data.shootDate),
        plannedFor: toDate(data.plannedFor),
        notes: data.notes || null,
      },
    })

    return NextResponse.json(reel, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error creating reel:', error)
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 })
  }
}
