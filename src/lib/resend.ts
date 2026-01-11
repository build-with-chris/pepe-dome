/**
 * Resend Email Client Configuration
 *
 * Handles email sending via Resend API with proper error handling
 * and rate limiting support.
 */

import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

/**
 * Resend client instance
 *
 * @example
 * import { resend } from '@/lib/resend'
 * await resend.emails.send({ ... })
 */
export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Default sender email address
 * Resend requires verified domain or test email
 */
export const DEFAULT_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'PEPE Dome <newsletter@pepe-dome.de>'

/**
 * Email configuration constants
 */
export const EMAIL_CONFIG = {
  /** Maximum recipients per batch send */
  MAX_BATCH_SIZE: 50,

  /** Delay between individual emails (ms) to respect Resend rate limit of 2/sec */
  EMAIL_DELAY_MS: 550,

  /** Delay between batches (ms) to avoid rate limits */
  BATCH_DELAY_MS: 1000,

  /** Maximum retries for failed sends */
  MAX_RETRIES: 3,

  /** Base URL for email links */
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
}

/**
 * Generate URLs for email links
 */
export function generateEmailUrls(subscriberId: string, token?: string) {
  const base = EMAIL_CONFIG.BASE_URL

  return {
    confirm: `${base}/newsletter/confirm?token=${token || 'MISSING_TOKEN'}`,
    unsubscribe: `${base}/newsletter/unsubscribe/${subscriberId}`,
    webView: (newsletterId: string) => `${base}/newsletter/${newsletterId}`,
    privacy: `${base}/privacy`,
    home: base,
  }
}

/**
 * Batch send emails with rate limiting
 * Sends emails sequentially with delay to respect Resend's rate limit (2/sec on free tier)
 *
 * @param emails Array of email send requests
 * @param batchSize Number of emails to send per batch (default: 50) - batch pause happens after this many
 * @returns Array of send results
 */
export async function batchSendEmails<T>(
  emails: Array<T>,
  sendFn: (email: T) => Promise<any>,
  batchSize: number = EMAIL_CONFIG.MAX_BATCH_SIZE
): Promise<Array<{ success: boolean; email: T; error?: string; id?: string }>> {
  const results: Array<{ success: boolean; email: T; error?: string; id?: string }> = []

  for (let i = 0; i < emails.length; i++) {
    const email = emails[i]

    try {
      const result = await sendFn(email)
      // Check if Resend returned an error in the response
      if (result.error) {
        console.error(`[EMAIL] API error for email ${i + 1}:`, result.error)
        results.push({
          success: false,
          email,
          error: result.error.message || 'API error',
        })
      } else {
        results.push({
          success: true,
          email,
          id: result.data?.id || result.id,
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[EMAIL] Exception for email ${i + 1}:`, errorMessage)
      results.push({
        success: false,
        email,
        error: errorMessage,
      })
    }

    // Delay between each email to respect rate limit (550ms = ~1.8/sec, safely under 2/sec)
    if (i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, EMAIL_CONFIG.EMAIL_DELAY_MS))
    }

    // Additional pause after each batch
    if ((i + 1) % batchSize === 0 && i < emails.length - 1) {
      await new Promise(resolve => setTimeout(resolve, EMAIL_CONFIG.BATCH_DELAY_MS))
    }
  }

  return results
}
