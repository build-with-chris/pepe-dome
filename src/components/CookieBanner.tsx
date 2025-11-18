"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 transform translate-y-0 transition-transform duration-300 ease-out">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 md:p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="text-white font-semibold text-sm md:text-base">
                  Cookies & Datenschutz
                </h3>
              </div>
              <p className="text-white/70 text-xs md:text-sm leading-relaxed">
                Wir verwenden nur technisch notwendige Cookies, die für die Funktionalität der Website erforderlich sind. 
                Wir nutzen kein Tracking oder Werbe-Cookies. Durch die Nutzung unserer Website stimmen Sie der Verwendung 
                dieser Cookies zu. Weitere Informationen finden Sie in unserer{' '}
                <Link 
                  href="/datenschutz" 
                  className="text-white/90 hover:text-white underline transition-colors"
                >
                  Datenschutzerklärung
                </Link>.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={acceptCookies}
                className="btn-primary px-6 py-2.5 text-sm font-semibold whitespace-nowrap flex-shrink-0"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

