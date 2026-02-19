// /src/rtl.ts
import type { Locale } from "./types";

export function applyLocaleToDocument(locale: Locale) {
  const dir = locale === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = locale;
  document.documentElement.dir = dir;

  // Optional: helpful for styling
  document.documentElement.dataset.locale = locale;
  document.documentElement.dataset.dir = dir;
}
