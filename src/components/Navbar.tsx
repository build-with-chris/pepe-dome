'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [show, setShow] = useState(true)
  const [lastY, setLastY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      // Always show near top
      if (y < 8) {
        setShow(true)
      } else {
        // Show on scroll up
        if (y < lastY - 2) setShow(true)
        // Hide on scroll down
        if (y > lastY + 6) setShow(false)
      }
      setLastY(y)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastY])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/veranstaltungen', label: 'Events' },
    { href: '/training', label: 'Training' },
    { href: '/business', label: 'Business' },
    { href: '/freeman', label: 'Freeman Festival' },
    { href: '/ueber', label: 'Über uns' },
    { href: '/kontakt', label: 'Kontakt' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full h-20 z-50 transition-transform duration-300 ${
          show ? 'translate-y-0' : '-translate-y-full'
        } bg-black/90 backdrop-blur-lg border-b border-pepe-line`}
      >
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl font-bold font-display text-pepe-gold">
              Pepe Dome
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-pepe-gold'
                    : 'text-pepe-t80 hover:text-pepe-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 text-pepe-white hover:text-pepe-gold transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-20">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute right-0 top-20 h-[calc(100%-5rem)] w-[85%] max-w-sm bg-pepe-ink border-l border-pepe-line shadow-xl">
            <div className="flex flex-col p-6 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg border transition-all ${
                    pathname === link.href
                      ? 'border-pepe-gold bg-pepe-gold/10 text-pepe-gold'
                      : 'border-pepe-line bg-pepe-surface/50 text-pepe-t80 hover:border-pepe-gold hover:text-pepe-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
