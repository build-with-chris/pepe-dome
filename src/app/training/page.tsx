"use client";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function TrainingPage() {
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
            Pepe Dome als Trainingsraum für Profis & Einsteiger - von Open Training bis zu spezialisierten Workshops
          </p>
        </div>
      </section>

      {/* Training Categories */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Profi-Training */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-400/20 hover:border-red-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Profi-Training</h2>
              <p className="text-white/80 mb-6 text-center">
                Trainingsraum für professionelle Artist:innen und angehende Performer
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-red-400">🎪</span>
                  <span>Luftakrobatik (Tuch, Trapez, Lyra)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-400">🤸</span>
                  <span>Bodenakrobatik & Hand-Balancing</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-400">⚡</span>
                  <span>Cyr Wheel & Chinese Pole</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-400">🎭</span>
                  <span>Show-Vorbereitung & Coaching</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 px-6 py-3 rounded-full transition-all">
                  Training anfragen
                </button>
              </div>
            </div>

            {/* Open Training */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Open Training</h2>
              <p className="text-white/80 mb-6 text-center">
                Offenes Training für alle Interessierten - egal welches Level
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🤸</span>
                  <span>Einsteiger-freundlich</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">👥</span>
                  <span>Gemeinsames Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🏛️</span>
                  <span>5m Kuppelhöhe nutzen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">⏰</span>
                  <span>Regelmäßige Sessions</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-6 py-3 rounded-full transition-all">
                  Sessions anzeigen
                </button>
              </div>
            </div>

            {/* Workshops & Kurse */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🎓</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Workshops & Kurse</h2>
              <p className="text-white/80 mb-6 text-center">
                Strukturierte Kurse und Workshops für systematisches Lernen
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Wochenend-Workshops</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">📚</span>
                  <span>Mehrtägige Intensivkurse</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">👨‍🏫</span>
                  <span>Gasttrainer & Masterclasses</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎯</span>
                  <span>Spezielle Techniken</span>
                </li>
              </ul>
              <div className="text-center">
                <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 px-6 py-3 rounded-full transition-all">
                  Kursplan anzeigen
                </button>
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">5 Meter Höhe</h3>
              <p className="text-sm text-white/70">Genug Raum für Luftakrobatik und hohe Elemente</p>
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
              <div className="w-16 h-16 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-white/70">Lebendige Artist:innen-Community in München</p>
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

      {/* Schedule Preview */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="display text-3xl md:text-4xl font-bold mb-8">
            Trainingszeiten
          </h2>
          <p className="text-xl text-white/80 mb-12">
            Beispiel-Schedule - genaue Zeiten werden laufend aktualisiert
          </p>

          <div className="grid md:grid-cols-7 gap-4 mb-8">
            {[
              { day: "Mo", sessions: ["Open Training", "19:00-21:00"] },
              { day: "Di", sessions: ["Aerial Workshop", "18:30-20:30"] },
              { day: "Mi", sessions: ["Profi Training", "17:00-19:00"] },
              { day: "Do", sessions: ["Open Training", "19:00-21:00"] },
              { day: "Fr", sessions: ["Hand-Balancing", "18:00-20:00"] },
              { day: "Sa", sessions: ["Intensivkurs", "10:00-16:00"] },
              { day: "So", sessions: ["Movement", "14:00-16:00"] }
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-black/30 border border-white/10 text-center"
              >
                <div className="font-bold text-white mb-2">{item.day}</div>
                <div className="text-xs space-y-1">
                  {item.sessions.map((session, i) => (
                    <div key={i} className="text-white/70">{session}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-white/60 text-sm mb-8">
            Trainingszeiten können variieren. Aktuelle Termine auf Anfrage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="btn-primary text-xl px-12 py-6">
              Training anfragen
            </button>
            <Link
              href="/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="display text-xl font-bold mb-4">
            Pepe Dome Training
          </div>
          <p className="muted text-sm">
            Ostpark München • Trainingsraum für Artistik & Bewegung
          </p>
        </div>
      </footer>
    </div>
  );
}