"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="home" />

      {/* Hero Section */}
      <section className="hero">
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
            Das Zuhause für Artistik & Kultur in München
          </h2>

          <p className="hero-description">
            Einzigartiger Ort für Events, Training und Business - mitten im Ostpark München. Erlebe Artistik hautnah oder nutze den Dome für deine Veranstaltung.
          </p>

          <div className="hero-actions">
            <button className="btn-primary btn-lg">
              Event anfragen
            </button>
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
              <span>🎪</span> 5m Kuppelhöhe
            </div>
            <span className="hero-feature-divider">•</span>
            <div className="hero-feature">
              <span>♿</span> Barrierefrei
            </div>
          </div>
        </div>
      </section>

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
                Profi-Training, Open Training und Workshops für alle Level - von Einsteiger bis Artist
              </p>
              <div className="inline-flex items-center gap-2 text-green-400 group-hover:text-green-300 transition-colors">
                <span className="text-sm font-semibold">Zu den Kursen</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>

            {/* Für Unternehmen */}
            <Link
              href="/business"
              className="group text-center p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-300 block"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="display text-xl font-bold mb-3 group-hover:text-white transition-colors">Für Unternehmen</h3>
              <p className="muted text-sm group-hover:text-white/90 transition-colors mb-4">
                Firmenevents, Teambuilding und exklusive Shows - den Dome als einzigartige Location nutzen
              </p>
              <div className="inline-flex items-center gap-2 text-orange-400 group-hover:text-orange-300 transition-colors">
                <span className="text-sm font-semibold">Event anfragen</span>
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
            <button className="btn-primary btn-lg">
              Event anfragen
            </button>
            <a
              href="#contact"
              className="btn-ghost"
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