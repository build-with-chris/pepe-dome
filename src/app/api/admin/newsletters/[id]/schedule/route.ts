/**
 * Newsletter scheduling endpoint
 * POST /api/admin/newsletters/[id]/schedule
 */

import { NextRequest } from 'next/server'
import { scheduleNewsletterSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { getNewsletterWithContent, scheduleNewsletter } from '@/lib/newsletters'
import { NewsletterStatus } from '@prisma/client'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // TODO: Add authentication check (Phase 5)

    const { id } = await params

    // Check if newsletter exists
    const newsletter = await getNewsletterWithContent(id)
    if (!newsletter) {
      return errorResponse('NOT_FOUND', 'Newsletter not found', 404)
    }

    // Only draft newsletters can be scheduled
    if (newsletter.status !== NewsletterStatus.DRAFT) {
      return errorResponse(
        'INVALID_STATUS',
        'Only draft newsletters can be scheduled',
        400
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = scheduleNewsletterSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const scheduledAt = new Date(validation.data.scheduledAt)

    // Schedule newsletter (will validate future date)
    const updated = await scheduleNewsletter(id, scheduledAt)

    // TODO: Create background job for scheduled send (Phase 4)
    console.log('Newsletter scheduled for:', scheduledAt.toISOString())

    return successResponse(updated)
  } catch (error: unknown) {
    console.error('Newsletter schedule error:', error)

    const message = error instanceof Error ? error.message : ''

    if (message.includes('must be in the future')) {
      return errorResponse(
        'INVALID_SCHEDULE_TIME',
        'Scheduled time must be in the future',
        400
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while scheduling the newsletter.',
      500
    )
  }
}
