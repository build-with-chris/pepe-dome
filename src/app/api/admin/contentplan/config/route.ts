import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { z } from 'zod'

/**
 * Die Schwelle fixieren.
 *
 * Bewusst ein eigener Schreibvorgang und keine Zahl, die aus dem Median
 * abgeleitet wird, sobald genug Reels da sind. Die Schwelle ist eine
 * Entscheidung mit Datum: ab hier fließt Geld. Automatisch mitwandernd wäre
 * sie im Oktober eine andere als im September, und die Frage "warum bekam
 * Reel 6 Budget und Reel 9 nicht" ließe sich nicht mehr beantworten.
 */

const configSchema = z.object({
  baselineMedian: z.number().int().min(0).nullable().optional(),
  threshold: z.number().int().min(0).nullable().optional(),
  priorMedian: z.number().int().min(0).nullable().optional(),
})

export async function PATCH(request: NextRequest) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  try {
    const data = configSchema.parse(await request.json())

    const current = await prisma.contentPlanConfig.findUnique({ where: { id: 1 } })

    const update: Record<string, unknown> = {}
    if (data.baselineMedian !== undefined) update.baselineMedian = data.baselineMedian
    if (data.priorMedian !== undefined) update.priorMedian = data.priorMedian

    if (data.threshold !== undefined) {
      update.threshold = data.threshold
      // Das Datum der Fixierung. Wird die Schwelle wieder geleert, verschwindet
      // auch das Datum, sonst stünde dort ein Stichtag ohne Schwelle.
      update.fixedAt = data.threshold === null ? null : (current?.fixedAt ?? new Date())
    }

    const config = await prisma.contentPlanConfig.upsert({
      where: { id: 1 },
      create: { id: 1, ...update },
      update,
    })

    return NextResponse.json(config)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.issues }, { status: 400 })
    }
    console.error('Error updating content plan config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}
