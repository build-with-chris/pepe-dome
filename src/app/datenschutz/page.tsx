/**
 * Datenschutzerklärung (Privacy Policy) Page
 * Privacy policy according to GDPR
 */

import HeroSection from '@/components/custom/HeroSection'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Datenschutzerklärung"
        subtitle="Informationen zur Verarbeitung Ihrer personenbezogenen Daten"
        size="sm"
      />

      {/* Content */}
      <div className="stage-container py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-xl p-8 md:p-12 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                1. Verantwortlicher
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                </p>
                <div className="space-y-2">
                  <p className="text-[var(--pepe-white)] font-medium">Circus Akademie München e.V. (Zirkusakademie München e.V.)</p>
                  <p>Ranhazweg 18, 85521 Ottobrunn, Deutschland</p>
                  <p>
                    E-Mail:{' '}
                    <a
                      href="mailto:info@pepearts.de"
                      className="text-[var(--pepe-gold)] hover:underline"
                    >
                      info@pepearts.de
                    </a>
                  </p>
                </div>
                <p>
                  Einen Datenschutzbeauftragten haben wir nicht bestellt, da keine gesetzliche
                  Pflicht besteht.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                2. Allgemeine Hinweise zur Datenverarbeitung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Wir verarbeiten personenbezogene Daten, wenn du unsere Website nutzt, uns
                  kontaktierst, Tickets/Angebote buchst oder unseren Newsletter abonnierst.
                  Personenbezogene Daten sind z.B. Name, E-Mail-Adresse, Telefonnummer,
                  IP-Adresse.
                </p>
                <p>
                  Rechtsgrundlagen (Auswahl):
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Art. 6 Abs. 1 lit. b DSGVO (Vertrag / vorvertragliche Maßnahmen)</li>
                  <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z.B. Newsletter, Cookies/Tracking)</li>
                  <li>
                    Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, z.B. sichere Bereitstellung
                    der Website)
                  </li>
                  <li>
                    Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung, z.B. Aufbewahrungsfristen)
                  </li>
                </ul>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                3. Hosting (Vercel) und Server-Logfiles
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Unsere Website wird bei Vercel gehostet. Beim Aufruf der Website werden durch den
                  Hosting-Anbieter und/oder durch uns technisch notwendige Daten verarbeitet (sog.
                  Server-Logfiles), z.B.:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>IP-Adresse</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>aufgerufene Seite/URL</li>
                  <li>Referrer-URL</li>
                  <li>Browser/Device/ Betriebssystem</li>
                  <li>Statuscodes / Datenmenge</li>
                </ul>
                <p>
                  Zweck: Auslieferung der Website, Stabilität, Sicherheit, Fehleranalyse.
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem
                  Betrieb).
                </p>
                <p>
                  Dabei kann es zu Datenübermittlungen in Drittstaaten (insb. USA) kommen. Details
                  dazu siehe Abschnitt &quot;Drittlandübermittlung&quot;.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                4. Cookies, Consent-Management
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Wir verwenden Cookies und ähnliche Technologien. Einige sind technisch notwendig,
                  andere dienen Statistik/Marketing (z.B. Google Analytics, Meta Pixel).
                </p>
                <p>
                  Für nicht notwendige Cookies/Tools holen wir deine Einwilligung über ein
                  Cookie-Banner/Consent-Tool ein (Anbieter wird ergänzt).
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), § 25 Abs. 1 TDDDG
                  (Einwilligung für Speicherung/Auslesen von Informationen).
                </p>
                <p>
                  Technisch notwendige Cookies: Art. 6 Abs. 1 lit. f DSGVO und § 25 Abs. 2 TDDDG.
                </p>
                <p>
                  Du kannst deine Einwilligung jederzeit über die Einstellungen im Cookie-Banner
                  widerrufen/ändern.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                5. Google Fonts (Einbindung)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Auf dieser Website werden Google Fonts von Google-Servern geladen (nicht lokal
                  eingebunden). Dabei kann u.a. deine IP-Adresse an Google übermittelt werden.
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) – sofern über das
                  Cookie-Banner gesteuert.
                </p>
                <p>
                  Wenn keine Einwilligung eingeholt wird, muss die Einbindung technisch zwingend
                  erforderlich sein – das ist bei Webfonts in der Regel nicht der Fall.
                </p>
                <p>
                  Hinweis: Wenn ihr die Fonts künftig lokal hostet, wird dieser Abschnitt
                  entsprechend angepasst.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                6. Kontaktaufnahme (Kontaktformular / E-Mail)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Wenn du uns per Formular kontaktierst, verarbeiten wir die von dir eingegebenen
                  Daten:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Telefonnummer</li>
                  <li>Nachricht</li>
                </ul>
                <p>
                  Die Übermittlung erfolgt per E-Mail. Zum Spam-Schutz nutzen wir einen Honeypot.
                </p>
                <p>Zweck: Bearbeitung deiner Anfrage.</p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (vorvertraglich/vertraglich) oder
                  Art. 6 Abs. 1 lit. f DSGVO (allgemeine Anfragen).
                </p>
                <p>
                  Speicherdauer: 6 Monate (danach Löschung, sofern keine gesetzlichen Pflichten
                  entgegenstehen).
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                7. Newsletter (CleverReach)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Für den Newsletter nutzen wir CleverReach. Die Anmeldung erfolgt per
                  Double-Opt-In. Dabei werden u.a. E-Mail-Adresse sowie Anmelde-/Bestätigungszeitpunkte
                  verarbeitet, um die Anmeldung nachweisen zu können.
                </p>
                <p>
                  Außerdem werden Öffnungen und Klicks getrackt (Erfolgsmessung).
                </p>
                <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
                <p>
                  Du kannst den Newsletter jederzeit über den Abmeldelink in jeder Ausgabe
                  abbestellen.
                </p>
                <p>Eine Segmentierung findet nicht statt.</p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                8. Ticketing/Buchung über &quot;rausgegangen&quot;
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Für Ticketkäufe/Buchungen nutzen wir aktuell den Dienstleister rausgegangen. Dabei
                  werden die für die Buchung erforderlichen Daten (z.B. Kontaktdaten, Ticketdaten,
                  ggf. Zahlungsabwicklung über deren Systeme) verarbeitet.
                </p>
                <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
                <p>
                  Speicherdauer: Buchungs- und Rechnungsdaten 10 Jahre (gesetzliche Aufbewahrung).
                </p>
                <p>
                  Wenn ihr später einen eigenen Shop ergänzt, wird die Datenschutzerklärung
                  entsprechend erweitert.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                9. Zahlungsabwicklung
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>Online-Zahlungen (je nach Buchungsweg):</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>PayPal</li>
                  <li>Stripe (ohne Apple Pay/Google Pay)</li>
                </ul>
                <p>
                  Bei einer Zahlung werden die für die Zahlungsabwicklung erforderlichen Daten an
                  den jeweiligen Zahlungsdienstleister übermittelt.
                </p>
                <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
                <p>Vor-Ort-Zahlungen:</p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>EC-Karte über Zettle</li>
                </ul>
                <p>
                  Auch hier werden Zahlungsdaten zur Abwicklung verarbeitet.
                </p>
                <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                10. Google Workspace (Rechnungen/Organisation)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Rechnungen und organisatorische Dokumente werden im Google Workspace gespeichert;
                  für Fotos/Videos wird Google Drive genutzt (siehe auch Abschnitt Fotos/Videos).
                </p>
                <p>
                  Dabei kann es zu Drittlandübermittlungen (USA) kommen.
                </p>
                <p>
                  Rechtsgrundlagen: Art. 6 Abs. 1 lit. b DSGVO (Vertrag), Art. 6 Abs. 1 lit. c
                  DSGVO (Aufbewahrung), Art. 6 Abs. 1 lit. f DSGVO (Organisation).
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                11. Webanalyse: Google Analytics
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Wir nutzen Google Analytics zur statistischen Auswertung der Website-Nutzung (z.B.
                  Seitenaufrufe, Verweildauer, Interaktionen). Dabei werden u.a. Cookies/IDs
                  eingesetzt, die eine Wiedererkennung ermöglichen können.
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner)
                  und § 25 Abs. 1 TDDDG.
                </p>
                <p>
                  Daten können in die USA übertragen werden. Details dazu siehe
                  &quot;Drittlandübermittlung&quot;.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                12. Marketing: Meta Pixel (Facebook/Instagram)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Wir verwenden das Meta Pixel, um die Wirksamkeit von Werbemaßnahmen zu messen und
                  Zielgruppen zu bilden (z.B. Conversion-Tracking, Remarketing).
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner)
                  und § 25 Abs. 1 TDDDG.
                </p>
                <p>
                  Dabei kann eine Datenübermittlung in die USA stattfinden.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 13 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                13. Eingebettete Inhalte: YouTube und Google Maps
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>Auf unserer Website sind Inhalte von Drittanbietern eingebettet:</p>
                <p>
                  <strong>YouTube (Videos):</strong> Beim Laden eingebetteter Videos können Daten
                  (z.B. IP-Adresse, Nutzungsdaten) an YouTube/Google übertragen werden.
                </p>
                <p>
                  <strong>Google Maps:</strong> Bei Nutzung der Karte können Daten an Google
                  übertragen werden.
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), sofern die Einbettung
                  über das Consent-Tool gesteuert wird.
                </p>
                <p>
                  Wenn die Einbettung ohne Einwilligung direkt lädt, kann es bereits beim
                  Seitenaufruf zu Datenübertragungen kommen.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 14 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                14. Social Media Links
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Im Footer verlinken wir auf unsere Social-Media-Profile. Es handelt sich um reine
                Links (keine automatisch ladenden Feeds/Plugins). Beim Laden unserer Website werden
                dadurch nicht automatisch Daten an die Plattformen übertragen – erst beim Anklicken
                des Links.
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 15 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                15. Foto- und Videoaufnahmen bei Veranstaltungen/Workshops
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Bei Veranstaltungen/Workshops werden Fotos/Videos nur erstellt, wenn wir vorher
                  um Einverständnis bitten. Personen, die nicht aufgenommen werden möchten, werden
                  nicht abgelichtet. Für eine Veröffentlichung (Website/Social Media) fragen wir
                  zusätzlich gesondert.
                </p>
                <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</p>
                <p>Speicherung: Google Drive.</p>
                <p>
                  Zugriff: Team sowie der jeweilige Fotograf; Fotografen erhalten Zugriff nur auf
                  den jeweiligen Ordner.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 16 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                16. Admin-Bereich (Artikel/Newsletter)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Es gibt einen internen Admin-Bereich zur Pflege von Artikeln und
                  Newsletter-Inhalten. Dabei werden Zugangsdaten und Nutzungsdaten im Rahmen der
                  Administration verarbeitet.
                </p>
                <p>
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (sicherer Betrieb/Administration)
                  sowie ggf. Art. 6 Abs. 1 lit. b DSGVO (vertragliche/organisatorische
                  Erfordernisse).
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 17 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                17. Drittlandübermittlung (insb. USA)
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Einige eingesetzte Dienstleister können Daten in Drittländer (insbesondere USA)
                  übermitteln oder dort verarbeiten (z.B. Vercel, Google/YouTube/Maps, Google
                  Analytics, Meta, Google Workspace/Drive).
                </p>
                <p>
                  Soweit erforderlich, erfolgen Übermittlungen auf Grundlage geeigneter Garantien
                  (z.B. EU-Standardvertragsklauseln) und ggf. zusätzlicher Schutzmaßnahmen, sofern
                  der Anbieter diese bereitstellt.
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 18 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                18. Speicherdauer
              </h2>
              <ul className="list-disc list-inside ml-4 space-y-2 text-[var(--pepe-t80)]">
                <li>Kontaktanfragen: 6 Monate</li>
                <li>
                  Buchungs- und Rechnungsdaten: 10 Jahre (gesetzliche Aufbewahrung)
                </li>
                <li>
                  Newsletterdaten: bis zum Widerruf der Einwilligung / Abmeldung (Nachweisdaten
                  können länger gespeichert werden, soweit erforderlich)
                </li>
              </ul>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 19 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                19. Deine Rechte
              </h2>
              <div className="text-[var(--pepe-t80)] space-y-4">
                <p>
                  Du hast nach DSGVO insbesondere folgende Rechte:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Auskunft (Art. 15 DSGVO)</li>
                  <li>Berichtigung (Art. 16 DSGVO)</li>
                  <li>Löschung (Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>
                    Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen (Art. 21
                    DSGVO)
                  </li>
                  <li>Widerruf von Einwilligungen jederzeit (Art. 7 Abs. 3 DSGVO)</li>
                </ul>
                <p>
                  Außerdem hast du das Recht, dich bei einer Datenschutzaufsichtsbehörde zu
                  beschweren (Art. 77 DSGVO).
                </p>
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 20 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                20. Datensicherheit
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Wir treffen angemessene technische und organisatorische Maßnahmen, um deine Daten
                zu schützen (z.B. Zugriffsbeschränkungen, Rollen/Rechte).
              </p>
            </section>

            {/* Divider */}
            <div className="border-t border-[var(--pepe-line)] my-8"></div>

            {/* Section 21 */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--pepe-white)] mb-6">
                21. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="text-[var(--pepe-t80)]">
                Wir passen diese Datenschutzerklärung an, wenn sich die Website, eingesetzte
                Dienste oder rechtliche Anforderungen ändern.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
