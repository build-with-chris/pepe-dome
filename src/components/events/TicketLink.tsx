'use client'

/**
 * Ticketlink mit Conversion-Messung.
 *
 * Der Kauf selbst passiert auf rausgegangen.de, also auf einer Domain, auf
 * der wir kein Purchase-Ereignis feuern können. Dieser Klick ist damit die
 * beste verfügbare Näherung an einen Kauf und die Kennzahl, gegen die wir
 * Kampagnen bewerten.
 *
 * Kapselt außerdem die Mail-oder-URL-Unterscheidung, die vorher an drei
 * Stellen im Code dupliziert war.
 */

import type { ReactNode } from 'react'
import { trackTicketClick } from '@/lib/tracking'
import { isMailTicket, ticketHref } from '@/lib/ticket-url'

interface TicketLinkProps {
  ticketUrl: string
  eventTitle: string
  eventSlug?: string
  price?: string | null
  className?: string
  /** Eigener Inhalt, z. B. eine <Button>-Komponente. Sonst nur der Text. */
  children?: ReactNode
  /** Beschriftung, wenn keine children übergeben werden. */
  label?: string
  /** Beschriftung für Mail-Anmeldungen, wenn keine children übergeben werden. */
  mailLabel?: string
}

export default function TicketLink({
  ticketUrl,
  eventTitle,
  eventSlug,
  price,
  className = '',
  children,
  label = 'Tickets kaufen',
  mailLabel = 'Anmelden via Mail',
}: TicketLinkProps) {
  const isMail = isMailTicket(ticketUrl)
  const href = ticketHref(ticketUrl)

  const handleClick = () => {
    trackTicketClick({
      eventTitle,
      eventSlug,
      price: price ?? undefined,
      destination: isMail ? undefined : href,
    })
  }

  return (
    <a
      href={href}
      target={isMail ? undefined : '_blank'}
      rel={isMail ? undefined : 'noopener noreferrer'}
      onClick={handleClick}
      className={className}
    >
      {children ?? (isMail ? mailLabel : label)}
    </a>
  )
}
