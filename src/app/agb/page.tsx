/**
 * AGB Page
 */
/* eslint-disable react/no-unescaped-entities */

import HeroSection from '@/components/custom/HeroSection'

export default function AGPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Allgemeine Geschäftsbedingungen (AGB)"
        subtitle="für Veranstaltungen, Tickets, Workshops/Kurse und Raummiete im &quot;Pepe Dome&quot;"
        size="sm"
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Stand */}
            <div className="text-center text-[var(--pepe-t64)] text-sm mb-8">
              Stand: 28.01.2026
            </div>

            {/* 1. Geltungsbereich */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                1. Geltungsbereich
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Diese AGB gelten für alle Verträge, die über diese Website sowie über angebundene Ticket-/Buchungsdienstleister (z.B. Ticketplattformen) über den Besuch von Veranstaltungen, den Erwerb von Tickets/Mehrfachkarten, die Teilnahme an Workshops/Kursen sowie die Anmietung von Räumen im &quot;Pepe Dome&quot; geschlossen werden.
                  </li>
                  <li>
                    Abweichende Bedingungen von Kund:innen gelten nicht, außer wir stimmen ihnen ausdrücklich schriftlich zu.
                  </li>
                  <li>
                    Angebote wie Artist Booking/Showvermittlung sind nicht Vertragsgegenstand dieser Website. Hierfür verweisen wir auf &quot;Pepe Shows&quot; (<a href="https://pepeshows.de" target="_blank" rel="noopener noreferrer" className="text-[var(--pepe-gold)] hover:underline">pepeshows.de</a>).
                  </li>
                </ol>
              </div>
            </div>

            {/* 2. Vertragspartner */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                2. Vertragspartner
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Vertragspartner ist ausschließlich: <strong className="text-[var(--pepe-white)]">Circus Akademie München e.V.</strong> (nachfolgend &quot;Veranstalter&quot;).
                </p>
              </div>
            </div>

            {/* 3. Vertragsschluss und Buchung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                3. Vertragsschluss und Buchung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Die Darstellung von Leistungen auf der Website ist eine Einladung zur Buchung.
                  </li>
                  <li>
                    Der Vertrag kommt zustande, sobald
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>die Buchung über unsere eigene Plattform verbindlich abgeschlossen wird, oder</li>
                      <li>bei Buchungen über Ticketdienstleister die dortige Buchungsbestätigung/Bestellbestätigung erfolgt.</li>
                    </ul>
                  </li>
                  <li>
                    Bei Buchungen über Dritte können zusätzlich deren technische Abläufe und Bedingungen gelten. Der Vertrag über die Leistung (Veranstaltung/Workshop etc.) kommt – soweit so ausgewiesen – mit dem Veranstalter zustande.
                  </li>
                </ol>
              </div>
            </div>

            {/* 4. Preise und Zahlung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                4. Preise und Zahlung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>Alle Preise sind Endpreise (brutto).</li>
                  <li>Zahlungsarten: PayPal, Stripe, EC-Karte vor Ort (je nach Angebot).</li>
                  <li>Zahlung ist sofort fällig.</li>
                  <li>
                    Kommt es zu Rücklastschriften/Fehlbuchungen, sind die dadurch entstehenden Kosten vom Verursacher zu tragen. Bei Zahlungsverzug können die gesetzlichen Verzugszinsen und pauschalen Verzugskosten berechnet werden.
                  </li>
                </ol>
              </div>
            </div>

            {/* 5. Tickets, Einlass, Nutzung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                5. Tickets, Einlass, Nutzung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Tickets (auch digitale Tickets) sind zum Einlass bereitzuhalten (z.B. QR-Code).
                  </li>
                  <li>
                    Bei verspätetem Erscheinen besteht kein Anspruch auf Einlass zu einem späteren Zeitpunkt, wenn dadurch der Ablauf gestört würde (z.B. bei Vorführungen).
                  </li>
                  <li>
                    Weiterverkauf von Tickets zu überhöhten Preisen sowie Ticketmissbrauch kann zum Ausschluss führen.
                  </li>
                </ol>
              </div>
            </div>

            {/* 6. Mehrfachkarten */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                6. Mehrfachkarten (z.B. 10er-/20er-Tickets)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Mehrfachkarten berechtigen zur Teilnahme an den jeweils dafür freigegebenen Terminen/Angeboten gemäß Beschreibung.
                  </li>
                  <li>
                    Eine Auszahlung des Restwerts ist ausgeschlossen, soweit gesetzlich zulässig.
                  </li>
                  <li>
                    Mehrfachkarten sind 3 Jahre gültig (gerechnet ab Ende des Jahres des Kaufs), sofern beim Kauf nichts Abweichendes angegeben ist.
                  </li>
                  <li>
                    Mehrfachkarten sind übertragbar; die Weitergabe erfolgt auf eigene Verantwortung.
                  </li>
                </ol>
              </div>
            </div>

            {/* 7. Workshops und Kurse */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                7. Workshops und Kurse
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Inhalte, Voraussetzungen und ggf. Mindestteilnehmerzahlen ergeben sich aus der jeweiligen Ausschreibung.
                  </li>
                  <li>
                    Workshops: Eine Mindestteilnehmerzahl kann vom jeweiligen Workshop-Leiter festgelegt und in der Ausschreibung genannt werden.
                  </li>
                  <li>
                    Kurse: Mindestteilnehmerzahl ist 5 Personen, sofern in der Ausschreibung nichts Abweichendes angegeben ist.
                  </li>
                  <li>
                    Workshop-Leiter können Leistungen fachlich anleiten; Vertragspartner bleibt der Veranstalter.
                  </li>
                </ol>
              </div>
            </div>

            {/* 8. Storno, Erstattung, Kulanz-Umbuchung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                8. Storno, Erstattung, Kulanz-Umbuchung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Tickets (Events, Kulturformate wie Kunstausstellungen, Open Stage, Open Kino etc.): Eine Erstattung ist grundsätzlich ausgeschlossen, soweit gesetzlich zulässig.
                  </li>
                  <li>
                    Workshops/Kurse: Eine Erstattung ist grundsätzlich ausgeschlossen, soweit gesetzlich zulässig.
                  </li>
                  <li>
                    Kulanzregelung (Umbuchung/Alternativen): Unabhängig davon kann im Einzelfall telefonisch oder per Kontaktaufnahme angefragt werden, ob eine Umbuchung (z.B. auf ein anderes Datum) oder eine alternative Nutzung möglich ist. Ein Anspruch hierauf besteht nicht.
                  </li>
                  <li>
                    Ersatzpersonen: Teilnehmende dürfen jederzeit eine Ersatzperson benennen.
                  </li>
                  <li>
                    Keine Umbuchungsgebühr.
                  </li>
                </ol>
              </div>
            </div>

            {/* 9. Absage/Änderungen durch den Veranstalter */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                9. Absage/Änderungen durch den Veranstalter
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Muss der Veranstalter einen Termin absagen, erfolgt dies – soweit möglich – mindestens 3 Stunden vor Beginn.
                  </li>
                  <li>
                    In diesem Fall erfolgt eine vollständige Erstattung nach Wahl des Veranstalters entweder
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>als Gutschein (inkl. Bonus: 1 Freigetränk), oder</li>
                      <li>auf die ursprüngliche Zahlungsmethode.</li>
                    </ul>
                  </li>
                  <li>
                    Der Veranstalter darf zumutbare Änderungen vornehmen (z.B. Ablauf, Uhrzeiten, Programm, Besetzung, Ort innerhalb des Veranstaltungsbereichs), sofern der Gesamtcharakter der Leistung erhalten bleibt und die Änderung für Teilnehmende zumutbar ist.
                  </li>
                </ol>
              </div>
            </div>

            {/* 10. Widerrufsrecht */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                10. Widerrufsrecht (Verbraucher:innen)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Verbraucher:innen haben bei Fernabsatzverträgen grundsätzlich ein Widerrufsrecht.
                  </li>
                  <li>
                    Kein Widerrufsrecht besteht insbesondere bei Verträgen zur Erbringung von Dienstleistungen im Zusammenhang mit Freizeitbetätigungen, wenn für die Leistung ein spezifischer Termin/Zeitraum vorgesehen ist (z.B. Veranstaltungstickets).
                  </li>
                  <li>
                    Soweit ausnahmsweise doch ein Widerrufsrecht besteht (z.B. bei bestimmten Mehrfachkarten ohne Terminbezug), gelten die gesetzlichen Regeln.
                  </li>
                </ol>
              </div>
            </div>

            {/* 11. Teilnahmebedingungen, Sicherheit, Minderjährige */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                11. Teilnahmebedingungen, Sicherheit, Minderjährige
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Minderjährige dürfen nur mit Einverständnis der Erziehungsberechtigten teilnehmen.
                  </li>
                  <li>
                    Bei sportlich/artistischen Angeboten gilt: Teilnehmende sind selbst verantwortlich, ihre Sporttauglichkeit/Gesundheit zu prüfen und Risiken realistisch einzuschätzen.
                  </li>
                  <li>
                    Den Anweisungen des Personals/der Kursleitungen ist Folge zu leisten, sofern sie der Sicherheit und dem Ablauf dienen.
                  </li>
                </ol>
              </div>
            </div>

            {/* 12. Hausordnung und Verhalten */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                12. Hausordnung und Verhalten
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Alkohol und Drogen sind untersagt.
                  </li>
                  <li>
                    Rauchen ist im Vorzelt und im Dome strikt verboten.
                  </li>
                  <li>
                    Bei Verstößen gegen Sicherheitsregeln, Hausordnung oder grob störendem Verhalten kann der Veranstalter Personen ohne Erstattung vom weiteren Besuch/der weiteren Teilnahme ausschließen.
                  </li>
                </ol>
              </div>
            </div>

            {/* 13. Haftung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                13. Haftung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Der Veranstalter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, sowie bei Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
                  </li>
                  <li>
                    Bei einfacher Fahrlässigkeit haftet der Veranstalter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und begrenzt auf den vertragstypischen, vorhersehbaren Schaden.
                  </li>
                  <li>
                    Eine weitergehende Haftung ist ausgeschlossen, soweit gesetzlich zulässig.
                  </li>
                  <li>
                    Keine Haftung für Garderobe und mitgebrachte Gegenstände/Wertsachen, soweit gesetzlich zulässig.
                  </li>
                  <li>
                    Es besteht eine Betriebshaftpflichtversicherung.
                  </li>
                </ol>
              </div>
            </div>

            {/* 14. Foto/Video/Audio */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                14. Foto/Video/Audio – Aufnahmen und Veröffentlichung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Der Veranstalter fertigt Foto-/Videoaufnahmen grundsätzlich nur nach vorheriger Nachfrage an. Wer nicht aufgenommen werden möchte, wird nicht abgelichtet.
                  </li>
                  <li>
                    Eine Veröffentlichung (z.B. Website/Social Media) erfolgt nur nach Einwilligung der betroffenen Person(en).
                  </li>
                  <li>
                    Teilnehmende dürfen sich selbst filmen/fotografieren. Dabei ist Rücksicht auf Dritte zu nehmen; Aufnahmen anderer Personen sind nur mit deren Zustimmung erlaubt.
                  </li>
                  <li>
                    Bei Veröffentlichungen eigener Inhalte wird um Verlinkung/Markierung der Social-Media-Kanäle gebeten (freiwillig).
                  </li>
                </ol>
              </div>
            </div>

            {/* 15. Kommunikation */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                15. Kommunikation (E-Mail/SMS)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Der Veranstalter darf Teilnehmende für organisatorische Informationen (z.B. Änderungen, Ausfälle, Hinweise zum Ablauf) per E-Mail und SMS kontaktieren.
                </p>
              </div>
            </div>

            {/* 16. Raummiete */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                16. Raummiete (Pepe Dome)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Umfang, Mietdauer, Nutzungszweck, Übergabezeiten und ggf. zusätzliche Leistungen ergeben sich aus dem jeweiligen Mietangebot/der Buchungsbestätigung.
                  </li>
                  <li>
                    Die Nutzung ist nur im vereinbarten Rahmen erlaubt. Sicherheits- und Lärmschutzvorgaben sind einzuhalten.
                  </li>
                  <li>
                    Der Veranstalter ist berechtigt, bei Verstößen die Nutzung zu beenden, wenn dies zur Gefahrenabwehr, zum Schutz der Anlage oder zur Einhaltung behördlicher Vorgaben erforderlich ist.
                  </li>
                </ol>
              </div>
            </div>

            {/* 17. Hinweise zum Standort und Lärmschutz */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                17. Hinweise zum Standort und Lärmschutz
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Der Pepe Dome befindet sich im Ostpark München. Anreise mit ÖPNV über U-Bahnhof Quiddestraße. Parkplätze u.a. am Michaelibad, anschließend ca. 15 Minuten Fußweg.
                  </li>
                  <li>
                    Es gelten die allgemeinen Lärmpegelstandards der Stadt München. Ab 22:00 Uhr ist die Lautstärke so zu reduzieren, dass Anwohner:innen nicht beeinträchtigt werden.
                  </li>
                </ol>
              </div>
            </div>

            {/* 18. Verbraucherstreitbeilegung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                18. Verbraucherstreitbeilegung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Der Veranstalter ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>

            {/* 19. Schlussbestimmungen */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                19. Schlussbestimmungen
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>Es gilt deutsches Recht.</li>
                  <li>Gerichtsstand ist – soweit gesetzlich zulässig – München.</li>
                  <li>
                    Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                  </li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
