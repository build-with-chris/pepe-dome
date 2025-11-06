import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Pepe Dome Munich | Request Event & Information | Ostpark",
  description: "Contact us for events, training or questions about Pepe Dome. Location: Ostpark Munich, barrier-free, 200 seats. Request event now or subscribe to newsletter!",
  keywords: ["Contact Pepe Dome", "request event", "Ostpark Munich", "address", "phone", "email", "newsletter", "inquiry", "information"],
};

export default function ContactPageEN() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navigation currentPage="kontakt" />

      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="display text-5xl md:text-6xl font-bold mb-6">
            Contact
          </h1>
          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Do you have questions, want to book an event or become part of our community? We look forward to your message!
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Events & Shows */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 hover:border-purple-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🎭</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Events & Shows</h2>
              <p className="text-white/80 mb-6 text-center">
                Book corporate events, private celebrations or PepeShows
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎪</span>
                  <span>Corporate Events</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🎉</span>
                  <span>Private Events</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">⭐</span>
                  <span>Request PepeShows</span>
                </li>
              </ul>
              <div className="space-y-3">
                <a href="https://pepeshows.de/anfragen" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border border-purple-400/50 px-6 py-3 rounded-full transition-all w-full block text-center font-semibold">
                  🤖 Booking Assistant (recommended)
                </a>
                <div className="flex gap-2">
                  <a href="#kontaktformular-events" className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 px-4 py-2 rounded-full transition-all flex-1 block text-center text-sm">
                    📝 Form
                  </a>
                  <a href="https://wa.me/4915904891419?text=Hello%2C%20I'm%20interested%20in%20an%20event%20at%20Pepe%20Dome." target="_blank" rel="noopener noreferrer" className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-4 py-2 rounded-full transition-all flex-1 block text-center text-sm">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Training & Kurse */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-400/20 hover:border-green-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤸</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">Training & Courses</h2>
              <p className="text-white/80 mb-6 text-center">
                Information about training, workshops and courses
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎪</span>
                  <span>Professional Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🌱</span>
                  <span>Open Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400">🎓</span>
                  <span>Workshops & Courses</span>
                </li>
              </ul>
              <div className="text-center">
                <Link href="/en/training#kontaktformular" className="bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 px-6 py-3 rounded-full transition-all w-full block">
                  Request Training
                </Link>
              </div>
            </div>

            {/* General Questions */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 hover:border-orange-400/40 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <h2 className="display text-2xl font-bold mb-4 text-center">General Questions</h2>
              <p className="text-white/80 mb-6 text-center">
                Information about Pepe Dome, partnerships or press
              </p>
              <ul className="space-y-3 text-white/70 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">ℹ️</span>
                  <span>General Info</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">🤝</span>
                  <span>Partnerships</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-orange-400">📰</span>
                  <span>Press & Media</span>
                </li>
              </ul>
              <div className="text-center">
                <a href="#kontaktformular" className="btn-secondary px-6 py-3 w-full block text-center">
                  Request Dome
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="kontaktformular" className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Send Message
            </h2>
            <p className="text-xl text-white/80">
              Fill out the form and we&apos;ll get back to you as soon as possible
            </p>
          </div>

          <form className="space-y-6" action="mailto:info@pepearts.de" method="post" encType="text/plain">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name-general" className="block text-sm font-medium text-white/90 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name-general"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email-general" className="block text-sm font-medium text-white/90 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email-general"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone-general" className="block text-sm font-medium text-white/90 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone-general"
                  name="phone"
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="+49 123 456789"
                />
              </div>
              <div>
                <label htmlFor="subject-general" className="block text-sm font-medium text-white/90 mb-2">
                  Subject *
                </label>
                <select
                  id="subject-general"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white"
                >
                  <option value="">Please select</option>
                  <option value="partnership">Partnership</option>
                  <option value="press">Press & Media</option>
                  <option value="general">General Question</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message-general" className="block text-sm font-medium text-white/90 mb-2">
                Message *
              </label>
              <textarea
                id="message-general"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                placeholder="Describe your request..."
              ></textarea>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-general"
                name="privacy"
                required
                className="mt-1 w-4 h-4 text-yellow-400 bg-black/20 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
              />
              <label htmlFor="privacy-general" className="text-sm text-white/70">
                I agree to the processing of my data according to the{" "}
                <Link href="/en/datenschutz" className="text-white hover:underline">
                  Privacy Policy
                </Link>{" "}
                . *
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4"
              >
                Request Dome
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Events Specific Contact Form */}
      <section id="kontaktformular-events" className="py-20 px-6 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Request Event & Show
            </h2>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className="text-xl font-bold">Our Booking Assistant is Here!</h3>
              </div>
              <p className="text-white/90 mb-4">
                For events and shows we recommend our intelligent booking assistant -
                it helps you quickly and easily with planning.
              </p>
              <a href="https://pepeshows.de/anfragen" target="_blank" rel="noopener noreferrer" className="btn-primary px-8 py-3 inline-block">
                🚀 To Booking Assistant
              </a>
            </div>
            <p className="text-lg text-white/70">
              Alternatively you can also use the classic form or contact us directly via WhatsApp:
              <a href="https://wa.me/4915904891419?text=Hello%2C%20I%20have%20a%20question%20about%20Pepe%20Dome." target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 font-semibold ml-1">
                Open WhatsApp
              </a>
            </p>
          </div>

          <form className="space-y-6" action="mailto:info@pepearts.de" method="post" encType="text/plain">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name-events" className="block text-sm font-medium text-white/90 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name-events"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="email-events" className="block text-sm font-medium text-white/90 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  id="email-events"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone-events" className="block text-sm font-medium text-white/90 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone-events"
                  name="phone"
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
                  placeholder="+49 123 456789"
                />
              </div>
              <div>
                <label htmlFor="subject-events" className="block text-sm font-medium text-white/90 mb-2">
                  Type of Event *
                </label>
                <select
                  id="subject-events"
                  name="subject"
                  required
                  className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white"
                >
                  <option value="">Please select</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="private">Private Event</option>
                  <option value="pepeshows">Request PepeShows</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message-events" className="block text-sm font-medium text-white/90 mb-2">
                Message *
              </label>
              <textarea
                id="message-events"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50 resize-none"
                placeholder="Describe your event: date, number of people, type of event, special requests..."
              ></textarea>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="privacy-events"
                name="privacy"
                required
                className="mt-1 w-4 h-4 text-yellow-400 bg-black/20 border-white/20 rounded focus:ring-yellow-400 focus:ring-2"
              />
              <label htmlFor="privacy-events" className="text-sm text-white/70">
                I agree to the processing of my data according to the{" "}
                <Link href="/en/datenschutz" className="text-white hover:underline">
                  Privacy Policy
                </Link>{" "}
                . *
              </label>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="btn-primary text-lg px-12 py-4"
              >
                Request Event
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Info & Location */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Info */}
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-8">
                Direct Contact
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">E-Mail</h3>
                    <p className="text-white/70">
                      <a href="mailto:info@pepearts.de" className="hover:text-white transition-colors">
                        info@pepearts.de
                      </a>
                    </p>
                    <p className="text-sm text-white/60 mt-1">Response within 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">WhatsApp</h3>
                    <p className="text-white/70">
                      <a href="https://wa.me/491796990707?text=Hello%2C%20I%20have%20a%20question%20about%20Pepe%20Dome." target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        +49 179 699 0707
                      </a>
                    </p>
                    <p className="text-sm text-white/60 mt-1">12-21h on weekdays</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📱</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Social Media</h3>
                    <div className="space-y-1">
                      <p className="text-white/70">
                        <a href="https://instagram.com/pepe_arts" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                          @pepe_arts (Instagram)
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 p-6 rounded-xl bg-orange-500/10 border border-orange-400/20">
                <h3 className="display text-lg font-semibold mb-2 flex items-center gap-2">
                  <span className="text-xl">⚡</span>
                  Urgent Inquiries During Events
                </h3>
                <p className="text-white/70 mb-2">
                  For urgent inquiries during events:
                </p>
                <p className="text-white font-mono">
                  <a href="https://wa.me/4915904891419?text=Urgent%20inquiry%20regarding%20event%3A%20" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    WhatsApp: +49 159 048 914 19
                  </a>
                </p>
                <p className="text-sm text-white/60 mt-1">Quick response during events</p>
              </div>
            </div>

            {/* Location & Directions */}
            <div>
              <h2 className="display text-3xl md:text-4xl font-bold mb-8">
                Location & Directions
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Address</h3>
                    <p className="text-white/70">
                      Pepe Dome<br />
                      Ostpark<br />
                      81925 Munich
                    </p>
                    <p className="text-sm text-white/60 mt-2">
                      <a
                        href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors underline"
                      >
                        🗺️ Open in Google Maps
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚇</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Public Transport</h3>
                    <div className="text-white/70 space-y-1">
                      <p>• Subway to Quiddestraße</p>
                      <p>• Entrance via Albert-Schweitzer-Straße</p>
                    </div>
                    <p className="text-sm text-white/60 mt-2">Short walk to Pepe Dome</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🚗</span>
                  </div>
                  <div>
                    <h3 className="display text-lg font-semibold mb-2">Parking</h3>
                    <div className="text-white/70 space-y-1">
                      <p>• Michaeligarten + 15 minutes walk</p>
                      <p>• Parking usually available</p>
                    </div>
                    <p className="text-sm text-white/60 mt-2">For events: Arrive early recommended</p>
                  </div>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="mt-8 p-6 rounded-xl bg-black/20 border border-white/10">
                <h3 className="display text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-xl">🕐</span>
                  Opening Hours
                </h3>
                <div className="space-y-2 text-white/70">
                  <div className="flex justify-between">
                    <span>Weekdays:</span>
                    <span>12:00-21:00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Weekend:</span>
                    <Link href="/en/veranstaltungen" className="text-yellow-400 hover:text-yellow-300 transition-colors underline">
                      see events
                    </Link>
                  </div>
                </div>
                <p className="text-sm text-white/60 mt-3">
                  Weekend hours depend on events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-black/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="display text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-white/80">
              The most important answers at a glance
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Can I visit Pepe Dome?
              </h3>
              <p className="text-white/70">
                Yes! We&apos;re happy to show you our location. Simply arrange an appointment
                with us via the contact form or by phone.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                How far in advance do I need to book events?
              </h3>
              <p className="text-white/70">
                For corporate events we recommend at least 4-6 weeks lead time.
                Private events can often be organized at shorter notice.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                Is Pepe Dome barrier-free?
              </h3>
              <p className="text-white/70">
                Yes, Pepe Dome is fully accessible. We have
                appropriate restroom facilities and can accommodate special needs.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/20 border border-white/10">
              <h3 className="display text-lg font-semibold mb-2">
                What catering options are available?
              </h3>
              <p className="text-white/70">
                We work with selected local catering partners and can
                offer various options from finger food to full menus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="display text-4xl md:text-5xl font-bold mb-6">
            Subscribe to Newsletter
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Stay informed about new events, training offers and news from Pepe Dome
          </p>

          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/50"
              />
              <a href="mailto:info@pepearts.de?subject=Newsletter Signup&body=Hello, I would like to subscribe to the Pepe Dome newsletter." className="btn-primary px-6 py-3 whitespace-nowrap block text-center">
                Subscribe
              </a>
            </div>
            <p className="text-sm text-white/60 mt-3">
              Unsubscribe anytime. No spam, promised!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}