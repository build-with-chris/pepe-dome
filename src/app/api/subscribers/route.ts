/**
 * Subscriber signup endpoint
 * POST /api/subscribers
 */

import { NextRequest } from 'next/server'
import { subscriberSignupSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { createSubscriber, validateEmail } from '@/lib/subscribers'
import { prisma } from '@/lib/prisma'
import { sendConfirmationEmail } from '@/lib/email-send'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 signups per hour per IP
    const identifier = getClientIdentifier(request)
    const rateLimit = checkRateLimit(identifier, {
      maxRequests: 5,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateLimit.allowed) {
      const response = errorResponse(
        'RATE_LIMIT_EXCEEDED',
        'Too many signup requests. Please try again later.',
        429
      )
      return addRateLimitHeaders(
        response,
        5,
        rateLimit.remaining,
        rateLimit.resetAt
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = subscriberSignupSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { email, firstName, interests } = validation.data

    // Additional email validation
    if (!validateEmail(email)) {
      return errorResponse('INVALID_EMAIL', 'Invalid email format', 400)
    }

    // Check for existing subscriber
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      // If already active, inform user
      if (existing.status === 'ACTIVE') {
        return errorResponse(
          'ALREADY_SUBSCRIBED',
          'This email is already subscribed to our newsletter.',
          400
        )
      }

      // If pending, resend confirmation (could implement this later)
      if (existing.status === 'PENDING') {
        return errorResponse(
          'CONFIRMATION_PENDING',
          'A confirmation email has already been sent. Please check your inbox.',
          400
        )
      }

      // If unsubscribed, they can re-subscribe by creating a new record
      // For now, just return an error
      if (existing.status === 'UNSUBSCRIBED') {
        return errorResponse(
          'PREVIOUSLY_UNSUBSCRIBED',
          'This email was previously unsubscribed. Please contact support to re-subscribe.',
          400
        )
      }
    }

    // Create subscriber
    const subscriber = await createSubscriber({
      email,
      firstName,
      interests,
    })

    // Send confirmation email via Resend
    try {
      await sendConfirmationEmail(subscriber.id)
      console.log(`Confirmation email sent to ${subscriber.email}`)
    } catch (emailError) {
      // Log error but don't fail the signup
      // User is created, we can retry sending later
      console.error('Failed to send confirmation email:', emailError)
      // In production, you might want to queue this for retry
    }

    // Return success response without exposing the token
    const response = successResponse(
      {
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        status: subscriber.status,
      },
      undefined,
      201
    )

    return addRateLimitHeaders(
      response,
      5,
      rateLimit.remaining,
      rateLimit.resetAt
    )
  } catch (error) {
    console.error('Subscriber signup error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while processing your request.',
      500
    )
  }
}
