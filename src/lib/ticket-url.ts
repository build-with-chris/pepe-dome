/**
 * Ticketlink-Erkennung.
 *
 * Im `ticket_url`-Feld steht entweder eine echte URL (meist rausgegangen.de)
 * oder eine E-Mail-Adresse für Anmeldungen per Mail. Diese Unterscheidung war
 * vorher an drei Stellen dupliziert.
 *
 * Bewusst ohne 'use client' und ohne Imports: die Funktionen werden sowohl in
 * Server-Components (Eventdetailseite) als auch im Client (TicketLink)
 * gebraucht. Aus einem Client-Modul importiert wären sie serverseitig nur
 * Referenzen und der Aufruf würde den Render abbrechen.
 */

/** Anmeldung per Mail statt über einen Ticketshop? */
export function isMailTicket(ticketUrl: string): boolean {
  return ticketUrl.includes('@') && !ticketUrl.startsWith('http')
}

/** Baut das href-Attribut, ergänzt bei Mailadressen das mailto:-Schema. */
export function ticketHref(ticketUrl: string): string {
  if (isMailTicket(ticketUrl) && !ticketUrl.startsWith('mailto:')) {
    return `mailto:${ticketUrl}`
  }
  return ticketUrl
}
