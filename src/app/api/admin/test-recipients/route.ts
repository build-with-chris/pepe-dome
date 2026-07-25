/**
 * Admin test recipients management endpoint
 * GET /api/admin/test-recipients - List all test recipients
 * POST /api/admin/test-recipients - Create a new test recipient
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'

const createTestRecipientSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  name: z.string().max(100).optional(),
  isActive: z.boolean().optional().default(true),
})

export async function GET() {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  try {
    const testRecipients = await prisma.testRecipient.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(testRecipients)
  } catch (error) {
    console.error('Test recipients list error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Fehler beim Laden der Test-Empfänger.',
      500
    )
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireApiRole(ROLES.SUPER_ADMIN)
  if (guard.response) return guard.response

  try {
    const body = await request.json()
    const validation = createTestRecipientSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { email, name, isActive } = validation.data

    // Check for existing
    const existing = await prisma.testRecipient.findUnique({
      where: { email },
    })

    if (existing) {
      return errorResponse(
        'ALREADY_EXISTS',
        'Ein Test-Empfänger mit dieser E-Mail existiert bereits.',
        400
      )
    }

    const testRecipient = await prisma.testRecipient.create({
      data: { email, name, isActive },
    })

    return successResponse(testRecipient, undefined, 201)
  } catch (error) {
    console.error('Test recipient create error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Fehler beim Erstellen des Test-Empfängers.',
      500
    )
  }
}
