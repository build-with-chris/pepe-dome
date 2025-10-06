"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

interface NavigationProps {
  currentPage?: 'home' | 'veranstaltungen' | 'freeman' | 'training' | 'business' | 'ueber' | 'kontakt' | 'impressum' | 'datenschutz';
}

export default function Navigation({ currentPage = 'home' }: NavigationProps) {
  const { t, i18n } = useTranslation('common');
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

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
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
          <Image
            src="/PepeDome Logo ausgeschnitten.png"
            alt="Pepe Dome Logo"
            width={240}
            height={80}
            className="h-16 w-auto nav-logo-white"
          />
        </Link>

        <div className="nav-links">
          <Link
            href="/veranstaltungen"
            className={`nav-link ${currentPage === 'veranstaltungen' ? 'nav-link-active' : ''}`}
          >
            {t('navigation.events')}
          </Link>
          <Link
            href="/training"
            className={`nav-link ${currentPage === 'training' ? 'nav-link-active' : ''}`}
          >
            {t('navigation.training')}
          </Link>
          <Link
            href="/business"
            className={`nav-link ${currentPage === 'business' ? 'nav-link-active' : ''}`}
          >
            {t('navigation.business')}
          </Link>
          <Link
            href="/ueber"
            className={`nav-link ${currentPage === 'ueber' ? 'nav-link-active' : ''}`}
          >
            {t('navigation.about')}
          </Link>
          <Link
            href="/kontakt"
            className={`nav-link ${currentPage === 'kontakt' ? 'nav-link-active' : ''}`}
          >
            {t('navigation.contact')}
          </Link>
          <Link
            href="/freeman"
            className="btn-primary btn-sm"
          >
            {t('navigation.freeman')}
          </Link>

          {/* Language Switcher */}
          <div className="relative group">
            <button className="nav-link flex items-center gap-1">
              <span>🌐</span>
              <span className="text-xs">{i18n.language.toUpperCase()}</span>
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <button
                onClick={() => changeLanguage('de')}
                className={`block w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10 transition-colors ${i18n.language === 'de' ? 'text-white font-semibold' : 'text-white/70'}`}
              >
                Deutsch
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`block w-full text-left px-3 py-2 rounded text-sm hover:bg-white/10 transition-colors ${i18n.language === 'en' ? 'text-white font-semibold' : 'text-white/70'}`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className="mobile-menu-button md:hidden"
          aria-label={t('navigation.menuToggle')}
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
              {t('navigation.home')}
            </Link>
            <Link
              href="/veranstaltungen"
              className={`nav-mobile-link ${currentPage === 'veranstaltungen' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              {t('navigation.events')}
            </Link>
            <Link
              href="/training"
              className={`nav-mobile-link ${currentPage === 'training' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              {t('navigation.training')}
            </Link>
            <Link
              href="/business"
              className={`nav-mobile-link ${currentPage === 'business' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              {t('navigation.business')}
            </Link>
            <Link
              href="/ueber"
              className={`nav-mobile-link ${currentPage === 'ueber' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              {t('navigation.about')}
            </Link>
            <Link
              href="/kontakt"
              className={`nav-mobile-link ${currentPage === 'kontakt' ? 'nav-mobile-link-active' : ''}`}
              onClick={closeMenu}
            >
              {t('navigation.contact')}
            </Link>
            <Link
              href="/freeman"
              className="btn-primary"
              onClick={closeMenu}
            >
              {t('navigation.freeman')}
            </Link>

            {/* Mobile Language Switcher */}
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="text-white/70 text-sm mb-3 px-2">{t('common.language')}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    changeLanguage('de');
                    closeMenu();
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                    i18n.language === 'de'
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {t('common.german')}
                </button>
                <button
                  onClick={() => {
                    changeLanguage('en');
                    closeMenu();
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                    i18n.language === 'en'
                      ? 'bg-white/20 border-white/40 text-white'
                      : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {t('common.english')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}