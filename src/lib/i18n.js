// src/lib/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      'pt': ['pt-PT', 'en'], 
      'default': ['en']
    },
    
    debug: process.env.NODE_ENV === 'development',

    // --- SOLUTION IS HERE ---
    // Add 'pt' to the list of supported languages.
    supportedLngs: ['en', 'es', 'pt', 'pt-PT', 'pt-BR'],

    interpolation: {
      escapeValue: false, 
    },

    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;