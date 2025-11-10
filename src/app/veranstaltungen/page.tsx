"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events, getEventPrice } from "@/data/events";
import { useState, useEffect, useRef } from "react";

export default function VeranstaltungenPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [visibleMonth, setVisibleMonth] = useState<string>('');
  const [expandedTalks, setExpandedTalks] = useState<Set<string>>(new Set());
  const monthRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Get current month for highlighting
  const currentMonth = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });

  // Filter events based on selected month (only upcoming events for timeline)
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });

    return event.status === 'upcoming' && (selectedMonth === 'all' || eventMonth === selectedMonth);
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get past events for highlights section
  const pastEvents = events.filter(event => event.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first

  const openEventModal = (eventId: string) => {
    setSelectedEvent(eventId);
    document.body.style.overflow = 'hidden';
  };

  const closeEventModal = () => {
    setSelectedEvent(null);
    setIsDescriptionExpanded(false);
    document.body.style.overflow = 'unset';
  };

  const selectedEventData = selectedEvent ? events.find(e => e.id === selectedEvent) : null;

  // Helper function to truncate text for mobile
  const getTruncatedDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  };

  // Group events by month for the timeline
  const eventsGroupedByMonth = filteredEvents.reduce((groups, event) => {
    const eventDate = new Date(event.date);
    const monthKey = eventDate.toLocaleDateString('de-DE', { year: 'numeric', month: 'long' });

    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(event);
    return groups;
  }, {} as { [key: string]: typeof events });

  // Intersection Observer for tracking visible month
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleMonth = '';
        let maxVisibilityRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibilityRatio) {
            maxVisibilityRatio = entry.intersectionRatio;
            mostVisibleMonth = entry.target.getAttribute('data-month') || '';
          }
        });

        if (mostVisibleMonth) {
          setVisibleMonth(mostVisibleMonth);
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-20% 0px -20% 0px'
      }
    );

    // Observe all month sections
    Object.values(monthRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [filteredEvents]);


  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="veranstaltungen" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Veranstaltungen
          </h1>
          <p className="text-xl text-white/80 mb-4 leading-relaxed">
            Von spektakulären Festivals bis zu intimen Artistik-Shows - erlebe Kultur in einzigartiger Atmosphäre<br />
            Jedes Wochenende ein neues Event.
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-3 px-6 text-center">
        <p className="text-lg text-white/90 font-medium italic">
          Mach den Kalender frei: Kultur hat ein Date mit dir.💌
        </p>
      </section>

      {/* Filter Section */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-2xl md:text-3xl font-bold mb-4">
              Events filtern
            </h2>
            <p className="text-white/70 mb-4">
              Finde schnell die Veranstaltungen, die dich interessieren
            </p>

          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="max-w-md mx-auto">
              {/* Month Filter */}
              <div className="space-y-3">
                <label htmlFor="month-filter" className="block text-white font-semibold text-center">
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
                    <option
                      key={month}
                      value={month}
                      className={month === currentMonth ? 'current-month-option' : ''}
                    >
                      {month === currentMonth ? `📍 ${month} (Aktueller Monat)` : month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status & Reset */}
              <div className="text-center mt-4">
                <div className="text-sm text-white/70 mb-3">
                  {filteredEvents.length === 0
                    ? "Keine Events gefunden"
                    : `${filteredEvents.length} Event${filteredEvents.length !== 1 ? 's' : ''} gefunden`
                  }
                </div>

                {selectedMonth !== 'all' && (
                  <button
                    onClick={() => setSelectedMonth('all')}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors underline"
                  >
                    🔄 Alle Monate anzeigen
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Month Indicator */}
      {visibleMonth && filteredEvents.length > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 md:top-24">
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md border border-yellow-400/30 rounded-full px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <span className="text-yellow-200 font-medium text-sm md:text-base">
                {visibleMonth === currentMonth ? `${visibleMonth} (Aktueller Monat)` : visibleMonth}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <section className="py-12 px-6">
        {filteredEvents.length > 0 ? (
          <div className="timeline-container">
            <div className="timeline-line"></div>

            {Object.entries(eventsGroupedByMonth).map(([monthKey, monthEvents]) => (
              <div
                key={monthKey}
                ref={(el) => { monthRefs.current[monthKey] = el; }}
                data-month={monthKey}
                className="month-section"
              >
                {/* Month Header */}
                <div className="timeline-month-header">
                  <h3 className="timeline-month-title">
                    {monthKey}
                  </h3>
                </div>

                {monthEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/veranstaltungen/${event.id}`}
                className={`timeline-item ${event.id === 'freeman-festival' ? 'timeline-featured' : ''}`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    {event.image && (
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={80}
                        height={80}
                        className="timeline-image"
                        style={{
                          objectFit: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? 'contain' : 'cover',
                          backgroundColor: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? '#000' : 'transparent'
                        }}
                      />
                    )}
                    {!event.image && (
                      <div className="timeline-image bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-2xl">
                        {event.emoji}
                      </div>
                    )}

                    <div className="timeline-info">
                      <div className="timeline-date">
                        {event.emoji} {event.dateRange}
                      </div>

                      <h3 className="timeline-title">
                        {event.title}
                      </h3>

                      <p className="timeline-subtitle">
                        {event.subtitle}
                      </p>
                    </div>
                  </div>

                  {event.id === 'freeman-festival' && (
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full text-purple-300 font-bold text-xs">
                        ✨ HIGHLIGHT
                      </span>
                      <span className="px-2 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 rounded-full text-amber-300 font-bold text-xs animate-pulse">
                        🎪 PREMIUM
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/60">
                      {event.ticketDates && event.ticketDates.length > 1 ? (
                        <span>🎫 {event.ticketDates.length} Termine verfügbar</span>
                      ) : (
                        <span>🎫 Tickets verfügbar</span>
                      )}
                    </div>
                    <div className="text-xs text-white/50">
                      Mehr erfahren ➤
                    </div>
                  </div>
                </div>
              </Link>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* No Events Found */
          <div className="max-w-4xl mx-auto text-center py-20">
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
              }}
              className="btn-primary px-8 py-4 text-lg font-semibold"
            >
              Alle Events anzeigen
            </button>
          </div>
        )}
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

      {/* Past Events Highlights Section */}
      {pastEvents.length > 0 && (
        <section className="py-20 px-6 bg-black/10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="display text-3xl md:text-4xl font-bold mb-4">
                Vergangene Highlights
              </h2>
              <p className="text-xl text-white/80">
                Blicke zurück auf unsere unvergesslichen Veranstaltungen
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/veranstaltungen/${event.id}`}
                  className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
                >
                  {event.image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{
                          objectFit: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? 'contain' : 'cover',
                          backgroundColor: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? '#000' : 'transparent'
                        }}
                      />
                    </div>
                  )}
                  {!event.image && (
                    <div className="mb-4 h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                      <span className="text-4xl">{event.emoji}</span>
                    </div>
                  )}

                  <div className="text-sm text-white/60 mb-2">
                    {event.emoji} {event.dateRange}
                  </div>

                  <h3 className="display text-xl font-bold mb-2 group-hover:text-[#D4A574] transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-white/80 text-sm mb-4">
                    {event.subtitle}
                  </p>

                  {event.id === 'freeman-festival' && (
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full text-purple-300 font-bold text-xs">
                        ✨ HIGHLIGHT
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-white/50">
                    Mehr erfahren ➤
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Event Modal */}
      {selectedEvent && selectedEventData && (
        <div className="event-modal-overlay" onClick={closeEventModal}>
          <div
            className={`event-modal ${selectedEventData.id === 'freeman-festival' ? 'featured' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal-close"
              onClick={closeEventModal}
              aria-label="Modal schließen"
            >
              ×
            </button>

            <div className="event-modal-header">
              {selectedEventData.image ? (
                <Image
                  src={selectedEventData.image}
                  alt={selectedEventData.title}
                  width={200}
                  height={250}
                  className={`event-modal-image ${
                    selectedEventData.id === 'wanderzirkus-pepe' || selectedEventData.id === 'freeman-festival'
                      ? 'contain' : ''
                  }`}
                  style={{
                    objectFit: selectedEventData.id === 'wanderzirkus-pepe' || selectedEventData.id === 'freeman-festival' ? 'contain' : 'cover',
                    backgroundColor: selectedEventData.id === 'wanderzirkus-pepe' || selectedEventData.id === 'freeman-festival' ? '#000' : 'transparent'
                  }}
                />
              ) : (
                <div className="event-modal-image bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-4xl">
                  {selectedEventData.emoji}
                </div>
              )}

              <div className="event-modal-info">
                <div className="event-modal-date">
                  {selectedEventData.emoji} {selectedEventData.dateRange}
                </div>

                <h2 className="event-modal-title">
                  {selectedEventData.title}
                </h2>

                <p className="event-modal-subtitle">
                  {selectedEventData.subtitle}
                </p>

                {selectedEventData.id === 'freeman-festival' && (
                  <div className="event-modal-badges">
                    <span className="event-modal-badge bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 text-purple-300">
                      ✨ FESTIVAL HIGHLIGHT
                    </span>
                    <span className="event-modal-badge bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 text-amber-300">
                      🎪 PREMIUMEVENT
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="event-modal-content">
              {/* Desktop: Full description, Mobile: Truncated */}
              <p className="event-modal-description">
                <span className="hidden md:block">{selectedEventData.description}</span>
                <span className="md:hidden">
                  {isDescriptionExpanded
                    ? selectedEventData.description
                    : getTruncatedDescription(selectedEventData.description)
                  }
                  {selectedEventData.description.length > 150 && (
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="event-description-toggle"
                    >
                      {isDescriptionExpanded ? '👆 Weniger anzeigen' : '👇 Weiterlesen'}
                    </button>
                  )}
                </span>
              </p>

              <div className="event-modal-features">
                {/* Desktop: All features, Mobile: Max 2 features */}
                <div className="hidden md:grid md:grid-cols-2 md:gap-4">
                  {selectedEventData.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="event-modal-feature">
                      <span className="event-modal-feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="md:hidden grid grid-cols-1 gap-3">
                  {selectedEventData.features.slice(0, 2).map((feature, featureIndex) => (
                    <div key={featureIndex} className="event-modal-feature">
                      <span className="event-modal-feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                  {selectedEventData.features.length > 2 && (
                    <div className="text-xs text-white/50 italic text-center mt-2">
                      📱 +{selectedEventData.features.length - 2} weitere Highlights auf Desktop
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="event-modal-actions">
              {selectedEventData.id === 'freeman-festival' && selectedEventData.freemanShows ? (
                /* Freeman Festival Special Ticket Layout */
                <div className="freeman-tickets">
                  <div className="freeman-tickets-header">
                    <div className="freeman-tickets-title">🎪 Festival Tickets 🎪</div>
                    <div className="freeman-tickets-subtitle">
                      Wähle deine Shows oder spare mit Kombitickets!
                    </div>
                  </div>

                  {/* Kombitickets Section */}
                  {selectedEventData.combiTickets && (
                    <div className="freeman-combi-section">
                      <div className="freeman-combi-title">
                        💫 Kombitickets - Spare Geld & erlebe mehr!
                      </div>
                      <div className="freeman-combi-grid">
                        {selectedEventData.combiTickets.map((combi, index) => (
                          <div key={index} className="freeman-combi-card">
                            <div className="freeman-combi-name">🎫 {combi.name}</div>
                            <div className="freeman-combi-description">{combi.description}</div>
                            <div className="freeman-combi-price">{combi.price}</div>
                            <div className="freeman-combi-savings">💰 {combi.savings}</div>
                            <a
                              href={combi.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary px-6 py-3 font-semibold w-full"
                            >
                              Jetzt sichern! 🎉
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Shows Section */}
                  <div className="freeman-shows-section">
                    <div className="freeman-shows-title">
                      🎭 Einzelne Shows - Wähle deinen Favoriten
                    </div>

                    {selectedEventData.freemanShows.map((day, dayIndex) => (
                      <div key={dayIndex} className="freeman-day">
                        <div className="freeman-day-header">
                          <div className="freeman-day-name">{day.day}</div>
                          <div className="freeman-day-date">{day.dateDisplay}</div>
                        </div>

                        {day.shows.map((show, showIndex) => {
                          const getShowIcon = (type: string | undefined) => {
                            switch (type) {
                              case 'workshop': return '🎨';
                              case 'talk': return '💬';
                              case 'party': return '🎉';
                              default: return '✨';
                            }
                          };

                          const getShowTypeClass = (type: string | undefined) => {
                            switch (type) {
                              case 'workshop': return 'freeman-show-workshop';
                              case 'talk': return 'freeman-show-talk';
                              case 'party': return 'freeman-show-party';
                              default: return 'freeman-show-regular';
                            }
                          };

                          const getButtonText = (type: string | undefined) => {
                            switch (type) {
                              case 'workshop': return 'Jetzt anmelden 📝';
                              case 'talk': return 'Mehr Info 💭';
                              case 'party': return 'Kostenlos 🎉';
                              default: return 'Tickets kaufen 🎫';
                            }
                          };

                          const talkId = `${dayIndex}-${showIndex}`;
                          const isExpanded = expandedTalks.has(talkId);
                          const hasTalkDetails = show.type === 'talk' && show.talkDetails;

                          return (
                            <div key={showIndex} className={`freeman-show ${getShowTypeClass(show.type)}`}>
                              <div className="freeman-show-header">
                                <div className="freeman-show-time">🕐 {show.time} Uhr</div>
                                <div className="freeman-show-price">{getEventPrice(show.price)}</div>
                              </div>
                              <div className="freeman-show-title">{getShowIcon(show.type)} {show.title}</div>
                              <div className="freeman-show-description">
                                {hasTalkDetails ? show.talkDetails!.shortDescription : show.description}
                              </div>
                              
                              {hasTalkDetails && (
                                <div className="mt-4">
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedTalks);
                                      if (isExpanded) {
                                        newExpanded.delete(talkId);
                                      } else {
                                        newExpanded.add(talkId);
                                      }
                                      setExpandedTalks(newExpanded);
                                    }}
                                    className="text-green-400 hover:text-green-300 text-sm font-semibold flex items-center gap-2 transition-colors mb-4"
                                  >
                                    <span>{isExpanded ? '▼' : '▶'}</span>
                                    <span>{isExpanded ? 'Weniger anzeigen' : 'Mehr Details anzeigen'}</span>
                                  </button>
                                  
                                  {isExpanded && (
                                    <div className="mt-4 p-6 bg-black/30 border border-green-400/20 rounded-xl space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                      <div>
                                        <h4 className="text-lg font-bold text-green-300 mb-2">Über den Talk</h4>
                                        <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                          {show.talkDetails!.fullDescription}
                                        </p>
                                      </div>
                                      
                                      {show.talkDetails!.topics && show.talkDetails!.topics.length > 0 && (
                                        <div>
                                          <h4 className="text-lg font-bold text-green-300 mb-3">Themen des Panels</h4>
                                          <ul className="space-y-2">
                                            {show.talkDetails!.topics.map((topic, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-white/80">
                                                <span className="text-green-400 mt-1">•</span>
                                                <span>{topic}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {show.talkDetails!.goal && (
                                        <div>
                                          <h4 className="text-lg font-bold text-green-300 mb-2">Ziel</h4>
                                          <p className="text-white/80">{show.talkDetails!.goal}</p>
                                        </div>
                                      )}
                                      
                                      {show.talkDetails!.participants && show.talkDetails!.participants.length > 0 && (
                                        <div>
                                          <h4 className="text-lg font-bold text-green-300 mb-3">Teilnehmende Gesprächspartner*innen</h4>
                                          <ul className="space-y-2">
                                            {show.talkDetails!.participants.map((participant, idx) => (
                                              <li key={idx} className="text-white/80">
                                                <span className="font-semibold">{participant.name}</span>
                                                <span className="text-white/60"> • {participant.role}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {show.talkDetails!.schedule && show.talkDetails!.schedule.length > 0 && (
                                        <div>
                                          <h4 className="text-lg font-bold text-green-300 mb-3">Ablauf</h4>
                                          <ul className="space-y-2">
                                            {show.talkDetails!.schedule.map((item, idx) => (
                                              <li key={idx} className="text-white/80">
                                                <span className="font-semibold text-green-300">{item.time} Uhr</span>
                                                <span className="ml-2">{item.activity}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {show.talkDetails!.themeTables && show.talkDetails!.themeTables.length > 0 && (
                                        <div>
                                          <h4 className="text-lg font-bold text-green-300 mb-3">Thementische</h4>
                                          <ul className="space-y-2">
                                            {show.talkDetails!.themeTables.map((table, idx) => (
                                              <li key={idx} className="text-white/80">
                                                <span className="font-semibold">{table.title}</span>
                                                <span className="text-white/60"> (mit {table.moderator})</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {show.talkDetails!.series && (
                                        <div className="pt-4 border-t border-green-400/20">
                                          <h4 className="text-lg font-bold text-green-300 mb-2">Veranstaltungsreihe</h4>
                                          <p className="text-white/80 mb-2">{show.talkDetails!.series.name}</p>
                                          <p className="text-white/70 text-sm mb-3">{show.talkDetails!.series.description}</p>
                                          {show.talkDetails!.series.link && (
                                            <a
                                              href={show.talkDetails!.series.link}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-green-400 hover:text-green-300 text-sm font-semibold underline"
                                            >
                                              Mehr Infos: zeitfuerzirkus.de
                                            </a>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              {show.ticketUrl && (
                                <a
                                  href={show.ticketUrl}
                                  target={show.ticketUrl.startsWith('http') ? "_blank" : undefined}
                                  rel={show.ticketUrl.startsWith('http') ? "noopener noreferrer" : undefined}
                                  className={`btn-primary px-6 py-2 font-semibold self-start ${show.type === 'party' ? 'opacity-50 cursor-default' : ''}`}
                                  onClick={show.type === 'party' ? (e) => e.preventDefault() : undefined}
                                >
                                  {getButtonText(show.type)}
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedEventData.ticketDates ? (
                /* Regular Multi-Date Event Layout */
                <div className="event-modal-tickets">
                  <h3 className="text-lg font-semibold text-white/90 mb-3">Tickets für beide Termine:</h3>
                  {selectedEventData.ticketDates.map((ticketDate) => (
                    <div key={ticketDate.date} className="event-modal-ticket-item">
                      <div className="event-modal-ticket-info">
                        <div className="event-modal-ticket-date">
                          📅 {ticketDate.dateDisplay} • {selectedEventData.time}
                        </div>
                        {ticketDate.film && (
                          <div className="event-modal-ticket-details">🎬 {ticketDate.film}</div>
                        )}
                        <div className="event-modal-ticket-details">{getEventPrice(selectedEventData.price || '')}</div>
                      </div>
                      <a
                        href={ticketDate.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary px-6 py-3 font-semibold event-modal-ticket-btn"
                      >
                        Tickets kaufen
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single Event Layout */
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {selectedEventData.price?.toLowerCase().includes('kostenlos') || selectedEventData.price?.toLowerCase().includes('free') ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 rounded-full text-green-300 font-semibold">
                      <span>🎁</span>
                      <span>Kostenlos</span>
                    </div>
                  ) : (
                    <a
                      href={selectedEventData.externalTicketUrl || "/kontakt#kontaktformular"}
                      target={selectedEventData.externalTicketUrl ? "_blank" : undefined}
                      rel={selectedEventData.externalTicketUrl ? "noopener noreferrer" : undefined}
                      className="btn-primary px-8 py-4 text-lg font-semibold"
                    >
                      Tickets kaufen
                    </a>
                  )}
                  <div className="text-white/70">
                    <div className="flex items-center gap-2 mb-1 text-sm">
                      📅 {selectedEventData.time}
                    </div>
                    <div className="text-sm">
                      {getEventPrice(selectedEventData.price || '')}
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsorship Information */}
              {selectedEventData.sponsorship && (
                <div className="pt-6 border-t border-white/10 mt-6">
                  {/* Commemoration Notice */}
                  {selectedEventData.sponsorship.commemoration && (
                    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🕯️</span>
                        <h4 className="text-lg font-semibold text-white">
                          {selectedEventData.sponsorship.commemoration.text}
                        </h4>
                      </div>
                      {selectedEventData.sponsorship.commemoration.description && (
                        <p className="text-white/80 text-sm">
                          {selectedEventData.sponsorship.commemoration.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sponsor Information */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex-shrink-0">
                      <Image
                        src={selectedEventData.sponsorship.sponsor.logo}
                        alt={selectedEventData.sponsorship.sponsor.name}
                        width={120}
                        height={60}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-white/90 font-medium">
                        {selectedEventData.sponsorship.sponsor.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button at Bottom */}
              <div className="text-center pt-4 border-t border-white/10 mt-4">
                <button
                  onClick={closeEventModal}
                  className="event-modal-close-bottom"
                >
                  Close ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}