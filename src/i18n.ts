// /src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";
import { loadProgress } from "./storage";

const preferred = (() => {
  try {
    return loadProgress().preferredLocale;
  } catch {
    return "en";
  }
})();

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar }
  },
  lng: preferred,
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
