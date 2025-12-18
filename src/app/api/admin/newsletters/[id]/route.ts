/**
 * Single newsletter endpoints
 * GET /api/admin/newsletters/[id] - Get single newsletter
 * PUT /api/admin/newsletters/[id] - Update newsletter
 * DELETE /api/admin/newsletters/[id] - Delete newsletter
 */

import { NextRequest } from 'next/server'
import { updateNewsletterSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import {
  getNewsletterWithContent,
  updateNewsletter,
  deleteNewsletter,
} from '@/lib/newsletters'
import { NewsletterStatus } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id } = await params
    const newsletter = await getNewsletterWithContent(id)

    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    return successResponse(newsletter)
  } catch (error) {
    console.error('Newsletter fetch error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while fetching the newsletter.',
      500
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id } = await params

    // Check if newsletter exists and is editable
    const existing = await getNewsletterWithContent(id)
    if (!existing) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    // Prevent editing sent newsletters
    if (existing.status === NewsletterStatus.SENT) {
      return errorResponse(
        'CANNOT_EDIT_SENT',
        'Cannot edit a newsletter that has already been sent',
        403
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = updateNewsletterSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Update newsletter
    const updated = await updateNewsletter(id, validation.data)

    return successResponse(updated)
  } catch (error) {
    console.error('Newsletter update error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while updating the newsletter.',
      500
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id } = await params

    // Delete newsletter (will throw if not draft)
    await deleteNewsletter(id)

    return new Response(null, { status: 204 })
  } catch (error: unknown) {
    console.error('Newsletter delete error:', error)

    const message = error instanceof Error ? error.message : ''

    if (message.includes('not found')) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    if (message.includes('Can only delete draft')) {
      return errorResponse(
        'CANNOT_DELETE',
        'Can only delete draft newsletters',
        403
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while deleting the newsletter.',
      500
    )
  }
}
