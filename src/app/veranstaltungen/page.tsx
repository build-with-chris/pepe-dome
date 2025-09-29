"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function VeranstaltungenPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="veranstaltungen" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Events im Pepe Dome
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Von spektakulären Festivals bis zu intimen Artistik-Shows - erlebe Kultur in einzigartiger Atmosphäre
          </p>
        </div>
      </section>

      {/* Freeman Festival Highlight */}
      <section className="py-12 px-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 font-semibold text-sm">
                  🎭 HIGHLIGHT EVENT
                </span>
              </div>
              <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                Freeman
              </h2>
              <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Festival der Artistik
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau.
                5 Shows &bull; 3 Tage &bull; Höchstleistung trifft Poesie
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/freeman"
                  className="btn-primary px-8 py-4 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Zum Festival
                </Link>
                <div className="text-white/70 flex items-center justify-center">
                  📅 14.–16. November 2025
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 overflow-hidden">
                {/* Placeholder for Freeman Festival image */}
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🎪
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-sm">
                Festival der Artistik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event 1: Circus meets Cinema */}
      <section className="py-12 px-6 bg-gradient-to-br from-red-500/10 to-pink-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full text-red-300 font-semibold text-sm">
                  🎬 10.–11. OKTOBER 2024
                </span>
              </div>
              <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                Circus meets Cinema
              </h2>
              <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Artistik & Film in perfekter Symbiose
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Ein einzigartiges Erlebnis: Sängerin, Artisten und Kinofilm verschmelzen zu einem unvergesslichen Abend.
                Professionelle Kinoausstattung mit Sound, Projektor und bequemen Sitzen. Popcorn und Getränke vor Ort erhältlich.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="btn-primary px-8 py-4 text-lg font-semibold">
                  Tickets kaufen
                </button>
                <div className="text-white/70 flex items-center justify-center">
                  📅 Jeweils 18:00 Uhr &bull; Ermäßigt 12€ &bull; Normal 18€
                </div>
              </div>
              <p className="text-white/60 italic">
                Ein wahnsinniges Programm, um alle Menschen abzuholen!
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl border border-red-400/30 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🎬
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-red-400 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Artistik & Kino
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event 2: Luftakrobatik mit Marlon */}
      <section className="py-12 px-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🤸‍♂️
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-400 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Luftakrobatik
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 font-semibold text-sm">
                  🤸‍♂️ 7.–9. NOVEMBER 2024
                </span>
              </div>
              <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                Luftakrobatik mit Marlon
              </h2>
              <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Workshop &bull; Open Stage &bull; Show
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Drei Tage voller Luftakrobatik! Marlon öffnet seine Bühne für seine Schüler, bietet intensive Workshops
                und präsentiert eine spektakuläre Show. Ein Event für alle, die die Kunst des Fliegens erleben möchten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button className="btn-primary px-8 py-4 text-lg font-semibold">
                  Anmelden
                </button>
                <div className="text-white/70 flex items-center justify-center">
                  📅 Workshop & Show &bull; Verschiedene Zeiten
                </div>
              </div>
              <p className="text-white/60 italic">
                Schwebe zwischen Himmel und Erde - erlebe die Magie der Luftakrobatik!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event 3: Freeman Festival */}
      <section className="py-12 px-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 font-semibold text-sm">
                  🎭 14.–16. NOVEMBER 2025
                </span>
              </div>
              <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                Freeman
              </h2>
              <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Festival der Artistik
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau.
                5 Shows &bull; 3 Tage &bull; Höchstleistung trifft Poesie in der einzigartigen Atmosphäre des Pepe Dome.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link
                  href="/freeman"
                  className="btn-primary px-8 py-4 text-lg font-semibold inline-flex items-center justify-center"
                >
                  Zum Festival
                </Link>
                <div className="text-white/70 flex items-center justify-center">
                  📅 3 Tage &bull; 5 Shows &bull; Weltklasse-Niveau
                </div>
              </div>
              <p className="text-white/60 italic">
                Erlebe Artistik auf höchstem internationalen Niveau!
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🎪
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-purple-400 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Festival der Artistik
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Vielfältiges Programm
            </h2>
            <p className="text-xl text-white/80">
              Der Pepe Dome bietet Raum für verschiedenste kulturelle Erlebnisse
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Festivals</h3>
              <p className="text-sm text-white/70">Mehrtägige Artistik-Festivals mit internationalen Acts</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎪</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Gastspiele</h3>
              <p className="text-sm text-white/70">Einzelne Shows von touring Artists und Kompanien</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Konzerte</h3>
              <p className="text-sm text-white/70">Musikalische Darbietungen in einzigartiger Akustik</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Kulturevents</h3>
              <p className="text-sm text-white/70">Lesungen, Ausstellungen und interdisziplinäre Kunst</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Newsletter & Updates
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Verpasse keine Events - erhalte alle Neuigkeiten direkt
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-xl px-12 py-6">
              Newsletter abonnieren
            </button>
            <Link
              href="/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Kontakt aufnehmen
            </Link>
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
            Ostpark München &bull; Ein Projekt von PepeShows
          </p>
        </div>
      </footer>
    </div>
  );
}