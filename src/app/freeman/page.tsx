"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function FreemanPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="freeman" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 font-semibold text-xs sm:text-sm">
              14.–16. November in München
            </span>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
            Freeman – Festival der Artistik
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-white/90 font-semibold px-2">
            5 Shows • 3 Tage • Höchstleistung trifft Poesie
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto px-2">
            Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau – live, nahbar und mitten in München.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <button className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-xs">
              Tickets ab 12€ sichern
            </button>
            <a
              href="https://freeman-festival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors underline text-sm sm:text-base"
            >
              🌐 Vollständige Festival-Website
            </a>
          </div>

          {/* Features */}
          <div className="inline-block mb-6 sm:mb-8 px-4 sm:px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-full max-w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <span>♿</span> Barrierefrei
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span>👨‍👩‍👧‍👦</span> Geeignet für Kinder
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span>⏱️</span> ca. 75 Minuten
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Festival Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Was ist Freeman?
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Freeman ist mehr als ein Festival – es ist eine Feier der artistischen Freiheit.
                Internationale Spitzen-Artist:innen aus Skandinavien und dem Baltikum zeigen,
                was möglich ist, wenn Höchstleistung auf Poesie trifft.
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎭</span>
                  <span>Zeitgenössische Artistik auf Weltklasse-Niveau</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🌍</span>
                  <span>Internationale Acts aus Europa</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🏛️</span>
                  <span>Einzigartige Atmosphäre im Pepe Dome</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Nur 200 Plätze - intime und nahbare Shows</span>
                </li>
              </ul>
            </div>
            <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 overflow-hidden">
              {/* Placeholder for artist image */}
              <div className="w-full h-full flex items-center justify-center text-6xl">
                🤸
              </div>
            </div>
          </div>

          {/* Artists Preview */}
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Die Artist:innen
            </h2>
            <p className="text-xl text-white/80">
              Lernen Sie die internationalen Spitzen-Performer kennen
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">The Nordic Council</h3>
              <p className="text-purple-300 mb-4">Finnland, Island & Schweden</p>
              <p className="text-white/70 mb-4">
                Zeitgenössische Zirkuskunst: Jonglage, Akrobatik und Live-Musik verschmelzen
                in einem kraftvollen, poetischen Circus-Erlebnis.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;Häppy Hour&rdquo; - Geeignet für alle Altersgruppen
              </div>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">Art for Rainy Days</h3>
              <p className="text-purple-300 mb-4">Lettland • Gewinner Latvian Dance Awards 2023/2024</p>
              <p className="text-white/70 mb-4">
                Contemporary Circus & Dance Collective: Ihre Performance verbindet Elemente
                aus Tanz, Zirkus und zeitgenössischer Bewegung.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;How a Spiral Works&rdquo; - Preisgekrönte Performance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display text-3xl md:text-4xl font-bold mb-8">
            5 Shows an 3 Tagen
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {[
              { day: "Fr", time: "20:00", title: "Insomnia", artist: "Jakob Jakobsson" },
              { day: "Sa", time: "17:00", title: "Häppy Hour", artist: "Nordic Council" },
              { day: "Sa", time: "19:00", title: "How a Spiral Works", artist: "Art for Rainy Days" },
              { day: "So", time: "15:00", title: "Häppy Hour (Matinee)", artist: "Nordic Council" },
              { day: "So", time: "17:00", title: "How a Spiral Works (Finale)", artist: "Art for Rainy Days" }
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-black/30 border border-white/10 text-center hover:border-purple-400/30 hover:bg-black/40 transition-all"
              >
                <div className="font-bold text-white">{item.day}</div>
                <div className="text-sm muted">{item.time}</div>
                <div className="text-xs mt-1 text-white/60">{item.title}</div>
              </div>
            ))}
          </div>
          <a
            href="https://freeman-festival.de/programm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:border-white/50 transition-colors"
          >
            <span>Vollständiges Programm</span>
            <span>→</span>
          </a>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Tickets sichern
          </h2>
          <p className="text-xl mb-8 text-white/90">
            ⚠️ Nur 200 Plätze pro Show – freie Platzwahl
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-xl bg-white/5 border-white/30 shadow-white/10 shadow-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">12 €</div>
                <div className="font-semibold mb-2">🚀 Early Bird</div>
                <div className="text-sm text-white/70">bis 15.10. • SPARE 10€</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">18 €</div>
                <div className="font-semibold mb-2">Standard</div>
                <div className="text-sm text-white/70">online verfügbar</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">22 €</div>
                <div className="font-semibold mb-2">Abendkasse</div>
                <div className="text-sm text-white/70">falls verfügbar</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-xl px-12 py-6">
              Jetzt Tickets sichern
            </button>
            <a
              href="https://freeman-festival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Zur Festival-Website
            </a>
          </div>
        </div>
      </section>

      {/* Back to Events */}
      <section className="py-12 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/veranstaltungen"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:border-white/50 transition-colors"
          >
            <span>←</span>
            <span>Zurück zu allen Events</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="display text-xl font-bold mb-4">
            Freeman 2025 • Pepe Dome
          </div>
          <p className="muted text-sm">
            Ein Festival der Artistik • 14.–16. November • Ostpark München
          </p>
        </div>
      </footer>
    </div>
  );
}