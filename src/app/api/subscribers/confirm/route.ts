/**
 * Subscriber confirmation endpoint (double opt-in)
 * GET /api/subscribers/confirm?token=xxx
 */

import { NextRequest, NextResponse } from 'next/server'
import { confirmSubscriber } from '@/lib/subscribers'
import { subscriberConfirmSchema } from '@/lib/validation'
import { validationErrorResponse } from '@/lib/api-response'

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
