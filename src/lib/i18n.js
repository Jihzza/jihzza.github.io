import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true, // Turn off in production
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    // You will add your resources (translation files) here later
    // resources: { en: { translation: ... } }
  });

export default i18n;