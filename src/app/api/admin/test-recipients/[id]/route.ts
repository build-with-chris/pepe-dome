/**
 * Single test recipient management
 * GET /api/admin/test-recipients/[id] - Get a test recipient
 * PATCH /api/admin/test-recipients/[id] - Update a test recipient
 * DELETE /api/admin/test-recipients/[id] - Delete a test recipient
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'

interface RouteParams {
  params: Promise<{ id: string }>
}

const updateTestRecipientSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse').optional(),
  name: z.string().max(100).nullable().optional(),
  isActive: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const testRecipient = await prisma.testRecipient.findUnique({
      where: { id },
    })

    if (!testRecipient) {
      return errorResponse('NOT_FOUND', 'Test-Empfänger nicht gefunden', 404)
    }

    return successResponse(testRecipient)
  } catch (error) {
    console.error('Test recipient get error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Fehler beim Laden des Test-Empfängers.',
      500
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validation = updateTestRecipientSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Check if exists
    const existing = await prisma.testRecipient.findUnique({
      where: { id },
    })

    if (!existing) {
      return errorResponse('NOT_FOUND', 'Test-Empfänger nicht gefunden', 404)
    }

    // Check for email uniqueness if email is being updated
    if (validation.data.email && validation.data.email !== existing.email) {
      const emailExists = await prisma.testRecipient.findUnique({
        where: { email: validation.data.email },
      })
      if (emailExists) {
        return errorResponse(
          'ALREADY_EXISTS',
          'Ein Test-Empfänger mit dieser E-Mail existiert bereits.',
          400
        )
      }
    }

    const testRecipient = await prisma.testRecipient.update({
      where: { id },
      data: validation.data,
    })

    return successResponse(testRecipient)
  } catch (error) {
    console.error('Test recipient update error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Fehler beim Aktualisieren des Test-Empfängers.',
      500
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Check if exists
    const existing = await prisma.testRecipient.findUnique({
      where: { id },
    })

    if (!existing) {
      return errorResponse('NOT_FOUND', 'Test-Empfänger nicht gefunden', 404)
    }

    await prisma.testRecipient.delete({
      where: { id },
    })

    return successResponse({ message: 'Test-Empfänger gelöscht' })
  } catch (error) {
    console.error('Test recipient delete error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Fehler beim Löschen des Test-Empfängers.',
      500
    )
  }
}
