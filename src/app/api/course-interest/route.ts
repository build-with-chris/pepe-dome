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
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend'

/**
 * Mapping: Kurs-Slug → externe Empfänger-Adresse(n).
 * Anmeldungen für gemappte Kurse werden zusätzlich zur DB direkt
 * an die hinterlegte Person geforwardet (z. B. Trainer:in / Coach).
 *
 * Reply-To zeigt auf die Mail-Adresse des Anmeldenden, damit
 * der Coach direkt antworten kann.
 */
const COURSE_FORWARD_RECIPIENTS: Record<string, string[]> = {
  'circus-dome-lab-mo':                       ['doroauer23@gmail.com'], // Doro · Leopoldini
  'ferienkurs-holi-poldini-pfingsten-2026':   ['doroauer23@gmail.com'], // Doro · Leopoldini Ferienkurs
}

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

    // ── Forward an externe Empfänger:innen (z. B. Trainer:in / Coach) ──
    // Fail-safe: Fehler hier brechen die Anmeldung nicht ab — die Daten
    // sind schon in der DB.
    const forwardTo = COURSE_FORWARD_RECIPIENTS[courseSlug]
    if (forwardTo && forwardTo.length > 0) {
      const cleanName = name.trim()
      const cleanEmail = email.trim().toLowerCase()
      const cleanPhone = phone?.trim() || null

      const subject = `Neue Kursanmeldung · ${courseTitle}`
      const text = [
        `Neue Anmeldung für deinen Kurs "${courseTitle}"`,
        ``,
        `Name:     ${cleanName}`,
        `E-Mail:   ${cleanEmail}`,
        `Telefon:  ${cleanPhone ?? '—'}`,
        `Kurs:     ${courseTitle} (${courseSlug})`,
        `Zeit:     ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}`,
        ``,
        `Du kannst direkt auf diese Mail antworten — die Antwort geht`,
        `automatisch an ${cleanEmail}.`,
        ``,
        `— Pepe Dome`,
      ].join('\n')

      const html = `
<div style="font-family:system-ui,-apple-system,sans-serif;max-width:560px;margin:0 auto;color:#111;line-height:1.5">
  <h2 style="margin:0 0 16px;color:#016dca">Neue Kursanmeldung</h2>
  <p style="margin:0 0 24px">für <strong>${escapeHtml(courseTitle)}</strong></p>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
    <tr><td style="padding:8px 0;color:#666;width:120px">Name</td><td style="padding:8px 0"><strong>${escapeHtml(cleanName)}</strong></td></tr>
    <tr><td style="padding:8px 0;color:#666">E-Mail</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></td></tr>
    <tr><td style="padding:8px 0;color:#666">Telefon</td><td style="padding:8px 0">${cleanPhone ? escapeHtml(cleanPhone) : '<em style="color:#999">—</em>'}</td></tr>
    <tr><td style="padding:8px 0;color:#666">Kurs-Slug</td><td style="padding:8px 0;font-family:ui-monospace,monospace;color:#666">${escapeHtml(courseSlug)}</td></tr>
  </table>
  <p style="margin:0;color:#666;font-size:13px">
    Du kannst direkt auf diese Mail antworten — die Antwort geht automatisch an ${escapeHtml(cleanEmail)}.
  </p>
  <p style="margin:24px 0 0;color:#999;font-size:12px">— Pepe Dome</p>
</div>`.trim()

      try {
        await resend.emails.send({
          from: DEFAULT_FROM_EMAIL,
          to: forwardTo,
          replyTo: cleanEmail,
          subject,
          text,
          html,
        })
      } catch (mailError) {
        // Nicht abbrechen — Anmeldung ist in der DB, wir loggen nur.
        console.error('[course-interest] Forward-Mail fehlgeschlagen:', mailError)
      }
    }

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

/** Minimaler HTML-Escape für Mail-Templates */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
