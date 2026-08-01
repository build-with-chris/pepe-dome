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
 * Vorgaben einhaelt und trotzdem zum Rest der Seite passt.
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
          className={cn(tileClass, 'w-full', isFooter ? 'max-w-[34rem]' : 'max-w-[44rem]')}
        >
          <Image
            src={supporter.src}
            alt={supporter.alt}
            width={supporter.width}
            height={supporter.height}
            // Das Band traegt Pflichtangaben zum Foerderprogramm. Es bekommt
            // die volle Kartenbreite, damit der Text darin lesbar bleibt.
            className="h-auto w-full object-contain"
            sizes={isFooter ? '(max-width: 639px) 92vw, 544px' : '(max-width: 639px) 92vw, 704px'}
          />
        </div>
      ))}
    </div>
  )
}
