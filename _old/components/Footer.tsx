'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="stage-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="h3 mb-6">Pepe Dome München</h3>
            <p className="body-sm text-pepe-t64 mb-8">
              Das Zuhause für Artistik & Kultur in München. Erlebe spektakuläre Events oder
              nutze den Dome für deine Veranstaltung.
            </p>

            <div className="space-y-2 text-sm text-pepe-t64 mb-8">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>Ostpark München</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href="mailto:info@pepearts.de"
                  className="hover:text-pepe-white transition-colors"
                >
                  info@pepearts.de
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h4 className="footer-newsletter-title">Newsletter</h4>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Deine E-Mail"
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    Anmelden
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Main Links */}
          <div className="footer-links">
            <div className="footer-group">
              <h4 className="footer-title">Navigation</h4>
              <div className="footer-link-group">
                <Link href="/" className="footer-link">
                  Startseite
                </Link>
                <Link href="/veranstaltungen" className="footer-link">
                  Events
                </Link>
                <Link href="/training" className="footer-link">
                  Training
                </Link>
                <Link href="/business" className="footer-link">
                  Business
                </Link>
                <Link href="/freeman" className="footer-link">
                  Freeman Festival
                </Link>
                <Link href="/kontakt" className="footer-link">
                  Kontakt
                </Link>
              </div>
            </div>

            <div className="footer-group">
              <h4 className="footer-title">Nächste Events</h4>
              <div className="footer-link-group">
                <div className="text-pepe-t64 text-xs">
                  🎬 Circus meets Cinema
                  <br />
                  10.–11. Oktober 2025
                </div>
                <div className="text-pepe-t64 text-xs">
                  🎪 Freeman Festival
                  <br />
                  14.–16. November 2025
                </div>
                <Link href="/veranstaltungen" className="footer-link text-pepe-gold">
                  Alle Events ansehen →
                </Link>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="footer-group">
            <h4 className="footer-title">Rechtliches</h4>
            <div className="footer-link-group">
              <Link href="/impressum" className="footer-link">
                Impressum
              </Link>
              <Link href="/datenschutz" className="footer-link">
                Datenschutz
              </Link>
              <a
                href="https://maps.google.com/maps?q=Theatron+Ostpark+München"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                🗺️ Anfahrt
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">© 2025 Pepe Dome München</p>
          <div className="footer-legal">
            <Link href="/impressum" className="footer-legal-link">
              Impressum
            </Link>
            <Link href="/datenschutz" className="footer-legal-link">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
