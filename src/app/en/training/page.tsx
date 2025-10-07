"use client";
import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function TrainingPageEN() {
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
      const emailBody = `Workshop/Course Idea from Pepe Dome Training:

${ideaText}`;
      const mailtoLink = `mailto:info@pepeshows.de?subject=Workshop/Course Idea from Pepe Dome&body=${encodeURIComponent(emailBody)}`;

      window.location.href = mailtoLink;

      setSubmitMessage("Thank you! Your email program should open.");
      setIdeaText("");
      setShowIdeaForm(false);
    } catch (error) {
      setSubmitMessage("Error sending. Please try again.");
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
            Training & Courses
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Contemporary circus and artistry at Pepe Dome
          </p>

          {/* Two Main Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <a href="#profitraining" className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="display text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">Professional Training</h2>
              <p className="text-white/80 mb-4">Daily 10:00 – 14:00</p>
              <p className="text-sm text-white/70">For professional artists and advanced practitioners</p>
            </a>

            <a href="#kurse" className="group text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-300/20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📚</span>
              </div>
              <h2 className="display text-2xl font-bold mb-3 text-white group-hover:text-green-300 transition-colors">Courses & Workshops</h2>
              <p className="text-white/80 mb-4">Various times</p>
              <p className="text-sm text-white/70">For all levels - from beginners to professionals</p>
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
                  Professional Training
                </h2>
                <p className="text-lg font-semibold text-white/90">
                  Daily 10:00 – 14:00
                </p>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              Professional training in contemporary circus takes place daily from 10 to 14 o'clock at Pepe Dome. Here artists meet for joint training and creative exchange.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="display text-lg font-bold text-white mb-4">Guidelines</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎤</span>
                  <span>Turn off sound system</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💡</span>
                  <span>Turn off & cover lighting system</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⛺</span>
                  <span>Close tent (5 zippers)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔒</span>
                  <span>Lock container</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⬅️</span>
                  <span>Put back mats</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">↘️</span>
                  <span>Take down aerial props (don't pull up carabiners without weight)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧹</span>
                  <span>Basic sweep</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">♾️</span>
                  <span>Sort waste: Plastic, rest, paper, bottles – please take glass with you</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">👟</span>
                  <span>No street shoes on the dance floor</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧽</span>
                  <span>Clean kitchen immediately after use</span>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <span className="text-lg">📝</span>
                  <span>Friendly inform visitors that info/flyers are on the table</span>
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
              Courses & Workshops
            </h2>
            <p className="text-xl text-white/80">
              Structured learning for all levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Regular Courses */}
            <div className="p-8 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-300/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="display text-xl font-bold mb-4 text-center text-white">
                Guided Training
              </h3>
              <p className="text-white/80 mb-6 text-center">
                You can find guided training in the Eversports schedule.
              </p>
              <div className="mt-6 text-center">
                <a href="#angeleitete-trainings" className="btn-secondary px-6 py-3 inline-block">
                  More Info →
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
                Workshops and intensives are announced under Events.
              </p>
              <div className="mt-6 text-center">
                <Link href="/en/veranstaltungen" className="btn-secondary px-6 py-3 inline-block">
                  View Events →
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
              Disciplines & Equipment
            </h2>
            <p className="text-xl text-white/80">
              Diverse training opportunities under one roof
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
                  <div className="text-white/90">• Aerial Silk (Vertical Fabric)</div>
                  <div className="text-white/90">• Aerial Hoop/Lyra</div>
                  <div className="text-white/90">• Trapeze</div>
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
                  <div className="text-white/90">• Acrobatics & Tumbling</div>
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
              Why train at Pepe Dome?
            </h2>
            <p className="text-xl text-white/80">
              Unique training conditions in Munich
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">8.50 Meter Height</h3>
              <p className="text-sm text-white/70">Plenty of space for aerial arts and spectacular high elements</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Geodesic Dome</h3>
              <p className="text-sm text-white/70">Unique architecture and optimal acoustics</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Ostpark Location</h3>
              <p className="text-sm text-white/70">Training in nature - inspiring environment</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-black/20 border border-white/10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="display text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-white/70">Vibrant artist community in Munich</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Prices & Packages
            </h2>
            <p className="text-xl text-white/80">
              Flexible options for all training needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Non-Aerial Prices */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">🤸</span>
                </div>
                <h3 className="display text-2xl font-bold">Non-Aerial Classes</h3>
                <p className="text-white/70 text-sm mt-2">Floor acrobatics, handstand, movement</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Trial Class</div>
                    <div className="text-xs text-white/60">One-time class participation for first-timers</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€12</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Single Ticket</div>
                    <div className="text-xs text-white/60">One-time class participation</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€20</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">5-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 5 non-aerial classes</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€90</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">10-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 10 non-aerial classes</div>
                  </div>
                  <div className="text-xl font-bold text-green-400">€165</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">20-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 20 non-aerial classes</div>
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
                <h3 className="display text-2xl font-bold">Aerial Classes</h3>
                <p className="text-white/70 text-sm mt-2">Aerial silk, hoop, trapeze</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">Single Ticket</div>
                    <div className="text-xs text-white/60">One-time class participation</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€25</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">5-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 5 aerial classes</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€120</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">10-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 10 aerial classes</div>
                  </div>
                  <div className="text-xl font-bold text-blue-400">€220</div>
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <div className="font-semibold">20-Class Card</div>
                    <div className="text-xs text-white/60">Participate in 20 aerial classes</div>
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
              Guided Training
            </h3>
            <p className="text-lg text-white/90 mb-4">
              You can find guided training in the Eversports schedule.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full">
              <span className="text-orange-400 font-semibold">⚠️ Note:</span>
              <span className="text-white/90">Check if it takes place at the correct location!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Eversports Booking Widget */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Course Schedule & Booking
            </h2>
            <p className="text-xl text-white/80 mb-6">
              All current courses and direct booking via Eversports
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10 bg-gray-900">
            <div className="eversports-widget">
              <iframe
                width="100%"
                height="900"
                src="https://www.eversports.de/widget/w/E5UPEH"
                frameBorder="0"
                title="Eversports Booking Widget"
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
              Do you want a workshop or course?
            </h2>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Don't hesitate to write! We take your messages seriously and organize courses or workshops when there's enough demand.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowIdeaForm(!showIdeaForm)}
                className="btn-primary text-lg px-8 py-4"
              >
                Share Your Idea
              </button>
            </div>

            {/* Expandable Idea Form */}
            {showIdeaForm && (
              <form onSubmit={handleIdeaSubmit} className="mt-6 p-6 rounded-xl bg-black/40 border border-purple-400/20">
                <h3 className="text-lg font-semibold mb-4 text-purple-400">
                  Share your workshop idea with us
                </h3>
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={ideaText}
                      onChange={(e) => setIdeaText(e.target.value)}
                      maxLength={500}
                      rows={4}
                      className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-purple-400/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                      placeholder="Describe your idea for a workshop or course... (max. 500 characters)"
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-white/60">
                        {ideaText.length}/500 characters
                      </span>
                      {ideaText.length > 450 && (
                        <span className="text-orange-400">
                          {500 - ideaText.length} characters remaining
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
                      {isSubmitting ? "Sending..." : "Send Idea"}
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
                      Cancel
                    </button>
                  </div>
                  {submitMessage && (
                    <div className={`text-sm p-3 rounded-lg ${
                      submitMessage.includes("Error")
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