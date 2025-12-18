/**
 * Subscriber confirmation endpoint (double opt-in)
 * GET /api/subscribers/confirm?token=xxx
 */

import { NextRequest } from 'next/server'
import { confirmSubscriber } from '@/lib/subscribers'
import { subscriberConfirmSchema } from '@/lib/validation'
import { errorResponse, validationErrorResponse } from '@/lib/api-response'

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

    // TODO: Send welcome email (Phase 4)
    console.log('Subscriber confirmed:', subscriber.email)

    // Redirect to confirmation success page
    const redirectUrl = new URL(
      '/newsletter/confirm',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'true')
    redirectUrl.searchParams.set('email', subscriber.email)

    return Response.redirect(redirectUrl.toString(), 302)
  } catch (error: any) {
    console.error('Confirmation error:', error)

    // Redirect to error page
    const redirectUrl = new URL(
      '/newsletter/confirm',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'false')
    redirectUrl.searchParams.set(
      'error',
      error.message || 'Invalid or expired confirmation link'
    )

    return Response.redirect(redirectUrl.toString(), 302)
  }
}
