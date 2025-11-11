"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { useState, useEffect, useCallback } from "react";
import { isEarlyBirdActive } from "@/data/events";

export default function FreemanPageEN() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const earlyBirdActive = isEarlyBirdActive();

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
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">The Nordic Council</h3>
              <p className="text-purple-300 mb-4">Finland, Iceland & Sweden</p>
              <p className="text-white/70 mb-4">
                Contemporary circus art with comedy: Humor about everyday life & ambivalence merges
                with spectacular acrobatics.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;Häppy Hour&rdquo; - Fri. 7pm & Sat. 6pm
              </div>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-2">Art for Rainy Days</h3>
              <p className="text-purple-300 mb-4">Latvia • Award-winning performance</p>
              <p className="text-white/70 mb-4">
                Meditative, hypnotic circus with dance, hair hanging & aerial rope.
                Minimalist aesthetics with reinterpreted Baltic folk music.
              </p>
              <div className="text-sm text-white/60">
                Show: &ldquo;How a Spiral Works&rdquo; - Sat. 8:30pm & Sun. 6pm
              </div>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10 md:col-span-2 lg:col-span-1">
              <h3 className="display text-xl font-bold mb-2">Workshop Leaders</h3>
              <p className="text-purple-300 mb-4">International experts</p>
              <p className="text-white/70 mb-4">
                <strong>Merri Heikkilä:</strong> Object Manipulation (Fri. 3pm)<br/>
                <strong>Alise Madara Bokaldere:</strong> Stillness in Motion (Sun. 1pm)
              </p>
              <div className="text-sm text-white/60">
                Workshops in English • Registration required
              </div>
            </div>
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
            {/* Friday */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h3 className="display text-xl font-bold mb-4 text-purple-300">Friday, Nov 14</h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                  <div className="font-semibold text-orange-300">3:00pm Workshop</div>
                  <div className="text-sm text-white">Object Manipulation</div>
                  <div className="text-xs text-white/60">Merri Heikkilä</div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="font-semibold text-blue-300">7:00pm Show</div>
                  <div className="text-sm text-white">Häppy Hour</div>
                  <div className="text-xs text-white/60">The Nordic Council</div>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h3 className="display text-xl font-bold mb-4 text-purple-300">Saturday, Nov 15</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-500/10 border border-green-400/30 rounded-lg">
                  <div className="font-semibold text-green-300 mb-1">2:00pm TIME TO TALK</div>
                  <div className="text-sm text-white font-medium mb-1">BUZZ – Discourse Program</div>
                  <div className="text-xs text-white/70 mb-2">
                    Open conversation about the future of contemporary circus with artists, organizers and cultural policy representatives.
                  </div>
                  <div className="text-xs text-green-200">Free • with Anke Politz, Sanne Kurz, Walter Heun & Michael Heiduk</div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                  <div className="font-semibold text-blue-300">6:00pm Show</div>
                  <div className="text-sm text-white">Häppy Hour</div>
                  <div className="text-xs text-white/60">The Nordic Council</div>
                </div>
                <div className="p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                  <div className="font-semibold text-purple-300">8:30pm Show</div>
                  <div className="text-sm text-white">How a Spiral Works</div>
                  <div className="text-xs text-white/60">Art for Rainy Days</div>
                </div>
                <div className="p-3 bg-pink-500/10 border border-pink-400/30 rounded-lg">
                  <div className="font-semibold text-pink-300">9:45pm Party</div>
                  <div className="text-sm text-white">Festival After-Party</div>
                  <div className="text-xs text-white/60">With music & exchange</div>
                </div>
              </div>
            </div>

            {/* Sunday */}
            <div className="bg-black/30 border border-white/10 rounded-xl p-6">
              <h3 className="display text-xl font-bold mb-4 text-purple-300">Sunday, Nov 16</h3>
              <div className="space-y-4">
                <div className="p-4 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                  <div className="font-semibold text-orange-300">1:00pm Workshop</div>
                  <div className="text-sm text-white">Stillness in Motion</div>
                  <div className="text-xs text-white/60">Alise Madara Bokaldere</div>
                </div>
                <div className="p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
                  <div className="font-semibold text-purple-300">6:00pm Show</div>
                  <div className="text-sm text-white">How a Spiral Works</div>
                  <div className="text-xs text-white/60">Art for Rainy Days</div>
                </div>
              </div>
            </div>
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

          <div className={`grid ${earlyBirdActive ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-6 mb-12`}>
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

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">€22</div>
                <div className="font-semibold mb-2">Box Office</div>
                <div className="text-sm text-white/70">if available</div>
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
