/**
 * AGB (Terms and Conditions) Page
 * General Terms and Conditions for events, tickets, workshops/courses and room rental
 */

import HeroSection from '@/components/custom/HeroSection'

export default function AGPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Allgemeine Geschäftsbedingungen (AGB)"
        subtitle="für Veranstaltungen, Tickets, Workshops/Kurse und Raummiete im „Pepe Dome""
        size="sm"
      />

      {/* Content */}
      <div className="stage-container py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 md:p-12 space-y-8">
            {/* Stand */}
            <div className="text-[var(--pepe-t64)] text-sm mb-8">
              Stand: 28.01.2026
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                1. Geltungsbereich
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Diese AGB gelten für alle Verträge, die über diese Website sowie über
                  angebundene Ticket-/Buchungsdienstleister (z.B. Ticketplattformen) über den
                  Besuch von Veranstaltungen, den Erwerb von Tickets/Mehrfachkarten, die
                  Teilnahme an Workshops/Kursen sowie die Anmietung von Räumen im „Pepe Dome"
                  geschlossen werden.
                </p>
                <p>
                  2. Abweichende Bedingungen von Kund:innen gelten nicht, außer wir stimmen ihnen
                  ausdrücklich schriftlich zu.
                </p>
                <p>
                  3. Angebote wie Artist Booking/Showvermittlung sind nicht Vertragsgegenstand
                  dieser Website. Hierfür verweisen wir auf „Pepe Shows" (pepeshows.de).
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                2. Vertragspartner
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Vertragspartner ist ausschließlich: Circus Akademie München e.V. (nachfolgend
                „Veranstalter").
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                3. Vertragsschluss und Buchung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Die Darstellung von Leistungen auf der Website ist eine Einladung zur
                  Buchung.
                </p>
                <p>
                  2. Der Vertrag kommt zustande, sobald
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    <li>die Buchung über unsere eigene Plattform verbindlich abgeschlossen wird, oder</li>
                    <li>
                      bei Buchungen über Ticketdienstleister die dortige
                      Buchungsbestätigung/Bestellbestätigung erfolgt.
                    </li>
                  </ul>
                </p>
                <p>
                  3. Bei Buchungen über Dritte können zusätzlich deren technische Abläufe und
                  Bedingungen gelten. Der Vertrag über die Leistung (Veranstaltung/Workshop etc.)
                  kommt – soweit so ausgewiesen – mit dem Veranstalter zustande.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                4. Preise und Zahlung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>1. Alle Preise sind Endpreise (brutto).</p>
                <p>2. Zahlungsarten: PayPal, Stripe, EC-Karte vor Ort (je nach Angebot).</p>
                <p>3. Zahlung ist sofort fällig.</p>
                <p>
                  4. Kommt es zu Rücklastschriften/Fehlbuchungen, sind die dadurch
                  entstehenden Kosten vom Verursacher zu tragen. Bei Zahlungsverzug können die
                  gesetzlichen Verzugszinsen und pauschalen Verzugskosten berechnet werden.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                5. Tickets, Einlass, Nutzung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Tickets (auch digitale Tickets) sind zum Einlass bereitzuhalten (z.B.
                  QR-Code).
                </p>
                <p>
                  2. Bei verspätetem Erscheinen besteht kein Anspruch auf Einlass zu einem
                  späteren Zeitpunkt, wenn dadurch der Ablauf gestört würde (z.B. bei
                  Vorführungen).
                </p>
                <p>
                  3. Weiterverkauf von Tickets zu überhöhten Preisen sowie Ticketmissbrauch kann
                  zum Ausschluss führen.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                6. Mehrfachkarten (z.B. 10er-/20er-Tickets)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Mehrfachkarten berechtigen zur Teilnahme an den jeweils dafür freigegebenen
                  Terminen/Angeboten gemäß Beschreibung.
                </p>
                <p>
                  2. Eine Auszahlung des Restwerts ist ausgeschlossen, soweit gesetzlich
                  zulässig.
                </p>
                <p>
                  3. Mehrfachkarten sind 3 Jahre gültig (gerechnet ab Ende des Jahres des Kaufs),
                  sofern beim Kauf nichts Abweichendes angegeben ist.
                </p>
                <p>
                  4. Mehrfachkarten sind übertragbar; die Weitergabe erfolgt auf eigene
                  Verantwortung.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                7. Workshops und Kurse
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Inhalte, Voraussetzungen und ggf. Mindestteilnehmerzahlen ergeben sich aus der
                  jeweiligen Ausschreibung.
                </p>
                <p>
                  2. Workshops: Eine Mindestteilnehmerzahl kann vom jeweiligen Workshop-Leiter
                  festgelegt und in der Ausschreibung genannt werden.
                </p>
                <p>
                  3. Kurse: Mindestteilnehmerzahl ist 5 Personen, sofern in der Ausschreibung
                  nichts Abweichendes angegeben ist.
                </p>
                <p>
                  4. Workshop-Leiter können Leistungen fachlich anleiten; Vertragspartner bleibt
                  der Veranstalter.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                8. Storno, Erstattung, Kulanz-Umbuchung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Tickets (Events, Kulturformate wie Kunstausstellungen, Open Stage, Open
                  Kino etc.): Eine Erstattung ist grundsätzlich ausgeschlossen, soweit gesetzlich
                  zulässig.
                </p>
                <p>
                  2. Workshops/Kurse: Eine Erstattung ist grundsätzlich ausgeschlossen, soweit
                  gesetzlich zulässig.
                </p>
                <p>
                  3. Kulanzregelung (Umbuchung/Alternativen): Unabhängig davon kann im Einzelfall
                  telefonisch oder per Kontaktaufnahme angefragt werden, ob eine Umbuchung (z.B.
                  auf ein anderes Datum) oder eine alternative Nutzung möglich ist. Ein Anspruch
                  hierauf besteht nicht.
                </p>
                <p>4. Ersatzpersonen: Teilnehmende dürfen jederzeit eine Ersatzperson benennen.</p>
                <p>5. Keine Umbuchungsgebühr.</p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                9. Absage/Änderungen durch den Veranstalter
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Muss der Veranstalter einen Termin absagen, erfolgt dies – soweit möglich –
                  mindestens 3 Stunden vor Beginn.
                </p>
                <p>
                  2. In diesem Fall erfolgt eine vollständige Erstattung nach Wahl des
                  Veranstalters entweder
                  <ul className="list-disc list-inside mt-2 ml-4 space-y-1">
                    <li>als Gutschein (inkl. Bonus: 1 Freigetränk), oder</li>
                    <li>auf die ursprüngliche Zahlungsmethode.</li>
                  </ul>
                </p>
                <p>
                  3. Der Veranstalter darf zumutbare Änderungen vornehmen (z.B. Ablauf, Uhrzeiten,
                  Programm, Besetzung, Ort innerhalb des Veranstaltungsbereichs), sofern der
                  Gesamtcharakter der Leistung erhalten bleibt und die Änderung für Teilnehmende
                  zumutbar ist.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                10. Widerrufsrecht (Verbraucher:innen)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Verbraucher:innen haben bei Fernabsatzverträgen grundsätzlich ein
                  Widerrufsrecht.
                </p>
                <p>
                  2. Kein Widerrufsrecht besteht insbesondere bei Verträgen zur Erbringung von
                  Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, wenn für die
                  Leistung ein spezifischer Termin/Zeitraum vorgesehen ist (z.B.
                  Veranstaltungstickets).
                </p>
                <p>
                  3. Soweit ausnahmsweise doch ein Widerrufsrecht besteht (z.B. bei bestimmten
                  Mehrfachkarten ohne Terminbezug), gelten die gesetzlichen Regeln.
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                11. Teilnahmebedingungen, Sicherheit, Minderjährige
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Minderjährige dürfen nur mit Einverständnis der Erziehungsberechtigten
                  teilnehmen.
                </p>
                <p>
                  2. Bei sportlich/artistischen Angeboten gilt: Teilnehmende sind selbst
                  verantwortlich, ihre Sporttauglichkeit/Gesundheit zu prüfen und Risiken
                  realistisch einzuschätzen.
                </p>
                <p>
                  3. Den Anweisungen des Personals/der Kursleitungen ist Folge zu leisten, sofern
                  sie der Sicherheit und dem Ablauf dienen.
                </p>
              </div>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                12. Hausordnung und Verhalten
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>1. Alkohol und Drogen sind untersagt.</p>
                <p>2. Rauchen ist im Vorzelt und im Dome strikt verboten.</p>
                <p>
                  3. Bei Verstößen gegen Sicherheitsregeln, Hausordnung oder grob störendem
                  Verhalten kann der Veranstalter Personen ohne Erstattung vom weiteren Besuch/der
                  weiteren Teilnahme ausschließen.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                13. Haftung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Der Veranstalter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit,
                  sowie bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
                </p>
                <p>
                  2. Bei einfacher Fahrlässigkeit haftet der Veranstalter nur bei Verletzung
                  wesentlicher Vertragspflichten (Kardinalpflichten) und begrenzt auf den
                  vertragstypischen, vorhersehbaren Schaden.
                </p>
                <p>
                  3. Eine weitergehende Haftung ist ausgeschlossen, soweit gesetzlich zulässig.
                </p>
                <p>
                  4. Keine Haftung für Garderobe und mitgebrachte Gegenstände/Wertsachen, soweit
                  gesetzlich zulässig.
                </p>
                <p>5. Es besteht eine Betriebshaftpflichtversicherung.</p>
              </div>
            </section>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                14. Foto/Video/Audio – Aufnahmen und Veröffentlichung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Der Veranstalter fertigt Foto-/Videoaufnahmen grundsätzlich nur nach
                  vorheriger Nachfrage an. Wer nicht aufgenommen werden möchte, wird nicht
                  abgelichtet.
                </p>
                <p>
                  2. Eine Veröffentlichung (z.B. Website/Social Media) erfolgt nur nach
                  Einwilligung der betroffenen Person(en).
                </p>
                <p>
                  3. Teilnehmende dürfen sich selbst filmen/fotografieren. Dabei ist Rücksicht auf
                  Dritte zu nehmen; Aufnahmen anderer Personen sind nur mit deren Zustimmung
                  erlaubt.
                </p>
                <p>
                  4. Bei Veröffentlichungen eigener Inhalte wird um Verlinkung/Markierung der
                  Social-Media-Kanäle gebeten (freiwillig).
                </p>
              </div>
            </section>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                15. Kommunikation (E-Mail/SMS)
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Der Veranstalter darf Teilnehmende für organisatorische Informationen (z.B.
                Änderungen, Ausfälle, Hinweise zum Ablauf) per E-Mail und SMS kontaktieren.
              </p>
            </section>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                16. Raummiete (Pepe Dome)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Umfang, Mietdauer, Nutzungszweck, Übergabezeiten und ggf. zusätzliche
                  Leistungen ergeben sich aus dem jeweiligen Mietangebot/der Buchungsbestätigung.
                </p>
                <p>
                  2. Die Nutzung ist nur im vereinbarten Rahmen erlaubt. Sicherheits- und
                  Lärmschutzvorgaben sind einzuhalten.
                </p>
                <p>
                  3. Der Veranstalter ist berechtigt, bei Verstößen die Nutzung zu beenden, wenn
                  dies zur Gefahrenabwehr, zum Schutz der Anlage oder zur Einhaltung behördlicher
                  Vorgaben erforderlich ist.
                </p>
              </div>
            </section>

            {/* Section 17 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                17. Hinweise zum Standort und Lärmschutz
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  1. Der Pepe Dome befindet sich im Ostpark München. Anreise mit ÖPNV über
                  U-Bahnhof Quiddestraße. Parkplätze u.a. am Michaelibad, anschließend ca. 15
                  Minuten Fußweg.
                </p>
                <p>
                  2. Es gelten die allgemeinen Lärmpegelstandards der Stadt München. Ab 22:00 Uhr
                  ist die Lautstärke so zu reduzieren, dass Anwohner:innen nicht beeinträchtigt
                  werden.
                </p>
              </div>
            </section>

            {/* Section 18 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                18. Verbraucherstreitbeilegung
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Der Veranstalter ist nicht bereit und nicht verpflichtet, an
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            {/* Section 19 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-4">
                19. Schlussbestimmungen
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>1. Es gilt deutsches Recht.</p>
                <p>
                  2. Gerichtsstand ist – soweit gesetzlich zulässig – München.
                </p>
                <p>
                  3. Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
                  die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
