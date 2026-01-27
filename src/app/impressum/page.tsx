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
        subtitle="Rechtliche Angaben gemäß § 5 TMG"
        size="sm"
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                Angaben gemäß § 5 TMG
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12 text-[var(--pepe-t80)]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                      Betreiber der Website
                    </h3>
                    <p className="leading-relaxed">
                      Michael Heiduk<br />
                      Ranharzweg 18<br />
                      85521 Ottobrunn
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                      Kontakt
                    </h3>
                    <p className="leading-relaxed">
                      Telefon: {site.phone}<br />
                      E-Mail: {site.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                      Verantwortlich für den Inhalt
                    </h3>
                    <p className="leading-relaxed">
                      Christoph Hermann<br />
                      Kiebitzweg 12a<br />
                      85464 Finsing
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[var(--pepe-gold)] uppercase tracking-wider mb-3">
                      Umsatzsteuer-ID
                    </h3>
                    <p className="leading-relaxed">
                      Zum aktuellen Zeitpunkt ist keine Umsatzsteuer-Identifikationsnummer vorhanden.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl space-y-10">
              <section>
                <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">Haftungsausschluss</h2>
                <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Haftung für Inhalte</h3>
                    <p>
                      Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Haftung für Links</h3>
                    <p>
                      Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                    </p>
                  </div>
                </div>
              </section>

              <section className="pt-10 border-t border-[var(--pepe-line)]">
                <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">EU-Streitschlichtung</h2>
                <p className="text-[var(--pepe-t80)] leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-[var(--pepe-gold)] hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>.
                  Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </section>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
