// /src/storage.ts
import type { BadgeKey, Locale, ProgressState, Submission } from "./types";

const KEY = "hiddenUAE:progress";

const DEFAULT_STATE: ProgressState = {
  unlockedGemIds: [],
  points: 0,
  earnedBadges: [],
  preferredLocale: "en",
  submissions: []
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadProgress(): ProgressState {
  const parsed = safeParse<Partial<ProgressState>>(localStorage.getItem(KEY));
  if (!parsed) return { ...DEFAULT_STATE };

  return {
    unlockedGemIds: Array.isArray(parsed.unlockedGemIds)
      ? parsed.unlockedGemIds.filter((x): x is string => typeof x === "string")
      : [],
    points: typeof parsed.points === "number" ? parsed.points : 0,
    earnedBadges: Array.isArray(parsed.earnedBadges)
      ? (parsed.earnedBadges.filter((x) => typeof x === "string") as BadgeKey[])
      : [],
    preferredLocale: parsed.preferredLocale === "ar" ? "ar" : "en",
    submissions: Array.isArray(parsed.submissions)
      ? (parsed.submissions as Submission[])
      : []
  };
}

export function saveProgress(next: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function setPreferredLocale(locale: Locale) {
  const s = loadProgress();
  saveProgress({ ...s, preferredLocale: locale });
}

export function addSubmission(submission: Submission) {
  const s = loadProgress();
  const next: ProgressState = { ...s, submissions: [submission, ...(s.submissions ?? [])] };
  saveProgress(next);
}

export function getSubmissions(): Submission[] {
  return loadProgress().submissions ?? [];
}
