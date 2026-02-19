// /src/types.ts
export type Locale = "en" | "ar";

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "ar";
}

export type Emirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Fujairah"
  | "Ras Al Khaimah"
  | "Umm Al Quwain";

export const EMIRATES: Emirate[] = [
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Fujairah",
  "Ras Al Khaimah",
  "Umm Al Quwain"
];

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
  titleKey: string;
  descKey: string;
  icon: string;
  goal: number;
};

export type Submission = {
  id: string;
  name: string;
  emirate: Emirate;
  googleMapsUrl: string;
  why: string;
  photogenic: boolean;
  budget: Budget;
  createdAt: string;
};

/**
 * NOTE:
 * Your pages are using `totalPoints`, so that is the canonical field.
 * We also keep `points` optional for backward-compat if older code stored it.
 */
export type ProgressState = {
  unlockedGemIds: string[];
  totalPoints: number;
  earnedBadges: BadgeKey[];
  preferredLocale: Locale;
  submissions: Submission[];

  // backward-compat (optional)
  points?: number;
};
