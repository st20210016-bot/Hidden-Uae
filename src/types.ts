// /src/types.ts
export type Emirate =
  | "Dubai"
  | "Abu Dhabi"
  | "Sharjah"
  | "Ajman"
  | "Fujairah"
  | "Ras Al Khaimah"
  | "Umm Al Quwain";

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
