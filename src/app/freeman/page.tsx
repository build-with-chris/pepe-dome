"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { useState, useEffect, useCallback } from "react";
import { isEarlyBirdActive, getEventById, getEventPrice } from "@/data/events";
import { getLocalizedEvent } from "@/data/eventsTranslations";

export default function FreemanPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const earlyBirdActive = isEarlyBirdActive();
  const [expandedTalks, setExpandedTalks] = useState<Set<string>>(new Set());
  const [expandedShows, setExpandedShows] = useState<Set<string>>(new Set());
  const [expandedWorkshops, setExpandedWorkshops] = useState<Set<string>>(new Set());
  
  const event = getEventById('freeman-festival');
  const localizedEvent = event ? getLocalizedEvent(event, 'de') : null;

  const posters = [
    {
      src: "/PosterFreeMan/Happy hour 2.webp",
      alt: "Freeman Festival - Happy Hour 2",
      title: "Happy Hour 2"
    },
    {
      src: "/PosterFreeMan/Happy Hour.webp",
      alt: "Freeman Festival - Happy Hour",
      title: "Happy Hour"
    },
    {
      src: "/PosterFreeMan/How a spiral works 2.webp",
      alt: "Freeman Festival - How a Spiral Works 2",
      title: "How a Spiral Works 2"
    },
    {
      src: "/PosterFreeMan/How a Spiral Works.webp",
      alt: "Freeman Festival - How a Spiral Works",
      title: "How a Spiral Works"
    },
    {
      src: "/PosterFreeMan/Object manipulation.webp",
      alt: "Freeman Festival - Object Manipulation",
      title: "Object Manipulation"
    },
    {
      src: "/PosterFreeMan/stillness in motion.webp",
      alt: "Freeman Festival - Stillness in Motion",
      title: "Stillness in Motion"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % posters.length);
  }, [posters.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + posters.length) % posters.length);
  };

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="freeman" />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex flex-col items-center gap-3 mb-4 sm:mb-6 w-full px-4">
            <a
              href="https://zeitfuerzirkus.de"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/40 rounded-full text-blue-200 font-bold text-xs sm:text-sm hover:from-blue-500/40 hover:to-purple-500/40 transition-all text-center"
            >
              <span className="sm:hidden">Teil von ZEIT FÜR ZIRKUS 2025 • 14.–16. November in München</span>
              <span className="hidden sm:inline">Teil von ZEIT FÜR ZIRKUS 2025 🎪 • 14.–16. November in München</span>
            </a>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
            Freeman – Festival der Artistik
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-white/90 font-semibold px-2">
            4 Shows • 2 Workshops • 3 Tage • Höchstleistung trifft Poesie
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto px-2">
            Internationale Spitzen-Artist:innen zeigen Akrobatik und Entertainment auf Weltklasse-Niveau – live, nahbar und mitten in München.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <a
              href="https://www.freemanfestival.de/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-xs inline-block text-center"
            >
              Show auswählen
            </a>
          </div>
        </div>
      </section>

      {/* Festival Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Was ist Freeman?
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Freeman ist mehr als ein Festival – es ist eine Feier der artistischen Freiheit.
                Als Teil von <a href="https://zeitfuerzirkus.de" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline font-semibold">ZEIT FÜR ZIRKUS</a>,
                der deutschen Ausgabe des internationalen Festivals LA NUIT DU CIRQUE, zeigen
                Spitzen-Artist:innen aus Skandinavien und dem Baltikum, was möglich ist,
                wenn Höchstleistung auf Poesie trifft.
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎭</span>
                  <span>Zeitgenössische Artistik auf Weltklasse-Niveau</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🌍</span>
                  <span>Internationale Acts aus Europa</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🏛️</span>
                  <span>Einzigartige Atmosphäre im Pepe Dome</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Nur 200 Plätze - intime und nahbare Shows</span>
                </li>
              </ul>
            </div>
            {/* Poster Slider Gallery */}
            <div className="relative w-full flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Container for aspect ratio */}
                <div className="aspect-[3/4] relative">
                  {/* Main Image Display */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30 overflow-hidden shadow-2xl">
                    <Image
                      src={posters[currentSlide].src}
                      alt={posters[currentSlide].alt}
                      fill
                      className="object-cover transition-all duration-500 ease-in-out"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority
                    />

                    {/* Overlay with poster title */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold text-sm">
                        {posters[currentSlide].title}
                      </h3>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 z-10"
                    aria-label="Previous poster"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/20 hover:border-white/40 z-10"
                    aria-label="Next poster"
                  >
                    →
                  </button>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center gap-2 mt-4">
                  {posters.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide
                          ? 'bg-purple-400 w-6'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-purple-400 transition-all duration-100 ease-linear"
                    style={{ width: `${((currentSlide + 1) / posters.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Zeit für Zirkus Context */}
          <div className="mb-16 p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">🎪</span>
              <div>
                <h3 className="display text-2xl font-bold mb-3 text-blue-200">
                  Teil von ZEIT FÜR ZIRKUS 2025
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  ZEIT FÜR ZIRKUS ist die deutsche Ausgabe des international stattfindenden Zirkusfestivals
                  <strong className="text-white"> LA NUIT DU CIRQUE</strong>. Die 5. Edition findet erneut in Kooperation
                  mit dem französischen Netzwerk <em>Territoires du Cirque</em> statt.
                </p>
                <p className="text-white/80 leading-relaxed mb-4">
                  Der <strong className="text-white">Bundesverband Zeitgenössischer Zirkus</strong> erweitert die
                  Jubiläumsausgabe um das Diskursprogramm <strong className="text-green-300">ZEIT ZUM REDEN</strong> und
                  gestaltet Gespräche, Begegnungen und Austausch gemeinsam mit sieben überregionalen Veranstaltungsorten.
                </p>
                <div className="flex flex-wrap gap-3 items-center">
                  <a
                    href="https://zeitfuerzirkus.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/40 rounded-full text-blue-200 hover:bg-blue-500/30 transition-all text-sm font-semibold"
                  >
                    <span>🌐</span>
                    <span>zeitfuerzirkus.de</span>
                  </a>
                  <span className="text-white/60 text-sm">
                    Auf Augenhöhe mit Publikum und Zirkusszene
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Artists Preview */}
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Die Artist:innen
            </h2>
            <p className="text-xl text-white/80">
              Lernen Sie die internationalen Spitzen-Performer kennen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">The Nordic Council</h3>
              <p className="text-purple-300 mb-4">Finnland, Island & Schweden</p>
              <p className="text-white/70 mb-4">
                Zeitgenössische Zirkuskunst mit Comedy: Humor über Alltag & Ambivalenz verschmilzt
                mit spektakulärer Artistik.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;Häppy Hour&rdquo; - Fr. 19:00 & Sa. 18:00
              </div>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">Art for Rainy Days</h3>
              <p className="text-purple-300 mb-4">Lettland • Preisgekrönte Performance</p>
              <p className="text-white/70 mb-4">
                Meditativer, hypnotischer Zirkus mit Tanz, Hair Hanging & Aerial Rope.
                Minimalistische Ästhetik mit neu interpretierter baltischer Volksmusik.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;How a Spiral Works&rdquo; - Sa. 20:30 & So. 18:00
              </div>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10 md:col-span-2 lg:col-span-1">
              <h3 className="display text-xl font-bold mb-2">Workshop Leaders</h3>
              <p className="text-purple-300 mb-4">Internationale Experten</p>
              <p className="text-white/70 mb-4">
                <strong>Merri Heikkilä:</strong> Object Manipulation (Fr. 15:00)<br/>
                <strong>Alise Madara Bokaldere:</strong> Stillness in Motion (So. 13:00)
              </p>
              <div className="text-sm text-white/60">
                Workshops in englischer Sprache • Anmeldung erforderlich
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-3xl md:text-4xl font-bold mb-8 text-center">
            Programm im Detail
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {localizedEvent?.freemanShows?.map((day, dayIndex) => {
              const getShowColorClasses = (type?: string) => {
                switch (type) {
                  case 'workshop': 
                    return {
                      bg: 'bg-orange-500/10',
                      border: 'border-orange-400/30',
                      text: 'text-orange-300',
                      expandText: 'text-orange-400',
                      expandHover: 'hover:text-orange-300',
                      detailBorder: 'border-orange-400/20',
                      detailTitle: 'text-orange-300',
                      bullet: 'text-orange-400'
                    };
                  case 'talk': 
                    return {
                      bg: 'bg-green-500/10',
                      border: 'border-green-400/30',
                      text: 'text-green-300',
                      expandText: 'text-green-400',
                      expandHover: 'hover:text-green-300',
                      detailBorder: 'border-green-400/20',
                      detailTitle: 'text-green-300',
                      bullet: 'text-green-400'
                    };
                  case 'party': 
                    return {
                      bg: 'bg-pink-500/10',
                      border: 'border-pink-400/30',
                      text: 'text-pink-300',
                      expandText: 'text-pink-400',
                      expandHover: 'hover:text-pink-300',
                      detailBorder: 'border-pink-400/20',
                      detailTitle: 'text-pink-300',
                      bullet: 'text-pink-400'
                    };
                  default: 
                    return {
                      bg: 'bg-blue-500/10',
                      border: 'border-blue-400/30',
                      text: 'text-blue-300',
                      expandText: 'text-purple-400',
                      expandHover: 'hover:text-purple-300',
                      detailBorder: 'border-purple-400/20',
                      detailTitle: 'text-purple-300',
                      bullet: 'text-purple-400'
                    };
                }
              };

              return (
                <div key={dayIndex} className="bg-black/30 border border-white/10 rounded-xl p-6">
                  <h3 className="display text-xl font-bold mb-4 text-purple-300">{day.day}, {day.dateDisplay}</h3>
                  <div className="space-y-3">
                    {day.shows.map((show, showIndex) => {
                      const itemId = `${dayIndex}-${showIndex}`;
                      const isTalkExpanded = expandedTalks.has(itemId);
                      const isShowExpanded = expandedShows.has(itemId);
                      const isWorkshopExpanded = expandedWorkshops.has(itemId);
                      const hasTalkDetails = show.type === 'talk' && show.talkDetails;
                      const hasShowDetails = !show.type && show.showDetails;
                      const hasWorkshopDetails = show.type === 'workshop' && show.workshopDetails;
                      const colors = getShowColorClasses(show.type);

                      let displayDescription = show.description;
                      if (hasTalkDetails) displayDescription = show.talkDetails!.shortDescription;
                      else if (hasShowDetails) displayDescription = show.showDetails!.shortDescription;
                      else if (hasWorkshopDetails) displayDescription = show.workshopDetails!.shortDescription;

                      return (
                        <div key={showIndex} className={`p-3 ${colors.bg} ${colors.border} rounded-lg ${show.type === 'workshop' ? 'opacity-90' : ''}`}>
                          <div className={`font-semibold ${colors.text} mb-1`}>{show.time} {show.type === 'talk' ? 'ZEIT ZUM REDEN' : show.type === 'workshop' ? 'Workshop' : show.type === 'party' ? 'Party' : 'Show'}</div>
                          <div className="text-sm text-white font-medium mb-1">{show.title}</div>
                          <div className="text-xs text-white/70 mb-2">{displayDescription}</div>
                          
                          {/* Show Details Pagination */}
                          {hasShowDetails && (
                            <div className="mt-3">
                              <button
                                onClick={() => {
                                  const newExpanded = new Set(expandedShows);
                                  if (isShowExpanded) {
                                    newExpanded.delete(itemId);
                                  } else {
                                    newExpanded.add(itemId);
                                  }
                                  setExpandedShows(newExpanded);
                                }}
                                className={`${colors.expandText} ${colors.expandHover} text-xs font-semibold flex items-center gap-1 transition-colors mb-2`}
                              >
                                <span>{isShowExpanded ? '▼' : '▶'}</span>
                                <span>{isShowExpanded ? 'Weniger' : 'Mehr Details'}</span>
                              </button>
                              
                              {isShowExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-4 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  {show.showDetails!.by && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Von {show.showDetails!.by}</h5>
                </div>
                                  )}
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.showDetails!.fullDescription}
                                  </p>
                                  {show.showDetails!.elements && show.showDetails!.elements.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-2`}>Elemente</h5>
                                      <ul className="space-y-1">
                                        {show.showDetails!.elements.map((element, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-white/80">
                                            <span className={`${colors.bullet} mt-0.5`}>•</span>
                                            <span>{element}</span>
                                          </li>
                                        ))}
                                      </ul>
                </div>
                                  )}
              </div>
                              )}
            </div>
                          )}

                          {/* Workshop Details Pagination */}
                          {hasWorkshopDetails && (
                            <div className="mt-3">
                              <button
                                onClick={() => {
                                  const newExpanded = new Set(expandedWorkshops);
                                  if (isWorkshopExpanded) {
                                    newExpanded.delete(itemId);
                                  } else {
                                    newExpanded.add(itemId);
                                  }
                                  setExpandedWorkshops(newExpanded);
                                }}
                                className={`${colors.expandText} ${colors.expandHover} text-xs font-semibold flex items-center gap-1 transition-colors mb-2`}
                              >
                                <span>{isWorkshopExpanded ? '▼' : '▶'}</span>
                                <span>{isWorkshopExpanded ? 'Weniger' : 'Mehr Details'}</span>
                              </button>
                              
                              {isWorkshopExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  {show.workshopDetails!.by && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Von {show.workshopDetails!.by}</h5>
                                    </div>
                                  )}
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.workshopDetails!.fullDescription}
                                  </p>
                                  {show.workshopDetails!.aboutTeacher && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Über die/den Dozent:in</h5>
                                      <p className="text-white/80">{show.workshopDetails!.aboutTeacher}</p>
                                    </div>
                                  )}
                                  {show.workshopDetails!.idealFor && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Ideal für</h5>
                                      <p className="text-white/80">{show.workshopDetails!.idealFor}</p>
                                    </div>
                                  )}
                                  {show.workshopDetails!.whatToBring && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Mitbringen</h5>
                                      <p className="text-white/80">{show.workshopDetails!.whatToBring}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                  </div>
                          )}

                          {/* Talk Details Pagination */}
                          {hasTalkDetails && (
                            <div className="mt-3">
                              <button
                                onClick={() => {
                                  const newExpanded = new Set(expandedTalks);
                                  if (isTalkExpanded) {
                                    newExpanded.delete(itemId);
                                  } else {
                                    newExpanded.add(itemId);
                                  }
                                  setExpandedTalks(newExpanded);
                                }}
                                className={`${colors.expandText} ${colors.expandHover} text-xs font-semibold flex items-center gap-1 transition-colors mb-2`}
                              >
                                <span>{isTalkExpanded ? '▼' : '▶'}</span>
                                <span>{isTalkExpanded ? 'Weniger' : 'Mehr Details'}</span>
                              </button>
                              
                              {isTalkExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.talkDetails!.fullDescription}
                                  </p>
                                  {show.talkDetails!.topics && show.talkDetails!.topics.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-2`}>Themen</h5>
                                      <ul className="space-y-1">
                                        {show.talkDetails!.topics.map((topic, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-white/80">
                                            <span className={`${colors.bullet} mt-0.5`}>•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                </div>
                                  )}
                                  {show.talkDetails!.participants && show.talkDetails!.participants.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Teilnehmende</h5>
                                      <ul className="space-y-1">
                                        {show.talkDetails!.participants.map((participant, idx) => (
                                          <li key={idx} className="text-white/80 text-xs">
                                            <span className="font-semibold">{participant.name}</span>
                                            <span className="text-white/60"> • {participant.role}</span>
                                          </li>
                                        ))}
                                      </ul>
                </div>
                                  )}
                                  {show.talkDetails!.series && show.talkDetails!.series.link && (
                                    <div className={`pt-2 border-t ${colors.detailBorder}`}>
                                      <a
                                        href={show.talkDetails!.series.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${colors.expandText} ${colors.expandHover} text-xs font-semibold underline`}
                                      >
                                        Mehr Infos: zeitfuerzirkus.de
                                      </a>
                </div>
                                  )}
                </div>
                              )}
              </div>
                          )}
            </div>
                      );
                    })}
                </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-xl mb-6">
              <span className="text-2xl">🎫</span>
              <div className="text-left">
                <div className="font-semibold text-white">Shows: Ermäßigt 12€, Regulär 18€ • Workshops Anmeldung</div>
                <div className="text-sm text-white/70">Kombitickets verfügbar • Nur 200 Plätze pro Show</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Tickets sichern
          </h2>
          <p className="text-xl mb-8 text-white/90">
            ⚠️ Nur 200 Plätze pro Show – freie Platzwahl
          </p>

          <div className={`grid ${earlyBirdActive ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-12`}>
            {earlyBirdActive && (
              <div className="p-6 rounded-xl bg-white/5 border-white/30 shadow-white/10 shadow-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">12 €</div>
                  <div className="font-semibold mb-2">🚀 Early Bird</div>
                  <div className="text-sm text-white/70">bis 15.10. • SPARE 10€</div>
                </div>
              </div>
            )}

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">12 €</div>
                <div className="font-semibold mb-2">Ermäßigt</div>
                <div className="text-sm text-white/70">online verfügbar</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">18 €</div>
                <div className="font-semibold mb-2">Regulär</div>
                <div className="text-sm text-white/70">online verfügbar</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://www.freemanfestival.de/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xl px-12 py-6 inline-block text-center"
            >
              Show auswählen
            </a>
            <a
              href="https://freemanfestival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Zur Festival-Website
            </a>
          </div>
        </div>
      </section>

      {/* Back to Events */}
      <section className="py-12 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/veranstaltungen"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:border-white/50 transition-colors"
          >
            <span>←</span>
            <span>Zurück zu allen Events</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="display text-xl font-bold mb-4">
            Freeman 2025 • Pepe Dome
          </div>
          <p className="muted text-sm">
            Ein Festival der Artistik • 14.–16. November • Ostpark München
          </p>
        </div>
      </footer>
    </div>
  );
}