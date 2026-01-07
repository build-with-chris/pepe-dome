/**
 * Footer component matching PEPE Shows design
 * 3-column layout: Brand | Navigation columns | Contact
 */

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import SignupForm from '@/components/newsletter/SignupForm'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="stage-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <img
              src="/PEPE_logos_dome.svg"
              alt="Pepe Dome Logo"
              style={{ height: '96px', width: 'auto', marginBottom: '1.5rem' }}
            />

            {/* Instagram */}
            <div className="mb-8">
              <a
                href="https://www.instagram.com/pepe_arts/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link inline-flex"
                style={{
                  gap: '0.5rem',
                  alignItems: 'baseline'
                }}
              >
                <Instagram
                  style={{
                    width: '0.875rem',
                    height: '0.875rem',
                    color: '#016dca',
                    flexShrink: 0
                  }}
                />
                <span>@pepe_arts</span>
              </a>
            </div>

            {/* Newsletter */}
            <div className="footer-newsletter">
              <h4 className="footer-newsletter-title">Newsletter</h4>
              <SignupForm
                variant="simple"
                contextMessage="Bleib auf dem Laufenden mit News zu Events, Shows und Workshops."
              />
            </div>
          </div>

          {/* Main Links */}
          <div className="footer-links">
            <div className="footer-group">
              <h4 className="footer-title">Navigation</h4>
              <div className="footer-link-group">
                <Link href="/events" className="footer-link">Events</Link>
                <Link href="/news" className="footer-link">News</Link>
                <Link href="/newsletter" className="footer-link">Newsletter</Link>
                <Link href="/about" className="footer-link">Über uns</Link>
              </div>
            </div>

            <div className="footer-group">
              <h4 className="footer-title">PEPE Ecosystem</h4>
              <div className="footer-link-group">
                <a href="https://pepeshows.de" target="_blank" rel="noopener noreferrer" className="footer-link">
                  PEPE Shows
                </a>
                <a href="https://pepearts.de" target="_blank" rel="noopener noreferrer" className="footer-link">
                  PEPE Arts
                </a>
                <Link href="/contact" className="footer-link">Kontakt</Link>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-group">
            <h4 className="footer-title">Kontakt</h4>
            <div className="footer-link-group">
              <a href="mailto:info@pepearts.de" className="footer-link">
                info@pepearts.de
              </a>
              <a href="tel:+491796990707" className="footer-link">
                +49 179 699 0707
              </a>
              <div className="footer-link">
                PEPE Arts
              </div>
              <div className="footer-link">
                Ostpark
              </div>
              <div className="footer-link">
                81925 München
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} PEPE Dome. Alle Rechte vorbehalten.
          </p>
          <div className="footer-legal">
            <Link href="/impressum" className="footer-legal-link">Impressum</Link>
            <Link href="/datenschutz" className="footer-legal-link">Datenschutz</Link>
            <Link href="/agb" className="footer-legal-link">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
