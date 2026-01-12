/**
 * Admin Constants
 *
 * Centralized constants for the admin area.
 * Import from here instead of defining locally to ensure consistency.
 */

// Status colors for badges (content status)
export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  PUBLISHED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ARCHIVED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  SENT: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  SCHEDULED: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  SENDING: 'bg-[#016dca]/20 text-[#016dca] border-[#016dca]/30',
}

// Status labels (German)
export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  PUBLISHED: 'Veröffentlicht',
  ARCHIVED: 'Archiviert',
  SENT: 'Gesendet',
  SCHEDULED: 'Geplant',
  SENDING: 'Wird gesendet',
}

// Subscriber status colors
export const SUBSCRIBER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ACTIVE: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  UNSUBSCRIBED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  BOUNCED: 'bg-red-500/20 text-red-400 border-red-500/30',
}

// Subscriber status labels (German)
export const SUBSCRIBER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ausstehend',
  ACTIVE: 'Aktiv',
  UNSUBSCRIBED: 'Abgemeldet',
  BOUNCED: 'Bounced',
}

// Event category labels (German)
export const CATEGORY_LABELS: Record<string, string> = {
  SHOW: 'Show',
  PREMIERE: 'Premiere',
  FESTIVAL: 'Festival',
  WORKSHOP: 'Workshop',
  OPEN_TRAINING: 'Training',
  KINDERTRAINING: 'Kinder',
  BUSINESS: 'Business',
  OPEN_AIR: 'Open Air',
  EVENT: 'Event',
}

// Article category labels (German)
export const ARTICLE_CATEGORY_LABELS: Record<string, string> = {
  NEWS: 'News',
  ARTICLE: 'Artikel',
  INTERVIEW: 'Interview',
  REVIEW: 'Review',
  ANNOUNCEMENT: 'Ankündigung',
}

// Status options for selects
export const STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Entwurf' },
  { value: 'PUBLISHED', label: 'Veröffentlicht' },
  { value: 'ARCHIVED', label: 'Archiviert' },
]

// Newsletter status options
export const NEWSLETTER_STATUS_OPTIONS = [
  { value: 'DRAFT', label: 'Entwurf' },
  { value: 'SCHEDULED', label: 'Geplant' },
  { value: 'SENT', label: 'Gesendet' },
]

// Event category options
export const CATEGORY_OPTIONS = [
  { value: 'SHOW', label: 'Show' },
  { value: 'PREMIERE', label: 'Premiere' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'OPEN_TRAINING', label: 'Training' },
  { value: 'KINDERTRAINING', label: 'Kinder' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'OPEN_AIR', label: 'Open Air' },
  { value: 'EVENT', label: 'Event' },
]
