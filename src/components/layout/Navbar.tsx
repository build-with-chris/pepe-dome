'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useUser, UserButton } from '@clerk/nextjs'
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
 * (News, Business) wandern ins "Mehr"-Dropdown.
 */
function useNavigation(lang: Locale) {
  const { t } = useTranslation()
  return {
    main: [
      { label: t('navigation.events', 'Events'),     href: localizedHref(lang, '/events') },
      { label: t('navigation.training', 'Training'), href: localizedHref(lang, '/training') },
      { label: t('navigation.about', 'Über uns'),    href: localizedHref(lang, '/about') },
      { label: t('navigation.contact', 'Kontakt'),   href: localizedHref(lang, '/contact') },
    ],
    more: [
      { label: t('navigation.news', 'News'),         href: localizedHref(lang, '/news') },
      { label: t('navigation.business', 'Business'), href: localizedHref(lang, '/business') },
    ],
    moreLabel: t('navigation.more', 'Mehr'),
  }
}

// When true, Clerk is disabled in dev so you can browse the frontend without login
const clerkDisabled = process.env.NEXT_PUBLIC_DISABLE_CLERK_IN_DEV === 'true'

function NavbarContent({
  isSignedIn,
  isLoaded,
  pathname,
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: {
  isSignedIn: boolean
  isLoaded: boolean
  pathname: string | null
  isScrolled: boolean
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (v: boolean) => void
}) {
  const showAuth = !clerkDisabled
  const { t } = useTranslation()
  const lang: Locale = localeFromPathname(pathname) ?? 'de'
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
                          ? 'text-[var(--pepe-gold)] font-semibold'
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
            {showAuth && isLoaded && isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/admin"
                  className={`nav-link text-sm ${
                    pathname?.startsWith('/admin') ? 'active' : ''
                  }`}
                >
                  Admin
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-[#1A1A1A] border border-[#333]",
                      userButtonPopoverActionButton: "text-white hover:bg-white/10",
                      userButtonPopoverActionButtonText: "text-white",
                      userButtonPopoverFooter: "hidden",
                    }
                  }}
                />
              </div>
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
                {showAuth && isLoaded && isSignedIn && (
                  <Link
                    href="/admin"
                    className={`mobile-menu-link ${pathname?.startsWith('/admin') ? 'active' : ''}`}
                    style={{ color: '#016dca' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </nav>
              {showAuth && isLoaded && isSignedIn && (
                <div className="mobile-menu-cta">
                  <div className="flex items-center justify-center gap-4">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function NavbarWithClerk() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <NavbarContent
      isSignedIn={!!isSignedIn}
      isLoaded={!!isLoaded}
      pathname={pathname ?? null}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    />
  )
}

function NavbarWithoutClerk() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <NavbarContent
      isSignedIn={false}
      isLoaded={true}
      pathname={pathname ?? null}
      isScrolled={isScrolled}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
    />
  )
}

export default function Navbar() {
  return clerkDisabled ? <NavbarWithoutClerk /> : <NavbarWithClerk />
}
