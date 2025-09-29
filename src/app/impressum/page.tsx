"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="impressum" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Impressum
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Rechtliche Angaben gemäß § 5 TMG
          </p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Angaben gemäß § 5 TMG */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Angaben gemäß § 5 TMG</h2>
              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Betreiber der Website</h3>
                  <p>
                    PepeShows<br />
                    [Vollständiger Name des Inhabers]<br />
                    [Straße und Hausnummer]<br />
                    [PLZ und Ort]
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Kontakt</h3>
                  <p>
                    Telefon: [Telefonnummer]<br />
                    E-Mail: info@pepearts.de
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Umsatzsteuer-ID</h3>
                  <p>
                    Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br />
                    [USt-IdNr.]
                  </p>
                </div>
              </div>
            </div>

            {/* Verantwortlich für den Inhalt */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <div className="text-white/80">
                <p>
                  [Vollständiger Name]<br />
                  [Straße und Hausnummer]<br />
                  [PLZ und Ort]
                </p>
              </div>
            </div>

            {/* Haftungsausschluss */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">Haftungsausschluss</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Haftung für Inhalte</h3>
                  <p>
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="mt-3">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
                  </p>
                  <p className="mt-3">
                    Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Urheberrecht</h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                  <p className="mt-3">
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>
              </div>
            </div>

            {/* EU-Streitschlichtung */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">EU-Streitschlichtung</h2>
              <div className="text-white/80">
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="mt-3">
                  Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}