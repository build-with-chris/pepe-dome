/**
 * Newsletter test send endpoint
 * POST /api/admin/newsletters/[id]/test-send
 */

import { NextRequest } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getNewsletterWithContent } from '@/lib/newsletters'
import { sendNewsletter } from '@/lib/email-send'
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

    // Fetch active test recipients from database
    const testRecipients = await prisma.testRecipient.findMany({
      where: { isActive: true },
    })

    if (testRecipients.length === 0) {
      return errorResponse(
        'NO_TEST_RECIPIENTS',
        'Keine aktiven Test-Empfänger vorhanden. Bitte zuerst unter Test-Empfänger hinzufügen.',
        400
      )
    }

    // Send newsletter to test recipients only (not to all subscribers)
    const testEmails = testRecipients.map((r) => r.email)

    const result = await sendNewsletter(id, {
      testRecipients: testEmails,
    })

    return successResponse({
      sent: result.success,
      failed: result.failed,
      recipients: testEmails,
      message: `Test email sent to ${result.success} recipient(s)`,
    })
  } catch (error) {
    console.error('Test send error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return errorResponse(
      'INTERNAL_ERROR',
      `An error occurred while sending test email: ${message}`,
      500
    )
  }
}
