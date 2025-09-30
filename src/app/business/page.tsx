"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function BusinessPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="business" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Pepe Dome für Unternehmen
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Einzigartige Corporate Events, Teambuilding und Shows in spektakulärer Atmosphäre - unvergessliche Erlebnisse für Ihr Team
          </p>
        </div>
      </section>

      {/* Corporate Events */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Firmenevents */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20 hover:border-blue-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Corporate Events</h2>
              <p className="text-white/80 mb-6 text-center">
                Exklusive Firmenfeiern und Veranstaltungen in einzigartiger Dome-Atmosphäre
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">🎪</span>
                  <span>Firmen-Weihnachtsfeiern</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">🏆</span>
                  <span>Jubiläums-Veranstaltungen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">🚀</span>
                  <span>Produktlaunches</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-400">🎯</span>
                  <span>Kundenevents</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 px-6 py-3 rounded-full transition-all">
                  Event anfragen
                </button>
              </div>
            </div>

            {/* Teambuilding */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Teambuilding</h2>
              <p className="text-white/80 mb-6 text-center">
                Innovative Teambuilding-Erfahrungen durch gemeinsame Artistik-Workshops
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎪</span>
                  <span>Artistik-Workshops für Teams</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🤸</span>
                  <span>Gemeinsame Akrobatik-Challenges</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎭</span>
                  <span>Kreative Performance-Projekte</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🏅</span>
                  <span>Team-Olympiade im Dome</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-6 py-3 rounded-full transition-all">
                  Workshop buchen
                </button>
              </div>
            </div>

            {/* PepeShows */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">PepeShows</h2>
              <p className="text-white/80 mb-6 text-center">
                Exklusive Shows für Ihr Unternehmen - maßgeschneiderte Artistik-Darbietungen
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎪</span>
                  <span>Maßgeschneiderte Shows</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎭</span>
                  <span>Professionelle Artist:innen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎵</span>
                  <span>Musik & Artistik kombiniert</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">✨</span>
                  <span>Unvergessliche Erlebnisse</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 px-6 py-3 rounded-full transition-all">
                  Show anfragen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Pepe Dome */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Warum Pepe Dome für Ihr Business?
            </h2>
            <p className="text-xl text-white/80">
              Einzigartige Location mit professionellem Service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Einzigartige Location</h3>
              <p className="text-sm text-white/70">Geodätische Kuppel - ein Ort, den Ihre Gäste nie vergessen</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">200 Personen</h3>
              <p className="text-sm text-white/70">Perfekte Größe für intime Corporate Events</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Barrierefrei</h3>
              <p className="text-sm text-white/70">Zugänglich für alle Ihre Mitarbeiter und Gäste</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Ostpark München</h3>
              <p className="text-sm text-white/70">Zentrale Lage im Grünen mit guter Anbindung</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Unsere Corporate Services
            </h2>
            <p className="text-xl text-white/80">
              Rundum-Service für Ihre Firmenveranstaltung
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Management */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Event Management
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Komplette Eventplanung und -durchführung</div>
                <div>• Catering-Koordination mit lokalen Partnern</div>
                <div>• Technische Ausstattung (Licht, Ton, Projektion)</div>
                <div>• Sicherheits- und Logistikmanagement</div>
                <div>• Fotografische/filmische Dokumentation</div>
              </div>
            </div>

            {/* Custom Programs */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Maßgeschneiderte Programme
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Teambuilding-Workshops nach Ihren Zielen</div>
                <div>• Shows passend zu Ihrem Unternehmensthema</div>
                <div>• Interaktive Artistik-Erlebnisse für Gäste</div>
                <div>• Workshops für Führungskräfte-Entwicklung</div>
                <div>• Kreativitäts- und Innovationsworkshops</div>
              </div>
            </div>

            {/* Facilities */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                Ausstattung & Infrastruktur
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Professionelle Artistik-Ausstattung</div>
                <div>• Flexible Bestuhlung für bis zu 200 Personen</div>
                <div>• Moderne Audio-Video-Technik</div>
                <div>• Klimatisierung und Beleuchtung</div>
                <div>• Garderobe und Sanitäranlagen</div>
              </div>
            </div>

            {/* Packages */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📦</span>
                Event-Pakete
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Basic: Location + Basis-Ausstattung</div>
                <div>• Premium: + Show oder Workshop</div>
                <div>• Deluxe: + Catering und Betreuung</div>
                <div>• Bespoke: Vollständig maßgeschneidert</div>
                <div>• Multi-Day: Mehrtägige Programme</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PepeShows Integration */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                PepeShows für Ihr Unternehmen
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Als Teil der PepeShows-Familie bietet der Pepe Dome Zugang zu einem Netzwerk
                professioneller Artist:innen und jahrelanger Erfahrung in der Entertainment-Branche.
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎭</span>
                  <span>Internationale Artist:innen aus unserem Netzwerk</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🏆</span>
                  <span>Über 10 Jahre Erfahrung im Entertainment</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎪</span>
                  <span>Maßgeschneiderte Shows für jeden Anlass</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">⭐</span>
                  <span>Referenzen von Großunternehmen bis Startups</span>
                </li>
              </ul>
              <div>
                <button className="btn-primary px-8 py-4 mr-4">
                  PepeShows anfragen
                </button>
                <a
                  href="https://pepeshows.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors underline"
                >
                  pepeshows.de besuchen
                </a>
              </div>
            </div>
            <div className="aspect-[5/4] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30 overflow-hidden">
              <Image
                src="/Header Pepe 5:4.jpg"
                alt="PepeShows Performance im Dome"
                width={500}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Ihr Event im Pepe Dome
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Lassen Sie uns gemeinsam ein unvergessliches Erlebnis für Ihr Team schaffen
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-xl px-12 py-6">
              Unverbindlich anfragen
            </button>
            <Link
              href="/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Persönliche Beratung
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}