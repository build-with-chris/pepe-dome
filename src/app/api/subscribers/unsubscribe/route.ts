/**
 * Subscriber unsubscribe endpoint
 * POST /api/subscribers/unsubscribe
 */

import { NextRequest } from 'next/server'
import { unsubscribeSubscriber } from '@/lib/subscribers'
import { subscriberUnsubscribeSchema } from '@/lib/validation'
import { errorResponse, validationErrorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const validation = subscriberUnsubscribeSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { email, id } = validation.data

    // Unsubscribe by email or ID
    const subscriber = await unsubscribeSubscriber(email || id!)

    console.log('Subscriber unsubscribed:', subscriber.email)

    // Redirect to unsubscribed confirmation page
    const redirectUrl = new URL(
      '/newsletter/unsubscribed',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'true')

    return Response.redirect(redirectUrl.toString(), 302)
  } catch (error: unknown) {
    console.error('Unsubscribe error:', error)

    // Redirect to error page
    const redirectUrl = new URL(
      '/newsletter/unsubscribed',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'false')
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error ? error.message : 'Failed to unsubscribe'
    )

    return Response.redirect(redirectUrl.toString(), 302)
  }
}

// Also support GET for one-click unsubscribe links
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const id = searchParams.get('id')

    const validation = subscriberUnsubscribeSchema.safeParse({ email, id })

    if (!validation.success) {
      throw new Error('Invalid unsubscribe parameters')
    }

    const subscriber = await unsubscribeSubscriber(email || id!)

    console.log('Subscriber unsubscribed:', subscriber.email)

    // Redirect to unsubscribed confirmation page
    const redirectUrl = new URL(
      '/newsletter/unsubscribed',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'true')

    return Response.redirect(redirectUrl.toString(), 302)
  } catch (error: unknown) {
    console.error('Unsubscribe error:', error)

    // Redirect to error page
    const redirectUrl = new URL(
      '/newsletter/unsubscribed',
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    )
    redirectUrl.searchParams.set('success', 'false')
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error ? error.message : 'Failed to unsubscribe'
    )

    return Response.redirect(redirectUrl.toString(), 302)
  }
}
