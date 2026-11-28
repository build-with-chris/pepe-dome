'use client'

/**
 * Ticket-Leiste am unteren Bildschirmrand, nur auf dem Handy.
 *
 * Auf der Detailseite steht der Kaufknopf in der Infokarte. Auf dem Desktop
 * ist das eine Seitenleiste, die mitscrollt. Auf dem Handy rutscht die Karte
 * unter den ganzen Inhalt: Bei "Two Gather" lag der einzige Knopf 4200 Pixel
 * tief, mehr als fünf Bildschirme unter dem Einstieg. Wer aus einer Anzeige
 * kommt und kaufen will, musste erst an Trailer, Beschreibung, Künstlern und
 * Newsletter-Anmeldung vorbei.
 *
 * Die Leiste hält Preis, Termin und Knopf vom ersten Moment an in Reichweite.
 * Sie blendet sich aus, sobald die Infokarte selbst im Bild ist, damit nicht
 * zwei Kaufknöpfe übereinander stehen.
 *
 * Sie liegt unter dem Einwilligungsbanner (z-100). Beim ersten Besuch
 * verdeckt der Banner sie also, bis jemand entschieden hat. Das ist so
 * gewollt: Zwei Leisten am selben Rand wären schlimmer.
 */

import { useEffect, useState } from 'react'
import TicketLink from '@/components/events/TicketLink'
import { Button } from '@/components/ui/Button'

interface MobileTicketBarProps {
  ticketUrl: string
  eventTitle: string
  eventSlug: string
  price?: string | null
  /** Kurzform des Termins, etwa "Fr., 27. Nov. · 19:00 Uhr". */
  when: string
  /** Fertige Beschriftung des Knopfs. */
  label: string
  /** ID des Elements mit dem Kaufknopf in der Infokarte. */
  targetId: string
}

export default function MobileTicketBar({
  ticketUrl,
  eventTitle,
  eventSlug,
  price,
  when,
  label,
  targetId,
}: MobileTicketBarProps) {
  const [targetVisible, setTargetVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    const observer = new IntersectionObserver(
      ([entry]) => setTargetVisible(entry.isIntersecting),
      { threshold: 0.5 }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [targetId])

  return (
    <div
      // inert statt nur unsichtbar: Eine ausgeblendete Leiste soll weder per
      // Tastatur erreichbar sein noch vom Screenreader vorgelesen werden.
      inert={targetVisible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--pepe-line)] bg-[var(--pepe-black)]/95 backdrop-blur-md transition-transform duration-300 ease-out lg:hidden ${
        targetVisible ? 'translate-y-full' : 'translate-y-0'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="stage-container flex items-center justify-between gap-4 py-3">
        <div className="min-w-0">
          {price && (
            <div className="text-base font-bold leading-snug text-[var(--pepe-white)]">{price}</div>
          )}
          <div className="text-xs leading-snug text-[var(--pepe-t64)]">{when}</div>
        </div>
        <TicketLink
          ticketUrl={ticketUrl}
          eventTitle={eventTitle}
          eventSlug={eventSlug}
          price={price}
          className="flex-shrink-0"
        >
          <Button variant="primary" size="md">
            {label}
          </Button>
        </TicketLink>
      </div>
    </div>
  )
}
