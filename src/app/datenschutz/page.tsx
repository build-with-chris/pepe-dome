/**
 * Datenschutz Page
 */

import HeroSection from '@/components/custom/HeroSection'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-[var(--pepe-black)]">
      {/* Hero Section */}
      <HeroSection
        title="Datenschutz"
        subtitle="Informationen zum Umgang mit Ihren personenbezogenen Daten"
        size="sm"
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="stage-container">
          <div className="max-w-4xl mx-auto space-y-12">
            
            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                1. Datenschutz auf einen Blick
              </h2>
              
              <div className="space-y-8 text-[var(--pepe-t80)] leading-relaxed">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Allgemeine Hinweise</h3>
                  <p>
                    Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3">Datenerfassung auf dieser Website</h3>
                  <div className="space-y-4">
                    <p>
                      <strong className="text-[var(--pepe-gold)]">Wer ist verantwortlich?</strong><br />
                      Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                    </p>
                    <p>
                      <strong className="text-[var(--pepe-gold)]">Wie erfassen wir Ihre Daten?</strong><br />
                      Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                2. Hosting
              </h2>
              <div className="text-[var(--pepe-t80)] leading-relaxed">
                <p className="mb-6">Wir hosten die Inhalte unserer Website bei folgendem Anbieter:</p>
                <h3 className="text-lg font-semibold text-[var(--pepe-white)] mb-3 text-[var(--pepe-gold)] uppercase tracking-widest text-sm">Externes Hosting</h3>
                <p>
                  Diese Website wird bei einem externen Dienstleister gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Der Einsatz des Hosters erfolgt zum Zwecke der Vertragserfüllung und im Interesse einer sicheren, schnellen und effizienten Bereitstellung unseres Online-Angebots.
                </p>
              </div>
            </div>

            <div className="bg-[var(--pepe-ink)] border border-[var(--pepe-line)] rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--pepe-white)] mb-8">
                3. Ihre Rechte
              </h2>
              <div className="space-y-6 text-[var(--pepe-t80)] leading-relaxed">
                <p>Sie haben jederzeit das Recht:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.</li>
                  <li>Die Berichtigung oder Löschung dieser Daten zu verlangen.</li>
                  <li>Die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</li>
                  <li>Widerspruch gegen die Verarbeitung einzulegen.</li>
                  <li>Datenübertragbarkeit zu verlangen.</li>
                </ul>
                <p className="mt-8 pt-6 border-t border-[var(--pepe-line)]">
                  Bei Fragen hierzu oder zum Thema Datenschutz können Sie sich jederzeit an uns wenden. Es steht Ihnen außerdem ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
