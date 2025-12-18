/**
 * Newsletter test send endpoint
 * POST /api/admin/newsletters/[id]/test-send
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { prisma } from '@/lib/prisma'

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

    // Fetch test recipients
    const testRecipients = await prisma.testRecipient.findMany()

    if (testRecipients.length === 0) {
      return errorResponse(
        'NO_TEST_RECIPIENTS',
        'No test recipients configured. Please add test recipients first.',
        400
      )
    }

    // TODO: Render email template and send via Resend (Phase 3 & 4)
    // For now, just log what would be sent
    console.log('Test send for newsletter:', newsletter.slug)
    console.log('Test recipients:', testRecipients.map((r) => r.email))
    console.log('Newsletter subject:', newsletter.subject)

    // Simulate sending
    const results = testRecipients.map((recipient) => ({
      email: recipient.email,
      status: 'sent',
      // In Phase 4, this will contain the actual Resend response
    }))

    return successResponse({
      sent: results.length,
      recipients: results,
      message: `Test email sent to ${results.length} recipient(s)`,
    })
  } catch (error) {
    console.error('Test send error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while sending test email.',
      500
    )
  }
}
