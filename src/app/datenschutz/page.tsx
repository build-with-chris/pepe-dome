"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="datenschutz" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Datenschutzerklärung
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Informationen zum Umgang mit Ihren personenbezogenen Daten
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Einleitung */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">1. Datenschutz auf einen Blick</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Allgemeine Hinweise</h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Datenerfassung auf dieser Website</h3>
                  <p className="font-semibold text-white mb-2">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
                  <p>
                    Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">Wie erfassen wir Ihre Daten?</p>
                  <p>
                    Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">Wofür nutzen wir Ihre Daten?</p>
                  <p>
                    Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                  </p>

                  <p className="font-semibold text-white mb-2 mt-4">Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
                  <p>
                    Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
                  </p>
                </div>
              </div>
            </div>

            {/* Hosting */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">2. Hosting</h2>
              <div className="text-white/80">
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>

                <h3 className="display text-lg font-semibold mb-3 mt-6 text-white">Externes Hosting</h3>
                <p>
                  Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.
                </p>
                <p className="mt-3">
                  Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung gegenüber unseren potenziellen und bestehenden Kund:innen (Art. 6 Abs. 1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots durch einen professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO).
                </p>
              </div>
            </div>

            {/* Datenerfassung */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">3. Allgemeine Hinweise und Pflichtinformationen</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Datenschutz</h3>
                  <p>
                    Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                  </p>
                  <p className="mt-3">
                    Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Hinweis zur verantwortlichen Stelle</h3>
                  <p>
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                  </p>
                  <p className="mt-2 font-mono">
                    PepeShows<br />
                    [Vollständiger Name]<br />
                    [Straße und Hausnummer]<br />
                    [PLZ und Ort]<br />
                    <br />
                    E-Mail: info@pepearts.de
                  </p>
                  <p className="mt-3">
                    Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Speicherdauer</h3>
                  <p>
                    Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keinen anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                  <p>
                    Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                  </p>
                </div>
              </div>
            </div>

            {/* Kontaktformular */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">4. Datenerfassung auf dieser Website</h2>

              <div className="space-y-6 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Kontaktformular</h3>
                  <p>
                    Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                  <p className="mt-3">
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
                  </p>
                  <p className="mt-3">
                    Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
                  </p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-3 text-white">Anfrage per E-Mail, Telefon oder Telefax</h3>
                  <p>
                    Wenn Sie uns per E-Mail, Telefon oder Telefax kontaktieren, wird Ihre Anfrage inklusive aller daraus hervorgehenden personenbezogenen Daten (Name, Anfrage) zum Zwecke der Bearbeitung Ihres Anliegens bei uns gespeichert und verarbeitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
                  </p>
                  <p className="mt-3">
                    Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
                  </p>
                </div>
              </div>
            </div>

            {/* Rechte der betroffenen Person */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h2 className="display text-2xl font-bold mb-6">5. Ihre Rechte</h2>

              <div className="space-y-4 text-white/80">
                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Auskunftsrecht</h3>
                  <p>Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend Art. 15 DSGVO.</p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Recht auf Berichtigung</h3>
                  <p>Sie haben entsprechend Art. 16 DSGVO das Recht, die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu fordern.</p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Recht auf Löschung</h3>
                  <p>Sie haben entsprechend Art. 17 DSGVO das Recht, die Löschung der Sie betreffenden Daten zu fordern, soweit die Verarbeitung nicht zur Ausübung des Rechts auf freie Meinungsäußerung und Information, zur Erfüllung einer rechtlichen Verpflichtung, aus Gründen des öffentlichen Interesses oder zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.</p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Recht auf Einschränkung</h3>
                  <p>Sie haben das Recht, entsprechend Art. 18 DSGVO, die Einschränkung der Verarbeitung der Sie betreffenden Daten zu verlangen, soweit die Richtigkeit der Daten von Ihnen bestritten wird, die Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen.</p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Recht auf Datenübertragbarkeit</h3>
                  <p>Sie haben entsprechend Art. 20 DSGVO das Recht, Sie betreffende Daten, die Sie uns bereitgestellt haben, in einem strukturierten, gängigen und maschinenlesebaren Format zu erhalten oder die Übermittlung an einen anderen Verantwortlichen zu fordern.</p>
                </div>

                <div>
                  <h3 className="display text-lg font-semibold mb-2 text-white">Beschwerderecht</h3>
                  <p>Sie haben entsprechend Art. 77 DSGVO das Recht, sich bei einer Aufsichtsbehörde zu beschweren. In der Regel können Sie sich hierfür an die Aufsichtsbehörde Ihres üblichen Aufenthaltsortes oder Arbeitsplatzes oder unseres Unternehmenssitzes wenden.</p>
                </div>
              </div>
            </div>

            {/* Kontakt */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20">
              <h2 className="display text-2xl font-bold mb-6">Fragen zum Datenschutz?</h2>
              <div className="text-white/80">
                <p className="mb-4">
                  Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte können Sie sich jederzeit an uns wenden:
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-400">📧</span>
                  <a href="mailto:info@pepearts.de" className="text-blue-400 hover:text-blue-300 transition-colors">
                    info@pepearts.de
                  </a>
                </div>
                <p className="text-sm text-white/60">
                  Wir werden Ihre Anfrage schnellstmöglich und innerhalb der gesetzlichen Fristen bearbeiten.
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