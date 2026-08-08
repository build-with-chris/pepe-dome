/**
 * Validation schemas using Zod
 */

import { z } from 'zod'

/**
 * E-Mail-Adresse vereinheitlichen: Leerraum weg, klein geschrieben.
 *
 * Die Unique-Bedingung auf subscribers.email ist in PostgreSQL
 * gross-klein-empfindlich. Ohne Normalisierung sind `Chris@example.de` und
 * `chris@example.de` zwei getrennte Zeilen mit denselben Folgen für dieselbe
 * Person: Sie bekommt jeden Newsletter doppelt, und eine Abmeldung wirkt nur
 * für die Schreibweise, mit der sie sich damals eingetragen hat.
 *
 * Der lokale Teil einer Adresse ist laut Norm zwar unterscheidungsfähig, aber
 * kein Anbieter von Rang nutzt das noch. Kleinschreibung ist der Umgang, den
 * Nutzer erwarten.
 */
const normalizedEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.string().email('Invalid email format'))

// Subscriber validation schemas
export const subscriberSignupSchema = z.object({
  email: normalizedEmail,
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
  /**
   * Lag beim Anmelden eine Marketing-Einwilligung vor?
   *
   * Sie steckt im localStorage des Browsers und ist beim späteren Klick auf den
   * Bestätigungslink nicht mehr erreichbar, deshalb reist sie hier mit und wird
   * am Abonnenten vermerkt.
   */
  trackingConsent: z.boolean().optional(),
  /** Herkunft der Anmeldung, etwa "startseite". Nur zur Auswertung. */
  source: z.string().max(60).optional(),
})

// Course interest validation schema
export const courseInterestSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen enthalten').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z
    .string()
    .max(30)
    .regex(/^[0-9+\s\-()/]*$/, 'Nur Ziffern und + - ( ) / erlaubt')
    .optional()
    .or(z.literal('')),
  courseSlug: z.string().min(1).max(100),
  courseTitle: z.string().min(1).max(200),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'DSGVO-Einwilligung ist erforderlich',
  }),
})

// Contact request validation schema (Kontaktformular)
export const contactRequestSchema = z
  .object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen enthalten').max(100),
    message: z.string().min(10, 'Bitte beschreibe dein Anliegen (mind. 10 Zeichen)').max(5000),
    channel: z.enum(['callback', 'whatsapp', 'email']),
    phone: z
      .string()
      .max(30)
      .regex(/^[0-9+\s\-()/]*$/, 'Nur Ziffern und + - ( ) / erlaubt')
      .optional()
      .or(z.literal('')),
    email: z.string().email('Ungültige E-Mail-Adresse').max(200).optional().or(z.literal('')),
    reachability: z.string().max(200).optional().or(z.literal('')),
    gdprConsent: z.boolean().refine((val) => val === true, {
      message: 'DSGVO-Einwilligung ist erforderlich',
    }),
  })
  .superRefine((data, ctx) => {
    if ((data.channel === 'callback' || data.channel === 'whatsapp') && !data.phone?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['phone'],
        message: 'Telefonnummer ist für Rückruf/WhatsApp erforderlich',
      })
    }
    if (data.channel === 'email' && !data.email?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'E-Mail-Adresse ist erforderlich',
      })
    }
  })

export const subscriberConfirmSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

/**
 * Abmeldung — ausschliesslich über das Token aus der Mail.
 *
 * Vorher standen hier `email` und `id` als Alternativen. Beides ist kein
 * Geheimnis: Mit einer fremden Adresse liess sich jede Person aus dem
 * Verteiler austragen. Wer abmelden will, muss die Mail in der Hand haben.
 */
export const subscriberUnsubscribeSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

// Helper for URL or path validation (allows /path or https://...)
const urlOrPathSchema = z.string().refine(
  (val) => val === '' || val.startsWith('/') || val.startsWith('http://') || val.startsWith('https://'),
  { message: 'Must be a valid URL or path starting with /' }
).optional().or(z.literal(''))

// Newsletter validation schemas
export const createNewsletterSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  preheader: z.string().max(200).optional(),
  introText: z.string().max(2000).optional(),
  heroImageUrl: urlOrPathSchema,
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(200).optional(),
  heroCTALabel: z.string().max(50).optional(),
  heroCTAUrl: urlOrPathSchema,
  createdBy: z.string().optional(),
})

export const updateNewsletterSchema = z.object({
  subject: z.string().min(1).max(200).optional(),
  preheader: z.string().max(200).optional(),
  introText: z.string().max(2000).optional().nullable(),
  heroImageUrl: urlOrPathSchema,
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(200).optional(),
  heroCTALabel: z.string().max(50).optional(),
  heroCTAUrl: urlOrPathSchema,
})

export const scheduleNewsletterSchema = z.object({
  scheduledAt: z.string().datetime().or(z.date()),
})

export const addContentSchema = z.object({
  contentType: z.enum(['EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION']),
  contentId: z.string().uuid().optional(),
  sectionHeading: z.string().max(100).optional(),
  sectionDescription: z.string().max(500).optional(),
  orderPosition: z.number().int().min(0),
})

export const reorderContentSchema = z.object({
  content: z.array(
    z.object({
      id: z.string().uuid().optional(),
      contentType: z.enum(['EVENT', 'ARTICLE', 'SHOW', 'CUSTOM_SECTION']),
      contentId: z.string().nullable().optional(),
      sectionHeading: z.string().max(100).nullable().optional(),
      sectionDescription: z.string().max(500).nullable().optional(),
      orderPosition: z.number().int().min(0),
    })
  ),
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const subscriberListSchema = paginationSchema.extend({
  status: z.enum(['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']).optional(),
  interests: z.string().optional(), // Comma-separated list
})

// Admin subscriber management
export const adminCreateSubscriberSchema = z.object({
  // Dieselbe Vereinheitlichung wie im öffentlichen Formular. Sonst legt das
  // Panel `Chris@Example.de` als zweiten Datensatz neben `chris@example.de` an:
  // dieselbe Person bekommt jede Mail doppelt, und eine Abmeldung wirkt nur
  // für eine der beiden Schreibweisen.
  email: normalizedEmail,
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'ACTIVE']).default('ACTIVE'),
  skipConfirmation: z.boolean().default(true), // Admin can add directly as active
})

export const adminUpdateSubscriberSchema = z.object({
  firstName: z.string().optional(),
  interests: z.array(z.string()).optional(),
  status: z.enum(['PENDING', 'ACTIVE', 'UNSUBSCRIBED', 'BOUNCED']).optional(),
})

export const newsletterListSchema = paginationSchema.extend({
  status: z.enum(['DRAFT', 'SCHEDULED', 'SENDING', 'SENT']).optional(),
})

export const contentFilterSchema = z.object({
  startDate: z.string().optional(), // Accepts YYYY-MM-DD or ISO datetime
  endDate: z.string().optional(),   // Accepts YYYY-MM-DD or ISO datetime
  category: z.string().optional(),
  status: z.string().optional(),
  tags: z.string().optional(), // Comma-separated list
})
