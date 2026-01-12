import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns - Pepe Dome München | PepeCollective & geodätische Kuppel Geschichte",
  description: "Erfahren Sie mehr über den Pepe Dome: Geschichte der geodätischen Kuppel, das PepeCollective (PepeArts, Munich Circus Arts, BUZZ, Circusakademie, PepeShows) & Nachhaltigkeit.",
  keywords: ["Über Pepe Dome", "PepeCollective", "geodätische Kuppel", "PepeArts", "Munich Circus Arts", "Geschichte", "Nachhaltigkeit", "Ostpark München", "8,50m Höhe"],
};

export default function UeberPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="ueber" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Über den Pepe Dome
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Die Geschichte eines einzigartigen Ortes für Artistik, Kultur und menschliche Begegnung im Herzen Münchens
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Unsere Vision
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Der Pepe Dome ist mehr als nur eine Location - er ist ein Ort der Begegnung,
                wo Artistik und Kultur aufeinandertreffen. Hier sollen Menschen jeden Alters
                und jeder Herkunft die Magie der Bewegung und Performance erleben können.
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🌟</span>
                  <span>Artistik für alle zugänglich machen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🤝</span>
                  <span>Gemeinschaft und Austausch fördern</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🎭</span>
                  <span>Hochwertige Kulturerlebnisse schaffen</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🌱</span>
                  <span>Nachhaltigkeit und Verantwortung leben</span>
                </li>
              </ul>
            </div>
            <div className="hidden md:block relative aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--pepe-ink)' }}>
              <div
                className="relative w-full h-full animate-[fadeInBlur_3s_ease-out_0.5s_both]"
                style={{
                  animation: 'fadeInBlur 3s ease-out 0.5s both'
                }}
              >
                <Image
                  src="/TheDome.png"
                  alt="Pepe Dome - Luftaufnahme der geodätischen Kuppel"
                  fill
                  className="object-contain transition-all duration-1000"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Seamless background blend overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse at center, transparent 35%, rgba(22, 22, 22, 0.3) 55%, var(--pepe-ink) 85%),
                      linear-gradient(135deg, transparent 40%, rgba(22, 22, 22, 0.1) 60%, rgba(22, 22, 22, 0.8) 90%)
                    `
                  }}
                />
                {/* Subtle vignette for depth */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, transparent 50%, rgba(22, 22, 22, 0.15) 100%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Dome Image - Zoomed for prominence */}
      <section className="md:hidden py-8 px-6">
        <div className="max-w-md mx-auto">
          <div className="relative aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--pepe-ink)' }}>
            <div className="relative w-full h-full">
              <Image
                src="/TheDome.png"
                alt="Pepe Dome - Luftaufnahme der geodätischen Kuppel"
                fill
                className="object-cover transition-all duration-1000"
                style={{
                  objectPosition: 'center center',
                  transform: 'scale(1.8)',
                }}
                sizes="100vw"
                priority
              />
              {/* Gradient overlay for seamless integration */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(22, 22, 22, 0.2) 70%, var(--pepe-ink) 90%),
                    linear-gradient(135deg, transparent 60%, rgba(22, 22, 22, 0.3) 80%, rgba(22, 22, 22, 0.7) 95%)
                  `
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Dome */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Die geodätische Kuppel
            </h2>
            <p className="text-xl text-white/80">
              Einzigartige Architektur trifft auf funktionale Perfektion
            </p>
          </div>

          {/* Desktop Layout: Only Features */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">8,50 Meter Höhe</h3>
                <p className="text-sm text-white/70">Beeindruckende Höhe für spektakuläre Luftakrobatik und Events</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Perfekte Akustik</h3>
                <p className="text-sm text-white/70">Geodätische Form sorgt für optimale Schallverteilung</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">♿</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Barrierefrei</h3>
                <p className="text-sm text-white/70">Zugänglich für alle - Inklusion von Beginn an</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Grüne Lage</h3>
                <p className="text-sm text-white/70">Mitten im Ostpark - Natur und Kultur vereint</p>
              </div>
            </div>

          {/* Mobile Layout: Features only */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">8,50 Meter Höhe</h3>
              <p className="text-sm text-white/70">Beeindruckende Höhe für spektakuläre Luftakrobatik und Events</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Perfekte Akustik</h3>
              <p className="text-sm text-white/70">Geodätische Form sorgt für optimale Schallverteilung</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Barrierefrei</h3>
              <p className="text-sm text-white/70">Zugänglich für alle - Inklusion von Beginn an</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Grüne Lage</h3>
              <p className="text-sm text-white/70">Mitten im Ostpark - Natur und Kultur vereint</p>
            </div>
          </div>
        </div>
      </section>

      {/* PepeCollective Connection */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--pepe-ink)' }}>
              <div className="relative w-full h-full">
                <Image
                  src="/CircusSchool.webp"
                  alt="PepeCollective - Artistik Training und Performance"
                  fill
                  className="object-cover transition-all duration-1000"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Gradient overlay for better text readability */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      linear-gradient(135deg,
                        transparent 0%,
                        rgba(22, 22, 22, 0.1) 30%,
                        rgba(22, 22, 22, 0.6) 70%,
                        var(--pepe-ink) 100%
                      )
                    `
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Ein Projekt des PepeCollective
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Der Pepe Dome ist das gemeinsame Projekt des PepeCollective - einem
                Zusammenschluss von fünf etablierten Partner:innen der Münchner Artistik-Szene.
              </p>
              <div className="mb-6">
                <h3 className="display text-xl font-semibold mb-4 text-white">Das Kollektiv:</h3>

                {/* Desktop Layout - Horizontal Liste */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎪</span>
                      <span className="font-semibold">PepeArts</span>
                      <span className="text-white/60">• Artistik & Performance</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🤸</span>
                      <span className="font-semibold">Munich Circus Arts</span>
                      <span className="text-white/60">• Training & Kurse</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">⚡</span>
                      <span className="font-semibold">BUZZ</span>
                      <span className="text-white/60">• Events & Entertainment</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎓</span>
                      <span className="font-semibold">Circusakademie München</span>
                      <span className="text-white/60">• Ausbildung & Workshops</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎭</span>
                      <span className="font-semibold">PepeShows</span>
                      <span className="text-white/60">• Shows & Produktion</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Layout - Vertical Cards */}
                <div className="md:hidden space-y-4">
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🎪</span>
                      <span className="font-semibold">PepeArts</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Artistik & Performance</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🤸</span>
                      <span className="font-semibold">Munich Circus Arts</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Training & Kurse</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">⚡</span>
                      <span className="font-semibold">BUZZ</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Events & Entertainment</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🎓</span>
                      <span className="font-semibold">Circusakademie München</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Ausbildung & Workshops</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🎭</span>
                      <span className="font-semibold">PepeShows</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Shows & Produktion</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-white/70 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🌟</span>
                  <span>Gebündelte Expertise aus über 15 Jahren</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🌍</span>
                  <span>Internationales Netzwerk von Artist:innen</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🏆</span>
                  <span>Qualität durch Kooperation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Unsere Werte
            </h2>
            <p className="text-xl text-white/80">
              Was uns antreibt und leitet
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                Kunstvolle Exzellenz
              </h3>
              <p className="text-white/70 mb-4">
                Wir streben nach höchster Qualität in allem, was wir tun - von unseren Shows
                bis zu unseren Trainingsangeboten.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                Inklusion & Gemeinschaft
              </h3>
              <p className="text-white/70 mb-4">
                Jeder ist willkommen - unabhängig von Alter, Herkunft oder Vorerfahrung.
                Gemeinsam schaffen wir eine starke Artistik-Community.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                Nachhaltigkeit
              </h3>
              <p className="text-white/70 mb-4">
                Nicht neu kaufen, sondern kreativ wiederverwenden - das ist unser Ansatz
                für nachhaltiges Wirtschaften und verantwortungsvolles Handeln.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                Innovation & Kreativität
              </h3>
              <p className="text-white/70 mb-4">
                Wir experimentieren mit neuen Formaten und Technologien, um einzigartige
                Erlebnisse zu schaffen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Nachhaltigkeit neu gedacht
            </h2>
            <p className="text-xl text-white/80">
              Nicht neu kaufen, sondern kreativ wiederverwenden
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Nachhaltigkeit heißt für uns: nicht neu kaufen, sondern kreativ wiederverwenden.
                Bei den NEBourhoods in Neuperlach setzen wir genau das in die Tat um:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🏗️</span>
                  <span>ein Geodome, der seit vielen Jahren immer wieder genutzt wird</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🌿</span>
                  <span>ökologische kompotoi-Toiletten</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">♻️</span>
                  <span>Materialien, die seit über zwei Jahrzehnten im Umlauf sind – und noch lange nicht ausgedient haben</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🎨</span>
                  <span>bunte Wimpelketten von Anna Diermeier, die hier ihr zweites Leben feiern</span>
                </li>
              </ul>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <h3 className="display text-xl font-bold mb-6 text-white">
                Unterstützung durch Partner:innen
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Möglich wurde das durch die Unterstützung vieler Menschen und Partner:innen:
              </p>
              <p className="text-white/80 leading-relaxed">
                Ein herzliches Dankeschön an die <strong>Grüne Rosa Liste Fraktion</strong> (besonders an David Süß & Christian Smolka),
                das <strong>Stadtteilmanagement Neuperlach</strong>, <strong>Kreativ München</strong>,
                das <strong>Kulturreferat</strong> – und natürlich an alle helfenden Hände aus unserer Nachbarschaft.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / History */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Die Geschichte
            </h2>
            <p className="text-xl text-white/80">
              Vom Traum zur Realität
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">1️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Ursprung – Die Suche nach einem Zuhause für zeitgenössische Artistik</h3>
                <p className="text-white/70 leading-relaxed">
                  Seit 2006 treibt uns der Wunsch an, einen echten Anlaufpunkt für zeitgenössischen Zirkus, Kunst und Artistik in München zu schaffen. Einen Ort, an dem Bewegung, Körperkunst und Kultur frei atmen dürfen.
                </p>
              </div>
            </div>

            <div className="ml-9 border-l border-white/20 pl-9 space-y-1 text-center text-white/40">
              <span>⸻</span>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">2️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Der Weg – Viele Zwischenstopps, eine klare Richtung</h3>
                <p className="text-white/70 leading-relaxed">
                  Vom MUCCA über den CircusHub bis zum Sugar Mountain – wir haben viele kreative Zwischenlösungen gefunden. Doch alle waren nur auf Zeit.
                  Jeder Ort war ein Kapitel, aber die Vision blieb dieselbe: ein Raum, der bleibt.
                </p>
              </div>
            </div>

            <div className="ml-9 border-l border-white/20 pl-9 space-y-1 text-center text-white/40">
              <span>⸻</span>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">3️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Der Dome – Ein neues Zuhause (vielleicht auf Zeit, aber mit Herzblut)</h3>
                <p className="text-white/70 leading-relaxed">
                  Der PepeDome ist unsere aktuelle Bühne. Befristet, ja – aber mit Vollgas und Vision.
                  Wir wollen zeigen, dass dieser Ort eine Bereicherung für die Menschen und das Viertel ist – so sehr, dass er gar nicht mehr wegzudenken ist.
                </p>
              </div>
            </div>

            <div className="ml-9 border-l border-white/20 pl-9 space-y-1 text-center text-white/40">
              <span>⸻</span>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">4️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Jetzt – Ein lebendiger Treffpunkt für Bewegung und Begegnung</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Seit der Eröffnung am 1. August 2025 füllt sich der Dome jedes Wochenende mit Leben:
                </p>
                <p className="text-white/70">
                  🎪 Shows, Events, Profitraining, Luftakrobatik – ein bunter Mix aus Energie, Kreativität und Gemeinschaft.
                </p>
              </div>
            </div>

            <div className="ml-9 border-l border-white/20 pl-9 space-y-1 text-center text-white/40">
              <span>⸻</span>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">5️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Zukunft – Mehr als ein Ort: ein Impuls für München</h3>
                <p className="text-white/70 leading-relaxed">
                  Wir möchten immer mehr Menschen erreichen, inspirieren und verbinden – über Artistik hinaus.
                  Der PepeDome soll Impact haben: auf den Einzelnen, auf das Viertel, auf die ganze Stadt München.
                  Ein Symbol dafür, was passiert, wenn Kunst und Bewegung Raum bekommen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Unterstützung & Förderung
            </h2>
            <p className="text-xl text-white/80">
              Der Pepe Dome wird gefördert von wichtigen kulturellen Institutionen
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="display text-2xl font-bold mb-4">Kulturreferat München & Kreativ München</h3>
                  <p className="text-white/80 leading-relaxed">
                    Wir werden großzügig gefördert vom Kulturreferat der Landeshauptstadt München
                    und Kreativ München, die unsere Vision einer lebendigen Artistik-Szene in München unterstützen.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/KKUK_de_mit_LHM_Logo_kurz_nebeneinander_Unterstuetzung.png"
                    alt="Unterstützung von Landeshauptstadt München und Kreativ München"
                    width={500}
                    height={100}
                    className="h-16 sm:h-20 w-auto object-contain invert"
                  />
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="display text-2xl font-bold mb-4">Städtebauförderung</h3>
                  <p className="text-white/80 leading-relaxed">
                    Dieses Projekt wird durch die Städtebauförderung in einem Bund-Länder-Programm mit Mitteln des
                    Bundes und des Freistaats Bayern gefördert sowie von der Landeshauptstadt München kofinanziert.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/Förderung Logo.jpg"
                    alt="Städtebauförderung Logo"
                    width={400}
                    height={80}
                    className="h-12 sm:h-16 w-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-white/60">
              Diese Unterstützung ermöglicht es uns, hochwertige kulturelle Angebote für München zu schaffen.
            </p>
          </div>
        </div>
      </section>

      {/* Freeman Festival Section */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Das war das FreeMan 2025
            </h2>
            <p className="text-xl text-white/80 mb-6">
              Ein Festival der Artistik im Pepe Dome
            </p>
          </div>
          <div className="bg-black/20 border border-white/10 rounded-xl p-8">
            <p className="text-lg text-white/80 mb-6 leading-relaxed">
              Vom 14.–16. November 2025 fand das Freeman Festival – Festival der Artistik im Pepe Dome statt. 
              Internationale Spitzen-Artist:innen zeigten Akrobatik und Entertainment auf Weltklasse-Niveau 
              als Teil von ZEIT FÜR ZIRKUS 2025.
            </p>
            <Link
              href="/freeman"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors font-semibold"
            >
              <span>Mehr über das Freeman Festival 2025 erfahren</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Teil der Community werden
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Erleben Sie den Pepe Dome und werden Sie Teil unserer wachsenden Artistik-Familie
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/training"
              className="btn-primary text-xl px-12 py-6"
            >
              Training starten
            </Link>
            <Link
              href="/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}