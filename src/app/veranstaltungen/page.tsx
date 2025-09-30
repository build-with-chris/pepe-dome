import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events } from "@/data/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Veranstaltungen - Pepe Dome München | Freeman Festival & Artistik-Shows",
  description: "Entdecken Sie spektakuläre Events im Pepe Dome: Freeman Festival, Luftakrobatik mit Marlon, Circus meets Cinema. Tickets für einzigartige Artistik-Erlebnisse sichern!",
  keywords: ["Pepe Dome Events", "Freeman Festival", "Artistik München", "Luftakrobatik", "Circus Cinema", "Veranstaltungen Ostpark", "Tickets"],
};

export default function VeranstaltungenPage() {
  const freemanEvent = events.find(event => event.id === 'freeman-festival');

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
      {freemanEvent && (
        <section className={`py-12 px-6 bg-gradient-to-br from-${freemanEvent.color.primary}/10 to-${freemanEvent.color.secondary}/10`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`px-4 py-2 bg-${freemanEvent.color.primary}/20 border border-${freemanEvent.color.accent}/30 rounded-full text-${freemanEvent.color.accent} font-semibold text-sm`}>
                    🎭 HIGHLIGHT EVENT
                  </span>
                  <span className={`px-4 py-2 bg-${freemanEvent.color.primary}/20 border border-${freemanEvent.color.accent}/30 rounded-full text-${freemanEvent.color.accent} font-semibold text-sm`}>
                    📅 {freemanEvent.dateRange}
                  </span>
                </div>
                <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                  {freemanEvent.title}
                </h2>
                <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                  {freemanEvent.subtitle}
                </h3>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  {freemanEvent.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link
                    href="/kontakt#kontaktformular"
                    className="btn-primary px-8 py-4 text-lg font-semibold inline-flex items-center justify-center"
                  >
                    Tickets kaufen
                  </Link>
                  <div className="flex flex-col items-center justify-center text-white/70 text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      📅 {freemanEvent.dateRange}
                    </div>
                    <div className="text-center leading-tight">
                      {freemanEvent.price}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                {/* Freeman Featured Poster */}
                <div className="aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 overflow-hidden backdrop-blur-sm shadow-xl">
                  <Image
                    src="/PosterFreeMan/Happy hour 2.webp"
                    alt="Freeman Festival - Happy Hour Poster"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-yellow-400 text-black px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg">
                  HIGHLIGHT EVENT
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Events */}
      {events.filter(event => event.id !== 'freeman-festival').map((event, index) => (
        <section key={event.id} className={`py-12 px-6 bg-gradient-to-br from-${event.color.primary}/10 to-${event.color.secondary}/10`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? 'order-1' : 'order-2 md:order-1'}>
                <div className="inline-block mb-4">
                  <span className={`px-4 py-2 bg-${event.color.primary}/20 border border-${event.color.accent}/30 rounded-full text-${event.color.accent} font-semibold text-sm`}>
                    {event.emoji} {event.dateRange}
                  </span>
                </div>
                <h2 className="display text-4xl md:text-5xl font-bold mb-6">
                  {event.title}
                </h2>
                <h3 className="text-2xl md:text-3xl mb-4 text-white/90 font-semibold">
                  {event.subtitle}
                </h3>
                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  {event.description}
                </p>
                <div className="space-y-3 mb-6">
                  {event.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 text-white/70">
                      <span className={`text-${event.color.accent}`}>{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="/kontakt#kontaktformular" className="btn-primary px-8 py-4 text-lg font-semibold">
                    {event.id === 'freeman-festival' ? 'Tickets kaufen' : 'Tickets kaufen'}
                  </Link>
                  <div className="flex flex-col items-center justify-center text-white/70 text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      📅 {event.time}
                    </div>
                    <div className="text-center leading-tight">
                      {event.price}
                    </div>
                  </div>
                </div>
              </div>
              <div className={`relative ${index % 2 === 0 ? 'order-2' : 'order-1 md:order-2'}`}>
                <div className={`aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-${event.color.primary}/20 to-${event.color.secondary}/20 rounded-xl border border-${event.color.accent}/30 overflow-hidden backdrop-blur-sm shadow-2xl`}>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {event.emoji}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

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
            <Link href="/kontakt#newsletter" className="btn-primary text-xl px-12 py-6">
              Newsletter abonnieren
            </Link>
            <Link
              href="/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}