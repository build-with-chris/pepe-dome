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
          <div className="inline-block mb-4 sm:mb-6">
            <span className="px-3 sm:px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-300 font-semibold text-xs sm:text-sm">
              November 14–16 in Munich
            </span>
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
              href="https://freemanfestival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto max-w-xs inline-block text-center"
            >
              Get Tickets from 12€
            </a>
            <a
              href="https://freemanfestival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors underline text-sm sm:text-base"
            >
              🌐 Complete Festival Website
            </a>
          </div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50 rounded-full text-purple-300 font-bold text-xs sm:text-sm shadow-lg">
            <span className="animate-pulse">✨</span>
            <span>PREMIUM FESTIVAL EXPERIENCE</span>
            <span className="animate-pulse">✨</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              What Makes Freeman Special
            </h2>
            <p className="text-xl text-white/80">
              More than a festival – an experience that touches all senses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10 hover:border-purple-400/30 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">World-Class Artists</h3>
              <p className="text-sm text-white/70">International top performers you normally only see in major theaters</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10 hover:border-purple-400/30 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎪</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Intimate Atmosphere</h3>
              <p className="text-sm text-white/70">Close to the artists in the unique ambiance of the Pepe Dome</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10 hover:border-purple-400/30 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Art & Poetry</h3>
              <p className="text-sm text-white/70">Where technical mastery meets emotional depth</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10 hover:border-purple-400/30 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Exclusive Munich</h3>
              <p className="text-sm text-white/70">This unique festival lineup only in Munich</p>
            </div>
          </div>
        </div>
      </section>

      {/* Poster Gallery */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Experience the Magic
            </h2>
            <p className="text-xl text-white/80">
              Impressions from previous Freeman Festival performances
            </p>
          </div>

          {/* Gallery */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[4/5] max-w-lg mx-auto relative overflow-hidden rounded-xl border border-purple-400/30 shadow-2xl shadow-purple-500/25">
              <Image
                src={posters[currentSlide].src}
                alt={posters[currentSlide].alt}
                fill
                className="object-contain transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 512px"
                priority
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all"
                aria-label="Next image"
              >
                →
              </button>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
                  <h3 className="text-white font-semibold">{posters[currentSlide].title}</h3>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {posters.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-purple-400'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Festival Program
            </h2>
            <p className="text-xl text-white/80">
              Three days full of breathtaking artistry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Thursday */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20">
              <div className="text-center mb-6">
                <h3 className="display text-2xl font-bold mb-2">Thursday</h3>
                <p className="text-purple-400 font-semibold">November 14</p>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">Festival Opening</div>
                  <div className="text-white/70 text-sm">Meet the artists & welcome drinks</div>
                </div>
              </div>
            </div>

            {/* Friday */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-teal-500/10 border border-blue-400/20">
              <div className="text-center mb-6">
                <h3 className="display text-2xl font-bold mb-2">Friday</h3>
                <p className="text-blue-400 font-semibold">November 15</p>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">Main Shows</div>
                  <div className="text-white/70 text-sm">Spectacular evening performances</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">Workshops</div>
                  <div className="text-white/70 text-sm">Learn from the masters</div>
                </div>
              </div>
            </div>

            {/* Saturday */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-teal-500/10 to-green-500/10 border border-teal-400/20">
              <div className="text-center mb-6">
                <h3 className="display text-2xl font-bold mb-2">Saturday</h3>
                <p className="text-teal-400 font-semibold">November 16</p>
              </div>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">Grand Finale</div>
                  <div className="text-white/70 text-sm">Closing gala with all artists</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-1">After Party</div>
                  <div className="text-white/70 text-sm">Celebrate with the community</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="max-w-4xl mx-auto">
          {/* Early Bird Notice */}
          {earlyBirdActive && (
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-2xl animate-pulse">⚡</span>
                <h3 className="text-xl font-bold text-amber-300">Early Bird Active!</h3>
                <span className="text-2xl animate-pulse">⚡</span>
              </div>
              <p className="text-white/90">
                Secure your tickets now and save on this unique festival experience!
              </p>
            </div>
          )}

          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Experience Freeman Festival
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Secure your tickets now for this unique festival in Munich
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a
              href="https://freemanfestival.de"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-xl px-12 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Get Festival Tickets
            </a>
            <Link
              href="/en/veranstaltungen"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors text-white/70 hover:text-white"
            >
              More Events
            </Link>
          </div>

          <p className="text-white/60 text-sm">
            Tickets start from 12€ • Limited capacity • Be part of something extraordinary
          </p>
        </div>
      </section>
    </div>
  );
}