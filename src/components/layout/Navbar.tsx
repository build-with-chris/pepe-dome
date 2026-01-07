'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'

const navigation = [
  { label: "Events", href: "/events" },
  { label: "Training", href: "/training" },
  { label: "Business", href: "/business" },
  { label: "News", href: "/news" },
  { label: "Über uns", href: "/about" },
  { label: "Kontakt", href: "/contact" }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <nav
      className={`nav transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-black/90' : 'bg-transparent'
      }`}
    >
      <div className="stage-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-brand">
            <Link href="/" className="nav-brand-link">
              <img
                src="/PEPE_logos_dome.svg"
                alt="Pepe Dome Logo"
                className="nav-logo-svg"
                style={{ height: '64px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {/* Auth Section */}
            {isLoaded && isSignedIn ? (
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
            ) : isLoaded ? (
              <SignInButton mode="modal">
                <button className="nav-link text-sm">
                  Login
                </button>
              </SignInButton>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu öffnen"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <Link href="/" className="nav-brand-link" onClick={() => setIsMobileMenuOpen(false)}>
                <img
                  src="/PEPE_logos_dome.svg"
                  alt="Pepe Dome Logo"
                  style={{ height: '40px', width: 'auto' }}
                />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mobile-menu-close"
                aria-label="Menu schließen"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mobile-menu-body">
              <nav className="mobile-menu-nav">
                {navigation.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`mobile-menu-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Auth links for mobile */}
                {isLoaded && isSignedIn ? (
                  <Link
                    href="/admin"
                    className={`mobile-menu-link ${pathname?.startsWith('/admin') ? 'active' : ''}`}
                    style={{ color: '#016dca' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                ) : isLoaded ? (
                  <SignInButton mode="modal">
                    <button
                      className="mobile-menu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </button>
                  </SignInButton>
                ) : null}
              </nav>

              {isLoaded && isSignedIn && (
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
