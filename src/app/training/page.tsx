"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getUpcomingWorkshops, type Workshop } from "@/data/events";
import { useState } from "react";

export default function TrainingPage() {
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);

  const upcomingWorkshops = getUpcomingWorkshops();

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaText.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real implementation, this would send to a backend API
      // For now, we'll simulate the email functionality
      const emailBody = `Workshop/Kurs Idee vom Pepe Dome Training:

${ideaText}`;
      const mailtoLink = `mailto:info@pepeshows.de?subject=Workshop/Kurs Idee vom Pepe Dome&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoLink;

      setSubmitMessage("Vielen Dank! Ihr Email-Programm sollte sich öffnen.");
      setIdeaText("");
      setShowIdeaForm(false);
    } catch (error) {
      setSubmitMessage("Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  const openWorkshopModal = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    document.body.style.overflow = 'hidden';
  };

  const closeWorkshopModal = () => {
    setSelectedWorkshop(null);
    document.body.style.overflow = 'unset';
  };

  const shareWorkshop = async (workshop: Workshop) => {
    const shareData = {
      title: `${workshop.title} - Pepe Dome`,
      text: `${workshop.subtitle} am ${workshop.dateDisplay} im Pepe Dome`,
      url: `https://www.pepe-dome.de/training#workshop-${workshop.id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(`https://www.pepe-dome.de/training#workshop-${workshop.id}`);
        alert('Link wurde in die Zwischenablage kopiert!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="training" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Training & Kurse
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Zeitgenössischer Zirkus und Artistik im Pepe Dome
          </p>

          {/* Two Main Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a href="#profitraining" className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="display text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">Profitraining</h2>
              <p className="text-white/80 mb-4">Täglich 10:00 – 14:00 Uhr</p>
              <p className="text-sm text-white/70">Für professionelle Künstler:innen und fortgeschrittene Trainer:innen</p>
            </a>

            <a href="#kurse" className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-300/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="display text-2xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">Kurse & Workshops</h2>
              <p className="text-white/80 mb-4">Verschiedene Termine</p>
              <p className="text-sm text-white/70">Für alle Level - von Einsteiger:innen bis Profis</p>
            </a>
          </div>
        </div>
      </section>

      {/* Profitraining Details */}
      <section id="profitraining" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-6 rounded-xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-white/20 rounded-full flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <h2 className="display text-2xl font-bold text-white">
                  Profitraining
                </h2>
                <p className="text-lg font-semibold text-white/90">
                  Täglich 10:00 – 14:00 Uhr
                </p>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              Im Pepe Dome findet täglich von 10 bis 14 Uhr das Profitraining im zeitgenössischen Zirkus statt. Hier treffen sich Künstler:innen zum gemeinsamen Training und kreativen Austausch.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="display text-lg font-bold text-white mb-4">Hinweise vor Ort</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎤</span>
                  <span>Sound System ausschalten</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💡</span>
                  <span>Lichtsystem ausschalten & abdecken</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⛺</span>
                  <span>Zelt schließen (5 Reißverschlüsse)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔒</span>
                  <span>Container abschließen</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⬅️</span>
                  <span>Matten zurücklegen</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">↘️</span>
                  <span>Aerial-Props abbauen (Karabiner nicht hochziehen ohne Gewicht)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧹</span>
                  <span>Grob fegen</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">♾️</span>
                  <span>Müll trennen: Plastik, Rest, Papier, PET – Glas bitte mitnehmen</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">👟</span>
                  <span>Keine Straßenschuhe auf dem Tanzboden</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧽</span>
                  <span>Küche nach Benutzung direkt reinigen</span>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <span className="text-lg">📝</span>
                  <span>Besucher:innen freundlich informieren, dass Infos/Flyer auf dem Tisch liegen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kurse & Workshops Section */}
      <section id="kurse" className="py-20 px-6 bg-black/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Kurse & Workshops
            </h2>
            <p className="text-xl text-white/80">
              Strukturiertes Lernen für alle Level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regular Courses */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-300/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="display text-xl font-bold mb-4 text-center text-white">
                Angeleitete Trainings
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Angeleitete Trainings findet ihr im Eversports Plan.
              </p>
              <div className="mt-6 text-center">
                <a href="#angeleitete-trainings" className="btn-secondary px-6 py-3 inline-block">
                  Mehr Infos →
                </a>
              </div>
            </div>

            {/* Workshops */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-orange-300/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="display text-xl font-bold mb-4 text-center text-white">
                Workshops & Intensives
              </h3>
              <p className="text-white/80 mb-6 text-center">
                Workshops und Intensives werden unter Events angekündigt.
              </p>
              <div className="mt-6 text-center">
                <Link href="/veranstaltungen" className="btn-secondary px-6 py-3 inline-block">
                  Events ansehen →
                </Link>
              </div>
            </div>
          </div>

          {/* Workshop Cards */}
          {upcomingWorkshops.length > 0 && (
            <div className="mt-12">
              <div className="text-center mb-8">
                <h3 className="display text-2xl md:text-3xl font-bold mb-4">
                  Aktuelle Workshops
                </h3>
                <p className="text-white/80">
                  Intensive Workshops für alle Level
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingWorkshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    id={`workshop-${workshop.id}`}
                    className="bg-black/20 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 cursor-pointer group relative"
                    onClick={() => openWorkshopModal(workshop)}
                  >
                    {/* Share Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        shareWorkshop(workshop);
                      }}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full flex items-center justify-center transition-all z-10"
                      aria-label="Workshop teilen"
                    >
                      <span className="text-lg">🔗</span>
                    </button>

                    {/* Workshop Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br from-${workshop.color.primary}/20 to-${workshop.color.secondary}/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl">{workshop.emoji}</span>
                    </div>

                    {/* Workshop Title */}
                    <h4 className="display text-xl font-bold mb-2 text-center group-hover:text-[#D4A574] transition-colors">
                      {workshop.title}
                    </h4>

                    {/* Workshop Subtitle */}
                    <p className="text-white/70 text-sm text-center mb-4">
                      {workshop.subtitle}
                    </p>

                    {/* Workshop Date & Duration */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                        <span>📅</span>
                        <span>{workshop.dateDisplay}</span>
                      </div>
                      {workshop.time && (
                        <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                          <span>🕐</span>
                          <span>{workshop.time}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 text-sm text-white/80">
                        <span>⏱️</span>
                        <span>{workshop.duration}</span>
                      </div>
                    </div>

                    {/* Workshop Price */}
                    {workshop.price && (
                      <div className="text-center mb-4">
                        <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-full">
                          <span className="text-cyan-300 font-bold">{workshop.price}</span>
                        </div>
                      </div>
                    )}

                    {/* Workshop Features (first 2) */}
                    <div className="space-y-2 mb-4">
                      {workshop.features.slice(0, 2).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="text-base flex-shrink-0">{feature.icon}</span>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-4 border-t border-white/10">
                      <div className="text-xs text-white/50">
                        Klicke für Details & Anmeldung ➤
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Disciplines */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Disziplinen & Geräte
            </h2>
            <p className="text-xl text-white/80">
              Vielfältige Trainingsmöglichkeiten unter einem Dach
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Aerial Arts */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🎪</span>
                Aerial Arts
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-white/90">• Vertikaltuch (Aerial Silk)</div>
                  <div className="text-white/90">• Luftringe (Aerial Hoop/Lyra)</div>
                  <div className="text-white/90">• Trapez</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/90">• Straps</div>
                  <div className="text-white/90">• Spanish Web</div>
                  <div className="text-white/90">• Cloud Swing</div>
                </div>
              </div>
            </div>

            {/* Ground Arts */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🤸</span>
                Ground Arts
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-white/90">• Handstand & Hand-Balancing</div>
                  <div className="text-white/90">• Akrobatik & Tumbling</div>
                  <div className="text-white/90">• Contortion</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/90">• Cyr Wheel</div>
                  <div className="text-white/90">• Chinese Pole</div>
                  <div className="text-white/90">• Juggling</div>
                </div>
              </div>
            </div>

            {/* Movement & Flow */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💃</span>
                Movement & Flow
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-white/90">• Flow Arts & Object Manipulation</div>
                  <div className="text-white/90">• Contemporary Dance</div>
                  <div className="text-white/90">• Floor Work</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/90">• Movement Research</div>
                  <div className="text-white/90">• Physical Theatre</div>
                  <div className="text-white/90">• Improvisation</div>
                </div>
              </div>
            </div>

            {/* Conditioning */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💪</span>
                Conditioning & Prep
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="text-white/90">• Circus Conditioning</div>
                  <div className="text-white/90">• Flexibility Training</div>
                  <div className="text-white/90">• Injury Prevention</div>
                </div>
                <div className="space-y-2">
                  <div className="text-white/90">• Warm-up & Cool-down</div>
                  <div className="text-white/90">• Strength Building</div>
                  <div className="text-white/90">• Body Awareness</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Train at Pepe Dome */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Warum im Pepe Dome trainieren?
            </h2>
            <p className="text-xl text-white/80">
              Einzigartige Trainingsbedingungen in München
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">8,50 Meter Höhe</h3>
              <p className="text-sm text-white/70">Viel Raum für Luftakrobatik und spektakuläre hohe Elemente</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Geodätische Kuppel</h3>
              <p className="text-sm text-white/70">Einzigartige Architektur und optimale Akustik</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Ostpark Lage</h3>
              <p className="text-sm text-white/70">Training im Grünen - inspirierendes Umfeld</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-white/70">Lebendige Artist:innen-Community in München</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Preise & Pakete
            </h2>
            <p className="text-xl text-white/80">
              Flexible Optionen für alle Trainingsbedürfnisse
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Non-Aerial Prices */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🤸</span>
                </div>
                <h3 className="display text-2xl font-bold">Non-Aerial Kurse</h3>
                <p className="text-white/70 text-sm mt-2">Bodenakrobatik, Handstand, Movement</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Probestunde</div>
                    <div className="text-xs text-white/60">Einmalige Kursteilnahme zum ersten Mal</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€12</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Einzelticket</div>
                    <div className="text-xs text-white/60">Einmalige Kursteilnahme</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€20</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">5er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 5 non-Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€90</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">10er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 10 non-Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€165</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">20er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 20 non-Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€300</div>
                </div>
              </div>
            </div>

            {/* Aerial Prices */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-400/10 border border-blue-400/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎪</span>
                </div>
                <h3 className="display text-2xl font-bold">Aerial Kurse</h3>
                <p className="text-white/70 text-sm mt-2">Vertikaltuch, Luftringe, Trapez</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Einzelticket</div>
                    <div className="text-xs text-white/60">Einmalige Kursteilnahme</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€25</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">5er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 5 Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€120</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">10er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 10 Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€220</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">20er Karte</div>
                    <div className="text-xs text-white/60">Nimm an 20 Aerial Kursen teil</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€400</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Training Notice */}
      <section id="angeleitete-trainings" className="py-12 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-400/20">
            <h3 className="display text-2xl font-bold mb-4 text-blue-400">
              Angeleitete Trainings
            </h3>
            <p className="text-lg text-white/90 mb-4">
              Angeleitete Trainings findet ihr im Eversports Plan.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full">
              <span className="text-orange-400 font-semibold">⚠️ Achtung:</span>
              <span className="text-white/90">Schaut ob es an der richtigen Location stattfindet!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Eversports Booking Widget */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Kursplan & Buchung
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Alle aktuellen Kurse und direkte Buchung über Eversports
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 bg-gray-900">
            <div className="eversports-widget">
              <iframe
                width="100%"
                height="900"
                src="https://www.eversports.de/widget/w/E5UPEH"
                frameBorder="0"
                title="Eversports Buchungswidget"
                className="w-full"
                style={{
                  filter: 'invert(1) hue-rotate(180deg)',
                  background: '#161616'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Request CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-y border-purple-400/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 rounded-xl bg-black/30 border border-purple-400/30">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">💌</span>
            </div>
            <h2 className="display text-3xl md:text-4xl font-bold mb-6 text-purple-400">
              Ihr wünscht euch einen Workshop oder Kurs?
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Zögert nicht zu schreiben! Wir nehmen eure Nachrichten ernst und richten Kurse oder Workshops bei genug Nachfrage ein.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowIdeaForm(!showIdeaForm)}
                className="btn-primary text-lg px-8 py-4"
              >
                Idee mitteilen
              </button>
            </div>

            {/* Expandable Idea Form */}
            {showIdeaForm && (
              <form onSubmit={handleIdeaSubmit} className="mt-6 p-6 rounded-xl bg-black/40 border border-purple-400/20">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  Teilen Sie Ihre Workshop-Idee mit uns
                </h3>
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-purple-400/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                      placeholder="Beschreiben Sie Ihre Idee für einen Workshop oder Kurs... (max. 500 Zeichen)"
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-white/60">
                        {ideaText.length}/500 Zeichen
                      </span>
                      {ideaText.length > 450 && (
                        <span className="text-orange-400">
                          {500 - ideaText.length} Zeichen übrig
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || !ideaText.trim()}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 disabled:bg-purple-500/10 border border-purple-400/30 px-4 py-2 rounded-lg transition-all disabled:cursor-not-allowed text-white disabled:text-white/50"
                    >
                      {isSubmitting ? "Wird gesendet..." : "Idee senden"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowIdeaForm(false);
                        setIdeaText("");
                        setSubmitMessage("");
                      }}
                      className="px-4 py-2 border border-white/20 rounded-lg hover:border-white/40 transition-colors text-white/70 hover:text-white"
                    >
                      Abbrechen
                    </button>
                  </div>
                  {submitMessage && (
                    <div className={`text-sm p-3 rounded-lg ${
                      submitMessage.includes("Fehler")
                        ? "bg-blue-500/20 border border-blue-400/30 text-blue-400"
                        : "bg-green-500/20 border border-green-400/30 text-green-400"
                    }`}>
                      {submitMessage}
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />

      {/* Workshop Modal */}
      {selectedWorkshop && (
        <div className="event-modal-overlay" onClick={closeWorkshopModal}>
          <div
            className="event-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="event-modal-close"
              onClick={closeWorkshopModal}
              aria-label="Modal schließen"
            >
              ×
            </button>

            <div className="event-modal-header">
              <div className={`event-modal-image bg-gradient-to-br from-${selectedWorkshop.color.primary}/20 to-${selectedWorkshop.color.secondary}/20 flex items-center justify-center text-5xl`}>
                {selectedWorkshop.emoji}
              </div>

              <div className="event-modal-info">
                <div className="event-modal-date">
                  {selectedWorkshop.emoji} {selectedWorkshop.dateDisplay}
                </div>

                <h2 className="event-modal-title">
                  {selectedWorkshop.title}
                </h2>

                <p className="event-modal-subtitle">
                  {selectedWorkshop.subtitle}
                </p>
              </div>
            </div>

            <div className="event-modal-content">
              {/* Workshop Info */}
              <div className="mb-6 p-4 rounded-lg bg-black/20 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-white/60">Datum</div>
                      <div className="text-white font-semibold">{selectedWorkshop.dateDisplay}</div>
                    </div>
                  </div>
                  {selectedWorkshop.time && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🕐</span>
                      <div>
                        <div className="text-white/60">Zeit</div>
                        <div className="text-white font-semibold">{selectedWorkshop.time}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⏱️</span>
                    <div>
                      <div className="text-white/60">Dauer</div>
                      <div className="text-white font-semibold">{selectedWorkshop.duration}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="event-modal-description mb-6">
                {selectedWorkshop.description}
              </p>

              {/* What to Bring */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20">
                <h3 className="text-lg font-semibold mb-3 text-cyan-300">Was du mitbringen solltest:</h3>
                <ul className="space-y-2">
                  {selectedWorkshop.whatToBring.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/80">
                      <span className="text-cyan-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Ablauf:</h3>
                <div className="space-y-4">
                  {selectedWorkshop.schedule.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-black/20 border border-white/10">
                      <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                      <p className="text-sm text-white/70">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="event-modal-features mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedWorkshop.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="event-modal-feature">
                      <span className="event-modal-feature-icon">{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructor */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20">
                <h3 className="text-lg font-semibold mb-3 text-purple-300">Instructor:</h3>
                <div className="text-white/80">
                  <div className="font-semibold text-white mb-2">{selectedWorkshop.instructor.name}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <a href={`mailto:${selectedWorkshop.instructor.email}`} className="hover:text-purple-300 transition-colors">
                        {selectedWorkshop.instructor.email}
                      </a>
                    </div>
                    {selectedWorkshop.instructor.website && (
                      <div className="flex items-center gap-2">
                        <span>🌐</span>
                        <a href={selectedWorkshop.instructor.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                          {selectedWorkshop.instructor.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="event-modal-actions">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={selectedWorkshop.registrationUrl || `mailto:${selectedWorkshop.instructor.email}?subject=Anmeldung%20${encodeURIComponent(selectedWorkshop.title)}`}
                    className="btn-primary px-8 py-4 text-lg font-semibold w-full sm:w-auto text-center"
                  >
                    Jetzt anmelden
                  </a>
                  <button
                    onClick={() => shareWorkshop(selectedWorkshop)}
                    className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors text-white/70 hover:text-white flex items-center gap-2"
                  >
                    <span>🔗</span>
                    <span>Workshop teilen</span>
                  </button>
                </div>

                {selectedWorkshop.price && (
                  <div className="text-center mt-4 text-white/70">
                    <div className="text-sm">Preis: <span className="text-cyan-300 font-semibold">{selectedWorkshop.price}</span></div>
                  </div>
                )}

                {/* Close Button at Bottom */}
                <div className="text-center pt-4 border-t border-white/10 mt-4">
                  <button
                    onClick={closeWorkshopModal}
                    className="event-modal-close-bottom"
                  >
                    Close ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}