import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getNextEvent } from "@/data/events";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pepe Dome München - Zuhause für zeitgenössischen Zirkus & Artistik im Ostpark",
  description: "Das Zuhause für zeitgenössischen Zirkus, Artistik und Kultur in München. Geodätische Kuppel im Ostpark - für Training, Events und Business. Jetzt entdecken!",
  keywords: ["Pepe Dome", "München", "Ostpark", "zeitgenössischer Zirkus", "Artistik", "Events", "geodätische Kuppel", "Luftakrobatik", "Kultur", "Veranstaltungsort"],
};

export default function Home() {
  const nextEvent = getNextEvent();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <section className="hero">
        {/* Large Dome Image with Cinematic Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-[60vw] h-[60vw] max-w-4xl max-h-4xl opacity-25">
            <div
              className="relative w-full h-full animate-[fadeInBlur_1.5s_ease-out_0.3s_both]"
              style={{
                animation: 'fadeInBlur 1.5s ease-out 0.3s both'
              }}
            >
              <Image
                src="/TheDome.png"
                alt="Pepe Dome - Luftaufnahme der geodätischen Kuppel"
                fill
                className="object-contain transition-all duration-1000"
                sizes="(max-width: 1024px) 60vw, 1024px"
                priority
              />
              {/* Brand gradient overlay for seamless integration */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse 80% 60% at 40% 50%,
                      transparent 20%,
                      rgba(22, 22, 22, 0.1) 35%,
                      rgba(212, 165, 116, 0.05) 50%,
                      rgba(22, 22, 22, 0.4) 70%,
                      var(--pepe-ink) 85%
                    ),
                    linear-gradient(120deg,
                      transparent 30%,
                      rgba(212, 165, 116, 0.03) 50%,
                      rgba(22, 22, 22, 0.6) 80%,
                      var(--pepe-ink) 95%
                    )
                  `
                }}
              />
            </div>
          </div>
        </div>
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="badge">
              Seit August 2025 im Ostpark
            </span>
          </div>

          <h1 className="hero-title">
            Pepe Dome
          </h1>

          <h2 className="hero-subtitle">
            Das Zuhause für zeitgenössischen Zirkus, Artistik und Kultur in München
          </h2>

          <p className="hero-description">
            Mitten im Ostpark entsteht ein einzigartiger Ort: für Training, für Events, für Business. Hier erlebst du die Welt des zeitgenössischen Zirkus hautnah – oder nutzt den Dome für deine eigene Veranstaltung.
          </p>

          <div className="hero-actions">
            <Link href="/veranstaltungen" className="btn-primary btn-lg">
              Events & Tickets
            </Link>
            <a
              href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              📍 Ostpark München
            </a>
          </div>

          {/* Features */}
          <div className="hero-features">
            <div className="hero-feature">
              <span>🏛️</span> 200 Plätze
            </div>
            <span className="hero-feature-divider">•</span>
            <div className="hero-feature">
              <span>🎪</span> 8,50m Kuppelhöhe
            </div>
            <span className="hero-feature-divider">•</span>
            <div className="hero-feature">
              <span>♿</span> Barrierefrei
            </div>
          </div>
        </div>
      </section>

      {/* Nächstes Highlight Section */}
      {nextEvent && (
        <section className={`py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-${nextEvent.color.primary}/5 to-${nextEvent.color.secondary}/5 ${nextEvent.id === 'freeman-festival' ? 'relative' : ''}`}>
          {/* Freeman Festival Glow Effect */}
          {nextEvent.id === 'freeman-festival' && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 to-blue-500/15 blur-3xl opacity-50 animate-pulse"></div>
          )}
          <div className={`max-w-6xl mx-auto ${nextEvent.id === 'freeman-festival' ? 'relative z-10' : ''}`}>
            <div className="text-center mb-12">
              <h2 className="display text-3xl md:text-4xl font-bold mb-4">
                Nächstes Highlight
              </h2>
              <p className="text-lg text-white/80">
                Das kommende Event im Pepe Dome
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`px-4 py-2 bg-${nextEvent.color.primary}/20 border border-${nextEvent.color.accent}/30 rounded-full text-${nextEvent.color.accent} font-semibold text-sm`}>
                    {nextEvent.emoji} {nextEvent.dateRange}
                  </span>
                  {nextEvent.id === 'freeman-festival' && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full text-purple-300 font-bold text-sm shadow-lg">
                      ✨ FESTIVAL HIGHLIGHT
                    </span>
                  )}
                </div>

                <h3 className="display text-3xl md:text-4xl font-bold mb-4">
                  {nextEvent.title}
                </h3>

                <h4 className="text-xl md:text-2xl mb-6 text-white/90 font-semibold">
                  {nextEvent.subtitle}
                </h4>

                <p className="text-lg text-white/80 mb-6 leading-relaxed">
                  {nextEvent.description}
                </p>

                <div className="space-y-3 mb-8">
                  {nextEvent.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-white/70">
                      <span className={`text-${nextEvent.color.accent}`}>{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 mb-6">
                  {nextEvent.ticketDates ? (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white/90 mb-3">Tickets für beide Termine:</h4>
                      {nextEvent.ticketDates.map((ticketDate) => (
                        <div key={ticketDate.date} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-semibold text-white">📅 {ticketDate.dateDisplay}</span>
                              <span className="text-sm text-white/70">{nextEvent.time}</span>
                            </div>
                            {ticketDate.film && (
                              <div className="text-white/80 text-sm">🎬 {ticketDate.film}</div>
                            )}
                            <div className="text-white/70 text-sm mt-1">{nextEvent.price}</div>
                          </div>
                          <a
                            href={ticketDate.ticketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary px-6 py-3 text-sm font-semibold whitespace-nowrap"
                          >
                            Tickets kaufen
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <a
                        href={nextEvent.externalTicketUrl || "/kontakt#kontaktformular"}
                        target={nextEvent.externalTicketUrl ? "_blank" : undefined}
                        rel={nextEvent.externalTicketUrl ? "noopener noreferrer" : undefined}
                        className="btn-primary px-8 py-4 text-lg font-semibold"
                      >
                        Tickets kaufen
                      </a>
                      <div className="flex flex-col items-center justify-center text-white/70 text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          📅 {nextEvent.time}
                        </div>
                        <div className="text-center leading-tight">
                          {nextEvent.price}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/veranstaltungen"
                  className={`inline-flex items-center gap-2 text-${nextEvent.color.accent} hover:text-${nextEvent.color.accent}/80 transition-colors`}
                >
                  <span>Alle Events ansehen</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="order-1 md:order-2 relative">
                <div className={`aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-${nextEvent.color.primary}/20 to-${nextEvent.color.secondary}/20 rounded-xl border border-${nextEvent.color.accent}/30 overflow-hidden backdrop-blur-sm ${nextEvent.id === 'freeman-festival' ? 'shadow-purple-500/25 shadow-2xl ring-2 ring-purple-400/30' : 'shadow-2xl'}`}>
                  {nextEvent.image ? (
                    <Image
                      src={nextEvent.image}
                      alt={nextEvent.title}
                      fill
                      className={
                        nextEvent.id === 'wanderzirkus-pepe' || nextEvent.id === 'freeman-festival'
                          ? "object-contain object-bottom"
                          : nextEvent.id === 'morphe'
                          ? "object-cover"
                          : "object-contain"
                      }
                      style={
                        nextEvent.id === 'wanderzirkus-pepe' || nextEvent.id === 'freeman-festival'
                          ? {backgroundColor: '#000'}
                          : undefined
                      }
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      {nextEvent.emoji}
                    </div>
                  )}

                  {/* Freeman Festival Animated Glow Text */}
                  {nextEvent.id === 'freeman-festival' && (
                    <div className="absolute inset-0 pointer-events-none flex items-start justify-center pt-8">
                      <div
                        className="text-white font-bold text-lg whitespace-nowrap px-4"
                        style={{
                          textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00f3ff, 0 0 40px #00f3ff',
                          animation: 'gentleFloat 3s ease-in-out infinite'
                        }}
                      >
                        Festival der Artistik
                      </div>
                    </div>
                  )}
                </div>
                <div className={`absolute -top-6 -left-3 px-3 py-2 rounded-lg font-bold text-xs shadow-lg ${nextEvent.id === 'freeman-festival' ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-black border border-gray-300'}`}>
                  {nextEvent.id === 'freeman-festival' ? '✨ FESTIVAL' : 'NÄCHSTES EVENT'}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main CTAs Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Entdecke die Vielfalt des Pepe Dome
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Von spektakulären Events über professionelles Training bis hin zu einzigartigen Firmenerlebnissen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Events entdecken */}
            <Link
              href="/veranstaltungen"
              className="group text-center p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 hover:border-purple-400/40 hover:bg-gradient-to-br hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="display text-xl font-bold mb-3 group-hover:text-white transition-colors">Events entdecken</h3>
              <p className="muted text-sm group-hover:text-white/90 transition-colors mb-4">
                Freeman Festival, Gastspiele und spektakuläre Shows im einzigartigen Dome-Ambiente
              </p>
              <div className="inline-flex items-center gap-2 text-purple-400 group-hover:text-purple-300 transition-colors">
                <span className="text-sm font-semibold">Zum Programm</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Training & Kurse */}
            <Link
              href="/training"
              className="group text-center p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 hover:bg-gradient-to-br hover:from-green-500/20 hover:to-teal-500/20 transition-all duration-300 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🤸</span>
              </div>
              <h3 className="display text-xl font-bold mb-3 group-hover:text-white transition-colors">Training & Kurse</h3>
              <p className="muted text-sm group-hover:text-white/90 transition-colors mb-4">
                Profi-Training, Open Training und Workshops für alle Level - von Einsteiger:innen bis Artist:innen
              </p>
              <div className="inline-flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm font-semibold">Zu den Kursen</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Für Unternehmen */}
            <Link
              href="/business"
              className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15 transition-all duration-300 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="display text-xl font-bold mb-3 group-hover:text-white transition-colors">Für Unternehmen</h3>
              <p className="muted text-sm group-hover:text-white/90 transition-colors mb-4">
                Firmenevents, Teambuilding und exklusive Shows - den Dome als einzigartige Location nutzen
              </p>
              <div className="inline-flex items-center gap-2 text-orange-400 group-hover:text-orange-300 transition-colors">
                <span className="text-sm font-semibold">Dome anfragen</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
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
            <Link href="/kontakt#kontaktformular" className="btn-primary btn-lg">
              Dome anfragen
            </Link>
            <Link
              href="/ueber"
              className="btn-ghost"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-12 px-6 border-t border-white/10">
        <div className="w-full">
          <div className="text-center mb-8">
            <p className="text-sm text-white/60 mb-6">Mit Unterstützung von</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 opacity-70 hover:opacity-90 transition-opacity">
              <div className="flex items-center">
                <Image
                  src="/KKUK_de_mit_LHM_Logo_kurz_nebeneinander_Unterstuetzung.png"
                  alt="Unterstützung von Landeshauptstadt München und Kreativ München"
                  width={500}
                  height={100}
                  className="h-16 w-auto object-contain invert"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/Förderung Logo.jpg"
                  alt="Städtebauförderung"
                  width={400}
                  height={80}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}