// /src/rtl.ts
import type { Locale } from "./types";

export function applyLocaleToDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}
