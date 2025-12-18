/**
 * Footer component following PEPE Dome design system
 *
 * Features:
 * - Background: var(--pepe-ink)
 * - Multi-column layout (Logo, Navigation, Contact, Social)
 * - Social links
 * - Copyright notice
 * - Integrated newsletter signup
 */

import Link from 'next/link'
import Image from 'next/image'
import { getFooterContent, getSiteContent } from '@/lib/data'
import SignupForm from '@/components/newsletter/SignupForm'

export default function Footer() {
  const footer = getFooterContent()
  const site = getSiteContent()

  return (
    <footer className="bg-[var(--pepe-ink)] border-t border-[var(--pepe-line)]">
      <div className="stage-container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/PEPE_logos_dome.svg"
                alt="Pepe Dome Logo"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-[var(--pepe-t64)] mb-6 leading-relaxed">
              {footer.about}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-[var(--pepe-t64)]">
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[var(--pepe-gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>
                  {site.address.street}, {site.address.city}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-[var(--pepe-gold)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-[var(--pepe-white)] transition-colors"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--pepe-white)] uppercase tracking-wider mb-4">
              {footer.quickLinks.title}
            </h4>
            <ul className="space-y-3">
              {footer.quickLinks.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--pepe-t64)] hover:text-[var(--pepe-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--pepe-white)] uppercase tracking-wider mb-4">
              {footer.legal.title}
            </h4>
            <ul className="space-y-3">
              {footer.legal.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--pepe-t64)] hover:text-[var(--pepe-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Sponsors */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--pepe-white)] uppercase tracking-wider mb-4">
              {footer.support.title}
            </h4>
            <div className="space-y-4">
              {footer.support.logos.map((logo) => (
                <div
                  key={logo.name}
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src={logo.image}
                    alt={logo.name}
                    width={180}
                    height={50}
                    className="h-10 w-auto object-contain invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold text-[var(--pepe-white)] mb-4">
              Newsletter
            </h4>
            <SignupForm
              variant="simple"
              contextMessage="Bleib auf dem Laufenden mit News zu Events, Shows und Workshops."
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--pepe-line)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-xs text-[var(--pepe-t48)]">{footer.copyright}</p>

            {/* Social Links (if available) */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href="https://instagram.com/pepedome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--pepe-t48)] hover:text-[var(--pepe-gold)] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/pepedome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--pepe-t48)] hover:text-[var(--pepe-gold)] transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@pepedome"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--pepe-t48)] hover:text-[var(--pepe-gold)] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>

            {/* Legal Links - Bottom */}
            <div className="flex items-center gap-4 text-xs text-[var(--pepe-t48)]">
              {footer.legal.links.map((link, index) => (
                <span key={link.href} className="flex items-center gap-4">
                  <Link
                    href={link.href}
                    className="hover:text-[var(--pepe-gold)] transition-colors"
                  >
                    {link.label}
                  </Link>
                  {index < footer.legal.links.length - 1 && (
                    <span className="text-[var(--pepe-line)]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
