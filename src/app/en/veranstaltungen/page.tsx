"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events, getEventPrice } from "@/data/events";
import { useState, useEffect, useRef } from "react";

export default function EventsPageEN() {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [visibleMonth, setVisibleMonth] = useState<string>('');
  const monthRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Get unique months and types
  const monthsWithDates = events.map(event => {
    const date = new Date(event.date);
    return {
      display: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
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
  const currentMonth = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  // Filter events based on selected month
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const eventMonth = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    return selectedMonth === 'all' || eventMonth === selectedMonth;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    const monthKey = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

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
            Events & Shows
          </h1>
          <p className="text-xl text-white/80 mb-4 leading-relaxed">
            From spectacular festivals to intimate artistry shows - experience culture in a unique atmosphere<br />
            Every weekend a new event.
          </p>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-3 px-6 text-center">
        <p className="text-lg text-white/90 font-medium italic">
          Clear your calendar: Culture has a date with you.💌
        </p>
      </section>

      {/* Filter Section */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-2xl md:text-3xl font-bold mb-4">
              Filter Events
            </h2>
            <p className="text-white/70 mb-4">
              Quickly find the events that interest you
            </p>

          </div>

          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="max-w-md mx-auto">
              {/* Month Filter */}
              <div className="space-y-3">
                <label htmlFor="month-filter" className="block text-white font-semibold text-center">
                  📅 Filter by Month
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
                  <option value="all">🗓️ Show All Months</option>
                  {months.map(month => (
                    <option
                      key={month}
                      value={month}
                      className={month === currentMonth ? 'current-month-option' : ''}
                    >
                      {month === currentMonth ? `📍 ${month} (Current Month)` : month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status & Reset */}
              <div className="text-center mt-4">
                <div className="text-sm text-white/70 mb-3">
                  {filteredEvents.length === 0
                    ? "No events found"
                    : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`
                  }
                </div>

                {selectedMonth !== 'all' && (
                  <button
                    onClick={() => setSelectedMonth('all')}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors underline"
                  >
                    🔄 Show All Months
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
                {visibleMonth === currentMonth ? `${visibleMonth} (Current Month)` : visibleMonth}
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
              <div
                key={event.id}
                className={`timeline-item ${event.id === 'freeman-festival' ? 'timeline-featured' : ''}`}
              >
                <div className="timeline-dot"></div>
                <div
                  className="timeline-content cursor-pointer"
                  onClick={() => openEventModal(event.id)}
                >
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
                    <a
                      href={event.externalTicketUrl || (event.ticketDates ? event.ticketDates[0].ticketUrl : "/en/kontakt#kontaktformular")}
                      target={event.externalTicketUrl || (event.ticketDates && event.ticketDates[0].ticketUrl !== "/en/kontakt#kontaktformular") ? "_blank" : undefined}
                      rel={event.externalTicketUrl || (event.ticketDates && event.ticketDates[0].ticketUrl !== "/en/kontakt#kontaktformular") ? "noopener noreferrer" : undefined}
                      className="text-xs text-white/60 hover:text-white underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🎫 Tickets
                    </a>
                    <div className="text-xs text-white/50">
                      Click for details ➤
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* No Events Found */
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="display text-2xl md:text-3xl font-bold mb-4">
              No Events Found
            </h3>
            <p className="text-lg text-white/80 mb-6">
              No events were found for the selected filters.
            </p>
            <button
              onClick={() => {
                setSelectedMonth('all');
              }}
              className="btn-primary px-8 py-4 text-lg font-semibold"
            >
              Show All Events
            </button>
          </div>
        )}
      </section>

      {/* Event Types */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Diverse Program
            </h2>
            <p className="text-xl text-white/80">
              Pepe Dome offers space for various cultural experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Festivals</h3>
              <p className="text-sm text-white/70">Multi-day artistry festivals with international acts</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎪</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Guest Shows</h3>
              <p className="text-sm text-white/70">Individual shows from touring artists and companies</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Concerts</h3>
              <p className="text-sm text-white/70">Musical performances in unique acoustics</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Cultural Events</h3>
              <p className="text-sm text-white/70">Readings, exhibitions and interdisciplinary art</p>
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
            Don&apos;t miss any events - get all news directly
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/en/kontakt#newsletter" className="btn-primary text-xl px-12 py-6">
              Subscribe to Newsletter
            </Link>
            <Link
              href="/en/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

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
              aria-label="Close modal"
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
                      🎪 PREMIUM EVENT
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
                      {isDescriptionExpanded ? '👆 Show Less' : '👇 Read More'}
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
                      📱 +{selectedEventData.features.length - 2} more highlights on desktop
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
                      Choose your shows or save with combo tickets!
                    </div>
                  </div>

                  {/* Combo Tickets Section */}
                  {selectedEventData.combiTickets && (
                    <div className="freeman-combi-section">
                      <div className="freeman-combi-title">
                        💫 Combo Tickets - Save Money & Experience More!
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
                              Get Now! 🎉
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Individual Shows Section */}
                  <div className="freeman-shows-section">
                    <div className="freeman-shows-title">
                      🎭 Individual Shows - Choose Your Favorite
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
                              case 'workshop': return 'Register Now 📝';
                              case 'talk': return 'More Info 💭';
                              case 'party': return 'Free Entry 🎉';
                              default: return 'Buy Tickets 🎫';
                            }
                          };

                          return (
                            <div key={showIndex} className={`freeman-show ${getShowTypeClass(show.type)}`}>
                              <div className="freeman-show-header">
                                <div className="freeman-show-time">🕐 {show.time}</div>
                                <div className="freeman-show-price">{getEventPrice(show.price)}</div>
                              </div>
                              <div className="freeman-show-title">{getShowIcon(show.type)} {show.title}</div>
                              <div className="freeman-show-description">{show.description}</div>
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
                  <h3 className="text-lg font-semibold text-white/90 mb-3">Tickets for both dates:</h3>
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
                        Buy Tickets
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single Event Layout */
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <a
                    href={selectedEventData.externalTicketUrl || "/en/kontakt#kontaktformular"}
                    target={selectedEventData.externalTicketUrl ? "_blank" : undefined}
                    rel={selectedEventData.externalTicketUrl ? "noopener noreferrer" : undefined}
                    className="btn-primary px-8 py-4 text-lg font-semibold"
                  >
                    Buy Tickets
                  </a>
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
                          In Memory of Kristallnacht
                        </h4>
                      </div>
                      <p className="text-white/80 text-sm">
                        This performance takes place in remembrance of Kristallnacht on November 9, 1938.
                      </p>
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
                        Supported by the Kuszner Foundation
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