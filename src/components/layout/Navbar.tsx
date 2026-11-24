'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import NewsletterInline from '@/components/newsletter/NewsletterInline'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { LOCALES, localizedHref, type Locale } from '@/i18n/config'

/**
 * Liest die aktuelle Locale aus dem URL-Pfad ('/en/training' → 'en').
 * Auf nicht-lokalisierten Pfaden (z.B. /admin) → null, dann nutzen wir
 * den DEFAULT_LOCALE-Fallback in localizedHref().
 */
function localeFromPathname(pathname: string | null): Locale | null {
  const seg = pathname?.split('/')[1] ?? ''
  return (LOCALES as readonly string[]).includes(seg) ? (seg as Locale) : null
}

/**
 * Hauptnavigation schlank halten: die Kern-Reise (Events besuchen,
 * trainieren, wer wir sind, Kontakt) bleibt oben — sekundäre Ziele
 * (News, Galerie) wandern ins "Mehr"-Dropdown.
 */
function useNavigation(lang: Locale) {
  const t = usePageT(lang)
  return {
    main: [
      { label: t('navigation.events', 'Events'),     href: localizedHref(lang, '/events') },
      { label: t('navigation.training', 'Training'), href: localizedHref(lang, '/training') },
      { label: t('navigation.cafe', 'Café'),         href: localizedHref(lang, '/cafe') },
      { label: t('navigation.about', 'Über uns'),    href: localizedHref(lang, '/about') },
      { label: t('navigation.contact', 'Kontakt'),   href: localizedHref(lang, '/contact') },
    ],
    more: [
      { label: t('navigation.gallery', 'Galerie'),   href: localizedHref(lang, '/galerie') },
      { label: t('navigation.news', 'News'),         href: localizedHref(lang, '/news') },
      // Stand frueher nur klein in der Fusszeile und wurde kaum gefunden.
      { label: t('navigation.donate', 'Unterstützen'), href: localizedHref(lang, '/spenden') },
    ],
    moreLabel: t('navigation.more', 'Mehr'),
  }
}

/**
 * Übersetzungen in der Sprache der Seite, nicht in der des Browsers.
 *
 * `useTranslation().t` nimmt die Sprache, die i18next gerade hält, und die
 * kommt beim ersten Rendern aus dem localStorage bzw. auf dem Server immer
 * als Deutsch. Folge: /en wurde mit deutscher Navigation ausgeliefert
 * ("Über uns", "Kontakt") und sprang erst nach dem Laden um. Ein Crawler
 * ohne JavaScript sah die englische Seite mit deutschem Menü.
 *
 * Die Sprache steht im Pfad, also wird sie von dort genommen. useTranslation
 * bleibt, damit die Komponente bei einem Sprachwechsel neu rendert.
 */
function usePageT(lang: Locale) {
  const { i18n } = useTranslation()
  return i18n.getFixedT(lang)
}

/**
 * Ist jemand aus der Redaktion angemeldet?
 *
 * Früher beantwortete das Clerk selbst (useUser). Dafür musste jede
 * öffentliche Seite die Clerk-Bibliothek laden und bei Clerk nach einer
 * Sitzung fragen, bei jedem Besucher, nur um einer Handvoll Leute einen
 * Admin-Link zu zeigen.
 *
 * Clerk legt bei einer Anmeldung das Cookie `__client_uat` ab (je nach
 * Instanz mit Suffix): der Zeitpunkt der letzten Anmeldung, oder 0, wenn
 * niemand angemeldet ist. Das reicht als Hinweis, um den Link einzublenden.
 * Es ist kein Schutz und soll keiner sein: Den Zugang prüfen weiterhin die
 * Middleware und das Admin-Layout. Wer das Cookie von Hand setzt, sieht einen
 * Link und landet danach auf der Anmeldeseite.
 */
function hasAdminSessionCookie(): boolean {
  return document.cookie.split('; ').some((entry) => {
    const [name, value] = entry.split('=')
    return name.startsWith('__client_uat') && Boolean(value) && value !== '0'
  })
}
const subscribeNever = () => () => {}
function useAdminSessionHint(): boolean {
  // Auf dem Server und beim ersten Rendern im Browser immer false, damit das
  // vorgerenderte HTML für alle gleich ist.
  return useSyncExternalStore(subscribeNever, hasAdminSessionCookie, () => false)
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isSignedIn = useAdminSessionHint()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const lang: Locale = localeFromPathname(pathname) ?? 'de'
  const t = usePageT(lang)
  const navigation = useNavigation(lang)
  const homeHref = localizedHref(lang, '/')

  // "Mehr"-Dropdown: state-basiert (Klick/Touch) + CSS-Hover für Maus.
  // focus-within reicht nicht — WebKit fokussiert Buttons beim Klick nicht.
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  useEffect(() => {
    setIsMoreOpen(false)
  }, [pathname])
  return (
    <nav
      className={`nav transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-black/90' : 'bg-transparent'
      }`}
    >
      <div className="stage-container">
        <div className="nav-content">
          <div className="nav-brand">
            <Link href={homeHref} className="nav-brand-link">
              <img
                src="/PEPE_logos_dome.svg"
                alt="Pepe Dome Logo"
                className="nav-logo-svg"
                style={{ height: '64px', width: 'auto' }}
              />
            </Link>
          </div>
          <div className="nav-links">
            {navigation.main.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            {/* "Mehr"-Dropdown (Klick/Touch via State, Maus zusätzlich via Hover) */}
            <div className="relative group">
              {isMoreOpen && (
                <div
                  className="fixed inset-0 z-40"
                  aria-hidden="true"
                  onClick={() => setIsMoreOpen(false)}
                />
              )}
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`nav-link relative z-50 flex items-center gap-1 ${
                  navigation.more.some((l) => pathname === l.href) ? 'active' : ''
                }`}
                aria-haspopup="true"
                aria-expanded={isMoreOpen}
              >
                {navigation.moreLabel}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-200 group-hover:rotate-180 ${isMoreOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute left-0 top-full pt-3 z-50 ${
                  isMoreOpen ? 'block' : 'hidden group-hover:block'
                }`}
              >
                <div className="min-w-[180px] rounded-xl border border-white/10 bg-black/95 backdrop-blur-md py-2 shadow-[0_12px_32px_rgba(0,0,0,0.5)]">
                  {navigation.more.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMoreOpen(false)}
                      className={`block px-5 py-2.5 text-sm transition-colors ${
                        pathname === link.href
                          ? 'text-[var(--pepe-accent-text)] font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="nav-actions">
            {isSignedIn ? (
              <>
                <Link href="/admin" className="nav-link text-sm">
                  Admin
                </Link>
                <LanguageSwitcher variant="compact" />
              </>
            ) : (
              <>
                <NewsletterInline />
                <LanguageSwitcher variant="compact" />
              </>
            )}
          </div>
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('navigation.menuToggle', 'Menü öffnen')}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <Link href={homeHref} className="nav-brand-link" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/PEPE_logos_dome.svg"
                  alt="Pepe Dome Logo"
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
              <div className="flex items-center gap-3">
                <LanguageSwitcher variant="compact" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-menu-close"
                  aria-label={t('navigation.closeMenu', 'Menü schließen')}
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mobile-menu-body">
              <nav className="mobile-menu-nav">
                {navigation.main.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mobile-menu-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-white/10" aria-hidden="true" />
                {navigation.more.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mobile-menu-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {isSignedIn && (
                  <Link
                    href="/admin"
                    className="mobile-menu-link"
                    style={{ color: '#016dca' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
