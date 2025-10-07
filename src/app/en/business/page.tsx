import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Events & Business Events - Pepe Dome Munich | Unique Location in Ostpark",
  description: "Unforgettable corporate events at Pepe Dome: Team building, conferences, Christmas parties in unique geodesic dome. 200 seats, barrier-free. Request event!",
  keywords: ["Corporate Events Munich", "Team Building Pepe Dome", "Business Events", "Conferences Ostpark", "Christmas Party", "geodesic dome", "200 seats", "barrier-free"],
};

export default function BusinessPageEN() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="business" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Pepe Dome for Companies
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Unique corporate events, team building and shows in spectacular atmosphere - unforgettable experiences for your team
          </p>
        </div>
      </section>

      {/* Corporate Events */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Corporate Events */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Corporate Events</h2>
              <p className="text-white/80 mb-6 text-center">
                Exclusive company celebrations and events in unique dome atmosphere
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-white/80">🎪</span>
                  <span>Corporate Christmas parties</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white/80">🏆</span>
                  <span>Anniversary celebrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white/80">🚀</span>
                  <span>Product launches</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-white/80">🎯</span>
                  <span>Customer events</span>
                </li>
              </ul>
              <div className="text-center">
                <Link
                  href="/en/kontakt"
                  className="btn-secondary px-6 py-3 inline-block"
                >
                  Request Event
                </Link>
              </div>
            </div>

            {/* Team Building */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Team Building</h2>
              <p className="text-white/80 mb-6 text-center">
                Innovative team building experiences through shared artistry workshops
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎪</span>
                  <span>Artistry workshops for teams</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🤸</span>
                  <span>Joint acrobatics challenges</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎭</span>
                  <span>Creative performance projects</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🏅</span>
                  <span>Team Olympics in the dome</span>
                </li>
              </ul>
              <div className="text-center">
                <Link
                  href="/en/kontakt"
                  className="btn-secondary px-6 py-3 inline-block"
                >
                  Request Dome
                </Link>
              </div>
            </div>

            {/* PepeShows */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">PepeShows</h2>
              <p className="text-white/80 mb-6 text-center">
                Exclusive shows for your company - custom artistry performances
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎪</span>
                  <span>Tailor-made shows</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎭</span>
                  <span>Professional artists</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎵</span>
                  <span>Music & artistry combined</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">✨</span>
                  <span>Unforgettable experiences</span>
                </li>
              </ul>
              <div className="text-center">
                <Link
                  href="/en/kontakt"
                  className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/30 px-6 py-3 rounded-full transition-all inline-block"
                >
                  Request Show
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Pepe Dome */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Why Pepe Dome for Your Business?
            </h2>
            <p className="text-xl text-white/80">
              Unique location with professional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Unique Location</h3>
              <p className="text-sm text-white/70">Geodesic dome - a place your visitors will never forget</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">200 People</h3>
              <p className="text-sm text-white/70">Perfect size for intimate corporate events</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">♿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Barrier-free</h3>
              <p className="text-sm text-white/70">Accessible for all your employees and visitors</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Ostpark Munich</h3>
              <p className="text-sm text-white/70">Central location in green surroundings with good connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Our Corporate Services
            </h2>
            <p className="text-xl text-white/80">
              Complete service for your corporate event
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Event Management */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📋</span>
                Event Management
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Complete event planning and execution</div>
                <div>• Catering coordination with local partners</div>
                <div>• Technical equipment (lighting, sound, projection)</div>
                <div>• Security and logistics management</div>
                <div>• Photo/video documentation</div>
              </div>
            </div>

            {/* Custom Programs */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                Customized Programs
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Team building workshops according to your goals</div>
                <div>• Shows matching your company theme</div>
                <div>• Interactive artistry experiences for visitors</div>
                <div>• Leadership development workshops</div>
                <div>• Creativity and innovation workshops</div>
              </div>
            </div>

            {/* Facilities */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                Equipment & Infrastructure
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Professional artistry equipment</div>
                <div>• Flexible seating for up to 200 people</div>
                <div>• Modern audio-video technology</div>
                <div>• Climate control and lighting</div>
                <div>• Cloakroom and restroom facilities</div>
              </div>
            </div>

            {/* Packages */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-xl font-bold mb-4 flex items-center gap-3">
                <span className="text-2xl">📦</span>
                Event Packages
              </h3>
              <div className="space-y-3 text-white/70">
                <div>• Basic: Location + basic equipment</div>
                <div>• Premium: + show or workshop</div>
                <div>• Deluxe: + catering and supervision</div>
                <div>• Bespoke: Completely customized</div>
                <div>• Multi-Day: Multi-day programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PepeShows Integration */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-6">
                PepeShows for Your Company
              </h2>
              <p className="text-lg text-white/80 mb-6 leading-relaxed">
                As part of the PepeShows family, Pepe Dome offers access to a network
                of professional artists and years of experience in the entertainment industry.
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎭</span>
                  <span>International artists from our network</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🏆</span>
                  <span>Over 10 years of experience in entertainment</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🎪</span>
                  <span>Tailor-made shows for every occasion</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">⭐</span>
                  <span>References from large corporations to startups</span>
                </li>
              </ul>
              <div>
                <Link
                  href="/en/kontakt"
                  className="btn-primary px-8 py-4 mr-4 inline-block"
                >
                  Request Dome
                </Link>
                <a
                  href="https://pepeshows.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors underline"
                >
                  Visit pepeshows.de
                </a>
              </div>
            </div>
            <div className="aspect-[5/4] bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-400/30 overflow-hidden">
              <Image
                src="/Header Pepe 5:4.jpg"
                alt="PepeShows Performance in the Dome"
                width={500}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Your Event at Pepe Dome
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Let&apos;s create an unforgettable experience for your team together
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/en/kontakt"
              className="btn-primary text-xl px-12 py-6 inline-block"
            >
              Non-binding Inquiry
            </Link>
            <Link
              href="/en/kontakt"
              className="px-6 py-3 border border-white/20 rounded-full hover:border-white/50 transition-colors muted hover:text-white"
            >
              Personal Consultation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}