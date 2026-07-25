/**
 * Gemeinsame Ereignisliste für Browser-Pixel und Conversions API.
 *
 * Bewusst ohne Imports, damit sowohl der Client (`@/lib/tracking`) als auch
 * die Server-Route (`/api/track`) sie nutzen können, ohne den jeweils
 * anderen Code mit in ihr Bundle zu ziehen.
 *
 * `Lead` ist absichtlich der gemeinsame Nenner für Newsletter-Anmeldung UND
 * Kursinteresse. Meta braucht rund 50 Conversions pro Anzeigengruppe und
 * Woche, um aus der Lernphase zu kommen. Zwei getrennte Ereignisse würden
 * denselben Signalpool halbieren und keines käme je über die Schwelle.
 * Unterschieden wird über `lead_type` in den custom_data.
 */

export const TRACKED_EVENTS = [
  'Lead',
  'ViewContent',
  'CompleteRegistration',
  'TicketClick',
] as const

export type TrackedEvent = (typeof TRACKED_EVENTS)[number]

/**
 * `TicketClick` ist kein Meta-Standardereignis und muss über `trackCustom`
 * gemeldet werden. Standardereignisse laufen über `track`.
 */
export function isCustomEvent(event: TrackedEvent): boolean {
  return event === 'TicketClick'
}
