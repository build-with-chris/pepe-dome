/**
 * Subscriber confirmation endpoint (double opt-in)
 * GET /api/subscribers/confirm?token=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscriber } from '@/lib/subscribers'
import { subscriberConfirmSchema } from '@/lib/validation'
import { validationErrorResponse } from '@/lib/api-response'
import { getClientIdentifier } from '@/lib/rate-limit'
import { reportConfirmedSignup } from '@/lib/tracking-server'

export async function GET(request: NextRequest) {
  try {
    // Get token from query params
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    // Validate token parameter
    const validation = subscriberConfirmSchema.safeParse({ token })
    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Confirm subscriber
    const subscriber = await confirmSubscriber(validation.data.token)

    console.log('Subscriber confirmed:', subscriber.email)

    /**
     * Die bestätigte Anmeldung ist die Zahl, die zählt, und sie wird von hier
     * gemeldet statt aus dem Browser: der Bestätigungslink wird meist in der
     * Mail-App geöffnet, wo die Einwilligung aus dem localStorage der Website
     * nicht vorliegt.
     *
     * Als Quelle nur der Ursprung, niemals die aufgerufene URL. Die trägt das
     * Bestätigungstoken, und das hat bei Meta nichts zu suchen.
     */
    const clientIp = getClientIdentifier(request)
    await reportConfirmedSignup(subscriber, {
      sourceUrl: new URL(request.url).origin,
      userAgent: request.headers.get('user-agent'),
      clientIp: clientIp !== 'unknown-client' ? clientIp : null,
    })

    return NextResponse.json({
      success: true,
      email: subscriber.email,
    })
  } catch (error: unknown) {
    console.error('Confirmation error:', error)

    return NextResponse.json(
      {
        success: false,
        error: { message: error instanceof Error ? error.message : 'Invalid or expired confirmation link' },
      },
      { status: 400 }
    )
  }
}
