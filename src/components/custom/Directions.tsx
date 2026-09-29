/**
 * Wegbeschreibung zum Dome (U-Bahn, Auto, Google Maps).
 *
 * Texte kommen aus dem Dictionary-Block `anreise`, damit Café- und
 * Kontaktseite dieselbe Beschreibung zeigen. Vorher standen dort
 * unterschiedliche Parkplätze. Ohne Hooks, läuft also in Server- und
 * Client-Komponenten.
 */
import type { Dictionary } from '@/i18n/get-dictionary'

export default function Directions({
  t,
  showLead = true,
}: {
  t: Dictionary['anreise']
  showLead?: boolean
}) {
  return (
    <div>
      {showLead && (
        <p className="max-w-2xl mb-8 text-lg text-[var(--pepe-t80)] leading-relaxed">{t.lead}</p>
      )}
      <div className="grid md:grid-cols-3 gap-6">
        {[t.transit, t.car, t.maps].map((way) => (
          <div
            key={way.title}
            className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-7"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--pepe-gold)]/10 flex items-center justify-center mb-5">
              <span className="text-2xl leading-none" aria-hidden="true">{way.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-[var(--pepe-white)] mb-3">{way.title}</h3>
            <p className="text-[var(--pepe-t80)] text-sm leading-relaxed">{way.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
