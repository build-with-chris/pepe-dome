"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function TrainingPage() {
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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
    </div>
  );
}