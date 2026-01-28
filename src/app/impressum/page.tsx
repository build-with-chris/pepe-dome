/**
 * Impressum Page
 * Legal information according to German law (DDG)
 */

import HeroSection from '@/components/custom/HeroSection'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Impressum"
        subtitle="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)"
        size="sm"
      />

      {/* Content */}
      <div className="stage-container py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 md:p-12 space-y-8">
            {/* Betreiber Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Betreiber:
              </h2>
              <p className="text-lg text-[var(--pepe-white)] mb-4">
                Circus Akademie München e.V.
              </p>
            </section>

            {/* Anschrift Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Anschrift:
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-2">
                <p>Ranhazweg 18</p>
                <p>85521 Ottobrunn</p>
                <p>Deutschland</p>
              </div>
            </section>

            {/* Kontakt Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Kontakt:
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-2">
                <p>
                  Telefon:{' '}
                  <a
                    href="tel:+491796990707"
                    className="text-[var(--pepe-gold)] hover:underline"
                  >
                    +49 179 699 0707
                  </a>
                </p>
                <p>
                  E-Mail:{' '}
                  <a
                    href="mailto:info@pepearts.de"
                    className="text-[var(--pepe-gold)] hover:underline"
                  >
                    info@pepearts.de
                  </a>
                </p>
                <p>
                  Kontaktformular: Nachrichten über das Kontaktformular werden an die genannte
                  E-Mail-Adresse weitergeleitet.
                </p>
              </div>
            </section>

            {/* Vereinsregister Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Vereinsregister:
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-2">
                <p>Eingetragen im Vereinsregister.</p>
                <p>Registergericht: Amtsgericht München</p>
                <p>Registernummer: VR 208483</p>
              </div>
            </section>

            {/* Vertretungsberechtigung Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Vertretungsberechtigung:
              </h2>
              <p className="text-[var(--pepe-t80)] mb-4">
                Der Verein wird durch den Vorstand vertreten; jedes Vorstandsmitglied ist
                einzelvertretungsberechtigt.
              </p>
              <p className="text-[var(--pepe-t80)]">
                Vorstand (laut Register): Doro Auer, Mathias Eder, Marius Eichhöfer, Michael
                Heiduk, Johannes Thumser, Karl Trautmann.
              </p>
            </section>

            {/* Umsatzsteuer-ID Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Umsatzsteuer-ID:
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Keine Umsatzsteuer-Identifikationsnummer vorhanden.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Verantwortlich für den Inhalt Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-2">
                <p>Christoph Hermann</p>
                <p>Kiebitzweg 12a</p>
                <p>85464 Finsing</p>
                <p>Deutschland</p>
                <p>
                  E-Mail:{' '}
                  <a
                    href="mailto:Chris@pepearts.de"
                    className="text-[var(--pepe-gold)] hover:underline"
                  >
                    Chris@pepearts.de
                  </a>
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Verbraucherstreitbeilegung Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Verbraucherstreitbeilegung
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Der Verein ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren
                vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Haftung für Inhalte Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Haftung für Inhalte
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den
                allgemeinen Gesetzen verantwortlich. Eine Verpflichtung zur Überwachung
                übermittelter oder gespeicherter fremder Informationen besteht jedoch nicht.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Haftung für Links Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Haftung für Links
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Diese Website enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte
                wir keinen Einfluss haben. Für diese fremden Inhalte übernehmen wir keine Gewähr.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Urheberrecht Section */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                Urheberrecht
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
                unterliegen dem deutschen Urheberrecht. Eine Vervielfältigung, Bearbeitung,
                Verbreitung oder Verwertung außerhalb der Grenzen des Urheberrechts bedarf der
                vorherigen schriftlichen Zustimmung.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
