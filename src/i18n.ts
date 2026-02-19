// /src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { loadProgress } from "./storage";

import en from "./en.json";
import ar from "./ar.json";

const saved = (() => {
  try {
    return loadProgress().preferredLocale;
  } catch {
    return "en";
  }
})();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar }
  },
  lng: saved,
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
