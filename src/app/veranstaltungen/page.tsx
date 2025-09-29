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
                Freeman Festival
              </h2>
              <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                Festival der Artistik
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau.
                5 Shows • 3 Tage • Höchstleistung trifft Poesie
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

      {/* Upcoming Events */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-3xl md:text-4xl font-bold mb-12 text-center">
            Kommende Termine
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Freeman Festival */}
            <Link
              href="/freeman"
              className="group p-6 rounded-xl bg-black/20 border border-white/10 hover:border-purple-400/30 hover:bg-black/30 transition-all block"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎭</span>
                </div>
                <div>
                  <div className="font-semibold text-purple-300 text-sm">14.–16. Nov 2025</div>
                  <div className="text-xs text-white/60">3 Tage Festival</div>
                </div>
              </div>
              <h3 className="display text-xl font-bold mb-2 group-hover:text-white transition-colors">
                Freeman Festival
              </h3>
              <p className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                Festival der Artistik mit internationalen Top-Acts
              </p>
            </Link>

            {/* Placeholder Events */}
            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎪</span>
                </div>
                <div>
                  <div className="font-semibold text-green-300 text-sm">Coming Soon</div>
                  <div className="text-xs text-white/60">Gastspiel</div>
                </div>
              </div>
              <h3 className="display text-xl font-bold mb-2">
                Weitere Events folgen
              </h3>
              <p className="text-sm text-white/70">
                Mehr spektakuläre Shows und Gastspiele in Planung
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎵</span>
                </div>
                <div>
                  <div className="font-semibold text-orange-300 text-sm">In Planung</div>
                  <div className="text-xs text-white/60">Konzert</div>
                </div>
              </div>
              <h3 className="display text-xl font-bold mb-2">
                Musik im Dome
              </h3>
              <p className="text-sm text-white/70">
                Konzerte und musikalische Darbietungen unter der Kuppel
              </p>
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
            Ostpark München • Ein Projekt von PepeShows
          </p>
        </div>
      </footer>
    </div>
  );
}