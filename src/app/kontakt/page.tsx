import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt - Pepe Dome München | Event anfragen & Informationen | Ostpark",
  description: "Kontaktieren Sie uns für Events, Training oder Fragen zum Pepe Dome. Standort: Ostpark München, barrierefrei, 200 Plätze. Jetzt Event anfragen oder Newsletter abonnieren!",
  keywords: ["Kontakt Pepe Dome", "Event anfragen", "Ostpark München", "Adresse", "Telefon", "Email", "Newsletter", "Anfrage", "Information"],
};

export default function KontaktPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="kontakt" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Kontakt
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Haben Sie Fragen, möchten ein Event buchen oder Teil unserer Community werden? Wir freuen uns auf Ihre Nachricht!
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Events & Shows */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Events & Shows</h2>
              <p className="text-white/80 mb-6 text-center">
                Firmenevents, private Feiern oder PepeShows buchen
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Corporate Events</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎉</span>
                  <span>Private Veranstaltungen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">⭐</span>
                  <span>PepeShows anfragen</span>
                </li>
              </ul>
              <div className="space-y-3">
                <a href="https://pepeshows.de/anfragen" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border border-purple-400/50 px-6 py-3 rounded-full transition-all w-full block text-center font-semibold">
                  🤖 Booking Assistent (empfohlen)
                </a>
                <div className="flex gap-2">
                  <a href="#kontaktformular-events" className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 px-4 py-2 rounded-full transition-all flex-1 block text-center text-sm">
                    📝 Formular
                  </a>
                  <a href="tel:015904891419" className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 px-4 py-2 rounded-full transition-all flex-1 block text-center text-sm">
                    📞 Anrufen
                  </a>
                </div>
              </div>
            </div>

            {/* Training & Kurse */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤸</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Training & Kurse</h2>
              <p className="text-white/80 mb-6 text-center">
                Informationen zu Trainings, Workshops und Kursen
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎪</span>
                  <span>Profi-Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🌱</span>
                  <span>Open Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎓</span>
                  <span>Workshops & Kurse</span>
                </li>
              </ul>
              <div className="text-center">
                <Link href="/training#kontaktformular" className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-6 py-3 rounded-full transition-all w-full block">
                  Training anfragen
                </Link>
              </div>
            </div>

            {/* Allgemeine Fragen */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Allgemeine Fragen</h2>
              <p className="text-white/80 mb-6 text-center">
                Informationen über den Pepe Dome, Partner:innenschaften oder Presse
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">ℹ️</span>
                  <span>Allgemeine Infos</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🤝</span>
                  <span>Partner:innenschaften</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">📰</span>
                  <span>Presse & Medien</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#kontaktformular" className="btn-secondary px-6 py-3 w-full block text-center">
                  Dome anfragen
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="kontaktformular" className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Nachricht senden
            </h2>
            <p className="text-xl text-white/80">
              Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen
            </p>
          </div>

          <form className="space-y-6" action="mailto:info@pepearts.de" method="post" encType="text/plain">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name-general" className="block text-sm font-medium text-white/90 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name-general"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <label htmlFor="email-general" className="block text-sm font-medium text-white/90 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email-general"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone-general" className="block text-sm font-medium text-white/90 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone-general"
                  name="phone"
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="+49 123 456789"
                />
              </div>
              <div>
                <label htmlFor="subject-general" className="block text-sm font-medium text-white/90 mb-2">
                  Betreff *
                </label>
                <select
                  id="subject-general"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="partnership">Partner:innenschaft</option>
                  <option value="press">Presse & Medien</option>
                  <option value="general">Allgemeine Frage</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message-general" className="block text-sm font-medium text-white/90 mb-2">
                Nachricht *
              </label>
              <textarea
                id="message-general"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                placeholder="Beschreiben Sie Ihr Anliegen..."
              ></textarea>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-general"
                name="privacy"
                required
                className="mt-1 w-4 h-4 text-yellow-400 bg-black/20 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
              />
              <label htmlFor="privacy-general" className="text-sm text-white/70">
                Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                <Link href="/datenschutz" className="text-white hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                zu. *
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4"
              >
                Dome anfragen
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Events Specific Contact Form */}
      <section id="kontaktformular-events" className="py-20 px-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Event & Show anfragen
            </h2>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-bold">Unser Booking Assistent ist da!</h3>
              </div>
              <p className="text-white/90 mb-4">
                Für Events und Shows empfehlen wir unseren intelligenten Booking Assistenten -
                er hilft Ihnen schnell und unkompliziert bei der Planung.
              </p>
              <a href="https://pepeshows.de/anfragen" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-3 inline-block">
                🚀 Zum Booking Assistenten
              </a>
            </div>
            <p className="text-lg text-white/70">
              Alternativ können Sie auch das klassische Formular nutzen oder uns direkt anrufen:
              <a href="tel:015904891419" className="text-purple-400 hover:text-purple-300 font-semibold ml-1">
                015904891419
              </a>
            </p>
          </div>

          <form className="space-y-6" action="mailto:info@pepearts.de" method="post" encType="text/plain">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name-events" className="block text-sm font-medium text-white/90 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name-events"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="Ihr vollständiger Name"
                />
              </div>
              <div>
                <label htmlFor="email-events" className="block text-sm font-medium text-white/90 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email-events"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="ihre.email@beispiel.de"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone-events" className="block text-sm font-medium text-white/90 mb-2">
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone-events"
                  name="phone"
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="+49 123 456789"
                />
              </div>
              <div>
                <label htmlFor="subject-events" className="block text-sm font-medium text-white/90 mb-2">
                  Art der Veranstaltung *
                </label>
                <select
                  id="subject-events"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="private">Private Veranstaltung</option>
                  <option value="pepeshows">PepeShows anfragen</option>
                  <option value="other">Sonstiges</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message-events" className="block text-sm font-medium text-white/90 mb-2">
                Nachricht *
              </label>
              <textarea
                id="message-events"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                placeholder="Beschreiben Sie Ihr Event: Datum, Personenzahl, Art der Veranstaltung, besondere Wünsche..."
              ></textarea>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-events"
                name="privacy"
                required
                className="mt-1 w-4 h-4 text-yellow-400 bg-black/20 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
              />
              <label htmlFor="privacy-events" className="text-sm text-white/70">
                Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
                <Link href="/datenschutz" className="text-white hover:underline">
                  Datenschutzerklärung
                </Link>{" "}
                zu. *
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4"
              >
                Event anfragen
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Info & Location */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-8">
                Direkter Kontakt
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">E-Mail</h3>
                    <p className="text-white/70">
                      <a href="mailto:info@pepearts.de" className="hover:text-white transition-colors">
                        info@pepearts.de
                      </a>
                    </p>
                    <p className="text-sm text-white/60 mt-1">Antwort innerhalb von 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Telefon</h3>
                    <p className="text-white/70">
                      <a href="tel:+491796990707" className="hover:text-white transition-colors">
                        +49 179 699 0707
                      </a>
                    </p>
                    <p className="text-sm text-white/60 mt-1">12-21 Uhr unter der Woche</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Social Media</h3>
                    <div className="space-y-1">
                      <p className="text-white/70">
                        <a href="https://instagram.com/pepe_arts" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                          @pepe_arts (Instagram)
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 p-6 rounded-xl bg-red-500/10 border border-red-400/20">
                <h3 className="display text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">🚨</span>
                  Notfall während Events
                </h3>
                <p className="text-white/70 mb-2">
                  Bei Notfällen während Veranstaltungen:
                </p>
                <p className="text-white font-mono">
                  <a href="tel:+4915904891419" className="hover:text-white transition-colors">
                    +49 159 048 914 19
                  </a>
                </p>
                <p className="text-sm text-white/60 mt-1">24/7 erreichbar während Events</p>
              </div>
            </div>

            {/* Location & Directions */}
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-8">
                Standort & Anfahrt
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Adresse</h3>
                    <p className="text-white/70">
                      Pepe Dome<br />
                      Ostpark<br />
                      81925 München
                    </p>
                    <p className="text-sm text-white/60 mt-2">
                      <a
                        href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors underline"
                      >
                        🗺️ In Google Maps öffnen
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚇</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">ÖPNV</h3>
                    <div className="text-white/70 space-y-1">
                      <p>• U-Bahn bis Quiddestraße</p>
                      <p>• Eingang über Albert-Schweitzer-Straße</p>
                    </div>
                    <p className="text-sm text-white/60 mt-2">Kurzer Fußweg zum Pepe Dome</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Parken</h3>
                    <div className="text-white/70 space-y-1">
                      <p>• Michaeligarten + 15 Minuten Fußweg</p>
                      <p>• Parkplätze meist verfügbar</p>
                    </div>
                    <p className="text-sm text-white/60 mt-2">Bei Events: Früh anreisen empfohlen</p>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mt-8 p-6 rounded-xl bg-black/20 border border-white/10">
                <h3 className="display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🕐</span>
                  Öffnungszeiten
                </h3>
                <div className="space-y-2 text-white/70">
                  <div className="flex justify-between">
                    <span>Unter der Woche:</span>
                    <span>12:00-21:00 Uhr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Wochenende:</span>
                    <Link href="/veranstaltungen" className="text-yellow-400 hover:text-yellow-300 transition-colors underline">
                      siehe Events
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-white/60 mt-3">
                  Am Wochenende richten sich die Öffnungszeiten nach den Events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Häufige Fragen
            </h2>
            <p className="text-xl text-white/80">
              Die wichtigsten Antworten auf einen Blick
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Kann ich den Pepe Dome besichtigen?
              </h3>
              <p className="text-white/70">
                Ja! Gerne zeigen wir Ihnen unsere Location. Vereinbaren Sie einfach einen Termin
                mit uns über das Kontaktformular oder telefonisch.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Wie weit im Voraus muss ich Events buchen?
              </h3>
              <p className="text-white/70">
                Für Corporate Events empfehlen wir mindestens 4-6 Wochen Vorlauf.
                Private Veranstaltungen können oft kurzfristiger organisiert werden.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Ist der Pepe Dome barrierefrei?
              </h3>
              <p className="text-white/70">
                Ja, der Pepe Dome ist vollständig barrierefrei zugänglich. Wir haben
                entsprechende Sanitäranlagen und können auf besondere Bedürfnisse eingehen.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Welche Catering-Optionen gibt es?
              </h3>
              <p className="text-white/70">
                Wir arbeiten mit ausgewählten lokalen Catering-Partner:innen zusammen und können
                verschiedene Optionen von Fingerfood bis Menü anbieten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Newsletter abonnieren
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Bleiben Sie informiert über neue Events, Training-Angebote und News aus dem Pepe Dome
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Ihre E-Mail Adresse"
                className="flex-1 px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
              />
              <a href="mailto:info@pepearts.de?subject=Newsletter Anmeldung&body=Hallo, ich möchte den Pepe Dome Newsletter abonnieren." className="btn-primary px-6 py-3 whitespace-nowrap block text-center">
                Anmelden
              </a>
            </div>
            <p className="text-sm text-white/60 mt-3">
              Abmeldung jederzeit möglich. Kein Spam, versprochen!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}