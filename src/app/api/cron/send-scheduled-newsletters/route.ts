/**
 * Cron Job: Send Scheduled Newsletters
 *
 * Checks for newsletters scheduled to be sent and sends them.
 * Can be triggered by:
 * - Vercel Cron Jobs (recommended for production)
 * - External cron service (cron-job.org, etc.)
 * - Manual trigger from admin UI
 *
 * Usage:
 * - Add to vercel.json:
 *   {
 *     "crons": [{
 *       "path": "/api/cron/send-scheduled-newsletters",
 *       "schedule": "0 * * * *"  // Every hour
 *     }]
 *   }
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendNewsletter } from '@/lib/email-send'
import { Prisma } from '@prisma/client'

/**
 * Authorization for cron jobs
 * Vercel Cron Jobs include special headers for verification
 */
function isAuthorized(request: NextRequest): boolean {
  // Vercel Cron Jobs send authorization header
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // If running on Vercel with cron, check the special header
  const isVercelCron = request.headers.get('x-vercel-cron') === 'true'
  if (isVercelCron) {
    return true
  }

  // Otherwise, check secret token
  if (!cronSecret) {
    console.warn('CRON_SECRET not configured - allowing request (dev mode)')
    return true
  }

  if (!authHeader) {
    return false
  }

  // Expect: "Bearer <secret>"
  const token = authHeader.replace('Bearer ', '')
  return token === cronSecret
}

/**
 * GET /api/cron/send-scheduled-newsletters
 *
 * Send all newsletters scheduled for now or earlier
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()
    console.log(`[Cron] Checking for scheduled newsletters at ${now.toISOString()}`)

    // Find newsletters scheduled for now or earlier
    const scheduledNewsletters = await prisma.newsletter.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now,
        },
      },
      orderBy: {
        scheduledAt: 'asc',
      },
    })

    if (scheduledNewsletters.length === 0) {
      console.log('[Cron] No newsletters to send')
      return NextResponse.json({
        success: true,
        message: 'No newsletters scheduled',
        sent: 0,
      })
    }

    console.log(`[Cron] Found ${scheduledNewsletters.length} newsletters to send`)

    const results = []

    // Send each newsletter
    for (const newsletter of scheduledNewsletters) {
      try {
        console.log(`[Cron] Sending newsletter: ${newsletter.slug}`)

        const sendResult = await sendNewsletter(newsletter.id)

        results.push({
          newsletterId: newsletter.id,
          slug: newsletter.slug,
          ...sendResult,
          success: true,
        })

        console.log(`[Cron] Newsletter ${newsletter.slug} sent successfully:`, sendResult)
      } catch (error) {
        console.error(`[Cron] Failed to send newsletter ${newsletter.slug}:`, error)

        // Mark as failed
        const errorMetadata: Prisma.JsonObject = {
          lastSendError: error instanceof Error ? error.message : 'Unknown error',
          lastSendAttempt: new Date().toISOString(),
        }

        await prisma.newsletter.update({
          where: { id: newsletter.id },
          data: {
            status: 'DRAFT', // Reset to draft so admin can retry
            metadata: errorMetadata,
          },
        })

        results.push({
          newsletterId: newsletter.id,
          slug: newsletter.slug,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.filter(r => !r.success).length

    return NextResponse.json({
      success: true,
      message: `Processed ${scheduledNewsletters.length} newsletters`,
      sent: successCount,
      failed: failureCount,
      results,
    })
  } catch (error) {
    console.error('[Cron] Error processing scheduled newsletters:', error)
    return NextResponse.json(
      {
        error: 'Failed to process scheduled newsletters',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/send-scheduled-newsletters
 *
 * Manual trigger (same as GET but allows POST from admin UI)
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
