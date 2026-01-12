"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Pepe Dome Info */}
          <div>
            <div className="display text-xl font-bold mb-4">
              Pepe Dome München
            </div>
            <p className="text-white/70 text-sm mb-4">
              Das Zuhause für Artistik & Kultur in München. Erlebe spektakuläre Events oder nutze den Dome für deine Veranstaltung.
            </p>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Ostpark München</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:info@pepearts.de" className="hover:text-white transition-colors">
                  info@pepearts.de
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="display text-lg font-semibold mb-4">Navigation</h3>
            <nav className="space-y-2">
              <Link href="/" className="block text-white/70 hover:text-white transition-colors text-sm">
                Startseite
              </Link>
              <Link href="/veranstaltungen" className="block text-white/70 hover:text-white transition-colors text-sm">
                Events
              </Link>
              <Link href="/freeman" className="block text-white/70 hover:text-white transition-colors text-sm">
                Freeman Festival
              </Link>
              <Link href="/training" className="block text-white/70 hover:text-white transition-colors text-sm">
                Training
              </Link>
              <Link href="/business" className="block text-white/70 hover:text-white transition-colors text-sm">
                Business
              </Link>
              <Link href="/kontakt" className="block text-white/70 hover:text-white transition-colors text-sm">
                Kontakt
              </Link>
            </nav>
          </div>

          {/* Events */}
          <div>
            <h3 className="display text-lg font-semibold mb-4">Events</h3>
            <nav className="space-y-2">
              <div className="text-white/70 text-sm mb-3">
                <span className="font-semibold">❄️ Winterpause bis März</span>
              </div>
              <div className="text-white/60 text-xs mb-3">
                Wir machen eine kleine Pause und sind ab März wieder mit spannenden Veranstaltungen für euch da!
              </div>
              <Link href="/veranstaltungen" className="inline-block text-yellow-400 hover:text-yellow-300 transition-colors text-sm mt-2">
                Alle Events ansehen →
              </Link>
            </nav>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="display text-lg font-semibold mb-4">Rechtliches</h3>
            <nav className="space-y-2 mb-4">
              <Link href="/impressum" className="block text-white/70 hover:text-white transition-colors text-sm">
                Impressum
              </Link>
              <Link href="/datenschutz" className="block text-white/70 hover:text-white transition-colors text-sm">
                Datenschutz
              </Link>
            </nav>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-xs">
                © 2025 Pepe Dome München
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-xs">
              <Link href="/impressum" className="text-white/60 hover:text-white transition-colors">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-white/60 hover:text-white transition-colors">
                Datenschutz
              </Link>
              <a
                href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
              >
                🗺️ Anfahrt
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}