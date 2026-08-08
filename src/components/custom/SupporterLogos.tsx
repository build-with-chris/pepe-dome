import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SUPPORTERS, type Supporter } from '@/data/supporters'

/**
 * Die Logos der Förderer, einmal für die Über-uns-Seite und einmal für den
 * Footer.
 *
 * Warum weisse Kacheln: die Seite ist dunkel, die Logos sind schwarz auf weiss
 * gesetzt und teils mehrfarbig. Auf dem dunklen Grund waeren sie unsichtbar.
 * Sie einzufaerben oder zu invertieren ist keine Option, Foerderlogos duerfen
 * nicht veraendert werden. Eine helle Flaeche darunter ist der Weg, der die
 * Vorgaben einhaelt und trotzdem zum Rest der Seite passt. Baender bringen
 * diese Flaeche schon mit und bekommen deshalb keine Kachel.
 *
 * Warum nicht alle Logos gleich hoch: die Formate gehen weit auseinander. Das
 * Foerderband des Bund-Laender-Programms ist siebenmal so breit wie hoch und
 * traegt einen Fliesstext, das Stiftungslogo ist hochformatig. Auf eine
 * gemeinsame Hoehe gebracht waere der Text im Band unlesbar und die Stiftung
 * ein Briefmarken-Quadrat. Deshalb bekommt jedes Format seine eigene Groesse,
 * hergeleitet aus dem Seitenverhaeltnis der Datei.
 */

/**
 * Ab diesem Seitenverhältnis gilt ein Logo als Band und bekommt eine eigene
 * Zeile. Der Wert trennt das Foerderband des Bund-Laender-Programms (gut 7:1,
 * mit Fliesstext darin) von den normalen Logoleisten (etwa 4:1), die in der
 * gemeinsamen Zeile besser aufgehoben sind.
 */
const BAND_RATIO = 6

function ratioOf(supporter: Supporter) {
  return supporter.width / supporter.height
}

export default function SupporterLogos({
  variant = 'page',
  className,
}: {
  /** `page` steht fuer sich, `footer` laeuft am Seitenende mit und ist kleiner. */
  variant?: 'page' | 'footer'
  className?: string
}) {
  const isFooter = variant === 'footer'
  const bands = SUPPORTERS.filter((s) => ratioOf(s) >= BAND_RATIO)
  const rest = SUPPORTERS.filter((s) => ratioOf(s) < BAND_RATIO)

  const tileClass = cn(
    'flex items-center justify-center rounded-lg bg-white',
    isFooter ? 'px-3 py-2' : 'px-5 py-4'
  )

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        isFooter ? 'gap-3' : 'gap-5',
        className
      )}
    >
      {rest.length > 0 && (
        <ul
          className={cn(
            'flex list-none flex-wrap items-center justify-center',
            isFooter ? 'gap-3' : 'gap-5'
          )}
        >
          {rest.map((supporter) => {
            // Hochformatiges neben querformatigem Logo: auf gleicher Hoehe
            // wirkt das hochformatige deutlich kleiner, also bekommt es mehr.
            const isTall = ratioOf(supporter) < 1.2
            return (
              <li key={supporter.src} className={tileClass}>
                <Image
                  src={supporter.src}
                  alt={supporter.alt}
                  width={supporter.width}
                  height={supporter.height}
                  className={cn(
                    'w-auto object-contain',
                    isFooter
                      ? isTall
                        ? 'h-11'
                        : 'h-8'
                      : isTall
                        ? 'h-20 md:h-24'
                        : 'h-12 md:h-16'
                  )}
                  sizes={isFooter ? '160px' : '320px'}
                />
              </li>
            )
          })}
        </ul>
      )}

      {bands.map((supporter) => (
        <div
          key={supporter.src}
          // Keine weisse Kachel darunter: das Band bringt seine helle Flaeche
          // selbst mit, die Kachel waere nur ein zweites Weiss an derselben
          // Stelle. Ohne sie laesst sich das Bild leicht abdunkeln, damit der
          // Block auf der schwarzen Seite nicht knallt.
          className="w-full overflow-hidden rounded-lg"
        >
          <Image
            src={supporter.src}
            alt={supporter.alt}
            width={supporter.width}
            height={supporter.height}
            // Das Band traegt Pflichtangaben zum Foerderprogramm und bekommt
            // die volle Breite, damit der Text darin lesbar bleibt. Der
            // Container ist hoechstens 1180px breit, die Datei 1400px: das
            // Band wird also nie hochskaliert.
            className="h-auto w-full object-contain opacity-[0.88]"
            sizes="(max-width: 639px) 92vw, 1180px"
          />
        </div>
      ))}
    </div>
  )
}
