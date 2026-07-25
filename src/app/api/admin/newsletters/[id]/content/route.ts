/**
 * Newsletter Content Management
 * POST /api/admin/newsletters/[id]/content - Add content
 * PUT /api/admin/newsletters/[id]/content - Reorder content
 */

import { NextRequest } from 'next/server'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { addNewsletterContent, replaceNewsletterContent } from '@/lib/newsletters'
import { addContentSchema, reorderContentSchema } from '@/lib/validation'
import { requireApiRole } from '@/lib/roles.server'
import { ROLES } from '@/lib/roles'
import { guardNewsletterMutation } from '@/lib/newsletter-guard'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  try {
    const { id: newsletterId } = await params

    // Terminierte und laufende Ausgaben sind fuer Editoren gesperrt: Sonst
    // koennte ein Editor den Text einer geplanten Ausgabe umschreiben und den
    // Cron damit den neuen Inhalt an alle Abonnenten schicken lassen.
    const locked = await guardNewsletterMutation(newsletterId, guard.role)
    if (locked) return locked
    const body = await request.json()

    // Validate request body
    const validation = addContentSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Add content to newsletter
    const content = await addNewsletterContent(newsletterId, validation.data)

    return successResponse(content, undefined, 201)
  } catch (error: unknown) {
    console.error('Add content error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while adding content.',
      500
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const guard = await requireApiRole(ROLES.EDITOR)
  if (guard.response) return guard.response

  try {
    const { id: newsletterId } = await params

    // Terminierte und laufende Ausgaben sind fuer Editoren gesperrt: Sonst
    // koennte ein Editor den Text einer geplanten Ausgabe umschreiben und den
    // Cron damit den neuen Inhalt an alle Abonnenten schicken lassen.
    const locked = await guardNewsletterMutation(newsletterId, guard.role)
    if (locked) return locked
    const body = await request.json()

    // Validate request body
    const validation = reorderContentSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Replace all content (handles both new items and reordering)
    await replaceNewsletterContent(newsletterId, validation.data.content)

    return successResponse({ message: 'Content updated successfully' })
  } catch (error: unknown) {
    console.error('Update content error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while updating content.',
      500
    )
  }
}
