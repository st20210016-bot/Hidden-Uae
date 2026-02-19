// /src/types.ts
export type Locale = "en" | "ar";
export const isLocale = (v: string): v is Locale => v === "en" || v === "ar";

export const EMIRATES = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Fujairah",
  "Ras Al Khaimah",
  "Umm Al Quwain"
] as const;

export type Emirate = (typeof EMIRATES)[number];
export type Budget = "free" | "low" | "mid";

export type Gem = {
  id: string;
  name_en: string;
  name_ar: string;
  emirate: Emirate;
  area_en: string;
  area_ar: string;
  budget: Budget;
  photogenic: boolean;
  category: string;
  coords: { lat: number; lng: number };
  description_en: string;
  description_ar: string;
  images: string[];
  google_maps_url?: string;
  tags: string[];
};

export type BadgeKey =
  | "first_unlock"
  | "explorer"
  | "adventurer"
  | "photographer"
  | "emirate_specialist";

export type Badge = {
  key: BadgeKey;
  titleKey: string; // i18n key
  descKey: string;  // i18n key
  icon: string;
};
