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
    const testEmails = testRecipients.map((r: { email: string }) => r.email)

    const result = await sendNewsletter(id, {
      testRecipients: testEmails,
    })

    // If all sends failed, return error with details
    if (result.success === 0 && result.failed > 0) {
      const failureDetails = result.results
        .filter((r) => !r.success)
        .map((r) => ('error' in r ? r.error : 'Unknown error'))
        .join('; ')
      return errorResponse(
        'SEND_FAILED',
        `Test-E-Mail konnte nicht zugestellt werden: ${failureDetails || 'Unbekannter Fehler'}`,
        502
      )
    }

    // If some succeeded and some failed, return success with warning
    if (result.failed > 0) {
      return successResponse({
        sent: result.success,
        failed: result.failed,
        recipients: testEmails,
        message: `${result.success} von ${result.total} Test-E-Mails versendet. ${result.failed} fehlgeschlagen.`,
      })
    }

    return successResponse({
      sent: result.success,
      failed: result.failed,
      recipients: testEmails,
      message: `Test-E-Mail erfolgreich an ${result.success} Empfänger versendet`,
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
