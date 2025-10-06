import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import deCommon from '../../public/locales/de/common.json';
import enCommon from '../../public/locales/en/common.json';

const resources = {
  de: {
    common: deCommon,
  },
  en: {
    common: enCommon,
  },
};

// Get saved language from localStorage or default to German
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('language');
    if (saved && ['de', 'en'].includes(saved)) {
      return saved;
    }
  }
  return 'de';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'de',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lng);
    document.documentElement.lang = lng;
  }
});

export default i18n;