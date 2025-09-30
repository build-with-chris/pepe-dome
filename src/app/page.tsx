"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getNextEvent } from "@/data/events";

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
              className="relative w-full h-full animate-[fadeInBlur_4s_ease-out_1s_both]"
              style={{
                animation: 'fadeInBlur 4s ease-out 1s both'
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
            Das Zuhause für Artistik & Kultur in München
          </h2>

          <p className="hero-description">
            Einzigartiger Ort für Events, Training und Business - mitten im Ostpark München. Erlebe Artistik hautnah oder nutze den Dome für deine Veranstaltung.
          </p>

          <div className="hero-actions">
            <Link href="/kontakt#kontaktformular" className="btn-primary btn-lg">
              Event anfragen
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
              <span>🎪</span> 5m Kuppelhöhe
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
        <section className={`py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-${nextEvent.color.primary}/5 to-${nextEvent.color.secondary}/5`}>
          <div className="max-w-6xl mx-auto">
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
                <div className="inline-block mb-4">
                  <span className={`px-4 py-2 bg-${nextEvent.color.primary}/20 border border-${nextEvent.color.accent}/30 rounded-full text-${nextEvent.color.accent} font-semibold text-sm`}>
                    {nextEvent.emoji} {nextEvent.dateRange}
                  </span>
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

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="/kontakt#kontaktformular" className="btn-primary px-8 py-4 text-lg font-semibold">
                    Tickets kaufen
                  </Link>
                  <div className="flex flex-col items-center justify-center text-white/70 text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      📅 {nextEvent.time}
                    </div>
                    <div className="text-center leading-tight">
                      {nextEvent.price}
                    </div>
                  </div>
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
                <div className={`aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-${nextEvent.color.primary}/20 to-${nextEvent.color.secondary}/20 rounded-xl border border-${nextEvent.color.accent}/30 overflow-hidden backdrop-blur-sm shadow-2xl`}>
                  {nextEvent.image ? (
                    <Image
                      src={nextEvent.image}
                      alt={nextEvent.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl">
                      {nextEvent.emoji}
                    </div>
                  )}
                </div>
                <div className="absolute -top-3 -left-3 bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-xs shadow-lg">
                  NÄCHSTES EVENT
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
            <Link href="/kontakt#kontaktformular" className="btn-primary btn-lg">
              Event anfragen
            </Link>
            <a
              href="#contact"
              className="btn-ghost"
            >
              Mehr erfahren
            </a>
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