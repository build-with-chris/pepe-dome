"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { useState, useEffect, useCallback } from "react";
import { isEarlyBirdActive, getEventById, getEventPrice } from "@/data/events";
import { getLocalizedEvent } from "@/data/eventsTranslations";

export default function FreemanPageEN() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const earlyBirdActive = isEarlyBirdActive();
  const [expandedTalks, setExpandedTalks] = useState<Set<string>>(new Set());
  const [expandedShows, setExpandedShows] = useState<Set<string>>(new Set());
  const [expandedWorkshops, setExpandedWorkshops] = useState<Set<string>>(new Set());
  const [expandedArtistShows, setExpandedArtistShows] = useState<Set<string>>(new Set());
  const [expandedArtistWorkshops, setExpandedArtistWorkshops] = useState<Set<string>>(new Set());
  
  const event = getEventById('freeman-festival');
  const localizedEvent = event ? getLocalizedEvent(event, 'en') : null;

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
              <span className="sm:hidden">Part of TIME FOR CIRCUS 2025 • Nov 14–16 in Munich</span>
              <span className="hidden sm:inline">Part of TIME FOR CIRCUS 2025 🎪 • Nov 14–16 in Munich</span>
            </a>
          </div>

          <h1 className="display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-4 sm:mb-6 tracking-tight px-2">
            Freeman – Festival of Artistry
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 text-white/90 font-semibold px-2">
            4 Shows • 2 Workshops • 3 Days • Excellence meets Poetry
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/80 leading-relaxed max-w-4xl mx-auto px-2">
            International top artists present acrobatics and entertainment at world-class level – live, intimate and in the heart of Munich.
          </p>

          <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4">
            <a
              href="https://www.freemanfestival.de/tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-xs inline-block text-center"
            >
              Select Show
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
                What is Freeman?
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Freeman is more than a festival – it&apos;s a celebration of artistic freedom.
                As part of <a href="https://zeitfuerzirkus.de" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline font-semibold">TIME FOR CIRCUS</a>,
                the German edition of the international festival LA NUIT DU CIRQUE, top artists
                from Scandinavia and the Baltic region showcase what&apos;s possible when
                excellence meets poetry.
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎭</span>
                  <span>Contemporary circus at world-class level</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🌍</span>
                  <span>International acts from Europe</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🏛️</span>
                  <span>Unique atmosphere at Pepe Dome</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Only 200 seats - intimate and personal shows</span>
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

          {/* Time for Circus Context */}
          <div className="mb-16 p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/30">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">🎪</span>
              <div>
                <h3 className="display text-2xl font-bold mb-3 text-blue-200">
                  Part of TIME FOR CIRCUS 2025
                </h3>
                <p className="text-white/80 leading-relaxed mb-4">
                  TIME FOR CIRCUS is the German edition of the internationally held circus festival
                  <strong className="text-white"> LA NUIT DU CIRQUE</strong>. The 5th edition takes place once again in cooperation
                  with the French network <em>Territoires du Cirque</em>.
                </p>
                <p className="text-white/80 leading-relaxed mb-4">
                  The <strong className="text-white">Federal Association of Contemporary Circus</strong> extends the
                  anniversary edition with the discourse program <strong className="text-green-300">TIME TO TALK</strong> and
                  shapes conversations, encounters and exchange together with seven national venues.
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
                    On eye level with audience and circus scene
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Artists Preview */}
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              The Artists
            </h2>
            <p className="text-xl text-white/80">
              Meet the international top performers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* The Nordic Council - Häppy Hour */}
            {(() => {
              const happyHourShow = localizedEvent?.freemanShows?.flatMap(day => day.shows)
                .find(show => show.showDetails && show.showDetails.by === 'The Nordic Council');
              
              if (!happyHourShow?.showDetails) return null;
              
              const showTimes = localizedEvent?.freemanShows
                ?.flatMap((day) => day.shows
                  .filter(s => s.showDetails?.by === 'The Nordic Council')
                  .map(s => ({ day: day.day, time: s.time }))
                )
                .map(({ day, time }) => {
                  const dayMap: Record<string, string> = { 'Freitag': 'Fri.', 'Samstag': 'Sat.', 'Sonntag': 'Sun.' };
                  const dayShort = dayMap[day] || day.slice(0, 2) + '.';
                  return `${dayShort} ${time}`;
                })
                .join(' & ') || 'Fri. 19:00 & Sat. 18:00';
              
              const isExpanded = expandedArtistShows.has('nordic-council');
              
              return (
                <div key="nordic-council" className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">The Nordic Council</h3>
              <p className="text-purple-300 mb-4">Finland, Iceland & Sweden</p>
              <p className="text-white/70 mb-4">
                    {happyHourShow.showDetails.shortDescription}
              </p>
                  <div className="text-sm text-white/60 mb-4">
                    Show: &ldquo;Häppy Hour&rdquo; - {showTimes}
            </div>

                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedArtistShows);
                      if (isExpanded) {
                        newExpanded.delete('nordic-council');
                      } else {
                        newExpanded.add('nordic-council');
                      }
                      setExpandedArtistShows(newExpanded);
                    }}
                    className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors mb-2"
                  >
                    <span>{isExpanded ? '▼' : '▶'}</span>
                    <span>{isExpanded ? 'Less Details' : 'More Details'}</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-black/30 border border-purple-400/20 rounded-lg space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-white/80 whitespace-pre-line leading-relaxed">
                        {happyHourShow.showDetails.fullDescription}
                      </p>
                      {happyHourShow.showDetails.elements && happyHourShow.showDetails.elements.length > 0 && (
                        <div>
                          <h5 className="text-sm font-bold text-purple-300 mb-2">Elements</h5>
                          <ul className="space-y-1">
                            {happyHourShow.showDetails.elements.map((element, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/80">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span>{element}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Art for Rainy Days - How a Spiral Works */}
            {(() => {
              const spiralShow = localizedEvent?.freemanShows?.flatMap(day => day.shows)
                .find(show => show.showDetails && show.showDetails.by === 'Art for Rainy Days');
              
              if (!spiralShow?.showDetails) return null;
              
              const showTimes = localizedEvent?.freemanShows
                ?.flatMap((day) => day.shows
                  .filter(s => s.showDetails?.by === 'Art for Rainy Days')
                  .map(s => ({ day: day.day, time: s.time }))
                )
                .map(({ day, time }) => {
                  const dayMap: Record<string, string> = { 'Freitag': 'Fri.', 'Samstag': 'Sat.', 'Sonntag': 'Sun.' };
                  const dayShort = dayMap[day] || day.slice(0, 2) + '.';
                  return `${dayShort} ${time}`;
                })
                .join(' & ') || 'Sat. 20:30 & Sun. 18:00';
              
              const isExpanded = expandedArtistShows.has('art-for-rainy-days');
              
              return (
                <div key="art-for-rainy-days" className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">Art for Rainy Days</h3>
              <p className="text-purple-300 mb-4">Latvia • Award-winning performance</p>
              <p className="text-white/70 mb-4">
                    {spiralShow.showDetails.shortDescription}
              </p>
                  <div className="text-sm text-white/60 mb-4">
                    Show: &ldquo;How a Spiral Works&rdquo; - {showTimes}
            </div>

                  <button
                    onClick={() => {
                      const newExpanded = new Set(expandedArtistShows);
                      if (isExpanded) {
                        newExpanded.delete('art-for-rainy-days');
                      } else {
                        newExpanded.add('art-for-rainy-days');
                      }
                      setExpandedArtistShows(newExpanded);
                    }}
                    className="text-purple-400 hover:text-purple-300 text-xs font-semibold flex items-center gap-1 transition-colors mb-2"
                  >
                    <span>{isExpanded ? '▼' : '▶'}</span>
                    <span>{isExpanded ? 'Less Details' : 'More Details'}</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-black/30 border border-purple-400/20 rounded-lg space-y-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      <p className="text-white/80 whitespace-pre-line leading-relaxed">
                        {spiralShow.showDetails.fullDescription}
                      </p>
                      {spiralShow.showDetails.elements && spiralShow.showDetails.elements.length > 0 && (
                        <div>
                          <h5 className="text-sm font-bold text-purple-300 mb-2">Elements</h5>
                          <ul className="space-y-1">
                            {spiralShow.showDetails.elements.map((element, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-white/80">
                                <span className="text-purple-400 mt-0.5">•</span>
                                <span>{element}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Workshop Leaders */}
            {(() => {
              const workshops = localizedEvent?.freemanShows?.flatMap(day => day.shows)
                .filter(show => show.workshopDetails);
              
              if (!workshops || workshops.length === 0) return null;
              
              return (
                <div key="workshop-leaders" className="p-8 rounded-xl bg-black/20 border border-white/10 md:col-span-2 lg:col-span-1">
              <h3 className="display text-xl font-bold mb-2">Workshop Leaders</h3>
              <p className="text-purple-300 mb-4">International experts</p>
                  
                  <div className="space-y-4">
                    {workshops.map((workshop, idx) => {
                      if (!workshop.workshopDetails) return null;
                      const workshopId = `artist-workshop-${idx}`;
                      const isExpanded = expandedArtistWorkshops.has(workshopId);
                      const day = localizedEvent?.freemanShows?.find(d => d.shows.includes(workshop));
                      const dayMap: Record<string, string> = { 'Freitag': 'Fri.', 'Samstag': 'Sat.', 'Sonntag': 'Sun.' };
                      const dayShort = day ? (dayMap[day.day] || day.day.slice(0, 2) + '.') : '';
                      
                      return (
                        <div key={workshopId} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                          <p className="text-white/70 mb-2">
                            <strong>{workshop.workshopDetails.by}:</strong> {workshop.title.replace('Workshop „', '').replace('"', '')} ({dayShort} {workshop.time})
                          </p>
                          
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedArtistWorkshops);
                              if (isExpanded) {
                                newExpanded.delete(workshopId);
                              } else {
                                newExpanded.add(workshopId);
                              }
                              setExpandedArtistWorkshops(newExpanded);
                            }}
                            className="text-orange-400 hover:text-orange-300 text-xs font-semibold flex items-center gap-1 transition-colors mb-2"
                          >
                            <span>{isExpanded ? '▼' : '▶'}</span>
                            <span>{isExpanded ? 'Less' : 'More Details'}</span>
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-2 p-4 bg-black/30 border border-orange-400/20 rounded-lg space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
                              <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                {workshop.workshopDetails.fullDescription}
                              </p>
                              {workshop.workshopDetails.aboutTeacher && (
                                <div>
                                  <h5 className="text-sm font-bold text-orange-300 mb-1">About the Teacher</h5>
                                  <p className="text-white/80">{workshop.workshopDetails.aboutTeacher}</p>
                                </div>
                              )}
                              {workshop.workshopDetails.idealFor && (
                                <div>
                                  <h5 className="text-sm font-bold text-orange-300 mb-1">Ideal For</h5>
                                  <p className="text-white/80">{workshop.workshopDetails.idealFor}</p>
                                </div>
                              )}
                              {workshop.workshopDetails.whatToBring && (
                                <div>
                                  <h5 className="text-sm font-bold text-orange-300 mb-1">What to Bring</h5>
                                  <p className="text-white/80">{workshop.workshopDetails.whatToBring}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="text-sm text-white/60 mt-4">
                Workshops in English • Registration required
              </div>
            </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="display text-3xl md:text-4xl font-bold mb-8 text-center">
            Program Details
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
                          <div className={`font-semibold ${colors.text} mb-1`}>{show.time} {show.type === 'talk' ? 'TIME TO TALK' : show.type === 'workshop' ? 'Workshop' : show.type === 'party' ? 'Party' : 'Show'}</div>
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
                                <span>{isShowExpanded ? 'Less' : 'More Details'}</span>
                              </button>
                              
                              {isShowExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-4 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  {show.showDetails!.by && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>By {show.showDetails!.by}</h5>
                </div>
                                  )}
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.showDetails!.fullDescription}
                                  </p>
                                  {show.showDetails!.elements && show.showDetails!.elements.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-2`}>Elements</h5>
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
                                <span>{isWorkshopExpanded ? 'Less' : 'More Details'}</span>
                              </button>
                              
                              {isWorkshopExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  {show.workshopDetails!.by && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>By {show.workshopDetails!.by}</h5>
                                    </div>
                                  )}
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.workshopDetails!.fullDescription}
                                  </p>
                                  {show.workshopDetails!.aboutTeacher && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>About the Teacher</h5>
                                      <p className="text-white/80">{show.workshopDetails!.aboutTeacher}</p>
                                    </div>
                                  )}
                                  {show.workshopDetails!.idealFor && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Ideal For</h5>
                                      <p className="text-white/80">{show.workshopDetails!.idealFor}</p>
                                    </div>
                                  )}
                                  {show.workshopDetails!.whatToBring && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>What to Bring</h5>
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
                                <span>{isTalkExpanded ? 'Less' : 'More Details'}</span>
                              </button>
                              
                              {isTalkExpanded && (
                                <div className={`mt-2 p-4 bg-black/30 border ${colors.detailBorder} rounded-lg space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-300`}>
                                  <p className="text-white/80 whitespace-pre-line leading-relaxed">
                                    {show.talkDetails!.fullDescription}
                                  </p>
                                  {show.talkDetails!.topics && show.talkDetails!.topics.length > 0 && (
                                    <div>
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-2`}>Topics</h5>
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
                                      <h5 className={`text-sm font-bold ${colors.detailTitle} mb-1`}>Participants</h5>
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
                                        More Info: zeitfuerzirkus.de
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
                <div className="font-semibold text-white">Shows: Reduced €12, Regular €18 • Workshops registration</div>
                <div className="text-sm text-white/70">Combo tickets available • Only 200 seats per show</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tickets */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Secure Your Tickets
          </h2>
          <p className="text-xl mb-8 text-white/90">
            ⚠️ Only 200 seats per show – free seating
          </p>

          <div className={`grid ${earlyBirdActive ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-12`}>
            {earlyBirdActive && (
              <div className="p-6 rounded-xl bg-white/5 border-white/30 shadow-white/10 shadow-lg border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">€12</div>
                  <div className="font-semibold mb-2">🚀 Early Bird</div>
                  <div className="text-sm text-white/70">until Oct 15 • SAVE €10</div>
                </div>
              </div>
            )}

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">€12</div>
                <div className="font-semibold mb-2">Reduced</div>
                <div className="text-sm text-white/70">available online</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">€18</div>
                <div className="font-semibold mb-2">Regular</div>
                <div className="text-sm text-white/70">available online</div>
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
              Select Show
            </a>
            <a
              href="https://freemanfestival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              To Festival Website
            </a>
          </div>
        </div>
      </section>

      {/* Back to Events */}
      <section className="py-12 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/en/veranstaltungen"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full hover:border-white/50 transition-colors"
          >
            <span>←</span>
            <span>Back to All Events</span>
          </Link>
        </div>
      </section>

      {/* Förderer / Funders */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
              Funded by
            </h3>
            <p className="text-xs text-white/50">
              With kind support from our funders
            </p>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-full max-w-4xl">
              <Image
                src="/Logos.png"
                alt="Funders and partners of the Freeman Festival"
                width={1200}
                height={400}
                className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="display text-xl font-bold mb-4">
            Freeman 2025 • Pepe Dome
          </div>
          <p className="muted text-sm">
            A Festival of Artistry • Nov 14–16 • Ostpark Munich
          </p>
        </div>
      </footer>
    </div>
  );
}
