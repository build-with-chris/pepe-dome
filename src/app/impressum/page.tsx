/**
 * Impressum Page
 */

import HeroSection from '@/components/custom/HeroSection'
import { getSiteContent } from '@/lib/data'

export default function ImpressumPage() {
  const site = getSiteContent()

  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Impressum"
        subtitle="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)"
        size="sm"
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Betreiber */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
              </h2>
              
              <div className="space-y-8 text-[var(--pepe-t80)] leading-relaxed">
                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Betreiber
                  </h3>
                  <p className="text-[var(--pepe-white)] font-semibold mb-4">
                    Circus Akademie München e.V.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Anschrift
                  </h3>
                  <p className="leading-relaxed">
                    Ranhazweg 18<br />
                    85521 Ottobrunn<br />
                    Deutschland
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Kontakt
                  </h3>
                  <p className="leading-relaxed">
                    Telefon: <a href={`tel:${site.phone}`} className="text-[var(--pepe-gold)] hover:underline">{site.phone}</a><br />
                    E-Mail: <a href={`mailto:${site.email}`} className="text-[var(--pepe-gold)] hover:underline">{site.email}</a><br />
                    <span className="text-[var(--pepe-t64)]">Kontaktformular: Nachrichten über das Kontaktformular werden an die genannte E-Mail-Adresse weitergeleitet.</span>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Vereinsregister
                  </h3>
                  <p className="leading-relaxed">
                    Eingetragen im Vereinsregister.<br />
                    Registergericht: Amtsgericht München<br />
                    Registernummer: VR 208483
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Vertretungsberechtigung
                  </h3>
                  <p className="leading-relaxed mb-3">
                    Der Verein wird durch den Vorstand vertreten; jedes Vorstandsmitglied ist einzelvertretungsberechtigt.
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-[var(--pepe-white)]">Vorstand (laut Register):</strong> Doro Auer, Mathias Eder, Marius Eichhöfer, Michael Heiduk, Johannes Thumser, Karl Trautmann.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                    Umsatzsteuer-ID
                  </h3>
                  <p className="leading-relaxed">
                    Keine Umsatzsteuer-Identifikationsnummer vorhanden.
                  </p>
                </div>
              </div>
            </div>

            {/* Verantwortlich für den Inhalt */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV
              </h2>
              
              <div className="space-y-4 text-[var(--pepe-t80)] leading-relaxed">
                <p className="text-[var(--pepe-white)] font-semibold">
                  Christoph Hermann
                </p>
                <p>
                  Kiebitzweg 12a<br />
                  85464 Finsing<br />
                  Deutschland
                </p>
                <p>
                  E-Mail: <a href="mailto:Chris@pepearts.de" className="text-[var(--pepe-gold)] hover:underline">Chris@pepearts.de</a>
                </p>
              </div>
            </div>

            {/* Verbraucherstreitbeilegung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Verbraucherstreitbeilegung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Der Verein ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>

            {/* Haftung für Inhalte */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Haftung für Inhalte
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Eine Verpflichtung zur Überwachung übermittelter oder gespeicherter fremder Informationen besteht jedoch nicht.
                </p>
              </div>
            </div>

            {/* Haftung für Links */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Haftung für Links
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Diese Website enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr.
                </p>
              </div>
            </div>

            {/* Urheberrecht */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Urheberrecht
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung, Bearbeitung, Verbreitung oder Verwertung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
