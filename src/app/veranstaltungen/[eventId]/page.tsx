"use client";
import { useParams, notFound } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { events, getEventById, getEventPrice } from "@/data/events";
import { useState, useEffect } from "react";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const event = getEventById(eventId);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  if (!event) {
    notFound();
  }

  // Update page metadata dynamically
  useEffect(() => {
    if (event) {
      document.title = `${event.title} - Pepe Dome`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', event.description.substring(0, 160));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = event.description.substring(0, 160);
        document.head.appendChild(meta);
      }

      // Update Open Graph tags for social sharing
      const updateMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateMetaTag('og:title', event.title);
      updateMetaTag('og:description', event.subtitle);
      updateMetaTag('og:url', window.location.href);
      if (event.image) {
        updateMetaTag('og:image', `https://www.pepe-dome.de${event.image}`);
      }
      updateMetaTag('og:type', 'event');
      updateMetaTag('og:site_name', 'Pepe Dome');

      // Twitter Card tags
      const updateTwitterTag = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };

      updateTwitterTag('twitter:card', 'summary_large_image');
      updateTwitterTag('twitter:title', event.title);
      updateTwitterTag('twitter:description', event.subtitle);
      if (event.image) {
        updateTwitterTag('twitter:image', `https://www.pepe-dome.de${event.image}`);
      }
    }
  }, [event]);

  // Helper function to truncate text for mobile
  const getTruncatedDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  };

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.subtitle,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link wurde in die Zwischenablage kopiert!');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="veranstaltungen" />

      {/* Back Button */}
      <section className="py-6 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/veranstaltungen"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span>←</span> Zurück zu allen Veranstaltungen
          </Link>
        </div>
      </section>

      {/* Event Detail Section */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={`bg-black/20 backdrop-blur-sm border rounded-2xl overflow-hidden ${
              event.id === 'freeman-festival'
                ? 'border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-blue-500/10'
                : 'border-white/10'
            }`}
          >
            {/* Event Header */}
            <div className="event-modal-header p-6 md:p-8">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  width={200}
                  height={250}
                  className={`event-modal-image ${
                    event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival'
                      ? 'contain' : ''
                  }`}
                  style={{
                    objectFit: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? 'contain' : 'cover',
                    backgroundColor: event.id === 'wanderzirkus-pepe' || event.id === 'freeman-festival' ? '#000' : 'transparent'
                  }}
                />
              ) : (
                <div className="event-modal-image bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-4xl">
                  {event.emoji}
                </div>
              )}

              <div className="event-modal-info">
                <div className="event-modal-date">
                  {event.emoji} {event.dateRange}
                </div>

                <h1 className="event-modal-title">
                  {event.title}
                </h1>

                <p className="event-modal-subtitle">
                  {event.subtitle}
                </p>

                {event.id === 'freeman-festival' && (
                  <div className="event-modal-badges">
                    <span className="event-modal-badge bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 text-purple-300">
                      ✨ FESTIVAL HIGHLIGHT
                    </span>
                    <span className="event-modal-badge bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-400/50 text-amber-300">
                      🎪 PREMIUMEVENT
                    </span>
                  </div>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors text-sm"
                >
                  <span>🔗</span> Event teilen
                </button>
              </div>
            </div>

            {/* Event Content */}
            <div className="event-modal-content p-6 md:p-8">
              {/* Desktop: Full description, Mobile: Truncated */}
              <p className="event-modal-description">
                <span className="hidden md:block">{event.description}</span>
                <span className="md:hidden">
                  {isDescriptionExpanded
                    ? event.description
                    : getTruncatedDescription(event.description)
                  }
                  {event.description.length > 150 && (
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
                  {event.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="event-modal-feature">
                      <span className="event-modal-feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                <div className="md:hidden grid grid-cols-1 gap-3">
                  {event.features.slice(0, 2).map((feature, featureIndex) => (
                    <div key={featureIndex} className="event-modal-feature">
                      <span className="event-modal-feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                  {event.features.length > 2 && (
                    <div className="text-xs text-white/50 italic text-center mt-2">
                      📱 +{event.features.length - 2} weitere Highlights auf Desktop
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Event Actions / Tickets */}
            <div className="event-modal-actions p-6 md:p-8 border-t border-white/10">
              {event.id === 'freeman-festival' && event.freemanShows ? (
                /* Freeman Festival Special Ticket Layout */
                <div className="freeman-tickets">
                  <div className="freeman-tickets-header">
                    <div className="freeman-tickets-title">🎪 Festival Tickets 🎪</div>
                    <div className="freeman-tickets-subtitle">
                      Wähle deine Shows oder spare mit Kombitickets!
                    </div>
                  </div>

                  {/* Kombitickets Section */}
                  {event.combiTickets && (
                    <div className="freeman-combi-section">
                      <div className="freeman-combi-title">
                        💫 Kombitickets - Spare Geld & erlebe mehr!
                      </div>
                      <div className="freeman-combi-grid">
                        {event.combiTickets.map((combi, index) => (
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

                    {event.freemanShows.map((day, dayIndex) => (
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

                          return (
                            <div key={showIndex} className={`freeman-show ${getShowTypeClass(show.type)}`}>
                              <div className="freeman-show-header">
                                <div className="freeman-show-time">🕐 {show.time} Uhr</div>
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
              ) : event.ticketDates ? (
                /* Regular Multi-Date Event Layout */
                <div className="event-modal-tickets">
                  <h3 className="text-lg font-semibold text-white/90 mb-3">Tickets für beide Termine:</h3>
                  {event.ticketDates.map((ticketDate) => (
                    <div key={ticketDate.date} className="event-modal-ticket-item">
                      <div className="event-modal-ticket-info">
                        <div className="event-modal-ticket-date">
                          📅 {ticketDate.dateDisplay} • {event.time}
                        </div>
                        {ticketDate.film && (
                          <div className="event-modal-ticket-details">🎬 {ticketDate.film}</div>
                        )}
                        <div className="event-modal-ticket-details">{getEventPrice(event.price || '')}</div>
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
                  <a
                    href={event.externalTicketUrl || "/kontakt#kontaktformular"}
                    target={event.externalTicketUrl ? "_blank" : undefined}
                    rel={event.externalTicketUrl ? "noopener noreferrer" : undefined}
                    className="btn-primary px-8 py-4 text-lg font-semibold"
                  >
                    Tickets kaufen
                  </a>
                  <div className="text-white/70">
                    <div className="flex items-center gap-2 mb-1 text-sm">
                      📅 {event.time}
                    </div>
                    <div className="text-sm">
                      {getEventPrice(event.price || '')}
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsorship Information */}
              {event.sponsorship && (
                <div className="pt-6 border-t border-white/10 mt-6">
                  {/* Commemoration Notice */}
                  {event.sponsorship.commemoration && (
                    <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">🕯️</span>
                        <h4 className="text-lg font-semibold text-white">
                          {event.sponsorship.commemoration.text}
                        </h4>
                      </div>
                      {event.sponsorship.commemoration.description && (
                        <p className="text-white/80 text-sm">
                          {event.sponsorship.commemoration.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Sponsor Information */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex-shrink-0">
                      <Image
                        src={event.sponsorship.sponsor.logo}
                        alt={event.sponsorship.sponsor.name}
                        width={120}
                        height={60}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-white/90 font-medium">
                        {event.sponsorship.sponsor.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-12 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-3xl md:text-4xl font-bold mb-8 text-center">
            Weitere Veranstaltungen
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {events
              .filter(e => e.id !== event.id && e.status === 'upcoming')
              .slice(0, 4)
              .map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  href={`/veranstaltungen/${relatedEvent.id}`}
                  className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
                >
                  {relatedEvent.image && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={relatedEvent.image}
                        alt={relatedEvent.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="text-sm text-white/60 mb-2">
                    {relatedEvent.emoji} {relatedEvent.dateRange}
                  </div>
                  <h3 className="display text-xl font-bold mb-2 group-hover:text-[#D4A574] transition-colors">
                    {relatedEvent.title}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {relatedEvent.subtitle}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
