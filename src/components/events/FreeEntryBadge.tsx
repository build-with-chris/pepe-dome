/**
 * FreeEntryBadge — der Gratis-Sticker
 *
 * Viele Veranstaltungen im Dome kosten nichts, und das ist ein Argument, das
 * beim Überfliegen einer Liste ankommen muss. Deshalb ein Sticker und kein
 * weiteres Textlabel: leicht schräg, kräftiges Grün, schwarze Schrift.
 *
 * Warum Grün und nicht die Markenfarbe: --pepe-gold ist trotz des Namens Blau
 * (#016dca) und damit die Farbe, in der auf einer Event-Karte schon Datum,
 * Kategorie und Button stecken. Ein blauer Sticker würde in dieser Umgebung
 * untergehen, also genau das nicht leisten, wofür er da ist. --pepe-success
 * (#00DC82) ist das einzige kräftige Nicht-Blau im Token-Satz, hebt sich gegen
 * Foto und dunkle Karte ab, und Grün liest sich ohne Erklärung als "geht klar".
 * Schwarz auf diesem Grün hat einen Kontrast von rund 13:1, also weit über der
 * WCAG-Anforderung von 4,5:1 — auch auf einem hellen Bild darunter.
 */

import { cn } from '@/lib/utils'

export type FreeEntryBadgeSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<FreeEntryBadgeSize, string> = {
  sm: 'text-[10px] px-2 py-1 tracking-wide',
  md: 'text-xs px-3 py-1.5 tracking-wider',
  lg: 'text-sm md:text-base px-4 py-2 tracking-wider',
}

export default function FreeEntryBadge({
  label,
  size = 'md',
  className,
}: {
  /** Lokalisierter Text, z.B. "Gratis Eintritt" / "Free entry". */
  label: string
  size?: FreeEntryBadgeSize
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex select-none items-center gap-1.5 rounded-full font-black uppercase',
        'bg-[var(--pepe-success)] text-black',
        // Der weisse Ring trennt den Sticker vom Foto darunter, egal wie hell
        // oder unruhig das Bild an dieser Stelle ist.
        'ring-2 ring-white/85 shadow-[0_4px_14px_rgba(0,0,0,0.45)]',
        // Die leichte Drehung ist der ganze Trick am Aufkleber-Eindruck:
        // gerade ausgerichtet wirkt dasselbe Element wie ein normales Label.
        '-rotate-[7deg]',
        SIZE_CLASSES[size],
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn('flex-shrink-0', size === 'lg' ? 'h-4 w-4' : 'h-3 w-3')}
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {label}
    </span>
  )
}
