"use client";
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../lib/i18n';

interface I18nProviderProps {
  children: React.ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set initial html lang attribute
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <>{children}</>;
}