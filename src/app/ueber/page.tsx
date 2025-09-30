"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
            <div className="relative aspect-square rounded-xl overflow-hidden" style={{ background: 'var(--pepe-ink)' }}>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">5 Meter Höhe</h3>
              <p className="text-sm text-white/70">Ideale Höhe für spektakuläre Luftakrobatik und Events</p>
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
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Ein Projekt des PepeCollective
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Der Pepe Dome ist das gemeinsame Projekt des PepeCollective - einem
                Zusammenschluss von fünf etablierten Partnern der Münchner Artistik-Szene.
              </p>
              <div className="mb-6">
                <h3 className="display text-xl font-semibold mb-4 text-white">Das Kollektiv:</h3>
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
                Verantwortung für Umwelt und Gesellschaft - von unserer Energieversorgung
                bis zu unseren Partnerschaften.
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

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎯</span>
              </div>
              <div>
                <h3 className="display text-lg font-semibold mb-2">2024 • Vision</h3>
                <p className="text-white/70">
                  Die Idee entsteht: Ein permanenter Ort für Artistik in München,
                  der Training, Shows und Community vereint.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🏗️</span>
              </div>
              <div>
                <h3 className="display text-lg font-semibold mb-2">2025 • Aufbau</h3>
                <p className="text-white/70">
                  Planung und Aufbau der geodätischen Kuppel im Ostpark.
                  Partnerschaften werden geschlossen, das Team formiert sich.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🎪</span>
              </div>
              <div>
                <h3 className="display text-lg font-semibold mb-2">August 2025 • Eröffnung</h3>
                <p className="text-white/70">
                  Der Pepe Dome öffnet seine Türen mit dem Freeman Festival
                  als Eröffnungsveranstaltung.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🌟</span>
              </div>
              <div>
                <h3 className="display text-lg font-semibold mb-2">Zukunft • Vision</h3>
                <p className="text-white/70">
                  Der Pepe Dome wird zu einem europaweit bekannten Zentrum
                  für zeitgenössische Artistik und Kultur.
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
                    Wir werden sehr stark gefördert vom Kulturreferat der Landeshauptstadt München
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
                    Dieses Projekt wird durch Städtebauförderung in einem Bund-Länder-Programm im Mitteln des
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