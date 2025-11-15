"use client";
import { useParams, notFound } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getWorkshopById, type Workshop } from "@/data/events";
import { useState, useEffect } from "react";

export default function WorkshopDetailPage() {
  const params = useParams();
  const workshopId = params.workshopId as string;
  const workshop = getWorkshopById(workshopId);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  if (!workshop) {
    notFound();
  }

  // Update page metadata dynamically
  useEffect(() => {
    if (workshop) {
      document.title = `${workshop.title} - Pepe Dome Training`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', workshop.description.substring(0, 160));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = workshop.description.substring(0, 160);
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

      updateMetaTag('og:title', `${workshop.title} - Pepe Dome`);
      updateMetaTag('og:description', workshop.description.substring(0, 160));
      updateMetaTag('og:type', 'website');
      if (workshop.image) {
        updateMetaTag('og:image', workshop.image);
      }
    }
  }, [workshop]);

  const shareWorkshop = async () => {
    const shareData = {
      title: `${workshop.title} - Pepe Dome`,
      text: `${workshop.subtitle} am ${workshop.dateDisplay} im Pepe Dome`,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link wurde in die Zwischenablage kopiert!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const getWorkshopColorClasses = (workshop: Workshop) => {
    const colorMap: Record<string, {
      bg: string;
      border: string;
      iconBg: string;
      iconBorder: string;
      title: string;
      subtitle: string;
      priceBg: string;
      priceBorder: string;
      priceText: string;
      ctaText: string;
    }> = {
      'orange-500': {
        bg: 'bg-gradient-to-br from-orange-500/10 via-black/30 to-amber-500/10',
        border: 'border-2 border-orange-500/30',
        iconBg: 'bg-gradient-to-br from-orange-500/30 to-amber-500/30',
        iconBorder: 'border-2 border-orange-400/40',
        title: 'text-orange-400',
        subtitle: 'text-orange-400/80',
        priceBg: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20',
        priceBorder: 'border-2 border-orange-400/40',
        priceText: 'text-orange-400',
        ctaText: 'text-orange-400',
      },
      'purple-500': {
        bg: 'bg-gradient-to-br from-purple-500/10 via-black/30 to-pink-500/10',
        border: 'border-2 border-purple-500/30',
        iconBg: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30',
        iconBorder: 'border-2 border-purple-400/40',
        title: 'text-purple-400',
        subtitle: 'text-purple-400/80',
        priceBg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
        priceBorder: 'border-2 border-purple-400/40',
        priceText: 'text-purple-400',
        ctaText: 'text-purple-400',
      },
      'cyan-500': {
        bg: 'bg-gradient-to-br from-cyan-500/10 via-black/30 to-blue-500/10',
        border: 'border-2 border-cyan-500/30',
        iconBg: 'bg-gradient-to-br from-cyan-500/30 to-blue-500/30',
        iconBorder: 'border-2 border-cyan-400/40',
        title: 'text-cyan-400',
        subtitle: 'text-cyan-400/80',
        priceBg: 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20',
        priceBorder: 'border-2 border-cyan-400/40',
        priceText: 'text-cyan-400',
        ctaText: 'text-cyan-400',
      },
      'blue-500': {
        bg: 'bg-gradient-to-br from-blue-500/10 via-black/30 to-indigo-500/10',
        border: 'border-2 border-blue-500/30',
        iconBg: 'bg-gradient-to-br from-blue-500/30 to-indigo-500/30',
        iconBorder: 'border-2 border-blue-400/40',
        title: 'text-blue-400',
        subtitle: 'text-blue-400/80',
        priceBg: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
        priceBorder: 'border-2 border-blue-400/40',
        priceText: 'text-blue-400',
        ctaText: 'text-blue-400',
      },
    };
    
    return colorMap[workshop.color.primary] || colorMap['cyan-500'];
  };

  const colors = getWorkshopColorClasses(workshop);

  return (
    <div className="min-h-screen">
      <Navigation currentPage="training" />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/training#kurse"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
          >
            <span>←</span>
            <span>Zurück zu Training & Kurse</span>
          </Link>

          <div className={`${colors.bg} ${colors.border} rounded-2xl p-8 md:p-12 mb-8`}>
            <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
              {workshop.image ? (
                <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white/20">
                  <Image
                    src={workshop.image}
                    alt={workshop.title}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className={`w-32 h-32 flex-shrink-0 ${colors.iconBg} rounded-xl ${colors.iconBorder} flex items-center justify-center shadow-lg`}>
                  <span className="text-6xl">{workshop.emoji}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`${colors.title} text-sm font-semibold`}>{workshop.dateDisplay}</span>
                  {workshop.soldOut && (
                    <span className="px-3 py-1 bg-red-500/90 border border-red-400 rounded-full text-white text-xs font-bold">
                      AUSVERKAUFT
                    </span>
                  )}
                </div>
                <h1 className={`display text-4xl md:text-5xl font-bold mb-3 ${colors.title}`}>
                  {workshop.title}
                </h1>
                <p className={`${colors.subtitle} text-lg font-medium`}>
                  {workshop.subtitle}
                </p>
              </div>
            </div>

            {/* Workshop Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-black/20 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="text-white/60 text-xs">Datum</div>
                  <div className="text-white font-semibold">{workshop.dateDisplay}</div>
                </div>
              </div>
              {workshop.time && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕐</span>
                  <div>
                    <div className="text-white/60 text-xs">Zeit</div>
                    <div className="text-white font-semibold">{workshop.time}</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="text-white/60 text-xs">Dauer</div>
                  <div className="text-white font-semibold">{workshop.duration}</div>
                </div>
              </div>
            </div>

            {/* Price */}
            {workshop.price && (
              <div className="text-center mb-8">
                <div className={`inline-block px-8 py-4 ${colors.priceBg} ${colors.priceBorder} rounded-full shadow-lg`}>
                  <span className={`${colors.priceText} font-bold text-2xl`}>{workshop.price}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Beschreibung</h2>
              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {workshop.description}
              </p>
            </div>

            {/* What to Bring */}
            <div className={`mb-8 p-6 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20`}>
              <h3 className="text-lg font-semibold mb-4 text-cyan-300">Was du mitbringen solltest:</h3>
              <ul className="space-y-2">
                {workshop.whatToBring.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/80">
                    <span className="text-cyan-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Ablauf:</h3>
              <div className="space-y-4">
                {workshop.schedule.map((item, idx) => (
                  <div key={idx} className="p-6 rounded-xl bg-black/20 border border-white/10">
                    <h4 className="font-semibold text-white mb-2 text-lg">{item.title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-white">Highlights:</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {workshop.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3 p-4 rounded-lg bg-black/20 border border-white/10">
                    <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                    <span className="text-white/80">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className={`mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20`}>
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Instructor:</h3>
              <div className="text-white/80">
                <div className="font-semibold text-white mb-3 text-xl">{workshop.instructor.name}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>📧</span>
                    <a href={`mailto:${workshop.instructor.email}`} className="hover:text-purple-300 transition-colors">
                      {workshop.instructor.email}
                    </a>
                  </div>
                  {workshop.instructor.website && (
                    <div className="flex items-center gap-2">
                      <span>🌐</span>
                      <a href={workshop.instructor.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                        {workshop.instructor.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-8 border-t-2 border-white/20">
              {workshop.soldOut ? (
                <div className="w-full sm:w-auto">
                  <div className="mb-4 p-4 bg-red-500/20 border-2 border-red-400/50 rounded-xl text-center">
                    <div className="text-red-400 font-bold text-lg mb-2">⚠️ AUSVERKAUFT</div>
                    <p className="text-white/80 text-sm">
                      Dieser Workshop ist bereits ausverkauft. Vielen Dank für Ihr Interesse!
                    </p>
                  </div>
                  <button
                    disabled
                    className="btn-primary px-8 py-4 text-lg font-semibold w-full sm:w-auto text-center opacity-50 cursor-not-allowed"
                  >
                    Ausverkauft
                  </button>
                </div>
              ) : (
                <a
                  href={workshop.registrationUrl || `mailto:${workshop.instructor.email}?subject=Anmeldung%20${encodeURIComponent(workshop.title)}`}
                  className="btn-primary px-8 py-4 text-lg font-semibold w-full sm:w-auto text-center"
                >
                  Jetzt anmelden
                </a>
              )}
              <button
                onClick={shareWorkshop}
                className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors text-white/70 hover:text-white flex items-center gap-2"
              >
                <span>🔗</span>
                <span>Workshop teilen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

