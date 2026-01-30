/**
 * Datenschutz Page
 */

import HeroSection from '@/components/custom/HeroSection'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Datenschutzerklärung"
        subtitle="Informationen zum Umgang mit Ihren personenbezogenen Daten"
        size="sm"
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* 1. Verantwortlicher */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                1. Verantwortlicher
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                </p>
                <div className="bg-[var(--pepe-black)]/50 border border-[var(--pepe-line)] rounded-lg p-6">
                  <p className="text-[var(--pepe-white)] font-semibold mb-2">Circus Akademie München e.V. (Zirkusakademie München e.V.)</p>
                  <p>Ranhazweg 18, 85521 Ottobrunn, Deutschland</p>
                  <p>E-Mail: <a href="mailto:info@paperarts.de" className="text-[var(--pepe-gold)] hover:underline">info@paperarts.de</a></p>
                </div>
                <p>
                  Einen Datenschutzbeauftragten haben wir nicht bestellt, da keine gesetzliche Pflicht besteht.
                </p>
              </div>
            </div>

            {/* 2. Allgemeine Hinweise zur Datenverarbeitung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                2. Allgemeine Hinweise zur Datenverarbeitung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir verarbeiten personenbezogene Daten, wenn du unsere Website nutzt, uns kontaktierst, Tickets/Angebote buchst oder unseren Newsletter abonnierst. Personenbezogene Daten sind z.B. Name, E-Mail-Adresse, Telefonnummer, IP-Adresse.
                </p>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Rechtsgrundlagen (Auswahl):</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Art. 6 Abs. 1 lit. b DSGVO (Vertrag / vorvertragliche Maßnahmen)</li>
                    <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z.B. Newsletter, Cookies/Tracking)</li>
                    <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse, z.B. sichere Bereitstellung der Website)</li>
                    <li>Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung, z.B. Aufbewahrungsfristen)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Hosting (Vercel) und Server-Logfiles */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                3. Hosting (Vercel) und Server-Logfiles
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Unsere Website wird bei Vercel gehostet. Beim Aufruf der Website werden durch den Hosting-Anbieter und/oder durch uns technisch notwendige Daten verarbeitet (sog. Server-Logfiles), z.B.:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP-Adresse</li>
                  <li>Datum und Uhrzeit des Zugriffs</li>
                  <li>aufgerufene Seite/URL</li>
                  <li>Referrer-URL</li>
                  <li>Browser/Device/ Betriebssystem</li>
                  <li>Statuscodes / Datenmenge</li>
                </ul>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Zweck:</strong> Auslieferung der Website, Stabilität, Sicherheit, Fehleranalyse.<br />
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an sicherem Betrieb).
                </p>
                <p>
                  Dabei kann es zu Datenübermittlungen in Drittstaaten (insb. USA) kommen. Details dazu siehe Abschnitt „Drittlandübermittlung".
                </p>
              </div>
            </div>

            {/* 4. Cookies, Consent-Management */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                4. Cookies, Consent-Management
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir verwenden Cookies und ähnliche Technologien. Einige sind technisch notwendig, andere dienen Statistik/Marketing (z.B. Google Analytics, Meta Pixel).
                </p>
                <p>
                  Für nicht notwendige Cookies/Tools holen wir deine Einwilligung über ein Cookie-Banner/Consent-Tool ein (Anbieter wird ergänzt).<br />
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), § 25 Abs. 1 TDDDG (Einwilligung für Speicherung/Auslesen von Informationen).<br />
                  Technisch notwendige Cookies: Art. 6 Abs. 1 lit. f DSGVO und § 25 Abs. 2 TDDDG.
                </p>
                <p>
                  Du kannst deine Einwilligung jederzeit über die Einstellungen im Cookie-Banner widerrufen/ändern.
                </p>
              </div>
            </div>

            {/* 5. Google Fonts */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                5. Google Fonts (Einbindung)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Auf dieser Website werden Google Fonts von Google-Servern geladen (nicht lokal eingebunden). Dabei kann u.a. deine IP-Adresse an Google übermittelt werden.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) – sofern über das Cookie-Banner gesteuert.<br />
                  Wenn keine Einwilligung eingeholt wird, muss die Einbindung technisch zwingend erforderlich sein – das ist bei Webfonts in der Regel nicht der Fall.
                </p>
                <p className="text-[var(--pepe-t64)] italic">
                  Hinweis: Wenn ihr die Fonts künftig lokal hostet, wird dieser Abschnitt entsprechend angepasst.
                </p>
              </div>
            </div>

            {/* 6. Kontaktaufnahme */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                6. Kontaktaufnahme (Kontaktformular / E-Mail)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wenn du uns per Formular kontaktierst, verarbeiten wir die von dir eingegebenen Daten:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name</li>
                  <li>E-Mail-Adresse</li>
                  <li>Telefonnummer</li>
                  <li>Nachricht</li>
                </ul>
                <p>
                  Die Übermittlung erfolgt per E-Mail. Zum Spam-Schutz nutzen wir einen Honeypot.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Zweck:</strong> Bearbeitung deiner Anfrage.<br />
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (vorvertraglich/vertraglich) oder Art. 6 Abs. 1 lit. f DSGVO (allgemeine Anfragen).<br />
                  <strong className="text-[var(--pepe-gold)]">Speicherdauer:</strong> 6 Monate (danach Löschung, sofern keine gesetzlichen Pflichten entgegenstehen).
                </p>
              </div>
            </div>

            {/* 7. Newsletter (CleverReach) */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                7. Newsletter (CleverReach)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Für den Newsletter nutzen wir CleverReach. Die Anmeldung erfolgt per Double-Opt-In. Dabei werden u.a. E-Mail-Adresse sowie Anmelde-/Bestätigungszeitpunkte verarbeitet, um die Anmeldung nachweisen zu können.
                </p>
                <p>
                  Außerdem werden Öffnungen und Klicks getrackt (Erfolgsmessung).
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).<br />
                  Du kannst den Newsletter jederzeit über den Abmeldelink in jeder Ausgabe abbestellen.<br />
                  Eine Segmentierung findet nicht statt.
                </p>
              </div>
            </div>

            {/* 8. Ticketing/Buchung über "rausgegangen" */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                8. Ticketing/Buchung über „rausgegangen"
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Für Ticketkäufe/Buchungen nutzen wir aktuell den Dienstleister rausgegangen. Dabei werden die für die Buchung erforderlichen Daten (z.B. Kontaktdaten, Ticketdaten, ggf. Zahlungsabwicklung über deren Systeme) verarbeitet.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).<br />
                  <strong className="text-[var(--pepe-gold)]">Speicherdauer:</strong> Buchungs- und Rechnungsdaten 10 Jahre (gesetzliche Aufbewahrung).
                </p>
                <p className="text-[var(--pepe-t64)] italic">
                  Wenn ihr später einen eigenen Shop ergänzt, wird die Datenschutzerklärung entsprechend erweitert.
                </p>
              </div>
            </div>

            {/* 9. Zahlungsabwicklung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                9. Zahlungsabwicklung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Online-Zahlungen (je nach Buchungsweg):</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>PayPal</li>
                    <li>Stripe (ohne Apple Pay/Google Pay)</li>
                  </ul>
                  <p className="mt-3">
                    Bei einer Zahlung werden die für die Zahlungsabwicklung erforderlichen Daten an den jeweiligen Zahlungsdienstleister übermittelt.<br />
                    <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Vor-Ort-Zahlungen:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>EC-Karte über Zettle</li>
                  </ul>
                  <p className="mt-3">
                    Auch hier werden Zahlungsdaten zur Abwicklung verarbeitet.<br />
                    <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO.
                  </p>
                </div>
              </div>
            </div>

            {/* 10. Google Workspace */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                10. Google Workspace (Rechnungen/Organisation)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Rechnungen und organisatorische Dokumente werden im Google Workspace gespeichert; für Fotos/Videos wird Google Drive genutzt (siehe auch Abschnitt Fotos/Videos).
                </p>
                <p>
                  Dabei kann es zu Drittlandübermittlungen (USA) kommen.<br />
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlagen:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertrag), Art. 6 Abs. 1 lit. c DSGVO (Aufbewahrung), Art. 6 Abs. 1 lit. f DSGVO (Organisation).
                </p>
              </div>
            </div>

            {/* 11. Webanalyse: Google Analytics */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                11. Webanalyse: Google Analytics
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir nutzen Google Analytics zur statistischen Auswertung der Website-Nutzung (z.B. Seitenaufrufe, Verweildauer, Interaktionen). Dabei werden u.a. Cookies/IDs eingesetzt, die eine Wiedererkennung ermöglichen können.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner) und § 25 Abs. 1 TDDDG.<br />
                  Daten können in die USA übertragen werden. Details dazu siehe „Drittlandübermittlung".
                </p>
              </div>
            </div>

            {/* 12. Marketing: Meta Pixel */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                12. Marketing: Meta Pixel (Facebook/Instagram)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir verwenden das Meta Pixel, um die Wirksamkeit von Werbemaßnahmen zu messen und Zielgruppen zu bilden (z.B. Conversion-Tracking, Remarketing).
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung über Cookie-Banner) und § 25 Abs. 1 TDDDG.<br />
                  Dabei kann eine Datenübermittlung in die USA stattfinden.
                </p>
              </div>
            </div>

            {/* 13. Eingebettete Inhalte: YouTube und Google Maps */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                13. Eingebettete Inhalte: YouTube und Google Maps
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Auf unserer Website sind Inhalte von Drittanbietern eingebettet:
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[var(--pepe-white)] mb-2">YouTube (Videos):</p>
                    <p>Beim Laden eingebetteter Videos können Daten (z.B. IP-Adresse, Nutzungsdaten) an YouTube/Google übertragen werden.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--pepe-white)] mb-2">Google Maps:</p>
                    <p>Bei Nutzung der Karte können Daten an Google übertragen werden.</p>
                  </div>
                </div>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), sofern die Einbettung über das Consent-Tool gesteuert wird.<br />
                  Wenn die Einbettung ohne Einwilligung direkt lädt, kann es bereits beim Seitenaufruf zu Datenübertragungen kommen.
                </p>
              </div>
            </div>

            {/* 14. Social Media Links */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                14. Social Media Links
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Im Footer verlinken wir auf unsere Social-Media-Profile. Es handelt sich um reine Links (keine automatisch ladenden Feeds/Plugins). Beim Laden unserer Website werden dadurch nicht automatisch Daten an die Plattformen übertragen – erst beim Anklicken des Links.
                </p>
              </div>
            </div>

            {/* 15. Foto- und Videoaufnahmen */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                15. Foto- und Videoaufnahmen bei Veranstaltungen/Workshops
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Bei Veranstaltungen/Workshops werden Fotos/Videos nur erstellt, wenn wir vorher um Einverständnis bitten. Personen, die nicht aufgenommen werden möchten, werden nicht abgelichtet. Für eine Veröffentlichung (Website/Social Media) fragen wir zusätzlich gesondert.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).<br />
                  <strong className="text-[var(--pepe-gold)]">Speicherung:</strong> Google Drive.<br />
                  <strong className="text-[var(--pepe-gold)]">Zugriff:</strong> Team sowie der jeweilige Fotograf; Fotografen erhalten Zugriff nur auf den jeweiligen Ordner.
                </p>
              </div>
            </div>

            {/* 16. Admin-Bereich */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                16. Admin-Bereich (Artikel/Newsletter)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Es gibt einen internen Admin-Bereich zur Pflege von Artikeln und Newsletter-Inhalten. Dabei werden Zugangsdaten und Nutzungsdaten im Rahmen der Administration verarbeitet.
                </p>
                <p>
                  <strong className="text-[var(--pepe-gold)]">Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (sicherer Betrieb/Administration) sowie ggf. Art. 6 Abs. 1 lit. b DSGVO (vertragliche/organisatorische Erfordernisse).
                </p>
              </div>
            </div>

            {/* 17. Drittlandübermittlung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                17. Drittlandübermittlung (insb. USA)
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Einige eingesetzte Dienstleister können Daten in Drittländer (insbesondere USA) übermitteln oder dort verarbeiten (z.B. Vercel, Google/YouTube/Maps, Google Analytics, Meta, Google Workspace/Drive).
                </p>
                <p>
                  Soweit erforderlich, erfolgen Übermittlungen auf Grundlage geeigneter Garantien (z.B. EU-Standardvertragsklauseln) und ggf. zusätzlicher Schutzmaßnahmen, sofern der Anbieter diese bereitstellt.
                </p>
              </div>
            </div>

            {/* 18. Speicherdauer */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                18. Speicherdauer
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong className="text-[var(--pepe-gold)]">Kontaktanfragen:</strong> 6 Monate</li>
                  <li><strong className="text-[var(--pepe-gold)]">Buchungs- und Rechnungsdaten:</strong> 10 Jahre (gesetzliche Aufbewahrung)</li>
                  <li><strong className="text-[var(--pepe-gold)]">Newsletterdaten:</strong> bis zum Widerruf der Einwilligung / Abmeldung (Nachweisdaten können länger gespeichert werden, soweit erforderlich)</li>
                </ul>
              </div>
            </div>

            {/* 19. Deine Rechte */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                19. Deine Rechte
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Du hast nach DSGVO insbesondere folgende Rechte:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Auskunft (Art. 15 DSGVO)</li>
                  <li>Berichtigung (Art. 16 DSGVO)</li>
                  <li>Löschung (Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruch gegen Verarbeitung auf Basis berechtigter Interessen (Art. 21 DSGVO)</li>
                  <li>Widerruf von Einwilligungen jederzeit (Art. 7 Abs. 3 DSGVO)</li>
                </ul>
                <p className="mt-6 pt-6 border-t border-[var(--pepe-line)]">
                  Außerdem hast du das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren (Art. 77 DSGVO).
                </p>
              </div>
            </div>

            {/* 20. Datensicherheit */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                20. Datensicherheit
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir treffen angemessene technische und organisatorische Maßnahmen, um deine Daten zu schützen (z.B. Zugriffsbeschränkungen, Rollen/Rechte).
                </p>
              </div>
            </div>

            {/* 21. Änderungen dieser Datenschutzerklärung */}
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                21. Änderungen dieser Datenschutzerklärung
              </h2>
              
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>
                  Wir passen diese Datenschutzerklärung an, wenn sich die Website, eingesetzte Dienste oder rechtliche Anforderungen ändern.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
