/**
 * Newsletter CRUD endpoints
 * GET /api/admin/newsletters - List newsletters
 * POST /api/admin/newsletters - Create newsletter
 */

import { NextRequest } from 'next/server'
import { createNewsletterSchema, newsletterListSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/api-response'
import { createNewsletter, getNewsletters } from '@/lib/newsletters'

export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check (Phase 5)

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams)
    const validation = newsletterListSchema.safeParse(searchParams)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { page, limit, status } = validation.data

    // Fetch newsletters
    const result = await getNewsletters({ page, limit, status })

    return successResponse(result.newsletters, {
      pagination: result.pagination,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Newsletter list error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while fetching newsletters.',
      500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check (Phase 5)

    // Parse and validate request body
    const body = await request.json()
    const validation = createNewsletterSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    // Create newsletter
    const newsletter = await createNewsletter(validation.data)

    return successResponse(newsletter, undefined, 201)
  } catch (error: unknown) {
    console.error('Newsletter creation error:', error)

    // Handle unique constraint violations (duplicate slug)
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return errorResponse(
        'DUPLICATE_SLUG',
        'A newsletter with this title already exists for this month.',
        400
      )
    }

    return errorResponse(
      'INTERNAL_ERROR',
      'An error occurred while creating the newsletter.',
      500
    )
  }
}
