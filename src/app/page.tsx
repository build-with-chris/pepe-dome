"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="display text-xl font-bold group relative"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-red-300 transition-all duration-300 drop-shadow-lg relative z-10">
                🏛️ Pepe Dome
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="#about" className="hover:text-white transition-colors text-white/70">
                Über uns
              </Link>
              <Link href="#venue" className="hover:text-white transition-colors text-white/70">
                Der Dome
              </Link>
              <Link href="#events" className="hover:text-white transition-colors text-white/70">
                Events
              </Link>
              <Link href="#contact" className="hover:text-white transition-colors text-white/70">
                Kontakt
              </Link>
              <button className="btn-primary px-4 py-2 text-sm">
                Event anfragen
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white/90 font-semibold text-xs sm:text-sm">
              Seit August 2025 im Ostpark
            </span>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
            Pepe Dome
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-white/90 font-semibold px-2">
            Ein Ort, den München so noch nicht kennt
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto px-2">
            Geodätische Kuppel mitten im Grünen - der perfekte Raum für Artistik, Events und kulturelle Begegnungen in einzigartiger Atmosphäre.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <button className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-xs">
              Event anfragen
            </button>
            <a
              href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors underline text-sm sm:text-base"
            >
              📍 Ostpark München
            </a>
          </div>

          {/* Features */}
          <div className="inline-block mb-6 sm:mb-8 px-4 sm:px-6 py-3 bg-blue-500/20 border border-blue-400/30 rounded-full max-w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <span>🏛️</span> 200 Plätze
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span>🎪</span> 5m Kuppelhöhe
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                <span>♿</span> Barrierefrei
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Was macht den Pepe Dome besonders?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="text-center p-6 sm:p-8 rounded-xl bg-black/20 border border-white/10 hover:border-yellow-400/30 hover:bg-black/30 transition-all">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🏛️</span>
              </div>
              <h3 className="display text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Geodätische Architektur</h3>
              <p className="muted text-sm sm:text-base">Eine intime, aber großzügige Atmosphäre durch einzigartige Kuppelkonstruktion</p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-xl bg-black/20 border border-white/10 hover:border-blue-400/30 hover:bg-black/30 transition-all">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🎪</span>
              </div>
              <h3 className="display text-lg sm:text-xl font-semibold mb-2 sm:mb-3">5 Meter Kuppelhöhe</h3>
              <p className="muted text-sm sm:text-base">Perfekt für spektakuläre Luftakrobatik und beeindruckende Performances</p>
            </div>

            <div className="text-center p-6 sm:p-8 rounded-xl bg-black/20 border border-white/10 hover:border-green-400/30 hover:bg-black/30 transition-all sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-xl sm:text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Mitten im Grünen</h3>
              <p className="muted text-sm sm:text-base">Eingebettet in den Ostpark - Natur und Kultur in perfekter Harmonie</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-black/0 to-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Bereit für Ihr Event?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Entdecken Sie die Möglichkeiten des Pepe Dome für Ihre Veranstaltung
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-xl px-12 py-6 shadow-2xl hover:shadow-yellow-400/20 transition-all">
              Event anfragen
            </button>
            <a
              href="#contact"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Mehr erfahren
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="display text-xl font-bold mb-4">
            Pepe Dome 2025
          </div>
          <p className="muted text-sm">
            Ostpark München • Ein Projekt von PepeShows
          </p>
        </div>
      </footer>
    </div>
  );
}