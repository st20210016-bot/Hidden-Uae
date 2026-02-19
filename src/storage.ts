// /src/storage.ts
import type { BadgeKey, Locale } from "./types";

const KEY = "hidden-uae:v1";

export type Submission = {
  id: string;
  name: string;
  emirate: string;
  mapsLink: string;
  why: string;
  photogenic: boolean;
  budget: "free" | "low" | "mid";
  createdAt: number;
};

export type ProgressState = {
  unlockedGemIds: string[];
  totalPoints: number;
  earnedBadges: BadgeKey[];
  preferredLocale: Locale;
  submissions: Submission[];
};

const DEFAULT: ProgressState = {
  unlockedGemIds: [],
  totalPoints: 0,
  earnedBadges: [],
  preferredLocale: "en",
  submissions: []
};

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...DEFAULT,
      ...parsed,
      unlockedGemIds: Array.isArray(parsed.unlockedGemIds) ? parsed.unlockedGemIds : [],
      earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : [],
      submissions: Array.isArray(parsed.submissions) ? parsed.submissions : []
    };
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(next: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function setPreferredLocale(locale: Locale) {
  const p = loadProgress();
  p.preferredLocale = locale;
  saveProgress(p);
}

export function addSubmission(sub: Submission) {
  const p = loadProgress();
  p.submissions = [sub, ...p.submissions];
  saveProgress(p);
}
