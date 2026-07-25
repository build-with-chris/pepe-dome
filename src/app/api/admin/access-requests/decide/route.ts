import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES, isAssignableRole } from '@/lib/roles'
import { decideAccessRequest } from '@/lib/admin-access'

/**
 * POST /api/admin/access-requests/decide
 *
 * Vergibt eine Rolle oder lehnt eine Zugriffsanfrage ab.
 *
 * Nur POST, kein GET: Ein GET-Endpunkt, der Rechte vergibt, würde von
 * Mailprogrammen und Link-Scannern beim Öffnen der Freigabe-Mail von selbst
 * ausgelöst.
 *
 * Zwei unabhängige Prüfungen: Super-Admin-Session und gültiges Einmal-Token.
 * Keine der beiden allein reicht.
 */

const decisionSchema = z
  .object({
    token: z.string().min(1),
    decision: z.enum(['approve', 'reject']),
    role: z.string().optional(),
  })
  .refine((data) => data.decision === 'reject' || isAssignableRole(data.role), {
    message: 'Bei einer Freigabe muss eine gültige Rolle angegeben werden.',
    path: ['role'],
  })

export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Bad Request', message: 'Ungültiger Request-Body.' }, { status: 400 })
  }

  const parsed = decisionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Bad Request', message: parsed.error.issues[0]?.message || 'Ungültige Angaben.' },
      { status: 400 }
    )
  }

  const { token, decision, role } = parsed.data

  try {
    const result = await decideAccessRequest({
      token,
      decision,
      role: isAssignableRole(role) ? role : undefined,
      decidedBy: guard.userId,
    })

    if (!result.ok) {
      return NextResponse.json({ error: 'Conflict', message: result.error }, { status: 409 })
    }

    console.log(
      `[ADMIN-ACCESS] ${guard.userId} hat ${result.email} ${
        decision === 'approve' ? `als ${role} freigegeben` : 'abgelehnt'
      }`
    )

    return NextResponse.json({ success: true, email: result.email })
  } catch (error) {
    console.error('[ADMIN-ACCESS] Entscheidung fehlgeschlagen:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Die Entscheidung konnte nicht gespeichert werden.' },
      { status: 500 }
    )
  }
}
