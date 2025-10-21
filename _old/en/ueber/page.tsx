import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Pepe Dome Munich | PepeCollective & Geodesic Dome History",
  description: "Learn more about Pepe Dome: history of the geodesic dome, the PepeCollective (PepeArts, Munich Circus Arts, BUZZ, Circusakademie, PepeShows) & sustainability.",
  keywords: ["About Pepe Dome", "PepeCollective", "geodesic dome", "PepeArts", "Munich Circus Arts", "history", "sustainability", "Ostpark Munich", "8.50m height"],
};

export default function AboutPageEN() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="ueber" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            About Pepe Dome
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            The story of a unique place for artistry, culture and human encounter in the heart of Munich
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                Our Vision
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Pepe Dome is more than just a location - it&apos;s a place of encounter
                where artistry and culture come together. Here people of all ages
                and backgrounds can experience the magic of movement and performance.
              </p>
              <ul className="space-y-3 text-white/70">
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🌟</span>
                  <span>Make artistry accessible to everyone</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🤝</span>
                  <span>Foster community and exchange</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🎭</span>
                  <span>Create high-quality cultural experiences</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">🌱</span>
                  <span>Live sustainability and responsibility</span>
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
                  alt="Pepe Dome - Aerial view of the geodesic dome"
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
                alt="Pepe Dome - Aerial view of the geodesic dome"
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
              The Geodesic Dome
            </h2>
            <p className="text-xl text-white/80">
              Unique architecture meets functional perfection
            </p>
          </div>

          {/* Desktop Layout: Only Features */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">📏</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">8.50 Meter Height</h3>
                <p className="text-sm text-white/70">Impressive height for spectacular aerial acrobatics and events</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Perfect Acoustics</h3>
                <p className="text-sm text-white/70">Geodesic form ensures optimal sound distribution</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">♿</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Barrier-free</h3>
                <p className="text-sm text-white/70">Accessible to all - inclusion from the beginning</p>
              </div>

              <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <h3 className="display text-lg font-semibold mb-2">Green Location</h3>
                <p className="text-sm text-white/70">In the middle of Ostpark - nature and culture united</p>
              </div>
            </div>

          {/* Mobile Layout: Features only */}
          <div className="md:hidden grid grid-cols-1 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">8.50 Meter Height</h3>
              <p className="text-sm text-white/70">Impressive height for spectacular aerial acrobatics and events</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Perfect Acoustics</h3>
              <p className="text-sm text-white/70">Geodesic form ensures optimal sound distribution</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Barrier-free</h3>
              <p className="text-sm text-white/70">Accessible to all - inclusion from the beginning</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Green Location</h3>
              <p className="text-sm text-white/70">In the middle of Ostpark - nature and culture united</p>
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
                  alt="PepeCollective - Artistry Training and Performance"
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
                A Project of the PepeCollective
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                Pepe Dome is the joint project of the PepeCollective - a collaboration
                of five established partners from Munich&apos;s artistry scene.
              </p>
              <div className="mb-6">
                <h3 className="display text-xl font-semibold mb-4 text-white">The Collective:</h3>

                {/* Desktop Layout - Horizontal List */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎪</span>
                      <span className="font-semibold">PepeArts</span>
                      <span className="text-white/60">• Artistry & Performance</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🤸</span>
                      <span className="font-semibold">Munich Circus Arts</span>
                      <span className="text-white/60">• Training & Courses</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">⚡</span>
                      <span className="font-semibold">BUZZ</span>
                      <span className="text-white/60">• Events & Entertainment</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎓</span>
                      <span className="font-semibold">Circusakademie München</span>
                      <span className="text-white/60">• Education & Workshops</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <span className="text-purple-400">🎭</span>
                      <span className="font-semibold">PepeShows</span>
                      <span className="text-white/60">• Shows & Production</span>
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
                    <div className="text-white/60 text-sm ml-6">Artistry & Performance</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🤸</span>
                      <span className="font-semibold">Munich Circus Arts</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Training & Courses</div>
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
                    <div className="text-white/60 text-sm ml-6">Education & Workshops</div>
                  </div>
                  <div className="text-white/80">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-purple-400">🎭</span>
                      <span className="font-semibold">PepeShows</span>
                    </div>
                    <div className="text-white/60 text-sm ml-6">Shows & Production</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3 text-white/70 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🌟</span>
                  <span>Pooled expertise from over 15 years</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🌍</span>
                  <span>International network of artists</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">🏆</span>
                  <span>Quality through cooperation</span>
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
              Our Values
            </h2>
            <p className="text-xl text-white/80">
              What drives and guides us
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                Artistic Excellence
              </h3>
              <p className="text-white/70 mb-4">
                We strive for the highest quality in everything we do - from our shows
                to our training offerings.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                Inclusion & Community
              </h3>
              <p className="text-white/70 mb-4">
                Everyone is welcome - regardless of age, background or previous experience.
                Together we create a strong artistry community.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                Sustainability
              </h3>
              <p className="text-white/70 mb-4">
                Don&apos;t buy new, but creatively reuse - that&apos;s our approach
                for sustainable economy and responsible action.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">💡</span>
                Innovation & Creativity
              </h3>
              <p className="text-white/70 mb-4">
                We experiment with new formats and technologies to create unique
                experiences.
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
              Sustainability Reimagined
            </h2>
            <p className="text-xl text-white/80">
              Don&apos;t buy new, but creatively reuse
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                For us, sustainability means: don&apos;t buy new, but creatively reuse.
                At the NEBourhoods in Neuperlach, we put exactly this into practice:
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🏗️</span>
                  <span>a Geodome that has been used again and again for many years</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🌿</span>
                  <span>ecological kompostoi toilets</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">♻️</span>
                  <span>materials that have been in circulation for over two decades - and are far from finished</span>
                </li>
                <li className="flex items-start gap-3 text-white/80">
                  <span className="text-green-400 mt-1">🎨</span>
                  <span>colorful bunting from Anna Diermeier, celebrating their second life here</span>
                </li>
              </ul>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <h3 className="display text-xl font-bold mb-6 text-white">
                Support from Partners
              </h3>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                This was made possible through the support of many people and partners:
              </p>
              <p className="text-white/80 leading-relaxed">
                A heartfelt thank you to the <strong>Green Rosa List Faction</strong> (especially David Süß & Christian Smolka),
                the <strong>Neuperlach District Management</strong>, <strong>Creative Munich</strong>,
                the <strong>Cultural Department</strong> – and of course to all the helping hands from our neighborhood.
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
              The Story
            </h2>
            <p className="text-xl text-white/80">
              From dream to reality
            </p>
          </div>

          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">1️⃣</span>
              </div>
              <div>
                <h3 className="display text-xl font-semibold mb-3">Origin – The Search for a Home for Contemporary Artistry</h3>
                <p className="text-white/70 leading-relaxed">
                  Since 2006, we have been driven by the desire to create a real hub for contemporary circus, art and artistry in Munich. A place where movement, body art and culture can breathe freely.
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
                <h3 className="display text-xl font-semibold mb-3">The Journey – Many Stopovers, One Clear Direction</h3>
                <p className="text-white/70 leading-relaxed">
                  From MUCCA to CircusHub to Sugar Mountain – we found many creative interim solutions. But all were only temporary.
                  Each place was a chapter, but the vision remained the same: a space that stays.
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
                <h3 className="display text-xl font-semibold mb-3">The Dome – A New Home (Maybe Temporary, But With Heart)</h3>
                <p className="text-white/70 leading-relaxed">
                  The PepeDome is our current stage. Time-limited, yes – but with full throttle and vision.
                  We want to show that this place is an enrichment for the people and the neighborhood – so much so that it becomes indispensable.
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
                <h3 className="display text-xl font-semibold mb-3">Now – A Living Meeting Point for Movement and Encounter</h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  Since opening on August 1, 2025, the Dome fills with life every weekend:
                </p>
                <p className="text-white/70">
                  🎪 Shows, events, professional training, aerial acrobatics – a colorful mix of energy, creativity and community.
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
                <h3 className="display text-xl font-semibold mb-3">Future – More Than a Place: An Impulse for Munich</h3>
                <p className="text-white/70 leading-relaxed">
                  We want to reach, inspire and connect more and more people – beyond artistry.
                  PepeDome should have impact: on the individual, on the neighborhood, on the entire city of Munich.
                  A symbol of what happens when art and movement are given space.
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
              Support & Funding
            </h2>
            <p className="text-xl text-white/80">
              Pepe Dome is supported by important cultural institutions
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-black/20 border border-white/10 rounded-xl p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="display text-2xl font-bold mb-4">Cultural Department Munich & Creative Munich</h3>
                  <p className="text-white/80 leading-relaxed">
                    We are generously supported by the Cultural Department of the City of Munich
                    and Creative Munich, who support our vision of a vibrant artistry scene in Munich.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/KKUK_de_mit_LHM_Logo_kurz_nebeneinander_Unterstuetzung.png"
                    alt="Support from City of Munich and Creative Munich"
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
                  <h3 className="display text-2xl font-bold mb-4">Urban Development Funding</h3>
                  <p className="text-white/80 leading-relaxed">
                    This project is supported by urban development funding in a federal-state program with funds from
                    the federal government and the Free State of Bavaria as well as co-financed by the City of Munich.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src="/Förderung Logo.jpg"
                    alt="Urban Development Funding Logo"
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
              This support enables us to create high-quality cultural offerings for Munich.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Become Part of the Community
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Experience Pepe Dome and become part of our growing artistry family
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/en/training"
              className="btn-primary text-xl px-12 py-6"
            >
              Start Training
            </Link>
            <Link
              href="/en/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}