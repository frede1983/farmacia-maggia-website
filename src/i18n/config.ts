import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import itTranslations from './locales/it/translation.json';
import deTranslations from './locales/de/translation.json';
import frTranslations from './locales/fr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      it: {
        translation: itTranslations,
      },
      de: {
        translation: deTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    fallbackLng: 'it',
    supportedLngs: ['it', 'de', 'fr'],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
