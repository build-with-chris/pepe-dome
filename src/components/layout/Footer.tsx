import Link from 'next/link'
import Image from 'next/image'
import { getFooterContent, getSiteContent } from '@/lib/data'
import NewsletterSignup from '@/components/newsletter/NewsletterSignup'

export default function Footer() {
  const footer = getFooterContent()
  const site = getSiteContent()

  return (
    <footer className="footer">
      <div className="stage-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="h3 mb-6">{site.name}</h3>
            <p className="body-sm text-pepe-t64 mb-8">
              {footer.about}
            </p>

            <div className="space-y-2 text-sm text-pepe-t64 mb-8">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span>{site.address.street}, {site.address.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📧</span>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-pepe-white transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <NewsletterSignup compact />
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <div className="footer-group">
              <h4 className="footer-title">{footer.quickLinks.title}</h4>
              <div className="footer-link-group">
                {footer.quickLinks.links.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="footer-group">
              <h4 className="footer-title">{footer.legal.title}</h4>
              <div className="footer-link-group">
                {footer.legal.links.map((link) => (
                  <Link key={link.href} href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="footer-group">
            <h4 className="footer-title">{footer.support.title}</h4>
            <div className="space-y-4">
              {footer.support.logos.map((logo) => (
                <div key={logo.name} className="opacity-70 hover:opacity-100 transition-opacity">
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={200}
                    height={60}
                    className="h-12 w-auto object-contain invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">{footer.copyright}</p>
          <div className="footer-legal">
            {footer.legal.links.map((link) => (
              <Link key={link.href} href={link.href} className="footer-legal-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
