"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface NavigationProps {
  currentPage?: 'home' | 'veranstaltungen' | 'freeman' | 'training' | 'business' | 'ueber' | 'kontakt';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    const newState = !isMenuOpen;
    setIsMenuOpen(newState);

    // Prevent body scroll when mobile menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link
          href="/"
          className="nav-logo"
          onClick={closeMenu}
        >
          🏛️ Pepe Dome
        </Link>

        <div className="nav-links">
          <Link
            href="/veranstaltungen"
            className={`nav-link ${currentPage === 'veranstaltungen' ? 'nav-link-active' : ''}`}
          >
            Events
          </Link>
          <Link
            href="/training"
            className={`nav-link ${currentPage === 'training' ? 'nav-link-active' : ''}`}
          >
            Training
          </Link>
          <Link
            href="/business"
            className={`nav-link ${currentPage === 'business' ? 'nav-link-active' : ''}`}
          >
            Business
          </Link>
          <Link
            href="/ueber"
            className={`nav-link ${currentPage === 'ueber' ? 'nav-link-active' : ''}`}
          >
            Über uns
          </Link>
          <Link
            href="/kontakt"
            className={`nav-link ${currentPage === 'kontakt' ? 'nav-link-active' : ''}`}
          >
            Kontakt
          </Link>
          <Link
            href="/freeman"
            className="btn-primary btn-sm"
          >
            Freeman Festival
          </Link>
        </div>

        <button
          onClick={toggleMenu}
          className="mobile-menu-button md:hidden"
          aria-label="Menü öffnen/schließen"
        >
          <div className={`hamburger ${isMenuOpen ? 'hamburger-open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="nav-mobile" onClick={closeMenu}>
          <div className="nav-mobile-links" onClick={(e) => e.stopPropagation()}>
            <Link
              href="/"
              className={`nav-mobile-link ${currentPage === 'home' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Start
            </Link>
            <Link
              href="/veranstaltungen"
              className={`nav-mobile-link ${currentPage === 'veranstaltungen' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link
              href="/training"
              className={`nav-mobile-link ${currentPage === 'training' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Training
            </Link>
            <Link
              href="/business"
              className={`nav-mobile-link ${currentPage === 'business' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Business
            </Link>
            <Link
              href="/ueber"
              className={`nav-mobile-link ${currentPage === 'ueber' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Über uns
            </Link>
            <Link
              href="/kontakt"
              className={`nav-mobile-link ${currentPage === 'kontakt' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              Kontakt
            </Link>
            <Link
              href="/freeman"
              className="btn-primary"
              onClick={closeMenu}
            >
              Freeman Festival
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}