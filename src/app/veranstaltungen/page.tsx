"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events } from "@/data/events";
import { useState } from "react";

export default function VeranstaltungenPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Get unique months and types
  const monthsWithDates = events.map(event => {
    const date = new Date(event.date);
    return {
      display: date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' }),
      sortKey: new Date(date.getFullYear(), date.getMonth()).getTime()
    };
  });

  const uniqueMonths = new Map();
  monthsWithDates.forEach(month => {
    if (!uniqueMonths.has(month.display)) {
      uniqueMonths.set(month.display, month.sortKey);
    }
  });

  const months = Array.from(uniqueMonths.entries())
    .sort((a, b) => a[1] - b[1])
    .map(entry => entry[0]);

  const types = Array.from(new Set(events.map(event => event.category)));

  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });

    const monthMatch = selectedMonth === 'all' || eventMonth === selectedMonth;
    const typeMatch = selectedType === 'all' || event.category === selectedType;

    return monthMatch && typeMatch;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

      {/* Filter Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-2xl md:text-3xl font-bold mb-4">
              Events filtern
            </h2>
            <p className="text-white/70">
              Finde schnell die Veranstaltungen, die dich interessieren
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">

              {/* Month Filter */}
              <div className="space-y-3">
                <label htmlFor="month-filter" className="block text-white font-semibold">
                  📅 Nach Monat filtern
                </label>
                <select
                  id="month-filter"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-var(--pepe-surface) border border-var(--pepe-line) rounded-xl px-4 py-3 text-white focus:border-var(--pepe-gold) focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--pepe-surface)',
                    borderColor: 'var(--pepe-line)'
                  }}
                >
                  <option value="all">🗓️ Alle Monate anzeigen</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div className="space-y-3">
                <label htmlFor="type-filter" className="block text-white font-semibold">
                  🎭 Nach Typ filtern
                </label>
                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-var(--pepe-surface) border border-var(--pepe-line) rounded-xl px-4 py-3 text-white focus:border-var(--pepe-gold) focus:outline-none transition-colors"
                  style={{
                    backgroundColor: 'var(--pepe-surface)',
                    borderColor: 'var(--pepe-line)'
                  }}
                >
                  <option value="all">🎪 Alle Veranstaltungstypen</option>
                  <option value="cinema">🎬 Cinema</option>
                  <option value="clown">🤡 Clownerie</option>
                  <option value="workshop">🤸 Workshop</option>
                  <option value="festival">🎭 Festival</option>
                </select>
              </div>
            </div>

            {/* Filter Status & Reset */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="text-sm text-white/70">
                {filteredEvents.length === 0
                  ? "Keine Events gefunden"
                  : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? 's' : ''} gefunden`
                }
              </div>

              {(selectedMonth !== 'all' || selectedType !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedMonth('all');
                    setSelectedType('all');
                  }}
                  className="btn-ghost px-6 py-2 text-sm"
                >
                  🔄 Filter zurücksetzen
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* All Events */}
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event, index) => (
        <section key={event.id} className={`py-12 px-6 bg-gradient-to-br from-${event.color.primary}/10 to-${event.color.secondary}/10 ${event.id === 'freeman-festival' ? 'relative' : ''}`}>
          {/* Freeman Festival Glow Effect */}
          {event.id === 'freeman-festival' && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl opacity-60 animate-pulse"></div>
          )}
          <div className={`max-w-6xl mx-auto ${event.id === 'freeman-festival' ? 'relative z-10' : ''}`}>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? 'order-1' : 'order-2 md:order-1'}>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className={`px-4 py-2 bg-${event.color.primary}/20 border border-${event.color.accent}/30 rounded-full text-${event.color.accent} font-semibold text-sm`}>
                    {event.emoji} {event.dateRange}
                  </span>
                  {event.id === 'freeman-festival' && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full text-purple-300 font-bold text-sm shadow-lg">
                      ✨ FESTIVAL HIGHLIGHT
                    </span>
                  )}
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
                <div className="space-y-4 mb-6">
                  {event.ticketDates ? (
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white/90 mb-3">Tickets für beide Termine:</h4>
                      {event.ticketDates.map((ticketDate) => (
                        <div key={ticketDate.date} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 bg-black/20 rounded-lg border border-white/10">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-semibold text-white">📅 {ticketDate.dateDisplay}</span>
                              <span className="text-sm text-white/70">{event.time}</span>
                            </div>
                            {ticketDate.film && (
                              <div className="text-white/80 text-sm">🎬 {ticketDate.film}</div>
                            )}
                            <div className="text-white/70 text-sm mt-1">{event.price}</div>
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
                        href={event.externalTicketUrl || "/kontakt#kontaktformular"}
                        target={event.externalTicketUrl ? "_blank" : undefined}
                        rel={event.externalTicketUrl ? "noopener noreferrer" : undefined}
                        className="btn-primary px-8 py-4 text-lg font-semibold"
                      >
                        Tickets kaufen
                      </a>
                      <div className="flex flex-col items-center justify-center text-white/70 text-sm">
                        <div className="flex items-center gap-1 mb-1">
                          📅 {event.time}
                        </div>
                        <div className="text-center leading-tight">
                          {event.price}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className={`relative ${index % 2 === 0 ? 'order-2' : 'order-1 md:order-2'}`}>
                <div className={`aspect-[3/4] max-w-sm mx-auto bg-gradient-to-br from-${event.color.primary}/20 to-${event.color.secondary}/20 rounded-xl border border-${event.color.accent}/30 overflow-hidden backdrop-blur-sm ${event.id === 'freeman-festival' ? 'shadow-purple-500/25 shadow-2xl ring-2 ring-purple-400/30' : 'shadow-2xl'}`}>
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className={
                        event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival'
                          ? "object-contain object-bottom"
                          : "object-contain"
                      }
                      style={
                        event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival'
                          ? {backgroundColor: '#000'}
                          : undefined
                      }
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {event.emoji}
                    </div>
                  )}

                  {/* Freeman Festival Animated Glow Text */}
                  {event.id === 'freeman-festival' && (
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
              </div>
            </div>
          </div>
        </section>
        ))
      ) : (
        /* No Events Found */
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="display text-2xl md:text-3xl font-bold mb-4">
              Keine Events gefunden
            </h3>
            <p className="text-lg text-white/80 mb-6">
              Für die ausgewählten Filter wurden keine Veranstaltungen gefunden.
            </p>
            <button
              onClick={() => {
                setSelectedMonth('all');
                setSelectedType('all');
              }}
              className="btn-primary px-8 py-4 text-lg font-semibold"
            >
              Alle Events anzeigen
            </button>
          </div>
        </section>
      )}

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