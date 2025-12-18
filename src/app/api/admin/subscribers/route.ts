/**
 * Admin subscriber management endpoint
 * GET /api/admin/subscribers - List subscribers with pagination and filtering
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { subscriberListSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'

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
