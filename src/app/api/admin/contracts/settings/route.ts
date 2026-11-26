/**
 * Standardpreise des Vertragstools lesen und ändern. Nur für `super_admin`.
 *
 * Die Preise liegen in der Datenbank und nicht im Code, siehe
 * src/lib/vertraege/validation.ts.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import prisma from '@/lib/prisma'
import { ladeStandardpreise } from '@/lib/vertraege/einstellungen'
import { standardpreiseSchema, STANDARDPREISE_SCHLUESSEL } from '@/lib/vertraege/validation'

export async function GET() {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  return NextResponse.json({ standardpreise: await ladeStandardpreise() })
}

export async function PUT(request: NextRequest) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ungültiges JSON' }, { status: 400 })
  }

  const parsed = standardpreiseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validierung fehlgeschlagen', details: parsed.error.issues },
      { status: 400 }
    )
  }

  await prisma.contractSetting.upsert({
    where: { key: STANDARDPREISE_SCHLUESSEL },
    create: { key: STANDARDPREISE_SCHLUESSEL, value: parsed.data },
    update: { value: parsed.data },
  })

  return NextResponse.json({ standardpreise: parsed.data })
}
