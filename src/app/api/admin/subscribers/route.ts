/**
 * Admin subscriber management endpoint
 * GET /api/admin/subscribers - List subscribers with pagination and filtering
 * POST /api/admin/subscribers - Create a new subscriber (admin only)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subscriberListSchema, adminCreateSubscriberSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { generateOptInToken } from '@/lib/subscribers'
import { sendConfirmationEmail } from '@/lib/email-send'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check (Phase 5)
    // For now, this endpoint is unprotected

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validation = subscriberListSchema.safeParse(searchParams)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { page, limit, status, interests } = validation.data

    // Build where clause
    const where: Record<string, unknown> = {}
    if (status) {
      where.status = status
    }
    if (interests) {
      const interestList = interests.split(',').map((i) => i.trim())
      where.OR = interestList.map((interest) => ({
        interests: {
          path: '$',
          array_contains: interest,
        },
      }))
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch subscribers and total count
    const [subscribers, total] = await Promise.all([
      prisma.subscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          status: true,
          interests: true,
          confirmedAt: true,
          unsubscribedAt: true,
          createdAt: true,
          lastOpenAt: true,
          lastClickAt: true,
        },
      }),
      prisma.subscriber.count({ where }),
    ])

    return successResponse(subscribers, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Admin subscriber list error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while fetching subscribers.',
      500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = adminCreateSubscriberSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { email, firstName, interests, status, skipConfirmation } = validation.data

    // Check for existing subscriber
    const existing = await prisma.subscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return errorResponse(
        'ALREADY_EXISTS',
        'Ein Subscriber mit dieser E-Mail-Adresse existiert bereits.',
        400
      )
    }

    // Create subscriber data
    const subscriberData: {
      email: string
      firstName?: string
      interests: string[]
      status: 'PENDING' | 'ACTIVE'
      confirmedAt?: Date
      doubleOptInToken?: string
      doubleOptInSentAt?: Date
    } = {
      email,
      firstName: firstName || undefined,
      interests: interests || [],
      status: skipConfirmation ? 'ACTIVE' : 'PENDING',
    }

    if (skipConfirmation && status === 'ACTIVE') {
      subscriberData.confirmedAt = new Date()
    } else {
      subscriberData.doubleOptInToken = generateOptInToken()
      subscriberData.doubleOptInSentAt = new Date()
    }

    const subscriber = await prisma.subscriber.create({
      data: subscriberData,
    })

    if (!skipConfirmation) {
      try {
        await sendConfirmationEmail(subscriber.id)
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError)
      }
    }

    return successResponse(
      {
        id: subscriber.id,
        email: subscriber.email,
        firstName: subscriber.firstName,
        status: subscriber.status,
        interests: subscriber.interests,
        createdAt: subscriber.createdAt,
      },
      undefined,
      201
    )
  } catch (error) {
    console.error('Admin subscriber create error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Ein Fehler ist beim Erstellen des Subscribers aufgetreten.',
      500
    )
  }
}
