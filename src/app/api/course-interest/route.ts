/**
 * Course Interest signup endpoint
 * POST /api/course-interest
 *
 * Speichert Interesse an einem bestimmten Kurs in der Datenbank.
 * Rate-Limit: 5 Anfragen pro Stunde pro IP.
 */

import { NextRequest } from 'next/server'
import { courseInterestSchema } from '@/lib/validation'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  addRateLimitHeaders,
} from '@/lib/api-response'
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

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
        'Zu viele Anfragen. Bitte versuche es später erneut.',
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
    const validation = courseInterestSchema.safeParse(body)

    if (!validation.success) {
      return validationErrorResponse(validation.error)
    }

    const { name, email, phone, courseSlug, courseTitle, gdprConsent } = validation.data

    // Prüfen ob diese Email sich schon für genau diesen Kurs eingetragen hat
    const existing = await prisma.courseInterest.findFirst({
      where: {
        email: email.toLowerCase(),
        courseSlug,
      },
    })

    if (existing) {
      return errorResponse(
        'ALREADY_REGISTERED',
        'Du bist für diesen Kurs bereits vorgemerkt. Wir melden uns sobald es Neues gibt.',
        400
      )
    }

    const interest = await prisma.courseInterest.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        courseSlug,
        courseTitle,
        gdprConsent,
        metadata: {
          ip: identifier,
          userAgent: request.headers.get('user-agent') || 'unknown',
          submittedAt: new Date().toISOString(),
        },
      },
    })

    const response = successResponse(
      {
        id: interest.id,
        courseSlug: interest.courseSlug,
        courseTitle: interest.courseTitle,
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
    console.error('Course interest signup error:', error)
    return errorResponse(
      'INTERNAL_ERROR',
      'Beim Speichern ist ein Fehler aufgetreten. Bitte später erneut versuchen.',
      500
    )
  }
}
